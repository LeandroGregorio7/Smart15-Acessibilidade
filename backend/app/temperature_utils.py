from __future__ import annotations

from typing import Any

import numpy as np
from rasterio.features import rasterize
from rasterio.warp import transform_geom
from rasterio.windows import Window
from shapely.geometry import mapping


def _unit_family(units: Any) -> str | None:
    if not isinstance(units, str):
        return None

    normalized = units.strip().lower().replace("°", "deg").replace(" ", "")
    if normalized in {"c", "degc", "celsius", "degree_celsius", "degrees_celsius"} or "celsius" in normalized:
        return "celsius"
    if normalized in {"k", "degk", "kelvin", "degree_kelvin", "degrees_kelvin"} or "kelvin" in normalized:
        return "kelvin"
    if normalized in {"f", "degf", "fahrenheit", "degree_fahrenheit", "degrees_fahrenheit"} or "fahrenheit" in normalized:
        return "fahrenheit"
    return None


def normalize_lst_to_celsius(
    values: Any,
    *,
    units: Any = None,
    scale: float = 1.0,
    offset: float = 0.0,
) -> np.ndarray:
    """Normalize a LST band to Celsius without silently clipping bad data.

    Explicit band units and GeoTIFF scale/offset metadata take precedence. For
    unlabelled rasters, common Celsius and Kelvin ranges are detected; Landsat
    Collection 2 ST_B10 integer DN values use the published scale/offset.
    Values outside a deliberately broad physical range are marked invalid.
    """
    raw = np.asarray(values, dtype=np.float64)
    result = np.full(raw.shape, np.nan, dtype=np.float64)
    finite = np.isfinite(raw)
    if not finite.any():
        return result

    scale_value = float(scale) if np.isfinite(scale) else 1.0
    offset_value = float(offset) if np.isfinite(offset) else 0.0
    has_scale_metadata = scale_value != 1.0 or offset_value != 0.0
    family = _unit_family(units)

    if family is not None:
        # Landsat ST_B10 can be stored as unscaled integer DN with no band
        # scale metadata. Do not apply this special case to explicitly labelled
        # Celsius/Fahrenheit imagery.
        if family == "kelvin" and not has_scale_metadata and np.nanpercentile(raw[finite], 95) > 1000:
            result[finite] = raw[finite] * 0.00341802 + 149.0 - 273.15
        else:
            physical = raw * scale_value + offset_value
            if family == "kelvin":
                result[finite] = physical[finite] - 273.15
            elif family == "fahrenheit":
                result[finite] = (physical[finite] - 32.0) * (5.0 / 9.0)
            else:
                result[finite] = physical[finite]
    else:
        physical = raw * scale_value + offset_value
        sample = physical[finite]
        median = float(np.nanmedian(sample))
        high = float(np.nanpercentile(sample, 95))

        if not has_scale_metadata and high > 1000:
            # Landsat Collection 2 Level-2 surface-temperature DN.
            result[finite] = raw[finite] * 0.00341802 + 149.0 - 273.15
        elif 180.0 <= median <= 360.0:
            # Unlabelled physical temperatures in Kelvin.
            result[finite] = physical[finite] - 273.15
        elif -100.0 <= median <= 100.0:
            # Synapse SR and many exported thermal GeoTIFFs store Celsius.
            result[finite] = physical[finite]
        else:
            return result

    plausible = np.isfinite(result) & (result >= -100.0) & (result <= 100.0)
    result[~plausible] = np.nan
    return result


def lst_band_metadata(src) -> tuple[Any, float, float]:
    """Return declared band units, scale and offset with tag fallbacks."""
    units = None
    try:
        units = (src.units or (None,))[0]
    except (AttributeError, IndexError, TypeError):
        pass
    if not units:
        band_tags = src.tags(1)
        units = next(
            (band_tags[key] for key in ("units", "UNIT", "UNITTYPE", "unit") if band_tags.get(key)),
            None,
        )

    scales = getattr(src, "scales", (1.0,)) or (1.0,)
    offsets = getattr(src, "offsets", (0.0,)) or (0.0,)
    scale = float(scales[0]) if scales else 1.0
    offset = float(offsets[0]) if offsets else 0.0
    return units, scale, offset


def temperature_raster_stats_celsius(
    src,
    study_polygon,
    *,
    tile_size: int = 512,
) -> dict[str, float | int | str] | None:
    """Calculate exact valid-pixel LST statistics inside a WGS84 study polygon.

    Reads fixed-size windows to keep memory bounded for large GeoTIFFs. The
    returned min/max/mean are in Celsius and exclude nodata and pixels outside
    the polygon.
    """
    if src.crs is None or src.width <= 0 or src.height <= 0:
        return None

    try:
        polygon_in_raster_crs = transform_geom(
            "EPSG:4326",
            src.crs,
            mapping(study_polygon),
            precision=-1,
        )
    except Exception:
        return None

    units, scale, offset = lst_band_metadata(src)
    nodata = src.nodata

    count = 0
    total = 0.0
    minimum = float("inf")
    maximum = float("-inf")

    for row in range(0, src.height, tile_size):
        height = min(tile_size, src.height - row)
        for col in range(0, src.width, tile_size):
            width = min(tile_size, src.width - col)
            window = Window(
                col_off=col,
                row_off=row,
                width=width,
                height=height,
            )
            raw = src.read(1, window=window).astype(np.float64, copy=False)
            inside = rasterize(
                [(polygon_in_raster_crs, 1)],
                out_shape=(height, width),
                transform=src.window_transform(window),
                fill=0,
                dtype="uint8",
            ).astype(bool)
            valid = inside & np.isfinite(raw)
            if nodata is not None:
                valid &= raw != nodata
            else:
                # Many exported thermal rasters use zero as an undocumented
                # background fill; zero Celsius is not useful in these scenes.
                valid &= raw != 0
            if not valid.any():
                continue

            celsius = normalize_lst_to_celsius(
                raw,
                units=units,
                scale=scale,
                offset=offset,
            )
            valid &= np.isfinite(celsius)
            if not valid.any():
                continue

            pixels = celsius[valid]
            count += int(pixels.size)
            total += float(np.sum(pixels, dtype=np.float64))
            minimum = min(minimum, float(np.min(pixels)))
            maximum = max(maximum, float(np.max(pixels)))

    if count == 0:
        return None

    return {
        "minimo": minimum,
        "maximo": maximum,
        "media": total / count,
        "media_aproximada": total / count,
        "amplitude": maximum - minimum,
        "contagem_pixels": count,
        "unidade": "°C",
    }

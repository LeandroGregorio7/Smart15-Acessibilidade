from math import isfinite

from shapely.geometry import Point, Polygon, mapping


def count_geometry_vertices(geometry):
    def count(value):
        if isinstance(value, (list, tuple)):
            if len(value) >= 2 and isinstance(value[0], (int, float)) and isinstance(value[1], (int, float)):
                return 1
            return sum(count(child) for child in value)
        return 0

    return count(mapping(geometry).get("coordinates", []))


def study_area_covers_start_point(poly, point):
    if not poly.covers(point):
        return False
    polygons = [poly] if poly.geom_type == "Polygon" else list(poly.geoms)
    for polygon in polygons:
        if not polygon.covers(point):
            continue
        if any(Polygon(interior).covers(point) for interior in polygon.interiors):
            continue
        return True
    return False


def resolve_start_point(poly, mode, coordinates=None, label=None):
    if mode not in {"centroid", "coordinates", "address", "file"}:
        raise ValueError("Método de ponto inicial inválido.")
    if mode == "centroid":
        point = poly.centroid
        if not study_area_covers_start_point(poly, point):
            raise ValueError(
                "O centroide do polígono está fora da área (concavidade, buraco ou ilha). "
                "Selecione coordenadas, endereço ou um ponto de arquivo."
            )
        return point, "Centroide do polígono"

    if not isinstance(coordinates, (list, tuple)) or len(coordinates) != 2:
        raise ValueError("Informe o ponto inicial como [longitude, latitude].")
    try:
        longitude, latitude = float(coordinates[0]), float(coordinates[1])
    except (TypeError, ValueError) as exc:
        raise ValueError("Longitude/latitude do ponto inicial inválidas.") from exc
    if (
        not isfinite(longitude) or not isfinite(latitude)
        or longitude < -180 or longitude > 180
        or latitude < -90 or latitude > 90
    ):
        raise ValueError("Ponto inicial fora dos limites de longitude/latitude.")
    point = Point(longitude, latitude)
    if not study_area_covers_start_point(poly, point):
        raise ValueError("Ponto inicial fora do polígono de estudo. Escolha um ponto dentro do limite.")
    return point, str(label or "Ponto escolhido")[:200]

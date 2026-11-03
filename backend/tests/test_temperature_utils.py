import unittest

import numpy as np
import rasterio
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from shapely.geometry import Polygon

from app.temperature_utils import (
    normalize_lst_to_celsius,
    temperature_raster_stats_celsius,
)


class TemperatureNormalizationTests(unittest.TestCase):
    def test_preserves_synapse_celsius_values(self):
        result = normalize_lst_to_celsius(
            np.array([32.0, 36.0, 40.0]),
            units="°C",
        )
        np.testing.assert_allclose(result, [32.0, 36.0, 40.0])

    def test_converts_kelvin_and_landsat_collection_2_dn(self):
        kelvin = normalize_lst_to_celsius(
            np.array([305.15, 313.15]),
            units="K",
        )
        np.testing.assert_allclose(kelvin, [32.0, 40.0], atol=1e-10)

        dn = np.array([30000.0])
        landsat = normalize_lst_to_celsius(dn)
        expected = dn * 0.00341802 + 149.0 - 273.15
        np.testing.assert_allclose(landsat, expected)

    def test_uses_declared_scale_and_offset(self):
        result = normalize_lst_to_celsius(
            np.array([1.0, 2.0]),
            units="K",
            scale=10.0,
            offset=300.0,
        )
        np.testing.assert_allclose(result, [36.85, 46.85], atol=1e-10)

    def test_rejects_values_outside_physical_temperature_range(self):
        result = normalize_lst_to_celsius(
            np.array([-238.8, 36.0, 500.0]),
            units="°C",
        )
        self.assertTrue(np.isnan(result[0]))
        self.assertEqual(result[1], 36.0)
        self.assertTrue(np.isnan(result[2]))

    def test_stats_are_actual_pixels_within_study_polygon(self):
        values = np.array(
            [
                [32.0, 34.0, 80.0, 80.0],
                [36.0, 38.0, 80.0, 80.0],
                [80.0, 80.0, 80.0, 80.0],
                [80.0, 80.0, 80.0, 80.0],
            ],
            dtype="float32",
        )
        profile = {
            "driver": "GTiff",
            "height": 4,
            "width": 4,
            "count": 1,
            "dtype": "float32",
            "crs": "EPSG:4326",
            "transform": from_origin(0, 4, 1, 1),
            "nodata": -9999.0,
        }
        polygon = Polygon([(0, 2), (2, 2), (2, 4), (0, 4)])

        with MemoryFile() as memory_file:
            with memory_file.open(**profile) as dataset:
                dataset.write(values, 1)
                stats = temperature_raster_stats_celsius(
                    dataset,
                    polygon,
                    tile_size=2,
                )

        self.assertIsNotNone(stats)
        self.assertEqual(stats["unidade"], "°C")
        self.assertEqual(stats["contagem_pixels"], 4)
        self.assertEqual(stats["minimo"], 32.0)
        self.assertEqual(stats["maximo"], 38.0)
        self.assertEqual(stats["media"], 35.0)


if __name__ == "__main__":
    unittest.main()

import unittest

from shapely.geometry import MultiPolygon, Polygon

from app.spatial_validation import count_geometry_vertices, resolve_start_point


class StartPointValidationTests(unittest.TestCase):
    def setUp(self):
        self.polygon = Polygon(
            [(-47, -24), (-46, -24), (-46, -23), (-47, -23), (-47, -24)],
            [[(-46.8, -23.8), (-46.2, -23.8), (-46.2, -23.2), (-46.8, -23.2), (-46.8, -23.8)]],
        )

    def test_accepts_inside_point_and_preserves_label(self):
        point, label = resolve_start_point(self.polygon, "address", [-46.95, -23.5], "Praça central")
        self.assertEqual((point.x, point.y), (-46.95, -23.5))
        self.assertEqual(label, "Praça central")

    def test_rejects_point_outside_boundary(self):
        with self.assertRaisesRegex(ValueError, "fora do polígono"):
            resolve_start_point(self.polygon, "coordinates", [-45.9, -23.5])

    def test_rejects_point_inside_hole(self):
        with self.assertRaisesRegex(ValueError, "fora do polígono"):
            resolve_start_point(self.polygon, "file", [-46.5, -23.5])

    def test_rejects_point_on_hole_boundary(self):
        with self.assertRaisesRegex(ValueError, "fora do polígono"):
            resolve_start_point(self.polygon, "file", [-46.8, -23.5])

    def test_accepts_polygon_centroid_only_when_covered(self):
        solid_polygon = Polygon([(-47, -24), (-46, -24), (-46, -23), (-47, -23), (-47, -24)])
        point, label = resolve_start_point(solid_polygon, "centroid")
        self.assertTrue(solid_polygon.covers(point))
        self.assertEqual(label, "Centroide do polígono")

    def test_rejects_centroid_in_polygon_hole(self):
        square_with_hole = Polygon(
            [(0, 0), (4, 0), (4, 4), (0, 4), (0, 0)],
            [[(1, 1), (3, 1), (3, 3), (1, 3), (1, 1)]],
        )
        with self.assertRaisesRegex(ValueError, "centroide.*fora"):
            resolve_start_point(square_with_hole, "centroid")

    def test_rejects_invalid_coordinate_ranges_and_nan(self):
        for coordinates in ([181, 0], [0, 91], [float("nan"), 0], [0, float("inf")]):
            with self.subTest(coordinates=coordinates):
                with self.assertRaisesRegex(ValueError, "limites"):
                    resolve_start_point(self.polygon, "coordinates", coordinates)

    def test_supports_multipolygon_and_counts_vertices(self):
        multi = MultiPolygon([
            Polygon([(-47, -24), (-46, -24), (-46, -23), (-47, -23), (-47, -24)]),
            Polygon([(-45, -24), (-44, -24), (-44, -23), (-45, -23), (-45, -24)]),
        ])
        point, _ = resolve_start_point(multi, "file", [-44.5, -23.5])
        self.assertTrue(multi.covers(point))
        self.assertEqual(count_geometry_vertices(multi), 10)

    def test_rejects_unknown_origin_mode(self):
        with self.assertRaisesRegex(ValueError, "[Mm]étodo.*inválido"):
            resolve_start_point(self.polygon, "random", [-46.5, -23.5])


if __name__ == "__main__":
    unittest.main()

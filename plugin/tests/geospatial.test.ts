import { describe, expect, it } from "vitest";
import {
  createCoordinateTransformer,
  normalizePointGeoJSON,
  parseDecimalDegrees,
  polygonGeoJSONCoversPoint,
} from "../src/lib/geospatial";

describe("EPSG:31983 GeoJSON reprojection", () => {
  it("reprojects SIRGAS 2000 / UTM 23S coordinates to longitude, latitude", () => {
    const geojson = {
      type: "Feature",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::31983" } },
      properties: { area: "test" },
      geometry: {
        type: "Polygon",
        coordinates: [[[500000, 7400000], [501000, 7400000], [501000, 7401000], [500000, 7401000], [500000, 7400000]]],
      },
    };
    const positions = geojson.geometry.coordinates[0];
    const transform = createCoordinateTransformer(geojson, positions);
    const [longitude, latitude] = transform(positions[0]);

    expect(longitude).toBeCloseTo(-45, 5);
    expect(latitude).toBeCloseTo(-23.5101947, 5);
    expect(Math.abs(longitude)).toBeLessThan(180);
    expect(Math.abs(latitude)).toBeLessThan(90);
  });

  it("accepts an EPSG authority URI and rejects a similar but unsupported code", () => {
    const transform = createCoordinateTransformer(
      { crs: { properties: { href: "http://www.opengis.net/def/crs/EPSG/0/31983" } } },
      [[500000, 7400000]],
    );
    expect(transform([500000, 7400000])[0]).toBeCloseTo(-45, 5);
    expect(() => createCoordinateTransformer(
      { crs: { properties: { name: "EPSG:319830" } } },
      [[500000, 7400000]],
    )).toThrow(/CRS não suportado/);
  });

  it("does not silently guess that UTM coordinates without a CRS are Web Mercator", () => {
    expect(() => createCoordinateTransformer({}, [[500000, 7400000]])).toThrow(/parecem estar em UTM.*EPSG:31983/);
  });

  it("normalizes uploaded Point features and transforms their CRS", () => {
    const normalized = normalizePointGeoJSON({
      type: "FeatureCollection",
      crs: { properties: { name: "EPSG:31983" } },
      features: [{
        type: "Feature",
        id: "p1",
        properties: { nome: "Praça" },
        geometry: { type: "Point", coordinates: [500000, 7400000] },
      }],
    });
    expect(normalized.features).toHaveLength(1);
    expect(normalized.features[0].id).toBe("p1");
    expect(normalized.features[0].properties.nome).toBe("Praça");
    expect(normalized.features[0].geometry.coordinates[0]).toBeCloseTo(-45, 5);
  });
});

describe("origin coordinates and polygon barrier", () => {
  it("requires a decimal point rather than a decimal comma", () => {
    expect(parseDecimalDegrees("-23.55052")).toBeCloseTo(-23.55052);
    expect(() => parseDecimalDegrees("-23,55052")).toThrow(/ponto \(\.\)/);
    expect(() => parseDecimalDegrees("1.2.3")).toThrow();
  });

  const boundary = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [[-47, -24], [-46, -24], [-46, -23], [-47, -23], [-47, -24]],
        [[-46.8, -23.8], [-46.2, -23.8], [-46.2, -23.2], [-46.8, -23.2], [-46.8, -23.8]],
      ],
    },
  };

  it("covers a point in the polygon and on its exterior boundary", () => {
    expect(polygonGeoJSONCoversPoint(boundary, -46.95, -23.5)).toBe(true);
    expect(polygonGeoJSONCoversPoint(boundary, -47, -23.5)).toBe(true);
  });

  it("excludes points outside the boundary and inside a hole", () => {
    expect(polygonGeoJSONCoversPoint(boundary, -45.9, -23.5)).toBe(false);
    expect(polygonGeoJSONCoversPoint(boundary, -46.5, -23.5)).toBe(false);
  });

  it("accepts points inside any member of a MultiPolygon", () => {
    const multipolygon = {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[-47, -24], [-46, -24], [-46, -23], [-47, -23], [-47, -24]]],
          [[[-45, -24], [-44, -24], [-44, -23], [-45, -23], [-45, -24]]],
        ],
      },
    };
    expect(polygonGeoJSONCoversPoint(multipolygon, -44.5, -23.5)).toBe(true);
    expect(polygonGeoJSONCoversPoint(multipolygon, -43.9, -23.5)).toBe(false);
  });
});

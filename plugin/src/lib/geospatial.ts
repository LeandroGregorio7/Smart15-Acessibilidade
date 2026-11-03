import proj4 from "proj4";

export type Position = number[];
export type PointFeature = {
  type: "Feature";
  id?: string | number;
  properties: Record<string, unknown>;
  geometry: { type: "Point"; coordinates: [number, number] };
};
export type PointFeatureCollection = {
  type: "FeatureCollection";
  features: PointFeature[];
};

export function parseDecimalDegrees(value: string): number {
  const normalized = value.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
    throw new Error("Use ponto (.) como separador decimal, por exemplo -23.55052.");
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error("A coordenada precisa ser um número finito.");
  }
  return parsed;
}

type CoordinateTransformer = (position: Position) => Position;

const WEB_MERCATOR_LIMIT = 20037508.342789244;
const EPSG_31983 = "EPSG:31983";

// SIRGAS 2000 / UTM zone 23S (GRS 80 ellipsoid; coordinates are easting/northing in metres).
proj4.defs(
  EPSG_31983,
  "+proj=utm +zone=23 +south +ellps=GRS80 +units=m +no_defs +type=crs",
);

function getCrsDeclaration(input: any): string {
  return String(
    input?.crs?.properties?.name
      ?? input?.crs?.properties?.href
      ?? input?.crs?.name
      ?? "",
  ).trim();
}

function getEpsgCode(crsName: string): string | null {
  if (!/epsg/i.test(crsName)) return null;
  const numericParts = crsName.match(/\d+/g);
  return numericParts ? numericParts[numericParts.length - 1] : null;
}

function isWebMercatorName(crsName: string): boolean {
  const code = getEpsgCode(crsName);
  return code === "3857"
    || code === "900913"
    || code === "102100"
    || code === "102113"
    || code === "3785";
}

function isGeographicName(crsName: string): boolean {
  return /crs:?84|crs84/i.test(crsName)
    || getEpsgCode(crsName) === "4326";
}

export function createCoordinateTransformer(
  input: any,
  positions: Position[],
): CoordinateTransformer {
  const crsName = getCrsDeclaration(input);
  const declaresWebMercator = isWebMercatorName(crsName);
  const declaresGeographic = isGeographicName(crsName);
  const declaresUtm23S = getEpsgCode(crsName) === "31983";
  const hasOutOfRangeCoordinates = positions.some(
    ([x, y]) => Math.abs(x) > 180 || Math.abs(y) > 90,
  );
  const hasLargeCoordinates = positions.some(
    ([x, y]) => Math.max(Math.abs(x), Math.abs(y)) > 1000,
  );

  let source: "geographic" | "webMercator" | "utm23s";
  if (declaresWebMercator) {
    source = "webMercator";
  } else if (declaresUtm23S) {
    source = "utm23s";
  } else if (declaresGeographic) {
    source = "geographic";
  } else if (crsName) {
    throw new Error(
      `CRS não suportado para reprojeção automática: ${crsName}. Exporte em EPSG:4326, EPSG:3857 ou EPSG:31983.`,
    );
  } else if (!hasOutOfRangeCoordinates) {
    source = "geographic";
  } else if (
    positions.every(([x, y]) => x >= 100000 && x <= 900000 && y >= 0 && y <= 10000000)
  ) {
    throw new Error(
      "As coordenadas parecem estar em UTM, mas o GeoJSON não declara o CRS. Informe EPSG:31983 (SIRGAS 2000 / UTM 23S) no arquivo ou reexporte em EPSG:4326.",
    );
  } else if (
    hasLargeCoordinates
    && positions.every(
      ([x, y]) => Math.abs(x) <= WEB_MERCATOR_LIMIT && Math.abs(y) <= WEB_MERCATOR_LIMIT,
    )
  ) {
    // Legacy GeoJSON without CRS metadata, but with recognizable Web Mercator values.
    source = "webMercator";
  } else {
    throw new Error(
      "Coordenadas fora de longitude/latitude e sem CRS reconhecido; informe EPSG:3857 ou EPSG:31983, ou exporte em EPSG:4326.",
    );
  }

  return (position: Position): Position => {
    const [x, y, ...extra] = position;
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("O GeoJSON contém coordenadas não numéricas.");
    }

    if (source === "webMercator") {
      if (Math.abs(x) > WEB_MERCATOR_LIMIT || Math.abs(y) > WEB_MERCATOR_LIMIT) {
        throw new Error("Coordenadas fora do limite válido de EPSG:3857.");
      }
      const longitude = (x / WEB_MERCATOR_LIMIT) * 180;
      const earthRadius = WEB_MERCATOR_LIMIT / Math.PI;
      const latitude = (Math.atan(Math.sinh(y / earthRadius)) * 180) / Math.PI;
      return [longitude, latitude, ...extra];
    }

    if (source === "utm23s") {
      if (x < 100000 || x > 900000 || y < 0 || y > 10000000) {
        throw new Error("Coordenada fora da faixa válida de UTM 23S (EPSG:31983).");
      }
      const [longitude, latitude] = proj4(EPSG_31983, "EPSG:4326", [x, y]);
      if (
        !Number.isFinite(longitude)
        || !Number.isFinite(latitude)
        || longitude < -180
        || longitude > 180
        || latitude < -90
        || latitude > 90
      ) {
        throw new Error("Não foi possível reprojetar uma coordenada de EPSG:31983 para EPSG:4326.");
      }
      return [longitude, latitude, ...extra];
    }

    if (Math.abs(x) > 180 || Math.abs(y) > 90) {
      throw new Error("Coordenadas geográficas fora dos limites de longitude/latitude.");
    }
    return [...position];
  };
}

export function collectPositions(value: any, into: Position[] = []): Position[] {
  if (!Array.isArray(value)) return into;
  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    into.push(value as Position);
    return into;
  }
  value.forEach((child) => collectPositions(child, into));
  return into;
}

function getFeatures(input: any): any[] {
  if (input?.type === "FeatureCollection" && Array.isArray(input.features)) return input.features;
  if (input?.type === "Feature") return [input];
  if (input?.type === "Point" || input?.type === "MultiPoint") {
    return [{ type: "Feature", properties: {}, geometry: input }];
  }
  throw new Error("O arquivo de pontos precisa ser GeoJSON Point ou MultiPoint (Feature ou FeatureCollection).");
}

export function normalizePointGeoJSON(input: any): PointFeatureCollection {
  const features = getFeatures(input);
  const sourcePositions = features.flatMap((feature) =>
    collectPositions(feature?.geometry?.coordinates, []),
  );
  if (sourcePositions.length === 0) {
    throw new Error("O arquivo não contém coordenadas de pontos.");
  }
  const transform = createCoordinateTransformer(input, sourcePositions);
  const normalized: PointFeature[] = [];

  features.forEach((feature, featureIndex) => {
    const geometry = feature?.geometry;
    const properties = feature?.properties && typeof feature.properties === "object"
      ? feature.properties as Record<string, unknown>
      : {};
    const featureId = feature?.id;
    const points = geometry?.type === "Point"
      ? [geometry.coordinates]
      : geometry?.type === "MultiPoint"
        ? geometry.coordinates
        : null;

    if (!Array.isArray(points)) {
      throw new Error(`A feição ${featureIndex + 1} não é Point/MultiPoint.`);
    }
    if (points.length === 0) {
      throw new Error(`A feição ${featureIndex + 1} não contém pontos.`);
    }

    points.forEach((position: any, pointIndex: number) => {
      if (!Array.isArray(position) || position.length < 2) {
        throw new Error(`Coordenada inválida na feição ${featureIndex + 1}.`);
      }
      const [longitude, latitude] = transform(position);
      const id = featureId === undefined
        ? `${featureIndex + 1}-${pointIndex + 1}`
        : String(featureId);
      normalized.push({
        type: "Feature",
        id,
        properties: { ...properties },
        geometry: { type: "Point", coordinates: [longitude, latitude] },
      });
    });
  });

  return { type: "FeatureCollection", features: normalized };
}

function pointOnSegment(
  point: [number, number],
  a: [number, number],
  b: [number, number],
): boolean {
  const lengthSquared = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
  const tolerance = 1e-10;
  if (lengthSquared <= tolerance) {
    return (point[0] - a[0]) ** 2 + (point[1] - a[1]) ** 2 <= tolerance ** 2;
  }
  const cross = (point[1] - a[1]) * (b[0] - a[0]) - (point[0] - a[0]) * (b[1] - a[1]);
  if (Math.abs(cross) > tolerance) return false;
  const dot = (point[0] - a[0]) * (b[0] - a[0]) + (point[1] - a[1]) * (b[1] - a[1]);
  if (dot < -tolerance) return false;
  return dot <= lengthSquared + tolerance;
}

function ringCoversPoint(ring: number[][], point: [number, number]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j] as [number, number];
    const b = ring[i] as [number, number];
    if (pointOnSegment(point, a, b)) return true;
    const intersects = ((b[1] > point[1]) !== (a[1] > point[1]))
      && (point[0] < ((a[0] - b[0]) * (point[1] - b[1])) / (a[1] - b[1]) + b[0]);
    if (intersects) inside = !inside;
  }
  return inside;
}

function polygonCoversPoint(
  rings: number[][][],
  point: [number, number],
): boolean {
  if (!rings.length || !ringCoversPoint(rings[0], point)) return false;
  // A point on a hole ring is treated as excluded, matching the study-area barrier.
  return !rings.slice(1).some((hole) => ringCoversPoint(hole, point));
}

export function polygonGeoJSONCoversPoint(
  geojson: any,
  longitude: number,
  latitude: number,
): boolean {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return false;
  const features = geojson?.type === "FeatureCollection"
    ? geojson.features ?? []
    : geojson?.type === "Feature"
      ? [geojson]
      : [{ type: "Feature", geometry: geojson }];
  const point: [number, number] = [longitude, latitude];

  return features.some((feature: any) => {
    const geometry = feature?.geometry;
    if (geometry?.type === "Polygon") {
      return polygonCoversPoint(geometry.coordinates ?? [], point);
    }
    if (geometry?.type === "MultiPolygon") {
      return (geometry.coordinates ?? []).some((polygon: number[][][]) => polygonCoversPoint(polygon, point));
    }
    return false;
  });
}

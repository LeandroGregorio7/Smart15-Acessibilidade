/**
 * Resolve a localização administrativa associada ao centroide de uma área.
 *
 * O extent deve estar em WGS84 (EPSG:4326), na ordem
 * [longitude mínima, latitude mínima, longitude máxima, latitude máxima].
 *
 * O endpoint é configurável para que o plugin possa trocar o provedor ou
 * apontar futuramente para um serviço institucional.
 */

export type GeographicExtent = readonly [
  minLongitude: number,
  minLatitude: number,
  maxLongitude: number,
  maxLatitude: number,
];

export type AdministrativeLocation = {
  municipality?: string;
  state?: string;
};

export type ReverseGeocoderOptions = {
  /** Endpoint compatível com a API reverse do Nominatim. */
  endpoint?: string;
  /** Idioma preferido para nomes retornados pelo provedor. */
  language?: string;
  /** Tempo máximo da requisição. */
  timeoutMs?: number;
  /** Implementação injetável para facilitar testes. */
  fetchFn?: typeof fetch;
};

type NominatimAddress = {
  city?: unknown;
  town?: unknown;
  village?: unknown;
  municipality?: unknown;
  county?: unknown;
  state?: unknown;
};

type NominatimReverseResponse = {
  address?: NominatimAddress;
};

const DEFAULT_ENDPOINT =
  "https://nominatim.openstreetmap.org/reverse";

const DEFAULT_TIMEOUT_MS = 5_000;

const cache = new Map<string, AdministrativeLocation>();

function isFiniteCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function validateExtent(extent: GeographicExtent): void {
  const [minLongitude, minLatitude, maxLongitude, maxLatitude] = extent;

  if (!extent.every(isFiniteCoordinate)) {
    throw new Error("O extent informado possui coordenadas inválidas.");
  }

  if (
    minLongitude < -180
    || maxLongitude > 180
    || minLatitude < -90
    || maxLatitude > 90
    || minLongitude > maxLongitude
    || minLatitude > maxLatitude
  ) {
    throw new Error(
      "O extent deve estar em EPSG:4326, na ordem [minLng, minLat, maxLng, maxLat].",
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function collectCoordinatePairs(
  value: unknown,
  positions: Array<readonly [longitude: number, latitude: number]>,
): void {
  if (!Array.isArray(value)) {
    return;
  }

  const [longitude, latitude] = value;

  if (isFiniteCoordinate(longitude) && isFiniteCoordinate(latitude)) {
    positions.push([longitude, latitude]);
    return;
  }

  value.forEach((item) => collectCoordinatePairs(item, positions));
}

function collectGeoJsonCoordinates(
  geoJson: unknown,
  positions: Array<readonly [longitude: number, latitude: number]>,
): void {
  if (!isRecord(geoJson)) {
    return;
  }

  if (geoJson.type === "Feature") {
    collectGeoJsonCoordinates(geoJson.geometry, positions);
    return;
  }

  if (geoJson.type === "FeatureCollection" && Array.isArray(geoJson.features)) {
    geoJson.features.forEach((feature) =>
      collectGeoJsonCoordinates(feature, positions),
    );
    return;
  }

  if (geoJson.type === "GeometryCollection" && Array.isArray(geoJson.geometries)) {
    geoJson.geometries.forEach((geometry) =>
      collectGeoJsonCoordinates(geometry, positions),
    );
    return;
  }

  collectCoordinatePairs(geoJson.coordinates, positions);
}

/**
 * Calcula o extent WGS84 de uma geometria GeoJSON.
 *
 * Aceita Geometry, Feature, FeatureCollection e GeometryCollection. Retorna
 * undefined quando a geometria estiver ausente, não possuir coordenadas ou
 * não estiver em longitude/latitude compatível com EPSG:4326.
 */
export function getExtentFromGeoJson(
  geoJson: unknown,
): GeographicExtent | undefined {
  const positions: Array<readonly [number, number]> = [];

  collectGeoJsonCoordinates(geoJson, positions);

  if (positions.length === 0) {
    return undefined;
  }

  let minLongitude = Infinity;
  let minLatitude = Infinity;
  let maxLongitude = -Infinity;
  let maxLatitude = -Infinity;

  positions.forEach(([longitude, latitude]) => {
    minLongitude = Math.min(minLongitude, longitude);
    minLatitude = Math.min(minLatitude, latitude);
    maxLongitude = Math.max(maxLongitude, longitude);
    maxLatitude = Math.max(maxLatitude, latitude);
  });

  const extent: GeographicExtent = [
    minLongitude,
    minLatitude,
    maxLongitude,
    maxLatitude,
  ];

  try {
    validateExtent(extent);
    return extent;
  } catch {
    return undefined;
  }
}

function getCentroid(extent: GeographicExtent): {
  longitude: number;
  latitude: number;
} {
  validateExtent(extent);

  const [minLongitude, minLatitude, maxLongitude, maxLatitude] = extent;

  return {
    longitude: (minLongitude + maxLongitude) / 2,
    latitude: (minLatitude + maxLatitude) / 2,
  };
}

function getCacheKey(
  endpoint: string,
  longitude: number,
  latitude: number,
  language: string,
): string {
  // Cinco casas decimais equivalem a cerca de um metro no equador e evitam
  // chamadas repetidas ao gerar o relatório para a mesma área.
  return [
    endpoint,
    longitude.toFixed(5),
    latitude.toFixed(5),
    language,
  ].join("|");
}

function parseLocation(
  payload: NominatimReverseResponse,
): AdministrativeLocation {
  const address = payload.address ?? {};

  return {
    municipality:
      asNonEmptyString(address.municipality)
      ?? asNonEmptyString(address.city)
      ?? asNonEmptyString(address.town)
      ?? asNonEmptyString(address.village)
      ?? asNonEmptyString(address.county),
    state: asNonEmptyString(address.state),
  };
}

/**
 * Obtém município e estado pelo centroide do extent selecionado.
 *
 * Em falhas de rede ou quando o provedor não conseguir identificar o local,
 * retorna um objeto vazio para que o relatório mantenha seu fallback atual.
 */
export async function resolveAdministrativeLocation(
  extent: GeographicExtent,
  options: ReverseGeocoderOptions = {},
): Promise<AdministrativeLocation> {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const language = options.language ?? "pt-BR";
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchFn = options.fetchFn ?? globalThis.fetch;

  if (typeof fetchFn !== "function") {
    throw new Error("A implementação de fetch não está disponível.");
  }

  const { longitude, latitude } = getCentroid(extent);
  const cacheKey = getCacheKey(endpoint, longitude, latitude, language);
  const cachedLocation = cache.get(cacheKey);

  if (cachedLocation) {
    return cachedLocation;
  }

  const url = new URL(endpoint);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("layer", "address");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", language);

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(
    () => controller.abort(),
    timeoutMs,
  );

  try {
    const response = await fetchFn(url.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {};
    }

    const payload = await response.json() as NominatimReverseResponse;
    const location = parseLocation(payload);

    cache.set(cacheKey, location);
    return location;
  } catch {
    return {};
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

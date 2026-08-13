import type {
  SupportedLocale,
} from "../i18n/i18n.types";

export type InfluenceLevel =
  | "positive"
  | "neutral"
  | "low"
  | "moderate"
  | "high"
  | "critical";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ReportIdentification {
  analysisId: string;
  generatedAt: string;
  municipality?: string;
  state?: string;
  areaName?: string;
  destinationName: string;
  destinationType: string;
  origin?: Coordinates;
  destination?: Coordinates;
  coordinateReferenceSystem?: string;
  pluginVersion?: string;
  algorithmVersion?: string;
}

export interface SimulationConfiguration {
  targetTimeMinutes: number;
  baseWalkingSpeedKmH: number;

  weights: {
    slope: number;
    treeCoverage: number;
    pavement?: number;
    crossings?: number;
    accessibility?: number;
    temperature?: number;
  };

  selectedProfiles?: string[];
  selectedProfileLabels?: string[];

  selectedDestinations?: string[];
  selectedDestinationLabels?: string[];

  outputFormats?: string[];

  [key: string]: unknown;
}


export interface RouteIndicators {
  /**
   * Área total do perímetro analisado.
   */
  areaSquareMeters: number;

  /**
   * Distância calculada para o deslocamento.
   * Null quando o backend não fornece essa métrica.
   */
  distanceMeters: number | null;

  /**
   * Tempo estimado sem aplicação das ponderações.
   * Null quando não foi calculado.
   */
  baseTimeMinutes: number | null;

  /**
   * Tempo final após aplicação das ponderações.
   * Null quando não foi calculado.
   */
  adjustedTimeMinutes: number | null;

  /**
   * Velocidade média resultante.
   * Null quando distância ou tempo não estão disponíveis.
   */
  averageSpeedKmH: number | null;

  /**
   * Área alcançável dentro do tempo-alvo.
   * Null quando o backend não fornece a métrica.
   */
  reachableAreaSquareMeters: number | null;

  slope: {
    averagePercent: number | null;
    maximumPercent: number | null;
  };

  treeCoverage: {
    averagePercent: number | null;
    grassCoveragePercent?: number | null;
    totalVegetatedSurfacePercent?: number | null;
  };

  pavement?: {
    adequatePercent: number;
  } | null;

  accessibility?: {
    accessibleSegmentsPercent: number;
  } | null;

  temperature?: {
    averageCelsius: number | null;
    maximumCelsius: number | null;
  };

  elevation?: {
    minimumMeters: number | null;
    maximumMeters: number | null;
    averageMeters: number | null;
  };
}

export interface FactorImpact {
  factor:
    | "slope"
    | "treeCoverage"
    | "pavement"
    | "crossings"
    | "accessibility"
    | "temperature";

  label: string;
  rawValue: number;
  unit: string;
  level: InfluenceLevel;

  /**
   * Diferença entre o tempo final e o tempo de referência
   * atribuída ao fator.
   *
   * Valor positivo: aumentou o tempo.
   * Valor negativo: reduziu a penalização.
   */
  impactMinutes?: number;

  description: string;
  recommendations: string[];
}

export interface MapImage {
  title: string;
  description?: string;

  /**
   * Data URL, por exemplo:
   * data:image/png;base64,...
   */
  dataUrl: string;
}

export interface ReportData {
  locale?: SupportedLocale;

  identification: ReportIdentification;
  configuration: SimulationConfiguration;
  indicators: RouteIndicators;

  maps?: {
    overview?: MapImage;
    route?: MapImage;
    isochrone?: MapImage;
  };

  dataSources?: string[];
  notes?: string[];


  area?: Record<string, unknown>;


  profiles?: unknown[];


  pois?: {
    total?: number;
    por_categoria?: Record<string, number>;
    [key: string]: unknown;
  };


  studyGeometry?: unknown | null;

  raw?: unknown;
}

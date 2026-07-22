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
  };
}

export interface RouteIndicators {
  /**
   * Área total do perímetro analisado.
   */
  areaSquareMeters: number;

  /**
   * Distância calculada para o deslocamento.
   */
  distanceMeters: number;

  /**
   * Tempo estimado sem aplicação das ponderações.
   */
  baseTimeMinutes: number;

  /**
   * Tempo final após aplicação das ponderações.
   */
  adjustedTimeMinutes: number;

  /**
   * Velocidade média resultante.
   */
  averageSpeedKmH: number;

  /**
   * Área alcançável dentro do tempo-alvo.
   */
  reachableAreaSquareMeters: number;

  slope: {
    averagePercent: number | null;
    maximumPercent: number | null;
  };

  treeCoverage: {
    averagePercent: number | null;
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
    | "accessibility";

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
}

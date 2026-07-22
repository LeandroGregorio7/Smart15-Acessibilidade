export interface SimulationReportAdapterInput {
  simulation: any;
  configuration?: any;
  mapImage?: string | null;
  studyGeometry?: any;
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberOrZero(value: unknown): number {
  return numberOrNull(value) ?? 0;
}

function positiveNumberOrDefault(value: unknown, fallback: number): number {
  const parsed = numberOrNull(value);
  return parsed !== null && parsed > 0 ? parsed : fallback;
}

function kelvinToCelsius(value: unknown): number | null {
  const numericValue = numberOrNull(value);
  return numericValue === null ? null : numericValue - 273.15;
}

function firstNonEmptyString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function destinationLabel(value: string): string {
  const labels: Record<string, string> = {
    escolas: "Escolas",
    hospitais: "Hospitais",
    parques: "Parques",
    saude: "Unidades de saúde",
    educacao: "Equipamentos de educação",
    lazer: "Equipamentos de lazer",
  };

  return labels[value] ?? value.replace(/_/g, " ");
}

function resolveTargetTimeMinutes(configuration: any): number {
  return positiveNumberOrDefault(
    configuration?.targetTimeMinutes
      ?? configuration?.tempo_alvo
      ?? configuration?.tempo
      ?? configuration?.time,
    15,
  );
}

export function adaptSimulationToReport(
  input: SimulationReportAdapterInput,
): any {
  const simulation = input.simulation ?? {};
  const backendReport = simulation.report ?? simulation ?? {};
  const rasters = backendReport.rasters ?? {};
  const backendParameters = backendReport.parametros ?? {};
  const frontendConfiguration = input.configuration ?? {};

  const area = backendReport.area ?? {};
  const pois = backendReport.pois ?? { total: 0, por_categoria: {} };
  const profiles = Array.isArray(backendReport.perfis)
    ? backendReport.perfis
    : [];

  const slope = rasters.declividade ?? {};
  const temperature = rasters.temperatura ?? {};
  const vegetation = rasters.vegetacao ?? {};
  const elevation = rasters.elevacao ?? {};

  const selectedProfiles = stringArray(
    frontendConfiguration.selectedProfiles
      ?? backendParameters.perfis_selecionados,
  );

  const selectedDestinations = stringArray(
    frontendConfiguration.selectedDestinations
      ?? backendParameters.destinos_selecionados,
  );

  const outputFormats = stringArray(
    frontendConfiguration.outputFormats
      ?? backendParameters.formatos_processados,
  );

  const targetTimeMinutes = resolveTargetTimeMinutes({
    ...backendParameters,
    ...frontendConfiguration,
  });

  const baseWalkingSpeedKmH = positiveNumberOrDefault(
    frontendConfiguration.baseWalkingSpeedKmH
      ?? frontendConfiguration.velocidadeBaseKmH
      ?? frontendConfiguration.velocidade_base_kmh
      ?? backendParameters.velocidade_base_kmh,
    5,
  );

  const distanceMeters = numberOrZero(
    simulation.distanceMeters
      ?? simulation.distancia_m
      ?? backendReport.distanceMeters
      ?? backendReport.distancia_m
      ?? profiles[0]?.distancia_m
      ?? profiles[0]?.distanceMeters,
  );

  const calculatedBaseTimeMinutes = distanceMeters > 0
    ? (distanceMeters / 1000 / baseWalkingSpeedKmH) * 60
    : 0;

  const baseTimeMinutes = numberOrNull(
    simulation.baseTimeMinutes
      ?? simulation.tempo_base_minutos
      ?? backendReport.baseTimeMinutes
      ?? backendReport.tempo_base_minutos
      ?? profiles[0]?.tempo_base_minutos,
  ) ?? calculatedBaseTimeMinutes;

  const adjustedTimeMinutes = numberOrNull(
    simulation.adjustedTimeMinutes
      ?? simulation.tempo_ajustado_minutos
      ?? backendReport.adjustedTimeMinutes
      ?? backendReport.tempo_ajustado_minutos
      ?? profiles[0]?.tempo_ajustado_minutos
      ?? profiles[0]?.tempo_minutos,
  ) ?? baseTimeMinutes;

  const averageSpeedKmH = adjustedTimeMinutes > 0 && distanceMeters > 0
    ? (distanceMeters / 1000) / (adjustedTimeMinutes / 60)
    : baseWalkingSpeedKmH;

  const primaryDestination = selectedDestinations[0];
  const destinationName = firstNonEmptyString(
    frontendConfiguration.destinationName,
    frontendConfiguration.nomeDestino,
    simulation.destinationName,
    simulation.nome_destino,
    primaryDestination ? destinationLabel(primaryDestination) : undefined,
    selectedDestinations.length > 1 ? "Destinos selecionados" : undefined,
    "Área de estudo",
  )!;

  const destinationType = firstNonEmptyString(
    frontendConfiguration.destinationType,
    frontendConfiguration.tipoDestino,
    simulation.destinationType,
    simulation.tipo_destino,
    primaryDestination,
    selectedDestinations.length > 1 ? "múltiplas categorias" : undefined,
    "não informado",
  )!;

  const areaSquareMeters = numberOrZero(
    area.area_m2 ?? area.areaSquareMeters,
  );

  const reachableAreaSquareMeters = numberOrNull(
    backendReport.reachableAreaSquareMeters
      ?? backendReport.area_alcancavel_m2
      ?? area.area_alcancavel_m2,
  ) ?? areaSquareMeters;

  const temperatureAverageCelsius = kelvinToCelsius(
    temperature.media ?? temperature.media_aproximada,
  );

  const temperatureMaximumCelsius = kelvinToCelsius(
    temperature.maximo ?? temperature.max,
  );

  const weightsInput = frontendConfiguration.weights ?? {};

  const weights = {
    slope: numberOrZero(
      weightsInput.slope
        ?? frontendConfiguration.slopeWeight
        ?? frontendConfiguration.pesoDeclividade
        ?? backendParameters.peso_declividade,
    ),
    treeCoverage: numberOrZero(
      weightsInput.treeCoverage
        ?? frontendConfiguration.treeCoverageWeight
        ?? frontendConfiguration.pesoArborizacao
        ?? backendParameters.peso_arborizacao,
    ),
    pavement: numberOrZero(
      weightsInput.pavement
        ?? frontendConfiguration.pavementWeight
        ?? backendParameters.peso_pavimentacao,
    ),
    accessibility: numberOrZero(
      weightsInput.accessibility
        ?? frontendConfiguration.accessibilityWeight
        ?? backendParameters.peso_acessibilidade,
    ),
    temperature: numberOrZero(
      weightsInput.temperature
        ?? frontendConfiguration.temperatureWeight
        ?? backendParameters.peso_temperatura,
    ),
  };

  const generatedAt = firstNonEmptyString(
    simulation.generatedAt,
    simulation.generated_at,
    backendReport.generatedAt,
  ) ?? new Date().toISOString();

  return {
    identification: {
      analysisId: String(
        simulation.simulation_id
          ?? simulation.id
          ?? backendReport.id
          ?? `smart15-${Date.now()}`,
      ),
      generatedAt,
      areaName: firstNonEmptyString(
        frontendConfiguration.areaName,
        frontendConfiguration.nomeArea,
        simulation.areaName,
        simulation.nome_area,
        "Área selecionada no mapa",
      ),
      destinationName,
      destinationType,
      municipality: firstNonEmptyString(
        frontendConfiguration.municipality,
        frontendConfiguration.municipio,
        simulation.municipality,
        simulation.municipio,
      ),
      state: firstNonEmptyString(
        frontendConfiguration.state,
        frontendConfiguration.uf,
        simulation.state,
        simulation.uf,
      ),
      coordinateReferenceSystem: firstNonEmptyString(
        area.crs_metrico,
        area.crs,
        frontendConfiguration.coordinateReferenceSystem,
      ),
      pluginVersion: firstNonEmptyString(
        frontendConfiguration.pluginVersion,
        simulation.pluginVersion,
      ),
      algorithmVersion: firstNonEmptyString(
        frontendConfiguration.algorithmVersion,
        simulation.algorithmVersion,
      ),
    },

    configuration: {
      ...backendParameters,
      ...frontendConfiguration,
      targetTimeMinutes,
      baseWalkingSpeedKmH,
      weights,
      selectedProfiles,
      selectedDestinations,
      outputFormats,
    },

    indicators: {
    areaSquareMeters,
    distanceMeters,
    baseTimeMinutes,
    adjustedTimeMinutes,
    averageSpeedKmH,
    reachableAreaSquareMeters,

        slope: {
            averagePercent: numberOrNull(
            slope.media
            ?? slope.media_aproximada,
            ),

            maximumPercent: numberOrNull(
            slope.maximo
            ?? slope.max,
            ),
        },

        treeCoverage: {
            averagePercent: numberOrNull(
            vegetation.percentual_cobertura
            ?? vegetation.percentual_indice_positivo
            ?? vegetation.averagePercent,
            ),
        },

        pavement: null,
        accessibility: null,

        temperature: {
            averageCelsius: temperatureAverageCelsius,
            maximumCelsius: temperatureMaximumCelsius,
        },

        elevation: {
            minimumMeters: numberOrNull(
            elevation.minimo
            ?? elevation.min,
            ),

            maximumMeters: numberOrNull(
            elevation.maximo
            ?? elevation.max,
            ),

            averageMeters: numberOrNull(
            elevation.media
            ?? elevation.media_aproximada,
            ),
        },
    },

    maps: input.mapImage
      ? {
          overview: {
            title: "Mapa da área analisada",
            description: "Área de estudo utilizada na simulação.",
            dataUrl: input.mapImage,
          },
        }
      : undefined,

    dataSources: stringArray(
      frontendConfiguration.dataSources
        ?? backendReport.fontes_dados,
    ),

    area,
    profiles,
    pois,
    studyGeometry: input.studyGeometry ?? null,
    raw: backendReport,
  };
}

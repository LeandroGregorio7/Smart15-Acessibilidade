import {
  getExtentFromGeoJson,
  resolveAdministrativeLocation,
} from "./report.geocoding";

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
    escolas: "Escolas e creches",
    hospitais: "Hospitais e clínicas",
    parques: "Parques e áreas verdes",
    mercados: "Mercados e padarias",
    cultura: "Equipamentos culturais",
    comercio: "Comércio e serviços",
    academias: "Academias e equipamentos esportivos",
    saude: "Unidades de saúde",
    educacao: "Equipamentos de educação",
    lazer: "Equipamentos de lazer",
  };

  return labels[value]
    ?? value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
}

function profileLabel(value: string): string {
  const labels: Record<string, string> = {
    adulto_pedestre: "Adulto — a pé",
    crianca_pedestre: "Criança — a pé",
    idoso_pedestre: "Pessoa idosa — a pé",

    adulto_bike: "Adulto — bicicleta",
    crianca_bike: "Criança — bicicleta",
    idoso_bike: "Pessoa idosa — bicicleta",

    adulto_bicicleta: "Adulto — bicicleta",
    crianca_bicicleta: "Criança — bicicleta",
    idoso_bicicleta: "Pessoa idosa — bicicleta",
  };

  return labels[value]
    ?? value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
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

export async function adaptSimulationToReport(
  input: SimulationReportAdapterInput,
): Promise<any> {
  const simulation = input.simulation ?? {};
  const backendReport = simulation.report ?? simulation ?? {};
  const rasters = backendReport.rasters ?? {};
  const backendParameters = backendReport.parametros ?? {};
  const frontendConfiguration = input.configuration ?? {};



  const selectedProfiles = stringArray(
      frontendConfiguration.selectedProfiles
        ?? frontendConfiguration.perfis
        ?? backendParameters.perfis_selecionados
        ?? backendReport.perfis_selecionados,
    );

    const selectedProfileLabels =
      selectedProfiles.map(profileLabel);

    const selectedDestinations = stringArray(
      frontendConfiguration.selectedDestinations
        ?? frontendConfiguration.alvos
        ?? backendParameters.destinos_selecionados
        ?? backendReport.destinos_selecionados,
    );

    const outputFormats = stringArray(
      frontendConfiguration.outputFormats
        ?? frontendConfiguration.formatos
        ?? backendParameters.formatos_processados,
    );

  const area = backendReport.area ?? {};
  const pois = backendReport.pois ?? { total: 0, por_categoria: {} };
  const profiles = Array.isArray(backendReport.perfis)
    ? backendReport.perfis
    : [];

  const slope = rasters.declividade ?? {};
  const temperature = rasters.temperatura ?? {};
  const vegetation = rasters.vegetacao ?? {};
  const elevation = rasters.elevacao ?? {};

  const targetTimeMinutes = resolveTargetTimeMinutes({
    ...backendParameters,
    ...frontendConfiguration,
  });
  const primaryProfile =  profiles.length > 0 ? profiles[0] : null;

  const baseWalkingSpeedKmH = positiveNumberOrDefault(
    frontendConfiguration.baseWalkingSpeedKmH
      ?? frontendConfiguration.velocidadeBaseKmH
      ?? frontendConfiguration.velocidade_base_kmh
      ?? backendParameters.velocidade_base_kmh
      ?? primaryProfile?.velocidade_base_kmh,
    5,
  );

  const distanceMeters = numberOrNull(
    simulation.distanceMeters
      ?? simulation.distancia_rede_m
      ?? simulation.distancia_m
      ?? backendReport.distanceMeters
      ?? backendReport.distancia_rede_m
      ?? backendReport.distancia_m
      ?? primaryProfile?.distancia_rede_m
      ?? primaryProfile?.distancia_m
      ?? primaryProfile?.distanceMeters,
  );

  const calculatedBaseTimeMinutes =
    distanceMeters !== null
    && distanceMeters > 0
    && baseWalkingSpeedKmH > 0
      ? (
          distanceMeters
          / 1000
          / baseWalkingSpeedKmH
        ) * 60
      : null;

  const baseTimeMinutes =
    numberOrNull(
      simulation.baseTimeMinutes
        ?? simulation.tempo_base_minutos
        ?? backendReport.baseTimeMinutes
        ?? backendReport.tempo_base_minutos
        ?? primaryProfile?.tempo_base_minutos,
    )
    ?? calculatedBaseTimeMinutes;

  const adjustedTimeMinutes =
    numberOrNull(
      simulation.adjustedTimeMinutes
        ?? simulation.tempo_ajustado_minutos
        ?? backendReport.adjustedTimeMinutes
        ?? backendReport.tempo_ajustado_minutos
        ?? primaryProfile?.tempo_ajustado_minutos
        ?? primaryProfile?.tempo_minutos,
    )
    ?? baseTimeMinutes;

  const averageSpeedKmH =
    adjustedTimeMinutes !== null
    && adjustedTimeMinutes > 0
    && distanceMeters !== null
    && distanceMeters > 0
      ? (
          distanceMeters / 1000
        ) / (
          adjustedTimeMinutes / 60
        )
      : null;

  const destinationLabels =
  selectedDestinations.map(destinationLabel);

  const destinationsSummary =
    destinationLabels.length > 0
      ? destinationLabels.join(", ")
      : undefined;

  const destinationTypesSummary =
    selectedDestinations.length > 0
      ? selectedDestinations.join(", ")
      : undefined;

  const destinationName = firstNonEmptyString(
    frontendConfiguration.destinationName,
    frontendConfiguration.nomeDestino,
    simulation.destinationName,
    simulation.nome_destino,
    destinationsSummary,
    "Área de estudo",
  )!;

  const destinationType = firstNonEmptyString(
    frontendConfiguration.destinationType,
    frontendConfiguration.tipoDestino,
    simulation.destinationType,
    simulation.tipo_destino,
    destinationTypesSummary,
    "não informado",
  )!;

  const areaSquareMeters = numberOrZero(
    area.area_m2 ?? area.areaSquareMeters,
  );

  const reachableAreaSquareMeters =
    numberOrNull(
      backendReport.reachableAreaSquareMeters
        ?? backendReport.area_alcancavel_m2
        ?? area.area_alcancavel_m2,
    );

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

  const municipalityFromData = firstNonEmptyString(
    frontendConfiguration.municipality,
    frontendConfiguration.municipio,
    simulation.municipality,
    simulation.municipio,
  );

  const stateFromData = firstNonEmptyString(
    frontendConfiguration.state,
    frontendConfiguration.uf,
    simulation.state,
    simulation.uf,
  );

  const extent =
    !municipalityFromData || !stateFromData
      ? getExtentFromGeoJson(input.studyGeometry)
      : undefined;

  const administrativeLocation = extent
    ? await resolveAdministrativeLocation(extent)
    : {};

  const municipality =
    municipalityFromData
    ?? administrativeLocation.municipality;

  const state =
    stateFromData
    ?? administrativeLocation.state;


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
      municipality,
      state,
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
      selectedProfileLabels,
      selectedDestinations,
      selectedDestinationLabels: destinationLabels,
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
            vegetation.cobertura_arborea_percent
              ?? vegetation.percentual_cobertura_arborea
              ?? vegetation.percentual_cobertura_arborea
              ?? vegetation.averagePercent,
          ),
        },

        grassCoveragePercent: numberOrNull(
          vegetation.cobertura_gramada_percent,
        ),
        totalVegetatedSurfacePercent: numberOrNull(
          vegetation.superficies_vegetadas_percent,
        ),

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

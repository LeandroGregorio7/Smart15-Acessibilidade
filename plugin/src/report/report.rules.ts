import {
  FactorImpact,
  ReportData,
  RouteIndicators,
} from "./report.types";

export type ExecutiveSummary = {
  status: "adequado" | "atenção" | "crítico";
  priority: "baixa" | "média" | "alta";
  headline: string;
  detail: string;
  restrictiveFactors: string[];
  recommendedAction: string;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function analyzeSlope(
  indicators: RouteIndicators,
): FactorImpact | null {
  const average = indicators.slope?.averagePercent;
  const maximum = indicators.slope?.maximumPercent;

  if (!isFiniteNumber(average) || !isFiniteNumber(maximum)) {
    return null;
  }

  if (average < 3) {
    return {
      factor: "slope",
      label: "Declividade",
      rawValue: average,
      unit: "%",
      level: "low",
      description:
        `A declividade média do percurso foi de ${average.toFixed(1)}%, `
        + "indicando baixa influência sobre o esforço e o tempo de caminhada.",
      recommendations: [],
    };
  }

  if (average < 8) {
    return {
      factor: "slope",
      label: "Declividade",
      rawValue: average,
      unit: "%",
      level: "moderate",
      description:
        `A declividade média foi de ${average.toFixed(1)}%, com valor máximo `
        + `de ${maximum.toFixed(1)}%. O fator apresenta influência moderada `
        + "sobre o esforço necessário e a velocidade de deslocamento.",
      recommendations: [
        "Avaliar rotas alternativas com menor inclinação.",
        "Verificar a continuidade e a regularidade das calçadas nos trechos inclinados.",
        "Priorizar soluções de acessibilidade nos segmentos de maior declividade.",
      ],
    };
  }

  return {
    factor: "slope",
    label: "Declividade",
    rawValue: average,
    unit: "%",
    level: average >= 12 ? "critical" : "high",
    description:
      `A declividade média foi de ${average.toFixed(1)}%, alcançando `
      + `${maximum.toFixed(1)}% em determinados trechos. Esse fator representa `
      + "uma limitação relevante à caminhabilidade, especialmente para pessoas "
      + "idosas, crianças e pessoas com mobilidade reduzida.",
    recommendations: [
      "Priorizar rotas acessíveis com menor inclinação.",
      "Implantar áreas de descanso nos trechos de maior esforço.",
      "Avaliar rampas, corrimãos e adequações de acessibilidade.",
      "Sinalizar trajetos alternativos com menor declividade.",
    ],
  };
}

function analyzeTreeCoverage(
  indicators: RouteIndicators,
): FactorImpact | null {
  const coverage = indicators.treeCoverage?.averagePercent;

  if (!isFiniteNumber(coverage)) {
    return null;
  }

  if (coverage >= 70) {
    return {
      factor: "treeCoverage",
      label: "Arborização",
      rawValue: coverage,
      unit: "%",
      level: "positive",
      description:
        `A cobertura arbórea estimada foi de ${coverage.toFixed(1)}%, `
        + "representando condição favorável ao conforto térmico e à experiência "
        + "do deslocamento a pé.",
      recommendations: [
        "Preservar a cobertura arbórea existente.",
        "Manter ações periódicas de manejo e conservação.",
      ],
    };
  }

  if (coverage >= 40) {
    return {
      factor: "treeCoverage",
      label: "Arborização",
      rawValue: coverage,
      unit: "%",
      level: "moderate",
      description:
        `A cobertura arbórea estimada foi de ${coverage.toFixed(1)}%. `
        + "A arborização oferece proteção parcial ao percurso, mas existem "
        + "segmentos que podem apresentar menor conforto térmico.",
      recommendations: [
        "Ampliar a arborização nos segmentos com menor cobertura.",
        "Priorizar espécies adequadas às calçadas e à infraestrutura urbana.",
      ],
    };
  }

  return {
    factor: "treeCoverage",
    label: "Arborização",
    rawValue: coverage,
    unit: "%",
    level: coverage < 20 ? "critical" : "high",
    description:
      `A cobertura arbórea estimada foi de apenas ${coverage.toFixed(1)}%. `
      + "A baixa disponibilidade de sombra pode reduzir o conforto do pedestre, "
      + "principalmente em períodos de maior temperatura.",
    recommendations: [
      "Implantar corredores verdes nos principais eixos de caminhada.",
      "Priorizar o plantio de árvores em trechos com maior exposição solar.",
      "Integrar arborização, calçadas e redes de infraestrutura no planejamento.",
    ],
  };
}

function analyzeTemperature(
  indicators: RouteIndicators,
): FactorImpact | null {
  const average = indicators.temperature?.averageCelsius;
  const maximum = indicators.temperature?.maximumCelsius;

  if (!isFiniteNumber(average)) {
    return null;
  }

  const maximumText = isFiniteNumber(maximum)
    ? `, com máximo estimado de ${maximum.toFixed(1)} °C`
    : "";

  if (average < 28) {
    return {
      factor: "temperature",
      label: "Temperatura de superfície",
      rawValue: average,
      unit: "°C",
      level: "positive",
      description:
        `A temperatura média estimada da superfície foi de ${average.toFixed(1)} °C${maximumText}, `
        + "indicando condição favorável de exposição térmica para o deslocamento.",
      recommendations: [
        "Preservar as condições de sombreamento e conforto térmico existentes.",
      ],
    };
  }

  if (average < 34) {
    return {
      factor: "temperature",
      label: "Temperatura de superfície",
      rawValue: average,
      unit: "°C",
      level: "moderate",
      description:
        `A temperatura média estimada da superfície foi de ${average.toFixed(1)} °C${maximumText}. `
        + "A exposição térmica merece atenção em trechos sem sombra, sobretudo nos horários mais quentes.",
      recommendations: [
        "Priorizar arborização e sombreamento nos trechos mais expostos.",
        "Prever áreas de descanso em rotas de maior permanência a pé.",
      ],
    };
  }

  return {
    factor: "temperature",
    label: "Temperatura de superfície",
    rawValue: average,
    unit: "°C",
    level: average >= 38 ? "critical" : "high",
    description:
      `A temperatura média estimada da superfície foi de ${average.toFixed(1)} °C${maximumText}. `
      + "O resultado indica exposição térmica elevada, que pode reduzir o conforto e a viabilidade do deslocamento a pé, especialmente para crianças, pessoas idosas e pessoas com mobilidade reduzida.",
    recommendations: [
      "Implantar arborização e soluções de sombreamento nos trechos prioritários.",
      "Integrar mobiliário urbano e áreas de descanso às rotas mais expostas.",
      "Priorizar trajetos com maior conforto térmico na sinalização e no planejamento.",
    ],
  };
}

function analyzePavement(
  indicators: RouteIndicators,
): FactorImpact | null {
  const pavement = indicators.pavement;

  if (!pavement) {
    return null;
  }

  const adequate = pavement.adequatePercent;

  if (adequate >= 80) {
    return {
      factor: "pavement",
      label: "Qualidade do pavimento",
      rawValue: adequate,
      unit: "%",
      level: "positive",
      description:
        `${adequate.toFixed(1)}% do percurso foi classificado como adequado. `
        + "A condição do pavimento favorece a continuidade do deslocamento.",
      recommendations: ["Manter ações preventivas de conservação das calçadas."],
    };
  }

  if (adequate >= 50) {
    return {
      factor: "pavement",
      label: "Qualidade do pavimento",
      rawValue: adequate,
      unit: "%",
      level: "moderate",
      description:
        `${adequate.toFixed(1)}% do percurso apresenta pavimento adequado. `
        + "Há limitações pontuais que podem afetar o conforto ou a acessibilidade.",
      recommendations: [
        "Mapear os segmentos descontínuos ou deteriorados.",
        "Priorizar a recuperação de calçadas próximas aos destinos essenciais.",
      ],
    };
  }

  return {
    factor: "pavement",
    label: "Qualidade do pavimento",
    rawValue: adequate,
    unit: "%",
    level: "high",
    description:
      `Somente ${adequate.toFixed(1)}% do percurso apresenta pavimento `
      + "considerado adequado. A condição representa uma barreira importante "
      + "ao deslocamento de pedestres.",
    recommendations: [
      "Recuperar os trechos de calçada em condições inadequadas.",
      "Eliminar desníveis, obstáculos e descontinuidades.",
      "Adotar padrões de acessibilidade nas intervenções.",
    ],
  };
}

function analyzeAccessibility(
  indicators: RouteIndicators,
): FactorImpact | null {
  const accessibility = indicators.accessibility;

  if (!accessibility) {
    return null;
  }

  const accessible = accessibility.accessibleSegmentsPercent;

  if (accessible >= 80) {
    return {
      factor: "accessibility",
      label: "Acessibilidade",
      rawValue: accessible,
      unit: "%",
      level: "positive",
      description: `${accessible.toFixed(1)}% dos segmentos analisados foram classificados como acessíveis.`,
      recommendations: ["Preservar a continuidade da rota acessível."],
    };
  }

  if (accessible >= 50) {
    return {
      factor: "accessibility",
      label: "Acessibilidade",
      rawValue: accessible,
      unit: "%",
      level: "moderate",
      description:
        `${accessible.toFixed(1)}% dos segmentos foram classificados como acessíveis. `
        + "A rota possui condições parciais de acessibilidade, com possíveis interrupções ao longo do percurso.",
      recommendations: [
        "Identificar e corrigir os pontos de interrupção da rota acessível.",
        "Priorizar conexões entre calçadas, rampas e travessias.",
      ],
    };
  }

  return {
    factor: "accessibility",
    label: "Acessibilidade",
    rawValue: accessible,
    unit: "%",
    level: "critical",
    description:
      `Apenas ${accessible.toFixed(1)}% dos segmentos foram classificados como acessíveis. `
      + "O resultado indica baixa continuidade para pessoas com mobilidade reduzida.",
    recommendations: [
      "Elaborar plano prioritário de adequação das calçadas.",
      "Implantar rampas e travessias acessíveis.",
      "Remover obstáculos e corrigir desníveis.",
    ],
  };
}

function getConfiguredWeight(
  reportData: ReportData,
  factor: FactorImpact["factor"],
): number | undefined {
  const weights = reportData.configuration?.weights;

  if (!weights) {
    return undefined;
  }

  const weight = weights[factor as keyof typeof weights];
  return isFiniteNumber(weight) ? weight : undefined;
}

function addCalculationContext(
  reportData: ReportData,
  factor: FactorImpact,
): FactorImpact {
  const weight = getConfiguredWeight(reportData, factor.factor);

  if (weight !== 0) {
    return factor;
  }

  return {
    ...factor,
    description:
      `${factor.description} Este fator foi identificado no diagnóstico, `
      + "mas não recebeu ponderação no cálculo do tempo ajustado desta simulação.",
  };
}

/** Analisa os fatores disponíveis e registra sua interpretação territorial. */
export function analyzeFactors(
  reportData: ReportData,
): FactorImpact[] {
  const { indicators } = reportData;

  return [
    analyzeSlope(indicators),
    analyzeTreeCoverage(indicators),
    analyzeTemperature(indicators),
    analyzePavement(indicators),
    analyzeAccessibility(indicators),
  ]
    .filter((factor): factor is FactorImpact => factor !== null)
    .map((factor) => addCalculationContext(reportData, factor));
}

/**
 * Constrói uma síntese determinística para a leitura gerencial do relatório.
 * Não substitui a análise técnica detalhada nem utiliza modelo de linguagem.
 */
export function buildExecutiveSummary(
  reportData: ReportData,
  factors: FactorImpact[] = analyzeFactors(reportData),
): ExecutiveSummary {
  const adjustedTime = reportData.indicators.adjustedTimeMinutes;
  const targetTime = reportData.configuration.targetTimeMinutes;
  const hasTimeResult = isFiniteNumber(adjustedTime) && isFiniteNumber(targetTime);
  const exceedsTarget = hasTimeResult && adjustedTime > targetTime;
  const criticalFactors = factors.filter((factor) => factor.level === "critical");
  const highFactors = factors.filter((factor) => factor.level === "high");
  const restrictiveFactors = [...criticalFactors, ...highFactors]
    .map((factor) => factor.label);

  if (exceedsTarget || criticalFactors.length > 0) {
    const timeMessage = exceedsTarget
      ? `O tempo ajustado de ${adjustedTime.toFixed(1)} min ultrapassa a meta de ${targetTime.toFixed(1)} min.`
      : "Foram identificados fatores críticos de restrição no território analisado.";

    return {
      status: "crítico",
      priority: "alta",
      headline: "Intervenção prioritária recomendada",
      detail: timeMessage,
      restrictiveFactors,
      recommendedAction:
        "Priorizar intervenção nos trechos críticos e avaliar rotas alternativas acessíveis antes de novos investimentos de expansão.",
    };
  }

  if (highFactors.length > 0) {
    return {
      status: "atenção",
      priority: "média",
      headline: "Acessibilidade dentro da meta, com restrições relevantes",
      detail: hasTimeResult
        ? `O tempo ajustado de ${adjustedTime.toFixed(1)} min atende à meta de ${targetTime.toFixed(1)} min, mas requer qualificação do percurso.`
        : "A simulação não disponibilizou o tempo ajustado, mas identificou restrições relevantes no percurso.",
      restrictiveFactors,
      recommendedAction:
        "Planejar intervenções graduais nos fatores restritivos e monitorar seus efeitos nas próximas simulações.",
    };
  }

  return {
    status: "adequado",
    priority: "baixa",
    headline: "Condição geral favorável",
    detail: hasTimeResult
      ? `O tempo ajustado de ${adjustedTime.toFixed(1)} min atende à meta de ${targetTime.toFixed(1)} min sem fatores classificados como elevados ou críticos.`
      : "Não foram identificados fatores classificados como elevados ou críticos com os dados disponíveis.",
    restrictiveFactors: [],
    recommendedAction:
      "Manter as condições existentes, monitorar a área e preservar os elementos favoráveis à acessibilidade.",
  };
}

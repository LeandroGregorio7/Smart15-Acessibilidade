import {
  FactorImpact,
  ReportData,
  RouteIndicators,
} from "./report.types";

function analyzeSlope(
  indicators: RouteIndicators,
): FactorImpact | null {
  const average =
    indicators.slope?.averagePercent;

  const maximum =
    indicators.slope?.maximumPercent;

  if (
    average === null
    || average === undefined
    || maximum === null
    || maximum === undefined
    || !Number.isFinite(average)
    || !Number.isFinite(maximum)
  ) {
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
        `A declividade média do percurso foi de ${average.toFixed(1)}%, ` +
        "indicando baixa influência sobre o esforço e o tempo de caminhada.",
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
        `A declividade média foi de ${average.toFixed(1)}%, com valor máximo ` +
        `de ${maximum.toFixed(1)}%. O fator apresenta influência moderada ` +
        "sobre o esforço necessário e a velocidade de deslocamento.",
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
      `A declividade média foi de ${average.toFixed(1)}%, alcançando ` +
      `${maximum.toFixed(1)}% em determinados trechos. Esse fator representa ` +
      "uma limitação relevante à caminhabilidade, especialmente para pessoas " +
      "idosas, crianças e pessoas com mobilidade reduzida.",
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
  const coverage =
    indicators.treeCoverage?.averagePercent;

  if (
    coverage === null
    || coverage === undefined
    || !Number.isFinite(coverage)
  ) {
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
        `A cobertura arbórea estimada foi de ${coverage.toFixed(1)}%, ` +
        "representando condição favorável ao conforto térmico e à experiência " +
        "do deslocamento a pé.",
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
        `A cobertura arbórea estimada foi de ${coverage.toFixed(1)}%. ` +
        "A arborização oferece proteção parcial ao percurso, mas existem " +
        "segmentos que podem apresentar menor conforto térmico.",
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
      `A cobertura arbórea estimada foi de apenas ${coverage.toFixed(1)}%. ` +
      "A baixa disponibilidade de sombra pode reduzir o conforto do pedestre, " +
      "principalmente em períodos de maior temperatura.",
    recommendations: [
      "Implantar corredores verdes nos principais eixos de caminhada.",
      "Priorizar o plantio de árvores em trechos com maior exposição solar.",
      "Integrar arborização, calçadas e redes de infraestrutura no planejamento.",
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
        `${adequate.toFixed(1)}% do percurso foi classificado como adequado. ` +
        "A condição do pavimento favorece a continuidade do deslocamento.",
      recommendations: [
        "Manter ações preventivas de conservação das calçadas.",
      ],
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
        `${adequate.toFixed(1)}% do percurso apresenta pavimento adequado. ` +
        "Há limitações pontuais que podem afetar o conforto ou a acessibilidade.",
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
      `Somente ${adequate.toFixed(1)}% do percurso apresenta pavimento ` +
      "considerado adequado. A condição representa uma barreira importante " +
      "ao deslocamento de pedestres.",
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
      description:
        `${accessible.toFixed(1)}% dos segmentos analisados foram ` +
        "classificados como acessíveis.",
      recommendations: [
        "Preservar a continuidade da rota acessível.",
      ],
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
        `${accessible.toFixed(1)}% dos segmentos foram classificados como ` +
        "acessíveis. A rota possui condições parciais de acessibilidade, " +
        "com possíveis interrupções ao longo do percurso.",
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
      `Apenas ${accessible.toFixed(1)}% dos segmentos foram classificados ` +
      "como acessíveis. O resultado indica baixa continuidade para pessoas " +
      "com mobilidade reduzida.",
    recommendations: [
      "Elaborar plano prioritário de adequação das calçadas.",
      "Implantar rampas e travessias acessíveis.",
      "Remover obstáculos e corrigir desníveis.",
    ],
  };
}

export function analyzeFactors(
  reportData: ReportData,
): FactorImpact[] {
  const { indicators } = reportData;

  return [
    analyzeSlope(indicators),
    analyzeTreeCoverage(indicators),
    analyzePavement(indicators),
    analyzeAccessibility(indicators),
  ].filter((factor): factor is FactorImpact => factor !== null);
}

import {
  FactorImpact,
  ReportData,
  RouteIndicators,
} from "./report.types";

import {
  DEFAULT_LOCALE,
  t,
} from "../i18n/i18n";

import type {
  SupportedLocale,
} from "../i18n/i18n.types";

import {
  formatNumber,
} from "./report.utils";

export type ExecutiveSummary = {
  status: string;
  priority: string;
  headline: string;
  detail: string;
  restrictiveFactors: string[];
  recommendedAction: string;
};

function getReportLocale(
  reportData: ReportData,
): SupportedLocale {
  return reportData.locale ?? DEFAULT_LOCALE;
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number"
    && Number.isFinite(value)
  );
}

function analyzeSlope(
  indicators: RouteIndicators,
  locale: SupportedLocale,
): FactorImpact | null {
  const average =
    indicators.slope?.averagePercent;

  const maximum =
    indicators.slope?.maximumPercent;

  if (
    !isFiniteNumber(average)
    || !isFiniteNumber(maximum)
  ) {
    return null;
  }

  if (average < 3) {
    return {
      factor: "slope",
      label: t(
        "factor.slope",
        {},
        locale,
      ),
      rawValue: average,
      unit: "%",
      level: "low",
      description: t(
        "factor.slope.description.low",
        {
          average: formatNumber(
            average,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [],
    };
  }

  if (average < 8) {
    return {
      factor: "slope",
      label: t(
        "factor.slope",
        {},
        locale,
      ),
      rawValue: average,
      unit: "%",
      level: "moderate",
      description: t(
        "factor.slope.description.moderate",
        {
          average: formatNumber(
            average,
            1,
            locale,
          ),
          maximum: formatNumber(
            maximum,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.slope.recommendation.alternativeRoutes",
          {},
          locale,
        ),
        t(
          "factor.slope.recommendation.sidewalkContinuity",
          {},
          locale,
        ),
        t(
          "factor.slope.recommendation.accessibility",
          {},
          locale,
        ),
      ],
    };
  }

  return {
    factor: "slope",
    label: t(
      "factor.slope",
      {},
      locale,
    ),
    rawValue: average,
    unit: "%",
    level:
      average >= 12
        ? "critical"
        : "high",
    description: t(
      "factor.slope.description.high",
      {
        average: formatNumber(
          average,
          1,
          locale,
        ),
        maximum: formatNumber(
          maximum,
          1,
          locale,
        ),
      },
      locale,
    ),
    recommendations: [
      t(
        "factor.slope.recommendation.accessibleRoutes",
        {},
        locale,
      ),
      t(
        "factor.slope.recommendation.restAreas",
        {},
        locale,
      ),
      t(
        "factor.slope.recommendation.ramps",
        {},
        locale,
      ),
      t(
        "factor.slope.recommendation.signage",
        {},
        locale,
      ),
    ],
  };
}

function analyzeTreeCoverage(
  indicators: RouteIndicators,
  locale: SupportedLocale,
): FactorImpact | null {
  const coverage =
    indicators.treeCoverage?.averagePercent;

  if (!isFiniteNumber(coverage)) {
    return null;
  }

  if (coverage >= 70) {
    return {
      factor: "treeCoverage",
      label: t(
        "factor.treeCoverage",
        {},
        locale,
      ),
      rawValue: coverage,
      unit: "%",
      level: "positive",
      description: t(
        "factor.treeCoverage.description.positive",
        {
          coverage: formatNumber(
            coverage,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.treeCoverage.recommendation.preserve",
          {},
          locale,
        ),
        t(
          "factor.treeCoverage.recommendation.maintenance",
          {},
          locale,
        ),
      ],
    };
  }

  if (coverage >= 40) {
    return {
      factor: "treeCoverage",
      label: t(
        "factor.treeCoverage",
        {},
        locale,
      ),
      rawValue: coverage,
      unit: "%",
      level: "moderate",
      description: t(
        "factor.treeCoverage.description.moderate",
        {
          coverage: formatNumber(
            coverage,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.treeCoverage.recommendation.expand",
          {},
          locale,
        ),
        t(
          "factor.treeCoverage.recommendation.species",
          {},
          locale,
        ),
      ],
    };
  }

  return {
    factor: "treeCoverage",
    label: t(
      "factor.treeCoverage",
      {},
      locale,
    ),
    rawValue: coverage,
    unit: "%",
    level:
      coverage < 20
        ? "critical"
        : "high",
    description: t(
      "factor.treeCoverage.description.high",
      {
        coverage: formatNumber(
          coverage,
          1,
          locale,
        ),
      },
      locale,
    ),
    recommendations: [
      t(
        "factor.treeCoverage.recommendation.greenCorridors",
        {},
        locale,
      ),
      t(
        "factor.treeCoverage.recommendation.planting",
        {},
        locale,
      ),
      t(
        "factor.treeCoverage.recommendation.infrastructure",
        {},
        locale,
      ),
    ],
  };
}

function analyzeTemperature(
  indicators: RouteIndicators,
  locale: SupportedLocale,
): FactorImpact | null {
  const average =
    indicators.temperature?.averageCelsius;

  const maximum =
    indicators.temperature?.maximumCelsius;

  if (!isFiniteNumber(average)) {
    return null;
  }

  const maximumText =
    isFiniteNumber(maximum)
      ? t(
          "factor.temperature.maximum",
          {
            maximum: formatNumber(
              maximum,
              1,
              locale,
            ),
          },
          locale,
        )
      : "";

  if (average < 28) {
    return {
      factor: "temperature",
      label: t(
        "factor.temperature",
        {},
        locale,
      ),
      rawValue: average,
      unit: "°C",
      level: "positive",
      description: t(
        "factor.temperature.description.positive",
        {
          average: formatNumber(
            average,
            1,
            locale,
          ),
          maximumText,
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.temperature.recommendation.preserve",
          {},
          locale,
        ),
      ],
    };
  }

  if (average < 34) {
    return {
      factor: "temperature",
      label: t(
        "factor.temperature",
        {},
        locale,
      ),
      rawValue: average,
      unit: "°C",
      level: "moderate",
      description: t(
        "factor.temperature.description.moderate",
        {
          average: formatNumber(
            average,
            1,
            locale,
          ),
          maximumText,
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.temperature.recommendation.shade",
          {},
          locale,
        ),
        t(
          "factor.temperature.recommendation.restAreas",
          {},
          locale,
        ),
      ],
    };
  }

  return {
    factor: "temperature",
    label: t(
      "factor.temperature",
      {},
      locale,
    ),
    rawValue: average,
    unit: "°C",
    level:
      average >= 38
        ? "critical"
        : "high",
    description: t(
      "factor.temperature.description.high",
      {
        average: formatNumber(
          average,
          1,
          locale,
        ),
        maximumText,
      },
      locale,
    ),
    recommendations: [
      t(
        "factor.temperature.recommendation.priorityShade",
        {},
        locale,
      ),
      t(
        "factor.temperature.recommendation.furniture",
        {},
        locale,
      ),
      t(
        "factor.temperature.recommendation.coolerRoutes",
        {},
        locale,
      ),
    ],
  };
}

function analyzePavement(
  indicators: RouteIndicators,
  locale: SupportedLocale,
): FactorImpact | null {
  const pavement =
    indicators.pavement;

  if (!pavement) {
    return null;
  }

  const adequate =
    pavement.adequatePercent;

  if (adequate >= 80) {
    return {
      factor: "pavement",
      label: t(
        "factor.pavement",
        {},
        locale,
      ),
      rawValue: adequate,
      unit: "%",
      level: "positive",
      description: t(
        "factor.pavement.description.positive",
        {
          adequate: formatNumber(
            adequate,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.pavement.recommendation.maintenance",
          {},
          locale,
        ),
      ],
    };
  }

  if (adequate >= 50) {
    return {
      factor: "pavement",
      label: t(
        "factor.pavement",
        {},
        locale,
      ),
      rawValue: adequate,
      unit: "%",
      level: "moderate",
      description: t(
        "factor.pavement.description.moderate",
        {
          adequate: formatNumber(
            adequate,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.pavement.recommendation.mapSegments",
          {},
          locale,
        ),
        t(
          "factor.pavement.recommendation.recovery",
          {},
          locale,
        ),
      ],
    };
  }

  return {
    factor: "pavement",
    label: t(
      "factor.pavement",
      {},
      locale,
    ),
    rawValue: adequate,
    unit: "%",
    level: "high",
    description: t(
      "factor.pavement.description.high",
      {
        adequate: formatNumber(
          adequate,
          1,
          locale,
        ),
      },
      locale,
    ),
    recommendations: [
      t(
        "factor.pavement.recommendation.repair",
        {},
        locale,
      ),
      t(
        "factor.pavement.recommendation.obstacles",
        {},
        locale,
      ),
      t(
        "factor.pavement.recommendation.standards",
        {},
        locale,
      ),
    ],
  };
}

function analyzeAccessibility(
  indicators: RouteIndicators,
  locale: SupportedLocale,
): FactorImpact | null {
  const accessibility =
    indicators.accessibility;

  if (!accessibility) {
    return null;
  }

  const accessible =
    accessibility.accessibleSegmentsPercent;

  if (accessible >= 80) {
    return {
      factor: "accessibility",
      label: t(
        "factor.accessibility",
        {},
        locale,
      ),
      rawValue: accessible,
      unit: "%",
      level: "positive",
      description: t(
        "factor.accessibility.description.positive",
        {
          accessible: formatNumber(
            accessible,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.accessibility.recommendation.preserve",
          {},
          locale,
        ),
      ],
    };
  }

  if (accessible >= 50) {
    return {
      factor: "accessibility",
      label: t(
        "factor.accessibility",
        {},
        locale,
      ),
      rawValue: accessible,
      unit: "%",
      level: "moderate",
      description: t(
        "factor.accessibility.description.moderate",
        {
          accessible: formatNumber(
            accessible,
            1,
            locale,
          ),
        },
        locale,
      ),
      recommendations: [
        t(
          "factor.accessibility.recommendation.interruptions",
          {},
          locale,
        ),
        t(
          "factor.accessibility.recommendation.connections",
          {},
          locale,
        ),
      ],
    };
  }

  return {
    factor: "accessibility",
    label: t(
      "factor.accessibility",
      {},
      locale,
    ),
    rawValue: accessible,
    unit: "%",
    level: "critical",
    description: t(
      "factor.accessibility.description.critical",
      {
        accessible: formatNumber(
          accessible,
          1,
          locale,
        ),
      },
      locale,
    ),
    recommendations: [
      t(
        "factor.accessibility.recommendation.plan",
        {},
        locale,
      ),
      t(
        "factor.accessibility.recommendation.ramps",
        {},
        locale,
      ),
      t(
        "factor.accessibility.recommendation.removeObstacles",
        {},
        locale,
      ),
    ],
  };
}

function getConfiguredWeight(
  reportData: ReportData,
  factor: FactorImpact["factor"],
): number | undefined {
  const weights =
    reportData.configuration?.weights;

  if (!weights) {
    return undefined;
  }

  const weight =
    weights[
      factor as keyof typeof weights
    ];

  return isFiniteNumber(weight)
    ? weight
    : undefined;
}

function addCalculationContext(
  reportData: ReportData,
  factor: FactorImpact,
): FactorImpact {
  const weight =
    getConfiguredWeight(
      reportData,
      factor.factor,
    );

  if (weight !== 0) {
    return factor;
  }

  const locale =
    getReportLocale(reportData);

  return {
    ...factor,
    description: t(
      "factor.calculation.noWeight",
      {
        description:
          factor.description,
      },
      locale,
    ),
  };
}

/**
 * Analisa os fatores disponíveis e registra
 * sua interpretação territorial.
 */
export function analyzeFactors(
  reportData: ReportData,
): FactorImpact[] {
  const {
    indicators,
  } = reportData;

  const locale =
    getReportLocale(reportData);

  return [
    analyzeSlope(
      indicators,
      locale,
    ),
    analyzeTreeCoverage(
      indicators,
      locale,
    ),
    analyzeTemperature(
      indicators,
      locale,
    ),
    analyzePavement(
      indicators,
      locale,
    ),
    analyzeAccessibility(
      indicators,
      locale,
    ),
  ]
    .filter(
      (
        factor,
      ): factor is FactorImpact =>
        factor !== null,
    )
    .map(
      (factor) =>
        addCalculationContext(
          reportData,
          factor,
        ),
    );
}

/**
 * Constrói uma síntese determinística
 * para a leitura gerencial do relatório.
 *
 * Não substitui a análise técnica detalhada
 * nem utiliza modelo de linguagem.
 */
export function buildExecutiveSummary(
  reportData: ReportData,
  factors: FactorImpact[] =
    analyzeFactors(reportData),
): ExecutiveSummary {
  const locale =
    getReportLocale(reportData);

  const adjustedTime =
    reportData
      .indicators
      .adjustedTimeMinutes;

  const targetTime =
    reportData
      .configuration
      .targetTimeMinutes;

  const hasTimeResult =
    isFiniteNumber(adjustedTime)
    && isFiniteNumber(targetTime);

  const exceedsTarget =
    hasTimeResult
    && adjustedTime > targetTime;

  const criticalFactors =
    factors.filter(
      (factor) =>
        factor.level === "critical",
    );

  const highFactors =
    factors.filter(
      (factor) =>
        factor.level === "high",
    );

  const restrictiveFactors = [
    ...criticalFactors,
    ...highFactors,
  ].map(
    (factor) => factor.label,
  );

  if (
    exceedsTarget
    || criticalFactors.length > 0
  ) {
    const detail =
      exceedsTarget
        ? t(
            "executive.critical.timeExceeded",
            {
              adjusted: formatNumber(
                adjustedTime,
                1,
                locale,
              ),
              target: formatNumber(
                targetTime,
                1,
                locale,
              ),
            },
            locale,
          )
        : t(
            "executive.critical.factors",
            {},
            locale,
          );

    return {
      status: t(
        "executive.status.critical",
        {},
        locale,
      ),
      priority: t(
        "executive.priority.high",
        {},
        locale,
      ),
      headline: t(
        "executive.critical.headline",
        {},
        locale,
      ),
      detail,
      restrictiveFactors,
      recommendedAction: t(
        "executive.critical.action",
        {},
        locale,
      ),
    };
  }

  if (highFactors.length > 0) {
    return {
      status: t(
        "executive.status.attention",
        {},
        locale,
      ),
      priority: t(
        "executive.priority.medium",
        {},
        locale,
      ),
      headline: t(
        "executive.attention.headline",
        {},
        locale,
      ),
      detail:
        hasTimeResult
          ? t(
              "executive.attention.withTime",
              {
                adjusted:
                  formatNumber(
                    adjustedTime,
                    1,
                    locale,
                  ),
                target:
                  formatNumber(
                    targetTime,
                    1,
                    locale,
                  ),
              },
              locale,
            )
          : t(
              "executive.attention.withoutTime",
              {},
              locale,
            ),
      restrictiveFactors,
      recommendedAction: t(
        "executive.attention.action",
        {},
        locale,
      ),
    };
  }

  return {
    status: t(
      "executive.status.adequate",
      {},
      locale,
    ),
    priority: t(
      "executive.priority.low",
      {},
      locale,
    ),
    headline: t(
      "executive.adequate.headline",
      {},
      locale,
    ),
    detail:
      hasTimeResult
        ? t(
            "executive.adequate.withTime",
            {
              adjusted:
                formatNumber(
                  adjustedTime,
                  1,
                  locale,
                ),
              target:
                formatNumber(
                  targetTime,
                  1,
                  locale,
                ),
            },
            locale,
          )
        : t(
            "executive.adequate.withoutTime",
            {},
            locale,
          ),
    restrictiveFactors: [],
    recommendedAction: t(
      "executive.adequate.action",
      {},
      locale,
    ),
  };
}

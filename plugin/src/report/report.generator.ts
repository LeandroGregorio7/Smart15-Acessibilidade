import {
  analyzeFactors,
  buildExecutiveSummary,
} from "./report.rules";

import { REPORT_CSS } from "./report.css";

import type {
  FactorImpact,
  ReportData,
} from "./report.types";

import {
  escapeHtml,
  formatArea,
  formatDateTime,
  formatDistance,
  formatNumber,
  uniqueStrings,
} from "./report.utils";

import {
  DEFAULT_LOCALE,
  t,
} from "../i18n/i18n";

import type {
  SupportedLocale,
} from "../i18n/i18n.types";

function getLocale(
  report: ReportData,
): SupportedLocale {
  return report.locale ?? DEFAULT_LOCALE;
}

function levelLabel(
  factor: FactorImpact,
  locale: SupportedLocale,
): string {
  return t(
    `level.${factor.level}`,
    {},
    locale,
  );
}

function renderMetric(
  label: string,
  value: string,
): string {
  return `
    <div class="metric">
      <span class="metric-label">
        ${escapeHtml(label)}
      </span>

      <span class="metric-value">
        ${escapeHtml(value)}
      </span>
    </div>
  `;
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number"
    && Number.isFinite(value)
  );
}

function formatOptionalDistance(
  value: number | null | undefined,
  locale: SupportedLocale,
): string {
  return isFiniteNumber(value)
    ? formatDistance(
        value,
        locale,
      )
    : t(
        "common.notAvailable",
        {},
        locale,
      );
}

function formatOptionalMinutes(
  value: number | null | undefined,
  locale: SupportedLocale,
): string {
  return isFiniteNumber(value)
    ? `${formatNumber(
        value,
        2,
        locale,
      )} min`
    : t(
        "common.notAvailable",
        {},
        locale,
      );
}

function formatOptionalSpeed(
  value: number | null | undefined,
  locale: SupportedLocale,
): string {
  return isFiniteNumber(value)
    ? `${formatNumber(
        value,
        2,
        locale,
      )} km/h`
    : t(
        "common.notAvailable",
        {},
        locale,
      );
}

function formatOptionalArea(
  value: number | null | undefined,
  locale: SupportedLocale,
): string {
  return isFiniteNumber(value)
    ? formatArea(
        value,
        locale,
      )
    : t(
        "common.notAvailable",
        {},
        locale,
      );
}

function renderFactor(
  factor: FactorImpact,
  locale: SupportedLocale,
): string {
  const impact =
    factor.impactMinutes === undefined
      ? ""
      : `
        <p>
          <strong>
            ${escapeHtml(
              t(
                "report.factor.timeImpact",
                {},
                locale,
              ),
            )}
          </strong>

          ${factor.impactMinutes >= 0 ? "+" : ""}

          ${formatNumber(
            factor.impactMinutes,
            2,
            locale,
          )} min
        </p>
      `;

  const recommendations =
    factor.recommendations.length === 0
      ? `
        <p>
          ${escapeHtml(
            t(
              "report.factor.noRecommendations",
              {},
              locale,
            ),
          )}
        </p>
      `
      : `
        <ul>
          ${factor.recommendations
            .map(
              (item) =>
                `<li>${escapeHtml(item)}</li>`,
            )
            .join("")}
        </ul>
      `;

  return `
    <article
      class="factor factor-${factor.level}"
    >
      <h3>
        ${escapeHtml(factor.label)}

        <span class="classification">
          ${escapeHtml(
            levelLabel(
              factor,
              locale,
            ),
          )}
        </span>
      </h3>

      <p>
        <strong>
          ${escapeHtml(
            t(
              "report.factor.observedValue",
              {},
              locale,
            ),
          )}
        </strong>

        ${formatNumber(
          factor.rawValue,
          1,
          locale,
        )}
        ${escapeHtml(factor.unit)}
      </p>

      <p>
        ${escapeHtml(factor.description)}
      </p>

      ${impact}

      <h4>
        ${escapeHtml(
          t(
            "report.factor.relatedRecommendations",
            {},
            locale,
          ),
        )}
      </h4>

      ${recommendations}
    </article>
  `;
}

function renderMap(
  map:
    | {
        title: string;
        description?: string;
        dataUrl: string;
      }
    | undefined,
): string {
  if (!map) {
    return "";
  }

  return `
    <figure class="map-figure">
      <img
        src="${escapeHtml(map.dataUrl)}"
        alt="${escapeHtml(map.title)}"
      >

      <figcaption>
        <strong>
          ${escapeHtml(map.title)}.
        </strong>

        ${escapeHtml(
          map.description ?? "",
        )}
      </figcaption>
    </figure>
  `;
}

function buildSummary(
  report: ReportData,
  factors: FactorImpact[],
): string {
  const {
    indicators,
    configuration,
  } = report;

  const locale =
    getLocale(report);

  const adjustedTime =
    indicators.adjustedTimeMinutes;

  const restrictiveFactors =
    factors
      .filter(
        (factor) =>
          factor.level === "high"
          || factor.level === "critical",
      )
      .map(
        (factor) =>
          factor.label,
      );

  let summary: string;

  if (isFiniteNumber(adjustedTime)) {
    const withinTarget =
      adjustedTime
      <= configuration.targetTimeMinutes;

    summary = withinTarget
      ? t(
          "report.summary.withinTarget",
          {
            target: formatNumber(
              configuration.targetTimeMinutes,
              1,
              locale,
            ),
          },
          locale,
        )
      : t(
          "report.summary.aboveTarget",
          {
            target: formatNumber(
              configuration.targetTimeMinutes,
              1,
              locale,
            ),
          },
          locale,
        );
  } else {
    summary = t(
      "report.summary.noAdjustedTime",
      {},
      locale,
    );
  }

  if (
    restrictiveFactors.length > 0
  ) {
    summary += " "
      + t(
        "report.summary.restrictiveFactors",
        {
          factors:
            restrictiveFactors.join(", "),
        },
        locale,
      );
  } else {
    summary += " "
      + t(
        "report.summary.noRestrictiveFactors",
        {},
        locale,
      );
  }

  return summary;
}

function getSelectedProfiles(
  report: ReportData,
): string[] {
  const labels =
    report.configuration
      ?.selectedProfileLabels;

  if (Array.isArray(labels)) {
    return labels.filter(
      (item): item is string =>
        typeof item === "string"
        && Boolean(item.trim()),
    );
  }

  const codes =
    report.configuration
      ?.selectedProfiles;

  return Array.isArray(codes)
    ? codes.filter(
        (item): item is string =>
          typeof item === "string"
          && Boolean(item.trim()),
      )
    : [];
}

function getProfileCodes(
  report: ReportData,
): string[] {
  const profiles =
    report.configuration
      ?.selectedProfiles;

  return Array.isArray(profiles)
    ? profiles.map(String)
    : [];
}

function getMobilityContext(
  report: ReportData,
): {
  title: string;
  shortLabel: string;
  movementDescription: string;
  speedLabel: string;
  footerLabel: string;
} {
  const locale =
    getLocale(report);

  const profiles =
    getProfileCodes(report)
      .map(
        (profile) =>
          profile.toLowerCase(),
      );

  const hasBike =
    profiles.some(
      (profile) =>
        profile.includes("bike")
        || profile.includes("bicicleta")
        || profile.includes("ciclista"),
    );

  const hasPedestrian =
    profiles.some(
      (profile) =>
        profile.includes("pedestre")
        || profile.includes("walking")
        || profile.includes("pe"),
    );

  if (
    hasBike
    && hasPedestrian
  ) {
    return {
      title: t(
        "report.mobility.mixed.title",
        {},
        locale,
      ),
      shortLabel: t(
        "report.mobility.mixed.short",
        {},
        locale,
      ),
      movementDescription: t(
        "report.mobility.mixed.movement",
        {},
        locale,
      ),
      speedLabel: t(
        "report.mobility.mixed.speed",
        {},
        locale,
      ),
      footerLabel: t(
        "report.mobility.mixed.footer",
        {},
        locale,
      ),
    };
  }

  if (hasBike) {
    return {
      title: t(
        "report.mobility.bike.title",
        {},
        locale,
      ),
      shortLabel: t(
        "report.mobility.bike.short",
        {},
        locale,
      ),
      movementDescription: t(
        "report.mobility.bike.movement",
        {},
        locale,
      ),
      speedLabel: t(
        "report.mobility.bike.speed",
        {},
        locale,
      ),
      footerLabel: t(
        "report.mobility.bike.footer",
        {},
        locale,
      ),
    };
  }

  return {
    title: t(
      "report.mobility.walk.title",
      {},
      locale,
    ),
    shortLabel: t(
      "report.mobility.walk.short",
      {},
      locale,
    ),
    movementDescription: t(
      "report.mobility.walk.movement",
      {},
      locale,
    ),
    speedLabel: t(
      "report.mobility.walk.speed",
      {},
      locale,
    ),
    footerLabel: t(
      "report.mobility.walk.footer",
      {},
      locale,
    ),
  };
}

export function generateReportHtml(
  report: ReportData,
): string {
  if (!report) {
    throw new Error(
      "Report data was not provided.",
    );
  }

  const locale =
    getLocale(report);

  const identification =
    report.identification;

  const configuration =
    report.configuration;

  const indicators =
    report.indicators;

  if (!identification) {
    throw new Error(
      "Incompatible report: the adapter did not provide identification.",
    );
  }

  if (!configuration) {
    throw new Error(
      "Incompatible report: the adapter did not provide configuration.",
    );
  }

  if (!indicators) {
    throw new Error(
      "Incompatible report: the adapter did not provide indicators.",
    );
  }

  const factors =
    analyzeFactors(report);

  const executiveSummary =
    buildExecutiveSummary(
      report,
      factors,
    );

  const restrictiveFactorsText =
    executiveSummary
      .restrictiveFactors
      .length > 0
      ? executiveSummary
          .restrictiveFactors
          .join(", ")
      : t(
          "report.executive.noPriorityFactors",
          {},
          locale,
        );

  const mobility =
    getMobilityContext(report);

  const selectedProfiles =
    getSelectedProfiles(report);

  const profilesText =
    selectedProfiles.length > 0
      ? selectedProfiles.join(", ")
      : t(
          "common.notProvided",
          {},
          locale,
        );

  const recommendations =
    uniqueStrings(
      factors.flatMap(
        (factor) =>
          factor.recommendations,
      ),
    );

  const adjustedDifference =
    isFiniteNumber(
      indicators.adjustedTimeMinutes,
    )
    && isFiniteNumber(
      indicators.baseTimeMinutes,
    )
      ? indicators.adjustedTimeMinutes
        - indicators.baseTimeMinutes
      : null;

  const summary =
    buildSummary(
      report,
      factors,
    );

  const maps = [
    renderMap(
      report.maps?.overview,
    ),
    renderMap(
      report.maps?.route,
    ),
    renderMap(
      report.maps?.isochrone,
    ),
  ].join("");

  return `
    <!DOCTYPE html>

    <html lang="${escapeHtml(locale)}">
      <head>
        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >

        <title>
          ${escapeHtml(
            mobility.shortLabel,
          )}
          -
          ${escapeHtml(
            identification.destinationName
            ?? t(
              "report.destination.notProvided",
              {},
              locale,
            ),
          )}
        </title>

        <style>
          ${REPORT_CSS}
        </style>
      </head>

      <body>
        <div class="report-actions">
          <button
            type="button"
            class="report-action-button"
            id="download-pdf-button"
            title="${escapeHtml(
              t(
                "report.print.title",
                {},
                locale,
              ),
            )}"
          >
            ${escapeHtml(
              t(
                "report.print.button",
                {},
                locale,
              ),
            )}
          </button>
        </div>

        <main class="report">
          <header class="report-header">
            <h1>
              ${escapeHtml(
                mobility.title,
              )}
            </h1>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.header.area",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                identification.areaName
                ?? t(
                  "common.notProvided",
                  {},
                  locale,
                ),
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.header.destination",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                identification.destinationName
                ?? t(
                  "report.destination.notProvided",
                  {},
                  locale,
                ),
              )}

              —
              ${escapeHtml(
                identification.destinationType
                ?? t(
                  "common.notProvided",
                  {},
                  locale,
                ),
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.header.generatedAt",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                formatDateTime(
                  identification.generatedAt
                    ?? new Date().toISOString(),
                  locale,
                ),
              )}
            </p>
          </header>

          <section
            class="executive-summary"
          >
            <h2>
              ${escapeHtml(
                t(
                  "report.section.executive",
                  {},
                  locale,
                ),
              )}
            </h2>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.executive.status",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                executiveSummary.status,
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.executive.priority",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                executiveSummary.priority,
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.executive.conclusion",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                executiveSummary.headline,
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.executive.analysis",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                executiveSummary.detail,
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.executive.priorityFactors",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                restrictiveFactorsText,
              )}
            </p>

            <p>
              <strong>
                ${escapeHtml(
                  t(
                    "report.executive.action",
                    {},
                    locale,
                  ),
                )}
              </strong>

              ${escapeHtml(
                executiveSummary
                  .recommendedAction,
              )}
            </p>
          </section>

          <section>
            <h2>
              ${escapeHtml(
                t(
                  "report.section.identification",
                  {},
                  locale,
                ),
              )}
            </h2>

            <table>
              <tbody>
                <tr>
                  <th>
                    ${escapeHtml(
                      t(
                        "report.identification.analysisId",
                        {},
                        locale,
                      ),
                    )}
                  </th>

                  <td>
                    ${escapeHtml(
                      identification.analysisId
                      ?? t(
                        "common.notProvided",
                        {},
                        locale,
                      ),
                    )}
                  </td>
                </tr>

                <tr>
                  <th>
                    ${escapeHtml(
                      t(
                        "report.identification.location",
                        {},
                        locale,
                      ),
                    )}
                  </th>

                  <td>
                    ${escapeHtml(
                      identification.municipality
                      ?? t(
                        "common.notProvided",
                        {},
                        locale,
                      ),
                    )}

                    ${
                      identification.state
                        ? ` / ${escapeHtml(
                            identification.state,
                          )}`
                        : ""
                    }
                  </td>
                </tr>

                <tr>
                  <th>
                    ${escapeHtml(
                      t(
                        "report.identification.area",
                        {},
                        locale,
                      ),
                    )}
                  </th>

                  <td>
                    ${escapeHtml(
                      formatArea(
                        indicators.areaSquareMeters,
                        locale,
                      ),
                    )}
                  </td>
                </tr>

                <tr>
                  <th>
                    ${escapeHtml(
                      t(
                        "report.identification.destination",
                        {},
                        locale,
                      ),
                    )}
                  </th>

                  <td>
                    ${escapeHtml(
                      identification.destinationName
                      ?? t(
                        "report.destination.notProvided",
                        {},
                        locale,
                      ),
                    )}

                    (${escapeHtml(
                      identification.destinationType
                      ?? t(
                        "common.notProvided",
                        {},
                        locale,
                      ),
                    )})
                  </td>
                </tr>

                <tr>
                  <th>
                    ${escapeHtml(
                      t(
                        "report.identification.crs",
                        {},
                        locale,
                      ),
                    )}
                  </th>

                  <td>
                    ${escapeHtml(
                      identification
                        .coordinateReferenceSystem
                      ?? t(
                        "common.notProvided",
                        {},
                        locale,
                      ),
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              ${escapeHtml(
                t(
                  "report.identification.analysisConsiders",
                  {},
                  locale,
                ),
              )}

              <strong>
                ${escapeHtml(
                  mobility
                    .movementDescription,
                )}
              </strong>

              ${escapeHtml(
                t(
                  "report.identification.to",
                  {},
                  locale,
                ),
              )}

              <strong>
                ${escapeHtml(
                  identification.destinationName
                  ?? t(
                    "report.destination.notProvided",
                    {},
                    locale,
                  ),
                )}
              </strong>.

              ${
                isFiniteNumber(
                  indicators.distanceMeters,
                )
                  ? `
                    ${escapeHtml(
                      t(
                        "report.identification.networkDistance",
                        {},
                        locale,
                      ),
                    )}

                    <strong>
                      ${escapeHtml(
                        formatDistance(
                          indicators.distanceMeters,
                          locale,
                        ),
                      )}
                    </strong>.
                  `
                  : `
                    ${escapeHtml(
                      t(
                        "report.identification.noNetworkDistance",
                        {},
                        locale,
                      ),
                    )}
                  `
              }
            </p>
          </section>

          <section>
            <h2>
              ${escapeHtml(
                t(
                  "report.section.configuration",
                  {},
                  locale,
                ),
              )}
            </h2>

            <table>
              <thead>
                <tr>
                  <th>
                    ${escapeHtml(
                      t(
                        "report.configuration.parameter",
                        {},
                        locale,
                      ),
                    )}
                  </th>

                  <th>
                    ${escapeHtml(
                      t(
                        "report.configuration.value",
                        {},
                        locale,
                      ),
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    ${escapeHtml(
                      t(
                        "report.configuration.targetTime",
                        {},
                        locale,
                      ),
                    )}
                  </td>

                  <td>
                    ${formatNumber(
                      configuration.targetTimeMinutes,
                      1,
                      locale,
                    )} min
                  </td>
                </tr>

                <tr>
                  <td>
                    ${escapeHtml(
                      t(
                        "report.configuration.profiles",
                        {},
                        locale,
                      ),
                    )}
                  </td>

                  <td>
                    ${escapeHtml(
                      profilesText,
                    )}
                  </td>
                </tr>

                <tr>
                  <td>
                    ${escapeHtml(
                      mobility.speedLabel,
                    )}
                  </td>

                  <td>
                    ${formatNumber(
                      configuration
                        .baseWalkingSpeedKmH,
                      2,
                      locale,
                    )} km/h
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>
              ${escapeHtml(
                t(
                  "report.section.results",
                  {},
                  locale,
                ),
              )}
            </h2>

            <div class="metrics">
              ${renderMetric(
                t(
                  "report.metric.distance",
                  {},
                  locale,
                ),
                formatOptionalDistance(
                  indicators.distanceMeters,
                  locale,
                ),
              )}

              ${renderMetric(
                t(
                  "report.metric.baseTime",
                  {},
                  locale,
                ),
                formatOptionalMinutes(
                  indicators.baseTimeMinutes,
                  locale,
                ),
              )}

              ${renderMetric(
                t(
                  "report.metric.adjustedTime",
                  {},
                  locale,
                ),
                formatOptionalMinutes(
                  indicators.adjustedTimeMinutes,
                  locale,
                ),
              )}

              ${renderMetric(
                t(
                  "report.metric.factorDifference",
                  {},
                  locale,
                ),
                adjustedDifference === null
                  ? t(
                      "common.notAvailable",
                      {},
                      locale,
                    )
                  : `${
                      adjustedDifference >= 0
                        ? "+"
                        : ""
                    }${formatNumber(
                      adjustedDifference,
                      2,
                      locale,
                    )} min`,
              )}

              ${renderMetric(
                t(
                  "report.metric.averageSpeed",
                  {},
                  locale,
                ),
                formatOptionalSpeed(
                  indicators.averageSpeedKmH,
                  locale,
                ),
              )}

              ${renderMetric(
                t(
                  "report.metric.reachableArea",
                  {},
                  locale,
                ),
                formatOptionalArea(
                  indicators
                    .reachableAreaSquareMeters,
                  locale,
                ),
              )}
            </div>

            ${maps}
          </section>

          <section>
            <h2>
              ${escapeHtml(
                t(
                  "report.section.interpretation",
                  {},
                  locale,
                ),
              )}
            </h2>

            <p>
              ${escapeHtml(summary)}
            </p>

            ${factors
              .map(
                (factor) =>
                  renderFactor(
                    factor,
                    locale,
                  ),
              )
              .join("")}
          </section>

          <section>
            <h2>
              ${escapeHtml(
                t(
                  "report.section.recommendations",
                  {},
                  locale,
                ),
              )}
            </h2>

            ${
              recommendations.length === 0
                ? `
                  <p>
                    ${escapeHtml(
                      t(
                        "report.recommendations.none",
                        {},
                        locale,
                      ),
                    )}
                  </p>
                `
                : `
                  <ol>
                    ${recommendations
                      .map(
                        (
                          recommendation,
                        ) =>
                          `<li>${escapeHtml(
                            recommendation,
                          )}</li>`,
                      )
                      .join("")}
                  </ol>
                `
            }
          </section>

          <section>
            <h2>
              ${escapeHtml(
                t(
                  "report.section.sources",
                  {},
                  locale,
                ),
              )}
            </h2>

            <h3>
              ${escapeHtml(
                t(
                  "report.sources.title",
                  {},
                  locale,
                ),
              )}
            </h3>

            ${
              report.dataSources?.length
                ? `
                  <ul>
                    ${report.dataSources
                      .map(
                        (source) =>
                          `<li>${escapeHtml(
                            source,
                          )}</li>`,
                      )
                      .join("")}
                  </ul>
                `
                : `
                  <p>
                    ${escapeHtml(
                      t(
                        "report.sources.none",
                        {},
                        locale,
                      ),
                    )}
                  </p>
                `
            }

            <div class="limitations">
              <strong>
                ${escapeHtml(
                  t(
                    "report.limitations.title",
                    {},
                    locale,
                  ),
                )}
              </strong>

              <p>
                ${escapeHtml(
                  t(
                    "report.limitations.description",
                    {},
                    locale,
                  ),
                )}
              </p>
            </div>
          </section>

          <footer class="report-footer">
            ${escapeHtml(
              t(
                "report.footer.generated",
                {
                  analysis:
                    mobility.footerLabel,
                },
                locale,
              ),
            )}

            ${escapeHtml(
              t(
                "report.footer.pluginVersion",
                {
                  version:
                    identification
                      .pluginVersion
                    ?? t(
                      "common.notProvided",
                      {},
                      locale,
                    ),
                },
                locale,
              ),
            )}

            ${escapeHtml(
              t(
                "report.footer.algorithmVersion",
                {
                  version:
                    identification
                      .algorithmVersion
                    ?? t(
                      "common.notProvided",
                      {},
                      locale,
                    ),
                },
                locale,
              ),
            )}
          </footer>
        </main>

        <script>
          document
            .getElementById(
              "download-pdf-button"
            )
            ?.addEventListener(
              "click",
              function () {
                window.print();
              }
            );
        </script>
      </body>
    </html>
  `;
}

export function openPrintableReport(
  report: ReportData,
): void {
  const reportWindow =
    window.open(
      "",
      "_blank",
    );

  if (!reportWindow) {
    throw new Error(
      t(
        "report.error.popupBlocked",
        {},
        report.locale
          ?? DEFAULT_LOCALE,
      ),
    );
  }

  reportWindow.opener = null;

  const html =
    generateReportHtml(report);

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();

  reportWindow.focus();
}

import { analyzeFactors } from "./report.rules";
import { REPORT_CSS } from "./report.css";
import { FactorImpact, ReportData } from "./report.types";
import {
  escapeHtml,
  formatArea,
  formatDateTime,
  formatDistance,
  formatNumber,
  uniqueStrings,
} from "./report.utils";

const LEVEL_LABELS: Record<FactorImpact["level"], string> = {
  positive: "Favorável",
  neutral: "Neutra",
  low: "Baixa influência",
  moderate: "Influência moderada",
  high: "Influência elevada",
  critical: "Influência crítica",
};

function renderMetric(label: string, value: string): string {
  return `
    <div class="metric">
      <span class="metric-label">${escapeHtml(label)}</span>
      <span class="metric-value">${escapeHtml(value)}</span>
    </div>
  `;
}

function renderFactor(factor: FactorImpact): string {
  const impact =
    factor.impactMinutes === undefined
      ? ""
      : `
        <p>
          <strong>Impacto estimado no tempo:</strong>
          ${factor.impactMinutes >= 0 ? "+" : ""}
          ${formatNumber(factor.impactMinutes, 2)} min
        </p>
      `;

  const recommendations =
    factor.recommendations.length === 0
      ? "<p>Não foram identificadas recomendações prioritárias para este fator.</p>"
      : `
        <ul>
          ${factor.recommendations
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      `;

  return `
    <article class="factor factor-${factor.level}">
      <h3>
        ${escapeHtml(factor.label)}
        <span class="classification">
          ${escapeHtml(LEVEL_LABELS[factor.level])}
        </span>
      </h3>

      <p>
        <strong>Valor observado:</strong>
        ${formatNumber(factor.rawValue, 1)} ${escapeHtml(factor.unit)}
      </p>

      <p>${escapeHtml(factor.description)}</p>

      ${impact}

      <h4>Recomendações relacionadas</h4>
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
        <strong>${escapeHtml(map.title)}.</strong>
        ${escapeHtml(map.description ?? "")}
      </figcaption>
    </figure>
  `;
}

function buildSummary(
  report: ReportData,
  factors: FactorImpact[],
): string {
  const { indicators, configuration } = report;

  const withinTarget =
    indicators.adjustedTimeMinutes <= configuration.targetTimeMinutes;

  const restrictiveFactors = factors
    .filter(
      (factor) =>
        factor.level === "high" ||
        factor.level === "critical",
    )
    .map((factor) => factor.label);

  let summary = withinTarget
    ? `O destino encontra-se dentro do limite de ` +
      `${formatNumber(configuration.targetTimeMinutes)} minutos definido para a análise.`
    : `O tempo ajustado ultrapassa o limite de ` +
      `${formatNumber(configuration.targetTimeMinutes)} minutos definido para a análise.`;

  if (restrictiveFactors.length > 0) {
    summary +=
      ` Os fatores com maior nível de restrição foram: ` +
      `${restrictiveFactors.join(", ")}.`;
  } else {
    summary +=
      " Não foram identificados fatores classificados com influência elevada ou crítica.";
  }

  return summary;
}

export function generateReportHtml(report: ReportData): string {
  if (!report) {
    throw new Error("Os dados do relatório não foram informados.");
  }

  const identification = report.identification ?? ({} as ReportData["identification"]);
  const configuration = report.configuration ?? ({} as ReportData["configuration"]);
  const indicators = report.indicators ?? ({} as ReportData["indicators"]);

  if (!report.identification) {
    throw new Error(
      "Relatório incompatível: o adapter não forneceu o objeto identification.",
    );
  }

  if (!report.configuration) {
    throw new Error(
      "Relatório incompatível: o adapter não forneceu o objeto configuration.",
    );
  }

  if (!report.indicators) {
    throw new Error(
      "Relatório incompatível: o adapter não forneceu o objeto indicators.",
    );
  }

  const factors = analyzeFactors(report);

  const recommendations = uniqueStrings(
    factors.flatMap((factor) => factor.recommendations),
  );

  const adjustedDifference =
    indicators.adjustedTimeMinutes - indicators.baseTimeMinutes;

  const summary = buildSummary(report, factors);

  const maps = [
    renderMap(report.maps?.overview),
    renderMap(report.maps?.route),
    renderMap(report.maps?.isochrone),
  ].join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >
        <title>
          Relatório de Caminhabilidade -
          ${escapeHtml(identification.destinationName ?? "Destino não informado")}
        </title>

        <style>${REPORT_CSS}</style>
      </head>

      <body>
        <div class="report-actions">
            <button
                type="button"
                class="report-action-button"
                id="download-pdf-button"
                title="Salvar relatório em formato PDF"
            >
                Imprimir / Salvar PDF
            </button>
        </div>
        <main class="report">
          <header class="report-header">
            <h1>Relatório de Análise de Caminhabilidade</h1>

            <p>
              <strong>Área:</strong>
              ${escapeHtml(identification.areaName ?? "Não informada")}
            </p>

            <p>
              <strong>Destino:</strong>
              ${escapeHtml(identification.destinationName ?? "Destino não informado")}
              — ${escapeHtml(identification.destinationType ?? "Não informado")}
            </p>

            <p>
              <strong>Gerado em:</strong>
              ${escapeHtml(formatDateTime(identification.generatedAt ?? new Date().toISOString()))}
            </p>
          </header>

          <section>
            <h2>1. Identificação e caracterização da área</h2>

            <table>
              <tbody>
                <tr>
                  <th>Identificador da análise</th>
                  <td>${escapeHtml(identification.analysisId ?? "Não informado")}</td>
                </tr>
                <tr>
                  <th>Município/UF</th>
                  <td>
                    ${escapeHtml(identification.municipality ?? "Não informado")}
                    ${identification.state
                      ? ` / ${escapeHtml(identification.state)}`
                      : ""}
                  </td>
                </tr>
                <tr>
                  <th>Área analisada</th>
                  <td>${escapeHtml(formatArea(indicators.areaSquareMeters))}</td>
                </tr>
                <tr>
                  <th>Destino analisado</th>
                  <td>
                    ${escapeHtml(identification.destinationName ?? "Destino não informado")}
                    (${escapeHtml(identification.destinationType ?? "Não informado")})
                  </td>
                </tr>
                <tr>
                  <th>Sistema de coordenadas</th>
                  <td>
                    ${escapeHtml(
                      identification.coordinateReferenceSystem ??
                        "Não informado",
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              A análise considera um deslocamento a pé até
              <strong>${escapeHtml(identification.destinationName ?? "Destino não informado")}</strong>,
              classificado como
              <strong>${escapeHtml(identification.destinationType ?? "Não informado")}</strong>.
              A distância calculada pela rede foi de
              <strong>${formatDistance(indicators.distanceMeters)}</strong>.
            </p>
          </section>

          <section>
            <h2>2. Configuração da simulação</h2>

            <table>
              <thead>
                <tr>
                  <th>Parâmetro</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tempo-alvo</td>
                  <td>${formatNumber(configuration.targetTimeMinutes)} min</td>
                </tr>
                <tr>
                  <td>Velocidade-base de caminhada</td>
                  <td>
                    ${formatNumber(configuration.baseWalkingSpeedKmH, 2)} km/h
                  </td>
                </tr>
                <tr>
                  <td>Peso da declividade</td>
                  <td>${formatNumber(configuration.weights?.slope ?? 0, 3)}</td>
                </tr>
                <tr>
                  <td>Peso da arborização</td>
                  <td>
                    ${formatNumber(configuration.weights?.treeCoverage ?? 0, 3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>3. Resultados da simulação</h2>

            <div class="metrics">
              ${renderMetric(
                "Distância",
                formatDistance(indicators.distanceMeters),
              )}

              ${renderMetric(
                "Tempo sem ponderação",
                `${formatNumber(indicators.baseTimeMinutes, 2)} min`,
              )}

              ${renderMetric(
                "Tempo ajustado",
                `${formatNumber(indicators.adjustedTimeMinutes, 2)} min`,
              )}

              ${renderMetric(
                "Diferença produzida pelos fatores",
                `${adjustedDifference >= 0 ? "+" : ""}` +
                  `${formatNumber(adjustedDifference, 2)} min`,
              )}

              ${renderMetric(
                "Velocidade média",
                `${formatNumber(indicators.averageSpeedKmH, 2)} km/h`,
              )}

              ${renderMetric(
                "Área alcançável",
                formatArea(indicators.reachableAreaSquareMeters),
              )}
            </div>

            ${maps}
          </section>

          <section>
            <h2>4. Interpretação técnica</h2>

            <p>${escapeHtml(summary)}</p>

            ${factors.map(renderFactor).join("")}
          </section>

          <section>
            <h2>5. Recomendações para o planejamento urbano</h2>

            ${
              recommendations.length === 0
                ? `
                  <p>
                    Não foram geradas recomendações prioritárias com base
                    nos critérios atualmente avaliados.
                  </p>
                `
                : `
                  <ol>
                    ${recommendations
                      .map(
                        (recommendation) =>
                          `<li>${escapeHtml(recommendation)}</li>`,
                      )
                      .join("")}
                  </ol>
                `
            }
          </section>

          <section>
            <h2>6. Fontes, parâmetros e limitações</h2>

            <h3>Fontes dos dados</h3>

            ${
              report.dataSources?.length
                ? `
                  <ul>
                    ${report.dataSources
                      .map(
                        (source) =>
                          `<li>${escapeHtml(source)}</li>`,
                      )
                      .join("")}
                  </ul>
                `
                : "<p>As fontes dos dados não foram informadas.</p>"
            }

            <div class="limitations">
              <strong>Limitação da análise:</strong>

              <p>
                Os resultados representam uma estimativa produzida a partir
                das camadas disponíveis, dos parâmetros configurados e do
                modelo de deslocamento empregado. Condições temporárias,
                obstáculos não cadastrados e alterações recentes no ambiente
                urbano podem não estar representados.
              </p>
            </div>
          </section>

          <footer class="report-footer">
            Relatório produzido automaticamente pelo plugin de análise de
            caminhabilidade.

            Versão do plugin:
            ${escapeHtml(identification.pluginVersion ?? "não informada")}.

            Versão do algoritmo:
            ${escapeHtml(identification.algorithmVersion ?? "não informada")}.
          </footer>
        </main>
        <script>
            document
                .getElementById("download-pdf-button")
                ?.addEventListener("click", function () {
                window.print();
                });
        </script>
      </body>
    </html>
  `;
}

export function openPrintableReport(
  report: ReportData,
): void {
  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    throw new Error(
      "Não foi possível abrir o relatório. " +
      "Verifique se o navegador bloqueou a nova janela.",
    );
  }

  // Evita que a nova janela mantenha acesso à janela original.
  reportWindow.opener = null;

  const html = generateReportHtml(report);

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();

  reportWindow.focus();
}

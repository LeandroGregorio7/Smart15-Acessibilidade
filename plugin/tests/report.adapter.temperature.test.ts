import { describe, expect, it } from "vitest";
import { adaptSimulationToReport } from "../src/report/report.adapter";

async function adaptTemperature(temperature: Record<string, unknown>) {
  return adaptSimulationToReport({
    simulation: {
      simulation_id: "temperature-test",
      report: {
        area: {},
        rasters: { temperatura: temperature },
        parametros: {},
        pois: { total: 0, por_categoria: {} },
        perfis: [],
      },
    },
    configuration: {
      municipality: "Viçosa",
      state: "MG",
    },
    locale: "en",
  });
}

describe("temperature unit handling in report adapter", () => {
  it("preserves Celsius values already normalized by the backend", async () => {
    const report = await adaptTemperature({
      media: 35.4,
      maximo: 40,
      unidade: "°C",
    });

    expect(report.indicators.temperature).toEqual({
      averageCelsius: 35.4,
      maximumCelsius: 40,
    });
  });

  it("treats legacy unlabelled values in a physical Celsius range as Celsius", async () => {
    const report = await adaptTemperature({
      media_aproximada: 34.35,
      maximo: 36.45,
    });

    expect(report.indicators.temperature).toEqual({
      averageCelsius: 34.35,
      maximumCelsius: 36.45,
    });
  });

  it("converts explicit or legacy Kelvin values to Celsius", async () => {
    const explicitKelvin = await adaptTemperature({
      media: 308.55,
      maximo: 313.15,
      unidade: "K",
    });
    const legacyKelvin = await adaptTemperature({
      media: 308.55,
      maximo: 313.15,
    });

    expect(explicitKelvin.indicators.temperature.averageCelsius).toBeCloseTo(35.4, 5);
    expect(explicitKelvin.indicators.temperature.maximumCelsius).toBeCloseTo(40, 5);
    expect(legacyKelvin.indicators.temperature.averageCelsius).toBeCloseTo(35.4, 5);
  });

  it("converts Fahrenheit and rejects physically impossible values", async () => {
    const fahrenheit = await adaptTemperature({
      media: 95,
      maximo: 104,
      unidade: "°F",
    });
    const invalid = await adaptTemperature({
      media: 34.35,
      maximo: -238.8,
      unidade: "°C",
    });

    expect(fahrenheit.indicators.temperature.averageCelsius).toBeCloseTo(35, 5);
    expect(fahrenheit.indicators.temperature.maximumCelsius).toBeCloseTo(40, 5);
    expect(invalid.indicators.temperature.averageCelsius).toBe(34.35);
    expect(invalid.indicators.temperature.maximumCelsius).toBeNull();
  });
});

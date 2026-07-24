import { describe, expect, it, vi } from "vitest";

import {
  resolveAdministrativeLocation,
} from "./report.geocoding";

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("resolveAdministrativeLocation", () => {
  it("resolve município e estado usando o centroide do extent", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse({
        address: {
          city: "Rio de Janeiro",
          state: "Rio de Janeiro",
        },
      }),
    ) as unknown as typeof fetch;

    const location = await resolveAdministrativeLocation(
      [-43.30, -23.00, -43.20, -22.90],
      {
        endpoint: "https://geocoder.test/rio-de-janeiro",
        fetchFn,
      },
    );

    expect(location).toEqual({
      municipality: "Rio de Janeiro",
      state: "Rio de Janeiro",
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);

    const requestedUrl = new URL(
      vi.mocked(fetchFn).mock.calls[0][0] as string,
    );

    expect(requestedUrl.searchParams.get("lat")).toBe("-22.95");
    expect(requestedUrl.searchParams.get("lon")).toBe("-43.25");
    expect(requestedUrl.searchParams.get("zoom")).toBe("10");
    expect(requestedUrl.searchParams.get("layer")).toBe("address");
  });

  it("prioriza o campo municipality e reaproveita o resultado em cache", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse({
        address: {
          municipality: "Niterói",
          city: "Icaraí",
          state: "Rio de Janeiro",
        },
      }),
    ) as unknown as typeof fetch;

    const extent = [-43.12, -22.91, -43.08, -22.87] as const;
    const options = {
      endpoint: "https://geocoder.test/niteroi",
      fetchFn,
    };

    await expect(
      resolveAdministrativeLocation(extent, options),
    ).resolves.toEqual({
      municipality: "Niterói",
      state: "Rio de Janeiro",
    });

    await resolveAdministrativeLocation(extent, options);

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("retorna objeto vazio quando a consulta falha", async () => {
    const fetchFn = vi.fn().mockRejectedValue(
      new Error("Falha de rede"),
    ) as unknown as typeof fetch;

    await expect(
      resolveAdministrativeLocation(
        [-46.70, -23.60, -46.60, -23.50],
        {
          endpoint: "https://geocoder.test/falha",
          fetchFn,
        },
      ),
    ).resolves.toEqual({});
  });

  it("rejeita extent fora do padrão EPSG:4326", async () => {
    const fetchFn = vi.fn() as unknown as typeof fetch;

    await expect(
      resolveAdministrativeLocation(
        [-43.0, -22.0, -44.0, -21.0],
        {
          endpoint: "https://geocoder.test/invalido",
          fetchFn,
        },
      ),
    ).rejects.toThrow("EPSG:4326");

    expect(fetchFn).not.toHaveBeenCalled();
  });
});

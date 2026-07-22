export interface MapCaptureResult {
  dataUrl: string | null;
  error?: string;
}

export function captureMapAsDataUrl(
  map: any,
): MapCaptureResult {
  if (!map) {
    return {
      dataUrl: null,
      error: "Instância do mapa não encontrada.",
    };
  }

  try {
    map.triggerRepaint?.();

    const canvas = map.getCanvas?.();

    if (!canvas) {
      return {
        dataUrl: null,
        error: "Canvas do mapa não encontrado.",
      };
    }

    const dataUrl = canvas.toDataURL("image/png");

    return {
      dataUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao capturar o mapa.";

    console.warn(
      "Não foi possível capturar o mapa.",
      error,
    );

    return {
      dataUrl: null,
      error: message,
    };
  }
}

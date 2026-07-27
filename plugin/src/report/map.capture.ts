export interface MapCaptureResult {
  dataUrl: string | null;
  error?: string;
}

export interface MapLegendItem {
  label: string;
  color: string;
  kind?: "point" | "fill" | "line";
}

export interface MapCaptureOptions {
  legend?: {
    title?: string;
    items: MapLegendItem[];
  };
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(
        new Error("Não foi possível carregar a imagem capturada do mapa."),
      );
    };

    image.src = dataUrl;
  });
}

function drawLegend(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  legend: NonNullable<MapCaptureOptions["legend"]>,
): void {
  const padding = 12;
  const lineHeight = 20;
  const symbolSize = 12;
  const title = legend.title ?? "Legenda";

  context.save();

  context.font = "bold 14px Arial";

  const widestLabel = Math.max(
    context.measureText(title).width,
    ...legend.items.map((item) => {
      context.font = "12px Arial";
      return context.measureText(item.label).width;
    }),
  );

  const width = Math.ceil(widestLabel + 58);
  const height = padding * 2 + lineHeight * (legend.items.length + 1);

  const x = canvasWidth - width - 16;
  const y = canvasHeight - height - 16;

  context.fillStyle = "rgba(255, 255, 255, 0.93)";
  context.strokeStyle = "rgba(30, 41, 59, 0.35)";
  context.lineWidth = 1;

  context.fillRect(x, y, width, height);
  context.strokeRect(x, y, width, height);

  context.fillStyle = "#1e293b";
  context.font = "bold 14px Arial";
  context.fillText(title, x + padding, y + padding + 11);

  legend.items.forEach((item, index) => {
    const itemY = y + padding + lineHeight * (index + 1) + 7;
    const symbolX = x + padding + 6;

    if (item.kind === "line") {
      context.beginPath();
      context.moveTo(symbolX - 6, itemY);
      context.lineTo(symbolX + 8, itemY);
      context.strokeStyle = item.color;
      context.lineWidth = 3;
      context.stroke();
    } else if (item.kind === "point") {
      context.beginPath();
      context.arc(symbolX, itemY, symbolSize / 2, 0, Math.PI * 2);
      context.fillStyle = item.color;
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;
      context.stroke();
    } else {
      context.fillStyle = item.color;
      context.fillRect(
        symbolX - symbolSize / 2,
        itemY - symbolSize / 2,
        symbolSize,
        symbolSize,
      );
    }

    context.fillStyle = "#1e293b";
    context.font = "12px Arial";
    context.fillText(item.label, x + padding + 22, itemY + 4);
  });

  context.restore();
}

export async function captureMapAsDataUrl(
  map: any,
  options: MapCaptureOptions = {},
): Promise<MapCaptureResult> {
  if (!map) {
    return {
      dataUrl: null,
      error: "Instância do mapa não encontrada.",
    };
  }

  try {
    map.triggerRepaint?.();

    const sourceCanvas = map.getCanvas?.();

    if (!sourceCanvas) {
      return {
        dataUrl: null,
        error: "Canvas do mapa não encontrado.",
      };
    }

    const sourceDataUrl = sourceCanvas.toDataURL("image/png");
    const mapImage = await loadImage(sourceDataUrl);

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = sourceCanvas.width;
    exportCanvas.height = sourceCanvas.height;

    const context = exportCanvas.getContext("2d");

    if (!context) {
      return {
        dataUrl: null,
        error: "Não foi possível preparar o canvas de exportação.",
      };
    }

    context.drawImage(mapImage, 0, 0);

    if (options.legend?.items.length) {
      drawLegend(
        context,
        exportCanvas.width,
        exportCanvas.height,
        options.legend,
      );
    }

    return {
      dataUrl: exportCanvas.toDataURL("image/png"),
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao capturar o mapa.";

    console.warn(
      "Não foi possível capturar o mapa para o relatório.",
      error,
    );

    return {
      dataUrl: null,
      error: message,
    };
  }
}

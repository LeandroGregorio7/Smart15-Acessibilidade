export function escapeHtml(value: unknown): string {
  return String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}

export function formatNumber(
  value: number,
  maximumFractionDigits = 1,
): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${formatNumber(meters / 1000, 2)} km`;
  }

  return `${formatNumber(meters, 0)} m`;
}

export function formatArea(squareMeters?: number): string {
  if (squareMeters === undefined) {
    return "Não informado";
  }

  if (squareMeters >= 1_000_000) {
    return `${formatNumber(squareMeters / 1_000_000, 2)} km²`;
  }

  if (squareMeters >= 10_000) {
    return `${formatNumber(squareMeters / 10_000, 2)} ha`;
  }

  return `${formatNumber(squareMeters, 0)} m²`;
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

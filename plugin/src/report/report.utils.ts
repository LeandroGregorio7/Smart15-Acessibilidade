import type {
  SupportedLocale,
} from "../i18n/i18n.types";

const DEFAULT_LOCALE: SupportedLocale = "en";

function resolveIntlLocale(
  locale: SupportedLocale,
): string {
  return locale === "pt-BR"
    ? "pt-BR"
    : "en-US";
}

function notProvidedLabel(
  locale: SupportedLocale,
): string {
  return locale === "pt-BR"
    ? "Não informado"
    : "Not provided";
}

export function escapeHtml(
  value: unknown,
): string {
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
  locale: SupportedLocale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(
    resolveIntlLocale(locale),
    {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    },
  ).format(value);
}

export function formatDistance(
  meters: number,
  locale: SupportedLocale = DEFAULT_LOCALE,
): string {
  if (meters >= 1000) {
    return (
      `${formatNumber(
        meters / 1000,
        2,
        locale,
      )} km`
    );
  }

  return (
    `${formatNumber(
      meters,
      0,
      locale,
    )} m`
  );
}

export function formatArea(
  squareMeters?: number,
  locale: SupportedLocale = DEFAULT_LOCALE,
): string {
  if (squareMeters === undefined) {
    return notProvidedLabel(locale);
  }

  if (squareMeters >= 1_000_000) {
    return (
      `${formatNumber(
        squareMeters / 1_000_000,
        2,
        locale,
      )} km²`
    );
  }

  if (squareMeters >= 10_000) {
    return (
      `${formatNumber(
        squareMeters / 10_000,
        2,
        locale,
      )} ha`
    );
  }

  return (
    `${formatNumber(
      squareMeters,
      0,
      locale,
    )} m²`
  );
}

export function formatDateTime(
  isoDate: string,
  locale: SupportedLocale = DEFAULT_LOCALE,
): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(
    resolveIntlLocale(locale),
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(date);
}

export function uniqueStrings(
  values: string[],
): string[] {
  return [
    ...new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}



export const SUPPORTED_LOCALES = [
  "en",
  "pt-BR",
] as const;

export type SupportedLocale =
  (typeof SUPPORTED_LOCALES)[number];

export type TranslationParams = Record<
  string,
  string | number | boolean | null | undefined
>;

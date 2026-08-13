import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  type TranslationParams,
} from "./i18n.types";

import {
  translations,
  type TranslationKey,
} from "./translations";

const STORAGE_KEY = "smart15.locale";

export const DEFAULT_LOCALE: SupportedLocale = "en";

type LocaleChangeListener = (
  locale: SupportedLocale,
) => void;

const listeners =
  new Set<LocaleChangeListener>();

function isSupportedLocale(
  value: unknown,
): value is SupportedLocale {
  return (
    typeof value === "string"
    && SUPPORTED_LOCALES.includes(
      value as SupportedLocale,
    )
  );
}

function loadInitialLocale(): SupportedLocale {
  try {
    if (typeof window !== "undefined") {
      const storedLocale =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (isSupportedLocale(storedLocale)) {
        return storedLocale;
      }
    }
  } catch {
    // A aplicação continua funcionando
    // mesmo quando localStorage não está disponível.
  }

  return DEFAULT_LOCALE;
}

let currentLocale: SupportedLocale =
  loadInitialLocale();

function updateDocumentLanguage(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang =
    currentLocale;
}

updateDocumentLanguage();

function interpolate(
  text: string,
  params: TranslationParams = {},
): string {
  return text.replace(
    /\{(\w+)\}/g,
    (match, key: string) => {
      const value = params[key];

      return (
        value === null
        || value === undefined
      )
        ? match
        : String(value);
    },
  );
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function setLocale(
  locale: SupportedLocale,
): void {
  if (!isSupportedLocale(locale)) {
    return;
  }

  if (locale === currentLocale) {
    updateDocumentLanguage();
    return;
  }

  currentLocale = locale;

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        locale,
      );
    }
  } catch {
    // A aplicação continua funcionando
    // sem persistência da preferência.
  }

  updateDocumentLanguage();

  listeners.forEach(
    (listener) => listener(locale),
  );
}

export function subscribeLocale(
  listener: LocaleChangeListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function t(
  key: TranslationKey,
  params: TranslationParams = {},
  locale: SupportedLocale = currentLocale,
): string {
  const localeDictionary =
    translations[locale];

  const fallbackDictionary =
    translations[DEFAULT_LOCALE];

  const message =
    localeDictionary[key]
    ?? fallbackDictionary[key]
    ?? key;

  return interpolate(
    message,
    params,
  );
}

function toTranslationKey(
  value: string | undefined,
): TranslationKey | undefined {
  if (!value) {
    return undefined;
  }

  if (value in translations[DEFAULT_LOCALE]) {
    return value as TranslationKey;
  }

  console.warn(
    `[Smart15 i18n] Chave de tradução desconhecida: ${value}`,
  );

  return undefined;
}

export function translateDocument(
  root: ParentNode = document,
): void {
  root
    .querySelectorAll<HTMLElement>(
      "[data-i18n]",
    )
    .forEach((element) => {
      const key = toTranslationKey(
        element.dataset.i18n,
      );

      if (key) {
        element.textContent = t(key);
      }
    });

  root
    .querySelectorAll<HTMLElement>(
      "[data-i18n-title]",
    )
    .forEach((element) => {
      const key = toTranslationKey(
        element.dataset.i18nTitle,
      );

      if (key) {
        element.title = t(key);
      }
    });

  root
    .querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >(
      "[data-i18n-placeholder]",
    )
    .forEach((element) => {
      const key = toTranslationKey(
        element.dataset.i18nPlaceholder,
      );

      if (key) {
        element.placeholder = t(key);
      }
    });

  root
    .querySelectorAll<HTMLElement>(
      "[data-i18n-aria-label]",
    )
    .forEach((element) => {
      const key = toTranslationKey(
        element.dataset.i18nAriaLabel,
      );

      if (key) {
        element.setAttribute(
          "aria-label",
          t(key),
        );
      }
    });

  root
    .querySelectorAll<HTMLElement>(
      "[data-i18n-html]",
    )
    .forEach((element) => {
      const key = toTranslationKey(
        element.dataset.i18nHtml,
      );

      if (key) {
        element.innerHTML = t(key);
      }
    });
}

export const defaultLocale = "en";
export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

export const timeZones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
] as const;

export const dateFormats: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: {
    dateStyle: "medium",
    timeStyle: "short",
  },
  es: {
    dateStyle: "medium",
    timeStyle: "short",
  },
};

export const numberFormats: Record<Locale, Intl.NumberFormatOptions> = {
  en: {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
  es: {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
};

export const currencyFormats: Record<Locale, Intl.NumberFormatOptions> = {
  en: {
    style: "currency",
    currency: "USD",
  },
  es: {
    style: "currency",
    currency: "EUR",
  },
};

export const i18nConfig = {
  defaultLocale,
  locales,
  localeLabels,
  localeFlags,
  timeZones,
  dateFormats,
  numberFormats,
  currencyFormats,
} as const;

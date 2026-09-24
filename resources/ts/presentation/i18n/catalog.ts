export type AppLocale = "en" | "vi";

export type TranslationReplacements = Record<string, string | number>;

export type TranslateFn = (
  key: string,
  replacements?: TranslationReplacements,
) => string;

let currentLocale: AppLocale = "en";
let currentTranslations: Record<string, string> = {};

const applyReplacements = (
  text: string,
  replacements?: TranslationReplacements,
): string => {
  if (!replacements) {
    return text;
  }

  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.split(`:${key}`).join(String(value));
  }

  return result;
};

export const setI18nCatalog = (
  locale: AppLocale,
  translations: Record<string, string>,
): void => {
  currentLocale = locale;
  currentTranslations = translations;
};

export const getLocale = (): AppLocale => currentLocale;

export const translate: TranslateFn = (key, replacements) => {
  const text = currentTranslations[key] ?? key;
  return applyReplacements(text, replacements);
};

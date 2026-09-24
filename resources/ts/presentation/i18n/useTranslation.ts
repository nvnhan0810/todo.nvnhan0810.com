import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import {
  setI18nCatalog,
  translate,
  type AppLocale,
  type TranslateFn,
  type TranslationReplacements,
} from "@/ts/presentation/i18n/catalog";

export type { AppLocale, TranslateFn, TranslationReplacements };

export type SharedI18nProps = {
  locale: AppLocale;
  translations: Record<string, string>;
};

export const useTranslation = (): {
  t: TranslateFn;
  locale: AppLocale;
} => {
  const { locale, translations } = usePage().props as unknown as SharedI18nProps;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    setI18nCatalog(locale, translations);
    document.documentElement.lang = locale;
  }, [locale, translations]);

  setI18nCatalog(locale, translations);

  const t: TranslateFn = (key, replacements) =>
    translate(key, replacements);

  return { t, locale };
};

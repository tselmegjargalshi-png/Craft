import { SITE_URL } from "./data";
import { lp } from "./locale-path";
import type { Locale } from "./locale-types";

/** canonical + hreflang alternates for a locale-less path like "/fiyatlar". */
export function seoAlternates(path: string, locale: Locale) {
  const abs = (l: Locale) => `${SITE_URL}${lp(l, path)}`.replace(/\/$/, "") || SITE_URL;
  return {
    canonical: abs(locale),
    languages: { tr: abs("tr"), en: abs("en"), "x-default": abs("tr") },
  };
}

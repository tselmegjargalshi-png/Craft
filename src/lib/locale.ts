import { cookies, headers } from "next/headers";
import type { Locale } from "./locale-types";

export type { Locale };
export const LOCALES: Locale[] = ["tr", "en"];
export const DEFAULT_LOCALE: Locale = "tr";
export const LOCALE_COOKIE = "craft-lang";
/** Set by the middleware from the URL (/en/... = English). Public pages trust this over the cookie. */
export const LOCALE_HEADER = "x-craft-locale";

export function isLocale(v: unknown): v is Locale {
  return v === "tr" || v === "en";
}

/** Public pages: language comes from the URL. Admin (no header): from the cookie. Turkish is the default. */
export async function getLocale(): Promise<Locale> {
  const h = (await headers()).get(LOCALE_HEADER);
  if (isLocale(h)) return h;
  const v = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

/** Picks `${field}Tr` / `${field}En` from a row, falling back to Turkish when English is empty. */
export function pick<T extends object>(row: T, field: string, locale: Locale): string {
  const r = row as Record<string, unknown>;
  const tr = String(r[`${field}Tr`] ?? "");
  if (locale === "tr") return tr;
  const en = String(r[`${field}En`] ?? "");
  return en.trim() ? en : tr;
}

export function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

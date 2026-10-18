import type { Locale } from "./locale-types";

/** Turkish lives at the root (/web-sitesi), English under /en (/en/web-sitesi). Safe to import from client code. */
export function lp(locale: Locale, path: string): string {
  if (locale === "tr") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** Splits a browser pathname into its locale and the locale-less path. */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/en") return { locale: "en", path: "/" };
  if (pathname.startsWith("/en/")) return { locale: "en", path: pathname.slice(3) };
  return { locale: "tr", path: pathname };
}

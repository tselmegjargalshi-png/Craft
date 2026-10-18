import type { Locale } from "./locale";

export function formatPrice(amount: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(d: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** Normalises a Turkish/international phone number to digits for wa.me links. */
export function waDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = "9" + d; // 05xx... -> 905xx...
  if (d.length === 10 && d.startsWith("5")) d = "90" + d; // 5xx... -> 905xx...
  return d;
}

export function waLink(raw: string, text?: string): string {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${waDigits(raw)}${q}`;
}

export function igLink(handle: string): string {
  const h = handle.trim();
  if (/^https?:\/\//.test(h)) return h;
  return `https://instagram.com/${h.replace(/^@/, "")}`;
}

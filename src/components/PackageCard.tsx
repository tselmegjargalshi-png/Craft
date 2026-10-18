import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { pick, type Locale } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import type { T } from "@/lib/i18n";
import type { PackageWithFeatures } from "@/lib/data";

function Check({ dark }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`mt-0.5 size-[1.05rem] shrink-0 ${dark ? "text-[#ff8a70]" : "text-accent"}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function PackageCard({
  pkg,
  t,
  locale,
  serviceSlug,
  serviceTitle,
  showService = false,
  plain = false,
  maxFeatures,
}: {
  pkg: PackageWithFeatures;
  t: T;
  locale: Locale;
  serviceSlug: string;
  serviceTitle: string;
  showService?: boolean;
  /** Teaser mode (homepage): never dark, shows only the first features and a link to the full list. */
  plain?: boolean;
  maxFeatures?: number;
}) {
  const dark = pkg.highlight && !plain;
  const features = maxFeatures ? pkg.features.slice(0, maxFeatures) : pkg.features;
  const hidden = pkg.features.length - features.length;
  const isQuote = pkg.price === null || pkg.billing === "QUOTE";
  const name = pick(pkg, "name", locale);
  const note = pick(pkg, "note", locale);
  const billing = t(`pricing.${pkg.billing as "ONE_TIME" | "MONTHLY" | "YEARLY" | "QUOTE"}`);
  const href = lp(locale, `/iletisim?hizmet=${encodeURIComponent(serviceSlug)}&paket=${encodeURIComponent(name)}`);

  return (
    <article
      className={`relative flex h-full flex-col rounded-card border p-6 transition duration-300 hover:-translate-y-1 ${
        dark
          ? "border-ink bg-ink text-paper shadow-lift xl:-translate-y-3 xl:hover:-translate-y-4"
          : "border-line bg-card text-ink shadow-soft hover:shadow-lift"
      }`}
      aria-labelledby={`pkg-${pkg.id}`}
    >
      {dark && (
        <span className="absolute -top-3.5 left-6 rounded-full bg-accent px-3.5 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-white shadow-md">
          {t("pricing.popular")}
        </span>
      )}

      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5">
        <h3 id={`pkg-${pkg.id}`} className="text-lg font-extrabold">
          {showService && <span className={`block text-xs font-bold uppercase tracking-wider ${dark ? "text-paper/55" : "text-mute"}`}>{serviceTitle}</span>}
          {name}
        </h3>
        {note && (
          <span className={`max-w-full rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold ${dark ? "bg-paper/15 text-paper" : "bg-accent-soft text-accent-dark"}`}>{note}</span>
        )}
      </div>
      <p className={`mt-2 min-h-[3rem] text-sm leading-snug ${dark ? "text-paper/70" : "text-mute"}`}>{pick(pkg, "desc", locale)}</p>

      <div className="mt-5">
        {isQuote ? (
          <p className="text-[2rem] font-extrabold leading-none tracking-tight">{t("pricing.quote")}</p>
        ) : (
          <p className="text-[2.15rem] font-extrabold leading-none tracking-tight">{formatPrice(pkg.price!, pkg.currency, locale)}</p>
        )}
        <p className={`mt-2 text-xs font-bold ${dark ? "text-paper/60" : "text-mute"}`}>
          {isQuote ? billing : [pkg.startingPrice ? t("pricing.starting") : null, billing].filter(Boolean).join(" · ")}
        </p>
      </div>

      <Link href={href} className={`btn mt-5 w-full ${dark ? "btn-primary" : "btn-dark"}`}>
        {pick(pkg, "cta", locale) || t("cta.quote")}
      </Link>

      <ul className={`mt-6 space-y-2.5 border-t pt-5 text-sm ${dark ? "border-paper/15" : "border-line"}`} aria-label={t("pricing.included")}>
        {features.map((f) => (
          <li key={f.id} className="flex gap-2.5 leading-snug">
            <Check dark={dark} />
            <span className={dark ? "text-paper/90" : "text-ink-2"}>{pick(f, "text", locale)}</span>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <Link href={lp(locale, `/${serviceSlug}`)} className="mt-4 text-sm font-extrabold text-accent hover:underline">
          +{hidden} · {t("cta.details")} →
        </Link>
      )}
    </article>
  );
}

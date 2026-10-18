import { ServiceObject } from "./ServiceObject";
import { formatPrice } from "@/lib/format";
import { pick, type Locale } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import type { T } from "@/lib/i18n";
import type { ServiceWithPackages } from "@/lib/data";

/** Plain anchor (full page load): the public layout depends on the URL language, so client-side transitions between /en and / pages are avoided. */
export function ServiceCard({ service, t, locale, index }: { service: ServiceWithPackages; t: T; locale: Locale; index: number }) {
  const priced = service.packages.filter((p) => p.price !== null);
  const min = priced.length ? priced.reduce((a, b) => (a.price! <= b.price! ? a : b)) : null;
  const title = pick(service, "title", locale);
  return (
    <a
      href={lp(locale, `/${service.slug}`)}
      className="group card lift flex h-full flex-col overflow-hidden"
      aria-label={`${title} — ${t("cta.details")}`}
    >
      <div className="relative bg-gradient-to-br from-paper-2 to-accent-soft/70 px-8 pb-4 pt-7">
        <span className="absolute left-5 top-4 text-sm font-extrabold tabular-nums text-ink/30">{String(index + 1).padStart(2, "0")}</span>
        <div className="mx-auto w-[62%] max-w-[210px] transition duration-500 group-hover:-translate-y-1 group-hover:rotate-[-3deg] group-hover:scale-105">
          <ServiceObject kind={service.icon} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-mute">{pick(service, "desc", locale)}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          {min ? (
            <p className="text-sm font-bold text-ink-2">
              <span className="text-mute">{t("pricing.starting")} </span>
              <span className="text-ink">{formatPrice(min.price!, min.currency, locale)}</span>
            </p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-accent">
            {t("cta.details")}
            <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}

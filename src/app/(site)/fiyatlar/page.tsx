import type { Metadata } from "next";
import Link from "next/link";
import { PricingGrid } from "@/components/PricingGrid";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeading } from "@/components/SectionHeading";
import { getServices, getSettings, setting } from "@/lib/data";
import { t as makeT } from "@/lib/i18n";
import { getLocale, pick } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import { seoAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = makeT(locale);
  const description = t("pricing.sub");
  return {
    title: t("pricing.title"),
    description,
    alternates: seoAlternates("/fiyatlar", locale),
    openGraph: { title: `${t("pricing.title")} | Craft`, description, url: seoAlternates("/fiyatlar", locale).canonical, type: "website", locale: locale === "tr" ? "tr_TR" : "en_US" },
  };
}

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ hizmet?: string }> }) {
  const [{ hizmet }, locale, services, settings] = await Promise.all([searchParams, getLocale(), getServices(), getSettings()]);
  const t = makeT(locale);
  const active = services.find((s) => s.slug === hizmet) ?? services[0];
  const note = setting(settings, "pricing_note", locale) || t("pricing.fallbackNote");

  return (
    <div className="wrap pb-8 pt-8 sm:pt-14">
      <SectionHeading as="h1" eyebrow={t("nav.pricing")} title={t("pricing.title")} sub={t("pricing.sub")} />

      {!active ? (
        <div className="mt-12"><EmptyState title={t("empty.services.t")} desc={t("empty.services.d")} /></div>
      ) : (
        <>
          <nav aria-label={t("home.services.eyebrow")} className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
              {services.map((s) => {
                const on = s.id === active.id;
                return (
                  <li key={s.id}>
                    <Link
                      href={lp(locale, `/fiyatlar?hizmet=${s.slug}`)}
                      scroll={false}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-extrabold transition ${
                        on ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-2 hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {pick(s, "title", locale)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{pick(active, "title", locale)}</h2>
              <p className="mt-2 max-w-2xl text-mute">{pick(active, "desc", locale)}</p>
            </div>
            <Link href={lp(locale, `/${active.slug}`)} className="btn btn-ghost btn-sm self-start sm:self-auto">{t("cta.details")} →</Link>
          </div>

          <div className="mt-6">
            <PricingGrid packages={active.packages} t={t} locale={locale} serviceSlug={active.slug} serviceTitle={pick(active, "title", locale)} />
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-mute">{note}</p>
        </>
      )}
    </div>
  );
}

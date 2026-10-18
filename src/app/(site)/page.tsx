import type { Metadata } from "next";
import Link from "next/link";
import { HeroScene } from "@/components/HeroScene";
import { ServiceCard } from "@/components/ServiceCard";
import { PackageCard } from "@/components/PackageCard";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqList } from "@/components/FaqList";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { Reveal } from "@/components/Reveal";
import { getGeneralFaqs, getServices, getSettings, setting } from "@/lib/data";
import { t as makeT } from "@/lib/i18n";
import { getLocale, pick } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import { seoAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = await getSettings();
  const title = setting(s, "hero_title", locale);
  const description = setting(s, "hero_desc", locale);
  return {
    title: { absolute: `Craft — ${title}` },
    description,
    alternates: seoAlternates("/", locale),
    openGraph: { title: `Craft — ${title}`, description, url: seoAlternates("/", locale).canonical, siteName: "Craft", type: "website", locale: locale === "tr" ? "tr_TR" : "en_US" },
  };
}

export default async function HomePage() {
  const [locale, settings, services, faqs] = await Promise.all([getLocale(), getSettings(), getServices(), getGeneralFaqs()]);
  const t = makeT(locale);

  const popular = services.flatMap((s) => {
    const p = s.packages.find((x) => x.highlight) ?? s.packages[Math.floor(s.packages.length / 2)];
    return p ? [{ s, p }] : [];
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="wrap grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.08fr_1fr] lg:gap-6 lg:pb-24 lg:pt-14">
          <div>
            <p className="eyebrow">{setting(settings, "hero_eyebrow", locale)}</p>
            <h1 id="hero-title" className="h-display mt-5 text-balance">{setting(settings, "hero_title", locale)}</h1>
            <p className="lead mt-6 max-w-xl">{setting(settings, "hero_desc", locale)}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={lp(locale, "/fiyatlar")} className="btn btn-dark">{t("cta.prices")}</Link>
              <Link href={lp(locale, "/iletisim")} className="btn btn-primary">{t("cta.quote")}</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-2" aria-label={t("home.services.eyebrow")}>
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={lp(locale, `/${s.slug}`)} className="chip transition hover:border-ink/40 hover:text-ink">{pick(s, "title", locale)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <HeroScene
            items={services.slice(0, 5).map((s) => ({ kind: s.icon, label: pick(s, "title", locale) }))}
            centerLabel={t("cta.quote")}
            packagesLabel={t("nav.pricing")}
          />
        </div>
      </section>

      {/* QUICK BENEFITS */}
      <section aria-label="Benefits" className="border-y border-line bg-card/50">
        <ul className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-9 lg:grid-cols-4">
          {([1, 2, 3, 4] as const).map((n) => (
            <li key={n}>
              <p className="flex items-center gap-2 text-base font-extrabold sm:text-lg">
                <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                {t(`home.benefits.${n}.t`)}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-mute sm:text-base">{t(`home.benefits.${n}.d`)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* SERVICES */}
      <section id="hizmetler" className="wrap py-20 sm:py-28" aria-labelledby="services-title">
        <div id="services-title">
          <SectionHeading eyebrow={t("home.services.eyebrow")} title={t("home.services.title")} sub={t("home.services.sub")} />
        </div>
        {services.length === 0 ? (
          <div className="mt-12"><EmptyState title={t("empty.services.t")} desc={t("empty.services.d")} /></div>
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 3) * 0.07} className="h-full">
                <ServiceCard service={s} t={t} locale={locale} index={i} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      {/* POPULAR PACKAGES */}
      {popular.length > 0 && (
        <section className="bg-paper-2/70 py-20 sm:py-28" aria-labelledby="popular-title">
          <div className="wrap">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div id="popular-title">
                <SectionHeading eyebrow={t("home.popular.eyebrow")} title={t("home.popular.title")} sub={t("home.popular.sub")} />
              </div>
              <Link href={lp(locale, "/fiyatlar")} className="btn btn-ghost shrink-0 self-start sm:self-auto">{t("cta.prices")}</Link>
            </div>
            <ul className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(215px,1fr))] xl:gap-4 md:max-xl:[&>li:last-child:nth-child(odd)]:col-span-2">
              {popular.map(({ s, p }, i) => (
                <Reveal as="li" key={p.id} delay={i * 0.05} className="h-full">
                  <PackageCard pkg={p} t={t} locale={locale} serviceSlug={s.slug} serviceTitle={pick(s, "title", locale)} showService plain maxFeatures={5} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <HowItWorks t={t} />

      {/* ABOUT + WHY */}
      <section id="hakkimizda" className="wrap py-20 sm:py-28" aria-labelledby="about-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t("home.why.eyebrow")}</p>
            <h2 id="about-title" className="h-section mt-3 text-balance">{setting(settings, "about_title", locale)}</h2>
            <p className="lead mt-5">{setting(settings, "about_text", locale)}</p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {([1, 2, 3, 4] as const).map((n) => (
                <li key={n} className="chip !px-4 !py-2 !text-sm">{t(`home.about.pill.${n}`)}</li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {([1, 2, 3, 4] as const).map((n, i) => (
              <Reveal as="li" key={n} delay={i * 0.06} className="card p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-sm font-extrabold text-accent-dark" aria-hidden="true">{n}</span>
                <h3 className="mt-4 text-lg font-extrabold">{t(`home.why.${n}.t`)}</h3>
                <p className="mt-1.5 leading-relaxed text-mute">{t(`home.why.${n}.d`)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="sss" className="wrap pb-20 sm:pb-28" aria-labelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
          <div id="faq-title">
            <SectionHeading eyebrow={t("home.faq.eyebrow")} title={t("home.faq.title")} />
          </div>
          <FaqList
            items={faqs.map((f) => ({ id: f.id, q: pick(f, "q", locale), a: pick(f, "a", locale) }))}
            emptyTitle={t("empty.faq.t")}
            emptyDesc={t("empty.faq.d")}
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="wrap" aria-labelledby="cta-title">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-ink px-6 py-16 text-center text-paper sm:px-12 sm:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
          <p className="eyebrow !text-[#ff8a70]">{t("home.cta.eyebrow")}</p>
          <h2 id="cta-title" className="h-section mx-auto mt-3 max-w-3xl text-balance !text-paper">{setting(settings, "cta_title", locale)}</h2>
          <p className="lead mx-auto mt-5 max-w-xl !text-paper/70">{setting(settings, "cta_desc", locale)}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={lp(locale, "/iletisim")} className="btn btn-primary">{t("cta.quote")}</Link>
            <Link href={lp(locale, "/fiyatlar")} className="btn border border-paper/25 text-paper hover:bg-paper/10">{t("cta.prices")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

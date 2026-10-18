import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { PricingGrid } from "@/components/PricingGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqList } from "@/components/FaqList";
import { ServiceObject } from "@/components/ServiceObject";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { getGeneralFaqs, getService, getServices, getSettings, setting, SITE_URL } from "@/lib/data";
import { prisma } from "@/lib/db";
import { t as makeT } from "@/lib/i18n";
import { getLocale, lines, pick } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import { seoAlternates } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [service, locale] = await Promise.all([getService(slug), getLocale()]);
  if (!service) notFound();
  const title = `${pick(service, "title", locale)} — ${pick(service, "tagline", locale)}`;
  const description = pick(service, "metaDesc", locale) || pick(service, "desc", locale);
  const alt = seoAlternates(`/${service.slug}`, locale);
  const url = alt.canonical;
  return {
    title,
    description,
    alternates: alt,
    openGraph: { title: `${title} | Craft`, description, url, siteName: "Craft", type: "website", locale: locale === "tr" ? "tr_TR" : "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

async function countView(id: string) {
  const h = await headers();
  const prefetch = h.get("next-router-prefetch") || (h.get("sec-purpose") ?? "").includes("prefetch");
  const bot = /bot|crawl|spider|slurp|preview|lighthouse/i.test(h.get("user-agent") ?? "");
  if (prefetch || bot) return;
  await prisma.service.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, locale, all, general, settings] = await Promise.all([getService(slug), getLocale(), getServices(), getGeneralFaqs(), getSettings()]);
  if (!service) notFound();
  await countView(service.id);

  const t = makeT(locale);
  const title = pick(service, "title", locale);
  const who = lines(pick(service, "who", locale));
  const build = lines(pick(service, "build", locale)).map((l) => {
    const [head, ...rest] = l.split(" — ");
    return rest.length ? { head, body: rest.join(" — ") } : { head: l, body: "" };
  });
  const faqSource = [...service.faqs, ...general].slice(0, Math.max(service.faqs.length, 4));
  const others = all.filter((s) => s.id !== service.id);
  const prices = service.packages.flatMap((p) => (p.price !== null ? [p.price] : []));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: pick(service, "desc", locale),
    url: `${SITE_URL}${lp(locale, `/${service.slug}`)}`,
    areaServed: "TR",
    ...(prices.length
      ? { offers: { "@type": "AggregateOffer", priceCurrency: service.packages[0].currency, lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* HERO */}
      <section className="wrap pb-14 pt-6 sm:pt-10" aria-labelledby="svc-title">
        <Link href={lp(locale, "/#hizmetler")} className="inline-flex min-h-10 items-center text-sm font-bold text-mute hover:text-ink">← {t("svc.back")}</Link>
        <div className="mt-4 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">{pick(service, "tagline", locale)}</p>
            <h1 id="svc-title" className="h-display mt-4 text-balance">{title}</h1>
            <p className="lead mt-6 max-w-2xl">{pick(service, "desc", locale)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#paketler" className="btn btn-dark">{t("cta.prices")}</a>
              <Link href={lp(locale, `/iletisim?hizmet=${service.slug}`)} className="btn btn-primary">{t("cta.quote")}</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-gradient-to-br from-paper-2 to-accent-soft/80 p-8">
            <div className="animate-float"><ServiceObject kind={service.icon} /></div>
          </div>
        </div>
      </section>

      {/* WHAT / WHO */}
      <section className="wrap grid gap-5 pb-16 lg:grid-cols-2" aria-label={`${t("svc.what")} / ${t("svc.who")}`}>
        <Reveal className="card p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-tight">{t("svc.what")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">{pick(service, "what", locale)}</p>
        </Reveal>
        <Reveal delay={0.08} className="card p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-tight">{t("svc.who")}</h2>
          <ul className="mt-5 space-y-3">
            {who.map((w) => (
              <li key={w} className="flex gap-3 text-lg text-ink-2">
                <span className="mt-2.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* BUILD */}
      {build.length > 0 && (
        <section className="wrap pb-20" aria-labelledby="build-title">
          <h2 id="build-title" className="h-section">{t("svc.build")}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {build.map((b, i) => (
              <Reveal as="li" key={b.head} delay={i * 0.06} className="card p-6">
                <span className="text-sm font-extrabold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-extrabold leading-snug">{b.head}</h3>
                {b.body && <p className="mt-2 leading-relaxed text-mute">{b.body}</p>}
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* PACKAGES */}
      <section id="paketler" className="bg-paper-2/70 py-16 sm:py-24" aria-labelledby="pk-title">
        <div className="wrap">
          <div id="pk-title">
            <SectionHeading eyebrow={t("nav.pricing")} title={`${title} — ${t("svc.packages")}`} sub={t("pricing.sub")} />
          </div>
          <div className="mt-10">
            <PricingGrid packages={service.packages} t={t} locale={locale} serviceSlug={service.slug} serviceTitle={title} />
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-mute">{setting(settings, "pricing_note", locale) || t("pricing.fallbackNote")}</p>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-mute">{t("pricing.fallbackNote")}</p>
        </div>
      </section>

      <div className="wrap py-20 sm:py-28">
        <HowItWorks t={t} id="nasil-calisir" compact />
      </div>

      {/* FAQ */}
      {faqSource.length > 0 && (
        <section className="wrap pb-20" aria-labelledby="sf-title">
          <h2 id="sf-title" className="h-section">{t("svc.faq")}</h2>
          <div className="mt-8 max-w-4xl">
            <FaqList
              items={faqSource.map((f) => ({ id: f.id, q: pick(f, "q", locale), a: pick(f, "a", locale) }))}
              emptyTitle={t("empty.faq.t")}
              emptyDesc={t("empty.faq.d")}
            />
          </div>
        </section>
      )}

      {/* CTA + other services */}
      <section className="wrap" aria-labelledby="svc-cta">
        <div className="rounded-[2.25rem] bg-accent px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <h2 id="svc-cta" className="h-section mx-auto max-w-2xl text-balance">{t("svc.ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">{t("svc.ctaDesc")}</p>
          <Link href={lp(locale, `/iletisim?hizmet=${service.slug}`)} className="btn btn-light mt-8">{t("cta.quote")}</Link>
        </div>
        {others.length > 0 && (
          <nav aria-label={t("svc.otherServices")} className="mt-10">
            <p className="text-sm font-extrabold uppercase tracking-widest text-mute">{t("svc.otherServices")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {others.map((s) => (
                <li key={s.id}><Link href={lp(locale, `/${s.slug}`)} className="chip !px-4 !py-2 !text-sm hover:border-ink/40">{pick(s, "title", locale)}</Link></li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </>
  );
}

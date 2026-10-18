import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { formLabels } from "@/lib/form-labels";
import { SectionHeading } from "@/components/SectionHeading";
import { contactInfo, getServices, getSettings } from "@/lib/data";
import { igLink, waLink } from "@/lib/format";
import { t as makeT } from "@/lib/i18n";
import { getLocale, pick } from "@/lib/locale";
import { seoAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = makeT(locale);
  return {
    title: t("form.title"),
    description: t("form.sub"),
    alternates: seoAlternates("/iletisim", locale),
    openGraph: { title: `${t("form.title")} | Craft`, description: t("form.sub"), url: seoAlternates("/iletisim", locale).canonical, type: "website" },
  };
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ hizmet?: string; paket?: string }> }) {
  const [{ hizmet, paket }, locale, services, settings] = await Promise.all([searchParams, getLocale(), getServices(), getSettings()]);
  const t = makeT(locale);
  const c = contactInfo(settings);
  const list = services.map((s) => ({ slug: s.slug, title: pick(s, "title", locale) }));
  const defaultService = list.some((s) => s.slug === hizmet) ? hizmet! : "";

  const methods = [
    c.whatsapp && { k: "wa", label: t("contact.writeWa"), value: c.whatsapp, href: waLink(c.whatsapp) },
    c.instagram && { k: "ig", label: t("contact.instagram"), value: `@${c.instagram.replace(/^@|https?:\/\/(www\.)?instagram\.com\//g, "").replace(/\/$/, "")}`, href: igLink(c.instagram) },
    c.email && { k: "mail", label: t("contact.emailUs"), value: c.email, href: `mailto:${c.email}` },
  ].filter(Boolean) as { k: string; label: string; value: string; href: string }[];

  return (
    <div className="wrap grid gap-10 pb-6 pt-8 sm:pt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div>
        <SectionHeading as="h1" eyebrow={t("form.title")} title={t("contact.title")} sub={t("form.sub")} />
        {methods.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-mute">{t("contact.direct")}</h2>
            <ul className="mt-4 space-y-3">
              {methods.map((m) => (
                <li key={m.k}>
                  <a
                    href={m.href}
                    target={m.k === "mail" ? undefined : "_blank"}
                    rel={m.k === "mail" ? undefined : "noopener noreferrer"}
                    className="card lift flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span>
                      <span className="block text-sm font-bold text-mute">{m.label}</span>
                      <span className="block font-extrabold">{m.value}</span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-accent">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-mute">{t("contact.replyNote")}</p>
          </div>
        )}
      </div>
      <QuoteForm labels={formLabels(t)} services={list} defaultService={defaultService} defaultPackage={paket?.slice(0, 80) ?? ""} locale={locale} />
    </div>
  );
}

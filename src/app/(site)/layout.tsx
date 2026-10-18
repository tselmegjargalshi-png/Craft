import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { MotionProvider } from "@/components/MotionProvider";
import { contactInfo, getServices, getSettings, setting } from "@/lib/data";
import { t as makeT } from "@/lib/i18n";
import { getLocale, pick } from "@/lib/locale";
import { waLink } from "@/lib/format";
import { lp } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [locale, settings, services] = await Promise.all([getLocale(), getSettings(), getServices()]);
  const t = makeT(locale);
  const contact = contactInfo(settings);

  const links = [
    { href: lp(locale, "/#hizmetler"), label: t("nav.services") },
    { href: lp(locale, "/fiyatlar"), label: t("nav.pricing") },
    { href: lp(locale, "/#nasil-calisir"), label: t("nav.how") },
    { href: lp(locale, "/#sss"), label: t("nav.faq") },
    { href: lp(locale, "/iletisim"), label: t("nav.contact") },
  ];

  return (
    <MotionProvider>
      <a href="#main" className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-bold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t("cta.skip")}
      </a>
      <Navbar
        links={links}
        cta={{ href: lp(locale, "/iletisim"), label: t("cta.quote") }}
        homeHref={lp(locale, "/")}
        locale={locale}
        langLabel={t("lang.label")}
        menuOpen={t("nav.menu")}
        menuClose={t("nav.close")}
        homeLabel={t("nav.home")}
        siteName={contact.siteName}
        logo={contact.logo || undefined}
      />
      <main id="main">{children}</main>
      <Footer
        t={t}
        locale={locale}
        contact={contact}
        tagline={setting(settings, "footer_tagline", locale)}
        services={services.map((s) => ({ slug: s.slug, title: pick(s, "title", locale) }))}
      />
      <StickyCta contactHref={lp(locale, "/iletisim")} quote={t("cta.quote")} whatsappHref={contact.whatsapp ? waLink(contact.whatsapp) : undefined} whatsappLabel={t("cta.whatsapp")} />
    </MotionProvider>
  );
}

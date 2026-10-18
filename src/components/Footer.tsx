import Link from "next/link";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { igLink, waLink } from "@/lib/format";
import { lp } from "@/lib/locale-path";
import type { Contact } from "@/lib/data";
import type { T } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function Footer({
  t,
  locale,
  contact,
  tagline,
  services,
}: {
  t: T;
  locale: Locale;
  contact: Contact;
  tagline: string;
  services: { slug: string; title: string }[];
}) {
  const socials = [
    contact.instagram && { label: "Instagram", href: igLink(contact.instagram) },
    contact.whatsapp && { label: "WhatsApp", href: waLink(contact.whatsapp) },
    contact.tiktok && { label: "TikTok", href: contact.tiktok.startsWith("http") ? contact.tiktok : `https://tiktok.com/@${contact.tiktok.replace(/^@/, "")}` },
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-24 bg-ink pb-28 pt-16 text-paper md:pb-12">
      <div className="wrap grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo name={contact.siteName} logo={contact.logo} light />
          <p className="mt-5 max-w-xs text-paper/70">{tagline}</p>
          <div className="mt-6">
            <LangSwitcher locale={locale} label={t("lang.label")} dark />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-paper/50">{t("footer.services")}</h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={lp(locale, `/${s.slug}`)} className="text-paper/85 hover:text-white hover:underline">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={lp(locale, "/fiyatlar")} className="font-bold text-white hover:underline">
                {t("nav.pricing")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-paper/50">{t("footer.contact")}</h2>
          <ul className="mt-4 space-y-2.5 text-paper/85">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-white hover:underline">{contact.email}</a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white hover:underline">{contact.phone}</a>
              </li>
            )}
            <li>
              <Link href={lp(locale, "/iletisim")} className="font-bold text-white hover:underline">{t("cta.quote")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-paper/50">{t("footer.social")}</h2>
          <ul className="mt-4 space-y-2.5">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-paper/85 hover:text-white hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap mt-14 border-t border-paper/10 pt-6 text-sm text-paper/50">
        © {new Date().getFullYear()} {contact.siteName}. {t("footer.rights")}
      </div>
    </footer>
  );
}

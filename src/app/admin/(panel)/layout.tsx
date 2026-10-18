import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { LogoMark } from "@/components/Logo";
import { LangSwitcher } from "@/components/LangSwitcher";
import { AdminNav } from "./AdminNav";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const locale = await getLocale();
  const t = makeT(locale);
  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });

  const items = [
    { href: "/admin", label: t("a.dashboard"), exact: true },
    { href: "/admin/services", label: t("a.services") },
    { href: "/admin/packages", label: t("a.packages") },
    { href: "/admin/leads", label: t("a.leads"), badge: newLeads },
    { href: "/admin/faq", label: t("a.faq") },
    { href: "/admin/content", label: t("a.content") },
    { href: "/admin/settings", label: t("a.settings") },
  ];

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-ink text-paper lg:sticky lg:top-0 lg:h-dvh lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-8 lg:px-5 lg:py-6">
          <div className="flex items-center gap-3">
            <LogoMark className="size-9" />
            <span className="font-extrabold">{t("a.brand")}</span>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <LangSwitcher locale={locale} label={t("lang.label")} dark strategy="cookie" />
          </div>
        </div>
        <AdminNav items={items} />
        <div className="hidden space-y-4 px-5 pb-6 pt-8 lg:absolute lg:bottom-0 lg:block lg:w-full">
          <LangSwitcher locale={locale} label={t("lang.label")} dark strategy="cookie" />
          <p className="truncate text-xs text-paper/50">{session.email}</p>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="btn btn-sm border border-paper/20 text-paper hover:bg-paper/10">{t("a.viewSite")}</Link>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-sm border border-paper/20 text-paper hover:bg-paper/10">{t("a.logout")}</button>
            </form>
          </div>
        </div>
        <div className="flex gap-2 border-t border-paper/10 px-4 py-3 lg:hidden">
          <Link href="/" target="_blank" className="btn btn-sm border border-paper/20 text-paper">{t("a.viewSite")}</Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-sm border border-paper/20 text-paper">{t("a.logout")}</button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

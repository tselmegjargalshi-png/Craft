import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { AdminEmpty, PageHeader } from "@/components/admin/ui";
import { LEAD_STATUSES } from "@/lib/validators";

export default async function Dashboard() {
  const locale = await getLocale();
  const t = makeT(locale);
  const [total, fresh, active, services, grouped, recent] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.service.count({ where: { enabled: true } }),
    prisma.service.findMany({ orderBy: { views: "desc" } }),
    prisma.lead.groupBy({ by: ["serviceSlug"], where: { serviceSlug: { not: "" } }, _count: { _all: true }, orderBy: { _count: { serviceSlug: "desc" } }, take: 1 }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const viewed = services[0]?.views ? services[0] : null;
  const topReq = grouped[0] ? { service: services.find((s) => s.slug === grouped[0].serviceSlug), count: grouped[0]._count._all } : null;

  const cards = [
    { label: t("a.dash.total"), value: String(total) },
    { label: t("a.dash.new"), value: String(fresh), accent: fresh > 0 },
    { label: t("a.dash.active"), value: String(active) },
    { label: t("a.dash.viewed"), value: viewed ? pick(viewed, "title", locale) : "—", sub: viewed ? `${viewed.views} ${t("a.dash.views")}` : t("a.dash.none"), small: true },
    { label: t("a.dash.requested"), value: topReq?.service ? pick(topReq.service, "title", locale) : "—", sub: topReq ? `${topReq.count} ${t("a.dash.requests")}` : t("a.dash.none"), small: true },
  ];

  return (
    <>
      <PageHeader title={t("a.dashboard")} />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label} className={`card p-6 ${c.accent ? "!border-accent/40 !bg-accent-soft/60" : ""}`}>
            <p className="text-sm font-bold text-mute">{c.label}</p>
            <p className={`mt-2 font-extrabold tracking-tight ${c.small ? "text-2xl" : "text-5xl"}`}>{c.value}</p>
            {c.sub && <p className="mt-1 text-sm text-mute">{c.sub}</p>}
          </li>
        ))}
      </ul>

      <h2 className="mb-4 mt-12 text-xl font-extrabold">{t("a.dash.recent")}</h2>
      {recent.length === 0 ? (
        <AdminEmpty title={t("a.leads.empty.t")} desc={t("a.leads.empty.d")} />
      ) : (
        <ul className="card divide-y divide-line">
          {recent.map((l) => (
            <li key={l.id}>
              <Link href="/admin/leads" className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-paper/60">
                <span>
                  <span className="block font-extrabold">{l.name}</span>
                  <span className="text-sm text-mute">{l.serviceTitle || "—"} · {formatDate(l.createdAt, locale)}</span>
                </span>
                <span className="chip">{t(`a.status.${l.status as (typeof LEAD_STATUSES)[number]}`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

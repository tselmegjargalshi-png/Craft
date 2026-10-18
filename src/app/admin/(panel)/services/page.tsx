import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { AdminEmpty, Flash, LinkButton, PageHeader } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/buttons";
import { deleteService, moveService, toggleService } from "../../actions";
import { ServiceObject } from "@/components/ServiceObject";

export default async function ServicesAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const [{ ok, err }, locale] = await Promise.all([searchParams, getLocale()]);
  const t = makeT(locale);
  const services = await prisma.service.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { packages: true } } } });

  return (
    <>
      <PageHeader title={t("a.services")} action={<LinkButton href="/admin/services/new" variant="primary">+ {t("a.svc.new")}</LinkButton>} />
      <Flash ok={ok} err={err} t={t} />
      {services.length === 0 ? (
        <AdminEmpty title={t("a.svc.empty.t")} desc={t("a.svc.empty.d")} action={<LinkButton href="/admin/services/new" variant="primary">+ {t("a.svc.new")}</LinkButton>} />
      ) : (
        <ul className="space-y-3">
          {services.map((s, i) => (
            <li key={s.id} className={`card flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${s.enabled ? "" : "opacity-60"}`}>
              <div className="flex flex-1 items-center gap-4">
                <div className="w-16 shrink-0 rounded-xl bg-paper-2 p-2"><ServiceObject kind={s.icon} /></div>
                <div className="min-w-0">
                  <p className="truncate font-extrabold">{pick(s, "title", locale)}</p>
                  <p className="truncate text-sm text-mute">/{s.slug} · {s._count.packages} {t("a.svc.packagesCount")} · {s.enabled ? t("a.enabled") : t("a.disabled")}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form action={moveService}>
                  <input type="hidden" name="id" value={s.id} /><input type="hidden" name="dir" value="up" />
                  <button className="btn btn-sm btn-ghost" disabled={i === 0} aria-label={t("a.moveUp")}>↑</button>
                </form>
                <form action={moveService}>
                  <input type="hidden" name="id" value={s.id} /><input type="hidden" name="dir" value="down" />
                  <button className="btn btn-sm btn-ghost" disabled={i === services.length - 1} aria-label={t("a.moveDown")}>↓</button>
                </form>
                <form action={toggleService}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="btn btn-sm btn-ghost">{s.enabled ? t("a.disabled") : t("a.enabled")}</button>
                </form>
                <Link href={`/admin/packages?service=${s.id}`} className="btn btn-sm btn-ghost">{t("a.packages")}</Link>
                <Link href={`/admin/services/${s.id}`} className="btn btn-sm btn-dark">{t("a.edit")}</Link>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton message={t("a.confirmDelete")}>{t("a.delete")}</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

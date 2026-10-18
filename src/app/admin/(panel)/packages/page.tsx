import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { AdminEmpty, Flash, LinkButton, PageHeader } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/buttons";
import { deletePackage, movePackage, togglePackage } from "../../actions";

export default async function PackagesAdmin({ searchParams }: { searchParams: Promise<{ service?: string; ok?: string; err?: string }> }) {
  const [{ service, ok, err }, locale] = await Promise.all([searchParams, getLocale()]);
  const t = makeT(locale);
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const current = services.find((s) => s.id === service) ?? services[0];
  const packages = current
    ? await prisma.package.findMany({ where: { serviceId: current.id }, orderBy: { order: "asc" }, include: { _count: { select: { features: true } } } })
    : [];

  return (
    <>
      <PageHeader
        title={t("a.packages")}
        action={current && <LinkButton href={`/admin/packages/new?service=${current.id}`} variant="primary">+ {t("a.pkg.new")}</LinkButton>}
      />
      <Flash ok={ok} err={err} t={t} />
      {!current ? (
        <AdminEmpty title={t("a.svc.empty.t")} desc={t("a.svc.empty.d")} action={<LinkButton href="/admin/services/new" variant="primary">+ {t("a.svc.new")}</LinkButton>} />
      ) : (
        <>
          <nav aria-label={t("a.services")} className="-mx-1 mb-6 overflow-x-auto px-1 pb-2">
            <ul className="flex w-max gap-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/packages?service=${s.id}`}
                    aria-current={s.id === current.id ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-extrabold ${s.id === current.id ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-2 hover:border-ink/40"}`}
                  >
                    {pick(s, "title", locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {packages.length === 0 ? (
            <AdminEmpty title={t("a.pkg.empty.t")} desc={t("a.pkg.empty.d")} action={<LinkButton href={`/admin/packages/new?service=${current.id}`} variant="primary">+ {t("a.pkg.new")}</LinkButton>} />
          ) : (
            <ul className="space-y-3">
              {packages.map((p, i) => (
                <li key={p.id} className={`card flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${p.visible ? "" : "opacity-60"}`}>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-extrabold">
                      {pick(p, "name", locale)}
                      {p.highlight && <span className="chip !bg-accent !text-white">★</span>}
                      {!p.visible && <span className="chip">{t("a.hidden")}</span>}
                    </p>
                    <p className="text-sm text-mute">
                      {p.price === null || p.billing === "QUOTE" ? t("pricing.quote") : formatPrice(p.price, p.currency, locale)} · {t(`a.billing.${p.billing as "ONE_TIME" | "MONTHLY" | "YEARLY" | "QUOTE"}`)} · {p._count.features}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={movePackage}>
                      <input type="hidden" name="id" value={p.id} /><input type="hidden" name="dir" value="up" />
                      <button className="btn btn-sm btn-ghost" disabled={i === 0} aria-label={t("a.moveUp")}>↑</button>
                    </form>
                    <form action={movePackage}>
                      <input type="hidden" name="id" value={p.id} /><input type="hidden" name="dir" value="down" />
                      <button className="btn btn-sm btn-ghost" disabled={i === packages.length - 1} aria-label={t("a.moveDown")}>↓</button>
                    </form>
                    <form action={togglePackage}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="btn btn-sm btn-ghost">{p.visible ? t("a.hidden") : t("a.visible")}</button>
                    </form>
                    <Link href={`/admin/packages/${p.id}`} className="btn btn-sm btn-dark">{t("a.edit")}</Link>
                    <form action={deletePackage}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton message={t("a.confirmDelete")}>{t("a.delete")}</ConfirmButton>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

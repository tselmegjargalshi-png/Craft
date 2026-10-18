import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { contactInfo, getSettings } from "@/lib/data";
import { formatDate, waLink } from "@/lib/format";
import { BUDGETS, LEAD_STATUSES, type LeadStatus } from "@/lib/validators";
import { AdminEmpty, Flash, PageHeader } from "@/components/admin/ui";
import { AutoSubmitSelect } from "@/components/admin/buttons";
import { setLeadStatus } from "../../actions";

export default async function LeadsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; ok?: string; err?: string }> }) {
  const [{ status, ok, err }, locale, settings] = await Promise.all([searchParams, getLocale(), getSettings()]);
  const t = makeT(locale);
  void contactInfo(settings);
  const filter = (LEAD_STATUSES as readonly string[]).includes(status ?? "") ? (status as LeadStatus) : undefined;
  const leads = await prisma.lead.findMany({ where: filter ? { status: filter } : {}, orderBy: { createdAt: "desc" }, take: 200 });
  const budgetLabel = (b: string) => ((BUDGETS as readonly string[]).includes(b) ? t(`form.budget.${b as (typeof BUDGETS)[number]}`) : "—");

  return (
    <>
      <PageHeader title={t("a.leads")} />
      <Flash ok={ok} err={err} t={t} />
      <nav aria-label={t("a.leads.filter")} className="-mx-1 mb-6 overflow-x-auto px-1 pb-2">
        <ul className="flex w-max gap-2">
          {[undefined, ...LEAD_STATUSES].map((s) => (
            <li key={s ?? "all"}>
              <Link
                href={s ? `/admin/leads?status=${s}` : "/admin/leads"}
                aria-current={s === filter ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-extrabold ${s === filter ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-2 hover:border-ink/40"}`}
              >
                {s ? t(`a.status.${s}`) : t("a.leads.all")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {leads.length === 0 ? (
        <AdminEmpty title={t("a.leads.empty.t")} desc={t("a.leads.empty.d")} />
      ) : (
        <ul className="space-y-3">
          {leads.map((l) => (
            <li key={l.id} className="card p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div className="min-w-0">
                  <p className="text-lg font-extrabold">{l.name}</p>
                  <p className="mt-1 break-words text-sm text-ink-2">
                    <a href={`mailto:${l.email}`} className="underline-offset-2 hover:underline">{l.email}</a> · <a href={`tel:${l.whatsapp.replace(/\s/g, "")}`} className="underline-offset-2 hover:underline">{l.whatsapp}</a>
                  </p>
                  <p className="mt-2 flex flex-wrap gap-2 text-xs">
                    {l.serviceTitle && <span className="chip">{l.serviceTitle}</span>}
                    {l.packageName && <span className="chip">{l.packageName}</span>}
                    <span className="chip">{t("a.leads.budget")}: {budgetLabel(l.budget)}</span>
                    <span className="chip">{formatDate(l.createdAt, locale)}</span>
                  </p>
                  {l.message && <p className="mt-3 whitespace-pre-wrap break-words rounded-2xl bg-paper px-4 py-3 text-sm text-ink-2">{l.message}</p>}
                </div>
                <div className="flex shrink-0 flex-row items-center gap-2 md:flex-col md:items-stretch">
                  <form action={setLeadStatus}>
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="filter" value={filter ?? ""} />
                    <AutoSubmitSelect name="status" defaultValue={l.status} label={t("a.leads.status")}>
                      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{t(`a.status.${s}`)}</option>)}
                    </AutoSubmitSelect>
                  </form>
                  <a href={waLink(l.whatsapp, t("a.leads.waText"))} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    {t("a.leads.wa")}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

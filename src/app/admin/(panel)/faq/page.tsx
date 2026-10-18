import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/locale";
import { t as makeT, type T } from "@/lib/i18n";
import { AdminEmpty, Bilingual, Check, Field, Flash, Input, PageHeader, Panel, Select, Textarea } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import { deleteFaq, moveFaq, saveFaq } from "../../actions";

type FaqRow = { id: string; serviceId: string | null; visible: boolean; qTr: string; qEn: string; aTr: string; aEn: string };

function FaqForm({ faq, services, t, locale }: { faq?: FaqRow; services: { id: string; titleTr: string; titleEn: string }[]; t: T; locale: "tr" | "en" }) {
  return (
    <form action={saveFaq} className="space-y-4">
      <input type="hidden" name="id" value={faq?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("a.faq.scope")}>
          <Select name="serviceId" defaultValue={faq?.serviceId ?? ""}>
            <option value="">{t("a.faq.general")}</option>
            {services.map((s) => <option key={s.id} value={s.id}>{pick(s, "title", locale)}</option>)}
          </Select>
        </Field>
        <div className="flex items-end"><Check name="visible" label={t("a.visible")} defaultChecked={faq?.visible ?? true} /></div>
      </div>
      <Bilingual t={t}>
        {[
          <div key="tr" className="space-y-4">
            <Field label={t("a.faq.q")}><Input name="qTr" required maxLength={200} defaultValue={faq?.qTr} /></Field>
            <Field label={t("a.faq.a")}><Textarea name="aTr" required rows={4} maxLength={1500} defaultValue={faq?.aTr} /></Field>
          </div>,
          <div key="en" className="space-y-4">
            <Field label={t("a.faq.q")}><Input name="qEn" required maxLength={200} defaultValue={faq?.qEn} /></Field>
            <Field label={t("a.faq.a")}><Textarea name="aEn" required rows={4} maxLength={1500} defaultValue={faq?.aEn} /></Field>
          </div>,
        ]}
      </Bilingual>
      <SubmitButton pending={t("a.saving")}>{faq ? t("a.save") : t("a.add")}</SubmitButton>
    </form>
  );
}

export default async function FaqAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const [{ ok, err }, locale] = await Promise.all([searchParams, getLocale()]);
  const t = makeT(locale);
  const [faqs, services] = await Promise.all([
    prisma.faq.findMany({ orderBy: [{ serviceId: "asc" }, { order: "asc" }], include: { service: true } }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title={t("a.faq")} />
      <Flash ok={ok} err={err} t={t} />
      {faqs.length === 0 ? (
        <AdminEmpty title={t("a.faq.empty.t")} desc={t("a.faq.empty.d")} />
      ) : (
        <ul className="space-y-3">
          {faqs.map((f) => (
            <li key={f.id} className={`card ${f.visible ? "" : "opacity-60"}`}>
              <details className="group">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <span className="block font-extrabold">{pick(f, "q", locale)}</span>
                    <span className="text-sm text-mute">{f.service ? pick(f.service, "title", locale) : t("a.faq.general")}{f.visible ? "" : ` · ${t("a.hidden")}`}</span>
                  </span>
                  <span className="btn btn-sm btn-ghost group-open:hidden">{t("a.edit")}</span>
                </summary>
                <div className="space-y-5 border-t border-line p-5">
                  <FaqForm faq={f} services={services} t={t} locale={locale} />
                  <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                    <form action={moveFaq}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="dir" value="up" /><button className="btn btn-sm btn-ghost" aria-label={t("a.moveUp")}>↑</button></form>
                    <form action={moveFaq}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="dir" value="down" /><button className="btn btn-sm btn-ghost" aria-label={t("a.moveDown")}>↓</button></form>
                    <form action={deleteFaq}><input type="hidden" name="id" value={f.id} /><ConfirmButton message={t("a.confirmDelete")}>{t("a.delete")}</ConfirmButton></form>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-10">
        <Panel title={t("a.faq.new")}>
          <FaqForm services={services} t={t} locale={locale} />
        </Panel>
      </div>
    </>
  );
}

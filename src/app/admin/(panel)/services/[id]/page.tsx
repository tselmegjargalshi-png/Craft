import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { Bilingual, Check, Field, Flash, Input, PageHeader, Panel, Select, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { saveService } from "../../../actions";

export default async function EditService({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const [{ id }, { ok, err }, locale] = await Promise.all([params, searchParams, getLocale()]);
  const t = makeT(locale);
  const s = id === "new" ? null : await prisma.service.findUnique({ where: { id } });
  if (id !== "new" && !s) notFound();

  return (
    <>
      <PageHeader title={s ? (locale === "tr" ? s.titleTr : s.titleEn) : t("a.svc.new")} />
      <Flash ok={ok} err={err} t={t} />
      <form action={saveService} className="space-y-6">
        <input type="hidden" name="id" value={s?.id ?? ""} />
        <Panel>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("a.svc.slug")} hint={t("a.svc.slugHint")}>
              <Input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={60} defaultValue={s?.slug} />
            </Field>
            <Field label={t("a.svc.icon")}>
              <Select name="icon" defaultValue={s?.icon ?? "web"}>
                {(["web", "menu", "nfc", "webapp", "app"] as const).map((i) => <option key={i} value={i}>{i}</option>)}
              </Select>
            </Field>
          </div>
          <Check name="enabled" label={t("a.enabled")} defaultChecked={s?.enabled ?? true} />
        </Panel>

        <Panel>
          <Bilingual t={t}>
            {[
              <div key="tr" className="space-y-4">
                <Field label={t("a.svc.title")}><Input name="titleTr" required maxLength={80} defaultValue={s?.titleTr} /></Field>
                <Field label={t("a.svc.tagline")}><Input name="taglineTr" maxLength={140} defaultValue={s?.taglineTr} /></Field>
                <Field label={t("a.svc.desc")}><Textarea name="descTr" required maxLength={400} defaultValue={s?.descTr} /></Field>
                <Field label={t("a.svc.what")}><Textarea name="whatTr" rows={5} maxLength={2000} defaultValue={s?.whatTr} /></Field>
                <Field label={t("a.svc.who")}><Textarea name="whoTr" rows={4} maxLength={1500} defaultValue={s?.whoTr} /></Field>
                <Field label={t("a.svc.build")}><Textarea name="buildTr" rows={5} maxLength={2500} defaultValue={s?.buildTr} /></Field>
                <Field label={t("a.svc.meta")}><Textarea name="metaDescTr" maxLength={200} defaultValue={s?.metaDescTr} /></Field>
              </div>,
              <div key="en" className="space-y-4">
                <Field label={t("a.svc.title")}><Input name="titleEn" required maxLength={80} defaultValue={s?.titleEn} /></Field>
                <Field label={t("a.svc.tagline")}><Input name="taglineEn" maxLength={140} defaultValue={s?.taglineEn} /></Field>
                <Field label={t("a.svc.desc")}><Textarea name="descEn" required maxLength={400} defaultValue={s?.descEn} /></Field>
                <Field label={t("a.svc.what")}><Textarea name="whatEn" rows={5} maxLength={2000} defaultValue={s?.whatEn} /></Field>
                <Field label={t("a.svc.who")}><Textarea name="whoEn" rows={4} maxLength={1500} defaultValue={s?.whoEn} /></Field>
                <Field label={t("a.svc.build")}><Textarea name="buildEn" rows={5} maxLength={2500} defaultValue={s?.buildEn} /></Field>
                <Field label={t("a.svc.meta")}><Textarea name="metaDescEn" maxLength={200} defaultValue={s?.metaDescEn} /></Field>
              </div>,
            ]}
          </Bilingual>
        </Panel>
        <SubmitButton pending={t("a.saving")}>{t("a.save")}</SubmitButton>
      </form>
    </>
  );
}

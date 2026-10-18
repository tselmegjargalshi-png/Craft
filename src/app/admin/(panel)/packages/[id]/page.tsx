import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { BILLING_TYPES } from "@/lib/validators";
import { Bilingual, Check, Field, Flash, Input, PageHeader, Panel, Select, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { savePackage } from "../../../actions";

export default async function EditPackage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ service?: string; ok?: string; err?: string }> }) {
  const [{ id }, { service, ok, err }, locale] = await Promise.all([params, searchParams, getLocale()]);
  const t = makeT(locale);
  const p = id === "new" ? null : await prisma.package.findUnique({ where: { id }, include: { features: { orderBy: { order: "asc" } } } });
  if (id !== "new" && !p) notFound();
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const serviceId = p?.serviceId ?? service ?? services[0]?.id;
  if (!serviceId) notFound();

  return (
    <>
      <PageHeader title={p ? pick(p, "name", locale) : t("a.pkg.new")} />
      <Flash ok={ok} err={err} t={t} />
      <form action={savePackage} className="space-y-6">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <Panel>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={t("a.pkg.chooseService")}>
              <Select name="serviceId" defaultValue={serviceId}>
                {services.map((s) => <option key={s.id} value={s.id}>{pick(s, "title", locale)}</option>)}
              </Select>
            </Field>
            <Field label={t("a.pkg.price")} hint={t("a.pkg.priceHint")}>
              <Input name="price" inputMode="numeric" defaultValue={p?.price ?? ""} placeholder="9900" />
            </Field>
            <Field label={t("a.pkg.currency")}><Input name="currency" required maxLength={3} defaultValue={p?.currency ?? "TRY"} /></Field>
            <Field label={t("a.pkg.billing")}>
              <Select name="billing" defaultValue={p?.billing ?? "ONE_TIME"}>
                {BILLING_TYPES.map((b) => <option key={b} value={b}>{t(`a.billing.${b}`)}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-1 sm:grid-cols-3">
            <Check name="startingPrice" label={t("a.pkg.starting")} defaultChecked={p?.startingPrice ?? true} />
            <Check name="highlight" label={t("a.pkg.highlight")} defaultChecked={p?.highlight ?? false} />
            <Check name="visible" label={t("a.visible")} defaultChecked={p?.visible ?? true} />
          </div>
        </Panel>

        <Panel>
          <Bilingual t={t}>
            {[
              <div key="tr" className="space-y-4">
                <Field label={t("a.pkg.name")}><Input name="nameTr" required maxLength={60} defaultValue={p?.nameTr} /></Field>
                <Field label={t("a.pkg.desc")}><Textarea name="descTr" required maxLength={200} defaultValue={p?.descTr} /></Field>
                <Field label={t("a.pkg.note")}><Input name="noteTr" maxLength={40} defaultValue={p?.noteTr} /></Field>
                <Field label={t("a.pkg.cta")}><Input name="ctaTr" maxLength={40} defaultValue={p?.ctaTr ?? "Teklif Al"} /></Field>
                <Field label={t("a.pkg.features")} hint={t("a.pkg.featuresHint")}>
                  <Textarea name="featuresTr" rows={10} defaultValue={p?.features.map((f) => f.textTr).join("\n")} />
                </Field>
              </div>,
              <div key="en" className="space-y-4">
                <Field label={t("a.pkg.name")}><Input name="nameEn" required maxLength={60} defaultValue={p?.nameEn} /></Field>
                <Field label={t("a.pkg.desc")}><Textarea name="descEn" required maxLength={200} defaultValue={p?.descEn} /></Field>
                <Field label={t("a.pkg.note")}><Input name="noteEn" maxLength={40} defaultValue={p?.noteEn} /></Field>
                <Field label={t("a.pkg.cta")}><Input name="ctaEn" maxLength={40} defaultValue={p?.ctaEn ?? "Get a Quote"} /></Field>
                <Field label={t("a.pkg.features")} hint={t("a.pkg.featuresHint")}>
                  <Textarea name="featuresEn" rows={10} defaultValue={p?.features.map((f) => f.textEn).join("\n")} />
                </Field>
              </div>,
            ]}
          </Bilingual>
        </Panel>
        <SubmitButton pending={t("a.saving")}>{t("a.save")}</SubmitButton>
      </form>
    </>
  );
}

import { getLocale } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { getSettings } from "@/lib/data";
import { Bilingual, Field, Flash, Input, PageHeader, Panel, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { saveContent } from "../../actions";

export default async function ContentAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const [{ ok, err }, locale, s] = await Promise.all([searchParams, getLocale(), getSettings()]);
  const t = makeT(locale);
  const v = (k: string, l: "tr" | "en") => s[k]?.[l] ?? "";

  const groups: { title: string; fields: { key: string; label: string; long?: boolean }[] }[] = [
    { title: t("a.content.hero"), fields: [{ key: "hero_eyebrow", label: "Eyebrow" }, { key: "hero_title", label: t("a.svc.title") }, { key: "hero_desc", label: t("a.svc.desc"), long: true }] },
    { title: t("a.content.about"), fields: [{ key: "about_title", label: t("a.svc.title") }, { key: "about_text", label: t("a.svc.desc"), long: true }] },
    { title: t("a.content.cta"), fields: [{ key: "cta_title", label: t("a.svc.title") }, { key: "cta_desc", label: t("a.svc.desc"), long: true }] },
    { title: t("a.content.pricing"), fields: [{ key: "pricing_note", label: t("a.content.pricing"), long: true }] },
    { title: t("a.content.footer"), fields: [{ key: "footer_tagline", label: t("a.content.footer") }] },
  ];

  const col = (l: "tr" | "en", fields: (typeof groups)[number]["fields"]) => (
    <div className="space-y-4">
      {fields.map((f) => (
        <Field key={f.key} label={f.label}>
          {f.long ? <Textarea name={`${l}:${f.key}`} rows={4} maxLength={1200} defaultValue={v(f.key, l)} /> : <Input name={`${l}:${f.key}`} maxLength={300} defaultValue={v(f.key, l)} />}
        </Field>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader title={t("a.content")} />
      <Flash ok={ok} err={err} t={t} />
      <form action={saveContent} className="space-y-6">
        {groups.map((g) => (
          <Panel key={g.title} title={g.title}>
            <Bilingual t={t}>{[col("tr", g.fields), col("en", g.fields)]}</Bilingual>
          </Panel>
        ))}
        <SubmitButton pending={t("a.saving")}>{t("a.save")}</SubmitButton>
      </form>
    </>
  );
}

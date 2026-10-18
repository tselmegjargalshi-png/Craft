import { getLocale } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";
import { getSettings } from "@/lib/data";
import { Field, Flash, Input, PageHeader, Panel } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { saveSettings } from "../../actions";

export default async function SettingsAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const [{ ok, err }, locale, s] = await Promise.all([searchParams, getLocale(), getSettings()]);
  const t = makeT(locale);
  const v = (k: string) => s[k]?.tr ?? "";

  return (
    <>
      <PageHeader title={t("a.settings")} />
      <Flash ok={ok} err={err} t={t} />
      <form action={saveSettings} className="space-y-6">
        <Panel title={t("a.settings.site")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site"><Input name="v:site_name" required maxLength={40} defaultValue={v("site_name")} /></Field>
            <Field label="Logo URL" hint={t("a.settings.logoHint")}><Input name="v:logo_url" maxLength={300} defaultValue={v("logo_url")} placeholder="https://…" /></Field>
          </div>
        </Panel>
        <Panel title={t("a.settings.contact")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp" hint={t("a.settings.waHint")}><Input name="v:whatsapp" inputMode="tel" maxLength={20} defaultValue={v("whatsapp")} placeholder="905320000000" /></Field>
            <Field label="E-mail"><Input name="v:email" type="email" maxLength={120} defaultValue={v("email")} /></Field>
            <Field label="Instagram"><Input name="v:instagram" maxLength={120} defaultValue={v("instagram")} placeholder="craft.studio" /></Field>
            <Field label="Telefon / Phone"><Input name="v:phone" maxLength={30} defaultValue={v("phone")} /></Field>
            <Field label="Adres / Address"><Input name="v:address" maxLength={200} defaultValue={v("address")} /></Field>
          </div>
        </Panel>
        <Panel title={t("a.settings.social")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="TikTok"><Input name="v:tiktok" maxLength={200} defaultValue={v("tiktok")} /></Field>
            <Field label="LinkedIn"><Input name="v:linkedin" maxLength={200} defaultValue={v("linkedin")} placeholder="https://linkedin.com/…" /></Field>
          </div>
        </Panel>
        <SubmitButton pending={t("a.saving")}>{t("a.save")}</SubmitButton>
      </form>
    </>
  );
}

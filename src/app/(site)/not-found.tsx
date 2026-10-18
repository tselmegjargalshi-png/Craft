import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import { t as makeT } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const t = makeT(locale);
  return (
    <div className="wrap py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h-section mt-3">{t("nf.title")}</h1>
      <p className="lead mx-auto mt-4 max-w-md">{t("nf.desc")}</p>
      <Link href={lp(locale, "/")} className="btn btn-dark mt-8">{t("err.home")}</Link>
    </div>
  );
}

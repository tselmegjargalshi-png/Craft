import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { LogoMark } from "@/components/Logo";
import { getLocale } from "@/lib/locale";
import { t as makeT } from "@/lib/i18n";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  const t = makeT(await getLocale());
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <LogoMark className="size-14" />
          <h1 className="text-2xl font-extrabold tracking-tight">{t("a.login.title")}</h1>
        </div>
        <LoginForm
          labels={{
            email: t("a.login.email"),
            password: t("a.login.password"),
            submit: t("a.login.submit"),
            saving: t("a.saving"),
            invalid: t("a.login.error"),
            rate: t("a.login.rate"),
          }}
        />
      </div>
    </main>
  );
}

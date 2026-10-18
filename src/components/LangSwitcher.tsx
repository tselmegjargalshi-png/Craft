"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { lp, splitLocalePath } from "@/lib/locale-path";
import { useTransition } from "react";

export function LangSwitcher({ locale, label, dark = false, strategy = "path" }: { locale: "tr" | "en"; label: string; dark?: boolean; strategy?: "path" | "cookie" }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [pending, start] = useTransition();

  function choose(next: "tr" | "en") {
    if (next === locale) return;
    document.cookie = `craft-lang=${next}; path=/; max-age=31536000; samesite=lax`;
    if (strategy === "cookie") {
      start(() => router.refresh());
      return;
    }
    // Public site: the language lives in the URL (/en/...), so go to the same page in the other language.
    const { path } = splitLocalePath(pathname);
    const target = lp(next, path) + (search ? `?${search}` : "") + window.location.hash;
    // Full navigation: the shared layout (nav, footer) is rendered per language and must not be reused by the client router.
    window.location.assign(target);
  }

  const base = dark ? "border-paper/25 text-paper" : "border-ink/15 bg-card/70 text-ink";
  return (
    <div role="group" aria-label={label} className={`inline-flex items-center rounded-full border p-0.5 text-xs font-extrabold ${base} ${pending ? "opacity-60" : ""}`}>
      {(["tr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={locale === l}
          lang={l}
          className={`min-h-8 min-w-9 rounded-full px-2.5 transition ${
            locale === l ? (dark ? "bg-paper text-ink" : "bg-ink text-paper") : "opacity-70 hover:opacity-100"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

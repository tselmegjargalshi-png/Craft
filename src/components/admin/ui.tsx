import Link from "next/link";
import type { T } from "@/lib/i18n";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {sub && <p className="mt-1.5 text-mute">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Flash({ ok, err, t }: { ok?: string; err?: string; t: T }) {
  if (err) return <p role="alert" className="mb-6 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent-dark">{t("a.error")}</p>;
  if (ok) return <p role="status" className="mb-6 rounded-2xl bg-ok/10 px-4 py-3 text-sm font-bold text-ok">{ok === "deleted" ? t("a.deleted") : t("a.saved")}</p>;
  return null;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

type P<E> = React.ComponentProps<E extends "input" ? "input" : E extends "textarea" ? "textarea" : "select">;
export const Input = (p: P<"input">) => <input {...p} className={`field ${p.className ?? ""}`} />;
export const Textarea = (p: P<"textarea">) => <textarea rows={3} {...p} className={`field resize-y ${p.className ?? ""}`} />;
export const Select = (p: P<"select">) => <select {...p} className={`field ${p.className ?? ""}`} />;

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-bold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-5 accent-[#d23b1e]" />
      {label}
    </label>
  );
}

/** Two columns: Turkish and English version of the same content. */
export function Bilingual({ t, children }: { t: T; children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-line bg-paper/60 p-4">
        <p className="text-xs font-extrabold uppercase tracking-widest text-mute">🇹🇷 {t("a.tr")}</p>
        {children[0]}
      </div>
      <div className="space-y-4 rounded-2xl border border-line bg-paper/60 p-4">
        <p className="text-xs font-extrabold uppercase tracking-widest text-mute">🇬🇧 {t("a.en")}</p>
        {children[1]}
      </div>
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-5 p-5 sm:p-7">
      {title && <h2 className="text-lg font-extrabold">{title}</h2>}
      {children}
    </section>
  );
}

export function AdminEmpty({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-ink/20 bg-card/60 px-6 py-14 text-center">
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-mute">{desc}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LinkButton({ href, children, variant = "dark" }: { href: string; children: React.ReactNode; variant?: "dark" | "ghost" | "primary" }) {
  return <Link href={href} className={`btn btn-sm btn-${variant}`}>{children}</Link>;
}

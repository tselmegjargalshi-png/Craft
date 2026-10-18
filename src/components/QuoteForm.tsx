"use client";
import { useRef, useState } from "react";

export type FormLabels = {
  name: string; email: string; whatsapp: string; whatsappHint: string; service: string; servicePlaceholder: string;
  budget: string; budgetPlaceholder: string; message: string; messageHint: string; package: string;
  submit: string; sending: string; success: string; successTitle: string; another: string;
  error: string; rate: string; invalid: string;
  errName: string; errEmail: string; errWhatsapp: string; errMessage: string;
  budgets: { value: string; label: string }[];
};

type Errors = Partial<Record<"name" | "email" | "whatsapp" | "message", string>>;
type Status = "idle" | "sending" | "success" | "error" | "rate";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+\d][\d\s()-]{6,20}$/;

export function QuoteForm({
  labels,
  services,
  defaultService = "",
  defaultPackage = "",
  locale,
}: {
  labels: FormLabels;
  services: { slug: string; title: string }[];
  defaultService?: string;
  defaultPackage?: string;
  locale: "tr" | "en";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(f: FormData): Errors {
    const e: Errors = {};
    if (String(f.get("name") ?? "").trim().length < 2) e.name = labels.errName;
    if (!EMAIL.test(String(f.get("email") ?? "").trim())) e.email = labels.errEmail;
    if (!PHONE.test(String(f.get("whatsapp") ?? "").trim())) e.whatsapp = labels.errWhatsapp;
    if (String(f.get("message") ?? "").length > 1500) e.message = labels.errMessage;
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === "sending") return;
    const f = new FormData(ev.currentTarget);
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus("idle");
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(f.entries()), locale }),
      });
      if (res.status === 429) return setStatus("rate");
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        setTimeout(() => successRef.current?.focus(), 50);
        return;
      }
      if (data.errors) {
        const m: Errors = {};
        if (data.errors.name) m.name = labels.errName;
        if (data.errors.email) m.email = labels.errEmail;
        if (data.errors.whatsapp) m.whatsapp = labels.errWhatsapp;
        if (data.errors.message) m.message = labels.errMessage;
        setErrors(m);
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card p-8 text-center outline-none sm:p-12">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-ok/10 text-ok" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h2 className="mt-5 text-2xl font-extrabold">{labels.successTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-2">{labels.success}</p>
        <button
          type="button"
          className="btn btn-ghost mt-7"
          onClick={() => {
            setStatus("idle");
            setErrors({});
          }}
        >
          {labels.another}
        </button>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
  });
  const Err = ({ name }: { name: keyof Errors }) =>
    errors[name] ? (
      <p id={`${name}-err`} className="field-error" role="alert">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-9" aria-busy={status === "sending"}>
      {/* honeypot: real visitors never see or fill this */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">{labels.name}</label>
          <input id="name" name="name" autoComplete="name" required maxLength={80} className="field" {...field("name")} />
          <Err name="name" />
        </div>
        <div>
          <label htmlFor="email" className="label">{labels.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={120} className="field" {...field("email")} />
          <Err name="email" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="whatsapp" className="label">{labels.whatsapp}</label>
          <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" required maxLength={24} placeholder={labels.whatsappHint} className="field" {...field("whatsapp")} />
          <Err name="whatsapp" />
        </div>
        <div>
          <label htmlFor="service" className="label">{labels.service}</label>
          <select id="service" name="service" defaultValue={defaultService} className="field">
            <option value="">{labels.servicePlaceholder}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="label">{labels.budget}</label>
          <select id="budget" name="budget" defaultValue="" className="field">
            <option value="">{labels.budgetPlaceholder}</option>
            {labels.budgets.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
        {defaultPackage && (
          <div>
            <label htmlFor="packageName" className="label">{labels.package}</label>
            <input id="packageName" name="packageName" defaultValue={defaultPackage} readOnly maxLength={80} className="field bg-paper-2/60" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className="label">{labels.message}</label>
        <textarea id="message" name="message" rows={5} maxLength={1500} placeholder={labels.messageHint} className="field resize-y" {...field("message")} />
        <Err name="message" />
      </div>

      {status === "error" && <p role="alert" className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent-dark">{Object.keys(errors).length ? labels.invalid : labels.error}</p>}
      {status === "rate" && <p role="alert" className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent-dark">{labels.rate}</p>}

      <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-64" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            {labels.sending}
          </>
        ) : (
          labels.submit
        )}
      </button>
    </form>
  );
}

"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pending: pendingLabel, variant = "primary" }: { children: React.ReactNode; pending: string; variant?: "primary" | "dark" | "ghost" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`btn btn-sm btn-${variant}`}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Submit button that asks for confirmation first (used for destructive actions). */
export function ConfirmButton({ children, message, label }: { children: React.ReactNode; message: string; label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      className="btn btn-sm btn-ghost !text-accent-dark hover:!border-accent"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Auto-submits its form when the select value changes (lead status). */
export function AutoSubmitSelect({ name, defaultValue, children, label }: { name: string; defaultValue: string; children: React.ReactNode; label: string }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      aria-label={label}
      className="field !min-h-10 !py-1.5 text-sm font-bold"
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {children}
    </select>
  );
}

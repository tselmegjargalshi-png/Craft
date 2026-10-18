"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";

type Labels = { email: string; password: string; submit: string; saving: string; invalid: string; rate: string };

export function LoginForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="card space-y-5 p-7">
      <div>
        <label htmlFor="email" className="label">{labels.email}</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">{labels.password}</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-bold text-accent-dark">
          {state.error === "rate" ? labels.rate : labels.invalid}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-dark w-full">
        {pending ? labels.saving : labels.submit}
      </button>
    </form>
  );
}

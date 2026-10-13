"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/actions/auth";
import { fieldClass } from "@/components/public/ui";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(login, {} as AuthState);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={nextPath} />
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-navy">Email</span>
        <input name="email" type="email" required autoComplete="username" className={fieldClass} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-navy">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={fieldClass} />
      </label>
      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      <button disabled={pending} className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

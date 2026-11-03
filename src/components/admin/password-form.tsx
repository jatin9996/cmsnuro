"use client";

import { useActionState } from "react";
import { changePassword, type AuthState } from "@/actions/auth";
import { fieldClass } from "@/components/public/ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {} as AuthState);

  return (
    <form action={action} className="grid max-w-md gap-4 rounded-3xl bg-white p-6 ring-1 ring-navy/5">
      <div>
        <h2 className="text-lg font-semibold text-navy">Admin password</h2>
        <p className="mt-1 text-sm text-muted">This is the password for signing in to the clinic admin, not the clinic contact email.</p>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-navy">Current password</span>
        <input name="currentPassword" type="password" required autoComplete="current-password" className={fieldClass} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-navy">New password</span>
        <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={fieldClass} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-navy">Confirm new password</span>
        <input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className={fieldClass} />
      </label>
      <p className="text-xs text-muted">Use at least 8 characters.</p>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.saved ? <p className="text-sm text-emerald-700">Password updated. Use the new password the next time you sign in.</p> : null}
      <button disabled={pending} className="w-fit rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

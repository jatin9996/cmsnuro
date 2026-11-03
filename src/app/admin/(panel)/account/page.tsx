import { PasswordForm } from "@/components/admin/password-form";

export default function AccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Account</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted">Change the password used to sign in to this admin panel.</p>
      <PasswordForm />
    </div>
  );
}

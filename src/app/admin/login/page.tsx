import { LogoMark } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";
import { safeAdminPath } from "@/lib/utils";

export const metadata = { title: "Admin sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="grid flex-1 place-items-center bg-canvas px-4 py-16">
      <section className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_24px_60px_-36px_rgba(12,35,64,0.8)]">
        <LogoMark className="h-20 w-20" />
        <h1 className="mt-4 text-2xl font-semibold text-navy">Clinic admin</h1>
        <p className="mt-1 text-sm text-muted">Sign in to edit the website, videos, and appointment diary.</p>
        <div className="mt-6">
          <LoginForm nextPath={safeAdminPath(next)} />
        </div>
        {process.env.NODE_ENV !== "production" ? (
          <p className="mt-5 rounded-2xl bg-cream px-3 py-2 text-xs leading-5 text-navy">
            Sample login: admin@kairavshah.local / Admin@12345. Change this password before the site is shared.
          </p>
        ) : null}
      </section>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-navy">That page is not on the site</h1>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white">Back home</Link>
      </div>
    </main>
  );
}

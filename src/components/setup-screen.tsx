export function SetupScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4">
      <section className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-[0_24px_60px_-36px_rgba(12,35,64,0.8)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Clinic CMS</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy">The database is not ready yet</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Create the local database and sample content, then refresh this page.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-navy px-4 py-3 text-sm text-white">npm run setup</pre>
      </section>
    </main>
  );
}

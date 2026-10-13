"use client";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-navy">This page could not be loaded</h1>
      <button type="button" onClick={reset} className="mt-5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white">Try again</button>
    </div>
  );
}

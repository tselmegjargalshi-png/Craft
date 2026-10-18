"use client";
import Link from "next/link";

// Error boundaries are client components and cannot read the language cookie on the server,
// so the copy is bilingual instead of guessing a language.
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap py-28 text-center" role="alert">
      <p className="eyebrow">Oops</p>
      <h1 className="h-section mt-3">Bir şeyler ters gitti · Something went wrong</h1>
      <p className="lead mx-auto mt-4 max-w-md">Sayfa yüklenemedi. Lütfen tekrar deneyin. · We couldn&apos;t load this page. Please try again.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-dark">Tekrar dene · Try again</button>
        <Link href="/" className="btn btn-ghost">Ana sayfa · Home</Link>
      </div>
    </div>
  );
}

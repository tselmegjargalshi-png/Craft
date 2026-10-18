export default function Loading() {
  return (
    <div className="wrap py-24" role="status" aria-live="polite">
      <div className="h-4 w-32 animate-pulse rounded-full bg-line" />
      <div className="mt-5 h-14 w-full max-w-xl animate-pulse rounded-2xl bg-line" />
      <div className="mt-4 h-14 w-3/4 max-w-lg animate-pulse rounded-2xl bg-line" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-card bg-line/70" />
        ))}
      </div>
      <span className="sr-only">Yükleniyor… / Loading…</span>
    </div>
  );
}

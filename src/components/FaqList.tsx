import { EmptyState } from "./EmptyState";

export type FaqItem = { id: string; q: string; a: string };

/** Zero-JS accordion built on <details>: keyboard accessible by default. */
export function FaqList({ items, emptyTitle, emptyDesc }: { items: FaqItem[]; emptyTitle: string; emptyDesc: string }) {
  if (items.length === 0) return <EmptyState title={emptyTitle} desc={emptyDesc} />;
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-card shadow-soft">
      {items.map((f) => (
        <details key={f.id} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold marker:hidden sm:px-7 sm:text-lg [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-2 transition group-open:rotate-45 group-open:bg-accent group-open:text-white" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="px-5 pb-6 pr-14 leading-relaxed text-ink-2 sm:px-7">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

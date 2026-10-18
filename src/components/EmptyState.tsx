export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-ink/20 bg-card/60 px-6 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8l9-5 9 5v8l-9 5-9-5V8Z" />
          <path d="M3 8l9 5 9-5M12 13v8" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-mute">{desc}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

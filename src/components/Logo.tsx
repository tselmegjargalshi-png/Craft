export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="12" className="fill-ink" />
      <path d="M26.5 14.2A8.5 8.5 0 1 0 26.5 25.8" fill="none" stroke="#fffdfa" strokeWidth="4.2" strokeLinecap="round" />
      <circle cx="28.4" cy="20" r="2.6" className="fill-accent" />
    </svg>
  );
}

export function Logo({ name, logo, light = false }: { name: string; logo?: string; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="size-9 rounded-xl object-contain" width={36} height={36} />
      ) : (
        <LogoMark />
      )}
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-paper" : "text-ink"}`}>{name}</span>
    </span>
  );
}

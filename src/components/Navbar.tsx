"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";

type NavLink = { href: string; label: string };

export function Navbar({
  links,
  cta,
  locale,
  langLabel,
  menuOpen,
  menuClose,
  homeLabel,
  homeHref,
  siteName,
  logo,
}: {
  links: NavLink[];
  cta: { href: string; label: string };
  locale: "tr" | "en";
  langLabel: string;
  menuOpen: string;
  menuClose: string;
  homeLabel: string;
  homeHref: string;
  siteName: string;
  logo?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/90 backdrop-blur-md" : "border-b border-transparent bg-paper/0"
      }`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Link href={homeHref} aria-label={`${siteName} — ${homeLabel}`} className="rounded-xl">
          <Logo name={siteName} logo={logo} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.href === pathname;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.92rem] font-bold transition hover:bg-ink/5 ${active ? "text-accent" : "text-ink-2 hover:text-ink"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitcher locale={locale} label={langLabel} />
          <Link href={cta.href} className="btn btn-primary btn-sm hidden sm:inline-flex">
            {cta.label}
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-ink/15 bg-card/70 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? menuClose : menuOpen}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="wrap border-t border-line pb-6 pt-3 lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-14 items-center justify-between border-b border-line text-lg font-bold">
                  {l.label}
                  <span aria-hidden="true" className="text-mute">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={cta.href} className="btn btn-primary mt-5 w-full">
            {cta.label}
          </Link>
        </nav>
      )}
    </header>
  );
}

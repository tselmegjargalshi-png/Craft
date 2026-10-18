"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; exact?: boolean; badge?: number };

export function AdminNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 lg:overflow-visible lg:px-3 lg:pb-0">
      <ul className="flex gap-1 lg:flex-col">
        {items.map((it) => {
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="shrink-0">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-4 text-sm font-bold transition ${
                  active ? "bg-paper text-ink" : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                {it.label}
                {!!it.badge && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-extrabold text-white">{it.badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

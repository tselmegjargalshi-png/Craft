"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Mobile-only bottom bar: one primary action, one fast channel. Hidden on the contact page. */
export function StickyCta({ contactHref, quote, whatsappHref, whatsappLabel }: { contactHref: string; quote: string; whatsappHref?: string; whatsappLabel: string }) {
  const pathname = usePathname();
  if (pathname === contactHref) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <div className="flex gap-2.5">
        <Link href={contactHref} className="btn btn-primary flex-1">
          {quote}
        </Link>
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" aria-label={whatsappLabel}>
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
              <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.35-2 1.4-.52.06-1.17.08-1.9-.12-.44-.14-1-.33-1.72-.65-3.03-1.3-5-4.35-5.15-4.55-.15-.2-1.23-1.63-1.23-3.1s.78-2.2 1.05-2.5c.28-.3.6-.37.8-.37h.58c.18 0 .43-.07.67.52.25.6.85 2.08.92 2.23.08.15.12.33.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.26 1.65 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.64-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.08.12.08.72-.17 1.42Z" />
            </svg>
            <span className="sr-only sm:not-sr-only">{whatsappLabel}</span>
          </a>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

/** Scroll-reveal with IntersectionObserver + CSS transition (no animation library needed). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = as;
  return (
    <Comp
      ref={ref as never}
      data-reveal={shown ? "in" : "out"}
      style={{ transitionDelay: shown ? `${delay}s` : undefined }}
      className={`reveal ${className}`}
    >
      {children}
    </Comp>
  );
}

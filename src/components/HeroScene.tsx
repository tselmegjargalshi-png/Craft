"use client";
import { useRef } from "react";
import * as m from "motion/react-m";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import { ServiceObject } from "./ServiceObject";

type Item = { kind: string; label: string };

// Positions (percent of the square stage), float timing and scroll drift per object.
const SLOTS = [
  { x: 2, y: 8, w: 34, rot: -6, drift: -50, spin: -5, anim: "animate-float" },
  { x: 64, y: 2, w: 28, rot: 7, drift: -80, spin: 6, anim: "animate-float-slow" },
  { x: 70, y: 40, w: 30, rot: -4, drift: 60, spin: -8, anim: "animate-float" },
  { x: 58, y: 72, w: 36, rot: 5, drift: 90, spin: 5, anim: "animate-float-slow" },
  { x: 0, y: 62, w: 32, rot: -7, drift: 70, spin: -4, anim: "animate-float" },
] as const;

function Floating({ item, slot, progress, i }: { item: Item; slot: (typeof SLOTS)[number]; progress: MotionValue<number>; i: number }) {
  const y = useTransform(progress, [0, 1], [0, slot.drift]);
  const rotate = useTransform(progress, [0, 1], [slot.rot, slot.rot + slot.spin]);
  return (
    <m.div
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, y, rotate }}
      className="absolute"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`${slot.anim} rounded-[1.4rem] border border-white/70 bg-white/55 p-2 shadow-lift backdrop-blur-md`} style={{ animationDelay: `${i * -1.4}s` }}>
        <ServiceObject kind={item.kind} />
        <p className="px-1 pb-1 pt-0.5 text-center text-[0.62rem] font-extrabold uppercase tracking-wider text-ink-2 sm:text-[0.68rem]">{item.label}</p>
      </div>
    </m.div>
  );
}

export function HeroScene({ items, centerLabel, packagesLabel }: { items: Item[]; centerLabel: string; packagesLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-accent-soft via-paper-2 to-transparent blur-2xl" />
      <div className="absolute inset-[16%] rounded-full border border-dashed border-ink/10" />

      {/* central "digital card": the product in one glance */}
      <m.div style={{ y: cardY }} className="absolute left-1/2 top-1/2 w-[44%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-[1.6rem] border border-white/80 bg-white/70 p-3.5 shadow-lift backdrop-blur-xl sm:p-4">
          <div className="flex items-center justify-between">
            <span className="flex gap-1">
              <i className="size-1.5 rounded-full bg-accent" />
              <i className="size-1.5 rounded-full bg-ink/15" />
              <i className="size-1.5 rounded-full bg-ink/15" />
            </span>
            <span className="text-[0.55rem] font-extrabold uppercase tracking-wider text-mute">{packagesLabel}</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i === 2 ? "bg-ink" : "bg-ink/[0.045]"}`}>
                <span className={`size-2.5 shrink-0 rounded-full ${i === 2 ? "bg-accent" : "bg-ink/20"}`} />
                <span className={`h-1.5 rounded-full ${i === 2 ? "w-[60%] bg-paper/80" : "w-[45%] bg-ink/15"}`} />
                <span className={`ml-auto h-1.5 w-[18%] rounded-full ${i === 2 ? "bg-accent" : "bg-ink/15"}`} />
              </div>
            ))}
          </div>
          <div className="relative mt-3">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/40" />
            <div className="relative rounded-full bg-accent py-1.5 text-center text-[0.65rem] font-extrabold text-white">{centerLabel}</div>
          </div>
        </div>
      </m.div>

      {items.slice(0, 5).map((item, i) => (
        <Floating key={item.kind} item={item} slot={SLOTS[i]} progress={scrollYProgress} i={i} />
      ))}
    </div>
  );
}

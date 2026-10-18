"use client";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

/** Loads only the DOM animation features (~5kb) and respects the user's reduced-motion setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

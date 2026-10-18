import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import type { T } from "@/lib/i18n";

export function HowItWorks({ t, id = "nasil-calisir", compact = false }: { t: T; id?: string; compact?: boolean }) {
  const steps = [1, 2, 3, 4] as const;
  return (
    <section id={id} className={`bg-ink text-paper ${compact ? "rounded-card px-6 py-12 sm:px-10" : "py-20 sm:py-28"}`} aria-labelledby={`${id}-title`}>
      <div className={compact ? "" : "wrap"}>
        <div id={`${id}-title`}>
          <SectionHeading eyebrow={t("home.how.eyebrow")} title={t("home.how.title")} sub={t("home.how.sub")} light />
        </div>
        <ol className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((n, i) => (
            <Reveal as="li" key={n} delay={i * 0.1} className="relative rounded-card border border-paper/10 bg-paper/[0.04] p-6">
              <span className="text-5xl font-extrabold tracking-tight text-accent" aria-hidden="true">{String(n).padStart(2, "0")}</span>
              <h3 className="mt-6 text-xl font-extrabold">{t(`home.how.${n}.t`)}</h3>
              <p className="mt-2 leading-relaxed text-paper/65">{t(`home.how.${n}.d`)}</p>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden h-px w-6 bg-accent/60 lg:block" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

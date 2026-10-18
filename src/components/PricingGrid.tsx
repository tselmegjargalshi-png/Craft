import { PackageCard } from "./PackageCard";
import { EmptyState } from "./EmptyState";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { T } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { lp } from "@/lib/locale-path";
import type { PackageWithFeatures } from "@/lib/data";

/** 5 cards in a row on wide screens, 2 columns on tablets, stacked on phones. */
export function PricingGrid({
  packages,
  t,
  locale,
  serviceSlug,
  serviceTitle,
}: {
  packages: PackageWithFeatures[];
  t: T;
  locale: Locale;
  serviceSlug: string;
  serviceTitle: string;
}) {
  if (packages.length === 0) {
    return (
      <EmptyState
        title={t("pricing.empty.t")}
        desc={t("pricing.empty.d")}
        action={
          <Link href={lp(locale, `/iletisim?hizmet=${serviceSlug}`)} className="btn btn-primary">
            {t("cta.quote")}
          </Link>
        }
      />
    );
  }
  return (
    <ul className="grid gap-5 pt-4 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(215px,1fr))] xl:gap-4 md:max-xl:[&>li:last-child:nth-child(odd)]:col-span-2">
      {packages.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 0.05} className="h-full">
          <PackageCard pkg={p} t={t} locale={locale} serviceSlug={serviceSlug} serviceTitle={serviceTitle} />
        </Reveal>
      ))}
    </ul>
  );
}

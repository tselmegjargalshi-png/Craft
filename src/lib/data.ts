import { cache } from "react";
import { prisma } from "./db";
import { CONTENT_KEYS, SETTING_KEYS_PLAIN } from "./i18n";
import { pick, type Locale } from "./locale";

const pkgInclude = { features: { orderBy: { order: "asc" as const } } };

export type ServiceWithPackages = Awaited<ReturnType<typeof getServices>>[number];
export type PackageWithFeatures = ServiceWithPackages["packages"][number];

/** Enabled services in display order, each with its visible packages and features. */
export const getServices = cache(async () =>
  prisma.service.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
    include: {
      packages: { where: { visible: true }, orderBy: { order: "asc" }, include: pkgInclude },
    },
  }),
);

export const getService = cache(async (slug: string) =>
  prisma.service.findFirst({
    where: { slug, enabled: true },
    include: {
      packages: { where: { visible: true }, orderBy: { order: "asc" }, include: pkgInclude },
      faqs: { where: { visible: true }, orderBy: { order: "asc" } },
    },
  }),
);

export const getGeneralFaqs = cache(async () =>
  prisma.faq.findMany({ where: { serviceId: null, visible: true }, orderBy: { order: "asc" } }),
);

export type SiteSettings = Record<string, { tr: string; en: string }>;

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.setting.findMany();
  const out: SiteSettings = {};
  for (const r of rows) out[r.key] = { tr: r.valueTr, en: r.valueEn };
  for (const k of [...CONTENT_KEYS, ...SETTING_KEYS_PLAIN]) out[k] ??= { tr: "", en: "" };
  return out;
});

/** Localised setting value; falls back to Turkish when the English text is empty. */
export function setting(s: SiteSettings, key: string, locale: Locale): string {
  const v = s[key];
  if (!v) return "";
  return pick({ valueTr: v.tr, valueEn: v.en }, "value", locale);
}

export type Contact = { whatsapp: string; instagram: string; email: string; phone: string; tiktok: string; linkedin: string; siteName: string; logo: string };

export function contactInfo(s: SiteSettings): Contact {
  const v = (k: string) => (s[k]?.tr ?? "").trim();
  return {
    whatsapp: v("whatsapp"),
    instagram: v("instagram"),
    email: v("email"),
    phone: v("phone"),
    tiktok: v("tiktok"),
    linkedin: v("linkedin"),
    siteName: v("site_name") || "Craft",
    logo: v("logo_url"),
  };
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

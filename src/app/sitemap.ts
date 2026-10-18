import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/data";
import { lp } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

const abs = (l: "tr" | "en", p: string) => (`${SITE_URL}${lp(l, p)}`.replace(/\/$/, "") || SITE_URL);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await prisma.service.findMany({ where: { enabled: true }, select: { slug: true } });
  const entry = (p: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: abs("tr", p),
    changeFrequency,
    priority,
    alternates: { languages: { tr: abs("tr", p), en: abs("en", p) } },
  });
  return [
    entry("/", 1, "weekly"),
    entry("/fiyatlar", 0.9, "weekly"),
    ...services.map((s) => entry(`/${s.slug}`, 0.8, "weekly")),
    entry("/iletisim", 0.7, "monthly"),
  ];
}

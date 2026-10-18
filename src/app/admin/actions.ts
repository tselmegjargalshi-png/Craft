"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { BILLING_TYPES, clean, LEAD_STATUSES } from "@/lib/validators";
import { CONTENT_KEYS, SETTING_KEYS_PLAIN } from "@/lib/i18n";

const str = (f: FormData, k: string) => String(f.get(k) ?? "");
const text = (f: FormData, k: string) => clean(str(f, k));
const multiline = (f: FormData, k: string) =>
  str(f, k)
    .split("\n")
    .map((l) => clean(l))
    .filter(Boolean)
    .join("\n");
const bool = (f: FormData, k: string) => f.get(k) === "on";

function done(path: string, ok = "saved"): never {
  revalidatePath("/", "layout");
  redirect(`${path}${path.includes("?") ? "&" : "?"}ok=${ok}`);
}
function fail(path: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}err=1`);
}

/* ---------- auth ---------- */

let dummyHash: string | undefined;

export async function loginAction(_prev: { error?: "invalid" | "rate" } | undefined, f: FormData) {
  const ip = clientIp(await headers());
  const rl = rateLimit(`login:${ip}`, 6, 15 * 60 * 1000);
  if (!rl.ok) return { error: "rate" as const };

  const email = text(f, "email").toLowerCase();
  const password = str(f, "password");
  const user = await prisma.user.findUnique({ where: { email } });
  // Always run a hash comparison so response time doesn't reveal whether the email exists.
  const hash = user?.passwordHash ?? (dummyHash ??= await bcrypt.hash("craft-dummy", 12));
  const ok = await bcrypt.compare(password, hash);
  if (!user || !ok) return { error: "invalid" as const };

  await createSession(user.id, user.email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- reorder helper ---------- */

function moved(ids: string[], id: string, dir: "up" | "down"): string[] {
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return ids;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/* ---------- services ---------- */

const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60),
  icon: z.enum(["web", "menu", "nfc", "webapp", "app"]),
  titleTr: z.string().min(2).max(80),
  titleEn: z.string().min(2).max(80),
  taglineTr: z.string().max(140),
  taglineEn: z.string().max(140),
  descTr: z.string().min(2).max(400),
  descEn: z.string().min(2).max(400),
  whatTr: z.string().max(2000),
  whatEn: z.string().max(2000),
  whoTr: z.string().max(1500),
  whoEn: z.string().max(1500),
  buildTr: z.string().max(2500),
  buildEn: z.string().max(2500),
  metaDescTr: z.string().max(200),
  metaDescEn: z.string().max(200),
});

export async function saveService(f: FormData) {
  await requireAdmin();
  const id = str(f, "id");
  const back = id ? `/admin/services/${id}` : "/admin/services/new";
  const parsed = serviceSchema.safeParse({
    slug: text(f, "slug").toLowerCase(),
    icon: str(f, "icon"),
    titleTr: text(f, "titleTr"), titleEn: text(f, "titleEn"),
    taglineTr: text(f, "taglineTr"), taglineEn: text(f, "taglineEn"),
    descTr: text(f, "descTr"), descEn: text(f, "descEn"),
    whatTr: text(f, "whatTr"), whatEn: text(f, "whatEn"),
    whoTr: multiline(f, "whoTr"), whoEn: multiline(f, "whoEn"),
    buildTr: multiline(f, "buildTr"), buildEn: multiline(f, "buildEn"),
    metaDescTr: text(f, "metaDescTr"), metaDescEn: text(f, "metaDescEn"),
  });
  if (!parsed.success) fail(back);
  const data = { ...parsed.data, enabled: bool(f, "enabled") };

  const clash = await prisma.service.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== id) fail(back);
  // Static routes already own these paths.
  if (["admin", "api", "fiyatlar", "iletisim", "sitemap.xml", "robots.txt"].includes(data.slug)) fail(back);

  if (id) {
    await prisma.service.update({ where: { id }, data });
    done(`/admin/services/${id}`);
  }
  const order = await prisma.service.count();
  await prisma.service.create({ data: { ...data, order } });
  done("/admin/services");
}

export async function deleteService(f: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: str(f, "id") } }).catch(() => {});
  done("/admin/services", "deleted");
}

export async function toggleService(f: FormData) {
  await requireAdmin();
  const s = await prisma.service.findUnique({ where: { id: str(f, "id") } });
  if (s) await prisma.service.update({ where: { id: s.id }, data: { enabled: !s.enabled } });
  done("/admin/services");
}

export async function moveService(f: FormData) {
  await requireAdmin();
  const ids = (await prisma.service.findMany({ orderBy: { order: "asc" }, select: { id: true } })).map((s) => s.id);
  const next = moved(ids, str(f, "id"), str(f, "dir") === "up" ? "up" : "down");
  await prisma.$transaction(next.map((id, order) => prisma.service.update({ where: { id }, data: { order } })));
  done("/admin/services");
}

/* ---------- packages ---------- */

const packageSchema = z.object({
  serviceId: z.string().min(1),
  nameTr: z.string().min(1).max(60),
  nameEn: z.string().min(1).max(60),
  price: z.number().int().min(0).max(100_000_000).nullable(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  billing: z.enum(BILLING_TYPES),
  noteTr: z.string().max(40),
  noteEn: z.string().max(40),
  descTr: z.string().min(1).max(200),
  descEn: z.string().min(1).max(200),
  ctaTr: z.string().min(1).max(40),
  ctaEn: z.string().min(1).max(40),
});

export async function savePackage(f: FormData) {
  await requireAdmin();
  const id = str(f, "id");
  const serviceId = str(f, "serviceId");
  const back = id ? `/admin/packages/${id}` : `/admin/packages/new?service=${serviceId}`;
  const priceRaw = str(f, "price").replace(/[^\d]/g, "");
  const billing = str(f, "billing");
  const parsed = packageSchema.safeParse({
    serviceId,
    nameTr: text(f, "nameTr"), nameEn: text(f, "nameEn"),
    price: priceRaw && billing !== "QUOTE" ? Number(priceRaw) : null,
    currency: text(f, "currency").toUpperCase() || "TRY",
    billing,
    noteTr: text(f, "noteTr"), noteEn: text(f, "noteEn"),
    descTr: text(f, "descTr"), descEn: text(f, "descEn"),
    ctaTr: text(f, "ctaTr") || "Teklif Al", ctaEn: text(f, "ctaEn") || "Get a Quote",
  });
  if (!parsed.success) fail(back);
  const data = { ...parsed.data, startingPrice: bool(f, "startingPrice"), highlight: bool(f, "highlight"), visible: bool(f, "visible") };

  const tr = multiline(f, "featuresTr").split("\n").filter(Boolean);
  const en = multiline(f, "featuresEn").split("\n").filter(Boolean);
  const features = tr.map((textTr, i) => ({ order: i, textTr, textEn: en[i] || textTr }));

  // Only one highlighted package per service.
  const saved = await prisma.$transaction(async (tx) => {
    if (data.highlight) await tx.package.updateMany({ where: { serviceId, NOT: { id: id || "-" } }, data: { highlight: false } });
    if (id) {
      await tx.packageFeature.deleteMany({ where: { packageId: id } });
      return tx.package.update({ where: { id }, data: { ...data, features: { create: features } } });
    }
    const order = await tx.package.count({ where: { serviceId } });
    return tx.package.create({ data: { ...data, order, features: { create: features } } });
  });
  done(`/admin/packages?service=${saved.serviceId}`);
}

export async function deletePackage(f: FormData) {
  await requireAdmin();
  const p = await prisma.package.findUnique({ where: { id: str(f, "id") } });
  if (p) await prisma.package.delete({ where: { id: p.id } });
  done(`/admin/packages?service=${p?.serviceId ?? ""}`, "deleted");
}

export async function togglePackage(f: FormData) {
  await requireAdmin();
  const p = await prisma.package.findUnique({ where: { id: str(f, "id") } });
  if (p) await prisma.package.update({ where: { id: p.id }, data: { visible: !p.visible } });
  done(`/admin/packages?service=${p?.serviceId ?? ""}`);
}

export async function movePackage(f: FormData) {
  await requireAdmin();
  const p = await prisma.package.findUnique({ where: { id: str(f, "id") } });
  if (!p) return done("/admin/packages");
  const ids = (await prisma.package.findMany({ where: { serviceId: p.serviceId }, orderBy: { order: "asc" }, select: { id: true } })).map((x) => x.id);
  const next = moved(ids, p.id, str(f, "dir") === "up" ? "up" : "down");
  await prisma.$transaction(next.map((id, order) => prisma.package.update({ where: { id }, data: { order } })));
  done(`/admin/packages?service=${p.serviceId}`);
}

/* ---------- leads ---------- */

export async function setLeadStatus(f: FormData) {
  await requireAdmin();
  const status = str(f, "status");
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) fail("/admin/leads");
  await prisma.lead.update({ where: { id: str(f, "id") }, data: { status } });
  done(`/admin/leads${str(f, "filter") ? `?status=${str(f, "filter")}` : ""}`);
}

/* ---------- FAQ ---------- */

const faqSchema = z.object({
  qTr: z.string().min(2).max(200), qEn: z.string().min(2).max(200),
  aTr: z.string().min(2).max(1500), aEn: z.string().min(2).max(1500),
});

export async function saveFaq(f: FormData) {
  await requireAdmin();
  const id = str(f, "id");
  const parsed = faqSchema.safeParse({ qTr: text(f, "qTr"), qEn: text(f, "qEn"), aTr: text(f, "aTr"), aEn: text(f, "aEn") });
  if (!parsed.success) fail("/admin/faq");
  const serviceId = str(f, "serviceId") || null;
  const data = { ...parsed.data, serviceId, visible: bool(f, "visible") };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data: { ...data, order: (await prisma.faq.count()) } });
  done("/admin/faq");
}

export async function deleteFaq(f: FormData) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id: str(f, "id") } }).catch(() => {});
  done("/admin/faq", "deleted");
}

export async function moveFaq(f: FormData) {
  await requireAdmin();
  const faq = await prisma.faq.findUnique({ where: { id: str(f, "id") } });
  if (!faq) return done("/admin/faq");
  const ids = (await prisma.faq.findMany({ where: { serviceId: faq.serviceId }, orderBy: { order: "asc" }, select: { id: true } })).map((x) => x.id);
  const next = moved(ids, faq.id, str(f, "dir") === "up" ? "up" : "down");
  await prisma.$transaction(next.map((id, order) => prisma.faq.update({ where: { id }, data: { order } })));
  done("/admin/faq");
}

/* ---------- content & settings ---------- */

export async function saveContent(f: FormData) {
  await requireAdmin();
  await prisma.$transaction(
    CONTENT_KEYS.map((key) => {
      const valueTr = text(f, `tr:${key}`).slice(0, 1200);
      const valueEn = text(f, `en:${key}`).slice(0, 1200);
      return prisma.setting.upsert({ where: { key }, update: { valueTr, valueEn }, create: { key, valueTr, valueEn } });
    }),
  );
  done("/admin/content");
}

export async function saveSettings(f: FormData) {
  await requireAdmin();
  await prisma.$transaction(
    SETTING_KEYS_PLAIN.map((key) => {
      let v = text(f, `v:${key}`).slice(0, 300);
      if (key === "whatsapp") v = v.replace(/[^\d+]/g, "");
      if (key === "logo_url" && v && !/^(https:\/\/|\/)/.test(v)) v = "";
      return prisma.setting.upsert({ where: { key }, update: { valueTr: v, valueEn: v }, create: { key, valueTr: v, valueEn: v } });
    }),
  );
  done("/admin/settings");
}

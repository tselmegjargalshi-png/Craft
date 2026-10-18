import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const clean = (e: unknown) => {
  const err = e as { name?: string; code?: string; message?: string };
  return {
    error: err.name ?? "Error",
    code: err.code ?? null,
    hint: String(err.message ?? "").split("\n").slice(-3).join(" ").replace(/postgres(ql)?:\/\/\S+/g, "[url]").slice(0, 400),
  };
};

/** Liveness + database check, one entry per query the public pages run. Never returns connection details. */
export async function GET() {
  const checks: Record<string, unknown> = {};
  const run = async (name: string, fn: () => Promise<unknown>) => {
    try {
      checks[name] = { ok: true, value: await fn() };
    } catch (e) {
      checks[name] = { ok: false, ...clean(e) };
    }
  };
  await run("services", () => prisma.service.count());
  await run("servicesWithPackages", async () =>
    (await prisma.service.findMany({ include: { packages: { include: { features: true } } } })).length,
  );
  await run("faqs", () => prisma.faq.count());
  await run("settings", () => prisma.setting.count());
  await run("viewUpdate", async () => {
    const s = await prisma.service.findFirst();
    if (s) await prisma.service.update({ where: { id: s.id }, data: { views: { increment: 1 } } });
    return !!s;
  });
  const ok = Object.values(checks).every((c) => (c as { ok: boolean }).ok);
  return NextResponse.json({ ok, node: process.version, checks }, { status: ok ? 200 : 500 });
}

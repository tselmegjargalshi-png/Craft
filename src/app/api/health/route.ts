import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Liveness + database check. Returns only the error class, never connection details. */
export async function GET() {
  try {
    const services = await prisma.service.count();
    return NextResponse.json({ ok: true, services });
  } catch (e) {
    const err = e as { name?: string; code?: string; message?: string };
    return NextResponse.json(
      { ok: false, error: err.name ?? "Error", code: err.code ?? null, hint: String(err.message ?? "").split("\n").slice(-2).join(" ").replace(/postgres(ql)?:\/\/\S+/g, "[url]").slice(0, 300) },
      { status: 500 },
    );
  }
}

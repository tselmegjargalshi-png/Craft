import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  const raw = await req.text();
  if (raw.length > 10_000) return NextResponse.json({ ok: false, code: "too_large" }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, code: "bad_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, true> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = true;
    return NextResponse.json({ ok: false, code: "invalid", errors }, { status: 422 });
  }
  const d = parsed.data;

  // Honeypot filled: pretend success, store nothing.
  if (d.website) return NextResponse.json({ ok: true });

  const locale = (body as { locale?: string }).locale === "en" ? "en" : "tr";
  const service = d.service ? await prisma.service.findUnique({ where: { slug: d.service } }) : null;

  await prisma.lead.create({
    data: {
      name: d.name,
      email: d.email,
      whatsapp: d.whatsapp,
      serviceSlug: service?.slug ?? "",
      serviceTitle: service ? service.titleTr : "",
      packageName: d.packageName,
      budget: d.budget,
      message: d.message,
      locale,
    },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

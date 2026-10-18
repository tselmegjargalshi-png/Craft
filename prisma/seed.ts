import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generalFaqs, serviceFaqs, services, settings } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) in .env before seeding.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  // Catalog is only seeded into an empty database, so re-running never overwrites admin edits.
  if ((await prisma.service.count()) === 0) {
    for (const [si, s] of services.entries()) {
      const created = await prisma.service.create({
        data: {
          slug: s.slug,
          icon: s.icon,
          order: si,
          titleTr: s.title[0],
          titleEn: s.title[1],
          taglineTr: s.tagline[0],
          taglineEn: s.tagline[1],
          descTr: s.desc[0],
          descEn: s.desc[1],
          whatTr: s.what[0],
          whatEn: s.what[1],
          whoTr: s.who.tr.join("\n"),
          whoEn: s.who.en.join("\n"),
          buildTr: s.build.tr.join("\n"),
          buildEn: s.build.en.join("\n"),
          metaDescTr: s.metaDesc[0],
          metaDescEn: s.metaDesc[1],
        },
      });
      for (const [pi, p] of s.packages.entries()) {
        await prisma.package.create({
          data: {
            serviceId: created.id,
            order: pi,
            highlight: !!p.highlight,
            nameTr: p.name[0],
            nameEn: p.name[1],
            price: p.price,
            billing: p.price === null ? "QUOTE" : "ONE_TIME",
            startingPrice: p.price !== null,
            noteTr: p.note?.[0] ?? "",
            noteEn: p.note?.[1] ?? "",
            descTr: p.desc[0],
            descEn: p.desc[1],
            ctaTr: "Teklif Al",
            ctaEn: "Get a Quote",
            features: {
              create: p.features.map((f, fi) => ({ order: fi, textTr: f[0], textEn: f[1] })),
            },
          },
        });
      }
      for (const [fi, f] of (serviceFaqs[s.slug] ?? []).entries()) {
        await prisma.faq.create({
          data: { serviceId: created.id, order: fi, qTr: f.q[0], qEn: f.q[1], aTr: f.a[0], aEn: f.a[1] },
        });
      }
    }
    for (const [i, f] of generalFaqs.entries()) {
      await prisma.faq.create({ data: { order: i, qTr: f.q[0], qEn: f.q[1], aTr: f.a[0], aEn: f.a[1] } });
    }
  }

  for (const [key, [valueTr, valueEn]] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, valueTr, valueEn } });
  }
  console.log(`Seeded. Admin: ${email}. Services: ${await prisma.service.count()}, packages: ${await prisma.package.count()}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

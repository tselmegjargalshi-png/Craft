import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";

const BASE = "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const prisma = new PrismaClient();
const results = [];
const consoleErrors = [];
let failed = 0;

async function step(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`); }
  catch (e) { failed++; results.push(`FAIL  ${name}\n      ${String(e.message).split("\n")[0]}`); }
}
const ok = (c, m) => { if (!c) throw new Error(m); };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && consoleErrors.push(`${page.url()} :: ${m.text()}`));
page.on("pageerror", (e) => consoleErrors.push(`${page.url()} :: pageerror ${e.message}`));
const go = (p) => page.goto(BASE + p, { waitUntil: "networkidle" });

// ---------- public site ----------
await step("Homepage renders Turkish by default with correct characters", async () => {
  await go("/");
  ok((await page.locator("html").getAttribute("lang")) === "tr", "html lang not tr");
  const h1 = await page.locator("h1").innerText();
  ok(/İşinize uygun dijital çözüm/.test(h1), "hero: " + h1);
  ok(await page.getByRole("link", { name: "Teklif Al" }).first().isVisible(), "Teklif Al CTA");
  ok(await page.getByRole("link", { name: "Fiyatları İncele" }).first().isVisible(), "Fiyatları İncele CTA");
});

await step("Homepage: 5 service cards, benefits, how-it-works 4 steps, FAQ accordion", async () => {
  ok((await page.locator("#hizmetler ul > li").count()) === 5, "service cards != 5");
  ok((await page.locator("#nasil-calisir ol > li").count()) === 4, "steps != 4");
  const first = page.locator("#sss details").first();
  await first.locator("summary").click();
  ok(await first.evaluate((d) => d.open), "faq did not open");
});

await step("Navigation links reach their targets", async () => {
  await go("/");
  await page.locator("header nav").getByRole("link", { name: "Fiyatlar" }).click();
  await page.waitForURL("**/fiyatlar");
  await page.locator("header nav").getByRole("link", { name: "İletişim" }).click();
  await page.waitForURL("**/iletisim");
  await page.locator("header nav").getByRole("link", { name: "Hizmetler" }).click();
  await page.waitForURL(BASE + "/#hizmetler");
});

const slugs = ["web-sitesi", "dijital-menu", "nfc-kart", "web-uygulama", "mobil-pc-uygulama"];
const expectedPrices = {
  "web-sitesi": ["₺9.900", "₺16.900", "₺24.900", "₺34.900"],
  "dijital-menu": ["₺4.900", "₺7.900", "₺11.900", "₺17.900"],
  "nfc-kart": ["₺1.490", "₺2.490", "₺3.490", "₺4.990"],
  "web-uygulama": ["₺29.900", "₺49.900", "₺79.900", "₺119.900"],
  "mobil-pc-uygulama": ["₺39.900", "₺64.900", "₺99.900", "₺149.900"],
};
for (const slug of slugs) {
  await step(`Service /${slug}: details, 5 package cards, Turkish price format, one highlighted, unique meta`, async () => {
    await go("/" + slug);
    ok((await page.locator("h1").count()) === 1, "h1 count");
    const cards = page.locator("#paketler article");
    ok((await cards.count()) === 5, "cards " + (await cards.count()));
    const body = await page.locator("#paketler").innerText();
    for (const p of expectedPrices[slug]) ok(body.includes(p), "missing price " + p);
    ok(body.includes("Teklif Al"), "custom quote");
    ok((await page.getByText("En Çok Tercih Edilen").count()) === 1, "highlight count");
    ok(body.includes("Başlangıç fiyatı"), "starting price label");
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    ok(title.length > 10 && desc && desc.length > 30, "meta");
    ok(await page.locator('meta[property="og:title"]').count(), "og:title");
    for (const sec of ["Nedir?", "Kimler için?", "Neler yapabiliriz?"]) ok((await page.getByRole("heading", { name: sec }).count()) > 0, "section " + sec);
  });
}

await step("NFC page clearly states 'Kart dahil'", async () => {
  await go("/nfc-kart");
  ok((await page.locator("#paketler").getByText("Kart dahil").count()) >= 2, "Kart dahil badges");
});

await step("Unknown service slug returns 404", async () => {
  const r = await page.goto(BASE + "/olmayan-hizmet");
  ok(r.status() === 404, "status " + r.status());
  ok(await page.getByText("Sayfa bulunamadı").isVisible(), "404 copy");
});

await step("Pricing page: tabs switch service, 5 cards each", async () => {
  await go("/fiyatlar");
  ok((await page.locator("main article").count()) === 5, "default cards");
  await page.locator("main nav").getByRole("link", { name: "Web Uygulama", exact: true }).click();
  await page.waitForFunction(() => location.search.includes("hizmet=web-uygulama") && document.querySelector("main")?.textContent?.includes("119.900"), null, { timeout: 8000 }).catch(async () => { throw new Error("tab nav stuck at " + page.url() + " :: " + (await page.locator("main h2").first().innerText())); });
  ok((await page.locator("main").innerText()).includes("₺119.900"), "web app price");
});

await step("Language switch TR -> EN uses /en URLs, links stay under /en, hreflang present", async () => {
  await go("/");
  ok((await page.locator("html").getAttribute("lang")) === "tr", "root is tr");
  await page.locator("header").getByRole("button", { name: "EN", exact: true }).click();
  await page.waitForURL(/\/en\/?$/);
  await page.waitForFunction(() => document.documentElement.lang === "en");
  await page.waitForFunction(() => /The right digital solution/.test(document.querySelector("h1")?.textContent ?? ""));
  await page.waitForFunction(() => /Pricing/.test(document.querySelector("header nav")?.textContent ?? ""));
  const hrefs = await page.$$eval("header nav a, main a", (as) => as.map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("/")));
  ok(hrefs.length > 0 && hrefs.every((h) => h === "/en" || h.startsWith("/en/") || h.startsWith("/en#") || h.startsWith("/en?")), "EN links leak non-/en: " + hrefs.filter((h) => !h.startsWith("/en")).join(","));
  const alts = await page.$$eval('link[rel="alternate"]', (ls) => ls.map((l) => l.getAttribute("hreflang") + "=" + l.getAttribute("href")));
  ok(alts.some((a) => a.startsWith("tr=")) && alts.some((a) => a.startsWith("en=")) && alts.some((a) => a.startsWith("x-default=")), "hreflang: " + alts.join(" "));
  await go("/en/web-sitesi");
  const t = (await page.locator("#paketler").innerText()).toLowerCase();
  ok(t.includes("up to 5 pages") && t.includes("most popular") && t.includes("starting price") && t.includes("one-time"), "package EN: " + t.slice(0, 300));
  ok(t.includes("₺9,900"), "EN price format");
  const canon = await page.locator('link[rel="canonical"]').getAttribute("href");
  ok(/\/en\/web-sitesi$/.test(canon), "canonical " + canon);
  await go("/en/iletisim");
  ok(await page.getByLabel("Full name").isVisible(), "form EN");
  await go("/en");
  ok(await page.getByText("Frequently asked").isVisible(), "faq heading EN");
  ok(!(await page.locator("body").innerText()).match(/Hizmetler|Teklif Al|Fiyatlar/), "no leaked Turkish UI strings on EN home");
});

await step("Language switch EN -> TR restores Turkish; TR root unaffected; /en/admin not rewritten", async () => {
  await go("/en/web-sitesi?x=1");
  await page.locator("header").getByRole("button", { name: "TR", exact: true }).click();
  await page.waitForURL((u) => u.pathname === "/web-sitesi");
  ok(!page.url().includes("/en"), "still en: " + page.url());
  await page.waitForFunction(() => document.documentElement.lang === "tr");
  await page.waitForFunction(() => /Fiyatlar/.test(document.querySelector("header nav")?.textContent ?? ""));
  const r = await page.request.get(BASE + "/en/admin/login", { maxRedirects: 0 });
  ok(r.status() === 404, "/en/admin status " + r.status());
  const sm = await (await page.request.get(BASE + "/sitemap.xml")).text();
  ok(sm.includes("/en/web-sitesi") && sm.includes('hreflang="en"'), "sitemap alternates");
});

// ---------- quote form ----------
await step("Contact form: client validation shows errors and does not submit", async () => {
  await go("/iletisim");
  await page.getByRole("button", { name: "Teklif Talebi Gönder" }).click();
  ok(await page.getByText("Lütfen adınızı girin.").isVisible(), "name error");
  ok(await page.getByText("Geçerli bir e-posta girin.").isVisible(), "email error");
  ok((await prisma.lead.count()) === 0, "lead saved despite errors");
});

await step("Contact form: submit succeeds without page reload, shows success message, persists lead", async () => {
  await go("/iletisim?hizmet=nfc-kart&paket=Pro");
  ok((await page.locator("#service").inputValue()) === "nfc-kart", "service prefilled");
  ok((await page.locator("#packageName").inputValue()) === "Pro", "package prefilled");
  await page.evaluate(() => (window.__noReload = true));
  await page.getByLabel("Ad Soyad").fill("Ayşe Yılmaz <b>x</b>");
  await page.getByLabel("E-posta").fill("ayse@example.com");
  await page.locator("#whatsapp").fill("0532 000 00 00");
  await page.locator("#budget").selectOption("5to15");
  await page.getByLabel("Kısa Açıklama").fill("Kafem için NFC kart ve menü istiyorum. Çok güzel olacak: ğüşiöç İ.");
  await page.getByRole("button", { name: "Teklif Talebi Gönder" }).click();
  await page.getByText("Talebiniz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.").waitFor();
  ok(await page.evaluate(() => window.__noReload === true), "page reloaded");
  const lead = await prisma.lead.findFirst({ orderBy: { createdAt: "desc" } });
  ok(lead && lead.email === "ayse@example.com" && lead.serviceSlug === "nfc-kart" && lead.status === "NEW" && lead.budget === "5to15", "lead row wrong");
  ok(!lead.name.includes("<"), "angle brackets not stripped: " + lead.name);
  ok(lead.message.includes("ğüşiöç İ"), "Turkish chars lost");
});

await step("Lead API: server-side validation rejects bad input; honeypot stores nothing", async () => {
  const before = await prisma.lead.count();
  let r = await ctx.request.post(BASE + "/api/leads", { data: { name: "A", email: "nope", whatsapp: "x" } });
  ok(r.status() === 422, "expected 422 got " + r.status());
  r = await ctx.request.post(BASE + "/api/leads", { data: { name: "Bot Bot", email: "bot@example.com", whatsapp: "05320000000", website: "http://spam" } });
  ok(r.status() === 200, "honeypot status " + r.status());
  ok((await prisma.lead.count()) === before, "honeypot stored a lead");
});

await step("Lead API: rate limit kicks in (429) after repeated submissions", async () => {
  let last = 0;
  for (let i = 0; i < 8; i++) {
    const r = await ctx.request.post(BASE + "/api/leads", { data: { name: "Rate Test", email: "rate@example.com", whatsapp: "05320000000" } });
    last = r.status();
    if (last === 429) break;
  }
  ok(last === 429, "never rate limited, last=" + last);
});

// ---------- admin ----------
await step("Admin is protected: unauthenticated /admin and /admin/leads redirect to login", async () => {
  const fresh = await browser.newContext();
  const p = await fresh.newPage();
  for (const path of ["/admin", "/admin/leads", "/admin/services/new"]) {
    await p.goto(BASE + path);
    ok(p.url().endsWith("/admin/login"), `${path} -> ${p.url()}`);
  }
  await fresh.close();
});

await step("Admin login: wrong password rejected, correct password accepted", async () => {
  const fresh = await browser.newContext();
  const p = await fresh.newPage();
  await p.goto(BASE + "/admin/login");
  await p.getByLabel("E-posta").fill(ADMIN_EMAIL);
  await p.getByLabel("Şifre").fill("wrong-password-123");
  await p.getByRole("button", { name: "Giriş yap" }).click();
  await p.getByText("E-posta veya şifre hatalı.").waitFor();
  await fresh.close();
  await page.goto(BASE + "/admin/login");
  await page.getByLabel("E-posta").fill(ADMIN_EMAIL);
  await page.getByLabel("Şifre").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Giriş yap" }).click();
  await page.waitForURL(BASE + "/admin");
  ok(await page.getByRole("heading", { name: "Panel" }).isVisible(), "dashboard heading");
});

await step("Admin dashboard shows lead count, new leads, active services, most requested", async () => {
  const text = await page.locator("main").innerText();
  ok(/Toplam talep/.test(text) && /Yeni talep/.test(text) && /Aktif hizmet/.test(text) && /En çok görüntülenen/.test(text) && /En çok talep edilen/.test(text), "cards");
  ok(/NFC Dijital Kart/.test(text), "most requested should be NFC");
});

await step("Admin leads: lead visible, status change persists, WhatsApp link built", async () => {
  await page.goto(BASE + "/admin/leads");
  ok(await page.getByText("Ayşe Yılmaz").isVisible(), "lead listed");
  const wa = await page.locator("li", { hasText: "Ayşe Yılmaz" }).getByRole("link", { name: "WhatsApp'tan Yaz" }).getAttribute("href");
  ok(wa.startsWith("https://wa.me/905320000000"), "wa link " + wa);
  await page.locator("li", { hasText: "Ayşe Yılmaz" }).locator("select[aria-label='Durum']").selectOption("CONTACTED");
  await page.waitForURL("**ok=saved");
  const lead = await prisma.lead.findFirst({ where: { name: { startsWith: "Ayşe" } } });
  ok(lead.status === "CONTACTED", "status not persisted");
  await page.getByRole("link", { name: "Tamamlandı", exact: true }).click();
  await page.waitForURL("**status=COMPLETED");
  ok(await page.getByText("Henüz talep yok").isVisible(), "empty state for filter");
});

await step("Admin service CRUD: create, appears on site, edit, disable hides it, reorder, delete", async () => {
  await page.goto(BASE + "/admin/services/new");
  await page.locator("input[name=slug]").fill("test-hizmeti");
  await page.locator("input[name=titleTr]").fill("Test Hizmeti");
  await page.locator("input[name=titleEn]").fill("Test Service");
  await page.locator("textarea[name=descTr]").fill("Test açıklaması");
  await page.locator("textarea[name=descEn]").fill("Test description");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**/admin/services?ok=saved");
  await go("/test-hizmeti");
  ok(await page.getByRole("heading", { name: "Test Hizmeti", level: 1 }).isVisible(), "public page");
  ok((await page.getByText("Henüz paket yok").count()) === 1, "no packages empty state");
  await page.goto(BASE + "/admin/services");
  const row = page.locator("li", { hasText: "Test Hizmeti" }).first();
  await row.getByRole("link", { name: "Düzenle" }).click();
  await page.locator("input[name=titleTr]").fill("Test Hizmeti 2");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**ok=saved");
  ok((await prisma.service.findUnique({ where: { slug: "test-hizmeti" } })).titleTr === "Test Hizmeti 2", "edit persisted");
  await page.goto(BASE + "/admin/services");
  await page.locator("li", { hasText: "Test Hizmeti 2" }).getByRole("button", { name: "Pasif" }).click();
  await page.waitForURL("**ok=saved");
  const r = await page.goto(BASE + "/test-hizmeti");
  ok(r.status() === 404, "disabled service still public: " + r.status());
  await page.goto(BASE + "/admin/services");
  await page.locator("li", { hasText: "Test Hizmeti 2" }).getByRole("button", { name: "Yukarı taşı" }).click();
  await page.waitForURL("**ok=saved");
  const order = (await prisma.service.findMany({ orderBy: { order: "asc" } })).map((s) => s.slug);
  ok(order[4] === "test-hizmeti" && order.length === 6 && order.indexOf("test-hizmeti") === 4, "reorder " + order.join());
  page.once("dialog", (d) => d.accept());
  await page.locator("li", { hasText: "Test Hizmeti 2" }).getByRole("button", { name: "Sil" }).click();
  await page.waitForURL("**ok=deleted");
  ok((await prisma.service.count()) === 5, "delete failed");
});

await step("Admin package CRUD: price edit shows on site; create, highlight, hide, delete", async () => {
  const svc = await prisma.service.findUnique({ where: { slug: "web-sitesi" } });
  const starter = await prisma.package.findFirst({ where: { serviceId: svc.id, nameTr: "Starter" } });
  await page.goto(BASE + `/admin/packages/${starter.id}`);
  await page.locator("input[name=price]").fill("10.500");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**/admin/packages?service=*ok=saved");
  await go("/web-sitesi");
  ok((await page.locator("#paketler").innerText()).includes("₺10.500"), "edited price not on site");
  // new package
  await page.goto(BASE + `/admin/packages/new?service=${svc.id}`);
  await page.locator("input[name=nameTr]").fill("Mini");
  await page.locator("input[name=nameEn]").fill("Mini");
  await page.locator("input[name=price]").fill("3000");
  await page.locator("textarea[name=descTr]").fill("Mini paket");
  await page.locator("textarea[name=descEn]").fill("Mini package");
  await page.locator("textarea[name=featuresTr]").fill("Özellik bir\nÖzellik iki");
  await page.locator("textarea[name=featuresEn]").fill("Feature one\nFeature two");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**ok=saved");
  await go("/web-sitesi");
  ok((await page.locator("#paketler article").count()) === 6, "new package not shown");
  const mini = await prisma.package.findFirst({ where: { nameTr: "Mini" }, include: { features: true } });
  ok(mini.features.length === 2, "features saved");
  // hide
  await page.goto(BASE + `/admin/packages?service=${svc.id}`);
  await page.locator("li", { hasText: "Mini" }).getByRole("button", { name: "Gizli" }).click();
  await page.waitForURL("**ok=saved");
  await go("/web-sitesi");
  ok((await page.locator("#paketler article").count()) === 5, "hidden package still visible");
  await page.goto(BASE + `/admin/packages?service=${svc.id}`);
  page.once("dialog", (d) => d.accept());
  await page.locator("li", { hasText: "Mini" }).getByRole("button", { name: "Sil" }).click();
  await page.waitForURL("**ok=deleted");
  ok((await prisma.packageFeature.count({ where: { packageId: mini.id } })) === 0, "features not cascaded");
  // restore price
  await page.goto(BASE + `/admin/packages/${starter.id}`);
  await page.locator("input[name=price]").fill("9900");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**ok=saved");
});

await step("Admin FAQ CRUD: add shows on homepage, edit, delete", async () => {
  await page.goto(BASE + "/admin/faq");
  const form = page.locator("section", { hasText: "Yeni soru ekle" });
  await form.locator("input[name=qTr]").fill("Test sorusu?");
  await form.locator("input[name=qEn]").fill("Test question?");
  await form.locator("textarea[name=aTr]").fill("Test cevabı.");
  await form.locator("textarea[name=aEn]").fill("Test answer.");
  await form.getByRole("button", { name: "Ekle" }).click();
  await page.waitForURL("**ok=saved");
  await go("/");
  ok(await page.getByText("Test sorusu?").isVisible(), "faq on homepage");
  await page.goto(BASE + "/admin/faq");
  await page.goto(BASE + "/admin/faq");
  const item = page.locator("li", { hasText: "Test sorusu?" }).first();
  await item.locator("summary").click();
  await item.locator("input[name=qTr]").fill("Test sorusu güncel?");
  await item.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForLoadState("networkidle");
  await page.goto(BASE + "/admin/faq");
  ok(await page.getByText("Test sorusu güncel?").first().isVisible(), "faq edit");
  const item2 = page.locator("li", { hasText: "Test sorusu güncel?" }).first();
  await item2.locator("summary").click();
  page.once("dialog", (d) => d.accept());
  await item2.getByRole("button", { name: "Sil" }).click();
  await page.waitForURL("**ok=deleted");
  ok(!(await page.getByText("Test sorusu güncel?").count()), "faq not deleted");
});

await step("Admin content + settings: hero text, WhatsApp number flow to the public site", async () => {
  await page.goto(BASE + "/admin/content");
  await page.locator("input[name='tr:hero_title']").fill("Test başlığı: şğüöçıİ");
  await page.locator("input[name='en:hero_title']").fill("Test headline");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**ok=saved");
  await page.goto(BASE + "/admin/settings");
  await page.locator("input[name='v:whatsapp']").fill("+90 532 000 00 00");
  await page.locator("input[name='v:instagram']").fill("@craft.test");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**ok=saved");
  await go("/");
  ok((await page.locator("h1").innerText()).includes("Test başlığı: şğüöçıİ"), "hero not updated");
  const hrefs = await page.locator("footer a").evaluateAll((as) => as.map((a) => a.href));
  ok(hrefs.some((h) => h.startsWith("https://wa.me/905320000000")), "wa in footer");
  ok(hrefs.some((h) => h === "https://instagram.com/craft.test"), "ig in footer");
  await go("/iletisim");
  ok(await page.getByText("@craft.test").isVisible(), "instagram on contact");
  // restore hero
  await page.goto(BASE + "/admin/content");
  await page.locator("input[name='tr:hero_title']").fill("İşinize uygun dijital çözüm, net fiyatla.");
  await page.locator("input[name='en:hero_title']").fill("The right digital solution for your business, at a clear price.");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await page.waitForURL("**ok=saved");
});

await step("Admin UI switches to English", async () => {
  await page.goto(BASE + "/admin");
  await page.locator("aside button:visible", { hasText: "EN" }).first().click();
  await page.waitForFunction(() => /Dashboard/.test(document.querySelector("main h1")?.textContent ?? ""));
  ok((await page.locator("aside").innerText()).includes("Leads"), "sidebar EN");
  await page.locator("aside button:visible", { hasText: "TR" }).first().click();
  await page.waitForFunction(() => /Panel/.test(document.querySelector("main h1")?.textContent ?? ""));
});

await step("Admin logout ends the session", async () => {
  await page.locator("aside button:visible", { hasText: "Çıkış yap" }).first().click();
  await page.waitForURL("**/admin/login");
  await page.goto(BASE + "/admin");
  ok(page.url().endsWith("/admin/login"), "still logged in");
});

// ---------- mobile ----------
for (const w of [360, 390, 430, 768, 1024]) {
  await step(`Responsive ${w}px: no horizontal overflow on home, pricing, service, contact`, async () => {
    const c = await browser.newContext({ viewport: { width: w, height: 800 } });
    const p = await c.newPage();
    p.on("console", (m) => m.type() === "error" && consoleErrors.push(`[${w}] ${p.url()} :: ${m.text()}`));
    for (const path of ["/", "/fiyatlar", "/web-sitesi", "/mobil-pc-uygulama", "/iletisim"]) {
      await p.goto(BASE + path, { waitUntil: "networkidle" });
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(o <= 0, `${path} overflows by ${o}px`);
    }
    await c.close();
  });
}

await step("Mobile: hamburger menu opens, sticky Teklif Al bar visible, hidden on contact", async () => {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Menüyü aç" }).click();
  ok(await p.locator("#mobile-nav").isVisible(), "menu");
  await p.locator("#mobile-nav").getByRole("link", { name: "İletişim" }).click();
  await p.waitForURL("**/iletisim");
  ok((await p.locator("div.fixed.bottom-0").count()) === 0, "sticky shown on contact");
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  ok(await p.locator("div.fixed.bottom-0").getByRole("link", { name: "Teklif Al" }).isVisible(), "sticky CTA");
  await c.close();
});

await step("SEO: sitemap lists services, robots blocks admin, JSON-LD on service pages", async () => {
  const sm = await (await ctx.request.get(BASE + "/sitemap.xml")).text();
  for (const s of slugs) ok(sm.includes("/" + s), "sitemap " + s);
  const rb = await (await ctx.request.get(BASE + "/robots.txt")).text();
  ok(/Disallow: \/admin/.test(rb), "robots");
  const html = await (await ctx.request.get(BASE + "/web-sitesi")).text();
  ok(html.includes("application/ld+json"), "jsonld");
});

await browser.close();
await prisma.$disconnect();
console.log(results.join("\n"));
console.log(`\n${results.length - failed}/${results.length} passed`);
console.log(consoleErrors.length ? "CONSOLE ERRORS:\n" + [...new Set(consoleErrors)].join("\n") : "No console errors captured.");
process.exit(failed ? 1 : 0);

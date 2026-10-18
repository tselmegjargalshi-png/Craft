import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const BASE = "http://localhost:3000";
async function shot(p, name) {
  const total = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 400) { await p.mouse.wheel(0, 400); await p.waitForTimeout(70); }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  await p.screenshot({ path: `test-output/${name}.png`, fullPage: true });
}
const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await m.goto(BASE + "/mobil-pc-uygulama", { waitUntil: "networkidle" }); await shot(m, "m-app");
await m.goto(BASE + "/iletisim", { waitUntil: "networkidle" }); await shot(m, "m-contact");
const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await d.goto(BASE + "/web-sitesi", { waitUntil: "networkidle" }); await shot(d, "d-web");
await d.goto(BASE + "/admin/login"); await d.getByLabel("E-posta").fill(process.env.ADMIN_EMAIL); await d.getByLabel("Şifre").fill(process.env.ADMIN_PASSWORD);
await d.getByRole("button", { name: "Giriş yap" }).click(); await d.waitForURL(BASE + "/admin");
await shot(d, "a-dash"); await d.goto(BASE + "/admin/leads"); await shot(d, "a-leads"); await d.goto(BASE + "/admin/packages"); await shot(d, "a-packages");
const am = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await am.goto(BASE + "/admin/login"); await am.getByLabel("E-posta").fill(process.env.ADMIN_EMAIL); await am.getByLabel("Şifre").fill(process.env.ADMIN_PASSWORD);
await am.getByRole("button", { name: "Giriş yap" }).click(); await am.waitForURL(BASE + "/admin"); await am.goto(BASE + "/admin/leads"); await shot(am, "am-leads");
await b.close();

import { chromium } from "playwright";
const exe = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: exe });
const errors = [];
for (const [name, w, h] of [["m", 390, 844], ["d", 1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`${name} console: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${name} pageerror: ${e.message}`));
  for (const [slug, path] of [["home", "/"], ["pricing", "/fiyatlar?hizmet=nfc-kart"], ["web", "/web-sitesi"], ["contact", "/iletisim"]]) {
    await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(90); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-output/${name}-${slug}.png`, fullPage: true });
  }
  await ctx.close();
}
console.log(errors.length ? errors.join("\n") : "no console errors");
await browser.close();

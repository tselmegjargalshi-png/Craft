import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
console.log("before", await page.$$eval("[data-reveal=out]", e => e.length), await page.$$eval("[data-reveal=in]", e => e.length));
for (let y = 0; y < 6000; y += 300) { await page.mouse.wheel(0, 300); await page.waitForTimeout(150); }
console.log("after", await page.$$eval("[data-reveal=out]", e => e.length), await page.$$eval("[data-reveal=in]", e => e.length));
await page.evaluate(() => document.querySelector("#hizmetler").scrollIntoView());
await page.waitForTimeout(1200);
await page.screenshot({ path: "test-output/probe.png" });
await browser.close();

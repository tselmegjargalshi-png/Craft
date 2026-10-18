import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let bad = 0;
for (let n = 0; n < 40; n++) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const logs = [];
  p.on("console", m => logs.push(m.type() + ": " + m.text().slice(0, 120)));
  p.on("pageerror", e => logs.push("pageerror: " + e.message.slice(0, 120)));
  p.on("requestfailed", r => logs.push("reqfailed: " + r.url().slice(0, 100)));
  await p.goto("http://localhost:3000/fiyatlar", { waitUntil: "networkidle" });
  await p.locator("main nav").getByRole("link", { name: "Web Uygulama", exact: true }).click();
  await p.waitForTimeout(2500);
  if (!p.url().includes("hizmet=web-uygulama")) { bad++; console.log("run", n, "stuck", p.url(), JSON.stringify(logs)); }
  await ctx.close();
}
console.log("stuck:", bad, "/ 40");
await b.close();

import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (let n = 0; n < 14; n++) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const ev = [];
  const t0 = Date.now();
  p.on("request", r => r.url().includes("_rsc") && ev.push(`${Date.now() - t0}ms REQ ${new URL(r.url()).pathname}${new URL(r.url()).search.slice(0, 22)}`));
  p.on("response", r => r.url().includes("_rsc") && ev.push(`${Date.now() - t0}ms RES ${r.status()} ${new URL(r.url()).pathname}`));
  await p.goto("http://localhost:3000/fiyatlar", { waitUntil: "networkidle" });
  ev.push(`${Date.now() - t0}ms networkidle`);
  await p.locator("main nav").getByRole("link", { name: "Web Uygulama", exact: true }).click();
  ev.push(`${Date.now() - t0}ms CLICK`);
  await p.waitForTimeout(2500);
  if (!p.url().includes("hizmet=web-uygulama")) { console.log("run", n, "STUCK\n  " + ev.join("\n  ")); break; }
  await ctx.close();
}
await b.close();

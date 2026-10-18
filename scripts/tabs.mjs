import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let bad = 0;
for (let n = 0; n < 12; n++) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/olmayan-hizmet");
  await p.goto("http://localhost:3000/fiyatlar", { waitUntil: "networkidle" });
  await p.locator("main nav").getByRole("link", { name: "Web Uygulama", exact: true }).click();
  const t0 = Date.now();
  const ok = await p.waitForFunction(() => location.search.includes("hizmet=web-uygulama") && document.querySelector("main")?.textContent?.includes("119.900"), null, { timeout: 8000 }).then(() => true, () => false);
  if (!ok) { bad++; console.log("run", n, "stuck:", p.url(), await p.locator("main h2").first().innerText()); } else console.log("run", n, "ok", Date.now() - t0, "ms");
  await ctx.close();
}
console.log("stuck:", bad);
await b.close();

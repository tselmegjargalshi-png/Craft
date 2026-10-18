# Craft — Dijital hizmetler, fiyat ve teklif sitesi

Craft is a bilingual (Turkish default / English) digital-services website with a lightweight admin panel.
A visitor lands → understands the offer → picks one of 5 services → compares 5 packages → sees what's included and the price → sends a quote request.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Prisma 6 + SQLite · Zod · jose (JWT session) + bcryptjs · motion (only the small `LazyMotion` DOM bundle, used for the hero).

## Quick start

```bash
npm install
cp .env.example .env          # then edit ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
npm run setup                 # prisma generate + create SQLite DB + seed (5 services, 25 packages, FAQ, settings)
npm run dev                   # http://localhost:3000   ·   admin: http://localhost:3000/admin
```

Production: `npm run build && npm run start`.

| Env var | Purpose |
|---|---|
| `DATABASE_URL` | `file:./dev.db` (SQLite, relative to `prisma/`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin account. `npm run db:seed` hashes the password (bcrypt, cost 12) into the `User` table. Re-run the seed after changing them. The password is never stored in code. |
| `SESSION_SECRET` | 32+ chars, signs the admin session cookie. `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / Open Graph base URL |

The seed only fills an **empty** catalog, so re-running it never overwrites prices or copy edited in the admin.

## What's where

```
prisma/schema.prisma        User, Service, Package, PackageFeature, Faq, Lead, Setting
prisma/seed-data.ts         All Turkish + English seed copy and prices (edit here for a different starting catalog)
src/lib/i18n.ts             Every UI string as [TR, EN]; admin labels too
src/lib/data.ts             Cached DB queries used by pages
src/lib/auth.ts             JWT session helpers + requireAdmin()
src/middleware.ts           Blocks /admin/* without a valid session (pages & actions re-check too)
src/app/(site)/             Public site: /, /fiyatlar, /iletisim, /[slug] (service detail)
src/app/api/leads/route.ts  Quote-request endpoint (Zod validation, honeypot, rate limit)
src/app/admin/              Admin panel + server actions (actions.ts)
src/components/             PackageCard, PricingGrid, ServiceObject (visual identity), HeroScene, QuoteForm, …
scripts/                    e2e.mjs (Playwright), restart.sh, reset-db.sh, screenshot helpers
```

## Design system (short)

- **Palette:** warm off-white `#f6f3ee`, charcoal `#17161a`, one accent vermilion `#d23b1e` (white-on-accent button text ≈ 4.7:1).
- **Type:** Plus Jakarta Sans (self-hosted via Fontsource, full Turkish `ş ğ ü ö ç ı İ` coverage). Hero ≈ 70px, section headings 32–48px, prices 34px.
- **Signature idea:** each service is a small flat object — browser window, QR menu card, NFC card, dashboard, phone + monitor (`ServiceObject.tsx`, pure inline SVG). They float around a central "package picker" card in the hero (CSS float + light scroll parallax), and reappear on service cards and detail pages.
- **Motion:** reveal-on-scroll via IntersectionObserver, card lift, button press, hero float. All of it respects `prefers-reduced-motion`. No 3D library, no video, no raster images.
- **Pricing:** 5 cards in a row ≥1280px, 2 columns on tablets, stacked on phones. Exactly one card per service is highlighted ("En Çok Tercih Edilen"); price, "Başlangıç fiyatı", billing label (Tek seferlik / Aylık / Yıllık) and badges like "Kart dahil" come from the database.

## Admin

`/admin` → sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

- **Dashboard:** total leads, new leads, active services, most viewed service, most requested service.
- **Services:** add / edit / delete, reorder (↑ ↓), enable/disable, TR+EN title, tagline, description, "what is it", "who is it for", "what can we build", SEO description, visual object.
- **Packages:** per service — names, price (empty = "Teklif Al"), currency, billing type, "starting price" label, badge note, description, CTA text, features (one per line, TR/EN matched by line), highlight, visibility, reorder, delete.
- **Leads:** list with filter, status (New / Contacted / In progress / Completed / Archived), "WhatsApp'tan Yaz" button per lead.
- **FAQ:** general (homepage) or per service; add / edit / reorder / hide / delete.
- **Content:** hero, about, final CTA, pricing note, footer tagline — each in TR and EN.
- **Settings:** site name, logo URL, WhatsApp, e-mail, Instagram, phone, TikTok, LinkedIn. Contact buttons only appear on the site when the value is filled in.

The admin UI follows the same TR/EN switch as the site.

## Security notes

- Admin: bcrypt-hashed password, HS256 JWT in an `httpOnly`, `sameSite=lax` (and `secure` in production) cookie, 7-day expiry. Middleware **and** every admin page/action call `requireAdmin()`. Login is rate limited (6 / 15 min / IP) and compares a hash even for unknown e-mails.
- Quote form: validated again on the server with Zod, control chars and `<>` stripped, length limits, 10 kB body cap, honeypot field, 5 submissions / 10 min / IP. React escapes all output.
- Security headers (`nosniff`, `X-Frame-Options: DENY`, referrer & permissions policy) are set in `next.config.mjs`. A strict CSP is **not** configured.

## Known limitations / things to decide

1. **Rate limiting is in-memory** – correct for one Node process. Behind several instances or serverless, use Redis/Upstash or your host's WAF.
2. **SQLite needs a persistent disk.** On Vercel/Netlify-style hosts the file would not persist. Use a VPS/Docker volume (Railway, Fly, Render with disk), or switch to Postgres: change `provider` to `postgresql` in `schema.prisma`, set a Postgres `DATABASE_URL`, run `npx prisma db push && npm run db:seed`. (Not tested here.)
3. **Language lives in the URL.** Turkish at `/...`, English at `/en/...` (a middleware rewrite, one codebase). Every page has `canonical` + `hreflang` (tr, en, x-default) and the sitemap lists both versions. The TR/EN switcher does a full navigation to the same page in the other language. Admin stays at `/admin` (language via cookie, not indexed).
4. **Business copy is a draft.** Delivery times, payment plan, revision rules, "domain/hosting not included", support length in the FAQ and package texts are sensible defaults, not your policies — edit them in the admin before launch. Prices follow your brief; whether they include KDV is not stated anywhere on the site.
5. **WhatsApp and Instagram are empty** in the seed (no real numbers invented). Fill them in under Settings. The seeded e-mail is `hello@craft.example`.
6. No logo upload (URL field only), no testimonials section (your brief said not to invent social proof), no e-mail notification on new leads.
7. A cold `next build` prints a harmless warning from `jose` (an unused encrypted-token code path referencing `CompressionStream` in the middleware bundle). Sessions are plain signed JWTs and work normally.
8. `npm run lint` uses `next lint`, which Next 16 removes; migrate to the ESLint CLI when upgrading.

## Tests

`npm run build && npm run start`, then in another shell (with `.env` loaded) `npm run test:e2e` runs 34 Playwright checks against the running site: all 5 service pages and prices, TR↔EN switching, quote-form validation/success/persistence, API validation + honeypot + rate limit, admin auth, dashboard, service/package/FAQ CRUD, lead status, content/settings flow-through to the public site, logout, and no-horizontal-overflow at 360/390/430/768/1024 px. Use a freshly seeded DB (`npm run db:reset` — note Prisma refuses `--force-reset` when invoked by an AI agent, so run it yourself).

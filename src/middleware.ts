import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";

const LOCALE_HEADER = "x-craft-locale";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- admin: first line of defence (every admin page and server action ALSO calls requireAdmin()) ----
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const session = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      const res = NextResponse.redirect(url);
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // ---- public site: /en/... is English (rewritten to the same route), everything else is Turkish ----
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const rest = isEn ? pathname.slice(3) || "/" : pathname;
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, isEn ? "en" : "tr");

  if (isEn && !/^\/(admin|api)(\/|$)/.test(rest)) {
    const url = req.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api/|_next/|icon.svg|opengraph-image|robots.txt|sitemap.xml).*)"],
};

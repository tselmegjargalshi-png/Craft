import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { getLocale } from "@/lib/locale";
import { SITE_URL } from "@/lib/data";

export const viewport: Viewport = { themeColor: "#f6f3ee", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Craft — Dijital çözümler, net fiyatlar", template: "%s | Craft" },
  applicationName: "Craft",
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className="min-h-dvh">
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

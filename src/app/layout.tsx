import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleTag } from "@/components/google-tag";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const metadataBaseUrl =
  configuredSiteUrl && /localhost|127\.0\.0\.1/i.test(configuredSiteUrl)
    ? configuredSiteUrl
    : PRODUCTION_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans text-ink antialiased">
        <GoogleTag />
        {children}
      </body>
    </html>
  );
}

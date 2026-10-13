import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SplashScreen } from "@/components/SplashScreen";
import { asset } from "@/lib/assets";

const display = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CormorantGaramond-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/CormorantGaramond-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const label = localFont({
  src: "./fonts/Michroma-Regular.woff2",
  weight: "400",
  variable: "--font-label",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "./fonts/SpaceGrotesk-400.woff2", weight: "400" },
    { path: "./fonts/SpaceGrotesk-500.woff2", weight: "500" },
    { path: "./fonts/SpaceGrotesk-600.woff2", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lrmagsino.github.io/FritzAndPrincess_Wedding2027";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fritz & Princess — Wedding · April 23, 2027",
  description:
    "You are invited to the wedding of Fritz & Princess on April 23, 2027 in Antipolo, Rizal. Together today, tomorrow, and always.",
  openGraph: {
    title: "Fritz & Princess — Wedding",
    description: "April 23, 2027 · Antipolo, Rizal. Together today, tomorrow, and always.",
    type: "website",
    images: [
      {
        url: asset("/brand/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Fritz & Princess wedding monogram",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#2b0610",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${label.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        <SplashScreen>{children}</SplashScreen>
      </body>
    </html>
  );
}

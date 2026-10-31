import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aniimopower.app"),
  title: "Aniimo Power | Ultimate Guide, Artifacts & Calculator",
  description:
    "Comprehensive guide for Aniimo v1.0 & v1.1. Optimize builds, choose the right held item artifact, and calculate upgrade costs. Blazing fast and typo-forgiving search at aniimopower.app.",
  keywords: [
    "Aniimo",
    "Aniimo Power",
    "aniimopower.app",
    "Aniimo guide",
    "Aniimo held items",
    "Aniimo artifacts",
    "Aniimo calculator",
    "Infergon",
    "Scorchhowl",
    "Prismana",
    "Alpha Ignitis",
    "Echoing Grimoire",
  ],
  authors: [{ name: "Aniimo Power Team", url: "https://aniimopower.app" }],
  creator: "Aniimo Power",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aniimopower.app",
    siteName: "Aniimo Power",
    title: "Aniimo Power | Ultimate Guide, Artifacts & Calculator",
    description:
      "All 83 Aniimos from Version 1.0 & 1.1 with optimal personalities, skills, held items, Alpha boss locations, and upgrade material calculator.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Aniimo Power Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniimo Power | Ultimate Guide, Artifacts & Calculator",
    description: "Speed-optimized Aniimo guide, held items and upgrade calculator.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1f3ec",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body className="antialiased selection:bg-[#cc5231] selection:text-white">
        {children}
      </body>
    </html>
  );
}


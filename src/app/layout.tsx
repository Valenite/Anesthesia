import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANESTHESIA — Cryptic Hunt & CTF",
  description:
    "Anesthesia is a unified 48-hour online competition fusing an open-internet Cryptic Hunt and an adversarial CTF into a single arena. One squad, one dashboard, one master leaderboard.",
  keywords: [
    "anesthesia",
    "cryptic hunt",
    "CTF",
    "capture the flag",
    "puzzle hunt",
    "ciphers",
    "cybersecurity",
    "competition",
  ],
  icons: {
    icon: "/anesthesia-banner.png",
  },
};

import Cursor from "@/components/Cursor";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-ink font-sans antialiased selection:bg-acid selection:text-void">
        <Cursor />
        {children}
      </body>
    </html>
  );
}

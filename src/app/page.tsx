"use client";

import LenisProvider from "@/components/LenisProvider";
import LoadingScreen from "@/components/LoadingScreen";
import DynamicBackground from "@/components/DynamicBackground";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Format from "@/components/Format";
import Dossier from "@/components/Dossier";
import Cipher from "@/components/Cipher";
import Prizes from "@/components/Prizes";
import Team from "@/components/Team";
import Register from "@/components/Register";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import TerminalDrawer from "@/components/TerminalDrawer";

export default function Page() {
  return (
    <LenisProvider>
      {/* Intro Preloader */}
      <LoadingScreen />

      {/* Dynamic living ambient background */}
      <DynamicBackground />

      {/* Navigation */}
      <Nav />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero ready={true} />
        <Marquee
          items={[
            "ANESTHESIA 2026",
            "CRYPTIC HUNT & CTF",
            "ONE UNIFIED EVENT",
            "DATES: TBA",
            "ONE MASTER SCOREBOARD",
            "JOIN DISCORD",
          ]}
        />
        <About />
        <Format />
        <Dossier />
        <Marquee
          items={[
            "DECODE CIPHERS",
            "BREACH FLAGS",
            "INSPECT SOURCE",
            "OWN THE LEADERBOARD",
          ]}
          reverse
          duration={32}
          big
        />
        <Cipher />
        <Prizes />
        <Team />
        <Register />
        <Faq />
      </main>

      {/* Interactive Command Line Terminal Drawer */}
      <TerminalDrawer />

      <Footer />
    </LenisProvider>
  );
}

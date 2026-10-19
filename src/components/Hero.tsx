"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { ArrowDown } from "lucide-react";

export default function Hero({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.1 },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:px-10"
    >
      {/* Single clean glow — not a radar, not a grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(59,158,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center gap-10">
        {/* Status pill — one, not five */}
        <div className="hero-el inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/50">
          <span className="size-1.5 rounded-full bg-[#3b9eff] animate-pulse" />
          Registration open · Dates TBA
        </div>

        {/* Banner */}
        <div className="hero-el w-full max-w-2xl">
          <Image
            src="/anesthesia-banner.png"
            alt="Anesthesia"
            width={1200}
            height={500}
            priority
            className="w-full object-contain select-none"
          />
        </div>

        {/* Headline — one clear statement */}
        <div className="hero-el max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            One event.{" "}
            <span className="text-[#3b9eff]">Two disciplines.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mx-auto">
            Cryptic Hunt meets CTF. Solve puzzles, crack flags — one squad, one leaderboard, zero entry fee.
          </p>
        </div>

        {/* CTAs — two, clean */}
        <div className="hero-el flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollTo("#register")}
            className="rounded-full bg-[#3b9eff] px-8 py-3 text-sm font-semibold text-[#06070a] hover:bg-white transition-colors duration-200"
          >
            Register Free
          </button>
          <a
            href="https://discord.gg/Q2Z5FSxTG4"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-8 py-3 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all duration-200"
          >
            Join Discord
          </a>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => scrollTo("#about")}
          className="hero-el mt-4 flex flex-col items-center gap-2 text-white/20 hover:text-white/50 transition-colors duration-200"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown className="size-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

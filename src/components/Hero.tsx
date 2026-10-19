"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { ArrowDown } from "lucide-react";

export default function Hero({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Clean, elegant entrance: logo emerges with soft radiant backlight
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.94, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out" },
          "-=0.2"
        )
        .fromTo(
          ".hero-text",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          "-=0.4"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 md:px-10 overflow-hidden"
    >
      {/* Soft atmospheric radial backlight centered behind the logo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[700px] h-[500px] opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,158,255,0.22) 0%, rgba(59,158,255,0.06) 45%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center gap-8">
        {/* Status pill */}
        <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/50 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#3b9eff] animate-pulse" />
          <span>Registration Open · Dates TBA</span>
        </div>

        {/* Clean, perfectly transparent emblem — zero black box, zero messy overlays */}
        <div
          ref={logoRef}
          className="relative w-full max-w-2xl px-4 select-none my-2 transition-transform duration-500 hover:scale-[1.01]"
        >
          {/* Subtle soft ambient glow directly behind the letters */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-30 blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(59,158,255,0.4) 0%, transparent 65%)",
            }}
          />

          <Image
            src="/anesthesia-logo.png"
            alt="ANESTHESIA — Cryptic Hunt & CTF"
            width={835}
            height={457}
            priority
            className="w-full object-contain pointer-events-none drop-shadow-[0_0_30px_rgba(59,158,255,0.25)]"
          />
        </div>

        {/* Headline */}
        <div className="hero-text max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            One event.{" "}
            <span className="text-[#3b9eff]">Two disciplines.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mx-auto font-sans">
            Cryptic Hunt meets CTF. Solve puzzles, crack flags — one squad, one leaderboard, zero entry fee.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-text flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollTo("#register")}
            className="rounded-full bg-[#3b9eff] px-8 py-3 text-sm font-semibold text-[#06070a] hover:bg-white transition-colors duration-200 shadow-[0_0_20px_rgba(59,158,255,0.3)]"
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
          className="hero-text mt-2 flex flex-col items-center gap-2 text-white/20 hover:text-white/50 transition-colors duration-200"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
          <ArrowDown className="size-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

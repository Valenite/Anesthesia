"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { playTactileClick } from "@/lib/audio";
import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";

export default function Hero({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic entrance on load
      gsap.fromTo(
        ".hero-anim-item",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        }
      );

      // 2. Automatic subtle ambient breathing - no clicking, no jitter, perfectly smooth
      if (emblemRef.current) {
        gsap.to(emblemRef.current, {
          opacity: 0.92,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 md:px-10 overflow-hidden select-none"
    >
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center gap-7">
        {/* Minimalist status badge */}
        <div className="hero-anim-item inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-white/60 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#3b9eff] animate-pulse" />
          <span className="font-mono tracking-wider uppercase text-[11px]">
            Registration Open · Dates TBA
          </span>
        </div>

        {/* Clean, Seamless Emblem - No boxes, no flashy lines, no click-to-strike */}
        <div
          ref={emblemRef}
          className="hero-anim-item relative w-full max-w-2xl px-2 my-2 flex items-center justify-center"
        >
          <Image
            src="/anesthesia-logo.png"
            alt="ANESTHESIA"
            width={835}
            height={457}
            priority
            className="w-full object-contain pointer-events-none select-none"
          />
        </div>

        {/* Clean, authentic typography */}
        <div className="hero-anim-item max-w-2xl mt-1">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            One event.{" "}
            <span className="text-[#3b9eff]">
              Two disciplines.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mx-auto font-sans">
            Cryptic Hunt meets CTF. Solve puzzles, crack flags — one squad, one leaderboard, zero entry fee.
          </p>
        </div>

        {/* CTAs using Lucide icons */}
        <div className="hero-anim-item flex flex-wrap items-center justify-center gap-3 mt-1">
          <button
            onClick={() => {
              playTactileClick();
              scrollTo("#register");
            }}
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-[#3b9eff] px-8 py-3.5 text-sm font-semibold text-[#06070a] hover:bg-white transition-all duration-200 shadow-[0_0_20px_rgba(59,158,255,0.3)] hover:shadow-[0_0_30px_rgba(59,158,255,0.5)]"
          >
            <span>Register Free</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <a
            href="https://discord.gg/Q2Z5FSxTG4"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playTactileClick()}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 backdrop-blur-sm hover:bg-white/[0.04]"
          >
            <MessageSquare className="size-4 text-[#3b9eff]" />
            <span>Join Discord</span>
          </a>
        </div>

        {/* Scroll cue using Lucide ChevronDown */}
        <button
          onClick={() => {
            playTactileClick();
            scrollTo("#about");
          }}
          className="hero-anim-item mt-2 flex flex-col items-center gap-1 text-white/25 hover:text-white/60 transition-colors duration-200"
          aria-label="Scroll down"
        >
          <span className="text-[10px] tracking-widest uppercase font-mono">Explore</span>
          <ChevronDown className="size-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

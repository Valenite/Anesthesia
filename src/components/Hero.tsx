"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { playTactileClick } from "@/lib/audio";
import { ArrowDown, Zap } from "lucide-react";

export default function Hero({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Cinematic Sword Piercing Animation
  const triggerPierceAnimation = () => {
    playTactileClick();

    const tl = gsap.timeline();

    // Reset initial states
    tl.set(".sword-blade-beam", {
      scaleY: 0,
      y: -180,
      opacity: 0,
      transformOrigin: "top center",
    })
      .set(".sword-impact-wave", { scale: 0.1, opacity: 0 })
      .set(".sword-flash", { opacity: 0 })
      .set(".reticle-accent", { opacity: 0, rotation: -45, scale: 0.85 })
      .set(".banner-emblem", { filter: "brightness(0.6) drop-shadow(0 0 10px rgba(59,158,255,0.2))" });

    // Step 1: Descend & pierce into the sword center
    tl.to(".sword-blade-beam", {
      y: 0,
      scaleY: 1,
      opacity: 1,
      duration: 0.45,
      ease: "power4.in",
    })
      // Step 2: Impact moment at the crossguard
      .to(".sword-flash", {
        opacity: 0.9,
        duration: 0.08,
        ease: "power2.out",
      })
      .to(".sword-impact-wave", {
        scale: 2.2,
        opacity: 1,
        duration: 0.6,
        ease: "expo.out",
      }, "<")
      .to(".sword-flash", {
        opacity: 0,
        duration: 0.25,
      })
      // Step 3: Reticle locks on and banner ignites with radiant light
      .to(".reticle-accent", {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
      }, "-=0.3")
      .to(".banner-emblem", {
        filter: "brightness(1.1) drop-shadow(0 0 35px rgba(59,158,255,0.7))",
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.4")
      .to(".banner-emblem", {
        filter: "brightness(1) drop-shadow(0 0 24px rgba(59,158,255,0.4))",
        duration: 0.8,
        ease: "power1.inOut",
      });
  };

  useEffect(() => {
    if (!ready) return;

    // Reveal hero elements
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-el",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.1 },
      );
    }, rootRef);

    // Run the sword piercing animation on load
    const timer = setTimeout(() => {
      triggerPierceAnimation();
    }, 250);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [ready]);

  // Subtle 3D mouse parallax on the banner emblem
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!emblemRef.current) return;
    const rect = emblemRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:px-10"
    >
      {/* Dynamic ambient backlight */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 38%, rgba(59,158,255,0.09) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center gap-8">
        {/* Status pill */}
        <div className="hero-el inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/50 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-[#3b9eff] animate-pulse" />
          <span>Registration open · Dates TBA</span>
        </div>

        {/* Cinematic Emblem Centerpiece with Sword Piercing Animation */}
        <div
          ref={emblemRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={triggerPierceAnimation}
          className="hero-el group relative w-full max-w-3xl my-1 flex items-center justify-center cursor-pointer select-none"
          style={{
            perspective: "1000px",
          }}
          title="Click to strike the sword"
        >
          {/* 3D Perspective Tilt Container */}
          <div
            className="relative w-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Center Backlight Halo */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-75"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(59,158,255,0.35) 0%, rgba(59,158,255,0.1) 40%, transparent 75%)",
              }}
            />

            {/* SVG Overlay: Piercing Sword Laser & Shockwave */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full z-20 overflow-visible"
              viewBox="0 0 1000 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Piercing vertical blade energy beam */}
              <g className="sword-blade-beam">
                {/* Vertical lightning line skewering down through the sword */}
                <line
                  x1="504"
                  y1="-100"
                  x2="504"
                  y2="280"
                  stroke="#3b9eff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px #3b9eff)"
                />
                <line
                  x1="504"
                  y1="50"
                  x2="504"
                  y2="280"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Blade tip spearhead */}
                <polygon
                  points="504,286 499,268 509,268"
                  fill="#ffffff"
                  filter="drop-shadow(0 0 6px #3b9eff)"
                />
              </g>

              {/* Impact shockwave burst at sword center */}
              <circle
                className="sword-impact-wave"
                cx="504"
                cy="225"
                r="70"
                stroke="#3b9eff"
                strokeWidth="1.5"
                fill="none"
                opacity="0"
                filter="drop-shadow(0 0 12px #3b9eff)"
              />
              <circle
                className="sword-impact-wave"
                cx="504"
                cy="225"
                r="110"
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
                opacity="0"
              />

              {/* Flash burst */}
              <circle
                className="sword-flash"
                cx="504"
                cy="225"
                r="90"
                fill="url(#swordFlashGrad)"
                opacity="0"
              />

              {/* Reticle Accent Crosshairs */}
              <g className="reticle-accent" opacity="0.8">
                <circle
                  cx="504"
                  cy="225"
                  r="135"
                  stroke="rgba(59,158,255,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                {/* Heartbeat pulse accent */}
                <path
                  d="M 504 290 L 580 290 L 588 275 L 596 305 L 604 278 L 610 295 L 616 290 L 690 290"
                  stroke="#3b9eff"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 6px rgba(59,158,255,0.8))"
                  className="animate-pulse"
                />
              </g>

              <defs>
                <radialGradient id="swordFlashGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#3b9eff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b9eff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Banner Artwork: mix-blend-screen ensures ZERO black box borders */}
            <div className="relative w-full overflow-visible">
              <Image
                src="/anesthesia-banner.png"
                alt="ANESTHESIA"
                width={1200}
                height={500}
                priority
                className="banner-emblem w-full object-contain pointer-events-none select-none transition-all duration-300"
                style={{
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>

          {/* Interactive replay cue */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
            Click emblem to strike sword
          </span>
        </div>

        {/* Headline */}
        <div className="hero-el max-w-2xl mt-2">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            One event.{" "}
            <span className="text-[#3b9eff]">Two disciplines.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mx-auto font-sans">
            Cryptic Hunt meets CTF. Solve puzzles, crack flags — one squad, one leaderboard, zero entry fee.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-el flex flex-wrap items-center justify-center gap-3">
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
          className="hero-el mt-2 flex flex-col items-center gap-2 text-white/20 hover:text-white/50 transition-colors duration-200"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown className="size-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

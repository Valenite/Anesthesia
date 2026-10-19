"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { playTactileClick, playSwordStrikeSound } from "@/lib/audio";
import { ArrowDown, Zap } from "lucide-react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

export default function Hero({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const emblemContainerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);

  // Logical container dimensions for rock-solid coordinate math
  const dimsRef = useRef({ w: 600, h: 330 });

  // References for physics and animation loop
  const sparksRef = useRef<Spark[]>([]);
  const embersRef = useRef<Ember[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const arcsRef = useRef<{ points: { x: number; y: number }[]; alpha: number }[]>([]);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Trigger high-velocity spark explosion and centered shockwaves on canvas
  const triggerCanvasBurst = useCallback(() => {
    const { w, h } = dimsRef.current;
    const cx = w * 0.5;
    const cy = h * 0.5;

    // 1. Shockwaves expanding from the dead center
    shockwavesRef.current.push({
      x: cx,
      y: cy,
      radius: 10,
      maxRadius: Math.min(w, h) * 0.52,
      alpha: 0.95,
      color: "#3b9eff",
      lineWidth: 2.5,
    });
    shockwavesRef.current.push({
      x: cx,
      y: cy,
      radius: 5,
      maxRadius: Math.min(w, h) * 0.65,
      alpha: 0.75,
      color: "#ffffff",
      lineWidth: 1.5,
    });

    // 2. High-speed sparks bursting outward
    const colors = ["#ffffff", "#60a5fa", "#3b9eff", "#93c5fd", "#38bdf8"];
    const sparkCount = 50;

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      sparksRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2 + 0.5),
        size: Math.random() * 2.2 + 1,
        alpha: 1,
        decay: Math.random() * 0.024 + 0.016,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3. Crackling electric lightning arc along the sword axis
    const points: { x: number; y: number }[] = [];
    const arcLength = h * 0.65;
    const startY = h * 0.18;
    const steps = 12;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = startY + t * arcLength;
      const jitter = (Math.random() - 0.5) * (t > 0.25 && t < 0.75 ? 18 : 6);
      points.push({ x: cx + jitter, y });
    }
    arcsRef.current.push({ points, alpha: 1 });
  }, []);

  // Cinematic Sword Piercing Strike
  const strikeSword = useCallback(() => {
    playSwordStrikeSound();
    triggerCanvasBurst();
    setStrikeCount((c) => c + 1);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Step 0: Prep positions
    tl.set(".sword-strike-beam", {
      scaleY: 0,
      y: -240,
      opacity: 0,
      transformOrigin: "top center",
    })
      .set(".strike-burst", { scale: 0, opacity: 0 })
      .set(".horizontal-beam-left", { scaleX: 0, opacity: 0, transformOrigin: "right center" })
      .set(".horizontal-beam-right", { scaleX: 0, opacity: 0, transformOrigin: "left center" });

    // Step 1: Plunge down supersonic vertical spear
    tl.to(".sword-strike-beam", {
      y: 0,
      scaleY: 1,
      opacity: 1,
      duration: 0.3,
      ease: "power4.in",
    })
      // Step 2: Instant IMPACT: Central flare flash & subtle tactile shake
      .to(".strike-burst", {
        scale: 1.4,
        opacity: 1,
        duration: 0.08,
        ease: "power2.out",
      })
      .to(logoWrapperRef.current, {
        x: "+=2.5",
        y: "-=1.5",
        duration: 0.035,
        yoyo: true,
        repeat: 3,
        ease: "none",
      }, "<")
      .to(".strike-burst", {
        scale: 0.4,
        opacity: 0,
        duration: 0.2,
      }, "+=0.05")

      // Step 3: Horizontal electrical discharge across the letters
      .to([".horizontal-beam-left", ".horizontal-beam-right"], {
        scaleX: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      }, "-=0.25")
      .to([".horizontal-beam-left", ".horizontal-beam-right"], {
        opacity: 0,
        duration: 0.25,
      }, "+=0.05")

      // Step 4: Emblem surges with brilliant neon luminescence then settles
      .to(logoWrapperRef.current, {
        filter: "brightness(1.6) drop-shadow(0 0 50px rgba(59,158,255,0.9)) drop-shadow(0 0 20px #ffffff)",
        duration: 0.12,
        ease: "power2.out",
      }, "-=0.45")
      .to(logoWrapperRef.current, {
        filter: "brightness(1) drop-shadow(0 0 28px rgba(59,158,255,0.35))",
        duration: 0.85,
        ease: "power2.inOut",
      });
  }, [triggerCanvasBurst]);

  // Canvas Particle & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      if (!canvas || !emblemContainerRef.current) return;
      const rect = emblemContainerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Record logical dimensions
      dimsRef.current = { w: rect.width, h: rect.height };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // Absolute transform reset prevents cumulative scale errors
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize ambient embers around the sword
    const { w, h } = dimsRef.current;
    embersRef.current = Array.from({ length: 20 }, () => ({
      x: w * 0.5 + (Math.random() - 0.5) * (w * 0.45),
      y: h * 0.5 + (Math.random() - 0.5) * (h * 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.15),
      size: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    let running = true;
    let frame = 0;

    const render = () => {
      if (!running) return;
      frame++;

      const { w: containerW, h: containerH } = dimsRef.current;

      ctx.clearRect(0, 0, containerW, containerH);

      // Smooth tilt interpolation (lerp)
      currentTiltRef.current.x += (targetTiltRef.current.x - currentTiltRef.current.x) * 0.12;
      currentTiltRef.current.y += (targetTiltRef.current.y - currentTiltRef.current.y) * 0.12;

      if (sheenRef.current) {
        sheenRef.current.style.transform = `rotateX(${currentTiltRef.current.x}deg) rotateY(${currentTiltRef.current.y}deg)`;
      }

      // 1. Draw Centered Shockwaves
      shockwavesRef.current = shockwavesRef.current.filter((sw) => sw.alpha > 0.015);
      shockwavesRef.current.forEach((sw) => {
        sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 1.5;
        sw.alpha *= 0.91;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = sw.lineWidth;
        ctx.shadowBlur = 12;
        ctx.shadowColor = sw.color;
        ctx.stroke();
        ctx.restore();
      });

      // 2. Draw Ambient Floating Embers
      embersRef.current.forEach((ember) => {
        ember.phase += ember.pulseSpeed;
        ember.y += ember.vy;
        ember.x += ember.vx + Math.sin(ember.phase) * 0.25;

        // Wrap around
        if (ember.y < 10) {
          ember.y = containerH - 10;
          ember.x = containerW * 0.5 + (Math.random() - 0.5) * (containerW * 0.4);
        }

        const currentAlpha = Math.max(0, Math.sin(ember.phase) * 0.35 + ember.alpha);

        ctx.save();
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#3b9eff";
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Dynamic Explosive Sparks
      sparksRef.current = sparksRef.current.filter((spark) => spark.alpha > 0.02);
      sparksRef.current.forEach((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.1; // gravity
        spark.vx *= 0.96; // air drag
        spark.alpha -= spark.decay;

        ctx.save();
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = Math.max(0, spark.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = spark.color;
        ctx.fill();
        ctx.restore();
      });

      // 4. Draw Electric Arc Discharges
      arcsRef.current = arcsRef.current.filter((arc) => arc.alpha > 0.05);
      arcsRef.current.forEach((arc) => {
        arc.alpha -= 0.09;

        if (arc.points.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(arc.points[0].x, arc.points[0].y);
          for (let i = 1; i < arc.points.length; i++) {
            ctx.lineTo(arc.points[i].x, arc.points[i].y);
          }
          ctx.strokeStyle = `rgba(147, 197, 253, ${arc.alpha})`;
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#3b9eff";
          ctx.stroke();

          // Core bright white filament
          ctx.strokeStyle = `rgba(255, 255, 255, ${arc.alpha * 0.9})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      });

      // 5. Periodic spontaneous electric micro-discharge (every ~260 frames)
      if (frame % 260 === 0 && Math.random() > 0.35) {
        const cx = containerW * 0.5;
        const cy = containerH * 0.5;
        const pts = [];
        const steps = 7;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) - 0.5;
          pts.push({
            x: cx + (Math.random() - 0.5) * 14,
            y: cy + t * (containerH * 0.32),
          });
        }
        arcsRef.current.push({ points: pts, alpha: 0.7 });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Initial Hero Entrance & Sword Piercing
  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      // Hero elements entrance
      gsap.fromTo(
        ".hero-anim-item",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.1 }
      );

      // Trigger the sword strike after initial reveal
      const timer = setTimeout(() => {
        strikeSword();
      }, 450);

      // Sweeping heartbeat glint across the letters every 6.5s
      const pulseInterval = setInterval(() => {
        gsap.fromTo(
          ".heartbeat-glow-line",
          { x: "-120%", opacity: 0 },
          { x: "120%", opacity: 0.8, duration: 1.4, ease: "power2.inOut" }
        );
      }, 6500);

      return () => {
        clearTimeout(timer);
        clearInterval(pulseInterval);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [ready, strikeSword]);

  // Smooth 3D mouse parallax and specular light sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!emblemContainerRef.current) return;
    const rect = emblemContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Target tilt angles: -14 to +14 degrees
    targetTiltRef.current = {
      x: (y - 0.5) * -14,
      y: (x - 0.5) * 14,
    };

    setMousePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    targetTiltRef.current = { x: 0, y: 0 };
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 md:px-10 overflow-hidden select-none"
    >
      {/* Dynamic ambient center backlight */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[900px] h-[550px] opacity-40 blur-3xl transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(59,158,255,0.26) 0%, rgba(59,158,255,0.06) 50%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center gap-7">
        {/* Status pill with animated beacon */}
        <div className="hero-anim-item inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/70 backdrop-blur-md shadow-[0_0_15px_rgba(59,158,255,0.12)]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3b9eff] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#3b9eff]" />
          </span>
          <span className="font-mono tracking-wide">OPERATIONAL SYSTEM ONLINE · DATES TBA</span>
        </div>

        {/* Cinematic Emblem Centerpiece with Sword Piercing & Canvas Particle FX */}
        <div
          ref={emblemContainerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={strikeSword}
          className="hero-anim-item group relative w-full max-w-2xl px-2 my-2 cursor-pointer"
          style={{ perspective: "1200px" }}
          title="Click to strike the blade"
        >
          {/* 3D Interactive Tilting Emblem Wrapper */}
          <div
            ref={sheenRef}
            className="relative w-full flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Interactive specular flashlight effect on hover */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.65 : 0,
                background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(59,158,255,0.38) 0%, rgba(59,158,255,0.08) 50%, transparent 75%)`,
                mixBlendMode: "screen",
              }}
            />

            {/* Piercing Energy Sword Laser SVG Overlay */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full z-20 overflow-visible"
              viewBox="0 0 835 457"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Vertical Piercing Sword Lightning Beam */}
              <g className="sword-strike-beam">
                {/* Outer glowing plasma aura */}
                <line
                  x1="417.5"
                  y1="-200"
                  x2="417.5"
                  y2="228.5"
                  stroke="#3b9eff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 14px #3b9eff)"
                  opacity="0.95"
                />
                {/* Core diamond white laser */}
                <line
                  x1="417.5"
                  y1="-200"
                  x2="417.5"
                  y2="228.5"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 6px #ffffff)"
                />
                {/* Piercing Spearhead Tip */}
                <polygon
                  points="417.5,238 412,220 423,220"
                  fill="#ffffff"
                  filter="drop-shadow(0 0 10px #3b9eff)"
                />
              </g>

              {/* Horizontal Laser Shocklines across letters */}
              <line
                className="horizontal-beam-left"
                x1="70"
                y1="228.5"
                x2="417.5"
                y2="228.5"
                stroke="#3b9eff"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="drop-shadow(0 0 10px #3b9eff)"
              />
              <line
                className="horizontal-beam-right"
                x1="417.5"
                y1="228.5"
                x2="765"
                y2="228.5"
                stroke="#3b9eff"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="drop-shadow(0 0 10px #3b9eff)"
              />

              {/* Center Impact Flash Starburst */}
              <circle
                className="strike-burst"
                cx="417.5"
                cy="228.5"
                r="45"
                fill="url(#impactGlow)"
              />

              {/* Gradients */}
              <defs>
                <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#3b9eff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b9eff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Seamless Transparent Logo Artwork */}
            <div ref={logoWrapperRef} className="relative w-full overflow-hidden transition-all duration-300">
              <Image
                src="/anesthesia-logo.png"
                alt="ANESTHESIA"
                width={835}
                height={457}
                priority
                className="w-full object-contain pointer-events-none select-none drop-shadow-[0_0_28px_rgba(59,158,255,0.35)]"
              />

              {/* Sweeping Heartbeat Glint Wave */}
              <div
                className="heartbeat-glow-line pointer-events-none absolute inset-y-0 w-36 -skew-x-12 opacity-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(59,158,255,0.45) 50%, transparent 100%)",
                }}
              />
            </div>

            {/* Centered Physics Canvas for Expanding Shockwaves, Sparks & Electric Arcs */}
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full z-30"
            />
          </div>

          {/* Interactive cue with strike counter */}
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/40 group-hover:text-[#3b9eff] transition-all">
            <Zap className="size-3 text-[#3b9eff] animate-pulse" />
            <span>Click emblem to strike the blade</span>
            {strikeCount > 0 && (
              <span className="rounded bg-[#3b9eff]/15 px-1.5 py-0.5 text-[9px] text-[#3b9eff]">
                +{strikeCount}
              </span>
            )}
          </div>
        </div>

        {/* Headline with dynamic shimmer */}
        <div className="hero-anim-item max-w-2xl mt-1">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            One event.{" "}
            <span className="bg-gradient-to-r from-[#3b9eff] via-[#93c5fd] to-[#3b9eff] bg-clip-text text-transparent">
              Two disciplines.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mx-auto font-sans">
            Cryptic Hunt meets CTF. Solve puzzles, crack flags — one squad, one leaderboard, zero entry fee.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-anim-item flex flex-wrap items-center justify-center gap-3 mt-1">
          <button
            onClick={() => {
              playTactileClick();
              scrollTo("#register");
            }}
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#3b9eff] px-8 py-3.5 text-sm font-semibold text-[#06070a] hover:bg-white transition-all duration-200 shadow-[0_0_24px_rgba(59,158,255,0.4)] hover:shadow-[0_0_36px_rgba(59,158,255,0.6)]"
          >
            <span>Register Free</span>
            <span className="font-mono text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
          <a
            href="https://discord.gg/Q2Z5FSxTG4"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playTactileClick()}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-3.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 backdrop-blur-sm hover:bg-white/[0.04]"
          >
            Join Discord
          </a>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => {
            playTactileClick();
            scrollTo("#about");
          }}
          className="hero-anim-item mt-3 flex flex-col items-center gap-1.5 text-white/25 hover:text-white/60 transition-colors duration-200"
          aria-label="Scroll down"
        >
          <span className="text-[11px] tracking-widest uppercase font-mono">Scroll to explore</span>
          <ArrowDown className="size-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

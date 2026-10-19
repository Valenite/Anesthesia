"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const WORDS = [
  "INITIALIZING SECURE LINK",
  "LOADING TARGET MATRIX",
  "ANESTHESIA ONLINE",
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    let step = 0;
    if (wordRef.current) wordRef.current.textContent = WORDS[0];
    const wordInterval = setInterval(() => {
      step = Math.min(step + 1, WORDS.length - 1);
      if (wordRef.current) wordRef.current.textContent = WORDS[step];
    }, 350);

    const counter = { v: 0 };
    const tl = gsap.timeline();

    tl.to(counter, {
      v: 100,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => setPct(Math.round(counter.v)),
    });

    tl.to(barRef.current, { scaleX: 1, duration: 1.1, ease: "power2.out" }, 0);

    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 0.65,
      ease: "power4.inOut",
      delay: 0.1,
    });

    tl.call(() => {
      clearInterval(wordInterval);
      document.documentElement.style.overflow = "";
      doneRef.current();
    });

    return () => {
      clearInterval(wordInterval);
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[900] flex flex-col justify-between bg-void px-6 py-6 md:px-12 md:py-8 select-none"
    >
      {/* Background blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,158,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,158,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top Header */}
      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-[0.35em] text-fog">
        <span className="flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-acid shadow-[0_0_8px_#3b9eff]" />
          ANESTHESIA // 2026
        </span>
        <span className="hidden sm:block text-ink/60">CRYPTIC HUNT & CTF</span>
        <span className="text-acid">STATUS: ARMED</span>
      </div>

      {/* Middle Counter */}
      <div className="relative flex items-end justify-between gap-6">
        <div className="mb-4 font-mono text-xs tracking-[0.25em] text-ink/80 md:text-sm">
          <span className="text-acid">[</span>{" "}
          <span ref={wordRef} className="inline-block min-w-[24ch] text-ink font-semibold" />{" "}
          <span className="text-acid">]</span>
        </div>
        <div className="font-display text-[20vw] leading-[0.75] text-ink md:text-[14vw] tracking-tighter">
          {String(pct).padStart(3, "0")}
          <span className="text-acid text-[0.6em] font-mono">%</span>
        </div>
      </div>

      {/* Bottom Progress */}
      <div className="relative">
        <div className="h-[2px] w-full bg-line">
          <div
            ref={barRef}
            className="h-[2px] origin-left scale-x-0 bg-acid shadow-[0_0_12px_#3b9eff]"
            style={{ width: "100%" }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-fog">
          <span>DECRYPT THE UNSEEN</span>
          <span>ONE EVENT · TWO FRONTS</span>
        </div>
      </div>
    </div>
  );
}

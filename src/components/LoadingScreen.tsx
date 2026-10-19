"use client";

import { useEffect, useState } from "react";
import { playSuccessChime } from "@/lib/audio";

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING SUBSYSTEMS...");

  useEffect(() => {
    // Check if already shown in this session
    const seen = sessionStorage.getItem("anesthesia_loader_seen");
    if (seen === "true") {
      setHidden(true);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          playSuccessChime();
          setTimeout(() => {
            setHidden(true);
            sessionStorage.setItem("anesthesia_loader_seen", "true");
            onComplete?.();
          }, 350);
          return 100;
        }

        const jump = Math.floor(Math.random() * 12) + 4;
        const next = Math.min(prev + jump, 100);

        if (next > 75) {
          setStatusText("ARENA READY · ACCESS GRANTED");
        } else if (next > 45) {
          setStatusText("LOADING CTF & CIPHER MATRICES...");
        } else if (next > 20) {
          setStatusText("ESTABLISHING CRYPTX SECURE UPLINK...");
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setHidden(true);
    sessionStorage.setItem("anesthesia_loader_seen", "true");
    onComplete?.();
  };

  if (hidden) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#06070a] p-8 md:p-14 transition-opacity duration-500 select-none ${
        progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Header */}
      <div className="flex w-full max-w-5xl items-center justify-between text-xs font-mono uppercase tracking-widest text-white/40">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#3b9eff] animate-pulse" />
          Anesthesia Protocol
        </span>
        <button
          onClick={handleSkip}
          className="text-white/30 hover:text-white transition-colors"
        >
          [ Skip Intro ]
        </button>
      </div>

      {/* Center Wordmark & Count */}
      <div className="flex flex-col items-center text-center my-auto">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.2em] text-white uppercase">
          ANESTHESIA
        </h1>
        <p className="mt-3 text-xs sm:text-sm font-mono tracking-widest text-[#3b9eff] uppercase">
          Cryptic Hunt & CTF · 2026
        </p>

        {/* Counter */}
        <div className="mt-12 font-display text-6xl sm:text-8xl font-semibold tabular-nums text-white tracking-tight">
          {String(progress).padStart(2, "0")}
          <span className="text-2xl text-white/30 font-mono">%</span>
        </div>

        {/* Status text */}
        <p className="mt-4 text-xs font-mono tracking-wider text-white/40 uppercase">
          {statusText}
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-md flex flex-col items-center gap-3">
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#3b9eff] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
}

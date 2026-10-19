"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scrollTo } from "@/lib/lenis";

const LINKS = [
  { label: "About", hash: "#about" },
  { label: "Format", hash: "#format" },
  { label: "Dossier", hash: "#dossier" },
  { label: "Cipher", hash: "#warmup" },
  { label: "Prizes", hash: "#prizes" },
  { label: "Team", hash: "#team" },
  { label: "FAQ", hash: "#faq" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (hash: string) => {
    setOpen(false);
    scrollTo(hash);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#06070a]/95 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* Brand */}
          <button
            onClick={() => scrollTo(0)}
            className="font-display text-base font-semibold tracking-[0.18em] text-white uppercase hover:text-[#3b9eff] transition-colors duration-200"
          >
            ANESTHESIA
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <button
                key={l.hash}
                onClick={() => go(l.hash)}
                className="text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/Q2Z5FSxTG4"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              Discord
            </a>
            <button
              onClick={() => go("#register")}
              className="rounded-full bg-[#3b9eff] px-5 py-1.5 text-sm font-semibold text-[#06070a] hover:bg-white transition-colors duration-200"
            >
              Register
            </button>
            {/* Mobile burger */}
            <button
              onClick={() => setOpen(!open)}
              className="flex md:hidden flex-col gap-1.5 p-1"
              aria-label="Menu"
            >
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${open ? "-translate-y-[10px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#06070a] transition-all duration-500 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center h-full px-8 gap-6">
          {LINKS.map((l) => (
            <button
              key={l.hash}
              onClick={() => go(l.hash)}
              className="text-left font-display text-4xl font-semibold text-white/80 hover:text-white transition-colors tracking-wide uppercase"
            >
              {l.label}
            </button>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href="https://discord.gg/Q2Z5FSxTG4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center rounded-full border border-white/20 py-3 text-sm text-white/60"
            >
              Join Discord
            </a>
            <button
              onClick={() => go("#register")}
              className="rounded-full bg-[#3b9eff] py-3 text-sm font-bold text-[#06070a]"
            >
              Register Free
            </button>
            <Link href="/admin" className="text-center text-xs text-white/20 mt-2">Admin</Link>
          </div>
        </div>
      </div>
    </>
  );
}

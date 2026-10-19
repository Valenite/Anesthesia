"use client";

import Link from "next/link";
import { scrollTo } from "@/lib/lenis";
import { ArrowUp, ArrowUpRight, Shield } from "lucide-react";

const LINKS = [
  { label: "The Event", hash: "#about" },
  { label: "Structure", hash: "#format" },
  { label: "The Dossier", hash: "#dossier" },
  { label: "Level 0 Cipher", hash: "#warmup" },
  { label: "The Architects", hash: "#team" },
  { label: "Register", hash: "#register" },
  { label: "FAQ", hash: "#faq" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-[#06070a] px-6 pt-20 pb-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12 pb-16 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="md:col-span-6">
            <button
              onClick={() => scrollTo(0)}
              className="font-display text-2xl font-bold tracking-[0.16em] text-white uppercase hover:text-[#3b9eff] transition-colors"
            >
              ANESTHESIA
            </button>
            <p className="mt-4 max-w-md text-sm text-white/50 leading-relaxed font-sans">
              A 48-hour challenge uniting Cryptic Hunt puzzle-solving and Capture The Flag technical exploitation into one unified digital arena. Organized by CryptX.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://discord.gg/Q2Z5FSxTG4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#3b9eff] px-5 py-2 text-xs font-semibold text-[#06070a] hover:bg-white transition-colors"
              >
                Join Official Discord
                <ArrowUpRight className="size-3.5" />
              </a>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-white/40 hover:text-white hover:border-white/20 transition-colors"
              >
                <Shield className="size-3 text-[#3b9eff]" />
                Admin Portal
              </Link>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3">
            <p className="text-xs font-mono tracking-widest text-white/40 uppercase mb-4">
              Navigation
            </p>
            <ul className="grid grid-cols-1 gap-2.5 text-sm text-white/60">
              {LINKS.map((item) => (
                <li key={item.hash}>
                  <button
                    onClick={() => scrollTo(item.hash)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Rules */}
          <div className="md:col-span-3">
            <p className="text-xs font-mono tracking-widest text-white/40 uppercase mb-4">
              Community & Intel
            </p>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="https://discord.gg/Q2Z5FSxTG4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3b9eff] transition-colors inline-flex items-center gap-1.5"
                >
                  Discord Announcements <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#format")}
                  className="hover:text-[#3b9eff] transition-colors"
                >
                  Competition Structure
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#warmup")}
                  className="hover:text-[#3b9eff] transition-colors"
                >
                  Warm-Up Cipher
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#faq")}
                  className="hover:text-[#3b9eff] transition-colors"
                >
                  Rules of Engagement
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Big Wordmark */}
        <div className="py-12 border-b border-white/[0.06] text-center select-none overflow-hidden">
          <p className="font-display text-[clamp(2.5rem,14vw,11rem)] font-bold tracking-[0.1em] text-white/[0.03] leading-none uppercase">
            ANESTHESIA
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-white/40 font-mono">
          <p>© {year} Anesthesia. Organized by CryptX. Combined Cryptic Hunt & CTF.</p>
          <button
            onClick={() => scrollTo(0)}
            className="flex items-center gap-1 text-white/40 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

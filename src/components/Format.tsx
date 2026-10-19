"use client";

import { useState } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { playTactileClick } from "@/lib/audio";

const PHASES = [
  {
    num: "01",
    tag: "T-0 Hours",
    title: "The Simultaneous Drop",
    subtitle: "Two arenas unlock at the same second",
    desc: "Both Cryptic Hunt levels and CTF challenges unlock simultaneously. Your squad receives one shared authentication key that works across both tracks. You can split duties between team members or swarm tough levels together.",
    highlights: ["Unified team credentials", "Zero waiting period between challenges", "Independent progress tracks"],
  },
  {
    num: "02",
    tag: "Track A",
    title: "The Cryptic Hunt",
    subtitle: "Open-web puzzle solving across the internet",
    desc: "A progressive puzzle race of unknown depth. Clues are concealed anywhere on the web: audio spectrograms, hidden HTTP headers, cipher text in public repositories, and subtle steganography. Every solved clue unlocks the next gateway.",
    highlights: ["Lateral thinking & OSINT", "Linear + branching milestones", "Bonus hint tokens available"],
  },
  {
    num: "03",
    tag: "Track B",
    title: "Capture The Flag",
    subtitle: "Hands-on cybersecurity and technical exploitation",
    desc: "Jeopardy-style technical security challenges designed for hackers and builders. Covers web application vulnerabilities, binary exploitation, reverse engineering, cryptography, and forensics with first-blood scoring bonuses.",
    highlights: ["Web, Pwn, Crypto, Forensics", "Dynamic first-blood multipliers", "Dedicated live flag validation"],
  },
  {
    num: "04",
    tag: "Finale",
    title: "The Master Leaderboard",
    subtitle: "One unified score decides the champion",
    desc: "When the 48-hour timer runs out, points from both the Cryptic Hunt and CTF challenges merge into one single master scoreboard. The top squad on the combined leaderboard is crowned the Anesthesia Champion.",
    highlights: ["Aggregated scoring", "Trophies & Master Laurels", "Permanent Hall of Fame placement"],
  },
];

export default function Format() {
  const [active, setActive] = useState<number | null>(0);

  const toggle = (i: number) => {
    playTactileClick();
    setActive(active === i ? null : i);
  };

  return (
    <section id="format" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              Event Structure
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight">
              How Anesthesia works.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed">
            A 48-hour continuous competition designed to test both lateral riddle-solving and raw technical exploitation.
          </p>
        </div>

        {/* Phase List */}
        <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
          {PHASES.map((p, i) => {
            const isOpen = active === i;
            return (
              <div key={p.num} className="transition-colors duration-300">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="group flex w-full items-center justify-between py-7 text-left transition-colors md:py-9"
                >
                  <div className="flex items-baseline gap-6 md:gap-12">
                    <span className="font-mono text-xs sm:text-sm text-white/30 group-hover:text-[#3b9eff] transition-colors">
                      {p.num}
                    </span>
                    <div>
                      <h3
                        className={`font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight transition-colors duration-200 ${
                          isOpen ? "text-[#3b9eff]" : "text-white group-hover:text-white/80"
                        }`}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-white/40 font-sans">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="hidden sm:inline font-mono text-xs text-white/30 tracking-wider">
                      {p.tag}
                    </span>
                    <span
                      className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-[#3b9eff] bg-[#3b9eff]/10 text-[#3b9eff]"
                          : "border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white"
                      }`}
                    >
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 md:grid-cols-12 pl-10 md:pl-20 pr-4">
                      <p className="md:col-span-7 text-sm sm:text-base leading-relaxed text-white/60">
                        {p.desc}
                      </p>
                      <div className="md:col-span-5 flex flex-col justify-center gap-2.5 border-l border-white/[0.08] pl-6">
                        <p className="text-[11px] font-mono tracking-widest text-white/30 uppercase">Key Highlights</p>
                        <ul className="space-y-1.5 text-xs text-white/70">
                          {p.highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2">
                              <span className="size-1 rounded-full bg-[#3b9eff]" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

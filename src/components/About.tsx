"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { KeyRound, Binary, ShieldCheck } from "lucide-react";

const RULES = [
  "The entire internet is fair game — dig deep",
  "Never attack event infrastructure or admin hosts",
  "One squad tackles both tracks interchangeably",
  "Every detail could be a clue — even this page",
];

const STATS = [
  { n: "1", label: "Unified arena" },
  { n: "2", label: "Disciplines" },
  { n: "TBA", label: "Event dates" },
  { n: "₹0", label: "Entry fee" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-in",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="about"
      className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <p className="about-in text-xs tracking-widest text-[#3b9eff] uppercase mb-6">
          The Event
        </p>

        {/* Main copy */}
        <div className="about-in grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight tracking-tight">
              Not two tournaments.<br />One crucible.
            </h2>
            <p className="mt-6 text-white/50 leading-relaxed">
              Anesthesia fuses an open-internet Cryptic Hunt with an adversarial Capture The Flag. Register once as a squad — solo or duo — and unlock both dimensions simultaneously when the event opens.
            </p>
            <p className="mt-4 text-white/40 leading-relaxed">
              Puzzle rabbit holes, steganography, and audio spectrograms compete for your attention alongside binary exploitation, web security flaws, and memory forensics. Points merge on one live leaderboard.
            </p>

            <div className="mt-10 border-t border-white/[0.06] pt-8">
              <p className="text-xs tracking-widest text-white/30 uppercase mb-4">Rules</p>
              <ul className="space-y-3">
                {RULES.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/40">
                    <span className="mt-0.5 text-[#3b9eff] font-mono text-xs shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Track A */}
            <div className="about-in rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 hover:border-white/[0.15] transition-colors duration-300">
              <div className="flex items-center gap-2 text-[#3b9eff] mb-4">
                <KeyRound className="size-4" />
                <span className="text-xs tracking-widest uppercase">Track A</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2">Cryptic Hunt</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Linear and branching open-web puzzles. Clues hidden in source code, audio frequencies, image metadata, and internet history.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Steganography", "OSINT", "Spectrograms", "Ciphers"].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Track B */}
            <div className="about-in rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 hover:border-white/[0.15] transition-colors duration-300">
              <div className="flex items-center gap-2 text-[#3b9eff] mb-4">
                <Binary className="size-4" />
                <span className="text-xs tracking-widest uppercase">Track B</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2">Capture The Flag</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Jeopardy-format adversarial challenges. Web security, binary exploitation, reverse engineering, forensics.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Web Security", "Pwn", "Reversing", "Forensics"].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Unified note */}
            <div className="about-in flex items-center gap-3 rounded-2xl border border-[#3b9eff]/20 bg-[#3b9eff]/[0.04] p-5">
              <ShieldCheck className="size-4 text-[#3b9eff] shrink-0" />
              <p className="text-sm text-white/50">
                One squad key powers both tracks on one scoreboard.
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="about-in mt-20 grid grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4 rounded-2xl overflow-hidden">
          {STATS.map((s) => (
            <div key={s.n} className="bg-[#06070a] p-8 text-center">
              <p className="font-display text-4xl font-semibold text-white md:text-5xl">{s.n}</p>
              <p className="mt-2 text-xs text-white/30 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

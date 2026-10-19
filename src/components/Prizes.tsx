"use client";

import { Trophy, Award, Zap, ArrowUpRight } from "lucide-react";
import { scrollTo } from "@/lib/lenis";

const TIERS = [
  {
    rank: "1st Place",
    title: "Grand Champion",
    tag: "Overall Leaderboard Winner",
    desc: "The highest combined points from both the Cryptic Hunt and CTF tracks.",
    perks: ["Top Master Trophy & Certificate", "Hall of Fame Top Placement", "Grand Prize Allocation (Unveiled T-0)"],
    featured: true,
  },
  {
    rank: "Specialist",
    title: "Track Honors",
    tag: "Cryptic & CTF Firsts",
    desc: "Recognizing outstanding individual track mastery and first-blood speed.",
    perks: ["Fastest Full Cryptic Clear", "CTF First Blood Laurels", "Individual Category Plaques"],
    featured: false,
  },
  {
    rank: "Finalists",
    title: "Top 10 Squads",
    tag: "Mastery Tier",
    desc: "Every squad that survives the deep levels and cracks hardened flags.",
    perks: ["Digital Badges of Honor", "Official Placement Certificates", "Exclusive Discord Roles"],
    featured: false,
  },
];

export default function Prizes() {
  return (
    <section id="prizes" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              The Spoils
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight">
              Prizes & Recognition.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed">
            Specific prize figures and partner awards will be unveiled leading up to the launch date. Bragging rights are immediate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.title}
              className={`rounded-3xl border p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${
                t.featured
                  ? "border-[#3b9eff]/50 bg-gradient-to-b from-[#3b9eff]/[0.08] to-transparent shadow-[0_0_30px_rgba(59,158,255,0.06)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-mono uppercase tracking-widest ${t.featured ? "text-[#3b9eff]" : "text-white/40"}`}>
                    {t.rank}
                  </span>
                  {t.featured && (
                    <span className="rounded-full bg-[#3b9eff] px-3 py-1 text-[10px] font-bold text-[#06070a] uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="font-display text-3xl font-semibold text-white mb-2">
                  {t.title}
                </h3>
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">
                  {t.tag}
                </p>
                <p className="text-sm text-white/60 leading-relaxed mb-8">
                  {t.desc}
                </p>

                <div className="border-t border-white/[0.06] pt-6 space-y-2.5">
                  {t.perks.map((p) => (
                    <div key={p} className="flex items-center gap-2.5 text-xs text-white/70">
                      <span className={`size-1.5 rounded-full ${t.featured ? "bg-[#3b9eff]" : "bg-white/30"}`} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => scrollTo("#register")}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                >
                  Compete for it <ArrowUpRight className="size-3.5 text-[#3b9eff]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

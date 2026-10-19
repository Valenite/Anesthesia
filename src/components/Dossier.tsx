"use client";

import { useEffect, useRef, useState } from "react";
import { useEventDate } from "@/lib/useEventDate";
import { scrollTo } from "@/lib/lenis";
import { ArrowUpRight, Calendar, Users, Shield, Award, Terminal } from "lucide-react";

type Left = { d: number; h: number; m: number; s: number; live: boolean };

function computeLeft(target: Date): Left {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, live: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
    live: false,
  };
}

const SPECS = [
  { icon: Calendar, title: "Dates", value: "To Be Announced", desc: "Official countdown activates once dropped on Discord" },
  { icon: Terminal, title: "Format", value: "Cryptic Hunt + CTF", desc: "Dual disciplines competing on a single scoreboard" },
  { icon: Users, title: "Squad Size", value: "1 or 2 Operators", desc: "Participate solo or team up as a duo with shared dashboard" },
  { icon: Shield, title: "Eligibility", value: "Open to Everyone", desc: "Students, developers, cybersecurity hobbyists & puzzle lovers" },
  { icon: Award, title: "Scoring Engine", value: "Dynamic First-Blood", desc: "Real-time leaderboard with point degradation and instant flag submission" },
  { icon: ArrowUpRight, title: "Headquarters", value: "Official Discord", desc: "Live support, challenge clarifications & announcements" },
];

export default function Dossier() {
  const date = useEventDate();
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    if (!date) return;
    setLeft(computeLeft(date));
    const id = setInterval(() => setLeft(computeLeft(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const countdownUnits = [
    { label: "Days", val: left ? pad(left.d) : "00" },
    { label: "Hours", val: left ? pad(left.h) : "00" },
    { label: "Minutes", val: left ? pad(left.m) : "00" },
    { label: "Seconds", val: left ? pad(left.s) : "00" },
  ];

  return (
    <section id="dossier" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              Event Specifications
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight">
              The Dossier.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed">
            Everything confirmed about Anesthesia so far. Registration is live; official launch date drops soon.
          </p>
        </div>

        {/* Countdown Box */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.06]">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-white/40 uppercase">
                <span className="size-2 rounded-full bg-[#3b9eff] animate-pulse" />
                Launch Status: Standby for Official Date Announcement
              </span>
            </div>
            <a
              href="https://discord.gg/Q2Z5FSxTG4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#3b9eff] hover:text-white transition-colors"
            >
              Get notified on Discord <ArrowUpRight className="size-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 text-center">
            {countdownUnits.map((u) => (
              <div key={u.label} className="flex flex-col items-center">
                <span className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight tabular-nums">
                  {u.val}
                </span>
                <span className="mt-2 text-xs font-mono uppercase tracking-widest text-white/40">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/[0.15] transition-colors duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-[#3b9eff]">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                    {s.title}
                  </span>
                </div>
                <p className="text-lg font-semibold text-white mb-1.5">{s.value}</p>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

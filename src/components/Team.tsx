"use client";

import { ArrowUpRight, Github, Disc as DiscordIcon, Shield, Code, Brain } from "lucide-react";

const TEAM = [
  {
    name: "Aarav Sharma",
    role: "Lead Architect & CryptX Core",
    focus: "Overall Hunt Director & Web Exploits",
    handle: "aarav_cryptx",
    icon: Shield,
  },
  {
    name: "Rohan Varma",
    role: "Lead Cryptic Author",
    focus: "Steganography, Audio Spectrograms & OSINT",
    handle: "rohan_osint",
    icon: Brain,
  },
  {
    name: "Kabir Mehta",
    role: "CTF Challenge Engineer",
    focus: "Binary Exploitation (Pwn) & Reverse Engineering",
    handle: "kabir_pwn",
    icon: Code,
  },
  {
    name: "Devina Roy",
    role: "Infrastructure & Platform Lead",
    focus: "Scoreboard Engine, Anti-Cheat & Docker Sandboxes",
    handle: "devina_infra",
    icon: Shield,
  },
];

export default function Team() {
  return (
    <section id="team" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              The Architects
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight">
              Behind Anesthesia.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed">
            Crafted by the CryptX collective — security researchers, riddle fanatics, and engineers building the ultimate test of digital skill.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => {
            const Icon = member.icon;
            return (
              <div
                key={member.name}
                className="group rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.04]"
              >
                {/* Header Icon / Avatar frame */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.04] text-[#3b9eff] group-hover:scale-105 group-hover:bg-[#3b9eff]/10 transition-all">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] text-white/30 uppercase tracking-wider">
                    CryptX
                  </span>
                </div>

                {/* Details */}
                <h3 className="font-display text-2xl font-semibold text-white mb-1 group-hover:text-[#3b9eff] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-mono text-[#3b9eff]/80 uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  {member.focus}
                </p>

                {/* Footer handle */}
                <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                  <span>@{member.handle}</span>
                  <a
                    href="https://discord.gg/Q2Z5FSxTG4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Bar */}
        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-xl font-semibold text-white">
              Want to contribute or collaborate?
            </h4>
            <p className="text-xs sm:text-sm text-white/50 mt-1">
              We&apos;re open to challenge writers, beta testers, and community partners.
            </p>
          </div>
          <a
            href="https://discord.gg/Q2Z5FSxTG4"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white hover:border-[#3b9eff] hover:text-[#3b9eff] transition-colors shrink-0"
          >
            Connect on Discord →
          </a>
        </div>
      </div>
    </section>
  );
}

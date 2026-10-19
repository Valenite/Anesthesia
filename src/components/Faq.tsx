"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { playTactileClick } from "@/lib/audio";

const FAQS = [
  {
    q: "What is Anesthesia?",
    a: "Anesthesia is one unified online competition uniting an open-internet Cryptic Hunt and an adversarial Capture The Flag (CTF). You don't choose between tracks — your squad tackles both riddle-solving and security exploits simultaneously under a single unified leaderboard.",
  },
  {
    q: "How do squads work?",
    a: "Squads can consist of 1 or 2 participants (solo or duo). You share a single dashboard and an authenticated squad key. You can solve together or divide and conquer across the Cryptic and CTF tracks.",
  },
  {
    q: "When will Anesthesia take place?",
    a: "The dates are currently To Be Announced (TBA). Official launch dates, briefing schedules, and countdown alerts will be dropped directly in our official Discord server. Pre-register now so your squad is locked in.",
  },
  {
    q: "What is the cost of participation?",
    a: "Participation is completely free (₹0). There are no registration fees, paywalled hints, or hidden costs. Every participant gets an equal playing field.",
  },
  {
    q: "What can I expect in the Cryptic Hunt track?",
    a: "An open-internet puzzle race of classified depth. Clues are embedded across the internet: hidden audio frequencies, steganography, developer comments in public commits, and deep web sleuthing. Every answer unlocks the next level.",
  },
  {
    q: "What can I expect in the CTF track?",
    a: "A jeopardy-style cybersecurity tournament covering Web Security, Reverse Engineering, Binary Exploitation (Pwn), Cryptanalysis, and Digital Forensics with dynamic first-blood score multipliers.",
  },
  {
    q: "Do I need prior hacking experience?",
    a: "Not necessarily. For the Cryptic Hunt, intuition, curiosity, and elite search skills matter most. For the CTF, while experienced players will find challenging high-point flags, there are beginner-friendly entry-level challenges for newcomers.",
  },
  {
    q: "Where does official communication happen?",
    a: "Everything happens on our official Discord server (discord.gg/Q2Z5FSxTG4) — challenge hints, bot alerts, clarifications, team matching, and live support from organizers.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => {
    playTactileClick();
    setOpen(open === i ? null : i);
  };

  return (
    <section id="faq" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              FAQ
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
              Frequently asked questions.
            </h2>
            <p className="mt-5 text-sm sm:text-base text-white/50 leading-relaxed">
              Have something else on your mind? Drop into our Discord community to speak with the organizers directly.
            </p>

            <div className="mt-8">
              <a
                href="https://discord.gg/Q2Z5FSxTG4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-mono uppercase tracking-wider text-white hover:border-[#3b9eff] hover:text-[#3b9eff] transition-colors"
              >
                Ask on Discord →
              </a>
            </div>
          </div>

          {/* Right Accordion */}
          <div className="lg:col-span-7 border-t border-white/[0.08] divide-y divide-white/[0.08]">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q} className="py-6 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                  >
                    <span
                      className={`text-base sm:text-lg font-medium transition-colors ${
                        isOpen ? "text-[#3b9eff]" : "text-white hover:text-white/80"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                        isOpen
                          ? "border-[#3b9eff] bg-[#3b9eff]/10 text-[#3b9eff]"
                          : "border-white/10 text-white/40"
                      }`}
                    >
                      {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pt-4" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-white/60">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

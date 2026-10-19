"use client";

import { useState } from "react";
import { playTactileClick, playSuccessChime } from "@/lib/audio";
import { Check, Copy, HelpCircle, ArrowRight, Lock, Unlock } from "lucide-react";

const ENCODED = "YIVXZS";
const ANSWER = "BREACH";
const CODE = "BREACH-10";

export default function Cipher() {
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const guess = input.trim().toUpperCase();
    if (!guess) return;

    playTactileClick();
    if (guess === ANSWER) {
      setSolved(true);
      setError(false);
      playSuccessChime();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const copyCode = async () => {
    playTactileClick();
    try {
      await navigator.clipboard.writeText(CODE);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CODE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="warmup" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5">
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              Level Zero
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
              A taste of what&apos;s waiting for you.
            </h2>
            <p className="mt-5 text-sm sm:text-base text-white/50 leading-relaxed">
              Every hunt starts before the official clock begins. Crack this sample transmission, grab the unlock token, and paste it during registration to start with a bonus hint token in your squad wallet.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setShowHint(!showHint);
                }}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-[#3b9eff] transition-colors"
              >
                <HelpCircle className="size-4" />
                {showHint ? "Hide Hint" : "Need a hint?"}
              </button>

              {showHint && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/60 font-mono leading-relaxed">
                  <span className="text-[#3b9eff] font-semibold">Hint:</span> Classic Atbash substitution cipher (A ⇋ Z, B ⇋ Y, C ⇋ X...).
                </div>
              )}
            </div>
          </div>

          {/* Right Interactive Box */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12">
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  {solved ? (
                    <Unlock className="size-4 text-[#3b9eff]" />
                  ) : (
                    <Lock className="size-4 text-white/40" />
                  )}
                  <span className="text-xs font-mono tracking-wider uppercase text-white/40">
                    Transmission Cipher
                  </span>
                </div>
                <span className="text-xs font-mono text-[#3b9eff]">
                  {solved ? "Decrypted" : "Encrypted"}
                </span>
              </div>

              {!solved ? (
                <div className="py-8">
                  <div className="text-center py-6">
                    <p className="text-xs font-mono tracking-widest text-white/30 uppercase mb-3">
                      Ciphertext
                    </p>
                    <div className="flex justify-center items-center gap-3">
                      {ENCODED.split("").map((char, idx) => (
                        <span
                          key={idx}
                          className="flex size-12 sm:size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] font-mono text-2xl font-bold text-white shadow-sm"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value.toUpperCase())}
                      placeholder="ENTER DECRYPTED WORD"
                      maxLength={12}
                      className={`flex-1 rounded-full border bg-white/[0.03] px-6 py-3.5 text-center font-mono text-sm tracking-widest text-white placeholder:text-white/20 focus:outline-none transition-colors ${
                        error
                          ? "border-red-500/80 bg-red-500/10"
                          : "border-white/10 focus:border-[#3b9eff]"
                      }`}
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#3b9eff] px-8 py-3.5 text-sm font-semibold text-[#06070a] hover:bg-white transition-colors shrink-0"
                    >
                      Verify Key
                    </button>
                  </form>

                  {error && (
                    <p className="mt-3 text-center text-xs text-red-400 font-mono">
                      Incorrect key. Check the cipher hint and try again.
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#3b9eff]/10 text-[#3b9eff] mb-4">
                    <Check className="size-7" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                    Cipher Solved.
                  </h3>
                  <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto">
                    Here is your bonus code. Enter this in the registration form to credit 1 hint token to your squad.
                  </p>

                  <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#3b9eff]/40 bg-[#3b9eff]/10 px-6 py-2.5">
                    <span className="font-mono text-base font-bold text-[#3b9eff] tracking-widest">
                      {CODE}
                    </span>
                    <button
                      type="button"
                      onClick={copyCode}
                      className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
                      title="Copy code"
                    >
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

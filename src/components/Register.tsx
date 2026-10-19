"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { playTactileClick, playSuccessChime } from "@/lib/audio";
import {
  ArrowRight,
  Check,
  Copy,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  Users,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

type RegForm = {
  teamName: string;
  size: number;
  leader: string;
  email: string;
  phone: string;
  college: string;
  code: string;
  agree: boolean;
};

type JoinForm = {
  teamCode: string;
  name: string;
  email: string;
  phone: string;
  college: string;
};

type SavedReg = {
  teamName: string;
  size: number;
  teamCode: string;
  bonus: boolean;
  role?: "leader" | "teammate";
  leaderName?: string;
  memberName?: string;
};

const KEY = "anesthesia_registration_v1";
const STEPS = ["Squad Identity", "Lead Contact", "Confirmation"];
const SIZES = [
  { v: 1, l: "Solo", d: "1 Operator" },
  { v: 2, l: "Duo", d: "2 Operators (Recommended)" },
];

const initialForm: RegForm = {
  teamName: "",
  size: 2,
  leader: "",
  email: "",
  phone: "",
  college: "",
  code: "",
  agree: false,
};

const initialJoinForm: JoinForm = {
  teamCode: "",
  name: "",
  email: "",
  phone: "",
  college: "",
};

function validate(step: number, f: RegForm) {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (f.teamName.trim().length < 3) e.teamName = "Minimum 3 characters required";
    else if (!/^[A-Z0-9 _\-&]+$/i.test(f.teamName.trim()))
      e.teamName = "Letters, numbers, spaces, - _ & only";
  }
  if (step === 1) {
    if (f.leader.trim().length < 3) e.leader = "Full name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      e.email = "Valid email required for access key";
    if (!/^[+\d][\d\s-]{7,14}$/.test(f.phone.trim()))
      e.phone = "8–15 digits (include country code)";
    if (f.college.trim().length < 2) e.college = "Institution or affiliation required";
  }
  if (step === 2 && !f.agree) e.agree = "Please agree to the event code of conduct";
  return e;
}

function validateJoin(f: JoinForm) {
  const e: Record<string, string> = {};
  if (!f.teamCode.trim() || f.teamCode.trim().length < 5) {
    e.teamCode = "Valid Squad Key required (e.g. AN-XXXXX)";
  }
  if (f.name.trim().length < 3) e.name = "Full name required (minimum 3 characters)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Valid email address required";
  if (!/^[+\d][\d\s-]{7,14}$/.test(f.phone.trim())) e.phone = "8–15 digits required";
  if (f.college.trim().length < 2) e.college = "Institution or affiliation required";
  return e;
}

/* ---------- Finalized Confirmed Squad Passport ---------- */
function ConfirmedPassport({
  reg,
  onReset,
}: {
  reg: SavedReg;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const sizeLabel = reg.size === 1 ? "Solo" : "Duo";

  const copy = async () => {
    playTactileClick();
    try {
      await navigator.clipboard.writeText(reg.teamCode);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = reg.teamCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl border border-[#3b9eff]/40 bg-gradient-to-b from-[#0e1422] to-[#07090e] p-8 md:p-12 shadow-[0_20px_60px_rgba(59,158,255,0.12)]">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3b9eff] flex items-center gap-2">
            <ShieldCheck className="size-4" />
            {reg.role === "teammate" ? "Enlistment Verified (Operator 2)" : "Squad Registration Confirmed"}
          </span>
          <h3 className="mt-2 font-display text-3xl sm:text-4xl text-white font-semibold uppercase tracking-tight">
            {reg.teamName}
          </h3>
        </div>
        <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-xs text-white">
          {sizeLabel}
        </span>
      </div>

      {/* Access Key Display */}
      <div className="my-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/40 block mb-2">
          Your Master Squad Key
        </span>
        <div className="font-mono text-3xl sm:text-4xl font-bold tracking-widest text-white my-2">
          {reg.teamCode}
        </div>
        <p className="mt-2 text-xs text-white/50">
          Save this code. You will need it to authenticate on event day.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-mono text-xs font-bold uppercase text-[#06070a] hover:bg-[#3b9eff] transition-colors"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied to Clipboard" : "Copy Squad Key"}</span>
          </button>

          <a
            href="https://discord.gg/Q2Z5FSxTG4"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playTactileClick()}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 font-mono text-xs font-medium uppercase text-white hover:border-[#3b9eff] hover:text-[#3b9eff] transition-colors"
          >
            <span>Join Discord for Dates</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Perks summary */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-6 text-xs">
        <div>
          <span className="text-white/40 block font-mono">Squad Status</span>
          <span className="text-white font-semibold mt-0.5 block">
            {reg.role === "teammate" ? "Squad Full (2/2 Operators)" : "Enlisted Ready"}
          </span>
        </div>
        <div>
          <span className="text-white/40 block font-mono">Hint Tokens</span>
          <span className="text-[#3b9eff] font-semibold mt-0.5 block">
            {reg.bonus ? "1 Bonus Token Credited" : "Default Starter Tokens"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-6 text-xs text-white/40">
        <span>Screenshot or save this key</span>
        <button
          onClick={() => {
            playTactileClick();
            onReset();
          }}
          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
        >
          <RotateCcw className="size-3" />
          <span>Register or join another</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Registration & Join Component ---------- */
export default function Register() {
  const [mode, setMode] = useState<"create" | "join">("create");

  // Create Form State
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<SavedReg | null>(null);

  // Join Form State
  const [joinForm, setJoinForm] = useState<JoinForm>(initialJoinForm);
  const [joinErrors, setJoinErrors] = useState<Record<string, string>>({});
  const [joinBusy, setJoinBusy] = useState(false);
  const [verifiedSquad, setVerifiedSquad] = useState<{
    teamName: string;
    leader: string;
    isFull: boolean;
  } | null>(null);
  const [checkingSquad, setCheckingSquad] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // storage unavailable
    }
  }, []);

  useEffect(() => {
    if (!stepRef.current || saved) return;
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [step, mode, saved]);

  const shake = () => {
    gsap.fromTo(
      panelRef.current,
      { x: 0 },
      { keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }], duration: 0.35 },
    );
  };

  const set = (k: keyof RegForm, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setJ = (k: keyof JoinForm, v: string) =>
    setJoinForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    playTactileClick();
    const errs = validate(step, form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      shake();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => {
    playTactileClick();
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submitCreate = async () => {
    playTactileClick();
    const all = { ...validate(0, form), ...validate(1, form), ...validate(2, form) };
    setErrors(all);
    if (Object.keys(all).length) {
      shake();
      if (validate(0, form).teamName) setStep(0);
      else if (Object.keys(validate(1, form)).length) setStep(1);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        throw new Error("Connection failed. Please retry.");
      }

      if (!res.ok || !json.ok) {
        if (res.status === 409) {
          const dupName = String(json.error).includes("SQUAD NAME");
          setStep(dupName ? 0 : 1);
          setErrors(dupName ? { teamName: json.error } : { email: json.error });
          shake();
          return;
        }
        throw new Error(json.error || "Registration failed");
      }

      const reg: SavedReg = {
        teamName: form.teamName.trim().toUpperCase(),
        size: form.size,
        teamCode: json.teamCode,
        bonus: Boolean(json.bonus),
        role: "leader",
        leaderName: form.leader,
      };

      try {
        localStorage.setItem(KEY, JSON.stringify(reg));
      } catch {
        // ignore
      }

      playSuccessChime();
      setSaved(reg);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Submission error" });
      shake();
    } finally {
      setBusy(false);
    }
  };

  // Check Squad Code for Join
  const verifySquadCode = async (code: string) => {
    if (!code || code.length < 5) {
      setVerifiedSquad(null);
      return;
    }
    setCheckingSquad(true);
    try {
      const res = await fetch(`/api/team/join?code=${encodeURIComponent(code)}`);
      const json = await res.json();
      if (res.ok && json.ok && json.squad) {
        setVerifiedSquad(json.squad);
        setJoinErrors((prev) => {
          const n = { ...prev };
          delete n.teamCode;
          return n;
        });
      } else {
        setVerifiedSquad(null);
        setJoinErrors((prev) => ({
          ...prev,
          teamCode: json.error || "No squad found with this code",
        }));
      }
    } catch {
      setVerifiedSquad(null);
    } finally {
      setCheckingSquad(false);
    }
  };

  const submitJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    const errs = validateJoin(joinForm);
    setJoinErrors(errs);
    if (Object.keys(errs).length) {
      shake();
      return;
    }

    setJoinBusy(true);
    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joinForm),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        throw new Error("Connection failed. Please retry.");
      }

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Failed to join squad");
      }

      const reg: SavedReg = {
        teamName: json.teamName,
        size: 2,
        teamCode: json.teamCode,
        bonus: Boolean(json.bonus),
        role: "teammate",
        leaderName: json.leader,
        memberName: joinForm.name,
      };

      try {
        localStorage.setItem(KEY, JSON.stringify(reg));
      } catch {
        // ignore
      }

      playSuccessChime();
      setSaved(reg);
    } catch (err) {
      setJoinErrors({ form: err instanceof Error ? err.message : "Join failed" });
      shake();
    } finally {
      setJoinBusy(false);
    }
  };

  const reset = () => {
    playTactileClick();
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setSaved(null);
    setForm(initialForm);
    setJoinForm(initialJoinForm);
    setVerifiedSquad(null);
    setErrors({});
    setJoinErrors({});
    setStep(0);
  };

  return (
    <section id="register" className="border-t border-white/[0.06] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-widest text-[#3b9eff] uppercase font-mono mb-3">
              Enlistment
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight">
              Squad Portal.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed">
            Create a new squad or join your teammate using their squad key. Max 2 operators per team.
          </p>
        </div>

        {saved ? (
          <ConfirmedPassport reg={saved} onReset={reset} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Form Box */}
            <div
              ref={panelRef}
              className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10"
            >
              {/* Mode Switcher Tabs */}
              <div className="flex rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setMode("create");
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                    mode === "create"
                      ? "bg-[#3b9eff] text-[#06070a] shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Users className="size-3.5" />
                  Create Squad
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setMode("join");
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                    mode === "join"
                      ? "bg-[#3b9eff] text-[#06070a] shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <UserPlus className="size-3.5" />
                  Join With Code
                </button>
              </div>

              {/* Mode: CREATE */}
              {mode === "create" ? (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                      Step {step + 1} of 3: <span className="text-white font-semibold">{STEPS[step]}</span>
                    </span>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === step ? "w-6 bg-[#3b9eff]" : i < step ? "w-3 bg-white/40" : "w-3 bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Form Content */}
                  <div ref={stepRef} className="space-y-6">
                    {step === 0 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                            Squad / Team Name
                          </label>
                          <input
                            value={form.teamName}
                            onChange={(e) => set("teamName", e.target.value.toUpperCase())}
                            maxLength={24}
                            placeholder="e.g. CIPHERPUNKS"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm font-mono text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                          />
                          {errors.teamName && (
                            <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                              <AlertCircle className="size-3.5 shrink-0" />
                              <span>{errors.teamName}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                            Squad Size
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {SIZES.map((s) => {
                              const active = form.size === s.v;
                              return (
                                <button
                                  key={s.v}
                                  type="button"
                                  onClick={() => {
                                    playTactileClick();
                                    set("size", s.v);
                                  }}
                                  className={`rounded-2xl border p-4 text-left transition-all ${
                                    active
                                      ? "border-[#3b9eff] bg-[#3b9eff]/10 text-white"
                                      : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
                                  }`}
                                >
                                  <span className="font-semibold block text-base">{s.l}</span>
                                  <span className="text-xs text-white/40 mt-0.5 block">{s.d}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                            Squad Leader Name
                          </label>
                          <input
                            value={form.leader}
                            onChange={(e) => set("leader", e.target.value)}
                            placeholder="Your full name"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                          />
                          {errors.leader && (
                            <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                              <AlertCircle className="size-3.5 shrink-0" />
                              <span>{errors.leader}</span>
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => set("email", e.target.value)}
                              placeholder="lead@email.com"
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                            />
                            {errors.email && (
                              <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                                <AlertCircle className="size-3.5 shrink-0" />
                                <span>{errors.email}</span>
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                              WhatsApp / Phone
                            </label>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => set("phone", e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                            />
                            {errors.phone && (
                              <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                                <AlertCircle className="size-3.5 shrink-0" />
                                <span>{errors.phone}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                            Institution / Affiliation
                          </label>
                          <input
                            value={form.college}
                            onChange={(e) => set("college", e.target.value)}
                            placeholder="College name, company, or independent"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                          />
                          {errors.college && (
                            <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                              <AlertCircle className="size-3.5 shrink-0" />
                              <span>{errors.college}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                            Warm-Up Bonus Code (Optional)
                          </label>
                          <input
                            value={form.code}
                            onChange={(e) => set("code", e.target.value.toUpperCase())}
                            placeholder="ENTER SOLVED CIPHER (E.G. BREACH-10)"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 font-mono text-sm tracking-wider text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors uppercase"
                          />
                          {form.code.trim().toUpperCase() === "BREACH-10" && (
                            <p className="mt-2 text-xs text-[#3b9eff] font-mono flex items-center gap-1.5">
                              <Sparkles className="size-3.5" />
                              <span>Code verified: +1 Bonus Hint Token unlocked!</span>
                            </p>
                          )}
                        </div>

                        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 cursor-pointer hover:border-white/20 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.agree}
                            onChange={(e) => set("agree", e.target.checked)}
                            className="mt-1 size-4 rounded border-white/20 bg-transparent text-[#3b9eff] focus:ring-0"
                          />
                          <span className="text-xs text-white/60 leading-relaxed">
                            I confirm our squad will respect fair play rules, refrain from attacking event infrastructure, and compete honorably.
                          </span>
                        </label>
                        {errors.agree && (
                          <p className="text-xs text-red-400 font-mono flex items-center gap-1.5">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.agree}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {errors.form && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{errors.form}</span>
                      </div>
                    )}

                    {/* Nav buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={prev}
                          className="text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <ArrowRight className="size-3.5 rotate-180" />
                          <span>Back</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < 2 ? (
                        <button
                          type="button"
                          onClick={next}
                          className="rounded-full bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider text-[#06070a] hover:bg-[#3b9eff] transition-colors flex items-center gap-2"
                        >
                          <span>Continue</span>
                          <ArrowRight className="size-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={submitCreate}
                          disabled={busy}
                          className="rounded-full bg-[#3b9eff] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#06070a] hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>{busy ? "Registering…" : "Complete Registration"}</span>
                          <ArrowRight className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Mode: JOIN SQUAD */
                <form onSubmit={submitJoin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Squad Key (Shared by your Leader)
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={joinForm.teamCode}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setJ("teamCode", val);
                          if (val.length >= 6) {
                            verifySquadCode(val);
                          }
                        }}
                        onBlur={() => verifySquadCode(joinForm.teamCode)}
                        placeholder="e.g. AN-W03I1"
                        maxLength={12}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm font-mono tracking-wider text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => verifySquadCode(joinForm.teamCode)}
                        disabled={checkingSquad || !joinForm.teamCode}
                        className="rounded-2xl border border-white/15 px-5 text-xs font-mono uppercase text-white/80 hover:border-[#3b9eff] hover:text-[#3b9eff] transition-colors shrink-0 disabled:opacity-40"
                      >
                        {checkingSquad ? "Verifying…" : "Verify"}
                      </button>
                    </div>

                    {joinErrors.teamCode && (
                      <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{joinErrors.teamCode}</span>
                      </p>
                    )}

                    {verifiedSquad && (
                      <div className="mt-3 rounded-2xl border border-[#3b9eff]/30 bg-[#3b9eff]/[0.08] p-4 text-xs font-mono flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-xl bg-[#3b9eff]/20 text-[#3b9eff]">
                            <ShieldCheck className="size-4" />
                          </div>
                          <div>
                            <p className="text-white font-bold">{verifiedSquad.teamName}</p>
                            <p className="text-white/50 text-[11px]">Leader: {verifiedSquad.leader}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ${
                          verifiedSquad.isFull ? "bg-red-500/20 text-red-400" : "bg-[#3b9eff]/20 text-[#3b9eff]"
                        }`}>
                          {verifiedSquad.isFull ? (
                            <>
                              <AlertTriangle className="size-3" />
                              <span>Squad Full (2/2)</span>
                            </>
                          ) : (
                            <>
                              <Users className="size-3" />
                              <span>1 Open Slot</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Your Full Name
                    </label>
                    <input
                      value={joinForm.name}
                      onChange={(e) => setJ("name", e.target.value)}
                      placeholder="Teammate name"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                    />
                    {joinErrors.name && (
                      <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{joinErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        value={joinForm.email}
                        onChange={(e) => setJ("email", e.target.value)}
                        placeholder="teammate@email.com"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                      />
                      {joinErrors.email && (
                        <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{joinErrors.email}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                        WhatsApp / Phone
                      </label>
                      <input
                        type="tel"
                        value={joinForm.phone}
                        onChange={(e) => setJ("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                      />
                      {joinErrors.phone && (
                        <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{joinErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Institution / Affiliation
                    </label>
                    <input
                      value={joinForm.college}
                      onChange={(e) => setJ("college", e.target.value)}
                      placeholder="College or independent"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-[#3b9eff] focus:outline-none transition-colors"
                    />
                    {joinErrors.college && (
                      <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{joinErrors.college}</span>
                      </p>
                    )}
                  </div>

                  {joinErrors.form && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{joinErrors.form}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/[0.06] flex justify-end">
                    <button
                      type="submit"
                      disabled={joinBusy || Boolean(verifiedSquad?.isFull)}
                      className="rounded-full bg-[#3b9eff] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#06070a] hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <span>{joinBusy ? "Joining Squad…" : "Join Squad as Operator 2"}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Live Squad Card Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/30 block mb-6">
                  Live Pass Preview
                </span>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <span className="font-display text-xs tracking-widest text-[#3b9eff] uppercase font-semibold">
                      Anesthesia 2026
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase">
                      {mode === "create" ? (form.size === 1 ? "Solo" : "Duo") : "Duo (Joining)"}
                    </span>
                  </div>

                  <div className="py-6">
                    <p className="text-[11px] font-mono text-white/30 uppercase">Squad</p>
                    <h3 className="font-display text-2xl font-semibold text-white uppercase break-words mt-1">
                      {mode === "create"
                        ? form.teamName.trim() || "Your Squad Name"
                        : verifiedSquad?.teamName || "Existing Squad"}
                    </h3>
                  </div>

                  <div className="space-y-2 border-t border-white/[0.06] pt-4 text-xs font-mono text-white/50">
                    <div className="flex justify-between">
                      <span className="text-white/30">Leader:</span>
                      <span className="text-white">
                        {mode === "create"
                          ? form.leader || "—"
                          : verifiedSquad?.leader || "Leader on record"}
                      </span>
                    </div>
                    {mode === "join" && (
                      <div className="flex justify-between">
                        <span className="text-white/30">Operator 2:</span>
                        <span className="text-[#3b9eff]">{joinForm.name || "You"}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/30">Entry:</span>
                      <span className="text-[#3b9eff] font-bold">Free (₹0)</span>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-xs text-white/40 leading-relaxed text-center">
                  {mode === "create"
                    ? "Your official squad access key will be generated once you submit."
                    : "Enter your team leader's squad key to join their roster (max 2 members)."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

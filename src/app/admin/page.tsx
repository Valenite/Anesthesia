"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import {
  ArrowDownUp,
  Check,
  Copy,
  Download,
  LockKeyhole,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

const KEY_STORE = "anesthesia_admin_key";

type Reg = {
  id: number;
  teamName: string;
  size: number;
  leader: string;
  email: string;
  phone: string;
  college: string;
  code: string;
  bonus: boolean;
  teamCode: string;
  createdAt: string;
};

type Stats = {
  total: number;
  hunters: number;
  solo: number;
  duo: number;
  bonus: number;
  last24h: number;
  colleges: { name: string; count: number }[];
  trend: { day: string; count: number }[];
};

type Filter = "ALL" | "SOLO" | "DUO" | "BONUS";
type SortKey = "NEWEST" | "OLDEST" | "NAME";

const INPUT =
  "w-full border-b border-line bg-transparent py-3 font-mono text-sm tracking-[0.12em] text-ink placeholder:text-fog/40 transition-colors focus:border-acid focus:outline-none";

function fmt(d: string, withTime = false) {
  const dt = new Date(d);
  const date = dt
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    .toUpperCase();
  if (!withTime) return date;
  return `${date} · ${dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

/* ---------------- Stat Tile ---------------- */
function Tile({
  value,
  label,
  accent = false,
}: {
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (typeof value !== "number" || !ref.current) return;
    const from = prev.current ?? 0;
    prev.current = value;
    const obj = { v: from };
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = String(Math.round(obj.v));
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <div className="group border-line p-5 transition-colors duration-300 hover:bg-panel md:p-6">
      <p
        ref={ref}
        className={`font-display text-4xl tabular-nums leading-none tracking-tight md:text-5xl ${
          accent ? "text-acid" : "text-ink"
        }`}
      >
        {typeof value === "number" ? 0 : value}
      </p>
      <p className="mt-3 font-mono text-[9px] tracking-[0.3em] text-fog transition-colors group-hover:text-acid">
        {label}
      </p>
    </div>
  );
}

export default function AdminPage() {
  /* -------- Auth -------- */
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const gateRef = useRef<HTMLDivElement>(null);

  /* -------- Data -------- */
  const [regs, setRegs] = useState<Reg[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sort, setSort] = useState<SortKey>("NEWEST");
  const [open, setOpen] = useState<Reg | null>(null);
  const [armedId, setArmedId] = useState<number | null>(null);
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState("");

  const shake = useCallback((el: HTMLElement | null) => {
    gsap.fromTo(
      el,
      { x: 0 },
      { keyframes: [{ x: -8 }, { x: 8 }, { x: -5 }, { x: 5 }, { x: 0 }], duration: 0.4 },
    );
  }, []);

  const load = useCallback(async (k: string) => {
    setSyncing(true);
    try {
      const res = await fetch("/api/registrations", {
        headers: { "x-admin-key": k },
        cache: "no-store",
      });
      if (res.status === 401) {
        sessionStorage.removeItem(KEY_STORE);
        setAuthed(false);
        return;
      }
      const json = await res.json();
      if (json.ok) {
        setRegs(json.registrations as Reg[]);
        setStats(json.stats as Stats);
      }
    } catch {
      /* keep stale */
    } finally {
      setSyncing(false);
    }
  }, []);

  const verify = useCallback(
    async (k: string) => {
      setAuthBusy(true);
      setAuthErr("");
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: k }),
        });
        if (!res.ok) throw new Error();
        sessionStorage.setItem(KEY_STORE, k);
        setAuthed(true);
        load(k);
      } catch {
        setAuthErr("ACCESS DENIED — WRONG PASSCODE");
        shake(gateRef.current);
        sessionStorage.removeItem(KEY_STORE);
      } finally {
        setAuthBusy(false);
      }
    },
    [load, shake],
  );

  useEffect(() => {
    const k = sessionStorage.getItem(KEY_STORE);
    if (k) {
      setKey(k);
      verify(k);
    }
  }, [verify]);

  /* Auto-refresh every 30s */
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => load(key), 30_000);
    return () => clearInterval(id);
  }, [authed, key, load]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (armedId === null) return;
    const id = setTimeout(() => setArmedId(null), 3000);
    return () => clearTimeout(id);
  }, [armedId]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(""), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  /* Close detail on escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Filtered view */
  const view = useMemo(() => {
    let list = [...(regs ?? [])];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        [r.teamName, r.leader, r.email, r.college, r.teamCode, r.phone]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (filter === "SOLO") list = list.filter((r) => r.size === 1);
    if (filter === "DUO") list = list.filter((r) => r.size === 2);
    if (filter === "BONUS") list = list.filter((r) => r.bonus);
    if (sort === "OLDEST") list.reverse();
    if (sort === "NAME")
      list.sort((a, b) => a.teamName.localeCompare(b.teamName));
    return list;
  }, [regs, query, filter, sort]);

  const copy = async (text: string, tag: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(tag);
  };

  const exportCsv = () => {
    const head = [
      "id",
      "squad",
      "size",
      "operator",
      "email",
      "phone",
      "college",
      "code",
      "bonus",
      "squad_key",
      "registered_at",
    ];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const body = view.map((r) =>
      [
        r.id,
        r.teamName,
        r.size,
        r.leader,
        r.email,
        r.phone,
        r.college,
        r.code,
        r.bonus ? "yes" : "no",
        r.teamCode,
        new Date(r.createdAt).toISOString(),
      ]
        .map(esc)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...body].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `anesthesia-squads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setToast(`EXPORTED ${view.length} SQUAD${view.length === 1 ? "" : "S"}`);
  };

  const remove = async (id: number) => {
    if (armedId !== id) return setArmedId(id);
    setArmedId(null);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        setRegs((d) => (d ?? []).filter((x) => x.id !== id));
        setOpen(null);
        setToast("REGISTRATION REMOVED");
        load(key);
      }
    } catch {
      setToast("DELETE FAILED — RETRY");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(KEY_STORE);
    setAuthed(false);
    setKey("");
    setRegs(null);
    setStats(null);
  };

  /* ================= LOGIN GATE ================= */
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-void px-6 text-ink">
        <div ref={gateRef} className="w-full max-w-md border border-line bg-panel p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <p className="font-mono text-[10px] tracking-[0.35em] text-fog">
              ANESTHESIA <span className="text-acid">//</span> COMMAND CENTER
            </p>
            <span className="heartbeat inline-block size-2 rounded-full bg-acid" />
          </div>

          <div className="mt-6">
            <div className="size-10 rounded-full border border-acid/40 bg-acid/10 flex items-center justify-center">
              <LockKeyhole className="size-5 text-acid" />
            </div>
            <h1 className="mt-4 font-display text-3xl uppercase tracking-tight text-white">
              ADMIN CONTROL
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-fog">
              Squad management for Anesthesia 2026. View, search, export, and manage registrations.
            </p>

            <div className="mt-8">
              <label className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-fog">
                PASSCODE
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verify(key)}
                placeholder="Enter admin passcode"
                className={INPUT}
                autoFocus
              />
              {authErr && (
                <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-blood">
                  — {authErr}
                </p>
              )}
            </div>

            {/* Quick Demo Fill button */}
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-fog">
              <span>DEFAULT: <code className="text-acid">anesthesia-admin</code></span>
              <button
                onClick={() => setKey("anesthesia-admin")}
                className="text-acid underline underline-offset-2 hover:text-white"
              >
                FILL KEY
              </button>
            </div>

            <button
              onClick={() => verify(key)}
              disabled={authBusy || !key}
              className="mt-6 flex w-full items-center justify-center gap-2 border border-acid bg-acid px-6 py-3.5 font-mono text-xs font-bold tracking-[0.25em] text-void transition-colors hover:bg-transparent hover:text-acid disabled:opacity-40"
            >
              {authBusy ? "AUTHENTICATING..." : "ACCESS DASHBOARD"}
            </button>
          </div>

          <div className="mt-8 border-t border-line pt-4 text-center">
            <Link
              href="/"
              className="font-mono text-[10px] tracking-[0.25em] text-fog transition-colors hover:text-acid"
            >
              ← RETURN TO WEBSITE
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ================= ADMIN DASHBOARD ================= */
  return (
    <main className="min-h-screen bg-void px-6 py-10 md:px-12 text-ink">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 border border-acid bg-panel px-4 py-2.5 font-mono text-xs text-acid shadow-lg">
          {toast}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-acid">
            [ ANESTHESIA // MASTER REGISTRY ]
          </p>
          <h1 className="mt-1 font-display text-3xl uppercase tracking-tight text-white md:text-4xl">
            SQUAD COMMAND CENTER
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => load(key)}
            disabled={syncing}
            className="inline-flex items-center gap-2 border border-line bg-panel px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-fog hover:text-ink transition-colors"
          >
            <RefreshCw className={`size-3.5 ${syncing ? "animate-spin text-acid" : ""}`} />
            SYNC
          </button>
          <button
            onClick={exportCsv}
            disabled={!view.length}
            className="inline-flex items-center gap-2 border border-acid bg-acid/10 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-acid hover:bg-acid hover:text-void transition-all"
          >
            <Download className="size-3.5" />
            EXPORT CSV ({view.length})
          </button>
          <Link
            href="/"
            className="border border-line px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-fog hover:text-ink transition-colors"
          >
            VIEW SITE
          </Link>
          <button
            onClick={logout}
            className="border border-line/60 px-3 py-2 text-fog hover:text-blood transition-colors"
            title="Sign out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-2 border border-line md:grid-cols-4 md:divide-x md:divide-line bg-panel/30">
        <Tile value={stats?.total ?? 0} label="REGISTERED SQUADS" accent />
        <Tile value={stats?.hunters ?? 0} label="TOTAL HUNTERS" />
        <Tile value={stats?.duo ?? 0} label="DUO SQUADS" />
        <Tile value={stats?.solo ?? 0} label="SOLO OPERATORS" />
      </div>

      {/* Search and Filters Strip */}
      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by squad, operator, email, college, or key..."
            className="w-full border border-line bg-panel/60 py-2.5 pl-10 pr-4 font-mono text-xs text-ink placeholder:text-fog/40 focus:border-acid focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          {(["ALL", "DUO", "SOLO", "BONUS"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-3 py-1.5 transition-colors ${
                filter === f
                  ? "border-acid bg-acid text-void font-bold"
                  : "border-line text-fog hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Squads Data Table */}
      <div className="mt-6 overflow-x-auto border border-line bg-panel/20">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-line bg-panel/60 text-[10px] tracking-[0.2em] text-fog uppercase">
            <tr>
              <th className="p-4">SQUAD NAME</th>
              <th className="p-4">LEAD OPERATOR</th>
              <th className="p-4">EMAIL</th>
              <th className="p-4">COLLEGE</th>
              <th className="p-4">SIZE</th>
              <th className="p-4">SQUAD KEY</th>
              <th className="p-4">DATE</th>
              <th className="p-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40">
            {view.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-fog">
                  {regs ? "No squads match the current query." : "Loading squads..."}
                </td>
              </tr>
            ) : (
              view.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-panel/80 transition-colors group"
                >
                  <td className="p-4 font-bold text-ink">
                    <button
                      onClick={() => setOpen(r)}
                      className="text-left hover:text-acid transition-colors underline decoration-dotted"
                    >
                      {r.teamName}
                    </button>
                  </td>
                  <td className="p-4 text-fog">{r.leader}</td>
                  <td className="p-4 text-fog">
                    <span
                      onClick={() => copy(r.email, `mail-${r.id}`)}
                      className="cursor-pointer hover:text-acid transition-colors"
                      title="Click to copy email"
                    >
                      {copied === `mail-${r.id}` ? "COPIED" : r.email}
                    </span>
                  </td>
                  <td className="p-4 text-fog max-w-[150px] truncate">{r.college || "—"}</td>
                  <td className="p-4">
                    <span className="border border-line px-2 py-0.5 text-[10px]">
                      {r.size === 1 ? "SOLO" : "DUO"}
                    </span>
                  </td>
                  <td className="p-4 text-acid font-bold">
                    <span
                      onClick={() => copy(r.teamCode, `code-${r.id}`)}
                      className="cursor-pointer hover:underline"
                      title="Click to copy squad key"
                    >
                      {copied === `code-${r.id}` ? "COPIED" : r.teamCode}
                    </span>
                  </td>
                  <td className="p-4 text-fog text-[10px]">{fmt(r.createdAt)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => remove(r.id)}
                      className={`font-mono text-[10px] px-2.5 py-1 transition-colors ${
                        armedId === r.id
                          ? "bg-blood text-white font-bold"
                          : "text-fog/60 hover:text-blood"
                      }`}
                      title={armedId === r.id ? "Click again to confirm purge" : "Purge squad"}
                    >
                      {armedId === r.id ? "CONFIRM?" : <Trash2 className="size-3.5 inline" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Squad Details Modal */}
      {open && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-void/80 backdrop-blur-sm p-6">
          <div className="w-full max-w-lg border border-acid bg-panel p-8 shadow-2xl relative">
            <button
              onClick={() => setOpen(null)}
              className="absolute right-6 top-6 text-fog hover:text-white"
            >
              <X className="size-5" />
            </button>
            <p className="font-mono text-[10px] tracking-[0.3em] text-acid">
              SQUAD DOSSIER #{open.id}
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-white">
              {open.teamName}
            </h2>
            <div className="mt-6 space-y-3 border-t border-line pt-4 font-mono text-xs">
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">MASTER KEY:</span>
                <span className="text-acid font-bold">{open.teamCode}</span>
              </div>
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">SIZE:</span>
                <span className="text-white">{open.size === 1 ? "SOLO (1)" : "DUO (2)"}</span>
              </div>
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">LEADER:</span>
                <span className="text-white">{open.leader}</span>
              </div>
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">EMAIL:</span>
                <span className="text-white">{open.email}</span>
              </div>
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">PHONE:</span>
                <span className="text-white">{open.phone || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">COLLEGE:</span>
                <span className="text-white">{open.college || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-line/40 pb-2">
                <span className="text-fog">REGISTERED:</span>
                <span className="text-white">{fmt(open.createdAt, true)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fog">BONUS HINT:</span>
                <span className={open.bonus ? "text-acid font-bold" : "text-fog"}>
                  {open.bonus ? "CREDITED (+1 TOKEN)" : "NONE"}
                </span>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setOpen(null)}
                className="border border-line px-5 py-2 font-mono text-xs text-ink hover:border-acid hover:text-acid transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { scrollTo } from "@/lib/lenis";
import { playTactileClick } from "@/lib/audio";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from "lucide-react";

type Line = {
  id: string;
  type: "input" | "output" | "error" | "success" | "banner";
  text: string;
};

const ASCII_BANNER = `
    ___    _   ________________  __________  _______
   /   |  / | / / ____/ ___/_  __/ / / / ____/ ___/  _/   |
  / /| | /  |/ / __/  \\__ \\ / / / /_/ / __/  \\__ \\  / / /| |
 / ___ |/ /|  / /___ ___/ // / / __  / /___ ___/ / / // ___ |
/_/  |_/_/ |_/_____//____//_/ /_/ /_/_____//____/ /_//_/  |_|
  CRYPTIC HUNT & CTF ARENA // TYPE 'help' FOR COMMANDS
`;

const INITIAL_LINES: Line[] = [
  { id: "1", type: "banner", text: ASCII_BANNER },
  { id: "2", type: "output", text: "Anesthesia Command Terminal [Version 2.6.0-live]" },
  { id: "3", type: "output", text: "Type 'help' to view available commands, or 'decode YIVXZS' to solve Level 0." },
];

export default function TerminalDrawer() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<"default" | "matrix" | "amber">("default");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: backtick (`) or Ctrl+K or F1 to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "`" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) ||
        (e.ctrlKey && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [open, lines]);

  const atbash = (str: string) => {
    return str
      .toUpperCase()
      .split("")
      .map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(90 - (code - 65));
        }
        return c;
      })
      .join("");
  };

  const execute = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    const inputLine: Line = { id: String(Date.now()), type: "input", text: trimmed };
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newOutputs: Line[] = [inputLine];

    switch (cmd) {
      case "help":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: `AVAILABLE COMMANDS:
  help              Display this instruction sheet
  about             Overview of the Anesthesia competition
  format            Explain the 4-phase tournament timeline
  dossier           Show event telemetry & specifications
  team              Meet the CryptX challenge architects
  cipher            Inspect the Level 0 warm-up puzzle
  decode <text>     Run real-time Atbash substitution decoder
  register          Jump directly to the registration portal
  join <code>       Verify and join a squad with a squad key
  banner            Display ASCII wordmark
  ls / dir          List virtual arena directory files
  cat <file>        Read contents of a file (e.g. flag.txt, hint.txt)
  whoami            Print operator handle and connection telemetry
  ping              Test uplink latency
  date              Show live UTC system timestamp & event status
  matrix            Toggle classic phosphor matrix theme
  theme <name>      Switch terminal theme (default | matrix | amber)
  clear / cls       Clear terminal output history
  discord           Open official Anesthesia Discord community
  sudo <cmd>        Execute command as superuser
  exit              Close the command terminal`,
        });
        break;

      case "clear":
      case "cls":
        setLines([]);
        return;

      case "banner":
        newOutputs.push({ id: String(Date.now() + 1), type: "banner", text: ASCII_BANNER });
        break;

      case "whoami":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: `Operator: guest@anesthesia-uplink\nRole: Hunter / Security Researcher\nAccess Tier: Level 0 (Warm-Up)\nSession: Authenticated\nBrowser: ${navigator.userAgent.slice(0, 50)}...`,
        });
        break;

      case "about":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: "ANESTHESIA is ONE unified crucible combining an open-internet Cryptic Hunt and an adversarial CTF. One squad, one key, one master scoreboard. Free entry always (₹0).",
        });
        break;

      case "format":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: "FORMAT: 48-hour continuous deployment. Stream A: Cryptic Hunt (OSINT, audio, stego). Stream B: CTF (Web, Pwn, Reversing, Forensics). Finale: Combined master leaderboard.",
        });
        break;

      case "dossier":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: "SPECIFICATIONS:\n- Dates: TBA (Dropping on Discord)\n- Squad: Solo (1) or Duo (2 operators)\n- Engine: Dynamic scoring with First-Blood multipliers\n- Entry: 100% Free",
        });
        break;


      case "team":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: "THE ARCHITECTS (CryptX Collective):\n- Aarav Sharma (Lead Architect)\n- Rohan Varma (Cryptic Hunt Author)\n- Kabir Mehta (CTF Exploitation Engineer)\n- Devina Roy (Platform & Infrastructure Lead)",
        });
        break;

      case "cipher":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: "LEVEL 0 INTERCEPT: 'YIVXZS'\nCipher: Atbash substitution (A ⇋ Z, B ⇋ Y...)\nTry running: 'decode YIVXZS' in this terminal to unlock your +1 hint token bonus!",
        });
        break;

      case "decode":
        if (!args.length) {
          newOutputs.push({ id: String(Date.now() + 1), type: "error", text: "Usage: decode <CIPHERTEXT>" });
        } else {
          const target = args.join(" ");
          const decoded = atbash(target);
          if (decoded === "BREACH") {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "success",
              text: `KEY DECRYPTED: ${decoded}\n[+] LEVEL 0 SOLVED!\n[+] BONUS SQUAD CODE: BREACH-10\nPaste this code during registration for +1 bonus hint token on game day!`,
            });
          } else {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "output",
              text: `Result: ${decoded}`,
            });
          }
        }
        break;

      case "ls":
      case "dir":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: "flag.txt    dossier.pdf    rules.md    hint.txt    secret.log",
        });
        break;

      case "cat":
        if (!args.length) {
          newOutputs.push({ id: String(Date.now() + 1), type: "error", text: "Usage: cat <filename>" });
        } else {
          const file = args[0].toLowerCase();
          if (file === "flag.txt") {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "success",
              text: "ANESTHESIA{n1c3_try_but_th3_r3al_fl4g5_ar3_1n_th3_hunt}",
            });
          } else if (file === "hint.txt") {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "output",
              text: "The key to Atbash is mirror symmetry: A becomes Z, B becomes Y, C becomes X. YIVXZS -> BREACH.",
            });
          } else if (file === "rules.md") {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "output",
              text: "# RULES OF ENGAGEMENT\n1. The entire public internet is fair game.\n2. Do NOT DDoS or attack competition servers or admin gateways.\n3. Squad maximum size is 2 operators.\n4. Have fun and compete honorably.",
            });
          } else if (file === "secret.log") {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "output",
              text: "[CLASSIFIED] Anesthesia 2026 challenge repository contains 32 unique stages. First-blood timers armed.",
            });
          } else {
            newOutputs.push({
              id: String(Date.now() + 1),
              type: "error",
              text: `cat: ${args[0]}: No such file or directory`,
            });
          }
        }
        break;

      case "sudo":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "error",
          text: "Nice try, operator. Permission denied: this incident will be reported to CryptX surveillance.",
        });
        break;

      case "matrix":
        setTheme((prev) => (prev === "matrix" ? "default" : "matrix"));
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "success",
          text: "Matrix Phosphor Theme toggled.",
        });
        break;

      case "theme":
        if (args[0] === "matrix" || args[0] === "amber" || args[0] === "default") {
          setTheme(args[0]);
          newOutputs.push({ id: String(Date.now() + 1), type: "success", text: `Theme set to: ${args[0]}` });
        } else {
          newOutputs.push({ id: String(Date.now() + 1), type: "error", text: "Usage: theme default | matrix | amber" });
        }
        break;

      case "ping":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: `PING anesthesia-gateway (127.0.0.1): 64 data bytes\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=4.2ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=3.8ms\n-- UPLINK SYNCHRONIZED --`,
        });
        break;

      case "date":
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "output",
          text: `SYSTEM TIME: ${new Date().toISOString()} (UTC)\nEVENT COUNTDOWN: Standby for official drop on Discord.`,
        });
        break;

      case "register":
        setOpen(false);
        scrollTo("#register");
        newOutputs.push({ id: String(Date.now() + 1), type: "success", text: "Navigating to Squad Portal..." });
        break;

      case "join":
        if (!args.length) {
          newOutputs.push({ id: String(Date.now() + 1), type: "error", text: "Usage: join <SQUAD_KEY> (e.g. join AN-W03I1)" });
        } else {
          setOpen(false);
          scrollTo("#register");
          newOutputs.push({
            id: String(Date.now() + 1),
            type: "success",
            text: `Squad key ${args[0]} copied to Registration portal. Select 'Join with Code' to finish.`,
          });
        }
        break;

      case "discord":
        window.open("https://discord.gg/Q2Z5FSxTG4", "_blank");
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "success",
          text: "Opening https://discord.gg/Q2Z5FSxTG4 in new window...",
        });
        break;

      case "echo":
        newOutputs.push({ id: String(Date.now() + 1), type: "output", text: args.join(" ") });
        break;

      case "exit":
      case "close":
        setOpen(false);
        return;

      default:
        newOutputs.push({
          id: String(Date.now() + 1),
          type: "error",
          text: `command not found: '${cmd}'. Type 'help' to inspect valid instructions.`,
        });
        break;
    }

    setLines((prev) => [...prev, ...newOutputs]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const nextIdx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = [
        "help", "about", "format", "dossier", "team", "cipher",
        "decode", "register", "join", "ls", "cat", "whoami", "ping", "date",
        "matrix", "theme", "clear", "discord", "exit"
      ];
      const match = commands.find((c) => c.startsWith(input.toLowerCase().trim()));
      if (match) setInput(match);
    }
  };

  return (
    <>
      {/* Floating Toggle Pill */}
      <button
        onClick={() => {
          playTactileClick();
          setOpen((prev) => !prev);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-[#090b12]/90 px-4 py-2 font-mono text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all hover:border-[#3b9eff] hover:bg-[#3b9eff] hover:text-[#06070a]"
        title="Open Anesthesia Terminal (Hotkey: ` or Ctrl+K)"
      >
        <TerminalIcon className="size-3.5 text-[#3b9eff] group-hover:text-black" />
        <span>CLI Console</span>
        <span className="hidden sm:inline text-[10px] text-white/40">[`]</span>
      </button>

      {/* Terminal Drawer / Modal Overlay */}
      {open && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl border ${
            theme === "matrix"
              ? "bg-[#040d06]/95 border-green-500/40 text-green-400"
              : theme === "amber"
              ? "bg-[#0d0904]/95 border-amber-500/40 text-amber-300"
              : "bg-[#07090f]/95 border-white/15 text-white/90"
          } ${
            fullscreen
              ? "inset-0 rounded-0"
              : "inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 md:w-[740px] h-[540px] rounded-3xl"
          }`}
        >
          {/* Terminal Title Bar */}
          <div
            className={`flex items-center justify-between border-b px-5 py-3 select-none ${
              theme === "matrix"
                ? "border-green-500/20 bg-green-500/5"
                : theme === "amber"
                ? "border-amber-500/20 bg-amber-500/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-yellow-400/80" />
              <span className="size-2.5 rounded-full bg-green-400/80" />
              <span className="ml-2 font-semibold">operator@anesthesia-arena:~</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="hidden sm:inline opacity-40">Tab autocomplete · Up/Down history</span>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="opacity-50 hover:opacity-100 transition-opacity p-1"
                title={fullscreen ? "Restore window" : "Maximize"}
              >
                {fullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="opacity-50 hover:opacity-100 transition-opacity p-1"
                title="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Terminal Output Log Area */}
          <div ref={logContainerRef} className="flex-1 overflow-y-auto p-5 font-mono text-xs leading-relaxed space-y-2 select-text">
            {lines.map((l) => (
              <div key={l.id}>
                {l.type === "banner" ? (
                  <pre className="font-mono text-[9px] sm:text-[11px] leading-[1.2] text-[#3b9eff] select-none whitespace-pre overflow-x-auto">
                    {l.text}
                  </pre>
                ) : l.type === "input" ? (
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-[#3b9eff]">operator@anesthesia:~$</span>
                    <span>{l.text}</span>
                  </div>
                ) : l.type === "error" ? (
                  <p className="text-red-400 whitespace-pre-wrap">{l.text}</p>
                ) : l.type === "success" ? (
                  <p className="text-[#3b9eff] font-semibold whitespace-pre-wrap">{l.text}</p>
                ) : (
                  <p className="opacity-80 whitespace-pre-wrap">{l.text}</p>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Terminal Prompt Input Bar */}
          <div
            className={`flex items-center gap-2 border-t px-4 py-3 ${
              theme === "matrix"
                ? "border-green-500/20 bg-green-500/5"
                : theme === "amber"
                ? "border-amber-500/20 bg-amber-500/5"
                : "border-white/10 bg-black/40"
            }`}
          >
            <span className="font-mono text-xs font-bold text-[#3b9eff] shrink-0">
              operator@anesthesia:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command... (try 'help' or 'cat flag.txt')"
              className="w-full bg-transparent font-mono text-xs text-white focus:outline-none placeholder:opacity-30"
            />
            <button
              onClick={() => execute(input)}
              className="p-1 opacity-50 hover:opacity-100 transition-opacity"
              title="Submit command"
            >
              <CornerDownLeft className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

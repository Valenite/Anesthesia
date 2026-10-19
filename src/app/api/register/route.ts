import { NextResponse } from "next/server";
import { findClash, createRegistration, isTeamCodeTaken } from "@/db/store";

export const dynamic = "force-dynamic";

export const BONUS_CODE = "BREACH-10";

function makeTeamCode(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return "AN-" + h.toString(36).toUpperCase().padStart(5, "0").slice(-5);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID PAYLOAD" },
      { status: 400 },
    );
  }

  const teamName = String(body.teamName ?? "").trim();
  const leader = String(body.leader ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const college = String(body.college ?? "").trim();
  const code = String(body.code ?? "").trim().toUpperCase();
  const size = Number(body.size) === 1 ? 1 : 2;

  if (teamName.length < 3 || leader.length < 3) {
    return NextResponse.json(
      { ok: false, error: "MISSING FIELDS — NAME AND OPERATOR REQUIRED" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "INVALID EMAIL ADDRESS" },
      { status: 400 },
    );
  }

  const bonus = code === BONUS_CODE;

  try {
    /* check for duplicate squad name or email */
    const clash = await findClash(teamName, email);
    if (clash) {
      const dupName = clash.teamName.toLowerCase() === teamName.toLowerCase();
      return NextResponse.json(
        {
          ok: false,
          error: dupName
            ? "SQUAD NAME ALREADY TAKEN"
            : "THIS EMAIL IS ALREADY REGISTERED",
        },
        { status: 409 },
      );
    }

    /* generate unique team code with AN- prefix for Anesthesia */
    let teamCode = makeTeamCode(`${teamName}|${email}|${Date.now()}`);
    for (let i = 0; i < 5; i++) {
      const taken = await isTeamCodeTaken(teamCode);
      if (!taken) break;
      teamCode = makeTeamCode(`${teamName}|${email}|${Date.now()}|${i}`);
    }

    const row = await createRegistration({
      teamName,
      size,
      leader,
      email,
      phone,
      college,
      code,
      bonus,
      teamCode,
    });

    return NextResponse.json({
      ok: true,
      teamCode: row.teamCode,
      bonus: row.bonus,
      record: row,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { ok: false, error: "UPLINK FAILED — PLEASE RETRY" },
      { status: 500 },
    );
  }
}

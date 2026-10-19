import { NextResponse } from "next/server";
import { joinSquad, findSquadByCode } from "@/db/store";

export const dynamic = "force-dynamic";

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

  const teamCode = String(body.teamCode ?? "").trim().toUpperCase();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const college = String(body.college ?? "").trim();

  if (!teamCode || teamCode.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid Squad Code (e.g. AN-XXXXX)" },
      { status: 400 },
    );
  }

  if (name.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Full Name is required (minimum 3 characters)" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required" },
      { status: 400 },
    );
  }

  if (!/^[+\d][\d\s-]{7,14}$/.test(phone)) {
    return NextResponse.json(
      { ok: false, error: "Phone number must be between 8 and 15 digits" },
      { status: 400 },
    );
  }

  if (college.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Institute or affiliation is required" },
      { status: 400 },
    );
  }

  try {
    const result = await joinSquad(teamCode, {
      name,
      email,
      phone,
      college,
    });

    if (!result.ok || !result.record) {
      return NextResponse.json(
        { ok: false, error: result.error || "Unable to join squad" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      teamName: result.record.teamName,
      teamCode: result.record.teamCode,
      leader: result.record.leader,
      bonus: result.record.bonus,
      member2: result.record.member2,
    });
  } catch (err) {
    console.error("Join team error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error while joining squad" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ ok: false, error: "Code required" }, { status: 400 });
  }

  const squad = await findSquadByCode(code);
  if (!squad) {
    return NextResponse.json({ ok: false, error: "Squad not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    squad: {
      teamName: squad.teamName,
      teamCode: squad.teamCode,
      size: squad.size,
      leader: squad.leader,
      isFull: Boolean(squad.member2 || squad.size === 1),
      bonus: squad.bonus,
    },
  });
}

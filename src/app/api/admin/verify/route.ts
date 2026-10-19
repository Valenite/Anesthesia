import { NextResponse } from "next/server";
import { verifyKey } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let key: string | null = null;
  try {
    const data = await req.json();
    key = typeof data?.key === "string" ? data.key : null;
  } catch {
    key = null;
  }

  if (!verifyKey(key)) {
    /* small delay to blunt brute force */
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json(
      { ok: false, error: "ACCESS DENIED" },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true });
}

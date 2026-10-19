import { NextResponse } from "next/server";
import { getAllRegistrations } from "@/db/store";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const rows = await getAllRegistrations();

    const dayMs = 86_400_000;
    const now = Date.now();
    const hunters = rows.reduce((n, r) => n + r.size, 0);
    const solo = rows.filter((r) => r.size === 1).length;
    const duo = rows.filter((r) => r.size === 2).length;
    const bonus = rows.filter((r) => r.bonus).length;
    const last24h = rows.filter(
      (r) => now - new Date(r.createdAt).getTime() < dayMs,
    ).length;

    /* unique colleges, ranked */
    const byCollege = new Map<string, number>();
    for (const r of rows) {
      const key = r.college.trim().toUpperCase() || "UNAFFILIATED";
      byCollege.set(key, (byCollege.get(key) ?? 0) + 1);
    }
    const colleges = [...byCollege.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    /* last 14 days signup trend */
    const trend: { day: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);
      const end = new Date(start.getTime() + dayMs);
      trend.push({
        day: start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        count: rows.filter((r) => {
          const t = new Date(r.createdAt).getTime();
          return t >= start.getTime() && t < end.getTime();
        }).length,
      });
    }

    return NextResponse.json({
      ok: true,
      stats: {
        total: rows.length,
        hunters,
        solo,
        duo,
        bonus,
        last24h,
        colleges,
        trend,
      },
      registrations: rows,
    });
  } catch (err) {
    console.error("Registrations query error:", err);
    return NextResponse.json(
      { ok: false, error: "QUERY FAILED" },
      { status: 500 },
    );
  }
}

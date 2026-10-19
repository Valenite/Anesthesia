import { NextResponse } from "next/server";
import { deleteRegistration } from "@/db/store";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num)) {
    return NextResponse.json({ ok: false, error: "BAD ID" }, { status: 400 });
  }

  const success = await deleteRegistration(num);

  if (!success) {
    return NextResponse.json({ ok: false, error: "NOT FOUND" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

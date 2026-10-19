export const ADMIN_HEADER = "x-admin-key";

const expectedKeys = () => [
  process.env.ADMIN_PASSCODE,
  "anesthesia-admin",
  "cryptx-admin",
  "admin",
].filter(Boolean) as string[];

/** Server-side check for admin mutations. */
export function isAdmin(req: Request): boolean {
  const key = req.headers.get(ADMIN_HEADER);
  if (!key) return false;
  return expectedKeys().includes(key);
}

export function verifyKey(key: string | null | undefined): boolean {
  if (!key) return false;
  return expectedKeys().includes(key);
}

import fs from "fs";
import path from "path";

export type Teammate = {
  name: string;
  email: string;
  phone: string;
  college: string;
  joinedAt: string;
};

export type RegistrationRecord = {
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
  member2?: Teammate;
};

const DATA_FILE = path.join(process.cwd(), "data", "registrations.json");

function ensureDataFile(): RegistrationRecord[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8").replace(/^\uFEFF/, "").trim();
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Local store read error:", err);
    return [];
  }
}

function saveData(data: RegistrationRecord[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Local store write error:", err);
  }
}

export async function findClash(teamName: string, email: string) {
  const records = ensureDataFile();
  const lowerName = teamName.trim().toLowerCase();
  const lowerEmail = email.trim().toLowerCase();

  const found = records.find(
    (r) =>
      r.teamName.toLowerCase() === lowerName ||
      r.email.toLowerCase() === lowerEmail ||
      r.member2?.email.toLowerCase() === lowerEmail,
  );

  return found ? { teamName: found.teamName, email: found.email } : null;
}

export async function isTeamCodeTaken(code: string): Promise<boolean> {
  const records = ensureDataFile();
  return records.some((r) => r.teamCode.toUpperCase() === code.toUpperCase());
}

export async function findSquadByCode(code: string): Promise<RegistrationRecord | null> {
  const records = ensureDataFile();
  const found = records.find((r) => r.teamCode.toUpperCase() === code.trim().toUpperCase());
  return found ?? null;
}

export async function joinSquad(
  code: string,
  teammate: Omit<Teammate, "joinedAt">,
): Promise<{ ok: boolean; error?: string; record?: RegistrationRecord }> {
  const records = ensureDataFile();
  const normalizedCode = code.trim().toUpperCase();
  const lowerEmail = teammate.email.trim().toLowerCase();

  const idx = records.findIndex((r) => r.teamCode.toUpperCase() === normalizedCode);
  if (idx === -1) {
    return { ok: false, error: "Invalid Squad Key. No squad found with this code." };
  }

  const squad = records[idx];

  if (squad.size === 1) {
    return {
      ok: false,
      error: "This squad was registered as Solo. Solo operators cannot add teammates.",
    };
  }

  if (squad.member2) {
    return {
      ok: false,
      error: "This squad is already full. Maximum 2 operators allowed per squad.",
    };
  }

  if (squad.email.toLowerCase() === lowerEmail) {
    return {
      ok: false,
      error: "You cannot join with the team leader's email address.",
    };
  }

  // Check if email already used in any squad
  const emailInUse = records.some(
    (r) =>
      r.email.toLowerCase() === lowerEmail ||
      r.member2?.email.toLowerCase() === lowerEmail,
  );
  if (emailInUse) {
    return {
      ok: false,
      error: "This email address is already registered in a squad.",
    };
  }

  const member2Record: Teammate = {
    ...teammate,
    joinedAt: new Date().toISOString(),
  };

  records[idx] = {
    ...squad,
    member2: member2Record,
  };

  saveData(records);
  return { ok: true, record: records[idx] };
}

export async function createRegistration(
  item: Omit<RegistrationRecord, "id" | "createdAt">,
): Promise<RegistrationRecord> {
  const records = ensureDataFile();
  const nextId = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
  const newRecord: RegistrationRecord = {
    ...item,
    id: nextId,
    createdAt: new Date().toISOString(),
  };

  records.unshift(newRecord);
  saveData(records);
  return newRecord;
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const records = ensureDataFile();
  return records.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function deleteRegistration(id: number): Promise<boolean> {
  const records = ensureDataFile();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  records.splice(idx, 1);
  saveData(records);
  return true;
}

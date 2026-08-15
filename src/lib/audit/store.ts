import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { AuditRecord } from "./schema";

const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const memory = new Map<string, { record: AuditRecord; expiresAt: number }>();

function redisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function key(id: string) {
  return `audit:${id}`;
}

function fileDir() {
  return path.join(process.cwd(), ".data", "audits");
}

function filePath(id: string) {
  // nanoid is URL-safe; still reject path traversal
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw new Error("Invalid audit id");
  }
  return path.join(fileDir(), `${id}.json`);
}

function pruneMemory() {
  const now = Date.now();
  for (const [id, entry] of memory) {
    if (entry.expiresAt <= now) memory.delete(id);
  }
}

async function saveToFile(record: AuditRecord): Promise<void> {
  const dir = fileDir();
  await fs.mkdir(dir, { recursive: true });
  const payload = {
    expiresAt: Date.now() + TTL_SECONDS * 1000,
    record,
  };
  await fs.writeFile(filePath(record.id), JSON.stringify(payload), "utf8");
}

async function getFromFile(id: string): Promise<AuditRecord | null> {
  try {
    const raw = await fs.readFile(filePath(id), "utf8");
    const parsed = JSON.parse(raw) as {
      expiresAt: number;
      record: AuditRecord;
    };
    if (parsed.expiresAt <= Date.now()) {
      await fs.unlink(filePath(id)).catch(() => undefined);
      return null;
    }
    return parsed.record;
  } catch {
    return null;
  }
}

export async function saveAudit(record: AuditRecord): Promise<void> {
  const redis = redisClient();
  if (redis) {
    await redis.set(key(record.id), JSON.stringify(record), {
      ex: TTL_SECONDS,
    });
    return;
  }

  // File store so Next.js workers share audits in local/demo mode
  await saveToFile(record);
  pruneMemory();
  memory.set(record.id, {
    record,
    expiresAt: Date.now() + TTL_SECONDS * 1000,
  });
}

export async function getAudit(id: string): Promise<AuditRecord | null> {
  const redis = redisClient();
  if (redis) {
    const raw = await redis.get<string | AuditRecord>(key(id));
    if (!raw) return null;
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw) as AuditRecord;
      } catch {
        return null;
      }
    }
    return raw;
  }

  pruneMemory();
  const entry = memory.get(id);
  if (entry) return entry.record;

  const fromFile = await getFromFile(id);
  if (fromFile) {
    memory.set(id, {
      record: fromFile,
      expiresAt: Date.now() + TTL_SECONDS * 1000,
    });
  }
  return fromFile;
}

export async function updateAudit(
  id: string,
  updater: (record: AuditRecord) => AuditRecord,
): Promise<AuditRecord | null> {
  const existing = await getAudit(id);
  if (!existing) return null;
  const next = updater(existing);
  await saveAudit(next);
  return next;
}

export function usingMemoryStore(): boolean {
  return (
    !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

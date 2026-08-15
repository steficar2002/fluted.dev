const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

function isPrivateIp(hostname: string): boolean {
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  if (/^169\.254\./.test(hostname)) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\./.test(hostname)) return true;
  return false;
}

export function normalizeAuditUrl(input: string):
  | { ok: true; url: string }
  | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 2048) {
    return { ok: false, error: "Enter a valid website URL." };
  }

  let withProtocol = trimmed;
  if (!/^https?:\/\//i.test(withProtocol)) {
    withProtocol = `https://${withProtocol}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, error: "Enter a valid website URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }

  const host = parsed.hostname.toLowerCase();
  if (!host.includes(".")) {
    return { ok: false, error: "Enter a full domain (e.g. yourstore.com)." };
  }
  if (BLOCKED_HOSTS.has(host) || isPrivateIp(host)) {
    return { ok: false, error: "That URL can’t be audited." };
  }

  parsed.hash = "";
  // Homepage-only: strip path/query for the audit target
  parsed.pathname = "/";
  parsed.search = "";

  return { ok: true, url: parsed.toString() };
}

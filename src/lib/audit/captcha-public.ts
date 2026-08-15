/** Cloudflare Turnstile always-pass test key (local/demo when env unset). */
const TEST_SITE_KEY = "1x00000000000000000000AA";

export const AUDIT_CAPTCHA_STORAGE_KEY = "fluted-audit-captcha";

/** Public site key for the Turnstile widget (safe to expose). */
export function turnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || TEST_SITE_KEY;
}

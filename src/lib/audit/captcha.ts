import "server-only";

const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

function turnstileSecretKey(): string {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || TEST_SECRET_KEY;
}

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

/** Server-side Turnstile verification. */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteip?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = token?.trim() ?? "";
  if (!trimmed) {
    return { ok: false, error: "Complete the captcha before running the audit." };
  }

  const body = new URLSearchParams();
  body.set("secret", turnstileSecretKey());
  body.set("response", trimmed);
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    const data = (await res.json()) as SiteverifyResponse;
    if (!data.success) {
      return {
        ok: false,
        error: "Captcha failed. Refresh and try again.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not verify captcha. Try again shortly.",
    };
  }
}

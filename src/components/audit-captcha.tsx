"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";
import { turnstileSiteKey } from "@/lib/audit/captcha-public";
import { cn } from "@/lib/utils";

type AuditCaptchaProps = {
  onToken: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
};

/**
 * Cloudflare Turnstile — real click / managed captcha for the free audit.
 * Uses Cloudflare test keys when env vars are unset (local/demo).
 */
export function AuditCaptcha({
  onToken,
  theme = "light",
  className,
}: AuditCaptchaProps) {
  const ref = useRef<TurnstileInstance | null>(null);

  return (
    <div className={cn("min-h-[65px]", className)}>
      <Turnstile
        ref={ref}
        siteKey={turnstileSiteKey()}
        options={{
          theme,
          size: "normal",
          appearance: "always",
        }}
        onSuccess={(token) => onToken(token)}
        onExpire={() => onToken(null)}
        onError={() => onToken(null)}
        onTimeout={() => onToken(null)}
      />
    </div>
  );
}

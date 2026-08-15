"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AuditCaptcha } from "@/components/audit-captcha";
import { Magnetic } from "@/components/motion/magnetic";
import { AUDIT_CAPTCHA_STORAGE_KEY } from "@/lib/audit/captcha-public";
import { cn } from "@/lib/utils";

export function AuditCta({ className }: { className?: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a website like yourstore.com");
      return;
    }
    if (!captchaToken) {
      setError("Complete the captcha before running the audit.");
      return;
    }
    sessionStorage.setItem(AUDIT_CAPTCHA_STORAGE_KEY, captchaToken);
    router.push(`/audit/run?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section
      id="free-audit"
      className={cn(
        "relative flex flex-col justify-center border-t border-charcoal/10 bg-charcoal text-ground md:min-h-[50svh] md:snap-start",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl leading-[1.05] tracking-wide lowercase md:text-5xl lg:text-6xl">
            free website audit
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-ground/75 md:text-lg">
            Enter your store URL. We’ll load a homepage score, what’s working,
            and what to improve — then unlock the rest with a short form or a
            call.
          </p>
        </motion.div>

        <form onSubmit={onSubmit} className="mt-10 flex max-w-2xl flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <label className="sr-only" htmlFor="audit-url">
              Website URL
            </label>
            <input
              id="audit-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="enter your store.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="min-h-12 flex-1 border border-ground/25 bg-transparent px-4 text-base text-ground placeholder:text-ground/40 outline-none transition-colors focus:border-coral"
            />
            <Magnetic intensity={0.35} range={80}>
              <button
                type="submit"
                disabled={!url.trim() || !captchaToken}
                className="inline-flex min-h-12 w-full items-center justify-center bg-coral px-6 text-sm text-ground transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Scan my store
              </button>
            </Magnetic>
          </div>
          <AuditCaptcha theme="dark" onToken={setCaptchaToken} />
          {error && (
            <p className="text-sm text-coral" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

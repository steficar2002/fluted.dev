"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Nav } from "@/components/nav";
import { AUDIT_CAPTCHA_STORAGE_KEY } from "@/lib/audit/captcha-public";

const steps = [
  "Fetching your homepage",
  "Checking speed & conversion signals",
  "Scoring what’s working",
  "Drafting improvement tasks",
] as const;

function AuditRunInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") ?? "";
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const displayHost = useMemo(() => {
    try {
      const withProto = urlParam.includes("://")
        ? urlParam
        : `https://${urlParam}`;
      return new URL(withProto).hostname;
    } catch {
      return urlParam || "your site";
    }
  }, [urlParam]);

  useEffect(() => {
    if (!urlParam.trim()) {
      setError("Add a website URL to start the audit.");
      return;
    }

    let cancelled = false;
    const tick = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 900);

    (async () => {
      try {
        const captchaToken =
          sessionStorage.getItem(AUDIT_CAPTCHA_STORAGE_KEY) ?? "";
        sessionStorage.removeItem(AUDIT_CAPTCHA_STORAGE_KEY);

        if (!captchaToken) {
          throw new Error(
            "Captcha missing. Go back and complete the captcha to run the audit.",
          );
        }

        const res = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlParam, captchaToken }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          id?: string;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.id) {
          throw new Error(data.error ?? "Could not start the audit.");
        }
        if (!cancelled) router.replace(`/audit/${data.id}`);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        window.clearInterval(tick);
      }
    })();

    return () => {
      cancelled = true;
      window.clearInterval(tick);
    };
  }, [urlParam, router]);

  return (
    <main className="relative flex min-h-[100svh] flex-1 flex-col bg-ground font-sans">
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-24 md:px-8">
        <h1 className="font-display text-4xl tracking-wide text-charcoal lowercase md:text-5xl">
          free audit
        </h1>
        <p className="mt-4 font-sans text-lg text-charcoal/75">
          Auditing {displayHost}
        </p>
        <p className="mt-2 max-w-[42ch] text-sm text-charcoal/60">
          Placeholder loading — dummy results appear next while live APIs are
          offline.
        </p>

        {error ? (
          <div className="mt-10 space-y-4">
            <p className="text-sm text-coral" role="alert">
              {error}
            </p>
            <a
              href="/#free-audit"
              className="inline-flex items-center bg-charcoal px-5 py-3 text-sm text-ground transition-colors hover:bg-coral"
            >
              Try another URL
            </a>
          </div>
        ) : (
          <ul className="mt-10 space-y-4" aria-live="polite">
            {steps.map((label, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={
                      done
                        ? "h-2.5 w-2.5 bg-purple"
                        : active
                          ? "h-2.5 w-2.5 animate-pulse bg-coral"
                          : "h-2.5 w-2.5 bg-charcoal/20"
                    }
                  />
                  <span
                    className={
                      active || done
                        ? "text-base text-charcoal"
                        : "text-base text-charcoal/45"
                    }
                  >
                    {label}
                    {active ? "…" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {!error && (
          <motion.div
            className="mt-12 h-1 w-full overflow-hidden bg-charcoal/10"
            aria-hidden
          >
            <motion.div
              className="h-full bg-coral"
              initial={{ width: "8%" }}
              animate={{ width: ["8%", "88%"] }}
              transition={{ duration: 6, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function AuditRunPage() {
  return (
    <>
      <Nav variant="on-light" />
      <Suspense
        fallback={
          <main className="flex min-h-[100svh] items-center justify-center bg-ground font-sans text-charcoal">
            Starting audit…
          </main>
        }
      >
        <AuditRunInner />
      </Suspense>
    </>
  );
}

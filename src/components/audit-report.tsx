"use client";

import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { AuditFinding, AuditTeaser } from "@/lib/audit/schema";
import { site } from "@/lib/content";
import { Magnetic } from "@/components/motion/magnetic";
import { TalkToTeamCard } from "@/components/talk-to-team-card";
import { cn } from "@/lib/utils";

const BAND = {
  red: { fill: "#e14727", text: "text-[#c43a1f]" },
  yellow: { fill: "#d4b400", text: "text-[#8a7400]" },
  green: { fill: "#1f7a4d", text: "text-[#1a6842]" },
} as const;

type BandKey = keyof typeof BAND;

function scoreBand(score: number): BandKey {
  if (score >= 75) return "green";
  if (score >= 50) return "yellow";
  return "red";
}

type MetricKey = "performance" | "accessibility" | "bestPractices" | "seo";

function metricInsight(key: MetricKey, score: number | null): string {
  if (score == null) return "Score unavailable for this run.";
  const band = scoreBand(score);
  const copy: Record<MetricKey, Record<BandKey, string>> = {
    performance: {
      red: "PDP media and scripts are likely slowing the path to add-to-cart — compress images and defer non-critical JS.",
      yellow: "Load is usable, but heavy PDP assets still cost mobile conversion. Trim hero media and third-party tags.",
      green: "Speed supports a smooth buy path. Keep PDP weight lean as you add custom sections.",
    },
    accessibility: {
      red: "Form labels, contrast, or focus states may block shoppers from completing purchase actions.",
      yellow: "Core a11y is okay, but variant pickers and ATC buttons need clearer names and keyboard paths.",
      green: "Assistive tech can follow the buy flow. Keep labels and contrast tight on new PDP modules.",
    },
    bestPractices: {
      red: "Console/security or outdated patterns may undermine trust on the product page.",
      yellow: "Solid baseline — tighten third-party scripts and HTTPS assets that sit near the buy box.",
      green: "Technical hygiene looks strong. Maintain it when shipping custom Liquid / apps.",
    },
    seo: {
      red: "Title, headings, or crawl signals are weak — product discovery from search will underperform.",
      yellow: "Indexability is fine; sharpen PDP titles, alt text, and structured data for richer results.",
      green: "Search signals look healthy. Protect them when redesigning templates.",
    },
  };
  return copy[key][band];
}

function overallInsight(score: number): string {
  const band = scoreBand(score);
  if (band === "red") {
    return "Conversion fundamentals need work before traffic pays off — prioritize PDP clarity and speed.";
  }
  if (band === "yellow") {
    return "A workable storefront with clear CRO upside — focus on buy-box friction and proof next to ATC.";
  }
  return "Strong foundation. Fine-tune PDP hierarchy and trust to push conversion further.";
}

/** Point on upper semicircle: 0% = left, 100% = right */
function arcPoint(cx: number, cy: number, r: number, pct: number) {
  const angle = Math.PI * (1 - pct / 100);
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  fromPct: number,
  toPct: number,
) {
  const start = arcPoint(cx, cy, r, fromPct);
  const end = arcPoint(cx, cy, r, toPct);
  const large = toPct - fromPct > 50 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

const CONFETTI_COLORS = ["#e14727", "#eaea70", "#1f7a4d", "#924d9e", "#231f20"];

function ResultsConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 17) % 92)}%`,
        delay: (i % 10) * 0.05,
        duration: 2.4 + (i % 5) * 0.25,
        size: 5 + (i % 4),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        drift: ((i % 11) - 5) * 18,
        rotate: (i % 2 === 0 ? 1 : -1) * (160 + (i % 6) * 35),
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-4%] rounded-[1px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.7,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: ["0vh", "75vh"],
            x: [0, p.drift],
            opacity: [0, 0.7, 0.5, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

function ScoreMeter({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const band = scoreBand(clamped);
  const tone = BAND[band];
  const r = 90;
  const cx = 100;
  const cy = 100;
  const tip = arcPoint(cx, cy, r, clamped);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[220px] sm:w-[260px]">
        <svg
          viewBox="0 0 200 120"
          className="h-auto w-full"
          role="img"
          aria-label={`Overall homepage score ${clamped} out of 100`}
        >
          {/* Solid R / Y / G zones — no gradients */}
          <path
            d={arcPath(cx, cy, r, 0, 50)}
            fill="none"
            stroke={BAND.red.fill}
            strokeWidth="14"
            strokeLinecap="butt"
          />
          <path
            d={arcPath(cx, cy, r, 50, 75)}
            fill="none"
            stroke={BAND.yellow.fill}
            strokeWidth="14"
            strokeLinecap="butt"
          />
          <path
            d={arcPath(cx, cy, r, 75, 100)}
            fill="none"
            stroke={BAND.green.fill}
            strokeWidth="14"
            strokeLinecap="butt"
          />
          <motion.circle
            cx={tip.x}
            cy={tip.y}
            r={9}
            fill={tone.fill}
            stroke="#f6f4f1"
            strokeWidth={3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.25 }}
          />
        </svg>
        <div className="absolute inset-x-0 top-[42%] flex flex-col items-center">
          <p
            className={cn(
              "font-sans text-5xl font-semibold leading-none tabular-nums sm:text-6xl",
              tone.text,
            )}
          >
            {clamped}
          </p>
          <p className="mt-1 text-xs font-medium tracking-wide text-charcoal/55 uppercase">
            / 100
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-sm font-medium text-charcoal">
        Overall homepage score
      </p>
      <p className="mt-2 max-w-[28ch] text-center text-sm leading-relaxed text-charcoal/70">
        {overallInsight(clamped)}
      </p>
      <p className="mt-2 text-center text-xs text-charcoal/50">Demo results</p>
    </div>
  );
}

function MetricTile({
  label,
  metricKey,
  value,
}: {
  label: string;
  metricKey: MetricKey;
  value: number | null;
}) {
  const n = value == null ? null : Math.round(value);
  const band = n == null ? null : scoreBand(n);
  const tone = band ? BAND[band] : null;
  const insight = metricInsight(metricKey, n);

  return (
    <div className="border border-charcoal/15 bg-white px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wider text-charcoal/60 uppercase">
          {label}
        </p>
        <p
          className={cn(
            "font-sans text-3xl font-semibold leading-none tabular-nums sm:text-4xl",
            tone?.text ?? "text-charcoal",
          )}
        >
          {n == null ? "—" : n}
        </p>
      </div>
      {/* Split R / Y / G track — solid blocks, marker at score */}
      <div className="relative mt-4 h-2.5 w-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <span className="h-full w-1/2" style={{ backgroundColor: BAND.red.fill }} />
          <span
            className="h-full w-1/4"
            style={{ backgroundColor: BAND.yellow.fill }}
          />
          <span
            className="h-full w-1/4"
            style={{ backgroundColor: BAND.green.fill }}
          />
        </div>
        {n != null && (
          <motion.span
            className="absolute top-1/2 h-4 w-1 -translate-y-1/2 bg-charcoal"
            style={{ left: `calc(${n}% - 2px)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            aria-hidden
          />
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{insight}</p>
    </div>
  );
}

function CheckIcon({ tone }: { tone: "good" | "improve" }) {
  if (tone === "good") {
    return (
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1f7a4d]/10 text-[#1f7a4d]"
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7.2L5.8 10L11 3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral"
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M4 4L10 10M10 4L4 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function FindingBlock({
  finding,
  tone,
}: {
  finding: AuditFinding;
  tone: "good" | "improve";
}) {
  return (
    <article className="flex gap-3 border-t border-charcoal/10 py-5 first:border-t-0 first:pt-0">
      <CheckIcon tone={tone} />
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-charcoal">{finding.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
          {finding.detail}
        </p>
        <p className="mt-3 text-sm text-charcoal/85">
          <span className="font-medium text-charcoal">Impact: </span>
          {finding.impact}
        </p>
      </div>
    </article>
  );
}

function LockedList({ titles }: { titles: string[] }) {
  return (
    <ul className="space-y-1" aria-hidden>
      {titles.map((title) => (
        <li
          key={title}
          className="flex gap-3 select-none border-t border-charcoal/10 py-4 blur-[7px]"
        >
          <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-coral/20" />
          <div>
            <p className="text-lg font-semibold text-charcoal">{title}</p>
            <p className="mt-2 text-sm text-charcoal/70">
              PDP conversion detail and recommended fix path.
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function UnlockModal({
  open,
  onClose,
  onUnlocked,
}: {
  open: boolean;
  onClose: () => void;
  onUnlocked: (teaser: AuditTeaser) => void;
}) {
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const id = window.location.pathname.split("/").pop();
      const res = await fetch(`/api/audit/${id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, notes }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        teaser?: AuditTeaser;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.teaser) {
        throw new Error(data.error ?? "Could not unlock the audit.");
      }
      onUnlocked(data.teaser);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90svh] w-full max-w-lg overflow-y-auto border border-charcoal/10 bg-ground p-6 shadow-[0_18px_50px_rgba(35,31,32,0.22)] md:max-w-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id={titleId}
          className="font-sans text-2xl font-semibold tracking-tight text-charcoal"
        >
          Unlock the full audit
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          Fill out the details below to unlock the full audit.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              ref={firstFieldRef}
              required
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 border border-charcoal/20 bg-white px-3 text-sm outline-none focus:border-coral"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 border border-charcoal/20 bg-white px-3 text-sm outline-none focus:border-coral"
            />
          </div>
          <input
            name="company"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="min-h-11 w-full border border-charcoal/20 bg-white px-3 text-sm outline-none focus:border-coral"
          />
          <textarea
            name="notes"
            placeholder="Anything we should know? (optional)"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-charcoal/20 bg-white px-3 py-2 text-sm outline-none focus:border-coral"
          />
          {error && (
            <p className="text-sm text-coral" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 flex-1 items-center justify-center bg-charcoal px-5 text-sm text-ground transition-colors hover:bg-coral disabled:opacity-50"
            >
              {loading ? "Unlocking…" : "Unlock full audit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-charcoal/65 underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6">
          <TalkToTeamCard />
        </div>
      </div>
    </div>
  );
}

export function AuditReportView({ initial }: { initial: AuditTeaser }) {
  const [teaser, setTeaser] = useState(initial);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const host = (() => {
    try {
      return new URL(teaser.url).hostname;
    } catch {
      return teaser.url;
    }
  })();

  useEffect(() => {
    const t = window.setTimeout(() => setShowConfetti(false), 3200);
    return () => window.clearTimeout(t);
  }, []);

  const metrics: { label: string; metricKey: MetricKey; value: number | null }[] =
    [
      {
        label: "Performance",
        metricKey: "performance",
        value: teaser.scores.performance,
      },
      {
        label: "Accessibility",
        metricKey: "accessibility",
        value: teaser.scores.accessibility,
      },
      {
        label: "Best practices",
        metricKey: "bestPractices",
        value: teaser.scores.bestPractices,
      },
      { label: "SEO", metricKey: "seo", value: teaser.scores.seo },
    ];

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-16 font-sans md:px-8 md:py-20">
      {showConfetti && <ResultsConfetti />}

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-12 xl:gap-14">
        <div className="min-w-0">
          <p className="text-sm text-charcoal/60">
            Homepage audit ·{" "}
            <a
              href={teaser.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal underline-offset-2 hover:underline"
            >
              {host}
            </a>
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display text-4xl leading-[1.05] tracking-wide text-charcoal lowercase md:text-5xl lg:text-6xl">
            your free audit
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-charcoal/75 md:text-lg">
            {teaser.summary}
          </p>

          <div className="mt-12 grid gap-10 border-y border-charcoal/10 py-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start lg:gap-14">
            <ScoreMeter score={teaser.overallScore} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {metrics.map((m) => (
                <MetricTile
                  key={m.label}
                  label={m.label}
                  metricKey={m.metricKey}
                  value={m.value}
                />
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <section>
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-charcoal md:text-3xl">
                What&apos;s working
              </h2>
              <div className="mt-6">
                {teaser.strengths.map((f) => (
                  <FindingBlock key={f.title} finding={f} tone="good" />
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-charcoal md:text-3xl">
                What needs to improve
              </h2>
              <div className="mt-6">
                {teaser.improvements.map((f) => (
                  <FindingBlock key={f.title} finding={f} tone="improve" />
                ))}
              </div>
            </section>
          </div>

          {!teaser.unlocked && teaser.lockedCount > 0 && (
            <section className="relative mt-16 border-t border-charcoal/10 pt-10">
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-charcoal md:text-3xl">
                Detailed list of what needs to improve
              </h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-charcoal/70 md:text-base">
                The remaining PDP and CRO tasks are locked. Unlock the full
                audit to see every fix priority.
              </p>

              <div className="relative mt-8 min-h-[220px]">
                <LockedList titles={teaser.lockedTitles} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ground/55 to-ground" />
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                  <Magnetic intensity={0.3} range={90}>
                    <button
                      type="button"
                      onClick={() => setUnlockOpen(true)}
                      className="inline-flex min-h-14 items-center justify-center bg-coral px-8 text-base font-medium text-ground shadow-[0_12px_32px_rgba(225,71,39,0.28)] transition-colors hover:bg-charcoal"
                    >
                      Unlock full audit
                    </button>
                  </Magnetic>
                </div>
              </div>
            </section>
          )}

          {teaser.unlocked && (
            <section className="mt-14 border-t border-charcoal/10 bg-charcoal px-6 py-10 text-ground md:px-10">
              <h2 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
                Go deeper with an expert
              </h2>
              <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-ground/75">
                Book a call to walk through every finding — PDP conversion gaps,
                custom Shopify opportunities, and what a build would look like.
              </p>
              <Magnetic intensity={0.35} range={80}>
                <a
                  href={site.bookCallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center bg-ground px-5 py-3 text-sm text-charcoal transition-colors hover:bg-coral hover:text-ground"
                >
                  Book a call on Calendly
                </a>
              </Magnetic>
            </section>
          )}

          <p className="mt-12 text-sm text-charcoal/60">
            <a href="/" className="underline-offset-2 hover:underline">
              ← Back to fluted
            </a>
          </p>
        </div>

        <aside className="mt-12 lg:sticky lg:top-24 lg:mt-0 lg:self-start">
          <TalkToTeamCard />
        </aside>
      </div>

      <UnlockModal
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        onUnlocked={setTeaser}
      />
    </div>
  );
}

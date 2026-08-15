"use client";

import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const FEATURES = [
  "FOMO timers",
  "Product bundles",
  "Testimonials",
  "Review widgets",
  "AOV upsell popups",
  "Sticky add-to-cart",
  "Size guides",
  "Trust badges",
  "Shipping calculator",
  "Urgency stock bars",
  "Cross-sell rails",
  "Gift with purchase",
  "Subscription toggles",
  "Variant swatches",
  "Zoom galleries",
  "Comparison tables",
  "PDP FAQ blocks",
  "Social proof toasts",
  "Exit-intent offers",
  "Free shipping meters",
  "Wishlist",
  "Recently viewed",
  "Fit quizzes",
  "Delivery estimates",
  "Payment badges",
  "Launch countdowns",
  "Volume discounts",
  "Cart drawers",
  "Quick-view modals",
  "Low-stock alerts",
] as const;

type PillTone =
  | "coral"
  | "coralSoft"
  | "yellow"
  | "yellowSoft"
  | "purple"
  | "purpleSoft"
  | "ground"
  | "charcoal";

const TONES: PillTone[] = [
  "coral",
  "yellow",
  "purple",
  "ground",
  "coralSoft",
  "yellowSoft",
  "purpleSoft",
  "charcoal",
];

const toneClass: Record<PillTone, string> = {
  coral: "bg-coral text-ground",
  coralSoft: "bg-[#f08a74] text-charcoal",
  yellow: "bg-yellow text-charcoal",
  yellowSoft: "bg-[#f5f5a8] text-charcoal",
  purple: "bg-purple text-ground",
  purpleSoft: "bg-[#b57abf] text-charcoal",
  ground: "bg-ground text-charcoal",
  charcoal: "bg-black text-ground",
};

function pillTone(label: string, index: number): PillTone {
  // Deterministic mix so SSR and client match
  const n = label.length * 17 + index * 11;
  return TONES[n % TONES.length]!;
}

function shuffleRow(seed: number): string[] {
  const copy = [...FEATURES];
  // Simple deterministic shuffle from seed
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (seed * (i + 7) + i * 13) % (i + 1);
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  // Offset start so rows feel different
  const offset = seed % copy.length;
  return [...copy.slice(offset), ...copy.slice(0, offset)];
}

const ROWS = [
  { items: shuffleRow(3), duration: 180, reverse: false },
  { items: shuffleRow(11), duration: 220, reverse: true },
  { items: shuffleRow(19), duration: 160, reverse: false },
] as const;

function FeaturePill({ label, index }: { label: string; index: number }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap",
        toneClass[pillTone(label, index)],
      )}
    >
      {label}
    </span>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse,
  reducedMotion,
}: {
  items: readonly string[];
  duration: number;
  reverse: boolean;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-3.5 px-4">
        {items.slice(0, 8).map((label, i) => (
          <FeaturePill key={`${label}-${i}`} label={label} index={i} />
        ))}
      </div>
    );
  }

  const loop = [...items, ...items];

  return (
    <motion.div
      className="flex w-max gap-3.5"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {loop.map((label, i) => (
        <FeaturePill
          key={`${label}-${reverse ? "r" : "f"}-${i}`}
          label={label}
          index={i}
        />
      ))}
    </motion.div>
  );
}

/**
 * Compact charcoal band — CRO / PDP feature pills in three staggered marquees.
 * Replaces the previous glass social-proof banner.
 */
export function SocialProofBanner() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="cro-features"
      aria-label="CRO and PDP features"
      className="relative flex flex-col justify-center overflow-hidden border-t border-charcoal/10 bg-charcoal py-10 md:min-h-[50svh] md:snap-start md:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-6 text-left md:px-8">
        <h2 className="max-w-[22ch] font-sans text-2xl font-semibold leading-tight tracking-tight text-ground md:text-3xl">
          Do you have these CRO &amp; PDP improvements?
        </h2>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-ground/65 md:text-base">
          Custom Shopify features that lift conversion — not another theme
          preset.
        </p>
      </div>

      <div
        className="relative mt-7 space-y-4 md:mt-8"
        style={
          reducedMotion
            ? undefined
            : {
                maskImage:
                  "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
              }
        }
      >
        {ROWS.map((row, i) => (
          <MarqueeRow
            key={i}
            items={row.items}
            duration={row.duration}
            reverse={row.reverse}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col items-start gap-3 px-6 text-left md:mt-10 md:px-8">
        <a
          href={site.bookCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-coral px-6 py-3 text-sm font-medium text-ground transition-colors hover:bg-black"
        >
          Book a call
        </a>
        <p className="text-xs text-ground/50">
          Built in custom Liquid &amp; code — tailored to your funnel.
        </p>
      </div>
    </section>
  );
}

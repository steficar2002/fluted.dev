"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  LayoutTemplate,
  Code2,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { methodSteps } from "@/lib/content";
import { cn } from "@/lib/utils";

const icons: Record<(typeof methodSteps)[number]["icon"], LucideIcon> = {
  search: Search,
  layout: LayoutTemplate,
  code: Code2,
  chart: LineChart,
};

const accentBg = {
  coral: "bg-coral",
  yellow: "bg-yellow",
  purple: "bg-purple",
} as const;

const accentFill = {
  coral: "#e14727",
  yellow: "#eaea70",
  purple: "#924d9e",
} as const;

const accentRing = {
  coral: "ring-coral",
  yellow: "ring-yellow",
  purple: "ring-purple",
} as const;

const accentText = {
  coral: "text-coral",
  yellow: "text-charcoal",
  purple: "text-purple",
} as const;

type Accent = keyof typeof accentBg;
type StepIcon = (typeof methodSteps)[number]["icon"];

/** Inline diagrams — wireframe / structure / code / chart */
function StepVisual({
  kind,
  accent,
}: {
  kind: StepIcon;
  accent: Accent;
}) {
  const color = accentFill[accent];

  if (kind === "search") {
    // Funnel audit wireframe
    return (
      <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
        <rect width="320" height="220" fill="#f6f4f1" />
        <rect x="24" y="28" width="120" height="14" rx="0" fill="#231f20" opacity="0.12" />
        <rect x="24" y="52" width="80" height="8" fill="#231f20" opacity="0.08" />
        {/* funnel */}
        <path
          d="M70 80 L250 80 L210 160 L110 160 Z"
          fill="none"
          stroke="#231f20"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.35"
        />
        <path d="M90 100 L230 100 L205 140 L115 140 Z" fill={color} opacity="0.85" />
        <circle cx="248" cy="72" r="22" fill="none" stroke={color} strokeWidth="2.5" />
        <line
          x1="264"
          y1="88"
          x2="286"
          y2="110"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="square"
        />
        <rect x="24" y="180" width="48" height="8" fill="#231f20" opacity="0.1" />
        <rect x="80" y="180" width="36" height="8" fill={color} opacity="0.5" />
        <rect x="124" y="180" width="28" height="8" fill="#231f20" opacity="0.08" />
      </svg>
    );
  }

  if (kind === "layout") {
    // Structure / wireframe layout
    return (
      <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
        <rect width="320" height="220" fill="#f6f4f1" />
        <rect x="20" y="20" width="280" height="180" fill="none" stroke="#231f20" strokeWidth="1.5" opacity="0.2" />
        <rect x="20" y="20" width="280" height="28" fill="#231f20" opacity="0.08" />
        <rect x="32" y="28" width="40" height="10" fill="#231f20" opacity="0.15" />
        <rect x="200" y="28" width="28" height="10" fill="#231f20" opacity="0.1" />
        <rect x="236" y="28" width="48" height="10" fill={color} />
        {/* left nav blocks */}
        <rect x="32" y="64" width="72" height="120" fill="none" stroke="#231f20" strokeDasharray="3 2" strokeWidth="1.25" opacity="0.3" />
        <rect x="40" y="76" width="56" height="8" fill="#231f20" opacity="0.12" />
        <rect x="40" y="92" width="44" height="8" fill="#231f20" opacity="0.08" />
        <rect x="40" y="108" width="50" height="8" fill="#231f20" opacity="0.08" />
        {/* main PDP */}
        <rect x="116" y="64" width="168" height="120" fill="white" stroke="#231f20" strokeWidth="1.25" opacity="0.9" />
        <rect x="128" y="76" width="70" height="70" fill={color} opacity="0.35" />
        <rect x="208" y="76" width="64" height="10" fill="#231f20" opacity="0.15" />
        <rect x="208" y="94" width="48" height="8" fill="#231f20" opacity="0.1" />
        <rect x="208" y="118" width="64" height="22" fill={color} />
      </svg>
    );
  }

  if (kind === "code") {
    // Code / Liquid craft
    return (
      <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
        <rect width="320" height="220" fill="#231f20" />
        <circle cx="36" cy="32" r="5" fill="#e14727" />
        <circle cx="54" cy="32" r="5" fill="#eaea70" />
        <circle cx="72" cy="32" r="5" fill="#924d9e" />
        <rect x="24" y="56" width="28" height="8" fill="#924d9e" opacity="0.9" />
        <rect x="58" y="56" width="72" height="8" fill="#f6f4f1" opacity="0.35" />
        <rect x="40" y="76" width="40" height="8" fill="#eaea70" opacity="0.7" />
        <rect x="86" y="76" width="96" height="8" fill="#f6f4f1" opacity="0.25" />
        <rect x="40" y="96" width="52" height="8" fill="#e14727" opacity="0.75" />
        <rect x="98" y="96" width="64" height="8" fill="#f6f4f1" opacity="0.2" />
        <rect x="24" y="116" width="28" height="8" fill="#924d9e" opacity="0.9" />
        <rect x="58" y="116" width="120" height="8" fill="#f6f4f1" opacity="0.3" />
        <rect x="40" y="136" width="36" height="8" fill="#eaea70" opacity="0.65" />
        <rect x="82" y="136" width="88" height="8" fill="#f6f4f1" opacity="0.22" />
        <rect x="40" y="156" width="24" height="8" fill="#e14727" opacity="0.7" />
        <rect x="24" y="176" width="28" height="8" fill="#924d9e" opacity="0.9" />
        {/* accent caret block */}
        <rect x="220" y="70" width="76" height="100" fill="none" stroke={color} strokeWidth="1.5" opacity="0.9" />
        <rect x="232" y="86" width="52" height="8" fill={color} opacity="0.85" />
        <rect x="232" y="106" width="40" height="8" fill="#f6f4f1" opacity="0.2" />
        <rect x="232" y="126" width="48" height="8" fill="#f6f4f1" opacity="0.15" />
        <rect x="232" y="146" width="36" height="8" fill={color} opacity="0.5" />
      </svg>
    );
  }

  // chart / refine
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      <rect width="320" height="220" fill="#f6f4f1" />
      <rect x="24" y="24" width="100" height="12" fill="#231f20" opacity="0.12" />
      <rect x="24" y="44" width="64" height="8" fill="#231f20" opacity="0.08" />
      {/* axes */}
      <line x1="40" y1="180" x2="290" y2="180" stroke="#231f20" strokeWidth="1.25" opacity="0.25" />
      <line x1="40" y1="60" x2="40" y2="180" stroke="#231f20" strokeWidth="1.25" opacity="0.25" />
      {/* bars */}
      <rect x="64" y="140" width="28" height="40" fill="#231f20" opacity="0.12" />
      <rect x="108" y="118" width="28" height="62" fill="#231f20" opacity="0.15" />
      <rect x="152" y="96" width="28" height="84" fill={color} opacity="0.55" />
      <rect x="196" y="78" width="28" height="102" fill={color} opacity="0.75" />
      <rect x="240" y="64" width="28" height="116" fill={color} />
      {/* trend line */}
      <polyline
        points="78,148 122,126 166,104 210,86 254,72"
        fill="none"
        stroke="#231f20"
        strokeWidth="1.75"
        opacity="0.45"
      />
      <circle cx="254" cy="72" r="5" fill={color} />
    </svg>
  );
}

export function Method() {
  const labelId = useId();
  const [active, setActive] = useState(0);
  const step = methodSteps[active];

  return (
    <section
      id="method"
      aria-labelledby={labelId}
      className="flex min-h-[100svh] flex-col justify-center border-t border-charcoal/10 bg-ground px-6 py-20 md:snap-start md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <h2
            id={labelId}
            className="text-3xl font-semibold tracking-tight text-charcoal md:text-4xl"
          >
            How light becomes structure
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/65">
            Four phases. One path from problem to measured launch.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Method phases"
          className="mt-14 flex items-start justify-between gap-2 md:mt-16 md:gap-0"
        >
          {methodSteps.map((item, i) => {
            const Icon = icons[item.icon];
            const isActive = active === i;
            const isPast = i < active;
            return (
              <div key={item.n} className="flex flex-1 items-start">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="method-panel"
                  id={`method-tab-${item.n}`}
                  onClick={() => setActive(i)}
                  className="group flex w-full flex-col items-center text-center"
                >
                  <span
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center transition-all duration-300 md:h-16 md:w-16",
                      isActive
                        ? cn(
                            accentBg[item.accent],
                            "text-ground ring-4 ring-offset-2 ring-offset-ground",
                            accentRing[item.accent],
                            item.accent === "yellow" && "text-charcoal",
                          )
                        : isPast
                          ? "bg-charcoal text-ground"
                          : "bg-white text-charcoal/70 ring-1 ring-charcoal/15 group-hover:text-charcoal",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span
                    className={cn(
                      "mt-3 font-display text-lg tracking-wide lowercase md:text-xl",
                      isActive ? "text-charcoal" : "text-charcoal/70",
                    )}
                  >
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 font-display text-xs tracking-wide",
                      isActive ? accentText[item.accent] : "text-charcoal/70",
                    )}
                  >
                    {item.n}
                  </span>
                </button>

                {i < methodSteps.length - 1 && (
                  <div
                    aria-hidden
                    className="relative mt-7 hidden h-px flex-1 self-start md:mt-8 md:block"
                  >
                    <div className="absolute inset-x-1 top-0 h-px bg-charcoal/15" />
                    <motion.div
                      className="absolute top-0 left-1 h-px bg-charcoal/55"
                      animate={{
                        width: active > i ? "calc(100% - 0.5rem)" : "0%",
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          id="method-panel"
          role="tabpanel"
          aria-labelledby={`method-tab-${step.n}`}
          className="relative mt-12 overflow-hidden bg-white md:mt-14"
        >
          <div
            aria-hidden
            className={cn("absolute inset-x-0 top-0 h-1", accentBg[step.accent])}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={step.n}
              className="grid md:grid-cols-[1fr_1.05fr]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-10">
                <h3 className="text-xl font-semibold text-charcoal md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-charcoal/75">
                  {step.body}
                </p>
              </div>
              <div className="relative min-h-[200px] border-t border-charcoal/10 md:min-h-[260px] md:border-t-0 md:border-l">
                <StepVisual kind={step.icon} accent={step.accent} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

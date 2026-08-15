"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { whatWeDoStages } from "@/lib/content";
import { cn } from "@/lib/utils";

type Accent = "coral" | "yellow" | "purple";

const railFill: Record<Accent, string> = {
  coral: "bg-coral",
  yellow: "bg-yellow",
  purple: "bg-purple",
};

const railInk: Record<Accent, string> = {
  coral: "text-ground",
  yellow: "text-charcoal",
  purple: "text-ground",
};

const stageWash: Record<Accent, string> = {
  coral: "from-coral/[0.12] via-ground to-ground",
  yellow: "from-yellow/[0.22] via-ground to-ground",
  purple: "from-purple/[0.12] via-ground to-ground",
};

const metricColor: Record<Accent, string> = {
  coral: "text-coral",
  yellow: "text-charcoal",
  purple: "text-purple",
};

const SIMPLE_ICON_SLUGS = new Set([
  "meta",
  "tiktok",
  "klaviyo",
  "calendly",
  "hubspot",
  "zapier",
  "shopify",
  "stripe",
  "slack",
  "mailchimp",
]);

function iconSrc(slug: string, domain: string) {
  if (SIMPLE_ICON_SLUGS.has(slug)) {
    return `https://cdn.simpleicons.org/${slug}/231f20`;
  }
  return `https://logo.clearbit.com/${domain}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function FlutedOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[repeating-linear-gradient(90deg,transparent_0_8px,rgba(255,255,255,0.14)_8px_10px)]",
        className,
      )}
    />
  );
}

function AppIcon({
  name,
  slug,
  domain,
  size = 28,
  invert = false,
}: {
  name: string;
  slug: string;
  domain: string;
  size?: number;
  invert?: boolean;
}) {
  const [src, setSrc] = useState(iconSrc(slug, domain));
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-[10px] font-semibold tracking-wide text-charcoal/55 uppercase">
        {name.slice(0, 3)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn(
        "object-contain",
        invert && "brightness-0 invert",
        !SIMPLE_ICON_SLUGS.has(slug) && "rounded-sm",
      )}
      onError={() => {
        if (src.includes("simpleicons")) {
          setSrc(`https://logo.clearbit.com/${domain}`);
          return;
        }
        setFailed(true);
      }}
      unoptimized
    />
  );
}

function FeaturesStage({
  stage,
}: {
  stage: (typeof whatWeDoStages)[0];
}) {
  return (
    <div className="grid h-full items-end gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] md:items-center md:gap-14">
      <div>
        <p className="max-w-[22ch] font-display text-3xl leading-[1.05] tracking-wide text-charcoal md:text-4xl lg:text-5xl">
          {stage.stake}
        </p>
        <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-charcoal/65 md:text-base">
          {stage.body}
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {["FOMO timers", "Bundle builders", "Offer engines"].map((chip) => (
            <li
              key={chip}
              className="bg-coral px-3 py-1.5 text-xs font-medium text-ground"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative isolate overflow-hidden bg-charcoal text-ground">
        <FlutedOverlay className="z-10 opacity-30 mix-blend-soft-light" />
        <div className="relative z-0 grid gap-0 sm:grid-cols-2">
          {stage.metrics?.map((metric, i) => (
            <div
              key={metric.label}
              className={cn(
                "relative px-6 py-8 md:px-8 md:py-12",
                i === 0 && "border-b border-ground/15 sm:border-r sm:border-b-0",
              )}
            >
              <p className="font-display text-6xl leading-none tracking-tight text-coral md:text-7xl lg:text-8xl">
                {metric.value}
              </p>
              <p className="mt-3 text-sm text-ground/65">{metric.label}</p>
              <p className="mt-8 text-[10px] tracking-[0.2em] text-ground/35 uppercase">
                Synthetic demo
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsStage({
  stage,
}: {
  stage: (typeof whatWeDoStages)[1];
}) {
  return (
    <div className="grid h-full items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-12">
      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        {/* orbit ring */}
        <div
          aria-hidden
          className="absolute inset-[12%] rounded-full border border-dashed border-charcoal/15"
        />
        <div
          aria-hidden
          className="absolute inset-[28%] rounded-full border border-charcoal/10"
        />

        {/* hub */}
        <div className="absolute top-1/2 left-1/2 z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5 overflow-hidden bg-charcoal text-ground shadow-[0_24px_50px_rgba(35,31,32,0.28)] md:h-32 md:w-32">
          <FlutedOverlay className="opacity-40" />
          <AppIcon
            name={stage.hub.name}
            slug={stage.hub.slug}
            domain={stage.hub.domain}
            size={40}
            invert
          />
          <span className="relative text-[10px] tracking-[0.16em] uppercase">
            {stage.hub.name}
          </span>
        </div>

        {/* satellite logos */}
        {stage.integrations?.map((app, i) => {
          const total = stage.integrations!.length;
          const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
          const radius = 42;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          return (
            <div
              key={app.name}
              className="absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white shadow-[0_10px_28px_rgba(35,31,32,0.12)] md:h-14 md:w-14"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={app.name}
            >
              <AppIcon name={app.name} slug={app.slug} domain={app.domain} size={26} />
            </div>
          );
        })}
      </div>

      <div>
        <p className="max-w-[22ch] font-display text-3xl leading-[1.05] tracking-wide text-charcoal md:text-4xl lg:text-5xl">
          {stage.stake}
        </p>
        <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-charcoal/65 md:text-base">
          {stage.body}
        </p>
      </div>
    </div>
  );
}

function PdpStage({ stage }: { stage: (typeof whatWeDoStages)[2] }) {
  return (
    <div className="grid h-full gap-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.35fr)] md:items-center md:gap-10">
      <div>
        <p className="max-w-[20ch] font-display text-3xl leading-[1.05] tracking-wide text-charcoal md:text-4xl lg:text-5xl">
          {stage.stake}
        </p>
        <p className="mt-6 max-w-[36ch] text-sm leading-relaxed text-charcoal/65 md:text-base">
          {stage.body}
        </p>

        {/* miniature before tucked under copy */}
        <div className="mt-10 max-w-[180px]">
          <p className="mb-2 text-[10px] tracking-[0.18em] text-charcoal/40 uppercase">
            Before
          </p>
          <div className="border border-charcoal/10 bg-charcoal/[0.03] p-2.5 opacity-70 grayscale">
            <div className="aspect-[4/3] border border-dashed border-charcoal/20 bg-charcoal/[0.04]" />
            <div className="mt-2 h-2 w-3/4 bg-charcoal/10" />
            <div className="mt-1.5 h-2 w-1/3 bg-charcoal/10" />
            <div className="mt-3 flex h-7 items-center justify-center border border-dashed border-charcoal/20 text-[8px] tracking-wide text-charcoal/40 uppercase">
              Add to cart
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] tracking-[0.18em] text-purple uppercase">
          After · conversion surface
        </p>
        <div className="relative overflow-hidden bg-white shadow-[0_28px_60px_rgba(146,77,158,0.2)]">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-purple" />
          <FlutedOverlay className="z-10 opacity-20" />

          <div className="relative z-0 grid grid-cols-[1.1fr_1fr] gap-4 p-5 md:gap-5 md:p-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-coral/30 via-yellow/25 to-purple/40">
              <div className="absolute inset-4 border border-white/60" />
              <div className="absolute right-3 bottom-3 left-3 bg-charcoal/80 px-2 py-1.5 text-[10px] text-ground backdrop-blur-sm">
                Product film · 0:42
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="h-3 w-full bg-purple/15" />
              <div className="h-2.5 w-2/3 bg-coral/15" />
              <div className="flex items-center gap-2 bg-yellow px-2.5 py-2 text-[11px] font-medium text-charcoal">
                <span className="text-coral">★★★★★</span>
                128 reviews
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {["S", "M", "L"].map((size) => (
                  <div
                    key={size}
                    className="flex h-9 items-center justify-center border border-charcoal/15 text-xs font-medium text-charcoal"
                  >
                    {size}
                  </div>
                ))}
              </div>
              <div className="flex h-10 items-center justify-center bg-yellow text-[11px] font-semibold text-charcoal">
                Bundle · Save 15%
              </div>
              <div className="mt-auto flex h-12 items-center justify-center bg-purple text-xs font-semibold tracking-wide text-ground uppercase">
                Add to cart
              </div>
            </div>
          </div>

          <div className="relative z-0 grid grid-cols-3 border-t border-charcoal/10">
            <div className="flex h-14 items-center justify-center bg-coral/15 text-[11px] font-medium text-coral">
              Video
            </div>
            <div className="flex h-14 items-center justify-center bg-yellow/55 text-[11px] font-medium text-charcoal">
              Social proof
            </div>
            <div className="flex h-14 items-center justify-center bg-purple/15 text-[11px] font-medium text-purple">
              Trust
            </div>
          </div>

          <div className="absolute top-4 right-4 z-20 bg-coral px-3 py-1.5 text-[11px] font-semibold text-ground shadow-[0_12px_28px_rgba(225,71,39,0.45)]">
            Only 3 left
          </div>
        </div>
      </div>
    </div>
  );
}

function StagePanel({ index }: { index: number }) {
  const stage = whatWeDoStages[index];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        className="h-full"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {index === 0 && <FeaturesStage stage={whatWeDoStages[0]} />}
        {index === 1 && <IntegrationsStage stage={whatWeDoStages[1]} />}
        {index === 2 && <PdpStage stage={whatWeDoStages[2]} />}
      </motion.div>
    </AnimatePresence>
  );
}

function progressToIndex(v: number, current: number) {
  if (current === 0) return v < 0.38 ? 0 : v < 0.72 ? 1 : 2;
  if (current === 1) return v < 0.28 ? 0 : v < 0.72 ? 1 : 2;
  return v < 0.28 ? 0 : v < 0.62 ? 1 : 2;
}

export function WhatWeDo() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const clickProgressRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const accent = whatWeDoStages[active].accent;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reducedMotion) return;
    if (clickProgressRef.current !== null) {
      if (Math.abs(v - clickProgressRef.current) < 0.06) return;
      clickProgressRef.current = null;
    }
    const next = progressToIndex(v, activeRef.current);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  function selectPillar(index: number) {
    activeRef.current = index;
    setActive(index);
    clickProgressRef.current = scrollYProgress.get();
  }

  return (
    <section id="what" aria-label="What we do" className="relative bg-ground">
      <div ref={trackRef} className="relative md:h-[420vh]">
        <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:overflow-hidden">
          {/* Mobile: horizontal rail */}
          <div
            role="tablist"
            aria-label="What we do pillars"
            className="flex md:hidden"
          >
            {whatWeDoStages.map((pillar, i) => {
              const isActive = active === i;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  id={`what-tab-m-${pillar.id}`}
                  aria-selected={isActive}
                  aria-controls={`what-panel-${pillar.id}`}
                  onClick={() => selectPillar(i)}
                  className={cn(
                    "relative min-h-[4.5rem] flex-1 overflow-hidden px-3 py-4 text-left",
                    railFill[pillar.accent],
                    railInk[pillar.accent],
                    !isActive && "opacity-55",
                  )}
                >
                  {isActive && <FlutedOverlay className="opacity-40" />}
                  <span className="relative font-display text-lg tracking-wide lowercase">
                    {pillar.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop: vertical color rail */}
          <div
            role="tablist"
            aria-label="What we do pillars"
            className="hidden w-[22%] shrink-0 flex-col md:flex lg:w-[20%]"
          >
            {whatWeDoStages.map((pillar, i) => {
              const isActive = active === i;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  id={`what-tab-${pillar.id}`}
                  aria-selected={isActive}
                  aria-controls={`what-panel-${pillar.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectPillar(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                      e.preventDefault();
                      selectPillar((i + 1) % whatWeDoStages.length);
                    }
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      selectPillar(
                        (i - 1 + whatWeDoStages.length) %
                          whatWeDoStages.length,
                      );
                    }
                  }}
                  className={cn(
                    "relative flex flex-1 flex-col justify-end overflow-hidden px-5 py-6 text-left transition-[flex-grow,opacity] duration-400 ease-out lg:px-7 lg:py-8",
                    railFill[pillar.accent],
                    railInk[pillar.accent],
                    isActive ? "flex-[1.35]" : "flex-1 opacity-70 hover:opacity-90",
                  )}
                >
                  {isActive && (
                    <FlutedOverlay className="opacity-45 mix-blend-soft-light" />
                  )}
                  <span
                    className={cn(
                      "relative font-display tracking-wide lowercase transition-all duration-300",
                      isActive
                        ? "text-3xl lg:text-4xl"
                        : "text-xl lg:text-2xl",
                    )}
                  >
                    {pillar.title}
                  </span>
                  <span
                    className={cn(
                      "relative mt-2 max-w-[18ch] text-xs leading-snug transition-opacity duration-300 lg:text-sm",
                      pillar.accent === "yellow"
                        ? "text-charcoal/70"
                        : "text-ground/80",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {pillar.stake}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage */}
          <div
            role="tabpanel"
            id={`what-panel-${whatWeDoStages[active].id}`}
            aria-labelledby={`what-tab-${whatWeDoStages[active].id}`}
            className={cn(
              "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-br px-6 py-10 md:px-10 md:py-12 lg:px-14",
              stageWash[accent],
            )}
          >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 right-0 h-full w-1.5",
                railFill[accent],
              )}
            />
            <div className="relative mx-auto w-full max-w-6xl flex-1">
              <StagePanel index={active} />
            </div>
            <p
              className={cn(
                "relative mt-6 hidden font-display text-6xl leading-none tracking-wide lowercase opacity-[0.07] select-none md:block lg:text-7xl",
                metricColor[accent],
              )}
              aria-hidden
            >
              {whatWeDoStages[active].title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import FlutedGlass, { getFlutedPreset } from "@/components/ui/fluted-glass";
import { Magnetic } from "@/components/motion/magnetic";
import { TextEffect } from "@/components/motion/text-effect";
import {
  featuredTestimonials,
  heroBenefits,
  site,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Glass Stage hero — split: glass band on top, offer + trust below.
 * Prior composition: `.impeccable/backups/hero.pre-redesign.tsx`
 */

const glassParams = {
  ...getFlutedPreset("Folds").params,
  colorBack: "#00000000",
  colorShadow: "#000000",
  colorHighlight: "#ffffff",
  shadows: 0.62,
  highlights: 0,
  size: 0.66,
  shape: "lines" as const,
  angle: 0,
  distortionShape: "lens" as const,
  distortion: 0.75,
  shift: 0,
  stretch: 0,
  blur: 0.49,
  edges: 0.5,
  margin: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  grainMixer: 0.08,
  grainOverlay: 0.26,
  scale: 1.05,
  fit: "cover" as const,
};

const heroPoints = [
  { label: "Design", square: "bg-coral" },
  { label: "Implement", square: "bg-yellow" },
  { label: "Convert", square: "bg-purple" },
] as const;

const dotColors = ["text-yellow", "text-coral", "text-purple"] as const;

const accentText = {
  coral: "text-coral",
  yellow: "text-charcoal",
  purple: "text-purple",
} as const;

type TrustItem =
  | {
      kind: "quote";
      quote: string;
      who: string;
    }
  | {
      kind: "metric";
      value: string;
      label: string;
      accent: keyof typeof accentText;
    };

const trustItems: TrustItem[] = [
  {
    kind: "quote",
    quote: featuredTestimonials[0]!.quote,
    who: `${featuredTestimonials[0]!.name} · ${featuredTestimonials[0]!.company}`,
  },
  {
    kind: "metric",
    value: "+38%",
    label: "conversion · demo",
    accent: "coral",
  },
  {
    kind: "quote",
    quote: featuredTestimonials[1]!.quote,
    who: `${featuredTestimonials[1]!.name} · ${featuredTestimonials[1]!.company}`,
  },
  {
    kind: "metric",
    value: "2.1×",
    label: "AOV · demo",
    accent: "purple",
  },
  {
    kind: "quote",
    quote: featuredTestimonials[2]!.quote,
    who: `${featuredTestimonials[2]!.name} · ${featuredTestimonials[2]!.company}`,
  },
  {
    kind: "metric",
    value: "−22%",
    label: "CAC · demo",
    accent: "yellow",
  },
];

function GlassPlane({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | string>(src);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.4 });

  const sheen = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgba(255,255,255,0.75), rgba(255,255,255,0.2) 45%, transparent 72%)`;
  const glint = useMotionTemplate`radial-gradient(200px circle at ${sx}% ${sy}%, rgba(255,255,255,0.9), transparent 70%)`;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <FlutedGlass
        {...glassParams}
        image={image}
        style={{ width: "100%", height: "100%" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/40 to-charcoal/65"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: sheen, mixBlendMode: "soft-light" }}
        animate={{ opacity: hovered ? 1 : 0.35 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glint, mixBlendMode: "overlay" }}
        animate={{ opacity: hovered ? 0.5 : 0.15 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </div>
  );
}

function TrustChip({ item }: { item: TrustItem }) {
  return (
    <div className="flex shrink-0 flex-col justify-center border border-charcoal/10 bg-white px-4 py-3 shadow-[0_12px_32px_rgba(35,31,32,0.08)] md:px-5">
      {item.kind === "quote" ? (
        <>
          <p className="max-w-[240px] text-sm leading-snug text-charcoal md:max-w-[300px]">
            “{item.quote}”
          </p>
          <p className="mt-2 text-[11px] text-charcoal/50">
            {item.who}
            <span className="text-charcoal/35"> · placeholder</span>
          </p>
        </>
      ) : (
        <>
          <p
            className={cn(
              "font-display text-2xl leading-none md:text-3xl",
              accentText[item.accent],
            )}
          >
            {item.value}
          </p>
          <p className="mt-1 text-[11px] tracking-wide text-charcoal/50 uppercase">
            {item.label}
          </p>
        </>
      )}
    </div>
  );
}

function TrustRow({
  items,
  duration,
  reverse,
}: {
  items: TrustItem[];
  duration: number;
  reverse?: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <motion.div
      className="flex w-max gap-3"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {loop.map((item, i) => (
        <TrustChip key={`${item.kind}-${reverse ? "r" : "f"}-${i}`} item={item} />
      ))}
    </motion.div>
  );
}

/** Two opposing marquee rows with feathered left/right edges. */
function TrustBand() {
  const rowA = trustItems;
  const rowB = [...trustItems].reverse();

  return (
    <div
      className="relative space-y-3 overflow-hidden py-1"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
      }}
    >
      <TrustRow items={rowA} duration={40} />
      <TrustRow items={rowB} duration={48} reverse />
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ground pb-[4.75rem] md:snap-start md:pb-[5rem]"
    >
      {/* Glass band — shorter plane; brand + headline only */}
      <div className="relative h-[30svh] min-h-[170px] shrink-0 overflow-hidden pt-20 md:h-[34svh] md:min-h-[220px] md:pt-20 lg:h-[36svh]">
        <GlassPlane src="/hero-image.png" />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-6xl px-6 pb-5 md:px-8 md:pb-7">
          <p className="font-display text-3xl tracking-wide text-white lowercase md:text-5xl lg:text-6xl">
            {site.name}
          </p>
          <TextEffect
            as="h1"
            per="word"
            preset="blur"
            className="mt-2 max-w-[14ch] text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            {site.heroHeadline}
          </TextEffect>
        </div>
      </div>

      {/* Offer + trust; features bar docks just above sticky CTA */}
      <div className="flex min-h-0 flex-1 flex-col bg-ground">
        <div className="mx-auto w-full max-w-6xl shrink-0 px-6 pt-5 md:px-8 md:pt-6">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {heroPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2.5">
                <span aria-hidden className={`h-2.5 w-2.5 ${point.square}`} />
                <span className="text-sm font-medium text-charcoal">
                  {point.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-charcoal/75 md:mt-4 md:text-lg">
            {site.heroSub}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-5">
            <Magnetic intensity={0.4} range={90}>
              <a
                href={site.bookCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-charcoal px-5 py-3 text-sm text-ground transition-colors hover:bg-coral"
              >
                Book a call
              </a>
            </Magnetic>
            <a
              href="#method"
              className="inline-flex items-center border border-charcoal/25 px-5 py-3 text-sm text-charcoal transition-colors hover:border-charcoal"
            >
              See the method
            </a>
          </div>
        </div>

        {/* Extra gap from CTAs, then dual trust rows */}
        <div className="mt-7 w-full shrink-0 px-0 md:mt-8">
          <TrustBand />
        </div>

        {/* Sits at the bottom of the hero, immediately above sticky CTA */}
        <div className="mt-auto bg-charcoal">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-3.5 md:justify-between md:px-8 md:py-4">
            {heroBenefits.map((benefit, i) => (
              <Fragment key={benefit}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className={`font-display text-3xl leading-none ${dotColors[(i - 1) % dotColors.length]}`}
                  >
                    .
                  </span>
                )}
                <span className="text-sm text-ground/85">{benefit}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

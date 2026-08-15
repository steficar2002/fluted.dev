"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  bannerClients,
  featuredTestimonials,
} from "@/lib/content";
import { cn } from "@/lib/utils";

const AUTO_MS = 6500;

const accentSquare = {
  coral: "bg-coral",
  purple: "bg-purple",
  yellow: "bg-yellow",
} as const;

const accentText = {
  coral: "text-coral",
  purple: "text-purple",
  yellow: "text-yellow",
} as const;

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

function FeaturedMedia({
  image,
  imageAlt,
  video,
}: {
  image: string;
  imageAlt: string;
  video: string | null;
}) {
  if (video) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={video}
        autoPlay
        muted
        loop
        playsInline
        poster={image}
        aria-label={imageAlt}
      />
    );
  }

  return (
    <Image
      src={image}
      alt={imageAlt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 55vw"
      priority={false}
    />
  );
}

function ArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center border border-ground/25 text-ground transition-colors hover:border-ground hover:bg-ground hover:text-charcoal"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden
        className={direction === "prev" ? "rotate-180" : undefined}
      >
        <path
          d="M6 3.5L12 9L6 14.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

export function Testimonials() {
  const labelId = useId();
  const [active, setActive] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const count = featuredTestimonials.length;
  const featured = featuredTestimonials[active];

  function go(delta: number) {
    setActive((i) => (i + delta + count) % count);
  }

  function goBanner(delta: number) {
    setBannerIndex((i) => (i + delta + bannerClients.length) % bannerClients.length);
  }

  // Featured auto-advance
  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reducedMotion, active]);

  // Banner quote auto-advance (offset timing)
  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(() => {
      setBannerIndex((i) => (i + 1) % bannerClients.length);
    }, AUTO_MS + 1200);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, bannerIndex]);

  const banner = bannerClients[bannerIndex];

  return (
    <section
      id="testimonials"
      aria-labelledby={labelId}
      className="relative flex min-h-[100svh] flex-col bg-charcoal md:snap-start"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-10 md:px-8 md:pt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
          <h2
            id={labelId}
            className="text-3xl font-semibold tracking-tight text-ground md:text-4xl"
          >
            What clients see
          </h2>
          <p className="text-[10px] tracking-[0.18em] text-ground/40 uppercase">
            Placeholder proof — replace later
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-stretch md:gap-10">
          {/* Media */}
          <div className="relative min-h-[40vh] overflow-hidden md:min-h-[58vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeaturedMedia
                  image={featured.image}
                  imageAlt={featured.imageAlt}
                  video={featured.video}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-charcoal/15" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  <span className="bg-ground/95 px-2.5 py-1 text-[11px] text-charcoal">
                    {featured.industry}
                  </span>
                  <span className="bg-charcoal/70 px-2.5 py-1 text-[11px] text-ground backdrop-blur-sm">
                    {featured.focus}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote + data */}
          <div className="flex flex-col justify-center py-2 md:py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id + "-copy"}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="max-w-[20ch] font-display text-3xl leading-[1.12] tracking-wide text-ground md:text-4xl lg:text-[2.75rem]">
                  “{featured.quote}”
                </p>

                <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-ground/70 md:text-base">
                  {featured.body}
                </p>

                <div
                  className="mt-4 flex items-center gap-1"
                  aria-label={`${featured.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden
                      className={
                        i < featured.rating
                          ? accentText[featured.accent]
                          : "text-ground/20"
                      }
                    >
                      <path
                        fill="currentColor"
                        d="M8 1.2l1.76 3.56 3.93.57-2.84 2.77.67 3.91L8 10.96 4.48 12l.67-3.91L2.3 5.33l3.93-.57L8 1.2z"
                      />
                    </svg>
                  ))}
                </div>

                <div className="mt-7 flex items-start gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 h-3 w-3 shrink-0",
                      accentSquare[featured.accent],
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-ground">
                      {featured.name}
                    </p>
                    <p className="mt-0.5 text-sm text-ground/75">
                      {featured.role}, {featured.company}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-ground/15 pt-6">
                  {featured.stats.map((stat) => (
                    <div key={stat.label}>
                      <p
                        className={cn(
                          "font-display text-3xl leading-none tracking-wide md:text-4xl",
                          accentText[featured.accent],
                        )}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs text-ground/50">{stat.label}</p>
                      <p className="mt-1 text-[9px] tracking-[0.14em] text-ground/30 uppercase">
                        Demo metric
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-3">
              <ArrowButton
                direction="prev"
                label="Previous testimonial"
                onClick={() => go(-1)}
              />
              <ArrowButton
                direction="next"
                label="Next testimonial"
                onClick={() => go(1)}
              />
              <div className="ml-2 flex gap-1.5">
                {featuredTestimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`Show testimonial from ${t.name}`}
                    aria-current={active === i}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-1.5 transition-all duration-300",
                      active === i
                        ? cn("w-8", accentSquare[t.accent])
                        : "w-4 bg-ground/25 hover:bg-ground/45",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom banner — fewer people, each with a one-liner that switches */}
      <div className="mt-8 border-t border-ground/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:gap-6 md:px-8 md:py-6">
          <p className="shrink-0 text-[10px] tracking-[0.16em] text-ground/70 uppercase">
            Also with
          </p>

          <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto md:gap-4">
            {bannerClients.map((client, i) => (
              <button
                key={client.id}
                type="button"
                aria-label={`Show note from ${client.name}`}
                aria-pressed={bannerIndex === i}
                onClick={() => setBannerIndex(i)}
                className={cn(
                  "relative shrink-0 rounded-full transition-[ring,transform]",
                  bannerIndex === i
                    ? "ring-2 ring-coral ring-offset-2 ring-offset-charcoal"
                    : "opacity-55 hover:opacity-90",
                )}
              >
                <Image
                  src={client.avatar}
                  alt=""
                  width={44}
                  height={44}
                  className="h-10 w-10 rounded-full object-cover md:h-11 md:w-11"
                />
              </button>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3 md:max-w-md md:justify-end">
            <ArrowButton
              direction="prev"
              label="Previous short testimonial"
              onClick={() => goBanner(-1)}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={banner.id}
                className="min-w-0 flex-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <p className="truncate text-sm text-ground/85 md:whitespace-normal md:text-right">
                  “{banner.quote}”
                </p>
                <p className="mt-1 text-xs text-ground/45 md:text-right">
                  {banner.name} · {banner.company}
                </p>
              </motion.div>
            </AnimatePresence>
            <ArrowButton
              direction="next"
              label="Next short testimonial"
              onClick={() => goBanner(1)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

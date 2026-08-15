"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import FlutedGlass, { getFlutedPreset } from "@/components/ui/fluted-glass";
import { socialProofBanner } from "@/lib/content";

/**
 * Waves geometry (shape: wave, contour distortion, stretch) fused with the
 * hero Folds lighting dial-in — full-bleed, zero margins so the wave reads
 * edge to edge across the banner.
 */
const glassParams = {
  ...getFlutedPreset("Waves").params,
  // Hero lighting / material
  colorBack: "#00000000",
  colorShadow: "#000000",
  colorHighlight: "#ffffff",
  shadows: 0.62,
  highlights: 0,
  blur: 0.49,
  edges: 0.5,
  grainMixer: 0.08,
  grainOverlay: 0.26,
  // Waves structure — full width
  shape: "wave" as const,
  distortionShape: "contour" as const,
  size: 0.78,
  distortion: 0.65,
  stretch: 1,
  angle: 0,
  shift: 0,
  scale: 0.78,
  fit: "cover" as const,
  margin: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
};

function pickRandomImage() {
  const pool = socialProofBanner.images;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function BannerGlass({ src }: { src: string }) {
  const [image, setImage] = useState<HTMLImageElement | string>(src);

  useEffect(() => {
    const img = new window.Image();
    if (src.startsWith("http")) img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return (
    <div aria-hidden className="absolute inset-0">
      <FlutedGlass
        {...glassParams}
        image={image}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 bg-charcoal/40" />
    </div>
  );
}

function Stars() {
  return (
    <div
      className="flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 md:gap-2.5 md:px-3 md:py-2"
      style={{
        background:
          "linear-gradient(90deg, color-mix(in srgb, var(--yellow) 55%, transparent) 0%, color-mix(in srgb, var(--yellow) 22%, transparent) 45%, transparent 100%)",
      }}
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden
          className="h-9 w-9 text-white md:h-14 md:w-14 lg:h-16 lg:w-16"
          initial={{ opacity: 0, y: 10, scale: 0.85 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.4,
            delay: 0.05 * i,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <path
            fill="currentColor"
            d="M12 1.6l2.9 5.88 6.5.94-4.7 4.58 1.11 6.46L12 16.4l-5.81 3.06 1.11-6.46-4.7-4.58 6.5-.94L12 1.6z"
          />
        </motion.svg>
      ))}
    </div>
  );
}

/**
 * Social-proof snap band between Contact and FAQ: random image under
 * full-width wave glass, white stars, booking CTA.
 */
export function SocialProofBanner() {
  const [bg, setBg] = useState(socialProofBanner.images[0]!);

  useEffect(() => {
    setBg(pickRandomImage());
  }, []);

  return (
    <section
      id="social-proof"
      aria-label="Client satisfaction"
      className="relative flex min-h-[180px] items-center overflow-hidden border-t border-charcoal/10 py-8 md:h-[28svh] md:min-h-[220px] md:snap-start md:py-0 lg:min-h-[240px]"
    >
      <BannerGlass src={bg.src} />
      <span className="sr-only">{bg.alt}</span>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 md:px-8">
        <Stars />

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-4 sm:gap-6">
          <p className="max-w-[18ch] text-right font-display text-2xl leading-[1.1] tracking-wide text-white lowercase sm:max-w-none sm:text-3xl md:text-4xl">
            {socialProofBanner.headline}
          </p>
          <a
            href={socialProofBanner.href}
            className="inline-flex shrink-0 items-center bg-white px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-yellow"
          >
            {socialProofBanner.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

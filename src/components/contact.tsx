"use client";

import { motion } from "motion/react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const markMask: React.CSSProperties = {
  maskImage: "url(/logo-emboss.svg)",
  maskRepeat: "no-repeat",
  maskSize: "contain",
  WebkitMaskImage: "url(/logo-emboss.svg)",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
};

function EmbossedMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-0 aspect-[734/767] select-none",
        className,
      )}
    >
      <div
        className="absolute inset-0 -translate-x-[2px] -translate-y-[2px] bg-charcoal/[0.06]"
        style={markMask}
      />
      <div
        className="absolute inset-0 translate-x-[2px] translate-y-[2px] bg-white/60"
        style={markMask}
      />
      <div className="absolute inset-0 bg-ground" style={markMask} />
    </div>
  );
}

function calendlyEmbedSrc(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("primary_color", "231f20");
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Contact / schedule — booking theater.
 * Calendly owns the section; copy and brand frame it.
 */
export function Contact() {
  const embedSrc = calendlyEmbedSrc(site.bookCallUrl);

  return (
    <section
      id="contact"
      className="relative flex flex-1 flex-col overflow-hidden border-t border-charcoal/10 bg-ground"
    >
      <EmbossedMark className="top-[8%] right-[-12%] w-[min(70vw,520px)] opacity-90 md:top-[4%] md:right-[-6%] md:w-[min(48vw,560px)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 md:px-8 md:py-20">
        <motion.div
          className="relative mb-10 max-w-3xl md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="max-w-[14ch] font-display text-4xl leading-[1.05] tracking-wide text-charcoal lowercase md:text-5xl lg:text-6xl">
            book a call
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-charcoal/65 md:mt-5 md:text-lg">
            Pick a time. We’ll talk conversion, custom Shopify craft, and
            whether Fluted is the right build partner.
          </p>
          <p className="mt-5 text-sm text-charcoal/70">
            Prefer email?{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-charcoal underline decoration-charcoal/25 underline-offset-4 transition hover:decoration-coral"
            >
              {site.email}
            </a>
          </p>
        </motion.div>

        <motion.div
          className="relative flex min-h-[640px] flex-1 flex-col overflow-hidden bg-white shadow-[0_28px_70px_rgba(35,31,32,0.12)] md:min-h-[720px]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div aria-hidden className="flex h-1.5 w-full shrink-0">
            <span className="flex-1 bg-coral" />
            <span className="flex-1 bg-yellow" />
            <span className="flex-1 bg-purple" />
          </div>

          <div className="flex items-end justify-between gap-4 border-b border-charcoal/10 px-5 py-3.5 md:px-6">
            <div>
              <p className="font-display text-xl tracking-wide text-charcoal lowercase md:text-2xl">
                schedule
              </p>
              <p className="mt-0.5 text-[11px] tracking-[0.14em] text-charcoal/55 uppercase">
                30 min · discovery
              </p>
            </div>
            <p className="hidden text-right text-xs text-charcoal/55 sm:block">
              Replace Calendly URL in content
            </p>
          </div>

          <iframe
            title="Schedule a call with Fluted"
            src={embedSrc}
            className="h-full min-h-[560px] w-full flex-1 border-0 md:min-h-[640px]"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

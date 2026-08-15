"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqItems } from "@/lib/content";
import { cn } from "@/lib/utils";

const accentBar = {
  coral: "bg-coral",
  yellow: "bg-yellow",
  purple: "bg-purple",
} as const;

type Accent = keyof typeof accentBar;

/**
 * FAQ — fit & positioning before booking.
 * Accordion on ground; Bitcount title; refraction accent on the open row.
 */
export function Faq() {
  const labelId = useId();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section
      id="faq"
      aria-labelledby={labelId}
      className="flex flex-1 flex-col justify-center border-t border-charcoal/10 bg-ground px-6 py-20 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 lg:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <h2
            id={labelId}
            className="max-w-[8ch] font-display text-4xl leading-[1.05] tracking-wide text-charcoal lowercase md:text-5xl lg:text-6xl"
          >
            faq
          </h2>
          <p className="mt-4 max-w-[32ch] text-base leading-relaxed text-charcoal/75 md:mt-5 md:text-lg">
            Clear the fit questions before you book — who we’re for, what custom
            means, and what the call is for.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center bg-charcoal px-5 py-2.5 text-sm text-ground transition-colors hover:bg-coral"
          >
            Book a call
          </a>
        </div>

        <div className="border-t border-charcoal/10">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            const accent = item.accent as Accent;

            return (
              <div
                key={item.id}
                className="relative border-b border-charcoal/10"
              >
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 top-0 h-1",
                        accentBar[accent],
                      )}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </AnimatePresence>

                <h3>
                  <button
                    type="button"
                    id={`faq-trigger-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() =>
                      setOpenId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left md:py-6"
                  >
                    <span className="text-base font-semibold tracking-tight text-charcoal md:text-lg">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center font-display text-xl leading-none transition-colors",
                        isOpen
                          ? cn(
                              accentBar[accent],
                              accent === "yellow"
                                ? "text-charcoal"
                                : "text-ground",
                            )
                          : "bg-white text-charcoal/70 ring-1 ring-charcoal/15 group-hover:text-charcoal",
                      )}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[52ch] pb-6 text-base leading-relaxed text-charcoal/75 md:pb-7">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

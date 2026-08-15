"use client";

import { useState } from "react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Placeholder team portraits — replace with real Fluted faces when available. */
const TEAM_AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=160&auto=format&fit=crop",
    alt: "Placeholder team portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=160&auto=format&fit=crop",
    alt: "Placeholder team portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=160&auto=format&fit=crop",
    alt: "Placeholder team portrait",
  },
] as const;

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

type TalkToTeamCardProps = {
  className?: string;
  /** When true, CTA expands an in-place Calendly embed. */
  embedOnClick?: boolean;
  /** Used when embedOnClick is false — e.g. open unlock modal. */
  onCtaClick?: () => void;
};

/**
 * Persuade card — avatar stack, title, short copy, Fluted primary CTA.
 */
export function TalkToTeamCard({
  className,
  embedOnClick = true,
  onCtaClick,
}: TalkToTeamCardProps) {
  const [showBooking, setShowBooking] = useState(false);
  const embedSrc = calendlyEmbedSrc(site.bookCallUrl);

  function handleCta() {
    if (embedOnClick) {
      setShowBooking((v) => !v);
      return;
    }
    onCtaClick?.();
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-charcoal px-6 py-7 text-ground md:px-7 md:py-8">
        <ul className="flex items-center" aria-label="Fluted team">
          {TEAM_AVATARS.map((person, i) => (
            <li
              key={person.src}
              className={cn(
                "relative h-11 w-11 overflow-hidden rounded-full border-2 border-charcoal",
                i > 0 && "-ml-3",
              )}
              style={{ zIndex: TEAM_AVATARS.length - i }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={person.src}
                alt={person.alt}
                className="h-full w-full object-cover"
                width={44}
                height={44}
              />
            </li>
          ))}
        </ul>

        <h3 className="mt-5 max-w-[16ch] font-sans text-2xl font-semibold leading-[1.15] tracking-tight text-ground md:text-[1.65rem]">
          Fix what&apos;s holding your website back
        </h3>
        <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ground/75 md:text-[0.95rem]">
          Book a free consulting call and see how we can help improve your
          website.
        </p>

        <button
          type="button"
          aria-expanded={embedOnClick ? showBooking : undefined}
          onClick={handleCta}
          className="mt-6 inline-flex items-center bg-ground px-5 py-3 text-sm text-charcoal transition-colors hover:bg-coral hover:text-ground"
        >
          Book a call
        </button>
      </div>

      {embedOnClick && showBooking && (
        <div className="overflow-hidden border border-charcoal/10 border-t-0 bg-white">
          <div aria-hidden className="flex h-1 w-full">
            <span className="flex-1 bg-coral" />
            <span className="flex-1 bg-yellow" />
            <span className="flex-1 bg-purple" />
          </div>
          <p className="border-b border-charcoal/10 px-4 py-3 font-sans text-base font-semibold text-charcoal">
            Talk to the team about your website
          </p>
          <iframe
            title="Talk to the Fluted team about your website"
            src={embedSrc}
            className="h-[520px] w-full border-0 md:h-[560px]"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

export function StickyCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 transition-[transform,opacity] duration-300 ease-out",
        hidden
          ? "pointer-events-none translate-y-full opacity-0"
          : "translate-y-0 opacity-100",
      )}
    >
      <div className="border-t border-ground/10 bg-charcoal/95 text-ground shadow-[0_-12px_40px_rgba(35,31,32,0.35)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] md:px-8 md:py-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ground md:text-base">
              Ready to refract your store?
            </p>
            <p className="mt-0.5 hidden text-xs text-ground/75 sm:block">
              Book a call — custom Shopify builds that convert.
            </p>
          </div>
          <Magnetic intensity={0.3} range={70}>
            <a
              href={site.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center bg-ground px-5 py-2.5 text-sm text-charcoal transition-colors hover:bg-coral hover:text-ground"
            >
              Schedule a call
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}

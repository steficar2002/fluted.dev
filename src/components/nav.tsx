import Image from "next/image";
import { site } from "@/lib/content";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#method", label: "Method" },
  { href: "/#free-audit", label: "Audit" },
  { href: "/#contact", label: "Contact" },
];

/** Light nav chrome for sitting on the dark glass hero band. */
export function Nav({
  variant = "on-dark",
}: {
  variant?: "on-dark" | "on-light";
}) {
  const onLight = variant === "on-light";

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50",
        onLight
          ? "sticky border-b border-charcoal/10 bg-ground/95 backdrop-blur-md"
          : "absolute",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
        <a
          href={onLight ? "/" : "/#top"}
          className="relative h-7 w-[120px]"
          aria-label={site.name}
        >
          <Image
            src="/logo.svg"
            alt={site.name}
            fill
            className={cn(
              "object-contain object-left",
              onLight ? "" : "brightness-0 invert",
            )}
            priority
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                onLight
                  ? "text-charcoal/70 hover:text-charcoal"
                  : "text-ground/85 hover:text-ground",
              )}
            >
              {link.label}
            </a>
          ))}
          <Magnetic intensity={0.35} range={80}>
            <a
              href={site.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center px-4 py-2 text-sm transition-colors",
                onLight
                  ? "bg-charcoal text-ground hover:bg-coral"
                  : "bg-ground text-charcoal hover:bg-yellow",
              )}
            >
              Book a call
            </a>
          </Magnetic>
        </div>

        <a
          href={site.bookCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "px-3 py-2 text-xs md:hidden",
            onLight
              ? "bg-charcoal text-ground"
              : "bg-ground text-charcoal",
          )}
        >
          Book a call
        </a>
      </nav>
    </header>
  );
}

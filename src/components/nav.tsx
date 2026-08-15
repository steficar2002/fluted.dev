import Image from "next/image";
import { site } from "@/lib/content";
import { Magnetic } from "@/components/motion/magnetic";

const links = [
  { href: "#work", label: "Work" },
  { href: "#method", label: "Method" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
];

/** Light nav chrome for sitting on the dark glass hero band. */
export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
        <a href="#top" className="relative h-7 w-[120px]" aria-label={site.name}>
          <Image
            src="/logo.svg"
            alt={site.name}
            fill
            className="object-contain object-left brightness-0 invert"
            priority
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ground/85 transition-colors hover:text-ground"
            >
              {link.label}
            </a>
          ))}
          <Magnetic intensity={0.35} range={80}>
            <a
              href={site.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-ground px-4 py-2 text-sm text-charcoal transition-colors hover:bg-yellow"
            >
              Book a call
            </a>
          </Magnetic>
        </div>

        <a
          href={site.bookCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ground px-3 py-2 text-xs text-charcoal md:hidden"
        >
          Book a call
        </a>
      </nav>
    </header>
  );
}

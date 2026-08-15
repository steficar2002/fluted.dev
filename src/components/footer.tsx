import Image from "next/image";
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-white px-6 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative h-6 w-[100px]">
          <Image
            src="/logo.svg"
            alt={site.name}
            fill
            className="object-contain object-left"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal/70">
          <a href={`mailto:${site.email}`} className="hover:text-charcoal">
            {site.email}
          </a>
          <a href="#work" className="hover:text-charcoal">
            Work
          </a>
          <a href="#contact" className="hover:text-charcoal">
            Contact
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type TextEffectProps = {
  children: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  preset?: "fade" | "slide" | "blur";
  delay?: number;
  per?: "word" | "char";
};

export function TextEffect({
  children,
  className,
  as = "p",
  preset = "fade",
  delay = 0,
  per = "word",
}: TextEffectProps) {
  const Tag = motion[as];
  const segments =
    per === "char" ? children.split("") : children.split(/(\s+)/);

  const itemHidden =
    preset === "blur"
      ? { opacity: 0, filter: "blur(8px)", y: 8 }
      : preset === "slide"
        ? { opacity: 0, y: 16 }
        : { opacity: 0, y: 8 };

  return (
    <Tag className={cn(className)} aria-label={children}>
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          className="inline-block whitespace-pre"
          aria-hidden="true"
          initial={itemHidden}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.45,
            delay: delay + index * (per === "char" ? 0.02 : 0.04),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {segment}
        </motion.span>
      ))}
    </Tag>
  );
}

"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  type Transition,
  type UseInViewOptions,
  type Variant,
} from "motion/react";

export type InViewProps = {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  once?: boolean;
  className?: string;
};

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  viewOptions = { margin: "-80px" },
  as = "div",
  once = true,
  className,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);
  const [isViewed, setIsViewed] = useState(false);
  const MotionComponent = motion.create(as);

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView || isViewed ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      className={className}
      onAnimationComplete={() => {
        if (once) setIsViewed(true);
      }}
    >
      {children}
    </MotionComponent>
  );
}

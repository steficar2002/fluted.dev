"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FlutedGlass, { getFlutedPreset } from "@/components/ui/fluted-glass";
import { Magnetic } from "@/components/motion/magnetic";
import { workProjects } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Same Folds dial-in as the hero glass. */
const glassParams = {
  ...getFlutedPreset("Folds").params,
  colorBack: "#00000000",
  colorShadow: "#000000",
  colorHighlight: "#ffffff",
  shadows: 0.62,
  highlights: 0,
  size: 0.66,
  shape: "lines" as const,
  angle: 0,
  distortionShape: "lens" as const,
  distortion: 0.75,
  shift: 0,
  stretch: 0,
  blur: 0.49,
  edges: 0.5,
  margin: 0.1,
  marginLeft: 0.1,
  marginRight: 0.1,
  marginTop: 0.1,
  marginBottom: 0.1,
  grainMixer: 0.08,
  grainOverlay: 0.26,
  scale: 1.17,
  fit: "cover" as const,
};

const accentText = {
  coral: "text-coral",
  purple: "text-purple",
  yellow: "text-charcoal",
} as const;

const accentBg = {
  coral: "bg-coral text-ground hover:bg-charcoal",
  purple: "bg-purple text-ground hover:bg-charcoal",
  yellow: "bg-yellow text-charcoal hover:bg-charcoal hover:text-ground",
} as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function CoverGlass({ src, intensified }: { src: string; intensified: boolean }) {
  const [image, setImage] = useState<HTMLImageElement | string>(src);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return (
    <div className="absolute inset-0">
      <FlutedGlass
        {...glassParams}
        image={image}
        style={{ width: "100%", height: "100%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-charcoal/20"
        animate={{ opacity: intensified ? 0.45 : 0.28 }}
        transition={{ duration: 0.45 }}
      />
    </div>
  );
}

export function CaseStudies() {
  const labelId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [entering, setEntering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const project = workProjects[active];

  function selectProject(index: number) {
    if (index === active && !entered) return;
    setEntered(false);
    setEntering(false);
    setActive(index);
  }

  function enterProject() {
    if (entered || entering) return;
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    setEntering(true);
    window.setTimeout(() => {
      setEntering(false);
      setEntered(true);
    }, 520);
  }

  function exitProject() {
    setEntered(false);
    setEntering(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > 80;
      if (!inView) return;

      if (e.key === "Escape" && entered) {
        e.preventDefault();
        exitProject();
        return;
      }
      if (entered) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        selectProject((active + 1) % workProjects.length);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        selectProject((active - 1 + workProjects.length) % workProjects.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        enterProject();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, entered, entering, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby={labelId}
      className="relative flex min-h-[100svh] flex-col border-t border-charcoal/10 bg-charcoal md:snap-start"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
          <h2
            id={labelId}
            className="max-w-[14ch] text-3xl font-semibold tracking-tight text-ground md:text-4xl lg:text-5xl"
          >
            Check our work
          </h2>
          <p className="text-[10px] tracking-[0.18em] text-ground/40 uppercase">
            Placeholder projects — replace later
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)] md:gap-8">
          {/* Cover stage */}
          <div className="relative min-h-[52vh] overflow-hidden bg-charcoal md:min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Base image shows through when glass lifts */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.cover})` }}
                  role="img"
                  aria-label={project.coverAlt}
                />

                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: entered ? 0 : 1,
                    clipPath: entered
                      ? "inset(0 0 100% 0)"
                      : entering
                        ? "inset(8% 6% 8% 6%)"
                        : "inset(0 0 0 0)",
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CoverGlass src={project.cover} intensified={entering} />
                </motion.div>

                {/* Idle chrome */}
                {!entered && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent p-5 pt-16 md:p-7 md:pt-20">
                    <p className="font-display text-3xl tracking-wide text-ground lowercase md:text-4xl">
                      {project.name}
                    </p>
                    <p className="mt-1 text-sm text-ground/80">{project.focus}</p>
                  </div>
                )}

                {!entered && (
                  <div className="absolute top-4 right-4 z-10 md:top-5 md:right-5">
                    <Magnetic intensity={0.35} range={70}>
                      <button
                        type="button"
                        onClick={enterProject}
                        className="pointer-events-auto bg-ground px-4 py-2.5 text-sm text-charcoal transition-colors hover:bg-coral hover:text-ground"
                      >
                        Enter project
                      </button>
                    </Magnetic>
                  </div>
                )}

                {/* Revealed project layer */}
                <AnimatePresence>
                  {entered && (
                    <motion.div
                      className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/20 p-6 md:p-8"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        onClick={exitProject}
                        className="absolute top-4 right-4 text-sm text-ground/70 transition-colors hover:text-ground"
                      >
                        Close
                      </button>

                      <p className="font-display text-4xl tracking-wide text-ground lowercase md:text-5xl">
                        {project.name}
                      </p>
                      <p className="mt-2 text-sm text-ground/65">{project.focus}</p>
                      <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ground/85">
                        {project.description}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <Magnetic intensity={0.4} range={80}>
                          <a
                            href={project.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
                              accentBg[project.accent],
                            )}
                          >
                            {project.siteLabel}
                            <span aria-hidden>↗</span>
                          </a>
                        </Magnetic>
                        <p
                          className={cn(
                            "font-display text-3xl leading-none tracking-wide",
                            project.accent === "yellow"
                              ? "text-yellow"
                              : accentText[project.accent],
                          )}
                        >
                          {project.metric}
                        </p>
                        <span className="text-[10px] tracking-[0.16em] text-ground/40 uppercase">
                          Demo metric · placeholder URL
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Project index */}
          <div
            role="tablist"
            aria-label="Projects"
            className="flex flex-row gap-3 md:flex-col md:gap-4"
          >
            {workProjects.map((item, i) => {
              const isActive = active === i;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectProject(i)}
                  className={cn(
                    "group relative min-h-[5.5rem] flex-1 overflow-hidden text-left transition-opacity md:min-h-0 md:flex-[1]",
                    isActive ? "opacity-100" : "opacity-55 hover:opacity-85",
                  )}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.cover})` }}
                  />
                  <div className="absolute inset-0 bg-charcoal/45 group-hover:bg-charcoal/35" />
                  {isActive && (
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 w-1",
                        item.accent === "coral" && "bg-coral",
                        item.accent === "purple" && "bg-purple",
                        item.accent === "yellow" && "bg-yellow",
                      )}
                    />
                  )}
                  <div className="relative flex h-full flex-col justify-end p-3 md:p-4">
                    <span className="font-display text-lg tracking-wide text-ground lowercase md:text-2xl">
                      {item.name}
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-[11px] text-ground/65 md:text-xs">
                      {item.focus}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { animate, stagger } from "animejs";

import { DURATION } from "@/components/motion/fitpet-motion";
import { useAnimeScope } from "@/components/motion/use-anime";

export function AnimeDemoCard() {
  const rootRef = useAnimeScope<HTMLElement>((_scope, _root, reducedMotion) => {
    if (reducedMotion) return;

    animate(".anime-demo-card__item", {
      opacity: [0, 1],
      translateY: [14, 0],
      scale: [0.98, 1],
      delay: stagger(80),
      duration: DURATION.slow,
      ease: "out(3)",
    });

    animate(".anime-demo-card__spark", {
      rotate: ["-8deg", "8deg"],
      translateY: [0, -5],
      alternate: true,
      loop: true,
      duration: DURATION.ambient,
      ease: "inOutSine",
    });
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Anime.js animation demo"
      style={{
        display: "grid",
        gap: 12,
        padding: 18,
        borderRadius: 24,
        border: "1px solid rgba(24, 24, 24, 0.08)",
        background: "rgba(255, 250, 238, 0.78)",
        boxShadow: "0 18px 50px rgba(45, 30, 14, 0.08)",
      }}
    >
      <strong className="anime-demo-card__item">Anime.js ready</strong>
      <span className="anime-demo-card__item">Scoped animations clean up automatically on unmount.</span>
      <span className="anime-demo-card__spark" aria-hidden="true">
        +12 XP
      </span>
    </section>
  );
}

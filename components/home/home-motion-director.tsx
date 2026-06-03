"use client";

import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { animate as animeAnimate, stagger as animeStagger } from "animejs";
import { type ReactNode, useEffect, useRef } from "react";

type HomeMotionDirectorProps = {
  children: ReactNode;
};

const sparkTones = ["mint", "blue", "yolk", "coral", "pink"] as const;

export function HomeMotionDirector({ children }: HomeMotionDirectorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sparkLayerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const sparkLayer = sparkLayerRef.current;
    if (!root || !sparkLayer || reduceMotion) return;

    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      gsap.from(".home-topbar", {
        autoAlpha: 0,
        y: -18,
        duration: 0.48,
        ease: "power4.out"
      });

      gsap.from(".daily-panel, .character-panel, .action-panel", {
        autoAlpha: 0,
        y: 34,
        rotation: (index) => [-1.4, 0.8, 1.2][index] ?? 0,
        scale: 0.96,
        duration: 0.68,
        ease: "power4.out",
        stagger: 0.075,
        delay: 0.08
      });

      gsap.from(".body-stat-control, .route-card, .action-tile", {
        autoAlpha: 0,
        y: 22,
        scale: 0.94,
        duration: 0.52,
        ease: "power3.out",
        stagger: { each: 0.035, from: "center" },
        delay: 0.18
      });

      gsap.to(".home-launch-overlay", {
        autoAlpha: 0,
        y: -22,
        scale: 1.04,
        duration: 0.72,
        ease: "power4.out",
        delay: 0.36
      });

      const magneticItems = gsap.utils.toArray<HTMLElement>(
        ".daily-panel, .character-panel, .action-panel, .route-card, .body-stat-control, .action-tile, .today-pill, .profile-entry"
      );

      magneticItems.forEach((item, index) => {
        const xTo = gsap.quickTo(item, "--card-mx", { duration: 0.42, ease: "power3.out" });
        const yTo = gsap.quickTo(item, "--card-my", { duration: 0.42, ease: "power3.out" });
        const rTo = gsap.quickTo(item, "--card-r", { duration: 0.42, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const rect = item.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          xTo(x * 11);
          yTo(y * 9);
          rTo(x * 2.4);
        };

        const onEnter = (event: PointerEvent) => {
          spawnSparks(root, sparkLayer, event.clientX, event.clientY, index);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
          rTo(0);
        };

        item.addEventListener("pointermove", onMove);
        item.addEventListener("pointerenter", onEnter);
        item.addEventListener("pointerleave", onLeave);

        cleanups.push(() => {
          item.removeEventListener("pointermove", onMove);
          item.removeEventListener("pointerenter", onEnter);
          item.removeEventListener("pointerleave", onLeave);
        });
      });
    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, [reduceMotion]);

  return (
    <motion.div
      ref={rootRef}
      className="home-motion-root"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="home-launch-overlay" aria-hidden="true">
        <span>Fit-Pet Gym Cabin</span>
        <i />
      </div>
      <div className="home-spark-layer" ref={sparkLayerRef} aria-hidden="true" />
      {children}
    </motion.div>
  );
}

function spawnSparks(root: HTMLElement, layer: HTMLElement, clientX: number, clientY: number, seed: number) {
  const rect = root.getBoundingClientRect();
  const particles = Array.from({ length: 7 }, (_, index) => {
    const node = document.createElement("span");
    node.className = `home-spark tone-${sparkTones[(index + seed) % sparkTones.length]}`;
    node.style.left = `${clientX - rect.left}px`;
    node.style.top = `${clientY - rect.top}px`;
    layer.appendChild(node);
    return node;
  });

  animeAnimate(particles, {
    x: () => gsap.utils.random(-42, 42, 1),
    y: () => gsap.utils.random(-50, 24, 1),
    scale: [0.15, 1.06, 0],
    opacity: [0, 1, 0],
    rotate: () => gsap.utils.random(-72, 72, 1),
    duration: 620,
    delay: animeStagger(22, { from: "center" }),
    ease: "out(4)",
    onComplete: () => particles.forEach((particle) => particle.remove())
  });
}

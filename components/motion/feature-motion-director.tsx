"use client";

import { animate as animeAnimate, stagger as animeStagger } from "animejs";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import { KineticGymBackground } from "@/components/home/kinetic-gym-background";

type FeatureMotionVariant =
  | "training"
  | "nutrition"
  | "booking"
  | "body"
  | "venue"
  | "membership"
  | "profile";

type FeatureMotionDirectorProps = {
  variant: FeatureMotionVariant;
};

const sparkTones = ["mint", "blue", "yolk", "coral", "pink"] as const;

export function FeatureMotionDirector({ variant }: FeatureMotionDirectorProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const sparkLayerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    const sparkLayer = sparkLayerRef.current;
    const page = layer?.closest<HTMLElement>(".feature-page, .profile-page");
    if (!layer || !sparkLayer || !page) return;

    page.classList.add("feature-motion-page", `feature-motion-${variant}`);

    if (reduceMotion) {
      return () => {
        page.classList.remove("feature-motion-page", `feature-motion-${variant}`);
      };
    }

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.from(".feature-back, .profile-back, .profile-header", {
        autoAlpha: 0,
        y: -18,
        duration: 0.46,
        ease: "power4.out",
      });

      gsap.from(".feature-panel, .profile-summary", {
        autoAlpha: 0,
        y: 34,
        scale: 0.965,
        rotation: -0.65,
        duration: 0.68,
        ease: "power4.out",
        delay: 0.04,
      });

      gsap.from(".feature-heading, .feature-toolbar, .profile-header-actions", {
        autoAlpha: 0,
        y: 18,
        duration: 0.48,
        ease: "power3.out",
        stagger: 0.04,
        delay: 0.12,
      });

      gsap.from(
        ".feature-data, .feature-list, .feature-form, .profile-tile, .profile-form-card, .fitpet-record-table-wrap",
        {
          autoAlpha: 0,
          y: 26,
          scale: 0.95,
          rotation: (index) => (index % 2 === 0 ? -0.65 : 0.55),
          duration: 0.54,
          ease: "power3.out",
          stagger: { each: 0.035, from: "start" },
          delay: 0.18,
        },
      );

      gsap.from(".feature-row, .fitpet-record-table tbody tr, .profile-mini-list p", {
        autoAlpha: 0,
        x: -18,
        duration: 0.42,
        ease: "power3.out",
        stagger: { each: 0.026, from: "start" },
        delay: 0.28,
      });

      const magneticItems = gsap.utils.toArray<HTMLElement>(
        ".feature-back, .feature-data, .feature-list, .feature-form, .feature-row, .profile-back, .profile-tile, .profile-form-card, .profile-plain-button, .profile-summary",
      );

      magneticItems.forEach((item, index) => {
        const xTo = gsap.quickTo(item, "--card-mx", { duration: 0.42, ease: "power3.out" });
        const yTo = gsap.quickTo(item, "--card-my", { duration: 0.42, ease: "power3.out" });
        const rTo = gsap.quickTo(item, "--card-r", { duration: 0.42, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const rect = item.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          xTo(x * 10);
          yTo(y * 8);
          rTo(x * 2.1);
        };

        const onEnter = (event: PointerEvent) => {
          spawnFeatureSparks(page, sparkLayer, event.clientX, event.clientY, index);
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
    }, page);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
      page.classList.remove("feature-motion-page", `feature-motion-${variant}`);
    };
  }, [reduceMotion, variant]);

  return (
    <div
      ref={layerRef}
      className={`feature-motion-layer feature-motion-layer--${variant}`}
      aria-hidden="true"
    >
      <KineticGymBackground />
      <div className="feature-motion-orbit" />
      <div className="feature-motion-spark-layer" ref={sparkLayerRef} />
    </div>
  );
}

function spawnFeatureSparks(root: HTMLElement, layer: HTMLElement, clientX: number, clientY: number, seed: number) {
  const rect = root.getBoundingClientRect();
  const particles = Array.from({ length: 6 }, (_, index) => {
    const node = document.createElement("span");
    node.className = `feature-motion-spark tone-${sparkTones[(index + seed) % sparkTones.length]}`;
    node.style.left = `${clientX - rect.left}px`;
    node.style.top = `${clientY - rect.top}px`;
    layer.appendChild(node);
    return node;
  });

  animeAnimate(particles, {
    x: () => gsap.utils.random(-38, 38, 1),
    y: () => gsap.utils.random(-48, 18, 1),
    scale: [0.16, 1.05, 0],
    opacity: [0, 1, 0],
    rotate: () => gsap.utils.random(-82, 82, 1),
    duration: 560,
    delay: animeStagger(20, { from: "center" }),
    ease: "out(4)",
    onComplete: () => particles.forEach((particle) => particle.remove()),
  });
}

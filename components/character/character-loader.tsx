"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { CharacterGender } from "@/lib/home-model";
import { treadmillRunnerSrc } from "@/lib/character-assets";

type CharacterLoaderProps = {
  gender?: CharacterGender;
  title?: string;
  message?: string;
};

const steps = Array.from({ length: 5 }, (_, i) => i);

export function CharacterLoader({
  gender = "girl",
  title = "健身伙伴正在跑步热身",
  message = "正在同步你的训练、饮食和身体数据..."
}: CharacterLoaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="loading-screen" role="status" aria-live="polite" aria-label={title}>
      <span className="sr-only">{message}</span>
      <div className="loading-scene" aria-hidden="true">
        <motion.div
          className="loading-sun"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <div className="loading-track">
          <motion.i
            animate={reduceMotion ? undefined : { x: ["-18%", "118%"] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
          <motion.i
            animate={reduceMotion ? undefined : { x: ["-55%", "82%"] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear", delay: 0.28 }}
          />
        </div>

        <motion.div
          className="loading-runner"
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 0.52, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 88%" }}
        >
          <Image
            src={gender === "girl" ? treadmillRunnerSrc : "/assets/characters/fitpet-boy-chibi-cut.png"}
            alt=""
            width={512}
            height={512}
            priority
          />
        </motion.div>

        <div className="loading-steps">
          {steps.map((step) => (
            <motion.span
              key={step}
              animate={reduceMotion ? undefined : {
                opacity: [0.1, 0.62, 0.1],
                scale: [0.85, 1, 0.85]
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: step * 0.13,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

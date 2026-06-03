"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CharacterGender } from "@/lib/home-model";

type LoadingScreenProps = {
  gender?: CharacterGender;
  title?: string;
  message?: string;
};

const pawSteps = Array.from({ length: 7 }, (_, index) => index);
const jellyBubbles = Array.from({ length: 4 }, (_, index) => index);

export function LoadingScreen({
  gender: _gender = "girl",
  title = "健身伙伴正在热身",
  message = "正在同步你的训练、饮食和身体数据..."
}: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="loading-screen" role="status" aria-live="polite" aria-label={title}>
      <span className="sr-only">
        {title}。{message}
      </span>
      <div className="loading-card">
        <div className="loading-scene" aria-hidden="true">
          <motion.div
            className="loading-sun"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="loading-dumbbell"
            animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [-8, 7, -8] }}
            transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
          >
            <span />
          </motion.div>

          <svg className="loading-pet-shadow" viewBox="0 0 96 74" role="presentation">
            <path d="M22 43C21 25 33 15 48 17C64 18 75 29 74 47C73 61 63 68 47 67C31 66 23 58 22 43Z" />
            <path d="M28 34C20 19 28 11 40 17C45 20 47 25 47 31C51 24 56 18 64 18C75 18 80 29 70 41" />
            <circle cx="39" cy="42" r="4" />
            <circle cx="58" cy="43" r="4" />
            <path d="M42 54C46 57 52 57 56 54" />
          </svg>

          <div className="loading-track">
            <motion.i
              animate={reduceMotion ? undefined : { x: ["-28%", "116%"] }}
              transition={{ duration: 0.82, repeat: Infinity, ease: "linear" }}
            />
            <motion.i
              animate={reduceMotion ? undefined : { x: ["-52%", "92%"] }}
              transition={{ duration: 0.82, repeat: Infinity, ease: "linear", delay: 0.18 }}
            />
          </div>

          <div className="loading-steps">
            {pawSteps.map((step) => (
              <motion.span
                key={step}
                animate={reduceMotion ? undefined : { opacity: [0.14, 0.9, 0.14], scale: [0.78, 1, 0.78], y: [2, -3, 2] }}
                transition={{ duration: 0.78, repeat: Infinity, delay: step * 0.08, ease: "easeInOut" }}
              />
            ))}
          </div>

          <div className="loading-jelly-progress">
            <motion.i
              animate={reduceMotion ? undefined : { scaleX: [0.28, 0.84, 0.46, 1] }}
              transition={{ duration: 1.36, repeat: Infinity, ease: "easeInOut" }}
            />
            {jellyBubbles.map((bubble) => (
              <motion.b
                key={bubble}
                animate={reduceMotion ? undefined : { x: [0, 74], opacity: [0, 1, 0], scale: [0.66, 1, 0.66] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: bubble * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>

        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </section>
  );
}

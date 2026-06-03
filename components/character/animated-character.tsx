"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { CharacterGender, CharacterMood } from "@/lib/home-model";
import { characterImageSrc } from "@/lib/character-assets";
import { EASE, MOOD_PROFILE } from "@/components/motion/fitpet-motion";

export type AnimatedCharacterProps = {
  gender: CharacterGender;
  mood: CharacterMood;
  reducedMotion?: boolean;
  scale?: number;
  priority?: boolean;
  className?: string;
};

const altByGender: Record<CharacterGender, string> = {
  girl: "FitPet girl fitness companion",
  boy: "FitPet boy fitness companion"
};

const settleByMood: Record<CharacterMood, { y: number[]; rotate: number[]; scaleY: number[]; duration: number }> = {
  workoutBefore: { y: [0, -3, 0], rotate: [0, -0.7, 0.7, 0], scaleY: [1, 1.012, 1], duration: 3.4 },
  workoutAfter: { y: [0, -10, 0, -7, 0], rotate: [-1.8, 2, -1.4, 1.4, -1.8], scaleY: [1, 1.026, 0.996, 1.018, 1], duration: 1.2 },
  calorieLow: { y: [0, 2, 0], rotate: [-1.2, 0.7, -1.2], scaleY: [1, 0.992, 1], duration: 2.8 },
  calorieBalanced: { y: [0, -4, 0], rotate: [0, -0.5, 0.5, 0], scaleY: [1, 1.01, 1], duration: 3.1 },
  calorieHigh: { y: [0, -5, 0, 2, 0], rotate: [0, -2, 2, -1, 0], scaleY: [1, 1.018, 0.996, 1], duration: 1.8 }
};

const blinkTop: Record<CharacterGender, string> = {
  girl: "28.8%",
  boy: "30.4%"
};

const blinkLeft: Record<CharacterGender, string> = {
  girl: "36.4%",
  boy: "36.8%"
};

const blinkWidth: Record<CharacterGender, string> = {
  girl: "29%",
  boy: "29%"
};

const blinkTint: Record<CharacterGender, string> = {
  girl: "rgba(255, 221, 205, 0.82)",
  boy: "rgba(255, 219, 188, 0.82)"
};

function FootBeats({ mood, reducedMotion }: { mood: CharacterMood; reducedMotion: boolean }) {
  if (reducedMotion || (mood !== "workoutAfter" && mood !== "calorieBalanced")) return null;

  return (
    <div className="preserved-character__steps" aria-hidden="true">
      {[0, 1, 2].map((step) => (
        <motion.span
          key={step}
          animate={{ opacity: [0, 0.46, 0], scaleX: [0.7, 1, 1.24], x: [18, 0, -18] }}
          transition={{ duration: mood === "workoutAfter" ? 0.74 : 1.1, repeat: Infinity, delay: step * 0.2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function MoodAccent({ mood, reducedMotion }: { mood: CharacterMood; reducedMotion: boolean }) {
  if (mood !== "workoutAfter" && mood !== "calorieLow" && mood !== "calorieBalanced" && mood !== "calorieHigh") return null;

  const marks = mood === "calorieBalanced" ? ["spark-a", "spark-b", "spark-c"] : mood === "calorieLow" ? ["fuel-a", "fuel-b"] : mood === "calorieHigh" ? ["fuel-a", "spark-b"] : ["speed-a", "speed-b"];

  return (
    <div className={`preserved-character__accent preserved-character__accent--${mood}`} aria-hidden="true">
      {marks.map((mark, index) => (
        <motion.i
          key={mark}
          className={mark}
          animate={reducedMotion ? undefined : { opacity: [0, 1, 0], y: [8, -8, -18], scale: [0.82, 1, 0.9] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.18, ease: EASE.out }}
        />
      ))}
    </div>
  );
}

export function AnimatedCharacter({
  gender,
  mood,
  reducedMotion,
  scale = 1,
  priority = false,
  className = ""
}: AnimatedCharacterProps) {
  const prefersReduced = useReducedMotion();
  const rm = reducedMotion ?? !!prefersReduced;
  const movement = settleByMood[mood];
  const profile = MOOD_PROFILE[mood];

  return (
    <div
      className={`preserved-character preserved-character--${gender} preserved-character--${mood} ${className}`}
      style={{ "--character-scale": String(scale), "--blink-top": blinkTop[gender], "--blink-left": blinkLeft[gender], "--blink-width": blinkWidth[gender], "--blink-tint": blinkTint[gender] } as CSSProperties}
    >
      <motion.div
        className="preserved-character__body"
        animate={
          rm
            ? undefined
            : {
                y: movement.y,
                rotate: movement.rotate,
                scaleY: movement.scaleY,
                scaleX: [1, profile.pulse[1], 1]
              }
        }
        transition={
          rm
            ? undefined
            : {
                duration: movement.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }
        }
      >
        <Image
          className="preserved-character__image"
          src={characterImageSrc(gender, mood)}
          alt={altByGender[gender]}
          width={512}
          height={512}
          priority={priority}
          sizes="(max-width: 560px) 340px, 390px"
        />

        <motion.span
          className="preserved-character__blink"
          aria-hidden="true"
          animate={rm ? undefined : { scaleY: [0, 0, 1, 0, 0], opacity: [0, 0, 0.82, 0, 0] }}
          transition={{ duration: 3.7, repeat: Infinity, times: [0, 0.91, 0.94, 0.97, 1], ease: "linear" }}
        />
      </motion.div>

      <FootBeats mood={mood} reducedMotion={rm} />
      <MoodAccent mood={mood} reducedMotion={rm} />
    </div>
  );
}

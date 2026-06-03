"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Apple, Dumbbell, HeartPulse, Salad, Sparkles } from "lucide-react";
import { AnimatedCharacter } from "@/components/character/animated-character";
import type { CharacterGender, CharacterMood } from "@/lib/home-model";

type CharacterStageProps = {
  gender: CharacterGender;
  mood: CharacterMood;
  calorieGap: number | null;
  exerciseMinutes: number;
};

const moodCopy: Record<CharacterMood, { title: string; detail: string; badge: string }> = {
  workoutBefore: {
    title: "等待今天的数据",
    detail: "先从热身开始，伙伴会陪你把身体慢慢唤醒。",
    badge: "锻炼前"
  },
  calorieLow: {
    title: "今天能量还差一点",
    detail: "补一餐更稳，别让训练节奏空转。",
    badge: "热量偏少"
  },
  calorieBalanced: {
    title: "节奏很稳",
    detail: "饮食和运动都在舒适区间，继续保持。",
    badge: "热量刚好"
  },
  workoutAfter: {
    title: "运动目标已接近",
    detail: "今天的身体已经被认真照顾到了。",
    badge: "锻炼后"
  },
  calorieHigh: {
    title: "今天摄入偏多",
    detail: "下一餐清淡一点，节奏很快就能拉回来。",
    badge: "热量过多"
  }
};

export function CharacterStage({ gender, mood, calorieGap, exerciseMinutes }: CharacterStageProps) {
  const reduceMotion = useReducedMotion();
  const copy = moodCopy[mood];
  const MoodIcon = mood === "calorieLow" ? Apple : mood === "workoutAfter" ? Dumbbell : mood === "calorieBalanced" ? Sparkles : mood === "calorieHigh" ? Salad : HeartPulse;

  return (
    <section className={`character-panel mood-${mood}`} aria-labelledby="character-state-title">
      <div className="character-copy">
        <span className={`state-pill mood-${mood}`} id="character-state-title">
          {copy.title}
        </span>
        <p>{copy.detail}</p>
      </div>

      <div className={`character-stage gender-${gender} mood-${mood}`}>
        <motion.div
          className={`character-halo mood-${mood}`}
          aria-hidden="true"
          animate={reduceMotion ? undefined : { scale: mood === "calorieBalanced" ? [1, 1.06, 1] : [1, 1.025, 1], opacity: [0.72, 1, 0.72] }}
          transition={{ duration: mood === "calorieBalanced" ? 1.8 : 3.6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="character-shadow"
          aria-hidden="true"
          animate={reduceMotion ? undefined : { scaleX: mood === "workoutAfter" ? [1, 0.84, 1] : [1, 0.92, 1], opacity: [0.14, 0.2, 0.14] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          key={gender}
          className="character-figure"
          initial={{ opacity: 0, scale: 0.95, y: 9 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{
            opacity: { duration: 0.24 },
            scale: { duration: 0.24 },
            y: { duration: 0.24 },
            rotate: { duration: 0.24 }
          }}
        >
          <AnimatedCharacter gender={gender} mood={mood} reducedMotion={!!reduceMotion} priority />
        </motion.div>

        <motion.div
          className={`companion-badge badge-${mood}`}
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: reduceMotion ? 0 : [0, -4, 0], scale: 1 }}
          transition={{ opacity: { duration: 0.2 }, y: { duration: 2.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }, scale: { duration: 0.2 } }}
        >
          <MoodIcon size={16} />
          <span>{copy.badge}</span>
        </motion.div>

        {mood === "calorieLow" ? (
          <motion.div
            className="character-prop snack"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {mood === "workoutAfter" ? (
          <motion.div
            className="character-prop dumbbell"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: [12, -12, 12] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span />
          </motion.div>
        ) : null}
      </div>

      <div className="character-footnote">
        <span>{calorieGap === null ? "热量待记录" : calorieGap >= 0 ? `可补 ${Math.round(calorieGap)} kcal` : `已超出 ${Math.abs(Math.round(calorieGap))} kcal`}</span>
        <span>{exerciseMinutes} 分钟运动</span>
      </div>
    </section>
  );
}

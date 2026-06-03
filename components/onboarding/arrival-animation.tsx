"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, Timer } from "lucide-react";
import { AnimatedCharacter } from "@/components/character/animated-character";
import type { CharacterGender } from "@/lib/home-model";

type ArrivalAnimationProps = {
  gender: CharacterGender;
  onDone: () => void;
};

export function ArrivalAnimation({ gender, onDone }: ArrivalAnimationProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(onDone, reduceMotion ? 140 : 2600);
    return () => window.clearTimeout(timeout);
  }, [onDone, reduceMotion]);

  return (
    <section className="arrival-step" aria-labelledby="arrival-title">
      <div className="onboarding-heading">
        <span>准备好了</span>
        <h1 id="arrival-title">伙伴正在进入你的首页</h1>
        <p>首页会优先展示今天的热量缺口、运动时长和下一步行动。</p>
      </div>

      <div className="arrival-stage">
        <motion.div
          className="arrival-ring"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.48, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        <motion.div
          className="arrival-character"
          initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.94 }}
          animate={{ opacity: 1, y: reduceMotion ? 0 : [0, -8, 0], scale: 1 }}
          transition={{
            opacity: { duration: reduceMotion ? 0.12 : 0.28 },
            scale: { duration: reduceMotion ? 0.12 : 0.42 },
            y: { duration: 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }
          }}
        >
          <AnimatedCharacter gender={gender} mood="calorieBalanced" reducedMotion={!!reduceMotion} priority />
        </motion.div>

        <motion.div
          className="arrival-metric metric-a"
          initial={reduceMotion ? false : { opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.45, duration: reduceMotion ? 0.12 : 0.42 }}
        >
          <Flame size={18} />
          <span>热量缺口</span>
        </motion.div>

        <motion.div
          className="arrival-metric metric-b"
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.58, duration: reduceMotion ? 0.12 : 0.42 }}
        >
          <Timer size={18} />
          <span>运动时长</span>
        </motion.div>
      </div>
    </section>
  );
}

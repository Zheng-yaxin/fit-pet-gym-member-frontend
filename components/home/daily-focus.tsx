"use client";

import { motion } from "framer-motion";
import { Flame, Timer } from "lucide-react";

type DailyFocusProps = {
  caloriesGap: number | null;
  caloriesActual: number | null;
  caloriesTarget: number | null;
  exerciseMinutes: number;
  exerciseTargetMinutes: number;
};

function calorieCopy(caloriesGap: number | null) {
  if (caloriesGap === null) return "等待饮食记录";
  if (caloriesGap < 0) return `已超出 ${Math.abs(Math.round(caloriesGap))} kcal`;
  return `还可摄入 ${Math.round(caloriesGap)} kcal`;
}

function calorieHelp(caloriesGap: number | null) {
  if (caloriesGap === null) return "记录饮食后会计算今日热量缺口。";
  if (caloriesGap < 0) return "今天已经超过目标，下一餐清淡一点就好。";
  if (caloriesGap > 450) return "缺口偏大，适合安排一餐稳定补给。";
  return "热量节奏温和，继续照看好身体。";
}

export function DailyFocus({ caloriesGap, caloriesActual, caloriesTarget, exerciseMinutes, exerciseTargetMinutes }: DailyFocusProps) {
  const calorieProgress = caloriesGap === null ? 0 : Math.min(100, Math.max(8, (Math.abs(caloriesGap) / 650) * 100));
  const exerciseProgress = Math.min(100, Math.max(4, (exerciseMinutes / exerciseTargetMinutes) * 100));
  const calorieTone = caloriesGap !== null && (caloriesGap > 450 || caloriesGap < 0) ? "coral" : "mint";

  return (
    <aside className="daily-panel" aria-labelledby="daily-focus-title">
      <div className="section-title">
        <span>Daily Focus</span>
        <h2 id="daily-focus-title">今天最重要的两件事</h2>
      </div>

      <article className={`metric-card tone-${calorieTone}`}>
        <div className="metric-topline">
          <span><Flame size={17} />今日热量</span>
          <b>{caloriesGap === null ? "待记录" : calorieCopy(caloriesGap)}</b>
        </div>
        <div className="metric-value">
          <strong>{caloriesActual === null ? "--" : Math.round(caloriesActual)}</strong>
          <em>/ {caloriesTarget === null ? "--" : Math.round(caloriesTarget)} kcal</em>
        </div>
        <div className="metric-track" aria-hidden="true">
          <motion.i initial={{ width: 0 }} animate={{ width: `${calorieProgress}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <p>{calorieHelp(caloriesGap)}</p>
      </article>

      <article className="metric-card tone-blue">
        <div className="metric-topline">
          <span><Timer size={17} />今日运动时长</span>
          <b>{exerciseMinutes}/{exerciseTargetMinutes}</b>
        </div>
        <div className="metric-value">
          <strong>{exerciseMinutes}</strong>
          <em>min</em>
        </div>
        <div className="metric-track" aria-hidden="true">
          <motion.i initial={{ width: 0 }} animate={{ width: `${exerciseProgress}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <p>目标 {exerciseTargetMinutes} 分钟，先动起来比追求完美更重要。</p>
      </article>
    </aside>
  );
}

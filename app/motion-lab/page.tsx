"use client";

import { useMemo, useState } from "react";
import { animate, stagger as animeStagger } from "animejs";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, Dumbbell, HeartPulse, Sparkles, TimerReset } from "lucide-react";

import { DURATION, EASE } from "@/components/motion/fitpet-motion";
import { useAnimeScope } from "@/components/motion/use-anime";
import "./motion-lab.css";

type LabMood = "breathe" | "warmup" | "train" | "celebrate";

const moodCopy: Record<
  LabMood,
  {
    label: string;
    title: string;
    description: string;
    action: string;
    accent: string;
  }
> = {
  breathe: {
    label: "轻呼吸",
    title: "首页待机状态",
    description: "角色保持小幅呼吸、眨眼和尾巴摆动，让首页有生命感但不打扰用户读数据。",
    action: "慢节奏",
    accent: "mint"
  },
  warmup: {
    label: "热身",
    title: "准备开始训练",
    description: "身体轻微前倾，手臂做小幅摆动，用动作提示用户下一步可以进入训练计划。",
    action: "引导",
    accent: "yolk"
  },
  train: {
    label: "训练中",
    title: "跑步与力量反馈",
    description: "腿部、手臂和速度线进入短周期循环，强调运动状态，仍只用 transform 和 opacity。",
    action: "进行中",
    accent: "blue"
  },
  celebrate: {
    label: "完成",
    title: "达成后的轻庆祝",
    description: "完成训练或热量达标时触发一次轻弹跳和经验粒子，奖励感明确但不游戏化。",
    action: "奖励",
    accent: "coral"
  }
};

const moodOrder: LabMood[] = ["breathe", "warmup", "train", "celebrate"];

const motionPrinciples = [
  "页面进入只做 0.62s 的轻量揭示，不等待大段表演。",
  "角色持续动效使用呼吸、眨眼、尾巴和小道具，避免整张图片上下漂。",
  "点击反馈交给 Anime.js 处理粒子和短链路动效，React 状态只负责语义切换。",
  "所有循环动效都响应 prefers-reduced-motion。"
];

const sequenceSteps = [
  { label: "读取会员状态", tone: "mint" },
  { label: "进入训练计划", tone: "blue" },
  { label: "记录动作完成", tone: "yolk" },
  { label: "发放经验反馈", tone: "coral" }
];

function fitEase(curve: readonly number[]) {
  return [...curve] as [number, number, number, number];
}

export default function MotionLabPage() {
  const [mood, setMood] = useState<LabMood>("breathe");
  const [burstKey, setBurstKey] = useState(1);
  const reduceMotion = Boolean(useReducedMotion());
  const selectedMood = moodCopy[mood];

  const metrics = useMemo(
    () => [
      { label: "页面揭示", value: reduceMotion ? "静态" : "620ms", tone: "mint" },
      { label: "状态切换", value: reduceMotion ? "无循环" : "220ms", tone: "blue" },
      { label: "经验粒子", value: reduceMotion ? "关闭" : "Anime.js", tone: "yolk" }
    ],
    [reduceMotion]
  );

  function triggerCelebrate() {
    setMood("celebrate");
    setBurstKey((current) => current + 1);
  }

  return (
    <main className="motion-lab" aria-labelledby="motion-lab-title">
      <div className="motion-lab__wash" aria-hidden="true">
        <span className="wash-blob wash-blob--mint" />
        <span className="wash-blob wash-blob--yolk" />
        <span className="wash-blob wash-blob--pink" />
      </div>

      <motion.section
        className="motion-lab__hero"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: DURATION.entrance / 1000, ease: fitEase(EASE.out) }}
      >
        <div className="motion-lab__intro">
          <span className="motion-lab__eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Fit-Pet Motion Lab
          </span>
          <h1 id="motion-lab-title">把会员端动效先做成一个能看的样张</h1>
          <p>
            这个页面是动效重构前的预览板：保留 Fit-Pet 的温暖手绘感，用角色状态、训练节奏和点击反馈验证后续全站动效方向。
          </p>
        </div>

        <div className="motion-lab__status-card" aria-label="动效实现范围">
          {metrics.map((metric) => (
            <div className={`motion-metric motion-metric--${metric.tone}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="motion-lab__stage-grid" aria-label="角色动效预览">
        <motion.article
          className={`motion-lab__stage-card motion-lab__stage-card--${selectedMood.accent}`}
          layout
          transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.9 }}
        >
          <div className="stage-card__copy">
            <span>{selectedMood.action}</span>
            <h2>{selectedMood.title}</h2>
            <p>{selectedMood.description}</p>
          </div>

          <div className="stage-card__pet-wrap">
            <MotionLabPet mood={mood} />
            <XpBurst key={burstKey} enabled={mood === "celebrate"} />
          </div>

          <div className="stage-card__controls" role="group" aria-label="切换角色状态">
            {moodOrder.map((item) => (
              <button
                className={item === mood ? "is-selected" : ""}
                type="button"
                onClick={() => {
                  setMood(item);
                  if (item === "celebrate") setBurstKey((current) => current + 1);
                }}
                key={item}
              >
                {moodCopy[item].label}
              </button>
            ))}
          </div>
        </motion.article>

        <aside className="motion-lab__notes" aria-label="动效说明">
          <div className="motion-note motion-note--primary">
            <HeartPulse size={22} aria-hidden="true" />
            <div>
              <span>角色状态</span>
              <p>Framer Motion 负责语义清楚的组件状态：呼吸、热身、训练和完成。</p>
            </div>
          </div>

          <div className="motion-note">
            <Activity size={22} aria-hidden="true" />
            <div>
              <span>训练反馈</span>
              <p>速度线、影子压缩和肢体摆动形成运动感，但不改变布局。</p>
            </div>
          </div>

          <div className="motion-note">
            <TimerReset size={22} aria-hidden="true" />
            <div>
              <span>低动效偏好</span>
              <p>{reduceMotion ? "当前系统偏好减少动态，页面已关闭循环动画。" : "检测到可播放动效，循环动画会保持轻量。"}</p>
            </div>
          </div>

          <button className="motion-lab__burst-button" type="button" onClick={triggerCelebrate}>
            <Sparkles size={18} aria-hidden="true" />
            触发完成反馈
          </button>
        </aside>
      </section>

      <section className="motion-lab__runway" aria-label="训练流程节奏">
        <div className="runway-copy">
          <span>训练流程节奏</span>
          <h2>从读取数据到完成反馈，每一步都有对应动作</h2>
        </div>
        <div className="runway-track">
          {sequenceSteps.map((step, index) => (
            <motion.div
              className={`runway-step runway-step--${step.tone}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: index * 0.08, duration: DURATION.normal / 1000, ease: fitEase(EASE.out) }}
              key={step.label}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.label}</strong>
            </motion.div>
          ))}
          <motion.div
            className="runway-runner"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { x: ["0%", "calc(100% - 54px)", "0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Dumbbell size={19} />
          </motion.div>
        </div>
      </section>

      <section className="motion-lab__principles" aria-label="动效落地原则">
        <div>
          <span>落地原则</span>
          <h2>后续改首页时按这套规则收敛</h2>
        </div>
        <ul>
          {motionPrinciples.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function MotionLabPet({ mood }: { mood: LabMood }) {
  const reduceMotion = Boolean(useReducedMotion());
  const isTraining = mood === "train";
  const isCelebrate = mood === "celebrate";
  const isWarmup = mood === "warmup";

  const loopTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: isTraining ? 0.72 : isCelebrate ? 0.8 : 2.9,
        repeat: isTraining || mood === "breathe" ? Infinity : 0,
        ease: "easeInOut" as const
      };

  const bodyMotion = reduceMotion
    ? { y: 0, rotate: 0, scale: 1 }
    : {
        y: isCelebrate ? [0, -28, 2, -8, 0] : isTraining ? [0, -12, 0, -7, 0] : isWarmup ? [0, -7, 0] : [0, -5, 0],
        rotate: isCelebrate ? [0, -5, 5, -2, 0] : isTraining ? [0, -2, 2, 0] : isWarmup ? [0, -3, 1, 0] : [0, -1, 0.8, 0],
        scale: isCelebrate ? [1, 1.08, 0.97, 1.03, 1] : isTraining ? [1, 1.025, 0.99, 1] : 1
      };

  return (
    <motion.div className={`motion-pet motion-pet--${mood}`} animate={bodyMotion} transition={loopTransition} role="img" aria-label="Fit-Pet 角色动效样张">
      <motion.div
        className="motion-pet__shadow"
        animate={reduceMotion ? undefined : { scaleX: isCelebrate ? [1, 0.72, 1.08, 1] : isTraining ? [1, 0.82, 1] : [1, 0.9, 1], opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: isTraining ? 0.72 : 2.5, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
      />

      <svg className="motion-pet__svg" viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="motionFur" x1="104" y1="56" x2="306" y2="312" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffaf0" />
            <stop offset="0.56" stopColor="#ffeabf" />
            <stop offset="1" stopColor="#f2d59f" />
          </linearGradient>
          <linearGradient id="motionScarf" x1="136" y1="222" x2="302" y2="260" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c9ffe7" />
            <stop offset="1" stopColor="#74dfa8" />
          </linearGradient>
          <filter id="motionPetShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="13" stdDeviation="5" floodColor="#8b6b34" floodOpacity="0.18" />
          </filter>
        </defs>

        <motion.path
          d="M118 128C103 84 123 50 166 48C188 47 205 63 212 90C222 62 241 46 264 49C306 54 322 88 304 128"
          fill="#ffedc6"
          stroke="#20242d"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={reduceMotion ? undefined : { rotate: isCelebrate ? [-2, 7, -4, 0] : [0, -1.5, 0, 1, 0] }}
          transition={{ duration: isCelebrate ? 0.72 : 3.1, repeat: isCelebrate || reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "211px 126px" }}
        />

        <motion.path
          d="M96 213C88 139 130 88 212 88C296 88 337 139 329 213C321 292 281 333 212 333C144 333 104 292 96 213Z"
          fill="url(#motionFur)"
          stroke="#20242d"
          strokeWidth="7"
          filter="url(#motionPetShadow)"
          animate={reduceMotion ? undefined : { scaleY: isWarmup ? [1, 1.035, 0.99, 1] : isTraining ? [1, 0.98, 1.025, 1] : [1, 0.992, 1] }}
          transition={{ duration: isTraining ? 0.72 : 2.4, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "212px 320px" }}
        />

        <path
          d="M119 221C132 251 163 270 212 270C262 270 293 251 306 221C281 232 250 237 212 237C175 237 144 232 119 221Z"
          fill="#fffdf1"
          stroke="#20242d"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        <ellipse cx="156" cy="194" rx="22" ry="15" fill="#f59bbc" fillOpacity="0.62" />
        <ellipse cx="269" cy="194" rx="22" ry="15" fill="#f59bbc" fillOpacity="0.62" />

        <motion.g
          animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: DURATION.blinkGap / 1000, repeat: Infinity, times: [0, 0.84, 0.88, 0.92, 1] }}
          style={{ transformOrigin: "174px 168px" }}
        >
          <ellipse cx="174" cy="168" rx="12" ry="15" fill="#20242d" />
          <circle cx="170" cy="163" r="4" fill="#fff9ec" />
        </motion.g>
        <motion.g
          animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: DURATION.blinkGap / 1000, repeat: Infinity, times: [0, 0.84, 0.88, 0.92, 1], delay: 0.02 }}
          style={{ transformOrigin: "250px 168px" }}
        >
          <ellipse cx="250" cy="168" rx="12" ry="15" fill="#20242d" />
          <circle cx="246" cy="163" r="4" fill="#fff9ec" />
        </motion.g>

        <motion.path
          d={isTraining ? "M198 200C207 194 218 194 228 200" : "M199 199C207 206 219 206 226 199"}
          stroke="#20242d"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <motion.path
          d="M130 246C153 262 181 270 212 270C244 270 272 262 294 246L304 272C277 292 246 302 212 302C179 302 148 292 121 272L130 246Z"
          fill="url(#motionScarf)"
          stroke="#20242d"
          strokeWidth="7"
          strokeLinejoin="round"
          animate={reduceMotion ? undefined : { x: isTraining ? [0, -4, 4, 0] : [0, 2, 0] }}
          transition={{ duration: isTraining ? 0.72 : 2.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        />
        <path d="M284 271L326 288L294 310" fill="#74dfa8" stroke="#20242d" strokeWidth="7" strokeLinejoin="round" />

        <motion.path
          d="M111 234C75 240 61 267 78 290C95 311 128 296 133 263"
          fill="#ffe8bd"
          stroke="#20242d"
          strokeWidth="7"
          strokeLinecap="round"
          animate={reduceMotion ? undefined : { rotate: isCelebrate ? [0, -26, 12, -18, 0] : isWarmup ? [0, -12, 6, 0] : isTraining ? [0, -18, 18, -12, 0] : [0, -4, 0] }}
          transition={{ duration: isTraining ? 0.72 : isCelebrate || isWarmup ? 0.82 : 3.2, repeat: isTraining && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
          style={{ transformOrigin: "125px 246px" }}
        />
        <motion.path
          d="M314 234C350 240 364 267 347 290C330 311 297 296 292 263"
          fill="#ffe8bd"
          stroke="#20242d"
          strokeWidth="7"
          strokeLinecap="round"
          animate={reduceMotion ? undefined : { rotate: isCelebrate ? [0, 25, -10, 17, 0] : isWarmup ? [0, 12, -6, 0] : isTraining ? [0, 18, -18, 12, 0] : [0, 4, 0] }}
          transition={{ duration: isTraining ? 0.72 : isCelebrate || isWarmup ? 0.82 : 3.2, repeat: isTraining && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
          style={{ transformOrigin: "300px 246px" }}
        />

        <motion.path
          d="M146 324C159 342 190 343 199 322"
          stroke="#20242d"
          strokeWidth="7"
          strokeLinecap="round"
          animate={reduceMotion ? undefined : { rotate: isTraining ? [0, 8, -8, 0] : 0 }}
          transition={{ duration: 0.72, repeat: isTraining && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
          style={{ transformOrigin: "174px 324px" }}
        />
        <motion.path
          d="M226 322C235 343 267 342 280 324"
          stroke="#20242d"
          strokeWidth="7"
          strokeLinecap="round"
          animate={reduceMotion ? undefined : { rotate: isTraining ? [0, -8, 8, 0] : 0 }}
          transition={{ duration: 0.72, repeat: isTraining && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
          style={{ transformOrigin: "252px 324px" }}
        />
      </svg>

      <AnimatePresence>
        {isTraining && (
          <motion.div
            className="motion-pet__speed-lines"
            initial={{ opacity: 0, x: -18 }}
            animate={reduceMotion ? { opacity: 0.45, x: 0 } : { opacity: [0, 1, 0], x: [0, 58] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, repeat: reduceMotion ? 0 : Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function XpBurst({ enabled }: { enabled: boolean }) {
  const rootRef = useAnimeScope<HTMLDivElement>(
    (_scope, root, reducedMotion) => {
      if (!enabled || reducedMotion) return;

      const particles = root.querySelectorAll(".xp-burst__particle");
      const labels = root.querySelectorAll(".xp-burst__label");

      animate(particles, {
        opacity: [0, 1, 0],
        scale: [0.42, 1.18, 0.26],
        translateX: (_target: Element, index: number) => [-8, -78 + index * 22],
        translateY: (_target: Element, index: number) => [8, -92 - (index % 2) * 26],
        rotate: (_target: Element, index: number) => [0, index % 2 ? 28 : -26],
        delay: animeStagger(42),
        duration: 920,
        ease: "out(4)"
      });

      animate(labels, {
        opacity: [0, 1, 0],
        translateY: [10, -46],
        scale: [0.84, 1, 0.94],
        duration: 840,
        ease: "out(4)"
      });
    },
    [enabled]
  );

  return (
    <div className="xp-burst" ref={rootRef} aria-hidden="true">
      <span className="xp-burst__label">+80 XP</span>
      {Array.from({ length: 7 }).map((_, index) => (
        <i className={`xp-burst__particle xp-burst__particle--${index + 1}`} key={index} />
      ))}
    </div>
  );
}

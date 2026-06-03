"use client";

import { motion } from "framer-motion";

export type BossKind = "donut" | "burger" | "bubbleTea";

type CalorieBossProps = {
  kind: BossKind;
  hit?: boolean;
};

export function CalorieBoss({ kind, hit = false }: CalorieBossProps) {
  return (
    <motion.div
      className={`calorie-boss calorie-boss-${kind}`}
      animate={hit ? { x: [0, 10, -8, 5, 0], rotate: [0, -4, 4, -2, 0], scale: [1, 0.96, 1.03, 1] } : { y: [0, -7, 0], rotate: [0, -1.5, 1.5, 0] }}
      transition={{ duration: hit ? 0.58 : 3, repeat: hit ? 0 : Infinity, ease: "easeInOut" }}
      role="img"
      aria-label="高热量食品 BOSS"
    >
      <motion.div className="boss-floor" animate={{ scaleX: [1, 0.92, 1], opacity: [0.2, 0.28, 0.2] }} transition={{ duration: 2.6, repeat: Infinity }} />
      {kind === "donut" && <DonutBoss />}
      {kind === "burger" && <BurgerBoss />}
      {kind === "bubbleTea" && <BubbleTeaBoss />}
      {hit && (
        <motion.div className="hit-burst" initial={{ opacity: 0, scale: 0.4, rotate: -12 }} animate={{ opacity: [0, 1, 0], scale: [0.4, 1.18], rotate: 8 }}>
          kcal!
        </motion.div>
      )}
    </motion.div>
  );
}

function DonutBoss() {
  return (
    <svg className="boss-svg" viewBox="0 0 360 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="donutBread" x1="82" y1="62" x2="270" y2="268" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD99B" />
          <stop offset="1" stopColor="#E59C54" />
        </linearGradient>
        <linearGradient id="donutIcing" x1="90" y1="76" x2="260" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB7CF" />
          <stop offset="1" stopColor="#FF6F9B" />
        </linearGradient>
      </defs>
      <circle cx="180" cy="162" r="106" fill="url(#donutBread)" stroke="#3C3440" strokeWidth="8" />
      <path d="M82 145C94 84 148 52 209 65C258 76 292 119 288 168C258 146 239 182 215 170C194 160 198 124 168 126C141 128 135 162 104 162C94 162 88 156 82 145Z" fill="url(#donutIcing)" stroke="#3C3440" strokeWidth="7" strokeLinejoin="round" />
      <circle cx="180" cy="162" r="38" fill="#FFF7E8" stroke="#3C3440" strokeWidth="7" />
      <ellipse cx="142" cy="133" rx="10" ry="13" fill="#3C3440" />
      <ellipse cx="222" cy="133" rx="10" ry="13" fill="#3C3440" />
      <path d="M158 204C176 218 199 218 217 204" stroke="#3C3440" strokeWidth="8" strokeLinecap="round" />
      <path d="M116 94L99 65M251 94L270 65" stroke="#3C3440" strokeWidth="8" strokeLinecap="round" />
      <g stroke="#FFF7E8" strokeWidth="7" strokeLinecap="round">
        <path d="M132 91L146 80" />
        <path d="M218 91L236 82" />
        <path d="M258 137L274 130" />
      </g>
      <g stroke="#FFD24B" strokeWidth="6" strokeLinecap="round">
        <path d="M111 128L125 120" />
        <path d="M236 118L249 113" />
      </g>
    </svg>
  );
}

function BurgerBoss() {
  return (
    <svg className="boss-svg" viewBox="0 0 360 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M85 132C91 72 139 47 181 47C223 47 270 72 277 132" fill="#F4B35B" stroke="#3C3440" strokeWidth="8" strokeLinejoin="round" />
      <path d="M74 139H286C300 139 310 150 307 164C304 177 291 184 276 181C244 175 219 174 181 184C143 174 118 175 86 181C71 184 58 177 55 164C52 150 61 139 74 139Z" fill="#7F4B2A" stroke="#3C3440" strokeWidth="8" />
      <path d="M68 183C104 166 124 199 153 182C181 166 211 201 240 181C258 169 279 172 295 184" stroke="#77D66A" strokeWidth="18" strokeLinecap="round" />
      <path d="M70 201H292V238C292 256 277 271 259 271H103C85 271 70 256 70 238V201Z" fill="#F6C46A" stroke="#3C3440" strokeWidth="8" />
      <ellipse cx="145" cy="137" rx="10" ry="13" fill="#3C3440" />
      <ellipse cx="218" cy="137" rx="10" ry="13" fill="#3C3440" />
      <path d="M158 168C174 158 191 158 206 168" stroke="#3C3440" strokeWidth="8" strokeLinecap="round" />
      <g stroke="#FFF8DF" strokeWidth="6" strokeLinecap="round">
        <path d="M130 82L141 78" />
        <path d="M178 70L190 68" />
        <path d="M226 86L237 90" />
      </g>
    </svg>
  );
}

function BubbleTeaBoss() {
  return (
    <svg className="boss-svg" viewBox="0 0 360 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M127 61L248 37" stroke="#3C3440" strokeWidth="12" strokeLinecap="round" />
      <path d="M96 93H264L245 266C243 284 228 298 210 298H150C132 298 117 284 115 266L96 93Z" fill="#F5D19D" stroke="#3C3440" strokeWidth="8" />
      <path d="M108 125H252L239 246C237 261 225 272 210 272H150C135 272 123 261 121 246L108 125Z" fill="#B88355" fillOpacity=".7" />
      <path d="M106 93H254" stroke="#FFF7E8" strokeWidth="10" strokeLinecap="round" />
      <circle cx="148" cy="241" r="12" fill="#3C3440" />
      <circle cx="183" cy="258" r="12" fill="#3C3440" />
      <circle cx="216" cy="238" r="12" fill="#3C3440" />
      <ellipse cx="154" cy="160" rx="10" ry="13" fill="#3C3440" />
      <ellipse cx="210" cy="160" rx="10" ry="13" fill="#3C3440" />
      <path d="M164 193C174 201 188 201 198 193" stroke="#3C3440" strokeWidth="8" strokeLinecap="round" />
      <path d="M104 78H260" stroke="#3C3440" strokeWidth="8" strokeLinecap="round" />
      <path d="M117 63H247" stroke="#FCE8BE" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

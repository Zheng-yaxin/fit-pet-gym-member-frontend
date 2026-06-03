"use client";

import { AnimatePresence, motion } from "framer-motion";

export type RefinedPetMood = "idle" | "wave" | "train" | "snack" | "cheer" | "sleep";

type RefinedPetProps = {
  mood: RefinedPetMood;
};

const bodyMotion = {
  idle: { y: [0, -8, 0], rotate: [0, -1, 0.8, 0] },
  wave: { y: [0, -12, 0], rotate: [0, -3, 2, 0] },
  train: { x: [0, -8, 8, -5, 0], y: [0, -10, 0], rotate: [0, -2, 2, 0] },
  snack: { y: [0, -7, 0], scale: [1, 1.04, 0.99, 1] },
  cheer: { y: [0, -22, 0, -10, 0], rotate: [0, -6, 5, -2, 0], scale: [1, 1.08, 0.98, 1.04, 1] },
  sleep: { y: [0, 4, 0], rotate: [0, -0.6, 0.6, 0] }
};

export function RefinedPet({ mood }: RefinedPetProps) {
  const sleeping = mood === "sleep";

  return (
    <motion.div
      className={`refined-pet refined-pet-${mood}`}
      animate={bodyMotion[mood]}
      transition={{
        duration: mood === "idle" || mood === "sleep" ? 3.4 : 0.92,
        repeat: mood === "idle" || mood === "sleep" ? Infinity : 0,
        ease: "easeInOut"
      }}
      role="img"
      aria-label="日系风格健身宠物"
    >
      <motion.div className="pet-ground" animate={{ scaleX: [1, 0.9, 1], opacity: [0.2, 0.26, 0.2] }} transition={{ duration: 2.4, repeat: Infinity }} />
      <svg className="refined-pet-svg" viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fur" x1="112" y1="48" x2="316" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF8E8" />
            <stop offset=".55" stopColor="#FFEBC4" />
            <stop offset="1" stopColor="#F7DFAE" />
          </linearGradient>
          <linearGradient id="mintScarf" x1="137" y1="206" x2="308" y2="248" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B8FFF0" />
            <stop offset="1" stopColor="#56DABF" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="5" floodColor="#6B4E26" floodOpacity=".16" />
          </filter>
        </defs>

        <motion.path
          d="M122 124C106 82 124 49 164 44C186 42 204 58 213 84C222 58 240 42 264 44C304 50 322 83 306 124"
          fill="#FFEBC4"
          stroke="#3C3440"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: mood === "cheer" ? [-2, 5, -4, 0] : [0, -1.5, 0] }}
          transition={{ duration: mood === "cheer" ? 0.8 : 3.2, repeat: mood === "cheer" ? 0 : Infinity }}
          style={{ transformOrigin: "214px 116px" }}
        />
        <path
          d="M94 204C86 132 129 83 214 83C299 83 342 132 334 204C326 286 284 331 214 331C144 331 102 286 94 204Z"
          fill="url(#fur)"
          stroke="#3C3440"
          strokeWidth="7"
          filter="url(#softShadow)"
        />
        <path
          d="M116 214C126 244 158 266 214 266C270 266 302 244 312 214C287 225 253 231 214 231C175 231 141 225 116 214Z"
          fill="#FFFDF4"
          stroke="#3C3440"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <ellipse cx="155" cy="190" rx="23" ry="16" fill="#FFA9BE" fillOpacity=".62" />
        <ellipse cx="273" cy="190" rx="23" ry="16" fill="#FFA9BE" fillOpacity=".62" />

        {sleeping ? (
          <>
            <path d="M157 169C168 162 179 162 190 169" stroke="#3C3440" strokeWidth="7" strokeLinecap="round" />
            <path d="M238 169C249 162 260 162 271 169" stroke="#3C3440" strokeWidth="7" strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.88, 0.91, 0.95] }} style={{ transformOrigin: "174px 166px" }}>
              <ellipse cx="174" cy="166" rx="13" ry="16" fill="#3C3440" />
              <circle cx="169" cy="160" r="4" fill="#FFF" />
            </motion.g>
            <motion.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.88, 0.91, 0.95] }} style={{ transformOrigin: "254px 166px" }}>
              <ellipse cx="254" cy="166" rx="13" ry="16" fill="#3C3440" />
              <circle cx="249" cy="160" r="4" fill="#FFF" />
            </motion.g>
          </>
        )}
        <path d="M201 195C208 203 220 203 227 195" stroke="#3C3440" strokeWidth="7" strokeLinecap="round" />

        <motion.path
          d="M129 238C151 253 181 260 214 260C247 260 277 253 299 238L307 265C279 285 248 294 214 294C180 294 149 285 121 265L129 238Z"
          fill="url(#mintScarf)"
          stroke="#3C3440"
          strokeWidth="7"
          strokeLinejoin="round"
          animate={{ x: mood === "train" ? [0, -3, 3, 0] : [0, 2, 0] }}
          transition={{ duration: mood === "train" ? 0.7 : 2.8, repeat: mood === "train" ? 0 : Infinity }}
        />
        <path d="M284 263L327 282L295 304" fill="#56DABF" stroke="#3C3440" strokeWidth="7" strokeLinejoin="round" />

        <motion.path
          d="M108 224C73 229 58 258 75 282C91 304 126 291 131 257"
          fill="#FFE8BD"
          stroke="#3C3440"
          strokeWidth="7"
          strokeLinecap="round"
          animate={{ rotate: mood === "wave" || mood === "cheer" ? [0, -20, 12, -18, 0] : [0, -4, 0] }}
          transition={{ duration: mood === "wave" || mood === "cheer" ? 0.92 : 3.2, repeat: mood === "wave" || mood === "cheer" ? 0 : Infinity }}
          style={{ transformOrigin: "119px 238px" }}
        />
        <motion.path
          d="M320 224C355 229 370 258 353 282C337 304 302 291 297 257"
          fill="#FFE8BD"
          stroke="#3C3440"
          strokeWidth="7"
          strokeLinecap="round"
          animate={{ rotate: mood === "train" ? [0, 15, -15, 12, 0] : [0, 4, 0] }}
          transition={{ duration: mood === "train" ? 0.8 : 3.2, repeat: mood === "train" ? 0 : Infinity }}
          style={{ transformOrigin: "309px 238px" }}
        />

        <path d="M145 323C158 341 190 343 199 321" stroke="#3C3440" strokeWidth="7" strokeLinecap="round" />
        <path d="M229 321C238 343 270 341 283 323" stroke="#3C3440" strokeWidth="7" strokeLinecap="round" />
      </svg>

      <AnimatePresence>
        {mood === "snack" && (
          <motion.div className="pet-float snack-star" initial={{ y: -18, opacity: 0, scale: 0.6 }} animate={{ y: [0, -38], opacity: [0, 1, 0], scale: [0.8, 1.2] }} exit={{ opacity: 0 }}>
            +
          </motion.div>
        )}
        {mood === "train" && (
          <motion.div className="pet-float speed-lines" initial={{ opacity: 0, x: -20 }} animate={{ opacity: [0, 1, 0], x: [0, 54] }} exit={{ opacity: 0 }} />
        )}
        {mood === "sleep" && (
          <motion.div className="pet-float sleep-bubble" animate={{ y: [-8, -44], opacity: [0, 1, 0], scale: [0.6, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            Z
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

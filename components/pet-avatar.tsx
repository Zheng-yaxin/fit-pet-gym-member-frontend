"use client";

import { AnimatePresence, motion } from "framer-motion";

export type PetMood = "idle" | "happy" | "feed" | "train" | "attack" | "sleep";

type PetAvatarProps = {
  mood?: PetMood;
};

const moodMotion: Record<PetMood, Record<string, number[] | number>> = {
  idle: { y: [0, -9, 0], rotate: [0, -1.5, 0, 1.5, 0], scale: 1 },
  happy: { y: [0, -22, 0, -9, 0], rotate: [0, -7, 6, -3, 0], scale: [1, 1.1, 0.96, 1.05, 1] },
  feed: { y: [0, -8, 0], rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] },
  train: { x: [0, -12, 12, -8, 8, 0], y: [0, -10, 0, -8, 0], scale: [1, 1.04, 0.98, 1.03, 1] },
  attack: { x: [0, 22, -10, 0], y: [0, -16, 2, 0], rotate: [0, 10, -8, 0], scale: [1, 1.08, 0.98, 1] },
  sleep: { y: [0, 3, 0], rotate: [0, -0.8, 0.8, 0], scale: [1, 0.99, 1] }
};

export function PetAvatar({ mood = "idle" }: PetAvatarProps) {
  const isSleep = mood === "sleep";

  return (
    <motion.div
      className={`pet-stage mood-${mood}`}
      animate={mood}
      variants={moodMotion}
      transition={{
        duration: mood === "idle" || mood === "sleep" ? 3.2 : 0.86,
        repeat: mood === "idle" || mood === "sleep" ? Infinity : 0,
        ease: "easeInOut"
      }}
      aria-label="薄荷团子宠物"
      role="img"
    >
      <motion.div
        className="pet-shadow"
        animate={{
          scaleX: mood === "attack" ? [1, 0.78, 1.08, 1] : [1, 0.88, 1],
          opacity: isSleep ? 0.1 : [0.14, 0.2, 0.14]
        }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      <svg className="pet-svg" viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="petA" x1="120" y1="72" x2="300" y2="252" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A6FFE8" />
            <stop offset="1" stopColor="#5BE3C2" />
          </linearGradient>
          <linearGradient id="petB" x1="164" y1="98" x2="262" y2="218" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity=".96" />
            <stop offset="1" stopColor="#D6FFF4" stopOpacity=".86" />
          </linearGradient>
        </defs>
        <motion.path
          className="pet-ear left"
          d="M148 114C142 90 154 71 180 65C187 64 193 64 199 67C189 80 181 96 178 114"
          fill="#5BE3C2"
          stroke="#262A33"
          strokeWidth="6"
          strokeLinejoin="round"
          animate={{ rotate: mood === "happy" ? [-3, 8, -7, 0] : [0, -4, 0] }}
          transition={{ duration: mood === "happy" ? 0.7 : 3.4, repeat: mood === "happy" ? 0 : Infinity }}
          style={{ transformOrigin: "178px 114px" }}
        />
        <motion.path
          className="pet-ear right"
          d="M272 114C278 90 266 71 240 65C233 64 227 64 221 67C231 80 239 96 242 114"
          fill="#5BE3C2"
          stroke="#262A33"
          strokeWidth="6"
          strokeLinejoin="round"
          animate={{ rotate: mood === "happy" ? [3, -8, 7, 0] : [0, 4, 0] }}
          transition={{ duration: mood === "happy" ? 0.7 : 3.4, repeat: mood === "happy" ? 0 : Infinity, delay: 0.16 }}
          style={{ transformOrigin: "242px 114px" }}
        />
        <motion.path
          d="M125 214C98 159 111 102 161 82C186 74 224 74 255 84C306 100 324 156 297 214C283 243 258 261 210 261C162 261 138 243 125 214Z"
          fill="url(#petA)"
          stroke="#262A33"
          strokeWidth="6"
          animate={{ scaleY: mood === "feed" ? [1, 1.08, 0.98, 1] : [1, 0.985, 1] }}
          transition={{ duration: mood === "feed" ? 0.75 : 2.8, repeat: mood === "feed" ? 0 : Infinity }}
          style={{ transformOrigin: "210px 230px" }}
        />
        <ellipse cx="210" cy="157" rx="72" ry="64" fill="url(#petB)" stroke="#262A33" strokeWidth="6" />
        {isSleep ? (
          <>
            <path d="M178 155C185 150 192 150 199 155" stroke="#262A33" strokeWidth="6" strokeLinecap="round" />
            <path d="M221 155C228 150 235 150 242 155" stroke="#262A33" strokeWidth="6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.g
              animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ transformOrigin: "188px 155px" }}
            >
              <circle cx="188" cy="155" r="10" fill="#262A33" />
            </motion.g>
            <motion.g
              animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ transformOrigin: "232px 155px" }}
            >
              <circle cx="232" cy="155" r="10" fill="#262A33" />
            </motion.g>
          </>
        )}
        <motion.path
          d={mood === "attack" ? "M194 180C205 172 219 172 231 180" : "M196 179C206 186 214 186 224 179"}
          stroke="#262A33"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <ellipse cx="177" cy="171" rx="12" ry="9" fill="#FF96B5" fillOpacity=".72" />
        <ellipse cx="243" cy="171" rx="12" ry="9" fill="#FF96B5" fillOpacity=".72" />
        <circle cx="165" cy="97" r="8" fill="#FFF" fillOpacity=".8" />
        <circle cx="171" cy="90" r="4" fill="#FFF" />
        <path d="M209 72C221 58 240 57 252 67" stroke="#FFF" strokeOpacity=".8" strokeWidth="8" strokeLinecap="round" />
      </svg>

      <AnimatePresence>
        {mood === "feed" && (
          <motion.div className="pet-prop snack" initial={{ y: -36, opacity: 0 }} animate={{ y: 80, opacity: [0, 1, 1, 0] }} exit={{ opacity: 0 }}>
            +
          </motion.div>
        )}
        {mood === "train" && (
          <motion.div className="pet-prop dumbbell" initial={{ rotate: -28, scale: 0.7 }} animate={{ rotate: [18, -18, 18], scale: [0.8, 1, 0.9] }} exit={{ opacity: 0 }}>
            <span />
          </motion.div>
        )}
        {mood === "attack" && (
          <motion.div className="pet-prop slash" initial={{ x: -80, opacity: 0, rotate: -18 }} animate={{ x: 120, opacity: [0, 1, 0], rotate: -18 }} exit={{ opacity: 0 }} />
        )}
        {mood === "sleep" && (
          <motion.div className="pet-prop zzz" initial={{ y: 16, opacity: 0 }} animate={{ y: [-4, -32], opacity: [0, 1, 0] }} exit={{ opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }}>
            Z
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pet-spark pet-spark-a"
        animate={{ y: [0, -14, 0], rotate: [0, 28, 0], opacity: [0.4, 1, 0.4], scale: [0.92, 1.15, 0.92] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <motion.div
        className="pet-spark pet-spark-b"
        animate={{ y: [0, -10, 0], rotate: [0, -22, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 0.8, 1] }}
        transition={{ duration: 3.1, repeat: Infinity, delay: 0.4 }}
      />
    </motion.div>
  );
}

"use client";

/* ============================================================
   FitPet Motion System — unified easing, spring, duration tokens
   Follows DESIGN.md: gentle breathing, stretching, training,
   replenishing. Transform + opacity only. Respects reduced motion.
   ============================================================ */

/* ---------- reduced motion gate ---------- */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- duration scale (ms) ---------- */
export const DURATION = {
  instant: 80,        // micro-feedback: blink, tiny press
  micro: 150,         // button press, toggle, hover in
  quick: 220,         // hover out, simple state switch
  normal: 320,        // card enter, list stagger
  slow: 480,          // modal, panel slide
  entrance: 620,      // page-load hero entrance
  cinematic: 900,     // onboarding arrival sequence
  ambient: 2800,      // idle breathing cycle
  runCycle: 520,      // one running stride
  blinkGap: 3400,     // time between blinks
} as const;

/* ---------- spring configs ---------- */
export const SPRING = {
  /** Gentle breathing / idle float */
  breathe: { stiffness: 80, damping: 18, mass: 0.8 },
  /** Snappy button press */
  press: { stiffness: 320, damping: 24, mass: 0.6 },
  /** Card entrance */
  card: { stiffness: 140, damping: 20, mass: 1 },
  /** Celebratory bounce (used sparingly) */
  celebrate: { stiffness: 180, damping: 14, mass: 0.7 },
  /** Walk / run stride */
  stride: { stiffness: 200, damping: 22, mass: 0.5 },
} as const;

/* ---------- easing curves ---------- */
export const EASE = {
  /** Primary exit / deceleration — matches --fit-ease-out */
  out: [0.22, 1, 0.36, 1] as const,
  /** Softer deceleration for ambient loops */
  soft: [0.33, 1, 0.68, 1] as const,
  /** Entrance pop */
  backOut: [0.34, 1.56, 0.64, 1] as const,
  /** Smooth in-out for crossfades */
  inOut: [0.45, 0, 0.55, 1] as const,
} as const;

/* ---------- stagger helpers ---------- */
export function stagger(delay: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => i * delay);
}

/* ---------- mood → motion profile ---------- */
export type CharacterMood =
  | "workoutBefore"
  | "workoutAfter"
  | "calorieLow"
  | "calorieBalanced"
  | "calorieHigh";

export interface MoodProfile {
  /** body y-axis float range [min, max] */
  bodyFloat: [number, number];
  /** arm swing amplitude in degrees */
  armSwing: number;
  /** leg swing amplitude in degrees */
  legSwing: number;
  /** head tilt range in degrees */
  headTilt: [number, number];
  /** tail wag speed factor (0 = still) */
  tailWag: number;
  /** whole-body pulse scale range */
  pulse: [number, number];
  /** cycle duration ms */
  cycleMs: number;
}

export const MOOD_PROFILE: Record<CharacterMood, MoodProfile> = {
  workoutBefore: {
    bodyFloat: [0, -3],
    armSwing: 2,
    legSwing: 0,
    headTilt: [-1, 1],
    tailWag: 0.4,
    pulse: [1, 1.008],
    cycleMs: 3600,
  },
  calorieLow: {
    bodyFloat: [0, -5],
    armSwing: 4,
    legSwing: 0,
    headTilt: [-3, 2],
    tailWag: 0.3,
    pulse: [1, 1.01],
    cycleMs: 2800,
  },
  calorieBalanced: {
    bodyFloat: [0, -4],
    armSwing: 3,
    legSwing: 0,
    headTilt: [-1, 1],
    tailWag: 0.5,
    pulse: [1, 1.006],
    cycleMs: 3200,
  },
  workoutAfter: {
    bodyFloat: [0, -12],
    armSwing: 28,
    legSwing: 22,
    headTilt: [-3, 2],
    tailWag: 0.9,
    pulse: [0.97, 1.03],
    cycleMs: 1100,
  },
  calorieHigh: {
    bodyFloat: [0, -18],
    armSwing: 32,
    legSwing: 16,
    headTilt: [-5, 5],
    tailWag: 1.2,
    pulse: [0.96, 1.05],
    cycleMs: 900,
  },
};

/* ---------- reduced-motion overrides ---------- */
export const REDUCED_PROFILE: MoodProfile = {
  bodyFloat: [0, 0],
  armSwing: 0,
  legSwing: 0,
  headTilt: [0, 0],
  tailWag: 0,
  pulse: [1, 1],
  cycleMs: 1000,
};

/* ---------- blink schedule ---------- */
export function blinkKeyframes() {
  return {
    open: { scaleY: 1 },
    closed: { scaleY: 0.08 },
    transition: { duration: DURATION.instant / 1000 },
  };
}

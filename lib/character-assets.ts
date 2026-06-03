import type { CharacterGender, CharacterMood } from "./home-model";

const GIRL_STATE_BASE = "/assets/characters/fitpet-girl-states";

export const characterFallbackSrc: Record<CharacterGender, string> = {
  girl: `${GIRL_STATE_BASE}/workout-before.png`,
  boy: "/assets/characters/fitpet-boy-chibi-cut.png"
};

export const girlMoodSrc: Record<CharacterMood, string> = {
  workoutBefore: `${GIRL_STATE_BASE}/workout-before.png`,
  workoutAfter: `${GIRL_STATE_BASE}/workout-after.png`,
  calorieLow: `${GIRL_STATE_BASE}/calorie-low.png`,
  calorieBalanced: `${GIRL_STATE_BASE}/calorie-balanced.png`,
  calorieHigh: `${GIRL_STATE_BASE}/calorie-high.png`
};

export const treadmillRunnerSrc = `${GIRL_STATE_BASE}/treadmill-running.png`;

export function characterImageSrc(gender: CharacterGender, mood: CharacterMood) {
  return gender === "girl" ? girlMoodSrc[mood] : characterFallbackSrc.boy;
}

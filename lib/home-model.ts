import type { DietGap, HealthData, TrainingLog } from "./member-api";

export type CharacterGender = "boy" | "girl";
export type CharacterMood = "workoutBefore" | "workoutAfter" | "calorieLow" | "calorieBalanced" | "calorieHigh";

export type DailySummary = {
  caloriesGap: number | null;
  caloriesActual: number | null;
  caloriesTarget: number | null;
  exerciseMinutes: number;
  exerciseTargetMinutes: number;
  caloriesBurned: number;
  mood: CharacterMood;
};

export function todayDateString(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateAge(birthDate?: string | null, now = new Date()) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

export function isSameLocalDate(value?: string, date = todayDateString()) {
  return Boolean(value && value.slice(0, 10) === date);
}

export function summarizeTrainingToday(logs: TrainingLog[], date = todayDateString()) {
  return logs.filter((log) => isSameLocalDate(log.trainingDate, date)).reduce<{ exerciseMinutes: number; caloriesBurned: number }>(
    (summary, log) => ({
      exerciseMinutes: summary.exerciseMinutes + (log.durationMinutes ?? 0),
      caloriesBurned: summary.caloriesBurned + (log.caloriesBurned ?? 0)
    }),
    { exerciseMinutes: 0, caloriesBurned: 0 }
  );
}

export function resolveCharacterMood(
  caloriesGap: number | null,
  exerciseMinutes: number,
  exerciseTargetMinutes = 30
): CharacterMood {
  if (caloriesGap !== null && caloriesGap < -150) return "calorieHigh";
  if (caloriesGap !== null && caloriesGap > 450) return "calorieLow";
  if (caloriesGap !== null && Math.abs(caloriesGap) <= 150) return "calorieBalanced";
  if (exerciseMinutes >= exerciseTargetMinutes) return "workoutAfter";
  return "workoutBefore";
}

export function buildDailySummary(dietGap: DietGap | null, logs: TrainingLog[], date = todayDateString()): DailySummary {
  const training = summarizeTrainingToday(logs, date);
  const caloriesGap = typeof dietGap?.caloriesGap === "number" ? dietGap.caloriesGap : null;
  return {
    caloriesGap,
    caloriesActual: typeof dietGap?.caloriesActual === "number" ? dietGap.caloriesActual : null,
    caloriesTarget: typeof dietGap?.caloriesTarget === "number" ? dietGap.caloriesTarget : null,
    exerciseMinutes: training.exerciseMinutes,
    exerciseTargetMinutes: 30,
    caloriesBurned: training.caloriesBurned,
    mood: resolveCharacterMood(caloriesGap, training.exerciseMinutes, 30)
  };
}

export function healthDataComplete(data: HealthData | null | undefined) {
  return Boolean(data?.gender !== undefined && data?.birthDate && data?.height && data?.weight);
}

export function genderFromHealthData(data: HealthData | null | undefined): CharacterGender | null {
  if (data?.gender === 0) return "girl";
  if (data?.gender === 1) return "boy";
  return null;
}

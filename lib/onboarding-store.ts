import type { CharacterGender } from "./home-model";

const ONBOARDING_KEY = "fitpet:onboarding:v1";
const CHARACTER_KEY = "fitpet:character:v1";

export type OnboardingState = {
  completed: boolean;
  characterGender: CharacterGender | null;
};

export function readOnboardingState(): OnboardingState {
  if (typeof window === "undefined") return { completed: false, characterGender: null };
  const completed = window.localStorage.getItem(ONBOARDING_KEY) === "complete";
  const characterGender = window.localStorage.getItem(CHARACTER_KEY) as CharacterGender | null;
  return {
    completed,
    characterGender: characterGender === "boy" || characterGender === "girl" ? characterGender : null
  };
}

export function saveCharacterGender(gender: CharacterGender) {
  window.localStorage.setItem(CHARACTER_KEY, gender);
}

export function completeOnboarding(gender: CharacterGender) {
  window.localStorage.setItem(CHARACTER_KEY, gender);
  window.localStorage.setItem(ONBOARDING_KEY, "complete");
}

export function resetOnboarding() {
  window.localStorage.removeItem(ONBOARDING_KEY);
  window.localStorage.removeItem(CHARACTER_KEY);
}

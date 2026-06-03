import { AnimatedCharacter } from "@/components/character/animated-character";
import type { CharacterMood } from "@/lib/home-model";

const moods: CharacterMood[] = ["workoutBefore", "workoutAfter", "calorieLow", "calorieBalanced", "calorieHigh"];

export default function CharacterPreviewPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 32, background: "#f8f1e0", color: "#20242d" }}>
      <h1 style={{ margin: "0 0 20px", fontSize: 32 }}>FitPet Character Preview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 24 }}>
        {moods.map((mood) => (
          <section
            key={mood}
            style={{
              display: "grid",
              minHeight: 360,
              placeItems: "center",
              padding: 24,
              border: "3px solid #20242d",
              borderRadius: 28,
              background: "#fff9ec",
              boxShadow: "0 10px 0 rgba(32,36,45,.16)"
            }}
          >
            <div style={{ width: 210 }}>
              <AnimatedCharacter gender="girl" mood={mood} priority />
            </div>
            <strong>{mood}</strong>
          </section>
        ))}
      </div>
    </main>
  );
}

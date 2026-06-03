"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { CharacterGender } from "@/lib/home-model";
import { characterFallbackSrc } from "@/lib/character-assets";

type CharacterChoiceProps = {
  selected: CharacterGender | null;
  onSelect: (gender: CharacterGender) => void;
};

const choices: Array<{
  gender: CharacterGender;
  title: string;
  detail: string;
  accent: string;
  image: string;
}> = [
  {
    gender: "girl",
    title: "女孩伙伴",
    detail: "粉色发带、轻快训练节奏，适合温柔但坚定的日常陪伴。",
    accent: "粉色发带",
    image: characterFallbackSrc.girl
  },
  {
    gender: "boy",
    title: "男孩伙伴",
    detail: "蓝色护腕、清爽运动感，适合直接又可靠的训练提醒。",
    accent: "蓝色护腕",
    image: characterFallbackSrc.boy
  }
];

export function CharacterChoice({ selected, onSelect }: CharacterChoiceProps) {
  return (
    <section className="choice-step" aria-labelledby="character-choice-title">
      <div className="onboarding-heading">
        <span>第一步</span>
        <h1 id="character-choice-title">选择你的健身伙伴</h1>
        <p>之后可以在个人主页调整。伙伴只影响首页陪伴形象，不改变功能结构。</p>
      </div>

      <div className="character-choice-grid">
        {choices.map((choice) => (
          <button
            key={choice.gender}
            type="button"
            className={`character-choice-card ${choice.gender} ${selected === choice.gender ? "active" : ""}`}
            aria-pressed={selected === choice.gender}
            onClick={() => onSelect(choice.gender)}
          >
            <span className="choice-check" aria-hidden="true">
              <Check size={18} />
            </span>
            <span className="choice-art">
              <Image src={choice.image} alt="" width={360} height={360} priority />
            </span>
            <span className="choice-copy">
              <strong>{choice.title}</strong>
              <em>{choice.accent}</em>
              <small>{choice.detail}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Ruler, Scale, CalendarDays } from "lucide-react";
import type { CharacterGender } from "@/lib/home-model";

export type BodyDataFormValue = {
  height: number;
  weight: number;
  birthDate: string;
};

type BodyDataFormProps = {
  gender: CharacterGender;
  saving: boolean;
  onBack: () => void;
  onSubmit: (value: BodyDataFormValue) => void;
};

export function BodyDataForm({ gender, saving, onBack, onSubmit }: BodyDataFormProps) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedHeight = Number(height);
    const parsedWeight = Number(weight);
    const birthdayTime = new Date(birthDate).getTime();

    if (!Number.isFinite(parsedHeight) || parsedHeight < 80 || parsedHeight > 230) {
      setError("请输入合理的身高。");
      return;
    }

    if (!Number.isFinite(parsedWeight) || parsedWeight < 25 || parsedWeight > 250) {
      setError("请输入合理的体重。");
      return;
    }

    if (!birthDate || Number.isNaN(birthdayTime) || birthdayTime > Date.now()) {
      setError("出生日期不能晚于今天。");
      return;
    }

    setError("");
    onSubmit({ height: parsedHeight, weight: parsedWeight, birthDate });
  };

  return (
    <section className="form-step" aria-labelledby="body-data-title">
      <button className="ghost-back" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        返回
      </button>

      <div className="onboarding-heading">
        <span>第二步</span>
        <h1 id="body-data-title">补全身体基础数据</h1>
        <p>{gender === "girl" ? "女孩伙伴" : "男孩伙伴"}会根据身高、体重和年龄展示更贴近日常的健康状态。</p>
      </div>

      <form className="onboarding-form" onSubmit={handleSubmit}>
        <label>
          <span>
            <Ruler size={18} />
            身高
          </span>
          <input inputMode="decimal" placeholder="168" value={height} onChange={(event) => setHeight(event.target.value)} />
          <small>单位 cm，范围 80 到 230。</small>
        </label>

        <label>
          <span>
            <Scale size={18} />
            体重
          </span>
          <input inputMode="decimal" placeholder="56.5" value={weight} onChange={(event) => setWeight(event.target.value)} />
          <small>单位 kg，范围 25 到 250。</small>
        </label>

        <label>
          <span>
            <CalendarDays size={18} />
            出生日期
          </span>
          <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          <small>用于计算首页年龄，不会展示完整生日。</small>
        </label>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="primary-step-button" type="submit" disabled={saving}>
          {saving ? "保存中" : "保存身体数据"}
        </button>
      </form>
    </section>
  );
}

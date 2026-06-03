"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Beef, Flame, Wheat, Droplet } from "lucide-react";
import type { DietTarget } from "@/lib/member-api";

type TargetSetupFormProps = {
  saving: boolean;
  onBack: () => void;
  onSubmit: (value: DietTarget | null) => void;
};

function optionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function TargetSetupForm({ saving, onBack, onSubmit }: TargetSetupFormProps) {
  const [caloriesTarget, setCaloriesTarget] = useState("");
  const [proteinTarget, setProteinTarget] = useState("");
  const [fatTarget, setFatTarget] = useState("");
  const [carbohydrateTarget, setCarbohydrateTarget] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const calories = optionalNumber(caloriesTarget);
    const protein = optionalNumber(proteinTarget);
    const fat = optionalNumber(fatTarget);
    const carbohydrate = optionalNumber(carbohydrateTarget);

    if ([calories, protein, fat, carbohydrate].some((value) => value === null)) {
      setError("目标需要填写大于 0 的数字，或直接跳过。");
      return;
    }

    if (!calories && !protein && !fat && !carbohydrate) {
      onSubmit(null);
      return;
    }

    const target: DietTarget = {};
    if (typeof calories === "number") target.caloriesTarget = calories;
    if (typeof protein === "number") target.proteinTarget = protein;
    if (typeof fat === "number") target.fatTarget = fat;
    if (typeof carbohydrate === "number") target.carbohydrateTarget = carbohydrate;

    setError("");
    onSubmit(target);
  };

  return (
    <section className="form-step" aria-labelledby="target-setup-title">
      <button className="ghost-back" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        返回
      </button>

      <div className="onboarding-heading">
        <span>第三步</span>
        <h1 id="target-setup-title">设置饮食目标</h1>
        <p>如果你还不确定，可以先使用系统推荐目标，之后在饮食记录里再调整。</p>
      </div>

      <form className="onboarding-form target-form" onSubmit={handleSubmit}>
        <label>
          <span>
            <Flame size={18} />
            热量目标
          </span>
          <input inputMode="numeric" placeholder="1800" value={caloriesTarget} onChange={(event) => setCaloriesTarget(event.target.value)} />
          <small>单位 kcal。</small>
        </label>

        <label>
          <span>
            <Beef size={18} />
            蛋白质目标
          </span>
          <input inputMode="numeric" placeholder="90" value={proteinTarget} onChange={(event) => setProteinTarget(event.target.value)} />
          <small>单位 g。</small>
        </label>

        <label>
          <span>
            <Droplet size={18} />
            脂肪目标
          </span>
          <input inputMode="numeric" placeholder="55" value={fatTarget} onChange={(event) => setFatTarget(event.target.value)} />
          <small>单位 g。</small>
        </label>

        <label>
          <span>
            <Wheat size={18} />
            碳水目标
          </span>
          <input
            inputMode="numeric"
            placeholder="220"
            value={carbohydrateTarget}
            onChange={(event) => setCarbohydrateTarget(event.target.value)}
          />
          <small>单位 g。</small>
        </label>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="target-actions">
          <button className="primary-step-button" type="submit" disabled={saving}>
            {saving ? "保存中" : "保存饮食目标"}
          </button>
          <button className="secondary-step-button" type="button" disabled={saving} onClick={() => onSubmit(null)}>
            先用系统推荐目标
          </button>
        </div>
      </form>
    </section>
  );
}

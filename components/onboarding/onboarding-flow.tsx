"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { ApiError, isAuthStatus } from "@/lib/api-client";
import { clearAuthSession, hasMemberSession } from "@/lib/auth-store";
import { saveDietTarget, saveHealthData, type DietTarget, type HealthData } from "@/lib/member-api";
import type { CharacterGender } from "@/lib/home-model";
import { completeOnboarding, saveCharacterGender } from "@/lib/onboarding-store";
import { ArrivalAnimation } from "./arrival-animation";
import { BodyDataForm, type BodyDataFormValue } from "./body-data-form";
import { CharacterChoice } from "./character-choice";
import { TargetSetupForm } from "./target-setup-form";

type FlowStep = "character" | "body" | "target" | "arrival";

function measureTimeString() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("character");
  const [gender, setGender] = useState<CharacterGender | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(hasMemberSession());
  }, []);

  const redirectToAuth = () => {
    router.replace("/auth?next=/onboarding");
  };

  const handleAuthError = (err: unknown) => {
    if (err instanceof ApiError && isAuthStatus(err.status)) {
      clearAuthSession();
      setAuthed(false);
      setError("登录已过期，请重新登录后继续保存。");
      redirectToAuth();
      return true;
    }

    return false;
  };

  const handleChooseCharacter = (nextGender: CharacterGender) => {
    setGender(nextGender);
    saveCharacterGender(nextGender);
    setError("");
    setStep("body");
  };

  const handleBodySubmit = async (value: BodyDataFormValue) => {
    if (!hasMemberSession()) {
      setAuthed(false);
      setError("保存身体数据需要先登录。");
      redirectToAuth();
      return;
    }

    if (!gender) {
      setError("请先选择你的健身伙伴。");
      setStep("character");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload: HealthData = {
        gender: gender === "girl" ? 0 : 1,
        birthDate: value.birthDate,
        height: value.height,
        weight: value.weight,
        measureTime: measureTimeString()
      };
      await saveHealthData(payload);
      setStep("target");
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err instanceof Error ? err.message : "身体数据保存失败，请稍后再试。");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTargetSubmit = async (target: DietTarget | null) => {
    if (!hasMemberSession()) {
      setAuthed(false);
      setError("保存饮食目标需要先登录。");
      redirectToAuth();
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (target) {
        await saveDietTarget(target);
      }
      setStep("arrival");
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err instanceof Error ? err.message : "饮食目标保存失败，请稍后再试。");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleArrived = () => {
    if (gender) {
      completeOnboarding(gender);
    }
    router.push("/");
  };

  return (
    <main className="onboarding-page" aria-label="Fit-Pet 首次设置">
      <section className="onboarding-shell">
        <div className="onboarding-track" aria-label="设置进度">
          {["伙伴", "身体", "目标", "启程"].map((label, index) => {
            const stepOrder: FlowStep[] = ["character", "body", "target", "arrival"];
            const activeIndex = stepOrder.indexOf(step);
            return (
              <span key={label} className={index <= activeIndex ? "active" : ""}>
                {label}
              </span>
            );
          })}
        </div>

        <div className="onboarding-panel">
          {!authed ? (
            <div className="onboarding-auth-callout">
              <div>
                <strong>先登录，再保存健康档案</strong>
                <span>身体数据会写入后端账户，需要会员 token。</span>
              </div>
              <Link href="/auth?next=/onboarding">
                <LogIn size={18} />
                去登录
              </Link>
            </div>
          ) : null}

          {error ? (
            <p className="onboarding-error" role="alert">
              {error}
            </p>
          ) : null}

          {step === "character" ? <CharacterChoice selected={gender} onSelect={handleChooseCharacter} /> : null}

          {step === "body" && gender ? (
            <BodyDataForm gender={gender} saving={saving} onBack={() => setStep("character")} onSubmit={handleBodySubmit} />
          ) : null}

          {step === "target" ? (
            <TargetSetupForm saving={saving} onBack={() => setStep("body")} onSubmit={handleTargetSubmit} />
          ) : null}

          {step === "arrival" && gender ? <ArrivalAnimation gender={gender} onDone={handleArrived} /> : null}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, AlertCircle, CalendarDays, MapPin } from "lucide-react";
import { BodyStatsRow } from "@/components/home/body-stats-row";
import { CharacterStage } from "@/components/home/character-stage";
import { DailyFocus } from "@/components/home/daily-focus";
import { HomeActionGrid } from "@/components/home/home-action-grid";
import { HomeSkeleton } from "@/components/home/home-skeleton";
import { KineticGymBackground } from "@/components/home/kinetic-gym-background";
import { ProfileAvatarButton } from "@/components/home/profile-avatar-button";
import { ApiError, isAuthStatus } from "@/lib/api-client";
import { clearAuthSession, hasMemberSession } from "@/lib/auth-store";
import { buildDailySummary, genderFromHealthData, healthDataComplete, todayDateString, type CharacterGender } from "@/lib/home-model";
import {
  getChatUnreadCount,
  getCurrentTraffic,
  getCurrentTrainingPlan,
  getDietGap,
  getLatestHealthData,
  getMemberProfile,
  getTrainingLogs,
  type DietGap,
  type HealthData,
  type MemberProfile,
  type TrafficSnapshot,
  type TrainingLog,
  type TrainingPlan
} from "@/lib/member-api";
import { readOnboardingState } from "@/lib/onboarding-store";
import "./page.css";

type HomeData = {
  profile: MemberProfile | null;
  healthData: HealthData | null;
  dietGap: DietGap | null;
  trainingLogs: TrainingLog[];
  trainingPlan: TrainingPlan | null;
  traffic: TrafficSnapshot[];
  unreadCount: number;
};

async function settle<T>(request: Promise<T>, fallback: T) {
  try {
    return await request;
  } catch (err) {
    if (err instanceof ApiError && isAuthStatus(err.status)) {
      throw err;
    }

    return fallback;
  }
}

function formatToday() {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(new Date());
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadHome() {
      if (!hasMemberSession()) {
        router.replace("/auth");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const date = todayDateString();
        const [profile, healthData] = await Promise.all([settle(getMemberProfile(), null), settle(getLatestHealthData(), null)]);
        const onboarding = readOnboardingState();

        if (!healthDataComplete(healthData) && !onboarding.completed) {
          router.replace("/onboarding");
          return;
        }

        const [dietGap, trainingLogs, trainingPlan, traffic, unreadCount] = await Promise.all([
          settle(getDietGap(date), null),
          settle(getTrainingLogs(), []),
          settle(getCurrentTrainingPlan(), null),
          settle(getCurrentTraffic(), []),
          settle(getChatUnreadCount(), 0)
        ]);

        if (!alive) return;

        setData({
          profile,
          healthData,
          dietGap,
          trainingLogs,
          trainingPlan,
          traffic,
          unreadCount
        });
      } catch (err) {
        if (!alive) return;
        if (err instanceof ApiError && isAuthStatus(err.status)) {
          clearAuthSession();
          router.replace("/auth");
          return;
        }

        setError(err instanceof Error ? err.message : "首页数据加载失败。");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadHome();

    return () => {
      alive = false;
    };
  }, [router]);

  const dailySummary = useMemo(() => buildDailySummary(data?.dietGap ?? null, data?.trainingLogs ?? []), [data?.dietGap, data?.trainingLogs]);
  const onboarding = typeof window !== "undefined" ? readOnboardingState() : { characterGender: null };
  const gender: CharacterGender = onboarding.characterGender ?? genderFromHealthData(data?.healthData) ?? "girl";
  const memberName = data?.profile?.nickname || data?.profile?.name || data?.profile?.username;
  const busiestArea = data?.traffic
    .filter((item) => typeof item.currentCount === "number")
    .sort((a, b) => (b.currentCount ?? 0) - (a.currentCount ?? 0))[0];

  if (loading) {
    return (
      <main className="home-page" aria-label="Fit-Pet 会员健康首页">
        <div className="home-shell">
          <HomeSkeleton gender={readOnboardingState().characterGender ?? "girl"} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page" aria-label="Fit-Pet 会员健康首页">
        <div className="home-shell">
          <section className="home-error" role="alert">
            <AlertCircle size={28} />
            <h1>首页数据暂时没有加载成功</h1>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              重新加载
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page" aria-label="Fit-Pet 会员健康首页">
      <KineticGymBackground />
      <div className="home-shell">
        <header className="home-topbar">
          <div className="brand-area">
            <span className="brand-paw" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <b />
            </span>
            <div>
              <span className="brand-kicker">Fit-Pet 健康伙伴</span>
              <h1>今日健康首页</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="today-pill">
              <CalendarDays size={18} />
              <span>{formatToday()}</span>
            </div>
            <ProfileAvatarButton gender={gender} name={memberName} unreadCount={data?.unreadCount ?? 0} />
          </div>
        </header>

        <section className="home-hero">
          <DailyFocus
            caloriesGap={dailySummary.caloriesGap}
            caloriesActual={dailySummary.caloriesActual}
            caloriesTarget={dailySummary.caloriesTarget}
            exerciseMinutes={dailySummary.exerciseMinutes}
            exerciseTargetMinutes={dailySummary.exerciseTargetMinutes}
          />

          <div className="center-stack">
            <CharacterStage
              gender={gender}
              mood={dailySummary.mood}
              calorieGap={dailySummary.caloriesGap}
              exerciseMinutes={dailySummary.exerciseMinutes}
            />
            <BodyStatsRow healthData={data?.healthData ?? null} />
          </div>

          <HomeActionGrid dietGap={data?.dietGap ?? null} trainingPlan={data?.trainingPlan ?? null} traffic={data?.traffic ?? []} />
        </section>

        <section className="home-bottom">
          <article className="route-card training-route">
            <div>
              <span>训练计划</span>
              <h2>{data?.trainingPlan?.name ?? data?.trainingPlan?.goal ?? "等待生成训练计划"}</h2>
              <p>
                {data?.trainingPlan
                  ? "当前训练计划已经接入首页，今日运动时长会从训练日志自动汇总。"
                  : "进入训练页后可以生成或查看你的训练计划。"}
              </p>
            </div>
            <div className="route-steps">
              <span>
                <Activity size={16} />
                今日 {dailySummary.exerciseMinutes} min
              </span>
              <span>{dailySummary.caloriesBurned} kcal 消耗</span>
              <Link href="/training">查看训练</Link>
            </div>
          </article>

          <article className="route-card venue-route">
            <div>
              <span>场馆状态</span>
              <h2>{busiestArea ? `${busiestArea.areaName ?? "主要区域"} 当前 ${busiestArea.currentCount ?? 0} 人` : "等待场馆人流数据"}</h2>
              <p>{busiestArea ? "首页展示当前最忙区域，完整热力图可以在场馆状态页查看。" : "后端返回实时人流后，这里会显示场区容量和舒适度。"}</p>
            </div>
            <div className="route-steps">
              <span>
                <MapPin size={16} />
                {busiestArea?.capacity ? `容量 ${busiestArea.capacity}` : "实时热度"}
              </span>
              <Link href="/venue">查看场馆</Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

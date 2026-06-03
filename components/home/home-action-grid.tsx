import Link from "next/link";
import { Apple, CalendarCheck, Dumbbell, MapPin, Weight } from "lucide-react";
import type { DietGap, TrainingPlan, TrafficSnapshot } from "@/lib/member-api";

type HomeActionGridProps = {
  dietGap: DietGap | null;
  trainingPlan: TrainingPlan | null;
  traffic: TrafficSnapshot[];
};

export function HomeActionGrid({ dietGap, trainingPlan, traffic }: HomeActionGridProps) {
  const busiestArea = traffic
    .filter((item) => typeof item.currentCount === "number")
    .sort((a, b) => (b.currentCount ?? 0) - (a.currentCount ?? 0))[0];

  const actions = [
    {
      title: "训练计划",
      detail: trainingPlan?.name ?? trainingPlan?.goal ?? "查看当前训练安排",
      meta: trainingPlan ? "已接入" : "等待计划",
      tone: "mint",
      icon: Dumbbell,
      href: "/training"
    },
    {
      title: "饮食记录",
      detail: dietGap?.caloriesGap === undefined ? "拍照识别或手动记录" : `今日热量 ${Math.round(dietGap.caloriesActual ?? 0)} kcal`,
      meta: "AI 识别",
      tone: "yolk",
      icon: Apple,
      href: "/health"
    },
    {
      title: "课程预约",
      detail: "团课 & 私教预约与管理",
      meta: "团课·私教",
      tone: "blue",
      icon: CalendarCheck,
      href: "/courses"
    },
    {
      title: "身体记录",
      detail: "身高体重体脂率变化趋势",
      meta: "体测趋势",
      tone: "pink",
      icon: Weight,
      href: "/body"
    },
    {
      title: "场馆状态",
      detail: busiestArea ? `${busiestArea.areaName ?? "场区"} ${busiestArea.currentCount ?? 0}/${busiestArea.capacity ?? "--"}` : "查看人流和区域热度",
      meta: busiestArea ? "实时" : "等待接入",
      tone: "green",
      icon: MapPin,
      href: "/venue"
    },

  ];

  return (
    <aside className="action-panel" aria-labelledby="home-action-title">
      <div className="section-title">
        <span>Action Map</span>
        <h2 id="home-action-title">下一步入口</h2>
      </div>
      <div className="action-grid">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} className={`action-tile tone-${item.tone}`} href={item.href}>
              <span className="action-icon">
                <Icon size={22} />
              </span>
              <span className="action-copy">
                <strong>{item.title}</strong>
                <em>{item.detail}</em>
              </span>
              <b>{item.meta}</b>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
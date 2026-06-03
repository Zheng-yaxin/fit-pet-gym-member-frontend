import Link from "next/link";
import { Cake, Ruler, Scale } from "lucide-react";
import { calculateAge } from "@/lib/home-model";
import type { HealthData } from "@/lib/member-api";

type BodyStatsRowProps = {
  healthData: HealthData | null;
};

function statValue(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "--";
  if (typeof value === "string" && value.trim()) return value;
  return "--";
}

export function BodyStatsRow({ healthData }: BodyStatsRowProps) {
  const age = calculateAge(healthData?.birthDate);
  const stats = [
    { label: "身高", value: statValue(healthData?.height), unit: "cm", icon: Ruler },
    { label: "体重", value: statValue(healthData?.weight), unit: "kg", icon: Scale },
    { label: "年龄", value: age !== null ? String(age) : "--", unit: "岁", icon: Cake }
  ];

  return (
    <div className="body-stats" aria-label="身体数据">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.label} href="/body" className="body-stat-control">
            <Icon size={19} />
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <em>{stat.unit}</em>
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getDashboardOverview } from "@/lib/admin-api";
import { Users, CreditCard, Dumbbell, BookOpen, TrendingUp, Activity } from "lucide-react";

function fmtVal(v: unknown): string { if (v === null || v === undefined) return "--"; return String(v); }

export default function AdminDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "会员总数", value: fmtVal(data?.memberCount), sub: "注册会员", icon: Users, color: "#6366f1" },
    { label: "有效会员卡", value: fmtVal(data?.activeCardCount), sub: "当前有效", icon: CreditCard, color: "#8b5cf6" },
    { label: "器材总数", value: fmtVal(data?.equipmentCount), sub: "在册器材", icon: Dumbbell, color: "#f59e0b" },
    { label: "课程数量", value: fmtVal(data?.courseCount), sub: "可选课程", icon: BookOpen, color: "#10b981" },
    { label: "今日训练", value: fmtVal(data?.todayTrainingCount ?? data?.todayLogCount), sub: "训练人次", icon: Activity, color: "#ef4444" },
    { label: "本月营收", value: data?.monthlyRevenue != null ? `\u00a5${fmtVal(data?.monthlyRevenue)}` : "--", sub: "累计收入", icon: TrendingUp, color: "#3b82f6" },
  ];

  return (
    <div>
      <div className="admin-section">
        <h2>控制台概览</h2>
      </div>
      <div className="stat-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={s.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3>{s.label}</h3>
                  <div className="stat-value">{loading ? "..." : s.value}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
                <Icon size={24} style={{ color: s.color, opacity: .5 }} />
              </div>
            </div>
          );
        })}
      </div>
      {loading && <p style={{ color: "var(--admin-muted)", textAlign: "center", padding: 40 }}>加载中...</p>}
    </div>
  );
}
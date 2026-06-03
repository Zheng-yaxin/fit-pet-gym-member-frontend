"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Flame, MapPin, RefreshCcw, Sparkles, Thermometer } from "lucide-react";
import { FeatureMotionDirector } from "@/components/motion/feature-motion-director";
import { FeatureStatusCard } from "@/components/motion/feature-status-card";
import {
  getCurrentTraffic,
  getTrafficHeatmap,
  getTrafficRecommendations,
  type TrafficRecommendation,
  type TrafficSnapshot
} from "@/lib/member-api";
import "../feature-placeholder.css";

function ratio(item: TrafficSnapshot) {
  if (!item.capacity) return 0;
  return Math.min(100, Math.round(((item.currentCount ?? 0) / item.capacity) * 100));
}

function heatColor(percent: number) {
  if (percent >= 80) return { bg: "#ef4444", text: "拥挤", glow: "rgba(239,68,68,0.3)" };
  if (percent >= 50) return { bg: "#f59e0b", text: "较忙", glow: "rgba(245,158,11,0.25)" };
  if (percent >= 20) return { bg: "#22c55e", text: "舒适", glow: "rgba(34,197,94,0.2)" };
  return { bg: "#3b82f6", text: "空闲", glow: "rgba(59,130,246,0.15)" };
}

export default function VenuePage() {
  const [current, setCurrent] = useState<TrafficSnapshot[]>([]);
  const [heatmap, setHeatmap] = useState<TrafficSnapshot[]>([]);
  const [recommendations, setRecommendations] = useState<TrafficRecommendation[]>([]);
  const [goal, setGoal] = useState("strength");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const busiest = useMemo(() => current.toSorted((a, b) => (b.currentCount ?? 0) - (a.currentCount ?? 0))[0], [current]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextCurrent, nextHeatmap, nextRecommendations] = await Promise.all([
        getCurrentTraffic(),
        getTrafficHeatmap(),
        getTrafficRecommendations(goal, 4)
      ]);
      setCurrent(nextCurrent ?? []);
      setHeatmap(nextHeatmap ?? []);
      setRecommendations(nextRecommendations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "场馆数据加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [goal]);

  return (
    <main className="feature-page feature-motion-page feature-motion-venue" aria-label="场馆状态">
      <FeatureMotionDirector variant="venue" />
      <div className="feature-shell wide">
        <Link className="feature-back" href="/"><ArrowLeft size={18} />返回首页</Link>
        <section className="feature-panel">
          <div className="feature-heading">
            <span>Venue</span>
            <h1>场馆状态</h1>
            <p>实时人流与区域热力，帮你避开最拥挤的训练时段。</p>
          </div>

          {error ? <FeatureStatusCard kind="error" title="场馆热力暂时没接上" detail={error} /> : null}
          {loading ? <FeatureStatusCard title="场馆地图正在点亮" detail="正在同步实时人流和全天热力样本。" /> : null}

          <div className="feature-toolbar">
            {[
              ["strength", "Strength"],
              ["cardio", "Cardio"],
              ["mobility", "Mobility"],
              ["general", "General"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={goal === value ? "is-active" : ""}
                onClick={() => setGoal(value)}
              >
                <Sparkles size={16} />{label}
              </button>
            ))}
            <button type="button" onClick={load} disabled={loading}><RefreshCcw size={16} />刷新</button>
          </div>

          <article className="feature-list">
            <span><Sparkles size={16} />Smart route picks</span>
            {recommendations.map((item, index) => {
              const percent = item.occupancyPercent ?? 0;
              const h = heatColor(percent);
              return (
                <div className="feature-row" key={item.areaId ?? `${item.areaName}-${index}`}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: h.glow, color: h.bg, display: "grid", placeItems: "center", fontWeight: 800 }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3>{item.areaName ?? "Training area"} <small style={{ color: h.bg }}>· {item.statusLabel ?? h.text}</small></h3>
                    <p style={{ margin: "4px 0" }}>{item.reason ?? "Traffic is suitable for a focused block."}</p>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>{item.action ?? "Start the next training block here."}</p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 74 }}>
                    <b style={{ color: h.bg, fontSize: 20 }}>{item.score ?? Math.max(0, 100 - percent)}</b>
                    <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: 12 }}>{percent}% full</p>
                  </div>
                </div>
              );
            })}
            {!recommendations.length ? <p>{loading ? "Loading smart picks..." : "No recommendation data yet."}</p> : null}
          </article>

          <div className="feature-grid three">
            <article className="feature-data"><span>监控区域</span><h2>{current.length}</h2><p>当前快照</p></article>
            <article className="feature-data"><span>最忙区域</span><h2>{busiest?.areaName ?? "--"}</h2><p>{busiest ? `${busiest.currentCount ?? 0}/${busiest.capacity ?? "--"} 人` : "暂无数据"}</p></article>
            <article className="feature-data"><span>热力样本</span><h2>{heatmap.length}</h2><p>全天趋势数据</p></article>
          </div>

          <article className="feature-list">
            <span><MapPin size={16} />实时区域</span>
            {current.map((item) => {
              const pct = ratio(item);
              const h = heatColor(pct);
              return (
                <div className="feature-row" key={item.id ?? `${item.areaName}-${item.snapshotTime}`}>
                  <div style={{ flex: 1 }}>
                    <h3>{item.areaName ?? "未命名区域"}</h3>
                    <p style={{ margin: "4px 0" }}>{item.currentCount ?? 0}/{item.capacity ?? "--"} 人</p>
                    <div style={{ height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: h.bg, borderRadius: 4, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                  <b style={{ color: h.bg, fontSize: 18 }}>{pct}%</b>
                </div>
              );
            })}
            {!current.length ? <p>{loading ? "加载中..." : "暂无场馆人流数据"}</p> : null}
          </article>

          <div className="feature-heading" style={{ marginTop: 24 }}>
            <span><Flame size={16} /> Heatmap</span>
            <h2>区域热力</h2>
          </div>

          <div className="venue-heatmap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginTop: 12 }}>
            {current.map((item) => {
              const pct = ratio(item);
              const h = heatColor(pct);
              return (
                <div key={item.id ?? item.areaName} style={{
                  background: h.glow, borderRadius: 16, padding: "16px 12px", textAlign: "center",
                  border: `1px solid ${h.bg}33`, transition: "all 0.3s ease", cursor: "default"
                }}>
                  <Thermometer size={20} style={{ color: h.bg, marginBottom: 4 }} />
                  <h3 style={{ margin: "4px 0", fontSize: 15 }}>{item.areaName ?? "--"}</h3>
                  <div style={{ fontSize: 28, fontWeight: 700, color: h.bg }}>{pct}%</div>
                  <span style={{ fontSize: 12, color: h.bg, fontWeight: 600 }}>{h.text}</span>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--border)", marginTop: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: h.bg, borderRadius: 3, transition: "width 1s ease", animation: "heatPulse 2s ease-in-out infinite" }} />
                  </div>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{item.currentCount ?? 0} / {item.capacity ?? "--"} 人</p>
                </div>
              );
            })}
          </div>

          {heatmap.length > 0 ? (
            <article className="feature-list" style={{ marginTop: 24 }}>
              <span>全天趋势</span>
              {(() => {
                const byHour = new Map<string, TrafficSnapshot[]>();
                heatmap.forEach((s) => {
                  const hour = s.snapshotTime?.slice(11, 13) ?? "??";
                  if (!byHour.has(hour)) byHour.set(hour, []);
                  byHour.get(hour)!.push(s);
                });
                return Array.from(byHour.entries()).sort(([a], [b]) => Number(a) - Number(b)).map(([hour, snaps]) => {
                  const avg = Math.round(snaps.reduce((s, item) => s + (item.currentCount ?? 0), 0) / snaps.length);
                  const cap = snaps[0]?.capacity ?? 20;
                  const pct = Math.min(100, Math.round((avg / cap) * 100));
                  const h = heatColor(pct);
                  return (
                    <div className="feature-row" key={hour}>
                      <div style={{ flex: 1 }}>
                        <h3>{hour}:00</h3>
                        <p>平均 {avg} 人</p>
                      </div>
                      <div style={{ width: 120, height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: h.bg, borderRadius: 4, transition: "width 1.2s ease" }} />
                      </div>
                      <b style={{ color: h.bg, minWidth: 32, textAlign: "right" }}>{pct}%</b>
                    </div>
                  );
                });
              })()}
            </article>
          ) : null}

          <style jsx>{`
            @keyframes heatPulse {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; }
            }
          `}</style>
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, LineChart, Save } from "lucide-react";
import { getHealthDataHistory, getLatestHealthData, saveHealthData, type HealthData } from "@/lib/member-api";
import { calculateAge } from "@/lib/home-model";
import "../feature-placeholder.css";

function nowDateTime() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

export default function BodyPage() {
  const [latest, setLatest] = useState<HealthData | null>(null);
  const [history, setHistory] = useState<HealthData[]>([]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFatRate, setBodyFatRate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"0" | "1">("1");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [chartHovered, setChartHovered] = useState<number | null>(null);

  const bmi = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    return h > 0 && w > 0 ? (w / (h * h)).toFixed(1) : "--";
  }, [height, weight]);

  const reversedHistory = useMemo(() => [...(history ?? [])].reverse().slice(0, 14), [history]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextLatest, nextHistory] = await Promise.all([getLatestHealthData(), getHealthDataHistory()]);
      setLatest(nextLatest);
      setHistory(nextHistory ?? []);
      setHeight(nextLatest?.height ? String(nextLatest.height) : "");
      setWeight(nextLatest?.weight ? String(nextLatest.weight) : "");
      setBodyFatRate(nextLatest?.bodyFatRate ? String(nextLatest.bodyFatRate) : "");
      setBirthDate(nextLatest?.birthDate?.slice(0, 10) ?? "");
      setGender(nextLatest?.gender === 0 ? "0" : "1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "身体记录加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data: HealthData = { gender: Number(gender) as 0 | 1, birthDate, height: Number(height), weight: Number(weight), measureTime: nowDateTime() };
      const bfr = Number(bodyFatRate);
      if (bfr > 0 && bfr < 60) data.bodyFatRate = bfr;
      await saveHealthData(data);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "身体数据保存失败。");
    } finally { setBusy(false); }
  };

  const chartData = useMemo(() => {
    const items = [...reversedHistory].reverse();
    if (items.length < 2) return null;
    const weights = items.map((h) => h.weight ?? 0);
    const maxW = Math.max(...weights);
    const minW = Math.min(...weights);
    const range = (maxW - minW) || 10;
    const bfrs = items.map((h) => h.bodyFatRate ?? null);
    const maxB = Math.max(...bfrs.filter((b): b is number => b !== null));
    const minB = Math.min(...bfrs.filter((b): b is number => b !== null));
    const bfrRange = (maxB - minB) || 10;
    return { items, maxW, minW, range, bfrs, maxB, minB, bfrRange };
  }, [reversedHistory]);

  return (
    <main className="feature-page" aria-label="身体记录">
      <div className="feature-shell wide">
        <Link className="feature-back" href="/"><ArrowLeft size={18} />返回首页</Link>
        <section className="feature-panel">
          <div className="feature-heading">
            <span>Body Records</span>
            <h1>身体记录</h1>
            <p>维护身高、体重、体脂率，查看精美动画趋势图。</p>
          </div>

          {error ? <p className="feature-error">{error}</p> : null}

          <div className="feature-grid four">
            <article className="feature-data"><span>当前体重</span><h2>{latest?.weight ?? "--"} kg</h2><p>{latest?.measureTime?.slice(0, 10) ?? "暂无"}</p></article>
            <article className="feature-data"><span>BMI</span><h2>{latest?.bmi ?? bmi}</h2><p>身高 {latest?.height ?? "--"} cm</p></article>
            <article className="feature-data"><span>体脂率</span><h2>{latest?.bodyFatRate ? `${latest.bodyFatRate}%` : "--"}</h2><p>{calculateAge(latest?.birthDate) ? `年龄 ${calculateAge(latest?.birthDate)}` : "暂无"}</p></article>
            <article className="feature-data"><span>记录数</span><h2>{history.length}</h2><p>条历史体测</p></article>
          </div>

          <div className="feature-grid two">
            <form className="feature-form" onSubmit={handleSave}>
              <h2><Save size={20} />新增体测</h2>
              <label>身高 cm<input value={height} inputMode="decimal" onChange={(e) => setHeight(e.target.value)} /></label>
              <label>体重 kg<input value={weight} inputMode="decimal" onChange={(e) => setWeight(e.target.value)} /></label>
              <label>体脂率 %<input value={bodyFatRate} inputMode="decimal" onChange={(e) => setBodyFatRate(e.target.value)} placeholder="选填" /></label>
              <label>出生日期<input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></label>
              <label>性别<select value={gender} onChange={(e) => setGender(e.target.value as "0" | "1")}><option value="1">男</option><option value="0">女</option></select></label>
              <button type="submit" disabled={busy}>保存数据</button>
            </form>

            <article className="feature-list">
              <span><LineChart size={16} />体重趋势</span>
              {!chartData ? (
                <p style={{ padding: "32px 0", textAlign: "center", color: "var(--muted)" }}>至少 2 条记录后，这里将展示精美的趋势动效图。</p>
              ) : (
                <div className="body-chart-container">
                  <svg viewBox="0 0 400 180" className="body-chart-svg" style={{ width: "100%", height: "auto" }}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                      <line key={`grid-${y}`} x1="40" y1={20 + y * 1.4} x2="390" y2={20 + y * 1.4}
                        stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                    ))}
                    {/* Y axis labels */}
                    <text x="36" y="24" fontSize="8" fill="var(--muted)" textAnchor="end">{chartData.maxW.toFixed(1)}</text>
                    <text x="36" y="164" fontSize="8" fill="var(--muted)" textAnchor="end">{chartData.minW.toFixed(1)}</text>

                    {/* Area fill under line */}
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {chartData.items.length > 1 && (() => {
                      const stepX = 350 / (chartData.items.length - 1);
                      const points = chartData.items.map((item, i) => {
                        const x = 45 + i * stepX;
                        const y = 20 + ((chartData.maxW - (item.weight ?? chartData.minW)) / chartData.range) * 140;
                        return { x, y, item, i };
                      });
                      const areaPath = `M${points[0].x},${points[0].y} ` + points.map((p) => `L${p.x},${p.y}`).join(" ") + ` L${points[points.length - 1].x},160 L${points[0].x},160 Z`;
                      const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

                      const prevW = points[points.length - 2]?.item.weight;
                      const curW = points[points.length - 1]?.item.weight;
                      const trendDown = prevW && curW && curW < prevW;
                      const lineColor = trendDown ? "#22c55e" : (curW && prevW && curW > prevW ? "#ef4444" : "var(--accent)");

                      return (
                        <g>
                          <path d={areaPath} fill="url(#weightGrad)" />
                          <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{
                              strokeDasharray: "1000", strokeDashoffset: "1000",
                              animation: "drawLine 1.5s ease forwards"
                            }} />
                          {points.map(({ x, y, item, i }, idx) => (
                            <g key={idx}
                              onMouseEnter={() => setChartHovered(idx)}
                              onMouseLeave={() => setChartHovered(null)}
                              style={{ cursor: "pointer" }}>
                              <circle cx={x} cy={y} r={chartHovered === idx ? 6 : 3.5}
                                fill={chartHovered === idx ? lineColor : "#fff"}
                                stroke={lineColor} strokeWidth="2"
                                style={{
                                  transition: "r 0.2s ease",
                                  animation: `popIn 0.4s ease ${0.5 + idx * 0.08}s both`
                                }} />
                              {chartHovered === idx ? (
                                <g>
                                  <rect x={x - 30} y={y - 28} width="60" height="18" rx="4" fill="var(--fg)" opacity="0.9" />
                                  <text x={x} y={y - 14} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">
                                    {item.weight}kg
                                  </text>
                                </g>
                              ) : null}
                              <text x={x} y={175} fontSize="8" fill="var(--muted)" textAnchor="middle">
                                {item.measureTime?.slice(5, 10) ?? "?"}
                              </text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                  <div className="chart-legend">
                    <span className="legend-dot" style={{ background: "#22c55e" }} /> 下降
                    <span className="legend-dot" style={{ background: "#ef4444" }} /> 上升
                    <span className="legend-dot" style={{ background: "var(--accent)" }} /> 持平
                  </div>
                </div>
              )}
            </article>
          </div>

          <style jsx>{`
            @keyframes drawLine { to { stroke-dashoffset: 0; } }
            @keyframes popIn { from { r: 0; opacity: 0; } to { opacity: 1; } }
            .body-chart-container { padding: 8px 0; }
            .body-chart-svg { border-radius: 12px; background: var(--surface); }
            .chart-legend { display: flex; gap: 16px; justify-content: center; padding: 8px; font-size: 12px; color: var(--muted); }
            .legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
          `}</style>
        </section>
      </div>
    </main>
  );
}
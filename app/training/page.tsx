"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Dumbbell, Plus, Save } from "lucide-react";
import { FeatureMotionDirector } from "@/components/motion/feature-motion-director";
import { FeatureStatusCard } from "@/components/motion/feature-status-card";
import {
  addTrainingLog,
  generateTrainingPlan,
  getCurrentTrainingPlan,
  getTrainingLogs,
  type TrainingLog,
  type TrainingPlan
} from "@/lib/member-api";
import "../feature-placeholder.css";

export default function TrainingPage() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [goal, setGoal] = useState("减脂塑形");
  const [weeklyFrequency, setWeeklyFrequency] = useState(3);
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [feeling, setFeeling] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextPlan, nextLogs] = await Promise.all([getCurrentTrainingPlan(), getTrainingLogs()]);
      setPlan(nextPlan);
      setLogs(nextLogs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "训练数据加载失败。");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setPlan(await generateTrainingPlan({ goal, weeklyFrequency }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成训练计划失败。");
    } finally { setBusy(false); }
  };

  const handleAddLog = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await addTrainingLog({
        durationMinutes: Number(durationMinutes),
        caloriesBurned: caloriesBurned ? Number(caloriesBurned) : undefined,
        feeling,
        remark
      });
      setDurationMinutes("45"); setCaloriesBurned(""); setFeeling(""); setRemark("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存训练日志失败。");
    } finally { setBusy(false); }
  };

  return (
    <main className="feature-page feature-motion-page feature-motion-training" aria-label="训练管理">
      <FeatureMotionDirector variant="training" />
      <div className="feature-shell wide">
        <Link className="feature-back" href="/"><ArrowLeft size={18} />返回首页</Link>
        <section className="feature-panel">
          <div className="feature-heading">
            <span>Training</span>
            <h1>训练管理</h1>
            <p>生成训练计划、记录每日训练日志。</p>
          </div>

          {error ? <FeatureStatusCard kind="error" title="训练数据暂时没接上" detail={error} /> : null}
          {loading ? <FeatureStatusCard title="训练舱正在热身" detail="正在同步计划、日志和今日训练状态。" /> : null}

          <div className="feature-grid three">
            <article className="feature-data"><span>当前计划</span><h2>{plan?.name ?? plan?.goal ?? "未生成"}</h2><p>{plan ? `每周 ${plan.weeklyFrequency ?? "--"} 练` : "点击下方生成"}</p></article>
            <article className="feature-data"><span>今日训练</span><h2>{logs[0]?.durationMinutes ?? "0"} min</h2><p>{logs[0] ? `${logs[0].caloriesBurned ?? 0} kcal` : "还未记录"}</p></article>
            <article className="feature-data"><span>总日志</span><h2>{logs.length}</h2><p>条训练记录</p></article>
          </div>

          <div className="feature-grid two">
            <form className="feature-form" onSubmit={handleGenerate}>
              <h2><Dumbbell size={20} />生成训练计划</h2>
              <label>目标<select value={goal} onChange={(e) => setGoal(e.target.value)}>
                {["减脂塑形", "增肌增重", "力量提升", "耐力训练", "柔韧改善"].map((g) => <option key={g} value={g}>{g}</option>)}
              </select></label>
              <label>每周训练天数<select value={weeklyFrequency} onChange={(e) => setWeeklyFrequency(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} 天</option>)}
              </select></label>
              <button type="submit" disabled={busy}>生成计划</button>
              {plan && <p style={{ color: "var(--green)", marginTop: 8, fontSize: 13 }}>当前计划: {plan.goal} (每周 {plan.weeklyFrequency} 练)</p>}
            </form>

            <form className="feature-form" onSubmit={handleAddLog}>
              <h2><Save size={20} />记录训练</h2>
              <label>时长(分钟)<input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} /></label>
              <label>消耗热量(kcal)<input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} /></label>
              <label>感受<select value={feeling} onChange={(e) => setFeeling(e.target.value)}>
                <option value="">选择...</option>
                {["很轻松", "适中", "有点累", "非常累", "充满能量"].map((f) => <option key={f} value={f}>{f}</option>)}
              </select></label>
              <label>备注<textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={2} style={{ width: "100%", resize: "vertical" }} /></label>
              <button type="submit" disabled={busy}><Plus size={14} />保存日志</button>
            </form>
          </div>

          {logs.length > 0 && (
            <div className="fitpet-record-section">
              <div className="feature-heading">
                <span>History</span>
                <h2>训练历史</h2>
                <p>把最近 20 次训练整理成节奏清晰的记录表，方便回看状态和消耗。</p>
              </div>
              <div className="fitpet-record-table-wrap">
                <table className="fitpet-record-table training-table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>时长</th>
                      <th>消耗</th>
                      <th>感受</th>
                      <th>备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 20).map((l) => (
                      <tr key={l.id}>
                        <td data-label="日期">
                          <span className="record-primary">
                            <b>{l.trainingDate?.slice(0, 10) ?? "--"}</b>
                            <small>训练打卡</small>
                          </span>
                        </td>
                        <td data-label="时长"><strong className="record-number blue">{l.durationMinutes ?? "--"} min</strong></td>
                        <td data-label="消耗"><strong className="record-number coral">{l.caloriesBurned ?? "--"} kcal</strong></td>
                        <td data-label="感受"><span className="record-pill training-feeling">{l.feeling || "未填写"}</span></td>
                        <td data-label="备注">
                          <span className="record-note">{l.remark || "没有备注，保持节奏就很好。"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Dumbbell, Plus, Save, Sparkles } from "lucide-react";
import { FeatureMotionDirector } from "@/components/motion/feature-motion-director";
import { FeatureStatusCard } from "@/components/motion/feature-status-card";
import {
  addTrainingLog,
  generateTrainingPlan,
  getCurrentTrainingPlan,
  getTrainingLogs,
  getTrainingReview,
  type TrainingLog,
  type TrainingPlan,
  type TrainingReview
} from "@/lib/member-api";
import "../feature-placeholder.css";

const goals = ["减脂塑形", "增肌增重", "力量提升", "耐力训练", "柔韧改善"];
const feelings = ["很轻松", "适中", "有点累", "非常累", "充满能量"];

function numberValue(value: number | undefined, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

export default function TrainingPage() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [review, setReview] = useState<TrainingReview | null>(null);
  const [goal, setGoal] = useState(goals[0]);
  const [weeklyFrequency, setWeeklyFrequency] = useState(3);
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [feeling, setFeeling] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const todayMinutes = numberValue(review?.todayMinutes);
  const weeklyMinutes = numberValue(review?.weeklyMinutes);
  const levelProgress = numberValue(review?.progressPercent);

  const weeklyProgressStyle = useMemo(
    () => ({ width: `${Math.min(100, Math.round((weeklyMinutes / 150) * 100))}%` }),
    [weeklyMinutes]
  );

  const levelProgressStyle = useMemo(
    () => ({ width: `${Math.min(100, levelProgress)}%` }),
    [levelProgress]
  );

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextPlan, nextLogs, nextReview] = await Promise.all([
        getCurrentTrainingPlan(),
        getTrainingLogs(),
        getTrainingReview()
      ]);
      setPlan(nextPlan);
      setLogs(nextLogs ?? []);
      setReview(nextReview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "训练数据加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setPlan(await generateTrainingPlan({ goal, weeklyFrequency }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成训练计划失败。");
    } finally {
      setBusy(false);
    }
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
      setDurationMinutes("45");
      setCaloriesBurned("");
      setFeeling("");
      setRemark("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存训练日志失败。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="feature-page feature-motion-page feature-motion-training" aria-label="训练管理">
      <FeatureMotionDirector variant="training" />
      <div className="feature-shell wide">
        <Link className="feature-back" href="/">
          <ArrowLeft size={18} />
          返回首页
        </Link>

        <section className="feature-panel">
          <div className="feature-heading">
            <span>Training</span>
            <h1>训练管理</h1>
            <p>生成训练计划、记录每日训练，并用真实日志生成复盘和成长进度。</p>
          </div>

          {error ? <FeatureStatusCard kind="error" title="训练数据暂时不可用" detail={error} /> : null}
          {loading ? (
            <FeatureStatusCard
              title="训练舱正在热身"
              detail="正在同步计划、日志和今日训练复盘。"
            />
          ) : null}

          <div className="feature-grid three">
            <article className="feature-data">
              <span>当前计划</span>
              <h2>{plan?.name ?? plan?.goal ?? "未生成"}</h2>
              <p>{plan ? `每周 ${plan.weeklyFrequency ?? "--"} 次训练` : "点击下方生成计划"}</p>
            </article>
            <article className="feature-data">
              <span>今日训练</span>
              <h2>{todayMinutes} min</h2>
              <p>{numberValue(review?.todayCalories)} kcal · {numberValue(review?.todaySessions)} 次</p>
            </article>
            <article className="feature-data">
              <span>连续训练</span>
              <h2>{numberValue(review?.streakDays)} 天</h2>
              <p>{review?.badgeTitle ?? "热身起步徽章"}</p>
            </article>
          </div>

          <section className="fitpet-review-panel" aria-label="训练复盘">
            <div className="fitpet-review-main">
              <span className="fitpet-review-badge">
                <Sparkles size={16} />
                Lv.{numberValue(review?.level, 1)}
              </span>
              <h2>{review?.review ?? "完成一次训练后，这里会生成今日复盘。"}</h2>
              <p>{review?.nextAction ?? "先做 10 分钟热身和基础力量循环。"}</p>
            </div>
            <div className="fitpet-review-bars">
              <div>
                <span>本周训练量</span>
                <strong>{weeklyMinutes}/150 min</strong>
                <i><b style={weeklyProgressStyle} /></i>
              </div>
              <div>
                <span>等级经验</span>
                <strong>{levelProgress}%</strong>
                <i><b style={levelProgressStyle} /></i>
              </div>
            </div>
            <ul className="fitpet-review-list">
              {(review?.suggestions?.length ? review.suggestions : ["记录一次训练后，系统会根据本周累计量给出下一步建议。"]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="feature-grid two">
            <form className="feature-form" onSubmit={handleGenerate}>
              <h2>
                <Dumbbell size={20} />
                生成训练计划
              </h2>
              <label>
                目标
                <select value={goal} onChange={(event) => setGoal(event.target.value)}>
                  {goals.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                每周训练天数
                <select value={weeklyFrequency} onChange={(event) => setWeeklyFrequency(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>{count} 天</option>
                  ))}
                </select>
              </label>
              <button type="submit" disabled={busy}>生成计划</button>
              {plan ? <p className="fitpet-inline-note">当前训练目标：{plan.goal}</p> : null}
            </form>

            <form className="feature-form" onSubmit={handleAddLog}>
              <h2>
                <Save size={20} />
                记录训练
              </h2>
              <label>
                时长（分钟）
                <input type="number" min="1" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} />
              </label>
              <label>
                消耗热量（kcal）
                <input type="number" min="0" value={caloriesBurned} onChange={(event) => setCaloriesBurned(event.target.value)} />
              </label>
              <label>
                训练感受
                <select value={feeling} onChange={(event) => setFeeling(event.target.value)}>
                  <option value="">选择...</option>
                  {feelings.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                备注
                <textarea value={remark} onChange={(event) => setRemark(event.target.value)} rows={2} />
              </label>
              <button type="submit" disabled={busy}>
                <Plus size={14} />
                保存日志
              </button>
            </form>
          </div>

          {logs.length > 0 ? (
            <div className="fitpet-record-section">
              <div className="feature-heading">
                <span>History</span>
                <h2>训练历史</h2>
                <p>最近 20 次训练记录，方便回看状态、时长和消耗。</p>
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
                    {logs.slice(0, 20).map((log) => (
                      <tr key={log.id}>
                        <td data-label="日期">
                          <span className="record-primary">
                            <b>{log.trainingDate?.slice(0, 10) ?? "--"}</b>
                            <small>训练打卡</small>
                          </span>
                        </td>
                        <td data-label="时长">
                          <strong className="record-number blue">{log.durationMinutes ?? "--"} min</strong>
                        </td>
                        <td data-label="消耗">
                          <strong className="record-number coral">{log.caloriesBurned ?? "--"} kcal</strong>
                        </td>
                        <td data-label="感受">
                          <span className="record-pill training-feeling">{log.feeling || "未填写"}</span>
                        </td>
                        <td data-label="备注">
                          <span className="record-note">{log.remark || "没有备注，保持节奏就很好。"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

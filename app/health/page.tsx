"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Camera, Flame, Plus, Info, Loader2, Check } from "lucide-react";
import { FeatureMotionDirector } from "@/components/motion/feature-motion-director";
import { FeatureStatusCard } from "@/components/motion/feature-status-card";
import {
  addCustomFood,
  analyzeFoodImage,
  getDietGap,
  getDietSummary,
  getDietTarget,
  getFoodList,
  recordDiet,
  saveDietTarget,
  type DietGap,
  type DietSummary,
  type DietTarget,
  type Food,
  type FoodAnalysis
} from "@/lib/member-api";
import { todayDateString } from "@/lib/home-model";
import "../feature-placeholder.css";

const MEAL_LABELS: Record<string, string> = { "1": "早餐", "2": "午餐", "3": "晚餐", "4": "加餐" };

export default function HealthPage() {
  const [date, setDate] = useState(todayDateString());
  const [summary, setSummary] = useState<DietSummary | null>(null);
  const [gap, setGap] = useState<DietGap | null>(null);
  const [target, setTarget] = useState<DietTarget | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodKeyword, setFoodKeyword] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [amount, setAmount] = useState("100");
  const [mealType, setMealType] = useState("2");
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiRecorded, setAiRecorded] = useState(false);
  const [aiFoodId, setAiFoodId] = useState<number | null>(null);

  const selectedFood = foods.find((f) => String(f.id) === selectedFoodId);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextSummary, nextGap, nextTarget, nextFoods] = await Promise.all([
        getDietSummary(date), getDietGap(date), getDietTarget(), getFoodList(foodKeyword)
      ]);
      setSummary(nextSummary); setGap(nextGap); setTarget(nextTarget);
      setFoods(nextFoods ?? []);
      if (!selectedFoodId && nextFoods?.[0]?.id) setSelectedFoodId(String(nextFoods[0].id));
    } catch (err) { setError(err instanceof Error ? err.message : "饮食数据加载失败。"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [date]);

  const handleFoodSearch = async () => { setFoods(await getFoodList(foodKeyword)); };

  const handleRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFoodId) { setError("请先选择食物。"); return; }
    setBusy(true);
    try {
      await recordDiet({ foodId: Number(selectedFoodId), amount: Number(amount), mealType: Number(mealType), eatDate: date });
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "饮食记录保存失败。"); }
    finally { setBusy(false); }
  };

  const handleTarget = async () => {
    setBusy(true);
    try {
      await saveDietTarget({
        caloriesTarget: Number(target?.caloriesTarget ?? 1800),
        proteinTarget: Number(target?.proteinTarget ?? 90),
        fatTarget: Number(target?.fatTarget ?? 55),
        carbohydrateTarget: Number(target?.carbohydrateTarget ?? 220)
      });
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "目标保存失败。"); }
    finally { setBusy(false); }
  };

  const handleAnalyze = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAiLoading(true); setAnalysis(null); setAiRecorded(false); setAiFoodId(null); setError("");
    try {
      const result = await analyzeFoodImage(file);
      setAnalysis(result);
      // 自动将 AI 识别食物加入数据库
      if (result?.name) {
        const savedFood = await addCustomFood({
          name: result.name,
          calories: Number(result.caloriesPer100g ?? 0),
          protein: Number(result.proteinPer100g ?? 0),
          fat: Number(result.fatPer100g ?? 0),
          carbohydrate: Number(result.carbPer100g ?? 0)
        });
        if (savedFood?.id) {
          setAiFoodId(savedFood.id);
          setSelectedFoodId(String(savedFood.id));
        }
        setFoodKeyword("");
        setFoods(await getFoodList(""));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "AI 识别失败。"); }
    finally { setAiLoading(false); }
  };

  // 记录 AI 识别结果到今日饮食
  const handleRecordAi = async () => {
    if (!analysis?.name) return;
    setBusy(true);
    try {
      let foodId = aiFoodId;
      if (!foodId) {
        const matches = await getFoodList(analysis.name);
        const aiFood = matches.find((food) => food.name === analysis.name);
        foodId = aiFood?.id ?? null;
      }
      if (!foodId) {
        setError("AI 食物已识别，但未成功入库，请重新识别后再记录。");
        return;
      }
      await recordDiet({
        foodId,
        amount: Number(analysis.estimatedWeight ?? 200),
        mealType: Number(mealType),
        eatDate: date
      });
      setAiRecorded(true);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "记录失败。"); }
    finally { setBusy(false); }
  };

  const estWeight = analysis?.estimatedWeight ?? 100;
  const totalCal = analysis?.caloriesPer100g ? ((Number(analysis.caloriesPer100g) * Number(estWeight)) / 100).toFixed(1) : null;

  return (
    <main className="feature-page feature-motion-page feature-motion-nutrition" aria-label="饮食记录">
      <FeatureMotionDirector variant="nutrition" />
      <div className="feature-shell wide">
        <Link className="feature-back" href="/"><ArrowLeft size={18} />返回首页</Link>
        <section className="feature-panel">
          <div className="feature-heading"><span>Nutrition</span><h1>饮食记录</h1><p>记录每日摄入、维护营养目标，并用图片识别辅助录入。</p></div>
          {error ? <FeatureStatusCard kind="error" title="饮食数据暂时没接上" detail={error} /> : null}
          {loading ? <FeatureStatusCard title="营养小厨房备餐中" detail="正在整理今日摄入、目标差距和食物库。" /> : null}

          <div className="feature-toolbar">
            <label>日期<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <button type="button" onClick={load} disabled={loading}>刷新</button>
          </div>

          <div className="feature-grid three">
            <article className="feature-data"><span>热量缺口</span><h2>{gap?.caloriesGap ?? "--"} kcal</h2><p>实际 {gap?.caloriesActual ?? 0} / 推荐 {gap?.caloriesTarget ?? target?.caloriesTarget ?? "--"}</p></article>
            <article className="feature-data"><span>蛋白质</span><h2>{summary?.totalProtein ?? 0} g</h2><p>建议 {summary?.recommendProtein ?? target?.proteinTarget ?? "--"} g</p></article>
            <article className="feature-data"><span>碳水 / 脂肪</span><h2>{summary?.totalCarb ?? 0}g / {summary?.totalFat ?? 0}g</h2><p>{loading ? "加载中..." : "今日营养总览"}</p></article>
          </div>

          {/* ========== AI 食物识别 ========== */}
          <div className="feature-form" style={{ marginTop: 20 }}>
            <h2><Camera size={20} />AI 食物识别</h2>
            <label>上传图片<input type="file" accept="image/*" onChange={handleAnalyze} /></label>

            {aiLoading && (
              <div style={{ marginTop: 16, padding: 40, textAlign: "center", background: "var(--surface)", borderRadius: 14 }}>
                <Loader2 size={36} style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }} />
                <p style={{ color: "var(--muted)", marginTop: 12 }}>AI 正在分析图片中的食物...</p>
              </div>
            )}

            {analysis?.name && !aiLoading && (
              <div style={{ marginTop: 16, padding: 20, background: "var(--surface)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "var(--accent)" }}>
                    {analysis.name} <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>估算 {estWeight}g</span>
                  </h3>
                  {!aiRecorded ? (
                    <button type="button" onClick={handleRecordAi} disabled={busy} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                      记录到今日{MEAL_LABELS[mealType]}
                    </button>
                  ) : (
                    <span style={{ color: "var(--green)", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><Check size={14} />已记录</span>
                  )}
                </div>

                <div className="feature-grid four" style={{ marginBottom: 12 }}>
                  <article className="feature-data" style={{ padding: 12 }}>
                    <span>热量</span><h3 style={{ fontSize: 20, margin: "4px 0" }}>{analysis.caloriesPer100g ?? "--"} kcal</h3>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>每100g</p>
                    {totalCal && <p style={{ fontSize: 13, color: "var(--accent)" }}>≈ {totalCal} kcal / {estWeight}g</p>}
                  </article>
                  <article className="feature-data" style={{ padding: 12 }}>
                    <span>蛋白质</span><h3 style={{ fontSize: 20, margin: "4px 0" }}>{analysis.proteinPer100g ?? "--"} g</h3><p style={{ fontSize: 11, color: "var(--muted)" }}>每100g</p>
                  </article>
                  <article className="feature-data" style={{ padding: 12 }}>
                    <span>脂肪</span><h3 style={{ fontSize: 20, margin: "4px 0" }}>{analysis.fatPer100g ?? "--"} g</h3><p style={{ fontSize: 11, color: "var(--muted)" }}>每100g</p>
                  </article>
                  <article className="feature-data" style={{ padding: 12 }}>
                    <span>碳水</span><h3 style={{ fontSize: 20, margin: "4px 0" }}>{analysis.carbPer100g ?? "--"} g</h3><p style={{ fontSize: 11, color: "var(--muted)" }}>每100g</p>
                  </article>
                </div>
              </div>
            )}
            {!analysis && !aiLoading && <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>上传食物图片后，这里会展示每100g营养数据和估算总量。</p>}
          </div>

          {/* ========== 记录一餐 ========== */}
          <div className="feature-grid two" style={{ marginTop: 20 }}>
            <form className="feature-form" onSubmit={handleRecord}>
              <h2><Plus size={20} />记录一餐</h2>
              <label>搜索食物
                <span className="feature-inline">
                  <input value={foodKeyword} onChange={(e) => setFoodKeyword(e.target.value)} placeholder="鸡胸肉" />
                  <button type="button" onClick={handleFoodSearch}>搜索</button>
                </span>
              </label>
              <label>食物
                <select value={selectedFoodId} onChange={(e) => setSelectedFoodId(e.target.value)}>
                  {foods.map((food) => <option key={food.id} value={food.id}>{food.emoji ?? ""} {food.name ?? `食物 ${food.id}`}</option>)}
                </select>
              </label>
              {selectedFood && (
                <div style={{ padding: "8px 12px", background: "var(--surface)", borderRadius: 8, marginBottom: 8, fontSize: 12, display: "flex", gap: 16, flexWrap: "wrap", color: "var(--muted)" }}>
                  <span>热量 <b style={{ color: "var(--text)" }}>{selectedFood.calories ?? "--"} kcal</b></span>
                  <span>蛋白 <b style={{ color: "var(--text)" }}>{selectedFood.protein ?? "--"} g</b></span>
                  <span>脂肪 <b style={{ color: "var(--text)" }}>{selectedFood.fat ?? "--"} g</b></span>
                  <span>碳水 <b style={{ color: "var(--text)" }}>{selectedFood.carbohydrate ?? "--"} g</b></span>
                  <span style={{ color: "var(--accent)" }}>每 100g</span>
                </div>
              )}
              <label>克数<input value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} /></label>
              <label>餐别<select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                {Object.entries(MEAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></label>
              <button type="submit" disabled={busy}>保存饮食记录</button>
            </form>

            <div className="feature-form">
              <h2><Flame size={20} />营养目标</h2>
              <label>热量目标 (kcal)<input type="number" value={target?.caloriesTarget ?? 1800} onChange={(e) => setTarget({ ...target, caloriesTarget: Number(e.target.value) })} /></label>
              <label>蛋白质 (g)<input type="number" value={target?.proteinTarget ?? 90} onChange={(e) => setTarget({ ...target, proteinTarget: Number(e.target.value) })} /></label>
              <label>脂肪 (g)<input type="number" value={target?.fatTarget ?? 55} onChange={(e) => setTarget({ ...target, fatTarget: Number(e.target.value) })} /></label>
              <label>碳水 (g)<input type="number" value={target?.carbohydrateTarget ?? 220} onChange={(e) => setTarget({ ...target, carbohydrateTarget: Number(e.target.value) })} /></label>
              <button type="button" onClick={handleTarget} disabled={busy}><Flame size={16} />保存默认营养目标</button>
            </div>
          </div>

          {/* ========== 今日饮食详情 ========== */}
          {summary?.details && summary.details.length > 0 && (
            <div className="fitpet-record-section">
              <div className="feature-heading">
                <span>Today</span>
                <h2>今日摄入详情</h2>
                <p>按餐别整理每一条记录，热量和三大营养素更容易横向对比。</p>
              </div>
              <div className="fitpet-record-table-wrap">
                <table className="fitpet-record-table nutrition-table">
                  <thead>
                    <tr>
                      <th>食物</th>
                      <th>份量</th>
                      <th>餐别</th>
                      <th>热量</th>
                      <th>蛋白</th>
                      <th>脂肪</th>
                      <th>碳水</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.details.map((d, i) => (
                      <tr key={i}>
                        <td data-label="食物">
                          <span className="record-primary">
                            <b>{d.foodName ?? "--"}</b>
                            <small>第 {i + 1} 条饮食记录</small>
                          </span>
                        </td>
                        <td data-label="份量"><span className="record-pill">{d.amount ?? "--"} g</span></td>
                        <td data-label="餐别"><span className="record-pill meal-pill">{MEAL_LABELS[String(d.mealType ?? "")] ?? "--"}</span></td>
                        <td data-label="热量"><strong className="record-number coral">{d.calories ?? "--"} kcal</strong></td>
                        <td data-label="蛋白"><strong className="record-number mint">{d.protein ?? "--"} g</strong></td>
                        <td data-label="脂肪"><strong className="record-number yolk">{d.fat ?? "--"} g</strong></td>
                        <td data-label="碳水"><strong className="record-number blue">{d.carbohydrate ?? "--"} g</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 食物库列表 */}
          {foods.length > 0 && !summary?.details?.length && !loading && (
            <div className="fitpet-record-section">
              <div className="feature-heading">
                <span>Library</span>
                <h2>食物库</h2>
                <p>没有今日记录时，先展示可录入食物的基础营养表。</p>
              </div>
              <div className="fitpet-record-table-wrap">
                <table className="fitpet-record-table nutrition-table">
                  <thead>
                    <tr>
                      <th>名称</th>
                      <th>热量/100g</th>
                      <th>蛋白/100g</th>
                      <th>脂肪/100g</th>
                      <th>碳水/100g</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((f) => (
                      <tr key={f.id}>
                        <td data-label="名称">
                          <span className="record-primary">
                            <b>{f.name ?? `食物 ${f.id}`}</b>
                            <small>基础营养数据</small>
                          </span>
                        </td>
                        <td data-label="热量/100g"><strong className="record-number coral">{f.calories ?? "--"} kcal</strong></td>
                        <td data-label="蛋白/100g"><strong className="record-number mint">{f.protein ?? "--"} g</strong></td>
                        <td data-label="脂肪/100g"><strong className="record-number yolk">{f.fat ?? "--"} g</strong></td>
                        <td data-label="碳水/100g"><strong className="record-number blue">{f.carbohydrate ?? "--"} g</strong></td>
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

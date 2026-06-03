"use client";

import { useEffect, useState } from "react";
import { getExerciseList, addExercise, updateExercise, deleteExercise, type ExerciseVO, rowsOf } from "@/lib/admin-api";
import { Plus, RefreshCcw, Trash2, Edit3 } from "lucide-react";

const MUSCLES = ["胸", "背", "肩", "腿", "手臂", "核心", "全身"];

export default function AdminExercises() {
  const [exercises, setExercises] = useState<ExerciseVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; edit?: ExerciseVO }>({ open: false });
  const [form, setForm] = useState<ExerciseVO>({ name: "", primaryMuscle: "", difficulty: "初级" });

  const load = async () => {
    setLoading(true);
    try { setExercises(rowsOf(await getExerciseList())); } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: "", primaryMuscle: "", difficulty: "初级" }); setModal({ open: true }); };
  const openEdit = (e: ExerciseVO) => { setForm({ ...e }); setModal({ open: true, edit: e }); };

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    try {
      if (modal.edit?.id) await updateExercise(modal.edit.id, form);
      else await addExercise(form);
      setModal({ open: false });
      load();
    } catch { }
  };

  const handleDelete = async (id: number) => { if (!confirm("删除？")) return; await deleteExercise(id); load(); };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>动作库管理 ({exercises.length})</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} /></button>
            <button onClick={openCreate} className="admin-btn admin-btn-primary admin-btn-sm"><Plus size={14} />新增</button>
          </div>
        </div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>名称</th><th>主肌群</th><th>难度</th><th>运动模式</th><th>操作</th></tr></thead>
          <tbody>
            {exercises.map((ex) => (
              <tr key={ex.id}>
                <td>{ex.id}</td><td style={{ fontWeight: 600 }}>{ex.name}</td>
                <td><span className="badge badge-info">{ex.primaryMuscle ?? "--"}</span></td>
                <td>{ex.difficulty ?? "--"}</td>
                <td>{ex.movementPattern ?? "--"}</td>
                <td>
                  <button onClick={() => openEdit(ex)} className="admin-btn admin-btn-outline admin-btn-sm"><Edit3 size={12} /></button>
                  <button onClick={() => ex.id && handleDelete(ex.id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 4 }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
            {!loading && !exercises.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无动作</td></tr>}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 440, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 20px" }}>{modal.edit ? "编辑动作" : "新增动作"}</h3>
            <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>名称<input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }} /></label>
            <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>主肌群<select value={form.primaryMuscle ?? ""} onChange={(e) => setForm({ ...form, primaryMuscle: e.target.value })} style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }}>
              <option value="">选择肌群</option>{MUSCLES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select></label>
            <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>难度<select value={form.difficulty ?? "初级"} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }}>
              {["初级", "中级", "高级"].map((d) => <option key={d} value={d}>{d}</option>)}
            </select></label>
            <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>动作要点<textarea value={form.tips ?? ""} onChange={(e) => setForm({ ...form, tips: e.target.value })} style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14, minHeight: 60 }} /></label>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ open: false })} className="admin-btn admin-btn-outline">取消</button>
              <button onClick={handleSave} className="admin-btn admin-btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
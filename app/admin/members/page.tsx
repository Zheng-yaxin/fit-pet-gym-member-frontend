"use client";

import { FormEvent, useEffect, useState } from "react";
import { getMemberList, addMember, updateMember, deleteMember, rowsOf, type Member, type MemberAddDto } from "@/lib/admin-api";
import { Plus, Search, RefreshCcw, Trash2, Edit3 } from "lucide-react";

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; edit?: Member }>({ open: false });
  const [form, setForm] = useState({ name: "", phone: "", password: "", gender: 1 });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMemberList({ pageNum: page, pageSize: 10, keyword });
      const rows = rowsOf(res);
      setMembers(rows);
      setTotal(res?.total ?? rows.length);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, keyword]);

  const openCreate = () => {
    setForm({ name: "", phone: "", password: "123456", gender: 1 });
    setModal({ open: true });
  };
  const openEdit = (m: Member) => {
    setForm({ name: m.name ?? "", phone: m.phone ?? "", password: "", gender: m.gender ?? 1 });
    setModal({ open: true, edit: m });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (modal.edit?.id) {
        await updateMember({ id: modal.edit.id, name: form.name, phone: form.phone, gender: form.gender });
      } else {
        await addMember(form as MemberAddDto);
      }
      setModal({ open: false });
      load();
    } catch { }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确认删除？")) return;
    await deleteMember(id);
    load();
  };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>会员管理 ({total})</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <input value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                placeholder="搜索姓名/手机/卡号..." style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--admin-border)", fontSize: 13, width: 200 }} />
              <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} /></button>
            </div>
            <button onClick={openCreate} className="admin-btn admin-btn-primary admin-btn-sm"><Plus size={14} />新增</button>
          </div>
        </div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>姓名</th><th>手机</th><th>会员卡</th><th>余额</th><th>状态</th><th>注册时间</th><th>操作</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td><td>{m.name}</td><td>{m.phone}</td>
                <td><span className="badge badge-info">{m.cardType ?? "无"}</span></td>
                <td>\u00a5{m.balance ?? 0}</td>
                <td><span className={`badge ${m.status === "1" ? "badge-danger" : "badge-success"}`}>{m.status === "1" ? "已停用" : "正常"}</span></td>
                <td>{m.createTime?.slice(0, 10)}</td>
                <td>
                  <button onClick={() => openEdit(m)} className="admin-btn admin-btn-outline admin-btn-sm"><Edit3 size={12} /></button>
                  <button onClick={() => m.id && handleDelete(m.id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginLeft: 4 }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
            {!loading && !members.length && <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无数据</td></tr>}
          </tbody>
        </table>
        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--admin-muted)" }}>
          <span>第 {page} 页 / 共 {Math.ceil(total / 10)} 页</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="admin-btn admin-btn-outline admin-btn-sm">上一页</button>
            <button disabled={page * 10 >= total} onClick={() => setPage(page + 1)} className="admin-btn admin-btn-outline admin-btn-sm">下一页</button>
          </div>
        </div>
      </div>

      {modal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <form onSubmit={handleSave} style={{ background: "#fff", borderRadius: 16, padding: 32, width: 400, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 20px" }}>{modal.edit ? "编辑会员" : "新增会员"}</h3>
            <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>姓名<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }} /></label>
            <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>手机<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }} /></label>
            {!modal.edit && <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>密码<input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }} /></label>}
            <label style={{ display: "block", marginBottom: 20, fontSize: 13 }}>性别<select value={form.gender} onChange={(e) => setForm({ ...form, gender: Number(e.target.value) })}
              style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14 }}><option value={1}>男</option><option value={0}>女</option></select></label>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setModal({ open: false })} className="admin-btn admin-btn-outline">取消</button>
              <button type="submit" className="admin-btn admin-btn-primary">保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
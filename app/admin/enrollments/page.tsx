"use client";

import { useEffect, useState } from "react";
import { getEnrollmentList, updateEnrollmentStatus, rowsOf, type EnrollmentDetail } from "@/lib/admin-api";
import { RefreshCcw, Check, X } from "lucide-react";

export default function AdminEnrollments() {
  const [list, setList] = useState<EnrollmentDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEnrollmentList({ pageNum: page, pageSize: 20 });
      const rows = rowsOf(res);
      setList(rows);
      setTotal(res?.total ?? rows.length);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const handleStatus = async (id: number, status: string) => {
    await updateEnrollmentStatus(id, status);
    load();
  };

  const statusBadge = (s?: string) => {
    if (s === "0") return <span className="badge badge-info">已预约</span>;
    if (s === "1") return <span className="badge badge-warning">已取消</span>;
    if (s === "2") return <span className="badge badge-success">已完成</span>;
    return <span className="badge">{s ?? "--"}</span>;
  };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>预约管理 ({total})</h2>
          <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} />刷新</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>会员</th><th>课程</th><th>教练</th><th>时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td style={{ fontWeight: 600 }}>{e.memberName ?? "--"}</td>
                <td>{e.courseName ?? "--"}</td>
                <td>{e.coachName ?? "--"}</td>
                <td>{e.classTime?.slice(0, 16) ?? e.createTime?.slice(0, 16) ?? "--"}</td>
                <td>{statusBadge(e.status)}</td>
                <td style={{ display: "flex", gap: 4 }}>
                  {e.status === "0" && (
                    <>
                      <button onClick={() => e.id && handleStatus(e.id, "2")} className="admin-btn admin-btn-success admin-btn-sm" title="完成"><Check size={12} /></button>
                      <button onClick={() => e.id && handleStatus(e.id, "1")} className="admin-btn admin-btn-danger admin-btn-sm" title="取消"><X size={12} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !list.length && <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无预约记录</td></tr>}
          </tbody>
        </table>
        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--admin-muted)" }}>
          <span>第 {page} 页 / 共 {Math.ceil(total / 20)} 页</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="admin-btn admin-btn-outline admin-btn-sm">上一页</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(page + 1)} className="admin-btn admin-btn-outline admin-btn-sm">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
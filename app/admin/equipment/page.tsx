"use client";

import { useEffect, useState } from "react";
import { getEquipmentPage, getRepairPage, handleRepair, rowsOf, type RepairLog } from "@/lib/admin-api";
import { RefreshCcw, Wrench } from "lucide-react";

export default function AdminEquipment() {
  const [repairs, setRepairs] = useState<RepairLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "handle">("list");
  const [handleResult, setHandleResult] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getRepairPage({ pageNum: 1, pageSize: 20 });
      setRepairs(rowsOf(res));
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const doHandle = async () => {
    if (!selectedId || !handleResult.trim()) return;
    await handleRepair({ id: selectedId, handleResult: handleResult.trim(), status: "1" });
    setSelectedId(null);
    setHandleResult("");
    load();
  };

  const statusBadge = (s?: string) => {
    if (s === "0") return <span className="badge badge-warning">待处理</span>;
    if (s === "1") return <span className="badge badge-success">已处理</span>;
    return <span className="badge">{s ?? "--"}</span>;
  };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>器材报修管理 ({repairs.length})</h2>
          <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} />刷新</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>器材</th><th>故障描述</th><th>报修人</th><th>状态</th><th>处理人</th><th>时间</th><th>操作</th></tr></thead>
          <tbody>
            {repairs.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td><td>{r.equipmentName ?? "--"}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.faultDesc}</td>
                <td>{r.reporterName ?? "--"}</td><td>{statusBadge(r.status)}</td><td>{r.handlerName ?? "--"}</td>
                <td>{r.createTime?.slice(0, 16)}</td>
                <td>
                  {r.status === "0" ? (
                    <button onClick={() => setSelectedId(r.id ?? null)} className="admin-btn admin-btn-primary admin-btn-sm"><Wrench size={12} />处理</button>
                  ) : <span style={{ fontSize: 12, color: "var(--admin-muted)" }}>{r.handleResult?.slice(0, 20) ?? "已完成"}</span>}
                </td>
              </tr>
            ))}
            {!loading && !repairs.length && <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无报修记录</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 400, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 16px" }}>处理报修 #{selectedId}</h3>
            <label style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
              处理结果
              <textarea value={handleResult} onChange={(e) => setHandleResult(e.target.value)}
                style={{ width: "100%", marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", fontSize: 14, minHeight: 80, resize: "vertical" }} />
            </label>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => { setSelectedId(null); setHandleResult(""); }} className="admin-btn admin-btn-outline">取消</button>
              <button onClick={doHandle} className="admin-btn admin-btn-primary">提交处理</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
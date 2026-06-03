"use client";

import { useEffect, useState } from "react";
import { getCardPage, suspendCard, reportLossCard, rowsOf, type MemberCard } from "@/lib/admin-api";
import { RefreshCcw, Pause, AlertTriangle } from "lucide-react";

export default function AdminCards() {
  const [cards, setCards] = useState<MemberCard[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCardPage({ pageNum: page, pageSize: 20 });
      const rows = rowsOf(res);
      setCards(rows);
      setTotal(res?.total ?? rows.length);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const handleSuspend = async (cardId: number) => {
    const months = prompt("停卡月数(1-3):", "1");
    if (!months) return;
    await suspendCard(cardId, Number(months));
    load();
  };

  const handleLoss = async (cardId: number) => {
    if (!confirm("确认挂失？")) return;
    await reportLossCard(cardId);
    load();
  };

  const statusBadge = (s?: string) => {
    if (s === "0") return <span className="badge badge-success">正常</span>;
    if (s === "1") return <span className="badge badge-warning">挂失</span>;
    if (s === "2") return <span className="badge badge-danger">过期</span>;
    return <span className="badge">{s ?? "--"}</span>;
  };

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>会员卡管理 ({total})</h2>
          <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} />刷新</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>会员</th><th>卡号</th><th>类型</th><th>发卡日期</th><th>到期日期</th><th>剩余次数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td><td style={{ fontWeight: 600 }}>{c.memberName ?? c.memberId ?? "--"}</td>
                <td>{c.cardNo}</td>
                <td><span className="badge badge-info">{c.cardType}</span></td>
                <td>{c.issueDate?.slice(0, 10) ?? "--"}</td>
                <td>{c.expireDate?.slice(0, 10) ?? "--"}</td>
                <td>{c.remainingTimes ?? "--"}</td>
                <td>{statusBadge(c.status)}</td>
                <td style={{ display: "flex", gap: 4 }}>
                  {c.status === "0" && (
                    <button onClick={() => c.id && handleSuspend(c.id)} className="admin-btn admin-btn-outline admin-btn-sm" title="停卡">
                      <Pause size={12} />
                    </button>
                  )}
                  {c.status === "0" && (
                    <button onClick={() => c.id && handleLoss(c.id)} className="admin-btn admin-btn-danger admin-btn-sm" title="挂失">
                      <AlertTriangle size={12} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !cards.length && <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无会员卡</td></tr>}
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
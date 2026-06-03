"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Thermometer, TrendingUp, Users } from "lucide-react";
import { getCurrentTraffic, getTrafficHeatmap, type TrafficSnapshot } from "@/lib/member-api";

function pct(item: TrafficSnapshot) { if (!item.capacity) return 0; return Math.min(100, Math.round(((item.currentCount ?? 0) / item.capacity) * 100)); }
function heat(percent: number) { if (percent >= 80) return { color: "#ef4444", label: "拥挤" }; if (percent >= 50) return { color: "#f59e0b", label: "较忙" }; if (percent >= 20) return { color: "#22c55e", label: "舒适" }; return { color: "#3b82f6", label: "空闲" }; }

export default function AdminTraffic() {
  const [current, setCurrent] = useState<TrafficSnapshot[]>([]);
  const [heatmap, setHeatmap] = useState<TrafficSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, h] = await Promise.all([getCurrentTraffic(), getTrafficHeatmap()]);
      setCurrent(c ?? []); setHeatmap(h ?? []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const totalPeople = current.reduce((s, i) => s + (i.currentCount ?? 0), 0);
  const avgOccupancy = current.length ? Math.round(current.reduce((s, i) => s + pct(i), 0) / current.length) : 0;

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><h3><Users size={16} />当前在场</h3><div className="stat-value">{totalPeople}</div><div className="stat-sub">总人数</div></div>
        <div className="stat-card"><h3><TrendingUp size={16} />平均占用</h3><div className="stat-value">{avgOccupancy}%</div><div className="stat-sub">{current.length} 个区域</div></div>
        <div className="stat-card"><h3><Thermometer size={16} />热力快照</h3><div className="stat-value">{heatmap.length}</div><div className="stat-sub">全天样本</div></div>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 24 }}>
        <div className="admin-table-header">
          <h2>实时区域 ({current.length})</h2>
          <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} />刷新</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>区域</th><th>人数</th><th>容量</th><th>占用率</th><th>状态</th><th>时间</th></tr></thead>
          <tbody>
            {current.map((item) => {
              const percent = pct(item); const h = heat(percent);
              return (
                <tr key={item.id ?? item.areaName}>
                  <td style={{ fontWeight: 600 }}>{item.areaName ?? "--"}</td>
                  <td>{item.currentCount ?? 0}</td><td>{item.capacity ?? "--"}</td>
                  <td><div style={{ height: 6, borderRadius: 3, background: "var(--admin-border)", width: 120 }}><div style={{ height: "100%", width: `${percent}%`, background: h.color, borderRadius: 3, transition: "width .6s" }} /></div></td>
                  <td><span className="badge" style={{ background: h.color + "20", color: h.color }}>{h.label} {percent}%</span></td>
                  <td>{item.snapshotTime?.slice(11, 16) ?? "--"}</td>
                </tr>
              );
            })}
            {!loading && !current.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无数据 - 请重启后端以初始化场馆数据</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getCourseList, rowsOf, type CourseVO } from "@/lib/admin-api";
import { RefreshCcw } from "lucide-react";

export default function AdminCourses() {
  const [courses, setCourses] = useState<CourseVO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setCourses(rowsOf(await getCourseList({ pageSize: 50 }))); } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>课程管理 ({courses.length})</h2>
          <button onClick={load} className="admin-btn admin-btn-outline admin-btn-sm"><RefreshCcw size={14} />刷新</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>名称</th><th>难度</th><th>时长</th><th>价格</th><th>消耗</th><th>描述</th><th>创建时间</th></tr></thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td><td style={{ fontWeight: 600 }}>{c.name}</td>
                <td><span className="badge badge-info">{c.difficulty ?? "--"}</span></td>
                <td>{c.duration ?? "--"} min</td><td>\u00a5{c.price ?? "--"}</td>
                <td>{c.calories ?? "--"} kcal</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description ?? "--"}</td>
                <td>{c.createTime?.slice(0, 10)}</td>
              </tr>
            ))}
            {!loading && !courses.length && <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--admin-muted)" }}>暂无课程</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
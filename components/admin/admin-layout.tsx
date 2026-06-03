"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard, Users, CreditCard, Dumbbell, Wrench,
  BookOpen, CalendarCheck, Library,
  BarChart3, MessageSquare, MapPin, LogOut, ChevronLeft, Menu
} from "lucide-react";
import { clearAuthSession, readAuthSession } from "@/lib/auth-store";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "控制台" },
  { href: "/admin/members", icon: Users, label: "会员管理" },
  { href: "/admin/cards", icon: CreditCard, label: "会员卡" },{ href: "/admin/equipment", icon: Wrench, label: "器材报修" },
  { href: "/admin/courses", icon: BookOpen, label: "课程管理" },
  { href: "/admin/enrollments", icon: CalendarCheck, label: "预约管理" },{ href: "/admin/exercises", icon: Library, label: "动作库" },
  { href: "/admin/traffic", icon: MapPin, label: "人流热力" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readAuthSession();
    if (!session?.token || session.userType !== "SYS_USER") {
      clearAuthSession();
      router.replace("/auth");
      return;
    }
    setReady(true);
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/auth");
  };

  if (!ready) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)" }}>验证中...</div>;

  return (
    <div className="admin-root">
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-icon"><Dumbbell size={22} /></span>
          {!collapsed && <span className="brand-text">Fit-Pet Admin</span>}
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${active ? "active" : ""}`}>
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item" title="退出登录">
            <LogOut size={20} />
            {!collapsed && <span>退出</span>}
          </button>
        </div>
      </aside>
      <div className="admin-body">
        <header className="admin-topbar">
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
          <div className="topbar-spacer" />
          <span className="topbar-title">健身房管理系统</span>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
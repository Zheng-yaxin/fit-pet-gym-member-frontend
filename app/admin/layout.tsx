import { AdminLayout } from "@/components/admin/admin-layout";
import "./admin.css";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
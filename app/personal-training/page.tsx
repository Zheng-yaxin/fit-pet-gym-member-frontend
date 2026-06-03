"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalTrainingRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/courses"); }, [router]);
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)" }}>跳转至课程预约...</div>;
}
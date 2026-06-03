import { Suspense } from "react";
import { AuthFlow } from "@/components/auth/auth-flow";
import "./auth.css";

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="auth-page" />}>
      <AuthFlow />
    </Suspense>
  );
}

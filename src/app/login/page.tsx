import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/components/login-page";

export const metadata: Metadata = {
  title: "Login | THE ICG Consultant Portal",
  description: "Sign in to the THE ICG consultant portal.",
};

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}

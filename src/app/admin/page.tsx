import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/components/login-page";

export const metadata: Metadata = {
  title: "Admin | ICG",
  description: "Sign in to the ICG consultant portal.",
};

export default function Admin() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}

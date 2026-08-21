import type { Metadata } from "next";
import { RequestsPage } from "@/components/requests-page";

export const metadata: Metadata = {
  title: "Client Requests | ICG Consultant Portal",
  description: "Review and triage inbound strategic inquiries.",
};

export default function Requests() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <RequestsPage />
    </div>
  );
}

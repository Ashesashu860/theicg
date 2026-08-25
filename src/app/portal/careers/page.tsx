import type { Metadata } from "next";
import { CareersAdminPage } from "@/components/careers-admin-page";

export const metadata: Metadata = {
  title: "Careers | ICG Consultant Portal",
  description: "Manage career categories and open roles.",
};

export default function PortalCareers() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <CareersAdminPage />
    </div>
  );
}

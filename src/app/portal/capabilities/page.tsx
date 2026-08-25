import type { Metadata } from "next";
import { CapabilitiesAdminPage } from "@/components/capabilities-admin-page";

export const metadata: Metadata = {
  title: "Capabilities | ICG Consultant Portal",
  description: "Manage public capability categories.",
};

export default function PortalCapabilities() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <CapabilitiesAdminPage />
    </div>
  );
}

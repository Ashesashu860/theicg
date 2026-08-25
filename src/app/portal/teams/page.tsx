import type { Metadata } from "next";
import { TeamsAdminPage } from "@/components/teams-admin-page";

export const metadata: Metadata = {
  title: "Teams | ICG Consultant Portal",
  description: "Manage organization talent and division members.",
};

export default function PortalTeams() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TeamsAdminPage />
    </div>
  );
}

import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile-page";

export const metadata: Metadata = {
  title: "My Profile | ICG Consultant Portal",
  description: "Consultant profile and core competencies.",
};

export default function Profile() {
  return (
    <div className="min-h-screen overflow-y-auto bg-off-white">
      <ProfilePage />
    </div>
  );
}

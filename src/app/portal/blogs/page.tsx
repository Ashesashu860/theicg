import type { Metadata } from "next";
import { BlogsAdminPage } from "@/components/blogs-admin-page";

export const metadata: Metadata = {
  title: "Blogs | ICG Consultant Portal",
  description: "Manage blogs linked to capabilities.",
};

export default function PortalBlogs() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BlogsAdminPage />
    </div>
  );
}

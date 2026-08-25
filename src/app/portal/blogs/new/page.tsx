import type { Metadata } from "next";
import { BlogFormPage } from "@/components/blog-form-page";

export const metadata: Metadata = {
  title: "Create Blog | ICG Consultant Portal",
  description: "Create a new blog post.",
};

export default function PortalBlogCreate() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BlogFormPage mode="create" />
    </div>
  );
}

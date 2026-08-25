import type { Metadata } from "next";
import { BlogFormPage } from "@/components/blog-form-page";

type EditBlogRouteProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Blog | ICG Consultant Portal",
  description: "Edit an existing blog post.",
};

export default async function PortalBlogEdit({ params }: EditBlogRouteProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BlogFormPage mode="edit" blogId={id} />
    </div>
  );
}

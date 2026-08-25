import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailPage } from "@/components/blog-detail-page";
import { excerptFromContent } from "@/lib/blogs-data";
import {
  getBlogBySlug,
  getCapabilityById,
} from "@/lib/capabilities-server";

export const dynamic = "force-dynamic";

type BlogRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found | ICG: IITians Consulting Group",
    };
  }

  return {
    title: `${blog.title} | ICG: IITians Consulting Group`,
    description: excerptFromContent(blog.content, 160),
  };
}

export default async function BlogDetail({ params }: BlogRouteProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const capability = await getCapabilityById(blog.capabilityId);

  return <BlogDetailPage blog={blog} capability={capability} />;
}

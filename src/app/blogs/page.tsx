import type { Metadata } from "next";
import { BlogsPage } from "@/components/blogs-page";
import {
  listBlogs,
  listCapabilities,
} from "@/lib/capabilities-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs | ICG: IITians Consulting Group",
  description:
    "Perspectives on knowledge, strategy, and smarter decisions across ICG capability areas.",
};

type BlogsRouteProps = {
  searchParams: Promise<{ capability?: string | string[] }>;
};

export default async function Blogs({ searchParams }: BlogsRouteProps) {
  const params = await searchParams;
  const capabilityParam =
    typeof params.capability === "string" ? params.capability : null;

  const [blogs, capabilities] = await Promise.all([
    listBlogs(),
    listCapabilities(),
  ]);

  const activeCapabilityId =
    capabilityParam &&
    capabilities.some((capability) => capability.id === capabilityParam)
      ? capabilityParam
      : null;

  return (
    <BlogsPage
      blogs={blogs}
      capabilities={capabilities}
      activeCapabilityId={activeCapabilityId}
    />
  );
}

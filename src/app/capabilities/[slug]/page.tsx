import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CapabilityDetailPage } from "@/components/capability-detail-page";
import {
  getCapabilityBySlug,
  listBlogsByCapabilityId,
} from "@/lib/capabilities-server";

export const dynamic = "force-dynamic";

type CapabilityRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CapabilityRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const capability = await getCapabilityBySlug(slug);

  if (!capability) {
    return {
      title: "Capability Not Found | ICG: IITians Consulting Group",
    };
  }

  return {
    title: `${capability.name} | ICG: IITians Consulting Group`,
    description: capability.description,
  };
}

export default async function CapabilityDetail({
  params,
}: CapabilityRouteProps) {
  const { slug } = await params;
  const capability = await getCapabilityBySlug(slug);

  if (!capability) {
    notFound();
  }

  const blogs = await listBlogsByCapabilityId(capability.id);

  return <CapabilityDetailPage capability={capability} blogs={blogs} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CapabilityDetailPage } from "@/components/capability-detail-page";
import {
  getCapabilityBySlug,
  getCapabilitySlugs,
} from "@/lib/capabilities";

type CapabilityRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCapabilitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CapabilityRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const capability = getCapabilityBySlug(slug);

  if (!capability) {
    return {
      title: "Capability Not Found | ICG: IITians Consulting Group",
    };
  }

  return {
    title: `${capability.title} | ICG: IITians Consulting Group`,
    description: capability.description,
  };
}

export default async function CapabilityDetail({
  params,
}: CapabilityRouteProps) {
  const { slug } = await params;
  const capability = getCapabilityBySlug(slug);

  if (!capability) {
    notFound();
  }

  return <CapabilityDetailPage capability={capability} />;
}

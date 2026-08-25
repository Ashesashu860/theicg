import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { listPublicTeamMembers } from "@/lib/teams-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | ICG: IITians Consulting Group",
  description:
    "ICG is a consulting group built on the power of knowledge, collaboration, and strategic thinking. We connect expertise with opportunity to help clients make smarter decisions.",
};

export default async function About() {
  const members = await listPublicTeamMembers();

  return <AboutPage members={members} />;
}

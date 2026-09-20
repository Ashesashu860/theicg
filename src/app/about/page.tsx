import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { listPublicTeamMembers } from "@/lib/teams-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | ICG: IITians Consulting Group",
  description:
    "ICG is a consulting practice built by engineers, researchers and specialists who have already built, deployed and operated real solutions in their fields. We direct that experience at India's public programmes, from policy design through to systems that run on the ground.",
};

export default async function About() {
  const members = await listPublicTeamMembers();

  return <AboutPage members={members} />;
}

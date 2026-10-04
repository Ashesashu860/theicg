import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { listCapabilities, listRecentBlogs } from "@/lib/capabilities-server";
import { listPublicTeamMembers } from "@/lib/teams-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ICG: IITians Consulting Group | The Great Minds Behind Better Decisions",
  description:
    "At ICG – IITians Consulting Group, we believe great decisions are powered by great minds. Expert consultation, strategic guidance, and practical solutions tailored to your needs.",
};

export default async function Home() {
  const [capabilities, members, recentBlogs] = await Promise.all([
    listCapabilities(),
    listPublicTeamMembers(),
    listRecentBlogs(3).catch(() => []),
  ]);

  return (
    <HomePage
      capabilities={capabilities}
      members={members}
      recentBlogs={recentBlogs}
    />
  );
}

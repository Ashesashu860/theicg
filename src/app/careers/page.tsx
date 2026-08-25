import type { Metadata } from "next";
import { CareersPage } from "@/components/careers-page";
import {
  listCareerCategories,
  listCareerRoles,
} from "@/lib/careers-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers | ICG: IITians Consulting Group",
  description:
    "Join a rocketship at ICG – IITians Consulting Group. High growth, high impact, elite talent. Explore open roles and start your application.",
};

export default async function Careers() {
  const [roles, categories] = await Promise.all([
    listCareerRoles(),
    listCareerCategories(),
  ]);

  return <CareersPage roles={roles} categories={categories} />;
}

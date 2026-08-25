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
    "Join ICG – IITians Consulting Group. Work with great minds to deliver expert consultation, strategic guidance, and practical solutions.",
};

export default async function Careers() {
  const [roles, categories] = await Promise.all([
    listCareerRoles(),
    listCareerCategories(),
  ]);

  return <CareersPage roles={roles} categories={categories} />;
}

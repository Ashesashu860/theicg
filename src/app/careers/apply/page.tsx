import type { Metadata } from "next";
import { CareerApplicationPage } from "@/components/career-application-page";
import { listCareerRoles } from "@/lib/careers-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apply | Careers | ICG: IITians Consulting Group",
  description:
    "Apply for an open role at ICG – IITians Consulting Group. Submit your details, resume, and cover letter.",
};

type CareersApplyPageProps = {
  searchParams: Promise<{ role?: string | string[] }>;
};

export default async function CareersApplyPage({
  searchParams,
}: CareersApplyPageProps) {
  const params = await searchParams;
  const roleParam = params.role;
  const initialRoleId = Array.isArray(roleParam)
    ? (roleParam[0] ?? "")
    : (roleParam ?? "");

  const roles = await listCareerRoles();

  return (
    <CareerApplicationPage roles={roles} initialRoleId={initialRoleId} />
  );
}

import { adminSubcollectionPath } from "@/lib/admin-firestore";

export const TEAM_STATUSES = ["Active", "On Leave"] as const;

export type TeamMemberStatus = (typeof TEAM_STATUSES)[number];

export type TeamDesignationRecord = {
  id: string;
  name: string;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type TeamMemberRecord = {
  id: string;
  fullName: string;
  department: string;
  designationId: string;
  designation: string;
  imageUrl: string;
  bio: string;
  email: string;
  phone: string;
  status: TeamMemberStatus;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export function readTeamMemberOrder(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : Number.MAX_SAFE_INTEGER;
}

export function compareTeamMembersByOrder(
  a: { order: number; fullName: string },
  b: { order: number; fullName: string },
): number {
  if (a.order !== b.order) return a.order - b.order;
  return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: "base" });
}

/** Public directory fields only — no email or phone. */
export type PublicTeamMember = {
  id: string;
  fullName: string;
  department: string;
  designation: string;
  imageUrl: string;
  bio: string;
};

export const TEAM_DESIGNATIONS_COLLECTION = "teamDesignations";
export const TEAM_MEMBERS_COLLECTION = "teamMembers";

export function teamDesignationsPath(): [string, string, string] {
  return adminSubcollectionPath(TEAM_DESIGNATIONS_COLLECTION);
}

export function teamMembersPath(): [string, string, string] {
  return adminSubcollectionPath(TEAM_MEMBERS_COLLECTION);
}

export function isTeamMemberStatus(value: unknown): value is TeamMemberStatus {
  return TEAM_STATUSES.includes(value as TeamMemberStatus);
}

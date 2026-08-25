import { adminSubcollectionPath } from "@/lib/admin-firestore";

export type CareerApplicationRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string;
  resumePath: string;
  roleId: string;
  roleTitle: string;
  coverLetter: string;
  createdAt: Date | null;
};

export const CAREER_APPLICATIONS_COLLECTION = "careerApplications";

export function careerApplicationsPath(): [string, string, string] {
  return adminSubcollectionPath(CAREER_APPLICATIONS_COLLECTION);
}

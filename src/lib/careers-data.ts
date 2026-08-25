import { adminSubcollectionPath } from "@/lib/admin-firestore";

export type CareerCategoryRecord = {
  id: string;
  name: string;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CareerRoleRecord = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const CAREER_CATEGORIES_COLLECTION = "careerCategories";
export const CAREER_ROLES_COLLECTION = "careerRoles";

export function careerCategoriesPath(): [string, string, string] {
  return adminSubcollectionPath(CAREER_CATEGORIES_COLLECTION);
}

export function careerRolesPath(): [string, string, string] {
  return adminSubcollectionPath(CAREER_ROLES_COLLECTION);
}

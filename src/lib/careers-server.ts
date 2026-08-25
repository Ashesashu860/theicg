import type { DocumentData } from "firebase-admin/firestore";
import { ADMIN_COLLECTION, ADMIN_DOC_ID } from "@/lib/admin-firestore";
import {
  CAREER_CATEGORIES_COLLECTION,
  CAREER_ROLES_COLLECTION,
  type CareerCategoryRecord,
  type CareerRoleRecord,
} from "@/lib/careers-data";
import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";

function adminDataCollection(subcollection: string) {
  return getFirebaseAdminDb()
    .collection(ADMIN_COLLECTION)
    .doc(ADMIN_DOC_ID)
    .collection(subcollection);
}

function toDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function mapCategory(id: string, data: DocumentData): CareerCategoryRecord {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    order: typeof data.order === "number" ? data.order : 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function mapRole(id: string, data: DocumentData): CareerRoleRecord {
  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    categoryId: typeof data.categoryId === "string" ? data.categoryId : "",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listCareerCategories(): Promise<CareerCategoryRecord[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(CAREER_CATEGORIES_COLLECTION)
    .orderBy("order", "asc")
    .get();

  return snapshot.docs.map((docSnap) =>
    mapCategory(docSnap.id, docSnap.data()),
  );
}

export async function listCareerRoles(): Promise<CareerRoleRecord[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(CAREER_ROLES_COLLECTION)
    .orderBy("title", "asc")
    .get();

  return snapshot.docs.map((docSnap) => mapRole(docSnap.id, docSnap.data()));
}

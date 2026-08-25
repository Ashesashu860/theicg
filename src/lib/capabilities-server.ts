import type { DocumentData } from "firebase-admin/firestore";
import {
  ADMIN_COLLECTION,
  ADMIN_DOC_ID,
} from "@/lib/admin-firestore";
import { BLOGS_COLLECTION, type BlogRecord } from "@/lib/blogs-data";
import {
  CAPABILITIES_COLLECTION,
  type CapabilityRecord,
} from "@/lib/capabilities-data";
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

function mapCapability(id: string, data: DocumentData): CapabilityRecord {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    slug: typeof data.slug === "string" ? data.slug : "",
    description: typeof data.description === "string" ? data.description : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function mapBlog(id: string, data: DocumentData): BlogRecord {
  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
    capabilityId:
      typeof data.capabilityId === "string" ? data.capabilityId : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listCapabilities(): Promise<CapabilityRecord[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(CAPABILITIES_COLLECTION)
    .orderBy("name", "asc")
    .get();

  return snapshot.docs.map((docSnap) =>
    mapCapability(docSnap.id, docSnap.data()),
  );
}

export async function getCapabilityBySlug(
  slug: string,
): Promise<CapabilityRecord | null> {
  if (!isFirebaseAdminConfigured() || !slug) {
    return null;
  }

  const snapshot = await adminDataCollection(CAPABILITIES_COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const docSnap = snapshot.docs[0];
  if (!docSnap) {
    return null;
  }

  return mapCapability(docSnap.id, docSnap.data());
}

export async function listBlogsByCapabilityId(
  capabilityId: string,
): Promise<BlogRecord[]> {
  if (!isFirebaseAdminConfigured() || !capabilityId) {
    return [];
  }

  const snapshot = await adminDataCollection(BLOGS_COLLECTION)
    .where("capabilityId", "==", capabilityId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((docSnap) => mapBlog(docSnap.id, docSnap.data()));
}

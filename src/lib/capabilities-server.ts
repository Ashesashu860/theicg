import type { DocumentData } from "firebase-admin/firestore";
import {
  ADMIN_COLLECTION,
  ADMIN_DOC_ID,
} from "@/lib/admin-firestore";
import {
  BLOGS_COLLECTION,
  resolvePublicBlogSlug,
  type BlogRecord,
} from "@/lib/blogs-data";
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
  const title = typeof data.title === "string" ? data.title : "";
  const storedSlug = typeof data.slug === "string" ? data.slug : "";
  return {
    id,
    title,
    slug: resolvePublicBlogSlug({ id, title, slug: storedSlug }),
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

export async function listBlogsForCapability(
  capability: Pick<CapabilityRecord, "id" | "slug">,
): Promise<BlogRecord[]> {
  const keys = [...new Set([capability.id, capability.slug].filter(Boolean))];
  const groups = await Promise.all(keys.map((key) => listBlogsByCapabilityId(key)));
  const seen = new Set<string>();
  const merged: BlogRecord[] = [];

  for (const group of groups) {
    for (const blog of group) {
      if (seen.has(blog.id)) continue;
      seen.add(blog.id);
      merged.push(blog);
    }
  }

  merged.sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  return merged;
}

export async function listBlogs(): Promise<BlogRecord[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(BLOGS_COLLECTION)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((docSnap) => mapBlog(docSnap.id, docSnap.data()));
}

export async function listRecentBlogs(limitCount = 3): Promise<BlogRecord[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(BLOGS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();

  return snapshot.docs.map((docSnap) => mapBlog(docSnap.id, docSnap.data()));
}

export async function getBlogBySlug(slug: string): Promise<BlogRecord | null> {
  if (!isFirebaseAdminConfigured() || !slug) {
    return null;
  }

  try {
    const snapshot = await adminDataCollection(BLOGS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    const docSnap = snapshot.docs[0];
    if (docSnap) {
      return mapBlog(docSnap.id, docSnap.data());
    }
  } catch {
    // Missing slug field/index on legacy docs — fall through to a full scan.
  }

  const all = await adminDataCollection(BLOGS_COLLECTION).get();
  for (const candidate of all.docs) {
    const mapped = mapBlog(candidate.id, candidate.data());
    if (mapped.slug === slug || candidate.id === slug) {
      return mapped;
    }
  }

  return null;
}

export async function getCapabilityById(
  id: string,
): Promise<CapabilityRecord | null> {
  if (!isFirebaseAdminConfigured() || !id) {
    return null;
  }

  const docSnap = await adminDataCollection(CAPABILITIES_COLLECTION)
    .doc(id)
    .get();

  if (docSnap.exists) {
    return mapCapability(docSnap.id, docSnap.data()!);
  }

  return getCapabilityBySlug(id);
}

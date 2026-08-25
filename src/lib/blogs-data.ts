import { adminSubcollectionPath } from "@/lib/admin-firestore";

export type BlogRecord = {
  id: string;
  title: string;
  content: string;
  capabilityId: string;
  imageUrl: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const BLOGS_COLLECTION = "blogs";

export function blogsPath(): [string, string, string] {
  return adminSubcollectionPath(BLOGS_COLLECTION);
}

export function excerptFromContent(content: string, maxLength = 160): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

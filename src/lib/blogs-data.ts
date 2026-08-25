import { adminSubcollectionPath } from "@/lib/admin-firestore";
import { htmlToPlainText } from "@/lib/blog-html";

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
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

export function slugifyBlogTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Stored slug, or a stable public slug derived from title / id (legacy docs). */
export function resolvePublicBlogSlug(input: {
  id: string;
  title: string;
  slug?: string | null;
}): string {
  const stored = input.slug?.trim() ?? "";
  if (stored) return stored;
  return slugifyBlogTitle(input.title) || input.id;
}

export function excerptFromContent(content: string, maxLength = 160): string {
  const normalized = htmlToPlainText(content);
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

import { adminSubcollectionPath } from "@/lib/admin-firestore";

export type CapabilityRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const CAPABILITIES_COLLECTION = "capabilities";

export function capabilitiesPath(): [string, string, string] {
  return adminSubcollectionPath(CAPABILITIES_COLLECTION);
}

export function slugifyCapabilityName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

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

export function slugifyCapabilityName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

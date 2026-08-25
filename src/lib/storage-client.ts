import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase";

export type ContentImageFolder = "capabilities" | "blogs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

function safeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
  return base.slice(0, 120) || "image";
}

export async function uploadContentImage(
  file: File,
  folder: ContentImageFolder,
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const objectPath = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const storageRef = ref(getFirebaseStorage(), objectPath);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000",
  });
  return getDownloadURL(storageRef);
}

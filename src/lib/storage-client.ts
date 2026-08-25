import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase";

export type ContentImageFolder = "capabilities" | "blogs";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export const CAREER_RESUME_FOLDER = "career-resumes";

function safeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
  return base.slice(0, 120) || "file";
}

export function isAllowedResumeType(type: string): boolean {
  return ALLOWED_RESUME_TYPES.has(type);
}

export function isResumeWithinSizeLimit(size: number): boolean {
  // Match storage.rules underSizeLimit(): size < 5MB
  return size < MAX_BYTES;
}

export async function uploadContentImage(
  file: File,
  folder: ContentImageFolder,
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
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

export type CareerResumeUploadResult = {
  url: string;
  path: string;
};

export async function uploadCareerResume(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CareerResumeUploadResult> {
  if (!ALLOWED_RESUME_TYPES.has(file.type)) {
    throw new Error("Use a PDF, DOC, or DOCX file.");
  }
  if (file.size >= MAX_BYTES) {
    throw new Error("Resume must be under 5MB.");
  }

  const objectPath = `${CAREER_RESUME_FOLDER}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const storageRef = ref(getFirebaseStorage(), objectPath);
  const task = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: "private,max-age=0",
  });

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        if (!onProgress || snapshot.totalBytes === 0) {
          return;
        }
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress(percent);
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve();
      },
    );
  });

  const url = await getDownloadURL(task.snapshot.ref);
  return { url, path: objectPath };
}

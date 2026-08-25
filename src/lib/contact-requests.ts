import { adminSubcollectionPath } from "@/lib/admin-firestore";

export type RequestStatus = "New" | "Reviewed" | "Contacted";

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  interest: string;
  status: RequestStatus;
  createdAt: Date | null;
};

export const CLIENT_REQUESTS_COLLECTION = "clientRequests";

/** @deprecated Use CLIENT_REQUESTS_COLLECTION */
export const CONTACT_REQUESTS_COLLECTION = CLIENT_REQUESTS_COLLECTION;

export function clientRequestsPath(): [string, string, string] {
  return adminSubcollectionPath(CLIENT_REQUESTS_COLLECTION);
}

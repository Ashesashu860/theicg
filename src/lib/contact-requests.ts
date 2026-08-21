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

export const CONTACT_REQUESTS_COLLECTION = "contactRequests";

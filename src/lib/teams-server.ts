import type { DocumentData } from "firebase-admin/firestore";
import { ADMIN_COLLECTION, ADMIN_DOC_ID } from "@/lib/admin-firestore";
import {
  TEAM_MEMBERS_COLLECTION,
  type PublicTeamMember,
} from "@/lib/teams-data";
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

function mapPublicMember(id: string, data: DocumentData): PublicTeamMember {
  return {
    id,
    fullName: typeof data.fullName === "string" ? data.fullName : "",
    department: typeof data.department === "string" ? data.department : "",
    designation: typeof data.designation === "string" ? data.designation : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
  };
}

export async function listPublicTeamMembers(): Promise<PublicTeamMember[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(TEAM_MEMBERS_COLLECTION)
    .orderBy("fullName", "asc")
    .get();

  return snapshot.docs
    .map((docSnap) => mapPublicMember(docSnap.id, docSnap.data()))
    .filter((member) => member.fullName.trim().length > 0);
}

import type { DocumentData } from "firebase-admin/firestore";
import { ADMIN_COLLECTION, ADMIN_DOC_ID } from "@/lib/admin-firestore";
import {
  compareTeamMembersByOrder,
  readTeamMemberOrder,
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
    bio: typeof data.bio === "string" ? data.bio : "",
  };
}

export async function listPublicTeamMembers(): Promise<PublicTeamMember[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snapshot = await adminDataCollection(TEAM_MEMBERS_COLLECTION).get();

  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        member: mapPublicMember(docSnap.id, data),
        order: readTeamMemberOrder(data.order),
      };
    })
    .filter((entry) => entry.member.fullName.trim().length > 0)
    .sort((a, b) =>
      compareTeamMembersByOrder(
        { order: a.order, fullName: a.member.fullName },
        { order: b.order, fullName: b.member.fullName },
      ),
    )
    .map((entry) => entry.member);
}

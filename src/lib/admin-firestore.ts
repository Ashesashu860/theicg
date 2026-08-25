/** Root admin collection + sentinel document for CMS subcollections. */
export const ADMIN_COLLECTION = "admin";
export const ADMIN_DOC_ID = "data";

/** Path segments: admin / data / {subcollection} */
export function adminSubcollectionPath(subcollection: string): [string, string, string] {
  return [ADMIN_COLLECTION, ADMIN_DOC_ID, subcollection];
}

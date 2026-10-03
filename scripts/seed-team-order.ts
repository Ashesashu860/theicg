/**
 * One-shot: give team members without an order the current name sequence.
 *
 * Usage (from repo root, with Admin credentials in env):
 *   npx tsx scripts/seed-team-order.ts
 *
 * Requires FIREBASE_ADMIN_* or FIREBASE_ADMIN_CREDENTIALS.
 * Members that already have an order are left unchanged.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FieldValue } from "firebase-admin/firestore";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value.replace(/\\n/g, "\n");
    }
  }
}

function hasOrder(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const { getFirebaseAdminDb } = await import("../src/lib/firebase-admin");
  const { ADMIN_COLLECTION, ADMIN_DOC_ID } = await import(
    "../src/lib/admin-firestore"
  );
  const { TEAM_MEMBERS_COLLECTION } = await import("../src/lib/teams-data");

  const snapshot = await getFirebaseAdminDb()
    .collection(ADMIN_COLLECTION)
    .doc(ADMIN_DOC_ID)
    .collection(TEAM_MEMBERS_COLLECTION)
    .get();

  const ranked = snapshot.docs
    .map((docSnap) => ({
      ref: docSnap.ref,
      fullName: String(docSnap.data().fullName || "").trim(),
      order: docSnap.data().order,
    }))
    .filter((member) => member.fullName.length > 0)
    .sort((a, b) =>
      a.fullName.localeCompare(b.fullName, undefined, { sensitivity: "base" }),
    );

  const missing = ranked.filter((member) => !hasOrder(member.order));
  if (missing.length === 0) {
    console.log("All team members already have an order.");
    return;
  }

  const maxOrder = ranked.reduce((max, member) => {
    if (!hasOrder(member.order)) return max;
    return Math.max(max, member.order);
  }, -1);

  let next = maxOrder + 1;
  for (const member of missing) {
    await member.ref.update({
      order: next,
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`Set order ${next}: ${member.fullName}`);
    next += 1;
  }

  console.log("Team member order assigned.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

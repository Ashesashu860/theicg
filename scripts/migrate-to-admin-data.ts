/**
 * One-shot migration: copy root collections into admin/data subcollections.
 *
 *   contactRequests  → admin/data/clientRequests
 *   capabilities     → admin/data/capabilities
 *   blogs            → admin/data/blogs
 *
 * Does not delete source documents. Run with Admin credentials:
 *   npm run migrate:admin-data
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, type CollectionReference } from "firebase-admin/firestore";

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

function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n").trim();
  if (key.includes("BEGIN") && !key.includes("\n")) {
    const match = key.match(
      /-----BEGIN ([^-]+)-----([A-Za-z0-9+/=\s]+)-----END ([^-]+)-----/,
    );
    if (match) {
      const type = match[1]!.trim();
      const body = match[2]!.replace(/\s+/g, "");
      const lines = body.match(/.{1,64}/g) ?? [];
      key = `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
    }
  }
  return key;
}

function initAdmin() {
  if (getApps().length) return;

  const credentialsJson = process.env.FIREBASE_ADMIN_CREDENTIALS?.trim();
  if (credentialsJson) {
    const parsed = JSON.parse(credentialsJson) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
    initializeApp({
      credential: cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: normalizePrivateKey(parsed.private_key),
      }),
    });
    return;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const privateKeyB64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (privateKeyB64) {
    privateKey = Buffer.from(privateKeyB64, "base64").toString("utf8");
  }
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_ADMIN_CREDENTIALS or FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY.",
    );
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKey),
    }),
  });
}

async function copyCollection(
  sourcePath: string,
  destCollection: CollectionReference,
): Promise<number> {
  const db = getFirestore();
  const snapshot = await db.collection(sourcePath).get();
  let copied = 0;

  for (const docSnap of snapshot.docs) {
    await destCollection.doc(docSnap.id).set(docSnap.data(), { merge: true });
    copied += 1;
  }

  return copied;
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));
  initAdmin();

  const db = getFirestore();
  const adminData = db.collection("admin").doc("data");
  await adminData.set(
    { migratedAt: Timestamp.now() },
    { merge: true },
  );

  const clientCopied = await copyCollection(
    "contactRequests",
    adminData.collection("clientRequests"),
  );
  console.log(
    `Copied ${clientCopied} docs: contactRequests → admin/data/clientRequests`,
  );

  const capabilitiesCopied = await copyCollection(
    "capabilities",
    adminData.collection("capabilities"),
  );
  console.log(
    `Copied ${capabilitiesCopied} docs: capabilities → admin/data/capabilities`,
  );

  const blogsCopied = await copyCollection(
    "blogs",
    adminData.collection("blogs"),
  );
  console.log(`Copied ${blogsCopied} docs: blogs → admin/data/blogs`);

  console.log(
    "Migration complete. Old root collections were left in place; delete them manually after verifying.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

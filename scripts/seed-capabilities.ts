/**
 * One-shot seed: upserts static capabilities + nested blogs into Firestore.
 *
 * Usage (from repo root, with Admin credentials in env):
 *   npx tsx scripts/seed-capabilities.ts
 *
 * Requires FIREBASE_ADMIN_* or FIREBASE_ADMIN_CREDENTIALS.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

type SeedBlog = {
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  date: string;
};

type SeedCapability = {
  slug: string;
  title: string;
  description: string;
  image: string;
  blogs: SeedBlog[];
};

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

function parseSeedDate(dateLabel: string): Date {
  const parsed = new Date(dateLabel);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date();
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));
  initAdmin();

  const { capabilities } = (await import(
    "../src/lib/capabilities"
  )) as { capabilities: SeedCapability[] };

  const db = getFirestore();
  const now = Timestamp.now();

  for (const capability of capabilities) {
    const capabilityRef = db.collection("capabilities").doc(capability.slug);
    await capabilityRef.set(
      {
        name: capability.title,
        slug: capability.slug,
        description: capability.description,
        imageUrl: capability.image || "",
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
    console.log(`Upserted capability: ${capability.slug}`);

    const existingBlogs = await db
      .collection("blogs")
      .where("capabilityId", "==", capability.slug)
      .get();

    const existingTitles = new Set(
      existingBlogs.docs.map((docSnap) => String(docSnap.data().title || "")),
    );

    for (const blog of capability.blogs) {
      if (existingTitles.has(blog.title)) {
        console.log(`  Skip existing blog: ${blog.title}`);
        continue;
      }

      const createdAt = Timestamp.fromDate(parseSeedDate(blog.date));
      await db.collection("blogs").add({
        title: blog.title,
        content: blog.excerpt,
        capabilityId: capability.slug,
        imageUrl: blog.image || "",
        createdAt,
        updatedAt: createdAt,
      });
      console.log(`  Added blog: ${blog.title}`);
    }
  }

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let appInstance: App | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

/**
 * Normalize a PEM private key from env vars.
 * Vercel often: keeps literal `\n`, uses real newlines, wraps quotes,
 * or strips newlines entirely into one line.
 */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\n/g, "\n").trim();

  // Collapsed into a single line with no newlines — rebuild PEM.
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

function getPrivateKeyFromEnv(): string | undefined {
  const base64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (base64) {
    try {
      return normalizePrivateKey(Buffer.from(base64, "base64").toString("utf8"));
    } catch {
      // fall through
    }
  }

  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!raw) {
    return undefined;
  }
  return normalizePrivateKey(raw);
}

function getServiceAccountFromJsonEnv(): ServiceAccount | null {
  const raw = process.env.FIREBASE_ADMIN_CREDENTIALS?.trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return null;
    }
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: normalizePrivateKey(parsed.private_key),
    };
  } catch {
    return null;
  }
}

export function isFirebaseAdminConfigured(): boolean {
  if (getServiceAccountFromJsonEnv()) {
    return true;
  }

  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      getPrivateKeyFromEnv(),
  );
}

function getFirebaseAdminApp(): App {
  if (appInstance) {
    return appInstance;
  }

  const existing = getApps();
  if (existing.length > 0) {
    appInstance = existing[0]!;
    return appInstance;
  }

  const fromJson = getServiceAccountFromJsonEnv();
  if (fromJson) {
    appInstance = initializeApp({
      credential: cert(fromJson),
      projectId: fromJson.projectId,
    });
    return appInstance;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKeyFromEnv();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY (or FIREBASE_ADMIN_PRIVATE_KEY_BASE64 / FIREBASE_ADMIN_CREDENTIALS).",
    );
  }

  appInstance = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return appInstance;
}

export function getFirebaseAdminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseAdminApp());
  }
  return authInstance;
}

export function getFirebaseAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseAdminApp());
  }
  return dbInstance;
}

export async function verifyIdToken(idToken: string) {
  return getFirebaseAdminAuth().verifyIdToken(idToken);
}

export async function createSessionCookie(
  idToken: string,
  expiresInMs: number,
) {
  return getFirebaseAdminAuth().createSessionCookie(idToken, {
    expiresIn: expiresInMs,
  });
}

export async function verifySessionCookie(
  sessionCookie: string,
  checkRevoked = true,
) {
  return getFirebaseAdminAuth().verifySessionCookie(
    sessionCookie,
    checkRevoked,
  );
}

export async function revokeRefreshTokens(uid: string) {
  return getFirebaseAdminAuth().revokeRefreshTokens(uid);
}

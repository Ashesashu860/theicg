import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let appInstance: App | null = null;
let authInstance: Auth | null = null;

function getPrivateKey(): string | undefined {
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!key) {
    return undefined;
  }
  return key.replace(/\\n/g, "\n");
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      getPrivateKey(),
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

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.",
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

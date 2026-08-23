import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

async function exchangeSessionCookie(idToken: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    let message = "Unable to create session.";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) {
        message = data.error;
      }
    } catch {
      // ignore JSON parse errors
    }

    if (response.status === 403) {
      await signOut(getFirebaseAuth()).catch(() => undefined);
    }

    throw new Error(message);
  }
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const result = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim(),
    password,
  );
  const idToken = await result.user.getIdToken();
  await exchangeSessionCookie(idToken);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    // Still clear client auth below.
  }

  if (isFirebaseConfigured()) {
    await signOut(getFirebaseAuth());
  }
}

export function subscribeToAuth(
  callback: (user: User | null) => void,
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function getAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Unable to sign in. Please try again.";
  }

  const err = error as { code?: string; message?: string };
  const code = String(err.code || "");
  const message = String(err.message || "");

  if (
    message.includes("CONFIGURATION_NOT_FOUND") ||
    code === "auth/configuration-not-found"
  ) {
    return "Firebase Authentication is not set up yet. In Firebase Console, open Authentication → Get started, then enable the Email/Password provider.";
  }

  if (
    code === "auth/invalid-api-key" ||
    message.includes("Firebase is not configured")
  ) {
    return "Firebase API key is missing or invalid. Set NEXT_PUBLIC_FIREBASE_* in your environment.";
  }

  if (
    message === "Forbidden." ||
    message.toLowerCase().includes("forbidden")
  ) {
    return "This account is not authorized for admin access.";
  }

  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is disabled. Enable it under Authentication → Sign-in method in Firebase Console.";
    default:
      if (message && !code) {
        return message;
      }
      return "Unable to sign in. Please try again.";
  }
}

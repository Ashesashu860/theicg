import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { buildAuthCookie, clearAuthCookie } from "@/lib/auth";

const googleProvider = new GoogleAuthProvider();

export function syncAuthCookie(user: User | null) {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = user ? buildAuthCookie() : clearAuthCookie();
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  syncAuthCookie(result.user);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
  syncAuthCookie(null);
}

export function subscribeToAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    syncAuthCookie(user);
    callback(user);
  });
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
    return "Firebase Authentication is not set up yet. In Firebase Console, open Authentication → Get started, then enable the Google provider.";
  }

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by the browser.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Google sign-in.";
    case "auth/cancelled-popup-request":
      return "Another sign-in attempt is already in progress.";
    case "auth/operation-not-allowed":
      return "Google sign-in is disabled. Enable it under Authentication → Sign-in method in Firebase Console.";
    default:
      return "Unable to sign in with Google. Please try again.";
  }
}

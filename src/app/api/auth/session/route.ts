import { NextResponse } from "next/server";
import {
  AdminAuthError,
  clearAdminSession,
  createAdminSessionCookie,
} from "@/lib/admin-session";
import {
  AUTH_COOKIE,
  getClearedSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/auth";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";

type SessionBody = {
  idToken?: unknown;
};

function sessionErrorPayload(error: unknown): {
  error: string;
  code?: string;
} {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error ?? "");
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : undefined;

  if (
    message.includes("Failed to parse private key") ||
    message.includes("Invalid PEM") ||
    message.includes("DECODER routines") ||
    message.includes("error:1E08010C") ||
    message.includes("error:0909006C") ||
    message.includes("error:1E")
  ) {
    return {
      error:
        "Invalid Firebase Admin private key on the server. Re-set FIREBASE_ADMIN_PRIVATE_KEY (with \\n newlines) or set FIREBASE_ADMIN_PRIVATE_KEY_BASE64.",
      code: code || "invalid-private-key",
    };
  }

  if (
    code === "auth/argument-error" ||
    message.includes("Decoding Firebase ID token failed") ||
    message.includes("Firebase ID token has incorrect")
  ) {
    return {
      error:
        "ID token rejected. Confirm FIREBASE_ADMIN_PROJECT_ID matches NEXT_PUBLIC_FIREBASE_PROJECT_ID.",
      code,
    };
  }

  if (code === "auth/id-token-expired") {
    return { error: "Sign-in expired. Please try again.", code };
  }

  // Surface Firebase error code so production debugging is possible.
  return {
    error: code
      ? `Unable to create session (${code}).`
      : "Unable to create session.",
    code,
  };
}

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 500 },
    );
  }

  let payload: SessionBody;
  try {
    payload = (await request.json()) as SessionBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const idToken =
    typeof payload.idToken === "string" ? payload.idToken.trim() : "";
  if (!idToken) {
    return NextResponse.json(
      { error: "An ID token is required." },
      { status: 400 },
    );
  }

  try {
    const { sessionCookie, maxAge } = await createAdminSessionCookie(idToken);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      AUTH_COOKIE,
      sessionCookie,
      getSessionCookieOptions(maxAge),
    );
    return response;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to create admin session:", error);
    return NextResponse.json(sessionErrorPayload(error), { status: 401 });
  }
}

export async function DELETE() {
  try {
    await clearAdminSession({ revoke: true });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE, "", getClearedSessionCookieOptions());
    return response;
  } catch (error) {
    console.error("Failed to clear admin session:", error);
    return NextResponse.json(
      { error: "Unable to sign out." },
      { status: 500 },
    );
  }
}

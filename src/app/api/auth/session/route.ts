import { NextResponse } from "next/server";
import {
  AdminAuthError,
  clearAdminSession,
  createAdminSessionCookie,
  setAdminSessionCookie,
} from "@/lib/admin-session";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";

type SessionBody = {
  idToken?: unknown;
};

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
    await setAdminSessionCookie(sessionCookie, maxAge);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to create admin session:", error);
    return NextResponse.json(
      { error: "Unable to create session." },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  try {
    await clearAdminSession({ revoke: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to clear admin session:", error);
    return NextResponse.json(
      { error: "Unable to sign out." },
      { status: 500 },
    );
  }
}

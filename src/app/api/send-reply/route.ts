import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { AUTH_COOKIE, AUTH_COOKIE_VALUE } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBJECT_LENGTH = 200;
const MAX_BODY_LENGTH = 20_000;

type SendReplyBody = {
  to?: unknown;
  subject?: unknown;
  body?: unknown;
};

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get(AUTH_COOKIE)?.value !== AUTH_COOKIE_VALUE) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: SendReplyBody;
  try {
    payload = (await request.json()) as SendReplyBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const to = typeof payload.to === "string" ? payload.to.trim() : "";
  const subject =
    typeof payload.subject === "string" ? payload.subject.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";

  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ error: "A valid recipient email is required." }, { status: 400 });
  }
  if (!isNonEmptyString(subject, MAX_SUBJECT_LENGTH)) {
    return NextResponse.json({ error: "A valid subject is required." }, { status: 400 });
  }
  if (!isNonEmptyString(body, MAX_BODY_LENGTH)) {
    return NextResponse.json(
      { error: "Message content is required." },
      { status: 400 },
    );
  }

  const host = process.env.BREVO_SMTP_HOST;
  const port = Number(process.env.BREVO_SMTP_PORT || "587");
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  const fromName = process.env.BREVO_FROM_NAME?.trim() || "ICG";

  if (!host || !user || !pass || !fromEmail) {
    return NextResponse.json(
      { error: "Email sending is not configured." },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: body,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send reply email:", error);
    return NextResponse.json(
      { error: "Unable to send email. Please try again." },
      { status: 502 },
    );
  }
}

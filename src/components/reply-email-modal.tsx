"use client";

import { useEffect, useId, useState } from "react";
import type { ContactRequest } from "@/lib/contact-requests";

type ReplyEmailModalProps = {
  request: ContactRequest;
  onClose: () => void;
};

export function buildReplySubject(item: ContactRequest): string {
  return `Re: ICG inquiry — ${item.interest || "General Interest"}`;
}

export function buildReplyBody(item: ContactRequest): string {
  const greetingName = item.name.trim() || "there";
  return `Hello ${greetingName},\n\nThank you for reaching out to ICG about ${item.interest || "your inquiry"}.\n\n`;
}

const inputClassName =
  "w-full border border-outline-variant bg-surface px-3 py-2 font-sans text-body-md text-on-surface outline-none transition-colors focus:border-primary disabled:opacity-60";

export function ReplyEmailModal({ request, onClose }: ReplyEmailModalProps) {
  const titleId = useId();
  const [to, setTo] = useState(request.email);
  const [subject, setSubject] = useState(() => buildReplySubject(request));
  const [body, setBody] = useState(() => buildReplyBody(request));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  async function handleSend() {
    const trimmedTo = to.trim();
    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();

    if (!trimmedTo) {
      setError("Enter a recipient email.");
      return;
    }
    if (!trimmedSubject) {
      setError("Enter a subject.");
      return;
    }
    if (!trimmedBody) {
      setError("Enter a message before sending.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: trimmedTo,
          subject: trimmedSubject,
          body: trimmedBody,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        ok?: boolean;
      } | null;

      if (!response.ok) {
        setError(data?.error || "Unable to send email. Please try again.");
        return;
      }

      onClose();
    } catch {
      setError("Unable to send email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSend = Boolean(to.trim() && subject.trim() && body.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
      role="presentation"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg border border-outline-variant bg-pure-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-outline-variant px-6 py-5">
          <h2
            id={titleId}
            className="font-serif text-headline-md text-primary"
          >
            Reply to inquiry
          </h2>
          <p className="mt-1 font-sans text-body-md text-on-surface-variant">
            Send a response to {request.name.trim() || "this prospect"}.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label
              htmlFor="reply-to"
              className="mb-1 block font-sans text-label-md uppercase tracking-wider text-outline"
            >
              To
            </label>
            <input
              id="reply-to"
              type="email"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              disabled={submitting}
              className={inputClassName}
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="reply-subject"
              className="mb-1 block font-sans text-label-md uppercase tracking-wider text-outline"
            >
              Subject
            </label>
            <input
              id="reply-subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={submitting}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="reply-body"
              className="mb-1 block font-sans text-label-md uppercase tracking-wider text-outline"
            >
              Message
            </label>
            <textarea
              id="reply-body"
              rows={8}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              disabled={submitting}
              className={`${inputClassName} resize-y`}
            />
          </div>

          {error ? (
            <p className="font-sans text-body-md text-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting || !canSend}
            className="border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

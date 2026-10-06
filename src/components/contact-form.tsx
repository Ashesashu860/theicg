"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { clientRequestsPath } from "@/lib/contact-requests";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();

    if (!name || !phone || !email) {
      setError("Please complete all fields.");
      setSubmitting(false);
      return;
    }

    try {
      if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured.");
      }
      await addDoc(collection(getFirebaseDb(), ...clientRequestsPath()), {
        name,
        email,
        phone,
        role: "Contact inquiry",
        interest: "General Interest",
        status: "New",
        createdAt: serverTimestamp(),
      });
      form.reset();
      setSuccess(true);
    } catch {
      setError("Unable to submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative">
          <label
            className="absolute -top-3.5 left-0 text-label-md uppercase text-on-surface-variant"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            className="input-minimal w-full py-2 font-sans text-body-md text-on-surface"
            id="name"
            name="name"
            required
            type="text"
          />
        </div>
        <div className="relative">
          <label
            className="absolute -top-3.5 left-0 text-label-md uppercase text-on-surface-variant"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            className="input-minimal w-full py-2 font-sans text-body-md text-on-surface"
            id="phone"
            name="phone"
            required
            type="tel"
          />
        </div>
      </div>
      <div className="relative">
        <label
          className="absolute -top-3.5 left-0 text-label-md uppercase text-on-surface-variant"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className="input-minimal w-full py-2 font-sans text-body-md text-on-surface"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      {error ? (
        <p role="alert" className="text-body-md text-error">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-body-md text-success">
          Thank you. Your details have been submitted successfully.
        </p>
      ) : null}

      <div className="flex justify-end pt-4">
        <button
          className="btn btn-primary w-full md:w-auto"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

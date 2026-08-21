"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CONTACT_REQUESTS_COLLECTION } from "@/lib/contact-requests";
import { db } from "@/lib/firebase";

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
      await addDoc(collection(db, CONTACT_REQUESTS_COLLECTION), {
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
            className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
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
            className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
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
          className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
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
        <p className="font-sans text-body-md text-error">{error}</p>
      ) : null}
      {success ? (
        <p className="font-sans text-body-md text-secondary">
          Thank you. Your details have been submitted successfully.
        </p>
      ) : null}

      <div className="flex justify-end pt-4">
        <button
          className="hover-btn-primary w-full bg-primary-container px-10 py-3 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300 disabled:opacity-70 md:w-auto"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

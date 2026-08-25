"use client";

import Link from "next/link";
import { FormEvent, useId, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { careerApplicationsPath } from "@/lib/career-applications";
import type { CareerRoleRecord } from "@/lib/careers-data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  isAllowedResumeType,
  isResumeWithinSizeLimit,
  uploadCareerResume,
} from "@/lib/storage-client";

type CareerApplicationFormProps = {
  roles: CareerRoleRecord[];
  initialRoleId?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function friendlyError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    if (
      message === "Use a PDF, DOC, or DOCX file." ||
      message === "Resume must be under 5MB."
    ) {
      return message;
    }
  }
  return "Unable to submit your application right now. Please try again.";
}

export function CareerApplicationForm({
  roles,
  initialRoleId = "",
}: CareerApplicationFormProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const preselectedRoleId =
    initialRoleId && roles.some((role) => role.id === initialRoleId)
      ? initialRoleId
      : "";

  function clearResume() {
    setResumeFile(null);
    setFileInputKey((key) => key + 1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleResumeChange(file: File | null) {
    setError("");
    if (!file) {
      clearResume();
      return;
    }
    if (!isAllowedResumeType(file.type)) {
      setError("Use a PDF, DOC, or DOCX file.");
      clearResume();
      return;
    }
    if (!isResumeWithinSizeLimit(file.size)) {
      setError("Resume must be under 5MB.");
      clearResume();
      return;
    }
    setResumeFile(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setError("");
    setSuccess(false);
    setSubmitting(true);
    setUploadProgress(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const location = String(data.get("location") || "").trim();
    const roleId = String(data.get("roleId") || "").trim();
    const coverLetter = String(data.get("coverLetter") || "").trim();

    if (!fullName || !email || !phone || !location || !roleId || !coverLetter) {
      setError("Please complete all fields.");
      setSubmitting(false);
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume.");
      setSubmitting(false);
      return;
    }

    if (!isAllowedResumeType(resumeFile.type)) {
      setError("Use a PDF, DOC, or DOCX file.");
      setSubmitting(false);
      return;
    }

    if (!isResumeWithinSizeLimit(resumeFile.size)) {
      setError("Resume must be under 5MB.");
      setSubmitting(false);
      return;
    }

    const selectedRole = roles.find((role) => role.id === roleId);
    if (!selectedRole) {
      setError("Please select a valid role.");
      setSubmitting(false);
      return;
    }

    try {
      if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured.");
      }

      setUploadProgress(0);
      const { url: resumeUrl, path: resumePath } = await uploadCareerResume(
        resumeFile,
        (percent) => setUploadProgress(percent),
      );

      await addDoc(collection(getFirebaseDb(), ...careerApplicationsPath()), {
        fullName,
        email,
        phone,
        location,
        resumeUrl,
        resumePath,
        roleId: selectedRole.id,
        roleTitle: selectedRole.title,
        coverLetter,
        createdAt: serverTimestamp(),
      });

      form.reset();
      clearResume();
      setUploadProgress(null);
      setSuccess(true);
    } catch (err) {
      setError(friendlyError(err));
      setUploadProgress(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center" role="status">
        <h2 className="font-serif text-headline-md text-primary">
          Application Submitted Successfully
        </h2>
        <p className="font-sans text-body-md text-on-surface-variant">
          Thank you for applying. We&apos;ve received your application and will
          review it shortly.
        </p>
        <Link
          href="/careers"
          className="hover-btn-primary inline-block bg-primary-container px-10 py-3 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300"
        >
          Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-10" onSubmit={onSubmit} noValidate>
      <section className="space-y-8" aria-labelledby={`${formId}-basics`}>
        <h2
          id={`${formId}-basics`}
          className="font-serif text-headline-md text-primary"
        >
          Basic Details
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative">
            <label
              className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
              htmlFor={`${formId}-fullName`}
            >
              Full Name
            </label>
            <input
              className="input-minimal w-full py-2 font-sans text-body-md text-on-surface disabled:opacity-60"
              id={`${formId}-fullName`}
              name="fullName"
              required
              type="text"
              autoComplete="name"
              disabled={submitting}
            />
          </div>
          <div className="relative">
            <label
              className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
              htmlFor={`${formId}-email`}
            >
              Email
            </label>
            <input
              className="input-minimal w-full py-2 font-sans text-body-md text-on-surface disabled:opacity-60"
              id={`${formId}-email`}
              name="email"
              required
              type="email"
              autoComplete="email"
              disabled={submitting}
            />
          </div>
          <div className="relative">
            <label
              className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
              htmlFor={`${formId}-phone`}
            >
              Phone Number
            </label>
            <input
              className="input-minimal w-full py-2 font-sans text-body-md text-on-surface disabled:opacity-60"
              id={`${formId}-phone`}
              name="phone"
              required
              type="tel"
              autoComplete="tel"
              disabled={submitting}
            />
          </div>
          <div className="relative">
            <label
              className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
              htmlFor={`${formId}-location`}
            >
              Location
            </label>
            <input
              className="input-minimal w-full py-2 font-sans text-body-md text-on-surface disabled:opacity-60"
              id={`${formId}-location`}
              name="location"
              required
              type="text"
              autoComplete="address-level2"
              disabled={submitting}
            />
          </div>
        </div>
      </section>

      <section className="space-y-6" aria-labelledby={`${formId}-resume`}>
        <h2
          id={`${formId}-resume`}
          className="font-serif text-headline-md text-primary"
        >
          Resume
        </h2>
        <div className="space-y-3">
          <label
            className="block font-sans text-label-md uppercase tracking-wider text-outline"
            htmlFor={`${formId}-resume-file`}
          >
            Upload Resume
          </label>
          <input
            key={fileInputKey}
            ref={fileInputRef}
            id={`${formId}-resume-file`}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) =>
              handleResumeChange(event.target.files?.[0] ?? null)
            }
            disabled={submitting}
            className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface outline-none transition-colors file:mr-4 file:border-0 file:bg-transparent file:font-sans file:text-label-md file:uppercase file:tracking-wider file:text-primary-container focus:border-primary disabled:opacity-60"
          />
          <p className="font-sans text-body-md text-on-surface-variant">
            PDF, DOC, or DOCX under 5MB.
          </p>
          {resumeFile ? (
            <div className="flex flex-wrap items-center gap-4">
              <p className="font-sans text-body-md text-on-surface">
                Selected: {resumeFile.name}
              </p>
              <button
                type="button"
                onClick={clearResume}
                disabled={submitting}
                className="font-sans text-label-md uppercase tracking-wider text-primary-container transition-colors hover:text-secondary disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          ) : null}
          {uploadProgress !== null ? (
            <div className="space-y-2" aria-live="polite">
              <p className="font-sans text-body-md text-on-surface-variant">
                Uploading resume… {uploadProgress}%
              </p>
              <div className="h-1.5 w-full overflow-hidden bg-surface-container">
                <div
                  className="h-full bg-primary-container transition-[width] duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-6" aria-labelledby={`${formId}-role`}>
        <h2
          id={`${formId}-role`}
          className="font-serif text-headline-md text-primary"
        >
          Role to Apply
        </h2>
        <div className="relative">
          <label
            className="absolute -top-3.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
            htmlFor={`${formId}-roleId`}
          >
            Role to Apply
          </label>
          <select
            id={`${formId}-roleId`}
            name="roleId"
            required
            defaultValue={preselectedRoleId}
            disabled={submitting || roles.length === 0}
            className="input-minimal w-full appearance-none py-2 font-sans text-body-md text-on-surface disabled:opacity-60"
          >
            <option value="" disabled>
              {roles.length === 0 ? "No open roles available" : "Select a role"}
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-6" aria-labelledby={`${formId}-cover`}>
        <h2
          id={`${formId}-cover`}
          className="font-serif text-headline-md text-primary"
        >
          Cover Letter
        </h2>
        <div className="relative pt-2">
          <label
            className="absolute -top-1.5 left-0 font-sans text-label-md uppercase tracking-wider text-outline"
            htmlFor={`${formId}-coverLetter`}
          >
            Cover Letter
          </label>
          <textarea
            id={`${formId}-coverLetter`}
            name="coverLetter"
            required
            rows={8}
            disabled={submitting}
            placeholder="Tell us why you're interested in this role and why you'd be a good fit..."
            className="input-minimal mt-2 min-h-[12rem] w-full resize-y py-2 font-sans text-body-md text-on-surface disabled:opacity-60"
          />
        </div>
      </section>

      {error ? (
        <p className="font-sans text-body-md text-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end pt-2">
        <button
          className="hover-btn-primary w-full bg-primary-container px-10 py-3 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          type="submit"
          disabled={submitting || roles.length === 0}
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </form>
  );
}

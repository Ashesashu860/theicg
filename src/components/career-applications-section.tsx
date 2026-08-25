"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type FirestoreError,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "@/components/auth-provider";
import { CloseIcon, SearchIcon } from "@/components/icons";
import {
  careerApplicationsPath,
  type CareerApplicationRecord,
} from "@/lib/career-applications";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function getApplicationsErrorMessage(error: FirestoreError): string {
  switch (error.code) {
    case "permission-denied":
      return "Permission denied. Sign in again, and publish Firestore rules that allow authenticated reads on admin/data/careerApplications.";
    case "failed-precondition":
      return "Firestore needs an index for this query. Check the browser console for a create-index link.";
    case "unavailable":
      return "Firestore is temporarily unavailable. Please try again.";
    default:
      return (
        error.message || "Unable to load career applications. Please try again."
      );
  }
}

function formatSubmittedAt(value: Date | null): string {
  if (!value) {
    return "—";
  }
  return value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CareerApplicationsSection() {
  const { user, loading: authLoading } = useAuth();
  const configured = isFirebaseConfigured();
  const uid = user?.uid ?? null;
  const canSubscribe = configured && !authLoading && uid !== null;
  const coverLetterTitleId = useId();

  const [queryText, setQueryText] = useState("");
  const [applications, setApplications] = useState<CareerApplicationRecord[]>(
    [],
  );
  const [liveError, setLiveError] = useState("");
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewTarget, setViewTarget] =
    useState<CareerApplicationRecord | null>(null);

  const gateError = !configured
    ? "Firebase is not configured."
    : !authLoading && !user
      ? "Sign in required to view career applications."
      : "";
  const error = gateError || liveError;
  const loading = authLoading || (canSubscribe && loadedForUid !== uid);

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const applicationsQuery = query(
      collection(getFirebaseDb(), ...careerApplicationsPath()),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            fullName: String(data.fullName || ""),
            email: String(data.email || ""),
            phone: String(data.phone || ""),
            location: String(data.location || ""),
            resumeUrl: String(data.resumeUrl || ""),
            resumePath: String(data.resumePath || ""),
            roleId: String(data.roleId || ""),
            roleTitle: String(data.roleTitle || ""),
            coverLetter: String(data.coverLetter || ""),
            createdAt: toDate(data.createdAt),
          } satisfies CareerApplicationRecord;
        });
        setApplications(next);
        setLoadedForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getApplicationsErrorMessage(snapshotError));
        setLoadedForUid(uid);
      },
    );

    return unsubscribe;
  }, [canSubscribe, uid]);

  useEffect(() => {
    if (!viewTarget) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setViewTarget(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewTarget]);

  const filtered = useMemo(() => {
    const needle = queryText.trim().toLowerCase();
    if (!needle) {
      return applications;
    }
    return applications.filter(
      (item) =>
        item.fullName.toLowerCase().includes(needle) ||
        item.email.toLowerCase().includes(needle) ||
        item.roleTitle.toLowerCase().includes(needle),
    );
  }, [applications, queryText]);

  async function handleDelete(item: CareerApplicationRecord) {
    if (
      !window.confirm(
        `Delete application from ${item.fullName || "this applicant"}? This cannot be undone.`,
      )
    ) {
      return;
    }

    if (!configured) {
      toast.error("Firebase is not configured.");
      return;
    }

    setDeletingId(item.id);

    try {
      await deleteDoc(
        doc(getFirebaseDb(), ...careerApplicationsPath(), item.id),
      );
      if (viewTarget?.id === item.id) {
        setViewTarget(null);
      }
      toast.success("Application deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this application. Please try again.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 border-t border-outline-variant pt-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h3 className="font-serif text-headline-md text-primary">
              Applications
            </h3>
            <p className="mt-2 max-w-2xl font-sans text-body-md text-on-surface-variant">
              Review submissions from the public career application form.
            </p>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 pl-10 pr-4 font-sans text-body-md transition-colors placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-0 md:w-64"
              placeholder="Search applications..."
              type="search"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              aria-label="Search applications"
            />
          </div>
        </div>

        <div className="overflow-hidden border border-outline-variant bg-pure-white">
          <div className="hidden grid-cols-12 gap-4 border-b border-outline-variant bg-surface-container-lowest p-4 font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:grid">
            <div className="col-span-3">Applicant</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-outline-variant">
            {loading ? (
              <p className="p-6 font-sans text-body-md text-on-surface-variant">
                Loading applications…
              </p>
            ) : null}

            {!loading && error ? (
              <p className="p-6 font-sans text-body-md text-error" role="alert">
                {error}
              </p>
            ) : null}

            {!loading && !error && filtered.length === 0 ? (
              <p className="p-6 font-sans text-body-md text-on-surface-variant">
                {applications.length === 0
                  ? "No applications yet. Submissions from Apply for a Career Role will appear here."
                  : `No applications match “${queryText.trim()}”.`}
              </p>
            ) : null}

            {!loading &&
              !error &&
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-4 p-4 transition-colors hover:bg-surface-container-low md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-3">
                    <p className="font-serif text-[20px] text-primary">
                      {item.fullName || "—"}
                    </p>
                    <p className="font-sans text-body-md text-on-surface-variant">
                      {item.location || "—"}
                    </p>
                  </div>
                  <div className="font-sans text-body-md md:col-span-3">
                    <p className="text-on-surface">{item.email || "—"}</p>
                    <p className="text-on-surface-variant">
                      {item.phone || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="inline-flex border border-outline-variant/50 bg-surface-container px-2 py-1 font-sans text-xs uppercase tracking-wider text-on-surface">
                      {item.roleTitle || "Untitled role"}
                    </span>
                  </div>
                  <div className="font-sans text-body-md text-on-surface-variant md:col-span-2">
                    {formatSubmittedAt(item.createdAt)}
                  </div>
                  <div className="flex flex-wrap justify-start gap-2 md:col-span-2 md:justify-end">
                    {item.resumeUrl ? (
                      <a
                        href={item.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-primary px-3 py-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
                      >
                        Resume
                      </a>
                    ) : (
                      <span
                        className="cursor-not-allowed border border-outline-variant px-3 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant opacity-50"
                        title="No resume on this application"
                      >
                        Resume
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setViewTarget(item)}
                      className="border border-outline-variant px-3 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => void handleDelete(item)}
                      className="border border-error px-3 py-2 font-sans text-label-md uppercase tracking-widest text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {!loading && !error ? (
          <p className="font-sans text-body-md text-on-surface-variant">
            Showing {filtered.length} of {applications.length} applications
          </p>
        ) : null}
      </div>

      {viewTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
          role="presentation"
          onClick={() => setViewTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={coverLetterTitleId}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 py-5">
              <div>
                <h2
                  id={coverLetterTitleId}
                  className="font-serif text-headline-md text-primary"
                >
                  Cover Letter
                </h2>
                <p className="mt-1 font-sans text-body-md text-on-surface-variant">
                  {viewTarget.fullName}
                  {viewTarget.roleTitle
                    ? ` · ${viewTarget.roleTitle}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="text-on-surface-variant transition-colors hover:text-primary"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-6">
              <p className="whitespace-pre-wrap font-sans text-body-md text-on-surface">
                {viewTarget.coverLetter || "No cover letter provided."}
              </p>
            </div>
            <div className="flex justify-end border-t border-outline-variant px-6 py-4">
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

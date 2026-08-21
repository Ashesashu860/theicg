"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/components/auth-provider";
import { ReplyEmailModal } from "@/components/reply-email-modal";
import {
  CONTACT_REQUESTS_COLLECTION,
  type ContactRequest,
  type RequestStatus,
} from "@/lib/contact-requests";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ChevronRightIcon,
  FilterListIcon,
  SearchIcon,
} from "./icons";

function statusClass(status: RequestStatus) {
  if (status === "New") {
    return "bg-error-container text-on-error-container";
  }
  if (status === "Contacted") {
    return "border border-primary-fixed-dim bg-primary-fixed text-on-primary-fixed";
  }
  return "bg-surface-variant text-on-surface-variant";
}

function statusDot(status: RequestStatus) {
  if (status === "New") return "bg-error";
  if (status === "Contacted") return "bg-primary";
  return "bg-outline";
}

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function normalizeStatus(value: unknown): RequestStatus {
  if (value === "Reviewed" || value === "Contacted" || value === "New") {
    return value;
  }
  return "New";
}

function getRequestsErrorMessage(error: FirestoreError): string {
  switch (error.code) {
    case "permission-denied":
      return "Permission denied. Sign in again, and publish Firestore rules that allow authenticated reads on contactRequests.";
    case "failed-precondition":
      return "Firestore needs an index for this query. Check the browser console for a create-index link.";
    case "unavailable":
      return "Firestore is temporarily unavailable. Please try again.";
    default:
      return error.message || "Unable to load client requests. Please try again.";
  }
}

export function RequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const [queryText, setQueryText] = useState("");
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactRequest | null>(null);

  async function handleDelete(item: ContactRequest) {
    if (
      !window.confirm(
        `Delete request from ${item.name || "this prospect"}? This cannot be undone.`,
      )
    ) {
      return;
    }

    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured.");
      return;
    }

    setDeletingId(item.id);
    setError("");

    try {
      await deleteDoc(
        doc(getFirebaseDb(), CONTACT_REQUESTS_COLLECTION, item.id),
      );
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this request. Please try again.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured.");
      setLoading(false);
      return;
    }

    if (!user) {
      setError("Sign in required to view client requests.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const requestsQuery = query(
      collection(getFirebaseDb(), CONTACT_REQUESTS_COLLECTION),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ""),
            email: String(data.email || ""),
            phone: String(data.phone || ""),
            role: String(data.role || "Contact inquiry"),
            interest: String(data.interest || "General Interest"),
            status: normalizeStatus(data.status),
            createdAt: toDate(data.createdAt),
          } satisfies ContactRequest;
        });
        setRequests(next);
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        setError(getRequestsErrorMessage(snapshotError));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.interest.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q),
    );
  }, [queryText, requests]);

  const summary = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newCount = requests.filter((item) => item.status === "New").length;
    const reviewedCount = requests.filter(
      (item) => item.status === "Reviewed",
    ).length;
    const contactedRecent = requests.filter(
      (item) =>
        item.status === "Contacted" &&
        item.createdAt !== null &&
        item.createdAt.getTime() >= weekAgo,
    ).length;

    return [
      { label: "New Inquiries", value: String(newCount) },
      { label: "Pending Review", value: String(reviewedCount) },
      { label: "Contacted (7 Days)", value: String(contactedRecent) },
    ];
  }, [requests]);

  return (
    <>
      <header className="border-b border-outline-variant bg-off-white px-margin-mobile py-12 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-on-surface-variant">
                <span className="font-sans text-label-md uppercase tracking-widest">
                  Dashboard
                </span>
                <ChevronRightIcon />
                <span className="font-sans text-label-md uppercase tracking-widest text-primary">
                  Client Requests
                </span>
              </div>
              <h2 className="font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Prospective Engagements
              </h2>
              <p className="mt-2 max-w-2xl font-sans text-body-lg text-on-surface-variant">
                Review and triage inbound strategic inquiries from global
                enterprise prospects.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="w-64 border-0 border-b-2 border-outline-variant bg-transparent py-2 pl-10 pr-4 font-sans text-body-md transition-colors placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-0"
                  placeholder="Search inquiries..."
                  type="text"
                  value={queryText}
                  onChange={(event) => setQueryText(event.target.value)}
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 border border-outline-variant px-4 py-2 font-sans text-label-md uppercase text-primary transition-colors hover:border-primary"
              >
                <FilterListIcon />
                Filter
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <div className="mb-12 grid grid-cols-1 gap-gutter md:grid-cols-3">
            {summary.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden border border-outline-variant bg-pure-white p-6 transition-colors hover:border-primary"
              >
                <div className="-mr-8 -mt-8 absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-surface-container-low transition-colors group-hover:bg-primary-container" />
                <p className="mb-2 font-sans text-label-md uppercase text-on-surface-variant">
                  {item.label}
                </p>
                <p className="font-serif text-headline-md text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden border border-outline-variant bg-pure-white">
            <div className="hidden grid-cols-12 gap-4 border-b border-outline-variant bg-surface-container-lowest p-4 font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:grid">
              <div className="col-span-3">Prospect Details</div>
              <div className="col-span-3">Contact Information</div>
              <div className="col-span-2">Area of Interest</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-outline-variant">
              {loading || authLoading ? (
                <p className="p-6 font-sans text-body-md text-on-surface-variant">
                  Loading inquiries…
                </p>
              ) : null}

              {!loading && !authLoading && error ? (
                <p className="p-6 font-sans text-body-md text-error">{error}</p>
              ) : null}

              {!loading && !authLoading && !error && filtered.length === 0 ? (
                <p className="p-6 font-sans text-body-md text-on-surface-variant">
                  No contact requests yet. Submissions from Connect With Us will
                  appear here.
                </p>
              ) : null}

              {!loading &&
                !authLoading &&
                !error &&
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="group grid grid-cols-1 gap-4 p-4 transition-colors hover:bg-surface-container-low md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-3">
                      <p className="font-serif text-[20px] text-primary">
                        {item.name}
                      </p>
                      <p className="font-sans text-body-md text-on-surface-variant">
                        {item.role}
                      </p>
                    </div>
                    <div className="font-sans text-body-md md:col-span-3">
                      <p className="text-on-surface">{item.email}</p>
                      <p className="text-on-surface-variant">{item.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="inline-flex border border-outline-variant/50 bg-surface-container px-2 py-1 font-sans text-xs uppercase tracking-wider text-on-surface">
                        {item.interest}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-sans text-xs uppercase tracking-wider ${statusClass(item.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusDot(item.status)}`}
                        />
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-start gap-2 md:col-span-2 md:justify-end">
                      {item.email ? (
                        <button
                          type="button"
                          onClick={() => setReplyTarget(item)}
                          className="border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase text-on-primary transition-colors hover:bg-primary-container"
                        >
                          Reply
                        </button>
                      ) : (
                        <span
                          className="cursor-not-allowed border border-outline-variant px-4 py-2 font-sans text-label-md uppercase text-on-surface-variant opacity-50"
                          title="No email on this request"
                        >
                          Reply
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={deletingId === item.id}
                        onClick={() => void handleDelete(item)}
                        className="border border-error px-4 py-2 font-sans text-label-md uppercase text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === item.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-4">
            <p className="font-sans text-body-md text-on-surface-variant">
              Showing {filtered.length} of {requests.length} entries
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="border border-outline-variant p-2 text-on-surface-variant opacity-50"
                disabled
              >
                <ArrowBackIcon />
              </button>
              <button
                type="button"
                className="border border-outline-variant p-2 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowForwardIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {replyTarget ? (
        <ReplyEmailModal
          key={replyTarget.id}
          request={replyTarget}
          onClose={() => setReplyTarget(null)}
        />
      ) : null}
    </>
  );
}

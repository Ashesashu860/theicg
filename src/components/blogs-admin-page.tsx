"use client";

import Image from "next/image";
import Link from "next/link";
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
import {
  blogsPath,
  resolvePublicBlogSlug,
  type BlogRecord,
} from "@/lib/blogs-data";
import {
  capabilitiesPath,
  type CapabilityRecord,
} from "@/lib/capabilities-data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { AddIcon, ChevronRightIcon } from "./icons";

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function formatDate(value: Date | null): string {
  if (!value) return "—";
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isLocalImagePath(src: string): boolean {
  return src.startsWith("/");
}

function getErrorMessage(error: FirestoreError): string {
  switch (error.code) {
    case "permission-denied":
      return "Permission denied. Sign in again, and publish Firestore rules for blogs.";
    case "failed-precondition":
      return "Firestore needs an index for this query. Check the browser console for a create-index link.";
    case "unavailable":
      return "Firestore is temporarily unavailable. Please try again.";
    default:
      return error.message || "Unable to load blogs. Please try again.";
  }
}

export function BlogsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const configured = isFirebaseConfigured();
  const uid = user?.uid ?? null;
  const canSubscribe = configured && !authLoading && uid !== null;

  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [capabilities, setCapabilities] = useState<CapabilityRecord[]>([]);
  const [filterCapabilityId, setFilterCapabilityId] = useState("all");
  const [liveError, setLiveError] = useState("");
  const [actionError, setActionError] = useState("");
  const [loadedBlogsForUid, setLoadedBlogsForUid] = useState<string | null>(
    null,
  );
  const [loadedCapsForUid, setLoadedCapsForUid] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const gateError = !configured
    ? "Firebase is not configured."
    : !authLoading && !user
      ? "Sign in required to manage blogs."
      : "";
  const error = gateError || actionError || liveError;
  const loading =
    authLoading ||
    (canSubscribe &&
      (loadedBlogsForUid !== uid || loadedCapsForUid !== uid));

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const blogsQuery = query(
      collection(getFirebaseDb(), ...blogsPath()),
      orderBy("createdAt", "desc"),
    );

    const unsubscribeBlogs = onSnapshot(
      blogsQuery,
      (snapshot) => {
        setBlogs(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const title = String(data.title || "");
            return {
              id: docSnap.id,
              title,
              slug: resolvePublicBlogSlug({
                id: docSnap.id,
                title,
                slug: String(data.slug || ""),
              }),
              content: String(data.content || ""),
              capabilityId: String(data.capabilityId || ""),
              imageUrl: String(data.imageUrl || ""),
              createdAt: toDate(data.createdAt),
              updatedAt: toDate(data.updatedAt),
            } satisfies BlogRecord;
          }),
        );
        setLoadedBlogsForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError));
        setLoadedBlogsForUid(uid);
      },
    );

    const capabilitiesQuery = query(
      collection(getFirebaseDb(), ...capabilitiesPath()),
      orderBy("name", "asc"),
    );

    const unsubscribeCaps = onSnapshot(
      capabilitiesQuery,
      (snapshot) => {
        setCapabilities(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: String(data.name || ""),
              slug: String(data.slug || ""),
              description: String(data.description || ""),
              imageUrl: String(data.imageUrl || ""),
              createdAt: toDate(data.createdAt),
              updatedAt: toDate(data.updatedAt),
            } satisfies CapabilityRecord;
          }),
        );
        setLoadedCapsForUid(uid);
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError));
        setLoadedCapsForUid(uid);
      },
    );

    return () => {
      unsubscribeBlogs();
      unsubscribeCaps();
    };
  }, [canSubscribe, uid]);

  const capabilityNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const capability of capabilities) {
      map.set(capability.id, capability.name);
    }
    return map;
  }, [capabilities]);

  const filtered = useMemo(() => {
    if (filterCapabilityId === "all") {
      return blogs;
    }
    return blogs.filter((blog) => blog.capabilityId === filterCapabilityId);
  }, [blogs, filterCapabilityId]);

  async function handleDelete(item: BlogRecord) {
    if (
      !window.confirm(
        `Delete “${item.title || "this blog"}”? This cannot be undone.`,
      )
    ) {
      return;
    }

    if (!configured) {
      setActionError("Firebase is not configured.");
      return;
    }

    setDeletingId(item.id);
    setActionError("");

    try {
      await deleteDoc(doc(getFirebaseDb(), ...blogsPath(), item.id));
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this blog. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

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
                  Blogs
                </span>
              </div>
              <h2 className="font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Manage Blogs
              </h2>
              <p className="mt-2 max-w-2xl font-sans text-body-lg text-on-surface-variant">
                Publish perspectives linked to a capability category. Filter by
                category below.
              </p>
            </div>
            <Link
              href="/portal/blogs/new"
              className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
            >
              <AddIcon />
              New Blog
            </Link>
          </div>
        </div>
      </header>

      <section className="flex-1 bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterCapabilityId("all")}
              className={
                filterCapabilityId === "all"
                  ? "border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary"
                  : "border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              }
            >
              All
            </button>
            {capabilities.map((capability) => (
              <button
                key={capability.id}
                type="button"
                onClick={() => setFilterCapabilityId(capability.id)}
                className={
                  filterCapabilityId === capability.id
                    ? "border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary"
                    : "border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                }
              >
                {capability.name}
              </button>
            ))}
          </div>

          {error ? (
            <p className="mb-6 font-sans text-body-md text-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="overflow-hidden border border-outline-variant bg-pure-white">
            <div className="hidden grid-cols-12 gap-4 border-b border-outline-variant bg-surface-container-lowest p-4 font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:grid">
              <div className="col-span-2">Image</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Updated</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-outline-variant">
              {loading ? (
                <p className="p-6 font-sans text-body-md text-on-surface-variant">
                  Loading blogs…
                </p>
              ) : null}

              {!loading && !error && filtered.length === 0 ? (
                <p className="p-6 font-sans text-body-md text-on-surface-variant">
                  {blogs.length === 0
                    ? "No blogs yet. Create one to get started."
                    : "No blogs in this category."}
                </p>
              ) : null}

              {!loading &&
                filtered.map((item) => {
                  const categoryName =
                    capabilityNameById.get(item.capabilityId) ||
                    "Unknown capability";
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 gap-4 p-4 transition-colors hover:bg-surface-container-low md:grid-cols-12 md:items-center"
                    >
                      <div className="relative h-16 w-full overflow-hidden border border-outline-variant/30 bg-surface-container md:col-span-2">
                        {item.imageUrl && isLocalImagePath(item.imageUrl) ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-sans text-xs uppercase tracking-widest text-on-surface-variant">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-4">
                        <Link
                          href={`/blogs/${item.slug}`}
                          className="font-serif text-[20px] text-primary hover:text-primary-container"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="md:col-span-2">
                        <span className="inline-flex border border-outline-variant/50 bg-surface-container px-2 py-1 font-sans text-xs uppercase tracking-wider text-on-surface">
                          {categoryName}
                        </span>
                      </div>
                      <div className="font-sans text-body-md text-on-surface-variant md:col-span-2">
                        {formatDate(item.updatedAt || item.createdAt)}
                      </div>
                      <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
                        <Link
                          href={`/portal/blogs/${item.id}/edit`}
                          className="border border-primary px-4 py-2 font-sans text-label-md uppercase text-primary transition-colors hover:bg-primary hover:text-on-primary"
                        >
                          Edit
                        </Link>
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
                  );
                })}
            </div>
          </div>

          <p className="mt-6 font-sans text-body-md text-on-surface-variant">
            Showing {filtered.length} of {blogs.length} blogs
          </p>
        </div>
      </section>
    </>
  );
}

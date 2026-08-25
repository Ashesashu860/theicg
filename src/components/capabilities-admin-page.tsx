"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  type FirestoreError,
} from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import {
  CAPABILITIES_COLLECTION,
  slugifyCapabilityName,
  type CapabilityRecord,
} from "@/lib/capabilities-data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { ChevronRightIcon } from "./icons";

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function getErrorMessage(error: FirestoreError): string {
  switch (error.code) {
    case "permission-denied":
      return "Permission denied. Sign in again, and publish Firestore rules for capabilities.";
    case "failed-precondition":
      return "Firestore needs an index for this query. Check the browser console for a create-index link.";
    case "unavailable":
      return "Firestore is temporarily unavailable. Please try again.";
    default:
      return error.message || "Unable to load capabilities. Please try again.";
  }
}

function isLocalImagePath(src: string): boolean {
  return src.startsWith("/");
}

type FormState = {
  name: string;
  description: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  imageUrl: "",
};

export function CapabilitiesAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const configured = isFirebaseConfigured();
  const uid = user?.uid ?? null;
  const canSubscribe = configured && !authLoading && uid !== null;

  const [items, setItems] = useState<CapabilityRecord[]>([]);
  const [liveError, setLiveError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");

  const gateError = !configured
    ? "Firebase is not configured."
    : !authLoading && !user
      ? "Sign in required to manage capabilities."
      : "";
  const error = gateError || actionError || liveError || validationError;
  const loading = authLoading || (canSubscribe && loadedForUid !== uid);

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const capabilitiesQuery = query(
      collection(getFirebaseDb(), CAPABILITIES_COLLECTION),
      orderBy("name", "asc"),
    );

    const unsubscribe = onSnapshot(
      capabilitiesQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
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
        });
        setItems(next);
        setLoadedForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError));
        setLoadedForUid(uid);
      },
    );

    return unsubscribe;
  }, [canSubscribe, uid]);

  const existingSlugs = useMemo(
    () =>
      new Map(
        items
          .filter((item) => item.id !== editingId)
          .map((item) => [item.slug, item.id] as const),
      ),
    [editingId, items],
  );

  function uniqueSlug(baseName: string): string {
    const base = slugifyCapabilityName(baseName) || "capability";
    if (!existingSlugs.has(base)) {
      return base;
    }
    let index = 2;
    while (existingSlugs.has(`${base}-${index}`)) {
      index += 1;
    }
    return `${base}-${index}`;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setValidationError("");
  }

  function startEdit(item: CapabilityRecord) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
    });
    setActionError("");
    setSuccessMessage("");
    setValidationError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setSuccessMessage("");
    setValidationError("");

    const name = form.name.trim();
    const description = form.description.trim();
    const imageUrl = form.imageUrl.trim();

    if (!name || !description) {
      setValidationError("Capability name and description are required.");
      return;
    }

    if (!configured || !user) {
      setActionError("Sign in required to save capabilities.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        description,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        const existing = items.find((item) => item.id === editingId);
        const slug =
          existing?.slug && existing.slug.length > 0
            ? existing.slug
            : uniqueSlug(name);
        await updateDoc(
          doc(getFirebaseDb(), CAPABILITIES_COLLECTION, editingId),
          { ...payload, slug },
        );
        setSuccessMessage("Capability updated.");
      } else {
        await addDoc(collection(getFirebaseDb(), CAPABILITIES_COLLECTION), {
          ...payload,
          slug: uniqueSlug(name),
          createdAt: serverTimestamp(),
        });
        setSuccessMessage("Capability created.");
      }

      resetForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save capability. Please try again.";
      setActionError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: CapabilityRecord) {
    if (
      !window.confirm(
        `Delete “${item.name}”? Blogs linked to this capability will keep their reference and show as Unknown capability.`,
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
    setSuccessMessage("");

    try {
      await deleteDoc(doc(getFirebaseDb(), CAPABILITIES_COLLECTION, item.id));
      if (editingId === item.id) {
        resetForm();
      }
      setSuccessMessage("Capability deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this capability. Please try again.";
      setActionError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <header className="border-b border-outline-variant bg-off-white px-margin-mobile py-12 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <div className="mb-4 flex items-center gap-2 text-on-surface-variant">
            <span className="font-sans text-label-md uppercase tracking-widest">
              Dashboard
            </span>
            <ChevronRightIcon />
            <span className="font-sans text-label-md uppercase tracking-widest text-primary">
              Capabilities
            </span>
          </div>
          <h2 className="font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
            Manage Capabilities
          </h2>
          <p className="mt-2 max-w-2xl font-sans text-body-lg text-on-surface-variant">
            Create and update capability categories shown on the public site.
            Image URL is optional.
          </p>
        </div>
      </header>

      <section className="flex-1 bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="mx-auto flex max-w-container-max flex-col gap-10">
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="border border-outline-variant bg-pure-white p-6 md:p-8"
          >
            <h3 className="mb-6 font-serif text-headline-md text-primary">
              {editingId ? "Edit Capability" : "Add Capability"}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                  Capability Name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface focus:border-primary focus:outline-none"
                  placeholder="e.g. IT Services"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                  Description
                </span>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="resize-y border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface focus:border-primary focus:outline-none"
                  placeholder="Short description for cards and detail pages"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                  Image URL{" "}
                  <span className="normal-case tracking-normal text-outline">
                    (optional)
                  </span>
                </span>
                <input
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      imageUrl: event.target.value,
                    }))
                  }
                  className="border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface focus:border-primary focus:outline-none"
                  placeholder="/images/capabilities-example.jpg"
                />
              </label>

              {form.imageUrl.trim() && isLocalImagePath(form.imageUrl.trim()) ? (
                <div className="relative aspect-[1.49] overflow-hidden border border-outline-variant/30 md:col-span-1">
                  <Image
                    src={form.imageUrl.trim()}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="mt-4 font-sans text-body-md text-error" role="alert">
                {error}
              </p>
            ) : null}
            {successMessage ? (
              <p className="mt-4 font-sans text-body-md text-secondary">
                {successMessage}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || !!gateError}
                className="border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Update" : "Save"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="border border-outline-variant bg-pure-white">
            <div className="border-b border-outline-variant px-6 py-4">
              <h3 className="font-serif text-headline-md text-primary">
                All Capabilities
              </h3>
            </div>

            <div className="divide-y divide-outline-variant">
              {loading ? (
                <p className="p-6 font-sans text-body-md text-on-surface-variant">
                  Loading capabilities…
                </p>
              ) : null}

              {!loading && !gateError && !liveError && items.length === 0 ? (
                <p className="p-6 font-sans text-body-md text-on-surface-variant">
                  No capabilities yet. Add one using the form above.
                </p>
              ) : null}

              {!loading &&
                items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-4 p-4 transition-colors hover:bg-surface-container-low md:grid-cols-12 md:items-center"
                  >
                    <div className="relative h-20 w-full overflow-hidden border border-outline-variant/30 bg-surface-container md:col-span-2">
                      {item.imageUrl && isLocalImagePath(item.imageUrl) ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-sans text-xs uppercase tracking-widest text-on-surface-variant">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-6">
                      <p className="font-serif text-[20px] text-primary">
                        {item.name}
                      </p>
                      <p className="mt-1 line-clamp-2 font-sans text-body-md text-on-surface-variant">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:col-span-4 md:justify-end">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="border border-primary px-4 py-2 font-sans text-label-md uppercase text-primary transition-colors hover:bg-primary hover:text-on-primary"
                      >
                        Edit
                      </button>
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
        </div>
      </section>
    </>
  );
}

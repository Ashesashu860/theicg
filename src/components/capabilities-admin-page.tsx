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
  capabilitiesPath,
  slugifyCapabilityName,
  type CapabilityRecord,
} from "@/lib/capabilities-data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { canDisplayImageUrl, isBlobImageUrl } from "@/lib/image-url";
import { uploadContentImage } from "@/lib/storage-client";
import { toast } from "react-toastify";
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
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
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
    return () => {
      if (previewUrl && isBlobImageUrl(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const capabilitiesQuery = query(
      collection(getFirebaseDb(), ...capabilitiesPath()),
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

  function clearImagePreview() {
    setPreviewUrl("");
    setImageFile(null);
    setFileInputKey((key) => key + 1);
  }

  function resetForm() {
    clearImagePreview();
    setForm(emptyForm);
    setEditingId(null);
    setValidationError("");
  }

  function startEdit(item: CapabilityRecord) {
    clearImagePreview();
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
    });
    setActionError("");
    setValidationError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleImageFileChange(file: File | null) {
    if (!file) {
      clearImagePreview();
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearImage() {
    clearImagePreview();
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setValidationError("");

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name || !description) {
      setValidationError("Capability name and description are required.");
      toast.error("Capability name and description are required.");
      return;
    }

    if (!configured || !user) {
      setActionError("Sign in required to save capabilities.");
      toast.error("Sign in required to save capabilities.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.imageUrl.trim();
      if (imageFile) {
        imageUrl = await uploadContentImage(imageFile, "capabilities");
      }

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
          doc(getFirebaseDb(), ...capabilitiesPath(), editingId),
          { ...payload, slug },
        );
        toast.success("Capability updated.");
      } else {
        await addDoc(collection(getFirebaseDb(), ...capabilitiesPath()), {
          ...payload,
          slug: uniqueSlug(name),
          createdAt: serverTimestamp(),
        });
        toast.success("Capability created.");
      }

      resetForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save capability. Please try again.";
      setActionError(message);
      toast.error(message);
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
      toast.error("Firebase is not configured.");
      return;
    }

    setDeletingId(item.id);
    setActionError("");

    try {
      await deleteDoc(doc(getFirebaseDb(), ...capabilitiesPath(), item.id));
      if (editingId === item.id) {
        resetForm();
      }
      toast.success("Capability deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this capability. Please try again.";
      setActionError(message);
      toast.error(message);
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
            Image is optional.
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

              <div className="flex flex-col gap-2 md:col-span-2">
                <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                  Image{" "}
                  <span className="normal-case tracking-normal text-outline">
                    (optional)
                  </span>
                </span>
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) =>
                    handleImageFileChange(event.target.files?.[0] ?? null)
                  }
                  className="border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface file:mr-4 file:border-0 file:bg-transparent file:font-sans file:text-label-md file:uppercase file:tracking-widest file:text-primary focus:border-primary focus:outline-none"
                />
                {(previewUrl || form.imageUrl) && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="self-start font-sans text-sm text-on-surface-variant underline hover:text-primary"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {previewUrl ||
              (form.imageUrl.trim() &&
                canDisplayImageUrl(form.imageUrl.trim())) ? (
                <div className="relative aspect-[1.49] overflow-hidden border border-outline-variant/30 md:col-span-1">
                  {previewUrl && isBlobImageUrl(previewUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob preview
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={previewUrl || form.imageUrl.trim()}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  )}
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="mt-4 font-sans text-body-md text-error" role="alert">
                {error}
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
                      {item.imageUrl && canDisplayImageUrl(item.imageUrl) ? (
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { isBlankBlogContent } from "@/lib/blog-html";
import { blogsPath, slugifyBlogTitle } from "@/lib/blogs-data";
import {
  capabilitiesPath,
  type CapabilityRecord,
} from "@/lib/capabilities-data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { canDisplayImageUrl, isBlobImageUrl } from "@/lib/image-url";
import { uploadContentImage } from "@/lib/storage-client";
import { toast } from "react-toastify";
import { ChevronRightIcon } from "./icons";
import { RichTextEditor } from "./rich-text-editor";

type BlogFormPageProps = {
  mode: "create" | "edit";
  blogId?: string;
};

type FormState = {
  title: string;
  content: string;
  capabilityId: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  title: "",
  content: "",
  capabilityId: "",
  imageUrl: "",
};

export function BlogFormPage({ mode, blogId }: BlogFormPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const configured = isFirebaseConfigured();

  const [capabilities, setCapabilities] = useState<CapabilityRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [existingSlug, setExistingSlug] = useState("");
  const [loadingBlog, setLoadingBlog] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const gateError = !configured
    ? "Firebase is not configured."
    : !authLoading && !user
      ? "Sign in required to manage blogs."
      : "";

  useEffect(() => {
    return () => {
      if (previewUrl && isBlobImageUrl(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!configured || authLoading || !user) {
      return;
    }

    const capabilitiesQuery = query(
      collection(getFirebaseDb(), ...capabilitiesPath()),
      orderBy("name", "asc"),
    );

    return onSnapshot(capabilitiesQuery, (snapshot) => {
      setCapabilities(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ""),
            slug: String(data.slug || ""),
            description: String(data.description || ""),
            imageUrl: String(data.imageUrl || ""),
            createdAt: null,
            updatedAt: null,
          } satisfies CapabilityRecord;
        }),
      );
    });
  }, [authLoading, configured, user]);

  useEffect(() => {
    if (mode !== "edit" || !blogId || !configured || authLoading || !user) {
      return;
    }

    let cancelled = false;

    async function loadBlog() {
      setLoadingBlog(true);
      setError("");
      try {
        const snap = await getDoc(
          doc(getFirebaseDb(), ...blogsPath(), blogId!),
        );
        if (cancelled) return;
        if (!snap.exists()) {
          setError("Blog not found.");
          setLoadingBlog(false);
          return;
        }
        const data = snap.data();
        setForm({
          title: String(data.title || ""),
          content: String(data.content || ""),
          capabilityId: String(data.capabilityId || ""),
          imageUrl: String(data.imageUrl || ""),
        });
        setExistingSlug(String(data.slug || ""));
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load blog.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingBlog(false);
        }
      }
    }

    void loadBlog();
    return () => {
      cancelled = true;
    };
  }, [authLoading, blogId, configured, mode, user]);

  async function uniqueBlogSlug(
    title: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugifyBlogTitle(title) || "blog";
    let candidate = base;
    let index = 2;

    while (true) {
      const snapshot = await getDocs(
        query(
          collection(getFirebaseDb(), ...blogsPath()),
          where("slug", "==", candidate),
          limit(1),
        ),
      );
      const conflict = snapshot.docs.find((docSnap) => docSnap.id !== excludeId);
      if (!conflict) {
        return candidate;
      }
      candidate = `${base}-${index}`;
      index += 1;
    }
  }

  function clearImagePreview() {
    setPreviewUrl("");
    setImageFile(null);
    setFileInputKey((key) => key + 1);
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
    setError("");

    const title = form.title.trim();
    const content = form.content.trim();
    const capabilityId = form.capabilityId.trim();

    if (!title || isBlankBlogContent(content) || !capabilityId) {
      const message = "Title, content, and category are required.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!configured || !user) {
      const message = "Sign in required to save blogs.";
      setError(message);
      toast.error(message);
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.imageUrl.trim();
      if (imageFile) {
        imageUrl = await uploadContentImage(imageFile, "blogs");
      }

      const payload = {
        title,
        content,
        capabilityId,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (mode === "edit" && blogId) {
        const slug =
          existingSlug.length > 0
            ? existingSlug
            : await uniqueBlogSlug(title, blogId);
        await updateDoc(doc(getFirebaseDb(), ...blogsPath(), blogId), {
          ...payload,
          slug,
        });
        setExistingSlug(slug);
        clearImagePreview();
        setForm((prev) => ({ ...prev, imageUrl }));
        toast.success("Blog updated.");
      } else {
        const slug = await uniqueBlogSlug(title);
        await addDoc(collection(getFirebaseDb(), ...blogsPath()), {
          ...payload,
          slug,
          createdAt: serverTimestamp(),
        });
        clearImagePreview();
        setForm(emptyForm);
        setExistingSlug("");
        toast.success("Blog created.");
        router.push("/portal/blogs");
        return;
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save blog. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
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
            <Link
              href="/portal/blogs"
              className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary"
            >
              Blogs
            </Link>
            <ChevronRightIcon />
            <span className="font-sans text-label-md uppercase tracking-widest text-primary">
              {mode === "edit" ? "Edit" : "Create"}
            </span>
          </div>
          <h2 className="font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
            {mode === "edit" ? "Edit Blog" : "Create Blog"}
          </h2>
          <p className="mt-2 max-w-2xl font-sans text-body-lg text-on-surface-variant">
            Every blog must be linked to a capability category. Image is
            optional.
          </p>
        </div>
      </header>

      <section className="flex-1 bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="mx-auto max-w-container-max">
          {loadingBlog || authLoading ? (
            <p className="font-sans text-body-md text-on-surface-variant">
              Loading…
            </p>
          ) : (
            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="border border-outline-variant bg-pure-white p-6 md:p-8"
            >
              <div className="grid grid-cols-1 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    Blog Title
                  </span>
                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    className="border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    Category / Capability
                  </span>
                  <select
                    required
                    value={form.capabilityId}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        capabilityId: event.target.value,
                      }))
                    }
                    className="border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a capability</option>
                    {capabilities.map((capability) => (
                      <option key={capability.id} value={capability.id}>
                        {capability.name}
                      </option>
                    ))}
                    {form.capabilityId &&
                    !capabilities.some((c) => c.id === form.capabilityId) ? (
                      <option value={form.capabilityId}>
                        Unknown capability
                      </option>
                    ) : null}
                  </select>
                  {capabilities.length === 0 ? (
                    <span className="font-sans text-sm text-on-surface-variant">
                      No capabilities yet.{" "}
                      <Link
                        href="/portal/capabilities"
                        className="text-primary underline"
                      >
                        Create one first
                      </Link>
                      .
                    </span>
                  ) : null}
                </label>

                <div className="flex flex-col gap-2">
                  <span
                    id="blog-content-label"
                    className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant"
                  >
                    Blog Content
                  </span>
                  <RichTextEditor
                    value={form.content}
                    onChange={(nextContent) =>
                      setForm((prev) => ({
                        ...prev,
                        content: nextContent,
                      }))
                    }
                    disabled={!!gateError}
                    labelledBy="blog-content-label"
                  />
                </div>

                <div className="flex flex-col gap-2">
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
                  <div className="relative h-40 w-full max-w-md overflow-hidden border border-outline-variant/30">
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
                        sizes="400px"
                      />
                    )}
                  </div>
                ) : null}
              </div>

              {gateError || error ? (
                <p
                  className="mt-4 font-sans text-body-md text-error"
                  role="alert"
                >
                  {gateError || error}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving || !!gateError || capabilities.length === 0}
                  className="border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <Link
                  href="/portal/blogs"
                  className="border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  Back to list
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

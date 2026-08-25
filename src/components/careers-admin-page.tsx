"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
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
  AddIcon,
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ExpandMoreIcon,
  WorkOffIcon,
} from "@/components/icons";
import {
  careerCategoriesPath,
  careerRolesPath,
  type CareerCategoryRecord,
  type CareerRoleRecord,
} from "@/lib/careers-data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { toast } from "react-toastify";

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function getErrorMessage(error: FirestoreError, entity: string): string {
  switch (error.code) {
    case "permission-denied":
      return `Permission denied. Sign in again, and publish Firestore rules for ${entity}.`;
    case "failed-precondition":
      return "Firestore needs an index for this query. Check the browser console for a create-index link.";
    case "unavailable":
      return "Firestore is temporarily unavailable. Please try again.";
    default:
      return error.message || `Unable to load ${entity}. Please try again.`;
  }
}

type RoleFormState = {
  categoryId: string;
  title: string;
  description: string;
};

const emptyRoleForm: RoleFormState = {
  categoryId: "",
  title: "",
  description: "",
};

const inputClassName =
  "w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface outline-none transition-colors focus:border-primary disabled:opacity-60";

export function CareersAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const configured = isFirebaseConfigured();
  const uid = user?.uid ?? null;
  const canSubscribe = configured && !authLoading && uid !== null;

  const [categories, setCategories] = useState<CareerCategoryRecord[]>([]);
  const [roles, setRoles] = useState<CareerRoleRecord[]>([]);
  const [categoriesLoadedForUid, setCategoriesLoadedForUid] = useState<
    string | null
  >(null);
  const [rolesLoadedForUid, setRolesLoadedForUid] = useState<string | null>(
    null,
  );
  const [liveError, setLiveError] = useState("");
  const [actionError, setActionError] = useState("");
  const [validationError, setValidationError] = useState("");

  const [roleForm, setRoleForm] = useState<RoleFormState>(emptyRoleForm);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const [rolePendingDelete, setRolePendingDelete] =
    useState<CareerRoleRecord | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryPendingDelete, setCategoryPendingDelete] =
    useState<CareerCategoryRecord | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  const [expandedCategoryIds, setExpandedCategoryIds] = useState<
    Set<string> | null
  >(null);

  const roleFormTitleId = useId();
  const categoryFormTitleId = useId();
  const deleteRoleTitleId = useId();
  const deleteCategoryTitleId = useId();

  const gateError = !configured
    ? "Firebase is not configured."
    : !authLoading && !user
      ? "Sign in required to manage careers."
      : "";
  const error = gateError || actionError || liveError || validationError;
  const loading =
    authLoading ||
    (canSubscribe &&
      (categoriesLoadedForUid !== uid || rolesLoadedForUid !== uid));
  const anyModalOpen =
    roleFormOpen ||
    categoryFormOpen ||
    rolePendingDelete !== null ||
    categoryPendingDelete !== null;
  const anyBusy =
    savingRole ||
    savingCategory ||
    deletingRoleId !== null ||
    deletingCategoryId !== null;

  const resolvedExpandedIds = useMemo(() => {
    if (expandedCategoryIds) {
      return expandedCategoryIds;
    }
    if (categories.length > 0) {
      return new Set([categories[0].id]);
    }
    return new Set<string>();
  }, [expandedCategoryIds, categories]);

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const categoriesQuery = query(
      collection(getFirebaseDb(), ...careerCategoriesPath()),
      orderBy("order", "asc"),
    );

    const unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ""),
            order: typeof data.order === "number" ? data.order : 0,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
          } satisfies CareerCategoryRecord;
        });
        setCategories(next);
        setCategoriesLoadedForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError, "career categories"));
        setCategoriesLoadedForUid(uid);
      },
    );

    return unsubscribe;
  }, [canSubscribe, uid]);

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const rolesQuery = query(
      collection(getFirebaseDb(), ...careerRolesPath()),
      orderBy("title", "asc"),
    );

    const unsubscribe = onSnapshot(
      rolesQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: String(data.title || ""),
            description: String(data.description || ""),
            categoryId: String(data.categoryId || ""),
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
          } satisfies CareerRoleRecord;
        });
        setRoles(next);
        setRolesLoadedForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError, "career roles"));
        setRolesLoadedForUid(uid);
      },
    );

    return unsubscribe;
  }, [canSubscribe, uid]);

  useEffect(() => {
    if (!anyModalOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || anyBusy) return;

      if (categoryPendingDelete) {
        setCategoryPendingDelete(null);
        return;
      }
      if (rolePendingDelete) {
        setRolePendingDelete(null);
        return;
      }
      if (categoryFormOpen) {
        setCategoryFormOpen(false);
        setCategoryName("");
        setEditingCategoryId(null);
        setValidationError("");
        return;
      }
      if (roleFormOpen) {
        setRoleFormOpen(false);
        setRoleForm(emptyRoleForm);
        setEditingRoleId(null);
        setValidationError("");
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    anyModalOpen,
    anyBusy,
    categoryPendingDelete,
    rolePendingDelete,
    categoryFormOpen,
    roleFormOpen,
  ]);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.id, category.name);
    }
    return map;
  }, [categories]);

  const rolesByCategoryId = useMemo(() => {
    const map = new Map<string, CareerRoleRecord[]>();
    for (const role of roles) {
      const list = map.get(role.categoryId) ?? [];
      list.push(role);
      map.set(role.categoryId, list);
    }
    return map;
  }, [roles]);

  const orphanRoles = useMemo(
    () => roles.filter((role) => !categoryNameById.has(role.categoryId)),
    [roles, categoryNameById],
  );

  function resetRoleForm() {
    setRoleForm(emptyRoleForm);
    setEditingRoleId(null);
    setValidationError("");
  }

  function closeRoleFormModal() {
    if (savingRole) return;
    setRoleFormOpen(false);
    resetRoleForm();
  }

  function openCreateRoleModal() {
    resetRoleForm();
    setActionError("");
    setRoleForm({
      categoryId: categories[0]?.id ?? "",
      title: "",
      description: "",
    });
    setRoleFormOpen(true);
  }

  function openEditRoleModal(role: CareerRoleRecord) {
    setEditingRoleId(role.id);
    setRoleForm({
      categoryId: role.categoryId,
      title: role.title,
      description: role.description,
    });
    setActionError("");
    setValidationError("");
    setRoleFormOpen(true);
  }

  function resetCategoryForm() {
    setCategoryName("");
    setEditingCategoryId(null);
    setValidationError("");
  }

  function closeCategoryFormModal() {
    if (savingCategory) return;
    setCategoryFormOpen(false);
    resetCategoryForm();
  }

  function openCreateCategoryModal() {
    resetCategoryForm();
    setActionError("");
    setCategoryFormOpen(true);
  }

  function openEditCategoryModal(category: CareerCategoryRecord) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setActionError("");
    setValidationError("");
    setCategoryFormOpen(true);
  }

  function toggleCategory(categoryId: string) {
    setExpandedCategoryIds((prev) => {
      const base =
        prev ??
        (categories.length > 0 ? new Set([categories[0].id]) : new Set());
      const next = new Set(base);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setValidationError("");

    const name = categoryName.trim();
    if (!name) {
      const message = "Category name is required.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (!configured || !user) {
      setActionError("Sign in required to save categories.");
      toast.error("Sign in required to save categories.");
      return;
    }

    setSavingCategory(true);

    try {
      if (editingCategoryId) {
        await updateDoc(
          doc(getFirebaseDb(), ...careerCategoriesPath(), editingCategoryId),
          {
            name,
            updatedAt: serverTimestamp(),
          },
        );
        toast.success("Category updated.");
      } else {
        await addDoc(collection(getFirebaseDb(), ...careerCategoriesPath()), {
          name,
          order: categories.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("Category created.");
      }

      setCategoryFormOpen(false);
      resetCategoryForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save category. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleConfirmDeleteCategory() {
    if (!categoryPendingDelete) return;

    if (!configured) {
      setActionError("Firebase is not configured.");
      toast.error("Firebase is not configured.");
      return;
    }

    const categoryRoles =
      rolesByCategoryId.get(categoryPendingDelete.id) ?? [];
    if (categoryRoles.length > 0) {
      const message =
        "Delete or move all roles in this category before deleting it.";
      setActionError(message);
      toast.error(message);
      setCategoryPendingDelete(null);
      return;
    }

    const category = categoryPendingDelete;
    setDeletingCategoryId(category.id);
    setActionError("");

    try {
      await deleteDoc(
        doc(getFirebaseDb(), ...careerCategoriesPath(), category.id),
      );
      if (editingCategoryId === category.id) {
        closeCategoryFormModal();
      }
      setCategoryPendingDelete(null);
      toast.success("Category deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this category. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setDeletingCategoryId(null);
    }
  }

  async function handleRoleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setValidationError("");

    const categoryId = roleForm.categoryId.trim();
    const title = roleForm.title.trim();
    const description = roleForm.description.trim();

    if (!categoryId || !title || !description) {
      const message = "Category, role title, and description are required.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (!categoryNameById.has(categoryId)) {
      const message = "Select a valid career category.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (!configured || !user) {
      setActionError("Sign in required to save career roles.");
      toast.error("Sign in required to save career roles.");
      return;
    }

    setSavingRole(true);

    try {
      const payload = {
        title,
        description,
        categoryId,
        updatedAt: serverTimestamp(),
      };

      if (editingRoleId) {
        await updateDoc(
          doc(getFirebaseDb(), ...careerRolesPath(), editingRoleId),
          payload,
        );
        toast.success("Career role updated.");
      } else {
        await addDoc(collection(getFirebaseDb(), ...careerRolesPath()), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Career role created.");
      }

      setRoleFormOpen(false);
      resetRoleForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save career role. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setSavingRole(false);
    }
  }

  async function handleConfirmDeleteRole() {
    if (!rolePendingDelete) return;

    if (!configured) {
      setActionError("Firebase is not configured.");
      toast.error("Firebase is not configured.");
      return;
    }

    const role = rolePendingDelete;
    setDeletingRoleId(role.id);
    setActionError("");

    try {
      await deleteDoc(doc(getFirebaseDb(), ...careerRolesPath(), role.id));
      if (editingRoleId === role.id) {
        closeRoleFormModal();
      }
      setRolePendingDelete(null);
      toast.success("Career role deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this career role. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setDeletingRoleId(null);
    }
  }

  function renderRoleRow(role: CareerRoleRecord) {
    const categoryLabel =
      categoryNameById.get(role.categoryId) || "Unknown category";

    return (
      <div
        key={role.id}
        className="grid grid-cols-1 gap-3 border-t border-outline-variant/40 px-4 py-4 transition-colors hover:bg-surface-container-low md:grid-cols-12 md:items-center md:gap-4 md:px-6"
      >
        <div className="md:col-span-3">
          <p className="font-sans text-sm font-semibold text-primary md:hidden">
            Role Title
          </p>
          <p className="font-sans text-body-md font-semibold text-on-surface">
            {role.title}
          </p>
        </div>
        <div className="hidden md:col-span-4 md:block">
          <p className="line-clamp-2 font-sans text-body-md text-on-surface-variant">
            {role.description}
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="font-sans text-sm font-semibold text-primary md:hidden">
            Category
          </p>
          <p className="font-sans text-body-md text-on-surface-variant">
            {categoryLabel}
          </p>
          <p className="mt-2 line-clamp-3 font-sans text-body-md text-on-surface-variant md:hidden">
            {role.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
          <button
            type="button"
            onClick={() => openEditRoleModal(role)}
            className="inline-flex items-center gap-1 border border-primary px-3 py-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
            aria-label={`Edit ${role.title}`}
          >
            <EditIcon />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setRolePendingDelete(role)}
            className="inline-flex items-center gap-1 border border-error px-3 py-2 font-sans text-label-md uppercase tracking-widest text-error transition-colors hover:bg-error-container hover:text-on-error-container"
            aria-label={`Delete ${role.title}`}
          >
            <DeleteIcon />
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-outline-variant bg-off-white px-margin-mobile py-12 md:px-margin-desktop">
        <div className="mx-auto flex max-w-container-max flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-on-surface-variant">
              <span className="font-sans text-label-md uppercase tracking-widest">
                Dashboard
              </span>
              <ChevronRightIcon />
              <span className="font-sans text-label-md uppercase tracking-widest text-primary">
                Careers
              </span>
            </div>
            <h2 className="font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              Careers
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-body-lg text-on-surface-variant">
              Create categories, then add career roles under each category.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCreateCategoryModal}
              disabled={!!gateError}
              className="inline-flex items-center justify-center gap-2 border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AddIcon />
              Add Category
            </button>
            <button
              type="button"
              onClick={openCreateRoleModal}
              disabled={!!gateError || categories.length === 0}
              className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AddIcon />
              Add Career Role
            </button>
          </div>
        </div>
      </header>

      <section className="flex-1 bg-surface p-margin-mobile md:p-margin-desktop">
        <div className="mx-auto flex max-w-container-max flex-col gap-8">
          {error && !anyModalOpen ? (
            <p className="font-sans text-body-md text-error" role="alert">
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="font-sans text-body-md text-on-surface-variant">
              Loading careers…
            </p>
          ) : null}

          {!loading && !gateError && categories.length === 0 ? (
            <div className="border border-outline-variant bg-pure-white px-6 py-16 text-center md:px-16">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                <WorkOffIcon />
              </div>
              <h3 className="font-serif text-headline-md text-primary">
                No career categories yet
              </h3>
              <p className="mx-auto mt-3 max-w-lg font-sans text-body-md text-on-surface-variant">
                Create a category first, then add career roles under it.
              </p>
              <button
                type="button"
                onClick={openCreateCategoryModal}
                className="mt-8 border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
              >
                Add Category
              </button>
            </div>
          ) : null}

          {!loading && categories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {roles.length === 0 ? (
                <p className="font-sans text-body-md text-on-surface-variant">
                  No career roles yet. Use Add Career Role to create the first
                  opening.
                </p>
              ) : null}

              {categories.map((category) => {
                const categoryRoles = rolesByCategoryId.get(category.id) ?? [];
                const expanded = resolvedExpandedIds.has(category.id);

                return (
                  <div
                    key={category.id}
                    className="border border-outline-variant bg-pure-white"
                  >
                    <div className="flex items-center gap-2 px-4 py-3 md:px-6">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="flex min-w-0 flex-1 items-center justify-between gap-4 py-1 text-left transition-colors hover:text-primary"
                        aria-expanded={expanded}
                      >
                        <span className="font-serif text-[22px] text-primary md:text-headline-md">
                          {category.name}{" "}
                          <span className="font-sans text-body-md text-on-surface-variant">
                            ({categoryRoles.length})
                          </span>
                        </span>
                        <ExpandMoreIcon
                          className={`shrink-0 text-on-surface-variant transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditCategoryModal(category)}
                        className="inline-flex items-center gap-1 border border-primary px-3 py-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
                        aria-label={`Edit category ${category.name}`}
                      >
                        <EditIcon />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryPendingDelete(category)}
                        className="inline-flex items-center gap-1 border border-error px-3 py-2 font-sans text-label-md uppercase tracking-widest text-error transition-colors hover:bg-error-container hover:text-on-error-container"
                        aria-label={`Delete category ${category.name}`}
                      >
                        <DeleteIcon />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>

                    {expanded ? (
                      <div>
                        <div className="hidden border-t border-outline-variant/40 px-6 py-3 md:grid md:grid-cols-12 md:gap-4">
                          <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:col-span-3">
                            Role Title
                          </span>
                          <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:col-span-4">
                            Description
                          </span>
                          <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:col-span-3">
                            Category
                          </span>
                          <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:col-span-2 md:text-right">
                            Actions
                          </span>
                        </div>

                        {categoryRoles.length === 0 ? (
                          <p className="border-t border-outline-variant/40 px-4 py-6 font-sans text-body-md text-on-surface-variant md:px-6">
                            No roles in this category yet.
                          </p>
                        ) : (
                          categoryRoles.map((role) => renderRoleRow(role))
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {orphanRoles.length > 0 ? (
                <div className="border border-outline-variant bg-pure-white">
                  <div className="px-4 py-4 md:px-6">
                    <h3 className="font-serif text-[22px] text-primary md:text-headline-md">
                      Uncategorized{" "}
                      <span className="font-sans text-body-md text-on-surface-variant">
                        ({orphanRoles.length})
                      </span>
                    </h3>
                  </div>
                  {orphanRoles.map((role) => renderRoleRow(role))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {categoryFormOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
          role="presentation"
          onClick={closeCategoryFormModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={categoryFormTitleId}
            className="w-full max-w-lg border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 py-5">
              <h2
                id={categoryFormTitleId}
                className="font-serif text-headline-md text-primary"
              >
                {editingCategoryId ? "Edit Category" : "Add Category"}
              </h2>
              <button
                type="button"
                onClick={closeCategoryFormModal}
                disabled={savingCategory}
                className="text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={(event) => void handleCategorySubmit(event)}>
              <div className="space-y-5 px-6 py-6">
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    Category Name
                  </span>
                  <input
                    required
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    disabled={savingCategory}
                    className={inputClassName}
                    placeholder="e.g. Engineering"
                    autoFocus
                  />
                </label>

                {validationError || actionError ? (
                  <p className="font-sans text-body-md text-error" role="alert">
                    {validationError || actionError}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
                <button
                  type="button"
                  onClick={closeCategoryFormModal}
                  disabled={savingCategory}
                  className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory || !!gateError}
                  className="border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingCategory ? "Saving…" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {roleFormOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
          role="presentation"
          onClick={closeRoleFormModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={roleFormTitleId}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 py-5">
              <h2
                id={roleFormTitleId}
                className="font-serif text-headline-md text-primary"
              >
                {editingRoleId ? "Edit Career Role" : "Add Career Role"}
              </h2>
              <button
                type="button"
                onClick={closeRoleFormModal}
                disabled={savingRole}
                className="text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            <form
              onSubmit={(event) => void handleRoleSubmit(event)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="space-y-5 overflow-y-auto px-6 py-6">
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    Category
                  </span>
                  <select
                    required
                    value={roleForm.categoryId}
                    onChange={(event) =>
                      setRoleForm((prev) => ({
                        ...prev,
                        categoryId: event.target.value,
                      }))
                    }
                    disabled={savingRole}
                    className={inputClassName}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    Role Title
                  </span>
                  <input
                    required
                    value={roleForm.title}
                    onChange={(event) =>
                      setRoleForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    disabled={savingRole}
                    className={inputClassName}
                    placeholder="e.g. Senior Data Architect"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    Description
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={roleForm.description}
                    onChange={(event) =>
                      setRoleForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    disabled={savingRole}
                    className={`${inputClassName} resize-y`}
                    placeholder="Brief description of the role"
                  />
                </label>

                {validationError || actionError ? (
                  <p className="font-sans text-body-md text-error" role="alert">
                    {validationError || actionError}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
                <button
                  type="button"
                  onClick={closeRoleFormModal}
                  disabled={savingRole}
                  className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRole || !!gateError}
                  className="border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingRole ? "Saving…" : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {categoryPendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
          role="presentation"
          onClick={() => {
            if (!deletingCategoryId) setCategoryPendingDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteCategoryTitleId}
            className="w-full max-w-md border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-error-container text-error">
                <DeleteIcon />
              </div>
              <h2
                id={deleteCategoryTitleId}
                className="font-serif text-headline-md text-primary"
              >
                Delete category?
              </h2>
              <p className="mt-3 font-sans text-body-md text-on-surface-variant">
                This permanently removes “{categoryPendingDelete.name}”. Delete
                or move its roles first if any remain.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
              <button
                type="button"
                onClick={() => setCategoryPendingDelete(null)}
                disabled={deletingCategoryId === categoryPendingDelete.id}
                className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDeleteCategory()}
                disabled={deletingCategoryId === categoryPendingDelete.id}
                className="border border-error bg-error px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingCategoryId === categoryPendingDelete.id
                  ? "Deleting…"
                  : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {rolePendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
          role="presentation"
          onClick={() => {
            if (!deletingRoleId) setRolePendingDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteRoleTitleId}
            className="w-full max-w-md border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-error-container text-error">
                <DeleteIcon />
              </div>
              <h2
                id={deleteRoleTitleId}
                className="font-serif text-headline-md text-primary"
              >
                Delete career role?
              </h2>
              <p className="mt-3 font-sans text-body-md text-on-surface-variant">
                This permanently removes “{rolePendingDelete.title}” from the
                portal. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
              <button
                type="button"
                onClick={() => setRolePendingDelete(null)}
                disabled={deletingRoleId === rolePendingDelete.id}
                className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDeleteRole()}
                disabled={deletingRoleId === rolePendingDelete.id}
                className="border border-error bg-error px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingRoleId === rolePendingDelete.id
                  ? "Deleting…"
                  : "Delete Role"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

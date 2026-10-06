"use client";

import Image from "next/image";
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
  writeBatch,
  type FirestoreError,
} from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ExpandMoreIcon,
  GroupOffIcon,
} from "@/components/icons";
import { getNameInitial } from "@/components/user-avatar";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { canDisplayImageUrl, isBlobImageUrl } from "@/lib/image-url";
import { deleteContentImage, uploadContentImage } from "@/lib/storage-client";
import {
  compareTeamMembersByOrder,
  isTeamMemberStatus,
  readTeamMemberOrder,
  TEAM_STATUSES,
  teamDesignationsPath,
  teamMembersPath,
  type TeamDesignationRecord,
  type TeamMemberRecord,
  type TeamMemberStatus,
} from "@/lib/teams-data";
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

type MemberFormState = {
  fullName: string;
  department: string;
  designationId: string;
  email: string;
  phone: string;
  status: TeamMemberStatus;
  imageUrl: string;
  bio: string;
};

const emptyMemberForm: MemberFormState = {
  fullName: "",
  department: "",
  designationId: "",
  email: "",
  phone: "",
  status: "Active",
  imageUrl: "",
  bio: "",
};

const inputClassName =
  "w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-2 font-sans text-body-lg text-on-surface outline-none transition-colors focus:border-primary disabled:opacity-60";

export function TeamsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const configured = isFirebaseConfigured();
  const uid = user?.uid ?? null;
  const canSubscribe = configured && !authLoading && uid !== null;

  const [designations, setDesignations] = useState<TeamDesignationRecord[]>([]);
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [designationsLoadedForUid, setDesignationsLoadedForUid] = useState<
    string | null
  >(null);
  const [membersLoadedForUid, setMembersLoadedForUid] = useState<string | null>(
    null,
  );
  const [liveError, setLiveError] = useState("");
  const [actionError, setActionError] = useState("");
  const [validationError, setValidationError] = useState("");

  const [memberForm, setMemberForm] = useState<MemberFormState>(emptyMemberForm);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [savingMember, setSavingMember] = useState(false);
  const [movingMemberId, setMovingMemberId] = useState<string | null>(null);
  const [memberPendingDelete, setMemberPendingDelete] =
    useState<TeamMemberRecord | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const [designationName, setDesignationName] = useState("");
  const [designationFormOpen, setDesignationFormOpen] = useState(false);
  const [editingDesignationId, setEditingDesignationId] = useState<
    string | null
  >(null);
  const [savingDesignation, setSavingDesignation] = useState(false);
  const [designationPendingDelete, setDesignationPendingDelete] =
    useState<TeamDesignationRecord | null>(null);
  const [deletingDesignationId, setDeletingDesignationId] = useState<
    string | null
  >(null);

  const memberFormTitleId = useId();
  const designationFormTitleId = useId();
  const deleteMemberTitleId = useId();
  const deleteDesignationTitleId = useId();

  const gateError = !configured
    ? "Firebase is not configured."
    : !authLoading && !user
      ? "Sign in required to manage teams."
      : "";
  const error = gateError || actionError || liveError || validationError;
  const loading =
    authLoading ||
    (canSubscribe &&
      (designationsLoadedForUid !== uid || membersLoadedForUid !== uid));
  const anyModalOpen =
    memberFormOpen ||
    designationFormOpen ||
    memberPendingDelete !== null ||
    designationPendingDelete !== null;
  const anyBusy =
    savingMember ||
    savingDesignation ||
    deletingMemberId !== null ||
    deletingDesignationId !== null;

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const designationsQuery = query(
      collection(getFirebaseDb(), ...teamDesignationsPath()),
      orderBy("order", "asc"),
    );

    const unsubscribe = onSnapshot(
      designationsQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ""),
            order: typeof data.order === "number" ? data.order : 0,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
          } satisfies TeamDesignationRecord;
        });
        setDesignations(next);
        setDesignationsLoadedForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError, "team designations"));
        setDesignationsLoadedForUid(uid);
      },
    );

    return unsubscribe;
  }, [canSubscribe, uid]);

  useEffect(() => {
    if (!canSubscribe || uid === null) {
      return;
    }

    const membersQuery = query(
      collection(getFirebaseDb(), ...teamMembersPath()),
    );

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            fullName: String(data.fullName || ""),
            department: String(data.department || ""),
            designationId: String(data.designationId || ""),
            designation: String(data.designation || ""),
            imageUrl: String(data.imageUrl || ""),
            bio: String(data.bio || ""),
            email: String(data.email || ""),
            phone: String(data.phone || ""),
            status: isTeamMemberStatus(data.status) ? data.status : "Active",
            order: readTeamMemberOrder(data.order),
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
          } satisfies TeamMemberRecord;
        });
        next.sort(compareTeamMembersByOrder);
        setMembers(next);
        setMembersLoadedForUid(uid);
        setLiveError("");
      },
      (snapshotError) => {
        setLiveError(getErrorMessage(snapshotError, "team members"));
        setMembersLoadedForUid(uid);
      },
    );

    return unsubscribe;
  }, [canSubscribe, uid]);

  useEffect(() => {
    return () => {
      if (previewUrl && isBlobImageUrl(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!anyModalOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || anyBusy) return;

      if (designationPendingDelete) {
        setDesignationPendingDelete(null);
        return;
      }
      if (memberPendingDelete) {
        setMemberPendingDelete(null);
        return;
      }
      if (designationFormOpen) {
        setDesignationFormOpen(false);
        setDesignationName("");
        setEditingDesignationId(null);
        setValidationError("");
        return;
      }
      if (memberFormOpen) {
        setMemberFormOpen(false);
        setMemberForm(emptyMemberForm);
        setEditingMemberId(null);
        setValidationError("");
        setPreviewUrl("");
        setImageFile(null);
        setFileInputKey((key) => key + 1);
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
    designationPendingDelete,
    memberPendingDelete,
    designationFormOpen,
    memberFormOpen,
  ]);

  const designationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const designation of designations) {
      map.set(designation.id, designation.name);
    }
    return map;
  }, [designations]);

  const membersByDesignationId = useMemo(() => {
    const map = new Map<string, TeamMemberRecord[]>();
    for (const member of members) {
      const list = map.get(member.designationId) ?? [];
      list.push(member);
      map.set(member.designationId, list);
    }
    return map;
  }, [members]);

  function memberDesignationLabel(member: TeamMemberRecord): string {
    return (
      designationNameById.get(member.designationId) ||
      member.designation ||
      "Unknown designation"
    );
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

  function clearMemberImage() {
    clearImagePreview();
    setMemberForm((prev) => ({ ...prev, imageUrl: "" }));
  }

  function resetMemberForm() {
    clearImagePreview();
    setMemberForm(emptyMemberForm);
    setEditingMemberId(null);
    setValidationError("");
  }

  function closeMemberFormModal() {
    if (savingMember) return;
    setMemberFormOpen(false);
    resetMemberForm();
  }

  function openCreateMemberModal() {
    resetMemberForm();
    setActionError("");
    setMemberForm({
      ...emptyMemberForm,
      designationId: designations[0]?.id ?? "",
    });
    setMemberFormOpen(true);
  }

  function openEditMemberModal(member: TeamMemberRecord) {
    clearImagePreview();
    setEditingMemberId(member.id);
    setMemberForm({
      fullName: member.fullName,
      department: member.department,
      designationId: member.designationId,
      email: member.email,
      phone: member.phone,
      status: member.status,
      imageUrl: member.imageUrl,
      bio: member.bio,
    });
    setActionError("");
    setValidationError("");
    setMemberFormOpen(true);
  }

  function resetDesignationForm() {
    setDesignationName("");
    setEditingDesignationId(null);
    setValidationError("");
  }

  function closeDesignationFormModal() {
    if (savingDesignation) return;
    setDesignationFormOpen(false);
    resetDesignationForm();
  }

  function openCreateDesignationModal() {
    resetDesignationForm();
    setActionError("");
    setDesignationFormOpen(true);
  }

  function openEditDesignationModal(designation: TeamDesignationRecord) {
    setEditingDesignationId(designation.id);
    setDesignationName(designation.name);
    setActionError("");
    setValidationError("");
    setDesignationFormOpen(true);
  }

  async function handleDesignationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setValidationError("");

    const name = designationName.trim();
    if (!name) {
      const message = "Designation name is required.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    const duplicate = designations.some(
      (designation) =>
        designation.id !== editingDesignationId &&
        designation.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      const message = "A designation with this name already exists.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (!configured || !user) {
      setActionError("Sign in required to save designations.");
      toast.error("Sign in required to save designations.");
      return;
    }

    setSavingDesignation(true);

    try {
      if (editingDesignationId) {
        await updateDoc(
          doc(
            getFirebaseDb(),
            ...teamDesignationsPath(),
            editingDesignationId,
          ),
          {
            name,
            updatedAt: serverTimestamp(),
          },
        );
        toast.success("Designation updated.");
      } else {
        await addDoc(collection(getFirebaseDb(), ...teamDesignationsPath()), {
          name,
          order: designations.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("Designation created.");
      }

      setDesignationFormOpen(false);
      resetDesignationForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save designation. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setSavingDesignation(false);
    }
  }

  async function handleConfirmDeleteDesignation() {
    if (!designationPendingDelete) return;

    if (!configured) {
      setActionError("Firebase is not configured.");
      toast.error("Firebase is not configured.");
      return;
    }

    const assigned = membersByDesignationId.get(designationPendingDelete.id) ?? [];
    if (assigned.length > 0) {
      const message =
        "Move or delete team members with this designation before deleting it.";
      setActionError(message);
      toast.error(message);
      setDesignationPendingDelete(null);
      return;
    }

    const designation = designationPendingDelete;
    setDeletingDesignationId(designation.id);
    setActionError("");

    try {
      await deleteDoc(
        doc(getFirebaseDb(), ...teamDesignationsPath(), designation.id),
      );
      if (editingDesignationId === designation.id) {
        closeDesignationFormModal();
      }
      setDesignationPendingDelete(null);
      toast.success("Designation deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this designation. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setDeletingDesignationId(null);
    }
  }

  async function handleMemberSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    setValidationError("");

    const fullName = memberForm.fullName.trim();
    const department = memberForm.department.trim();
    const designationId = memberForm.designationId.trim();
    const email = memberForm.email.trim();
    const phone = memberForm.phone.trim();
    const { status } = memberForm;
    const designation = designationNameById.get(designationId) || "";

    if (!fullName || !department || !designationId || !designation || !status) {
      const message = "Name, department, designation, and status are required.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const message = "Enter a valid email address, or leave it blank.";
      setValidationError(message);
      toast.error(message);
      return;
    }

    if (!configured || !user) {
      setActionError("Sign in required to save team members.");
      toast.error("Sign in required to save team members.");
      return;
    }

    setSavingMember(true);

    try {
      let imageUrl = memberForm.imageUrl.trim();
      if (imageFile) {
        imageUrl = await uploadContentImage(imageFile, "teams");
      }

      const existingOrder = editingMemberId
        ? members.find((member) => member.id === editingMemberId)?.order
        : undefined;
      const order =
        typeof existingOrder === "number" &&
        existingOrder < Number.MAX_SAFE_INTEGER
          ? existingOrder
          : members.reduce((max, member) => {
              if (member.order >= Number.MAX_SAFE_INTEGER) return max;
              return Math.max(max, member.order);
            }, -1) + 1;

      const payload = {
        fullName,
        department,
        designationId,
        designation,
        imageUrl,
        email,
        phone,
        status,
        bio: memberForm.bio.trim(),
        order,
        updatedAt: serverTimestamp(),
      };

      if (editingMemberId) {
        await updateDoc(
          doc(getFirebaseDb(), ...teamMembersPath(), editingMemberId),
          payload,
        );
        toast.success("Team member updated.");
      } else {
        await addDoc(collection(getFirebaseDb(), ...teamMembersPath()), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Team member added.");
      }

      setMemberFormOpen(false);
      resetMemberForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this team member. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setSavingMember(false);
    }
  }

  async function moveMember(memberId: string, direction: -1 | 1) {
    const index = members.findIndex((member) => member.id === memberId);
    const nextIndex = index + direction;
    const member = members[index];
    const neighbor = members[nextIndex];
    if (!member || !neighbor || movingMemberId) return;

    let memberOrder = member.order;
    let neighborOrder = neighbor.order;
    if (memberOrder === neighborOrder) {
      memberOrder = index;
      neighborOrder = nextIndex;
    }

    setMovingMemberId(memberId);
    setActionError("");

    try {
      const batch = writeBatch(getFirebaseDb());
      batch.update(doc(getFirebaseDb(), ...teamMembersPath(), member.id), {
        order: neighborOrder,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(getFirebaseDb(), ...teamMembersPath(), neighbor.id), {
        order: memberOrder,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (moveError) {
      const message =
        moveError instanceof Error
          ? moveError.message
          : "Unable to reorder this team member. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setMovingMemberId(null);
    }
  }

  async function handleConfirmDeleteMember() {
    if (!memberPendingDelete) return;

    if (!configured) {
      setActionError("Firebase is not configured.");
      toast.error("Firebase is not configured.");
      return;
    }

    const member = memberPendingDelete;
    setDeletingMemberId(member.id);
    setActionError("");

    try {
      await deleteContentImage(member.imageUrl, "teams");
      await deleteDoc(doc(getFirebaseDb(), ...teamMembersPath(), member.id));
      if (editingMemberId === member.id) {
        closeMemberFormModal();
      }
      setMemberPendingDelete(null);
      toast.success("Team member deleted.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this team member. Please try again.";
      setActionError(message);
      toast.error(message);
    } finally {
      setDeletingMemberId(null);
    }
  }

  return (
    <>
      <header className="border-b border-outline-variant bg-surface px-margin-mobile py-12 md:px-margin-desktop">
        <div className="mx-auto flex max-w-container-max flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-headline-lg-mobile text-primary md:text-headline-lg">
              Teams
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-body-lg text-on-surface-variant">
              Manage your organization&apos;s talent and division members.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCreateDesignationModal}
              disabled={!!gateError}
              className="inline-flex items-center justify-center gap-2 border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AddIcon />
              Add Designation
            </button>
            <button
              type="button"
              onClick={openCreateMemberModal}
              disabled={!!gateError || designations.length === 0}
              className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:shadow-[inset_0_-4px_0_0_var(--color-secondary-fixed)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AddIcon />
              Add Team Member
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
              Loading teams…
            </p>
          ) : null}

          {!loading && !gateError && designations.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-outline-variant bg-pure-white px-6 py-16 text-center md:px-16">
              <div className="mb-4 text-outline-variant">
                <GroupOffIcon />
              </div>
              <h3 className="text-headline-md text-primary">
                No designations yet
              </h3>
              <p className="mx-auto mt-2 max-w-md font-sans text-body-lg text-on-surface-variant">
                Create a designation first, then add team members under it.
              </p>
              <button
                type="button"
                onClick={openCreateDesignationModal}
                className="mt-6 border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:border-primary"
              >
                Add Designation
              </button>
            </div>
          ) : null}

          {!loading && designations.length > 0 ? (
            <div className="border border-outline-variant bg-pure-white">
              <div className="border-b border-outline-variant px-6 py-4">
                <h3 className="text-[22px] text-primary md:text-headline-md">
                  Designations
                </h3>
              </div>
              <ul>
                {designations.map((designation) => {
                  const assigned =
                    membersByDesignationId.get(designation.id) ?? [];
                  return (
                    <li
                      key={designation.id}
                      className="flex items-center gap-3 border-t border-outline-variant/40 px-4 py-4 first:border-t-0 md:px-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-body-lg font-semibold text-on-surface">
                          {designation.name}
                        </p>
                        <p className="font-sans text-body-md text-on-surface-variant">
                          {assigned.length}{" "}
                          {assigned.length === 1 ? "member" : "members"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditDesignationModal(designation)}
                        className="text-secondary transition-colors hover:text-primary"
                        aria-label={`Edit designation ${designation.name}`}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDesignationPendingDelete(designation)
                        }
                        className="text-secondary transition-colors hover:text-error"
                        aria-label={`Delete designation ${designation.name}`}
                      >
                        <DeleteIcon />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {!loading && designations.length > 0 && members.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-outline-variant bg-pure-white px-6 py-16 text-center md:px-16">
              <div className="mb-4 text-outline-variant">
                <GroupOffIcon />
              </div>
              <h3 className="text-headline-md text-primary">
                No Team Members Found
              </h3>
              <p className="mx-auto mt-2 max-w-md font-sans text-body-lg text-on-surface-variant">
                The organization directory is currently empty. Begin by adding
                division members to populate the hierarchy.
              </p>
              <button
                type="button"
                onClick={openCreateMemberModal}
                className="mt-6 border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:border-primary"
              >
                Add First Member
              </button>
            </div>
          ) : null}

          {!loading && members.length > 0 ? (
            <div className="overflow-x-auto border border-outline-variant bg-pure-white">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low/50">
                    <th className="px-6 py-4 font-sans text-label-md uppercase tracking-widest text-secondary">
                      Name
                    </th>
                    <th className="px-6 py-4 font-sans text-label-md uppercase tracking-widest text-secondary">
                      Department
                    </th>
                    <th className="px-6 py-4 font-sans text-label-md uppercase tracking-widest text-secondary">
                      Designation
                    </th>
                    <th className="px-6 py-4 font-sans text-label-md uppercase tracking-widest text-secondary">
                      Bio
                    </th>
                    <th className="hidden px-6 py-4 font-sans text-label-md uppercase tracking-widest text-secondary sm:table-cell">
                      Contact
                    </th>
                    <th className="px-6 py-4 font-sans text-label-md uppercase tracking-widest text-secondary">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-sans text-label-md uppercase tracking-widest text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr
                      key={member.id}
                      className="border-b border-outline-variant transition-colors last:border-b-0 hover:bg-surface-container-low"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-outline-variant bg-surface-container font-sans text-label-md font-semibold text-primary">
                            {member.imageUrl &&
                            canDisplayImageUrl(member.imageUrl) ? (
                              <Image
                                src={member.imageUrl}
                                alt={member.fullName}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getNameInitial(member.fullName, member.email)
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="font-sans text-body-lg font-semibold text-on-surface">
                              {member.fullName}
                            </p>
                            {member.email || member.phone ? (
                              <p className="mt-1 font-sans text-body-md text-on-surface-variant sm:hidden">
                                {member.email || member.phone}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-sans text-body-md text-on-surface-variant">
                        {member.department}
                      </td>
                      <td className="px-6 py-4 font-sans text-body-md text-on-surface-variant">
                        {memberDesignationLabel(member)}
                      </td>
                      <td className="max-w-sm px-6 py-4 font-sans text-body-md text-on-surface-variant">
                        {member.bio.trim() ? (
                          <p className="line-clamp-3" title={member.bio}>
                            {member.bio}
                          </p>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <p className="font-sans text-body-md text-secondary">
                          {member.email || "—"}
                        </p>
                        {member.phone ? (
                          <p className="font-sans text-label-md text-outline">
                            {member.phone}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-4">
                        {member.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 border border-success/30 bg-success/10 px-2 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 border border-outline-variant bg-surface-container px-2 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                            On Leave
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => void moveMember(member.id, -1)}
                          disabled={index === 0 || movingMemberId !== null}
                          className="mx-1 text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Move ${member.fullName} up`}
                        >
                          <ExpandMoreIcon className="rotate-180" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void moveMember(member.id, 1)}
                          disabled={
                            index === members.length - 1 ||
                            movingMemberId !== null
                          }
                          className="mx-1 text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Move ${member.fullName} down`}
                        >
                          <ExpandMoreIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMemberModal(member)}
                          className="mx-1 text-secondary transition-colors hover:text-primary"
                          aria-label={`Edit ${member.fullName}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMemberPendingDelete(member)}
                          className="mx-1 text-secondary transition-colors hover:text-error"
                          aria-label={`Delete ${member.fullName}`}
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>

      {designationFormOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={closeDesignationFormModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={designationFormTitleId}
            className="relative w-full max-w-lg bg-pure-white p-8 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDesignationFormModal}
              disabled={savingDesignation}
              className="absolute right-6 top-6 text-secondary transition-colors hover:text-primary disabled:opacity-50"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            <h3
              id={designationFormTitleId}
              className="mb-6 border-b border-outline-variant pb-4 text-headline-md text-primary"
            >
              {editingDesignationId ? "Edit Designation" : "New Designation"}
            </h3>
            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => void handleDesignationSubmit(event)}
            >
              <label className="flex flex-col">
                <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  Designation Name
                </span>
                <input
                  required
                  value={designationName}
                  onChange={(event) => setDesignationName(event.target.value)}
                  disabled={savingDesignation}
                  className={inputClassName}
                  placeholder="e.g. Senior Partner"
                  autoFocus
                />
              </label>
              {validationError || actionError ? (
                <p className="font-sans text-body-md text-error" role="alert">
                  {validationError || actionError}
                </p>
              ) : null}
              <div className="mt-2 flex justify-end gap-4 border-t border-outline-variant pt-6">
                <button
                  type="button"
                  onClick={closeDesignationFormModal}
                  disabled={savingDesignation}
                  className="border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:border-primary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDesignation || !!gateError}
                  className="border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:shadow-[inset_0_-4px_0_0_var(--color-secondary-fixed)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingDesignation ? "Saving…" : "Save Designation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {memberFormOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={closeMemberFormModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={memberFormTitleId}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-pure-white p-8 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeMemberFormModal}
              disabled={savingMember}
              className="absolute right-6 top-6 text-secondary transition-colors hover:text-primary disabled:opacity-50"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            <h3
              id={memberFormTitleId}
              className="mb-6 border-b border-outline-variant pb-4 text-headline-md text-primary"
            >
              {editingMemberId ? "Edit Talent Profile" : "New Talent Profile"}
            </h3>

            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => void handleMemberSubmit(event)}
            >
              <label className="flex flex-col">
                <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  Full Name
                </span>
                <input
                  required
                  value={memberForm.fullName}
                  onChange={(event) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  disabled={savingMember}
                  className={inputClassName}
                  placeholder="e.g. Jane Doe"
                  autoFocus
                />
              </label>

              <div className="flex flex-col">
                <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  Member Image{" "}
                  <span className="normal-case tracking-normal text-outline">
                    (optional)
                  </span>
                </span>
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={savingMember}
                  onChange={(event) =>
                    handleImageFileChange(event.target.files?.[0] ?? null)
                  }
                  className="border-0 border-b-2 border-outline-variant bg-transparent py-2 font-sans text-body-md text-on-surface file:mr-4 file:border-0 file:bg-transparent file:font-sans file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-primary focus:border-primary focus:outline-none disabled:opacity-60"
                />
                {previewUrl || memberForm.imageUrl ? (
                  <button
                    type="button"
                    onClick={clearMemberImage}
                    disabled={savingMember}
                    className="mt-2 self-start font-sans text-sm text-on-surface-variant underline hover:text-primary disabled:opacity-50"
                  >
                    Remove image
                  </button>
                ) : null}
                {previewUrl ||
                (memberForm.imageUrl.trim() &&
                  canDisplayImageUrl(memberForm.imageUrl.trim())) ? (
                  <div className="relative mt-4 h-24 w-24 overflow-hidden border border-outline-variant">
                    {previewUrl && isBlobImageUrl(previewUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element -- blob preview
                      <img
                        src={previewUrl}
                        alt="Member preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={previewUrl || memberForm.imageUrl.trim()}
                        alt="Member preview"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                ) : null}
              </div>

              <label className="flex flex-col">
                <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  Designation
                </span>
                <select
                  required
                  value={memberForm.designationId}
                  onChange={(event) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      designationId: event.target.value,
                    }))
                  }
                  disabled={savingMember}
                  className={`${inputClassName} bg-transparent`}
                >
                  <option value="">Select a designation</option>
                  {designations.map((designation) => (
                    <option key={designation.id} value={designation.id}>
                      {designation.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                    Department
                  </span>
                  <input
                    required
                    value={memberForm.department}
                    onChange={(event) =>
                      setMemberForm((prev) => ({
                        ...prev,
                        department: event.target.value,
                      }))
                    }
                    disabled={savingMember}
                    className={inputClassName}
                    placeholder="e.g. Strategy"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                    Status
                  </span>
                  <select
                    required
                    value={memberForm.status}
                    onChange={(event) =>
                      setMemberForm((prev) => ({
                        ...prev,
                        status: event.target.value as TeamMemberStatus,
                      }))
                    }
                    disabled={savingMember}
                    className={`${inputClassName} bg-transparent`}
                  >
                    {TEAM_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col">
                <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  Bio{" "}
                  <span className="normal-case tracking-normal text-outline">
                    (optional)
                  </span>
                </span>
                <textarea
                  rows={5}
                  value={memberForm.bio}
                  onChange={(event) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      bio: event.target.value,
                    }))
                  }
                  disabled={savingMember}
                  className={`${inputClassName} resize-y`}
                  placeholder="Short biography shown on the public team card"
                />
              </label>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                    Email Address{" "}
                    <span className="normal-case tracking-normal text-outline">
                      (optional)
                    </span>
                  </span>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(event) =>
                      setMemberForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    disabled={savingMember}
                    className={inputClassName}
                    placeholder="jane@icg.com"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                    Phone Number{" "}
                    <span className="normal-case tracking-normal text-outline">
                      (optional)
                    </span>
                  </span>
                  <input
                    type="tel"
                    value={memberForm.phone}
                    onChange={(event) =>
                      setMemberForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    disabled={savingMember}
                    className={inputClassName}
                    placeholder="+1 ..."
                  />
                </label>
              </div>

              {validationError || actionError ? (
                <p className="font-sans text-body-md text-error" role="alert">
                  {validationError || actionError}
                </p>
              ) : null}

              <div className="mt-2 flex justify-end gap-4 border-t border-outline-variant pt-6">
                <button
                  type="button"
                  onClick={closeMemberFormModal}
                  disabled={savingMember}
                  className="border border-outline-variant px-6 py-3 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:border-primary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMember || !!gateError}
                  className="border border-primary bg-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:shadow-[inset_0_-4px_0_0_var(--color-secondary-fixed)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingMember ? "Saving…" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {designationPendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => {
            if (!deletingDesignationId) setDesignationPendingDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteDesignationTitleId}
            className="w-full max-w-md border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-error-container text-error">
                <DeleteIcon />
              </div>
              <h2
                id={deleteDesignationTitleId}
                className="text-headline-md text-primary"
              >
                Delete designation?
              </h2>
              <p className="mt-3 font-sans text-body-md text-on-surface-variant">
                This permanently removes “{designationPendingDelete.name}”.
                Move or delete its members first if any remain.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
              <button
                type="button"
                onClick={() => setDesignationPendingDelete(null)}
                disabled={deletingDesignationId === designationPendingDelete.id}
                className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDeleteDesignation()}
                disabled={deletingDesignationId === designationPendingDelete.id}
                className="border border-error bg-error px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingDesignationId === designationPendingDelete.id
                  ? "Deleting…"
                  : "Delete Designation"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {memberPendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => {
            if (!deletingMemberId) setMemberPendingDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteMemberTitleId}
            className="w-full max-w-md border border-outline-variant bg-pure-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-error-container text-error">
                <DeleteIcon />
              </div>
              <h2
                id={deleteMemberTitleId}
                className="text-headline-md text-primary"
              >
                Delete team member?
              </h2>
              <p className="mt-3 font-sans text-body-md text-on-surface-variant">
                This permanently removes “{memberPendingDelete.fullName}” from
                the organization directory. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">
              <button
                type="button"
                onClick={() => setMemberPendingDelete(null)}
                disabled={deletingMemberId === memberPendingDelete.id}
                className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDeleteMember()}
                disabled={deletingMemberId === memberPendingDelete.id}
                className="border border-error bg-error px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingMemberId === memberPendingDelete.id
                  ? "Deleting…"
                  : "Delete Member"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

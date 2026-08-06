"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ServerDataTable } from "@/components/admin/server-data-table";
import { UIModal } from "@/components/admin/ui-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { SimpleForm } from "@/components/admin/simple-form";
import {
  useGetMembersQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useUploadProfilePhotoMutation,
} from "@/lib/redux/features/members/members-api";
import { useGetServicesQuery } from "@/lib/redux/features/services/services-api";
import { getPaginatedList } from "@/lib/api/list-query";
import { Edit } from "lucide-react";

function normalizeMemberPayload(data, isEdit = false) {
  const payload = {
    email: data.email || "",
    display_name: data.display_name || "",
    is_bookable: !!data.is_bookable,
    service_ids: data.service_ids || [],
  };

  if (!isEdit || data.password) {
    payload.password = data.password;
  }

  return payload;
}

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [memberToEdit, setMemberToEdit] = useState(null);
  const memberFormRef = useRef(null);

  const { data: servicesData } = useGetServicesQuery({ limit: 100 });
  const { items: services } = getPaginatedList(servicesData);

  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();
  const [uploadProfilePhoto, { isLoading: isUploading }] =
    useUploadProfilePhotoMutation();

  const handleDeleteClick = (id, memberName) => {
    setMemberToDelete({ id, name: memberName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMember(memberToDelete.id).unwrap();
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const handleAddMember = () => {
    setMemberToEdit(null);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (member) => {
    setMemberToEdit({
      ...member,
      service_ids: member.services
        ? member.services.map((s) => s.id || s)
        : member.service_ids || [],
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleMemberSubmit = async (data) => {
    setSubmitError(null);

    // Since we pass formRef to UIModal, 'data' will correctly contain the File object
    const file = data.profile_photo_url;

    try {
      let userId = memberToEdit?.user_id;

      if (memberToEdit) {
        const payload = normalizeMemberPayload(data, true);
        const originalServiceIds = memberToEdit.service_ids || [];
        const hasTextChanges =
          payload.email !== (memberToEdit.email || "") ||
          payload.display_name !== (memberToEdit.display_name || "") ||
          payload.is_bookable !== !!memberToEdit.is_bookable ||
          JSON.stringify([...payload.service_ids].sort()) !==
            JSON.stringify([...originalServiceIds].sort()) ||
          !!payload.password; // if a new password is provided, it changed

        if (hasTextChanges) {
          await updateMember({
            member_id: memberToEdit.id,
            ...payload,
          }).unwrap();
        }
      } else {
        const response = await createMember(
          normalizeMemberPayload(data),
        ).unwrap();
        userId = response?.data?.user_id || response?.user_id;
      }

      if (file instanceof File && userId) {
        const formData = new FormData();
        formData.append("file", file);
        await uploadProfilePhoto({ id: userId, formData }).unwrap();
      }

      setIsModalOpen(false);
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data === "string" ? err.data : null) ||
        (memberToEdit ? "Failed to update member" : "Failed to create member");
      setSubmitError(message);
    }
  };

  const columns = [
    {
      header: "Member",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.profile_photo_url ? (
            <img
              src={row.profile_photo_url}
              alt={row.display_name || row.name}
              className="h-10 w-10 rounded-full object-cover border"
            />
          ) : (
            <div className="rounded-full bg-primary/10 p-2">
              <svg
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
          <div>
            <div className="font-medium">{row.display_name || row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (row) => (
        <span className="text-sm text-gray-600">
          {row.role || row.role_code || "MEMBER"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            (row.status || "active") === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {(row.status || "active") === "active" ? "Active" : "Inactive"}
        </div>
      ),
    },
  ];

  const formFields = [
    {
      id: "display_name",
      label: "Display Name",
      placeholder: "Enter display name",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "Email",
      placeholder: "member@example.com",
      type: "email",
      required: true,
    },
    {
      id: "password",
      label: memberToEdit
        ? "Password (leave blank to keep current)"
        : "Password",
      placeholder: "SecurePass1",
      type: "password",
      required: !memberToEdit,
    },
    {
      id: "profile_photo_url",
      label: "Profile Photo",
      type: "image",
    },
    {
      id: "is_bookable",
      label: "Is Bookable",
      type: "switch",
    },
    {
      id: "service_ids",
      label: "Assigned Services",
      type: "multi-select",
      options: services.map((s) => ({ label: s.name, value: s.id })),
    },
  ];

  const rowActions = (row) => [
    <Button
      key="edit"
      variant="outline"
      size="icon"
      onClick={() => handleEditClick(row)}
    >
      <Edit className="h-4 w-4 text-primary" />
    </Button>,
    <Button
      key="delete"
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(row.id, row.display_name || row.name)}
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>,
  ];

  return (
    <div className="space-y-5">
      <ServerDataTable
        useQuery={useGetMembersQuery}
        columns={columns}
        actions={rowActions}
        onAddNew={handleAddMember}
        addNewLabel="Add Member"
        maxVisibleActions={1}
        title="Member Management"
        subtitle=""
      />

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubmitError(null);
          setMemberToEdit(null);
        }}
        title={memberToEdit ? "Edit Member" : "Add New Member"}
        description={""}
        size="lg"
        fixedHeight={true}
        onSubmit={handleMemberSubmit}
        submitText={memberToEdit ? "Save Changes" : "Create Member"}
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false);
          setMemberToEdit(null);
        }}
        isSubmitting={isCreating || isUpdating || isUploading}
        formId="member-form"
        formRef={memberFormRef}
      >
        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}
        <SimpleForm
          ref={memberFormRef}
          fields={formFields}
          initialData={memberToEdit || { is_bookable: true, service_ids: [] }}
          formId="member-form"
        />
      </UIModal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Member"
        description="Are you sure you want to delete this member? This action cannot be undone."
        itemName={memberToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}

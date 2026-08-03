"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { ServerDataTable } from "@/components/admin/server-data-table"
import { UIModal } from "@/components/admin/ui-modal"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { SimpleForm } from "@/components/admin/simple-form"
import {
  useGetMembersQuery,
  useCreateMemberMutation,
  useDeleteMemberMutation,
} from "@/lib/redux/features/members/members-api"

function normalizeMemberPayload(data) {
  return {
    name: data.name,
    email: data.email,
    password: data.password,
  }
}

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation()

  const handleDeleteClick = (id, memberName) => {
    setMemberToDelete({ id, name: memberName })
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return

    try {
      await deleteMember(memberToDelete.id).unwrap()
      setDeleteModalOpen(false)
      setMemberToDelete(null)
    } catch (error) {
      console.error("Failed to delete member:", error)
    }
  }

  const handleAddMember = () => {
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const handleMemberSubmit = async (data) => {
    setSubmitError(null)

    try {
      await createMember(normalizeMemberPayload(data)).unwrap()
      setIsModalOpen(false)
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data === "string" ? err.data : null) ||
        "Failed to create member"
      setSubmitError(message)
    }
  }

  const columns = [
    {
      header: "Member",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (row) => <span>{row.email || "—"}</span>,
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
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(row.status || "active") === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {(row.status || "active") === "active" ? "Active" : "Inactive"}
        </div>
      ),
    },
  ]

  const formFields = [
    {
      id: "username",
      label: "Username",
      placeholder: "Enter username",
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
      label: "Password",
      placeholder: "SecurePass1",
      type: "password",
      required: true,
    },
  ]

  const rowActions = (row) => [
    <Button
      key="delete"
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(row.id, row.name)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>,
  ]

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
        subtitle="Staff members get the MEMBER role automatically and can only access bookings."
      />

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSubmitError(null)
        }}
        title="Add New Member"
        description="Create a staff account. Members can sign in and view bookings only."
        onSubmit={handleMemberSubmit}
        submitText="Create Member"
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false)
          setSubmitError(null)
        }}
        isSubmitting={isCreating}
        formId="member-form"
      >
        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}
        <SimpleForm fields={formFields} initialData={{}} formId="member-form" />
      </UIModal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setMemberToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Member"
        description="Are you sure you want to delete this member? This action cannot be undone."
        itemName={memberToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}

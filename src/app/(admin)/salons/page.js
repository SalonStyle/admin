"use client"

import { useState } from "react"
import { Store } from "lucide-react"
import { DataTable } from "@/components/admin/data-table"
import { UIModal } from "@/components/admin/ui-modal"
import { SimpleForm } from "@/components/admin/simple-form"
import { TableSkeleton } from "@/components/Skeleton/table-skeleton"
import {
  useCreateSalonMutation,
  useGetSalonsQuery,
} from "@/lib/redux/features/salons/salons-api"

export default function SalonsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const { data: salonsData, isLoading } = useGetSalonsQuery()
  const salons = salonsData?.data || []

  const [createSalon, { isLoading: isCreating }] = useCreateSalonMutation()

  const handleAddSalon = () => {
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const handleSalonSubmit = async (data) => {
    setSubmitError(null)

    try {
      await createSalon(data).unwrap()
      setIsModalOpen(false)
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data === "string" ? err.data : null) ||
        "Failed to create salon"
      setSubmitError(message)
    }
  }

  const columns = [
    {
      header: "Salon",
      accessorKey: "salon_name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-100 p-2">
            <Store className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <div className="font-medium">{row.salon_name || row.name}</div>
            <div className="text-sm text-gray-500">{row.email || row.owner_email || "—"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Owner Email",
      accessorKey: "email",
      cell: (row) => <span>{row.email || row.owner_email || "—"}</span>,
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
  ]

  const formFields = [
    {
      id: "salon_name",
      label: "Salon Name",
      placeholder: "Jane Styles Studio",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "Owner Email",
      placeholder: "jane@example.com",
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

  return (
    <div className="space-y-5">
      {isLoading ? (
        <TableSkeleton
          columns={columns}
          rows={10}
          addNewLabel="Add Salon"
          title="All Salons"
        />
      ) : (
        <DataTable
          data={salons}
          columns={columns}
          searchField="salon_name"
          onAddNew={handleAddSalon}
          addNewLabel="Add Salon"
          title="All Salons"
          subtitle="Manage salon owners. Creating a salon assigns the SALON role automatically."
        />
      )}

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSubmitError(null)
        }}
        title="Add New Salon"
        description="Register a salon owner with email, password, and salon name."
        onSubmit={handleSalonSubmit}
        submitText="Create Salon"
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false)
          setSubmitError(null)
        }}
        isSubmitting={isCreating}
        size="lg"
        formId="salon-form"
      >
        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}
        <SimpleForm fields={formFields} initialData={{}} formId="salon-form" />
      </UIModal>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { DataTable } from "@/components/admin/data-table"
import { UIModal } from "@/components/admin/ui-modal"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { SimpleForm } from "@/components/admin/simple-form"
import { TableSkeleton } from "@/components/Skeleton/table-skeleton"
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/redux/features/categories/categories-api"

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const { data: categoriesData, isLoading } = useGetCategoriesQuery()
  const categories = categoriesData?.data || []

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const handleDeleteClick = (id, categoryName) => {
    setCategoryToDelete({ id, name: categoryName })
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return
    try {
      await deleteCategory(categoryToDelete.id).unwrap()
      setDeleteModalOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleCategorySubmit = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, ...data }).unwrap()
      } else {
        await createCategory(data).unwrap()
      }
      setIsModalOpen(false)
      setEditingCategory(null)
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  const columns = [
    {
      header: "Category",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-violet-100 p-2 rounded-full">
            <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.description || "—"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </div>
      ),
    },
  ]

  const formFields = [
    {
      id: "name",
      label: "Category Name",
      placeholder: "e.g. Hair, Nails, Facial",
      type: "text",
      required: true,
    },
    {
      id: "description",
      label: "Description",
      placeholder: "Brief description of this category",
      type: "textarea",
    },
    {
      id: "status",
      label: "Status",
      placeholder: "Select status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ]

  const rowActions = (row) => [
    <Button
      key="edit"
      variant="outline"
      size="icon"
      onClick={() => handleEditCategory(row)}
    >
      <Edit className="h-4 w-4" />
    </Button>,
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
      {isLoading ? (
        <TableSkeleton
          columns={columns}
          rows={10}
          addNewLabel="Add Category"
          title="All Categories"
        />
      ) : (
        <DataTable
          data={categories}
          columns={columns}
          searchField="name"
          actions={rowActions}
          onAddNew={handleAddCategory}
          addNewLabel="Add Category"
          maxVisibleActions={3}
          title="All Categories"
          subtitle="Manage service categories used when creating services"
        />
      )}

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        onSubmit={handleCategorySubmit}
        submitText={editingCategory ? "Update Category" : "Create Category"}
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        isSubmitting={isCreating || isUpdating}
      >
        <SimpleForm
          fields={formFields}
          initialData={editingCategory || { status: "active" }}
          formId="category-form"
        />
      </UIModal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setCategoryToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        description="Are you sure you want to delete this category? Services linked to it may need to be reassigned."
        itemName={categoryToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}

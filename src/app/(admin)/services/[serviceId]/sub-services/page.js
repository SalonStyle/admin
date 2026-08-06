"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetCategoriesQuery } from "@/lib/redux/features/categories/categories-api";
import {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "@/lib/redux/features/services/services-api";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import { ServerDataTable } from "@/components/admin/server-data-table";
import { UIModal } from "@/components/admin/ui-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { SimpleForm } from "@/components/admin/simple-form";
import { FILTER_TYPES } from "@/components/admin/filter-bar";
import { getPaginatedList } from "@/lib/api/list-query";
import { useParams, useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
  { value: "120", label: "120 min" },
];

function normalizeServicePayload(data) {
  return {
    name: data.name,
    description: data.description,
    duration_minutes: data.duration_minutes
      ? Number(data.duration_minutes)
      : undefined,
    price: data.price ? Number(data.price) : undefined,
    category_id: data.category_id,
    status: data.status,
    gender: data.gender,
    parent_id: data.parent_id,
  };
}

export default function SubServicesPage() {
  const { serviceId } = useParams();
  const router = useRouter();

  const { data: parentServiceData } = useGetServiceByIdQuery(serviceId);
  const parentService = parentServiceData?.data || parentServiceData;

  const { data: categoriesData } = useGetCategoriesQuery({
    limit: 100,
    status: "active",
  });
  const { items: activeCategories } = getPaginatedList(categoriesData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDeleteClick = (id, serviceName) => {
    setServiceToDelete({ id, name: serviceName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete.id).unwrap();
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleEditService = (service) => {
    setEditingService({
      ...service,
      duration_minutes:
        service.duration_minutes != null
          ? String(service.duration_minutes)
          : "",
      price: service.price != null ? String(service.price) : "",
    });
    setIsModalOpen(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleServiceSubmit = async (data) => {
    const payload = {
      ...normalizeServicePayload(data),
      parent_id: serviceId, // Force parent_id to the current service
    };

    try {
      if (editingService) {
        await updateService({ id: editingService.id, ...payload }).unwrap();
      } else {
        await createService(payload).unwrap();
      }
      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const filters = [
    {
      id: "category_id",
      label: "Category",
      type: FILTER_TYPES.SELECT,
      options: activeCategories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    },
    {
      id: "status",
      label: "Status",
      type: FILTER_TYPES.SELECT,
      options: STATUS_OPTIONS,
    },
  ];

  const columns = [
    {
      header: "Service",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration_minutes",
      cell: (row) => <span>{row.duration_minutes} min</span>,
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row) => <span>${Number(row.price || 0).toFixed(2)}</span>,
    },
    {
      header: "Category",
      accessorKey: "category_name",
      cell: (row) => <span>{row.category_name || "—"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </div>
      ),
    },
  ];

  const formFields = [
    {
      id: "name",
      label: "Service Name",
      placeholder: "Classic Haircut",
      type: "text",
      required: true,
    },
    {
      id: "description",
      label: "Description",
      placeholder: "Includes wash, cut, and blow-dry",
      type: "textarea",
    },
    {
      id: "duration_minutes",
      label: "Duration",
      placeholder: "Select duration",
      col: "col-span-6",
      type: "select",
      required: true,
      options: DURATION_OPTIONS,
    },
    {
      id: "price",
      label: "Price ($)",
      placeholder: "45",
      type: "number",
      col: "col-span-6",
      required: true,
    },
    {
      id: "category_id",
      label: "Category",
      placeholder: activeCategories.length
        ? "Select category"
        : "Add categories first",
      type: "select",
      required: true,
      options: activeCategories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    },
    {
      id: "status",
      label: "Status",
      placeholder: "Select status",
      type: "select",
      options: STATUS_OPTIONS,
    },
    {
      id: "gender",
      label: "Gender",
      placeholder: "Select gender",
      type: "select",
      options: [
        { value: "unisex", label: "Unisex" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
      required: true,
    },
  ];

  const rowActions = (row) => [
    <Button
      key="edit"
      variant="outline"
      size="icon"
      onClick={() => handleEditService(row)}
    >
      <Edit className="h-4 w-4 text-primary" />
    </Button>,
    <Button
      key="delete"
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(row.id, row.name)}
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>,
  ];

  return (
    <div className="space-y-5">
      <ServerDataTable
        useQuery={useGetServicesQuery}
        queryArg={{ parent_id: serviceId }}
        columns={columns}
        filters={filters}
        actions={rowActions}
        onAddNew={handleAddService}
        addNewLabel="Add Sub Service"
        maxVisibleActions={3}
        title="Sub Services"
        subtitle=""
      />

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? "Edit Sub Service" : "Add New Sub Service"}
        description={
          editingService
            ? "Update the details of this sub-service."
            : "Fill in the information to add a new sub-service to your catalog."
        }
        onSubmit={handleServiceSubmit}
        submitText={editingService ? "Update Service" : "Create Service"}
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        isSubmitting={isCreating || isUpdating}
        formId="service-form"
      >
        <SimpleForm
          fields={formFields}
          initialData={editingService || { status: "active" }}
          formId="service-form"
        />
      </UIModal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        itemName={serviceToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}

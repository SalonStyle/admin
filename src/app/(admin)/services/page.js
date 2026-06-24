"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetCategoriesQuery } from "@/lib/redux/features/categories/categories-api";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { UIModal } from "@/components/admin/ui-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { SimpleForm } from "@/components/admin/simple-form";
import { TableSkeleton } from "@/components/Skeleton/table-skeleton";

export default function ServicesPage() {
  const { data: categoriesData } = useGetCategoriesQuery();
  const allCategories = categoriesData?.data || [];
  const activeCategories = allCategories.filter((c) => c.status === "active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [services, setServices] = useState([]);
  const isLoading = false;

  const handleDeleteClick = (id, serviceName) => {
    setServiceToDelete({ id, name: serviceName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    // Handle delete logic here (no backend)
    setServices(services.filter((s) => (s._id || s.id) !== serviceToDelete.id));
    setDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleServiceSubmit = async (data) => {
    // Handle submit logic here (no backend)
    if (editingService) {
      setServices(services.map((s) => ((s._id || s.id) === (editingService._id || editingService.id) ? { ...s, ...data } : s)));
    } else {
      setServices([...services, { ...data, _id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const columns = [
    {
      header: "Service",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
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
      accessorKey: "duration",
      cell: (row) => <span>{row.duration} min</span>,
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row) => <span>${row.price?.toFixed(2) || "0.00"}</span>,
    },
    {
      header: "Category",
      accessorKey: "category_id",
      cell: (row) => {
        const category = allCategories.find((c) => c.id === row.category_id);
        return <span>{category?.name || "—"}</span>;
      },
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
  ];

  const formFields = [
    {
      id: "name",
      label: "Service Name",
      placeholder: "Enter service name",
      type: "text",
    },
    {
      id: "description",
      label: "Description",
      placeholder: "Enter service description",
      type: "textarea",
    },
    {
      id: "duration",
      label: "Duration",
      placeholder: "Select duration",
      col: "col-span-6",
      type: "select",
      options: [
        { value: "15", label: "15 min" },
        { value: "30", label: "30 min" },
        { value: "45", label: "45 min" },
        { value: "60", label: "60 min" },
        { value: "90", label: "90 min" },
        { value: "120", label: "120 min" },
      ],
    },
    {
      id: "price",
      label: "Price ($)",
      placeholder: "0.00",
      type: "number",
      col: "col-span-6",
    },
    {
      id: "category_id",
      label: "Category",
      placeholder: activeCategories.length ? "Select category" : "Add categories first",
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
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const rowActions = (row) => [
    <Button
      key="edit"
      variant="outline"
      size="icon"
      onClick={() => handleEditService(row)}
    >
      <Edit className="h-4 w-4" />
    </Button>,
    <Button
      key="delete"
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(row._id || row.id, row.name)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>,
  ];

  return (
    <div className="space-y-5">
      {isLoading ? (
        <TableSkeleton
          columns={columns}
          rows={10}
          addNewLabel="Add Service"
          title="All Services"
        />
      ) : (
        <DataTable
          data={services}
          columns={columns}
          searchField="name"
          actions={rowActions}
          onAddNew={handleAddService}
          addNewLabel="Add Service"
          maxVisibleActions={3}
          title="All Services"
          subtitle=""
        />
      )}

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? "Edit Service" : "Add New Service"}
        onSubmit={handleServiceSubmit}
        submitText={editingService ? "Update Service" : "Create Service"}
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        isSubmitting={false}
      >
        <SimpleForm
          fields={formFields}
          initialData={editingService || {}}
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
        isDeleting={false}
      />
    </div>
  );
}

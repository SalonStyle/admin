"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { UIModal } from "@/components/admin/ui-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { SimpleForm } from "@/components/admin/simple-form";
import { TableSkeleton } from "@/components/Skeleton/table-skeleton";

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const isLoading = false;

  const handleDeleteClick = (id, userName) => {
    setUserToDelete({ id, name: userName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    // Handle delete logic here (no backend)
    setUsers(users.filter((u) => (u._id || u.id) !== userToDelete.id));
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleUserSubmit = async (data) => {
    // Handle submit logic here (no backend)
    if (editingUser) {
      setUsers(users.map((u) => ((u._id || u.id) === (editingUser._id || editingUser.id) ? { ...u, ...data } : u)));
    } else {
      setUsers([...users, { ...data, _id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const columns = [
    {
      header: "User",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email || row.number}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Mobile Number",
      accessorKey: "number",
      cell: (row) => <span>{row.number || row.mobile || "—"}</span>,
    },
    {
      header: "Role",
      accessorKey: "role",
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
      label: "Full Name",
      placeholder: "Enter full name",
      type: "text",
    },
    {
      id: "mobile",
      label: "Mobile Number",
      placeholder: "Enter Mobile Number",
      type: "number",
    },
    {
      id: "role",
      label: "Role",
      placeholder: "Select role",
      type: "select",
      col: "col-span-6",
      options: [
        { value: "Admin", label: "Admin" },
        { value: "Editor", label: "Editor" },
        { value: "Viewer", label: "Viewer" },
      ],
    },
    {
      id: "status",
      label: "Status",
      placeholder: "Select status",
      type: "select",
      col: "col-span-6",
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
      onClick={() => handleEditUser(row)}
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
          addNewLabel="Add User"
          title="User Management"
        />
      ) : (
        <DataTable
          data={users}
          columns={columns}
          searchField="name"
          actions={rowActions}
          onAddNew={handleAddUser}
          addNewLabel="Add User"
          maxVisibleActions={3}
          title="User Management"
          subtitle=""
        />
      )}

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Edit User" : "Add New User"}
        onSubmit={handleUserSubmit}
        submitText={editingUser ? "Update User" : "Create User"}
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        isSubmitting={false}
      >
        <SimpleForm
          fields={formFields}
          initialData={editingUser || {}}
          formId="user-form"
        />
      </UIModal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        itemName={userToDelete?.name}
        isDeleting={false}
      />
    </div>
  );
}

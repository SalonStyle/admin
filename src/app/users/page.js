"use client";
import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/haeder";
import { useSidebar } from "../../components/sidebar-provider";
import { cn } from "@/lib/utils";
import { PageCreator } from "../../components/PageCreator";
import { User2 } from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    number: "8989898989",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    number: "9090909090",
    role: "Editor",
    status: "inactive",
  },
];

const UserManagement = () => {
  const { collapsed } = useSidebar();

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <User2 className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    { header: "Mobile Number", accessor: "number" },
    { header: "Role", accessor: "role" },
    {
      header: "Status",
      accessor: "status",
      render: (val) => (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            val === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {val === "active" ? "Active" : "Inactive"}
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
      label: "Mobiel Number",
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

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className={cn("flex-1 flex flex-col overflow-hidden px-2")}>
        <Header />
        <main className="flex-1 overflow-y-auto mt-4">
          <PageCreator
            title="User Management"
            description="Manage application users and roles"
            data={users}
            columns={columns}
            formFields={formFields}
            onFormSubmit={(formData) =>
              console.log("New user submitted:", formData)
            }
            searchKeys={["name", "email", "role"]}
            addButtonText="Add User"
          />
        </main>
      </div>
    </div>
  );
};

export default UserManagement;

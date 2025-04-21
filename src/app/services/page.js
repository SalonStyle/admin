"use client";

import { Scissors } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/haeder";
import { cn } from "@/lib/utils";
import { PageCreator } from "../../components/PageCreator";
// import { createService } from "../actions/servicesActions";
// import { useDispatch, useSelector } from "react-redux";
// import { servicesService } from "../../../api/services/servicesService";

const ServiceManagement = () => {
  //   const { services } = useSelector((state) => state.services);
  //   const dispatch = useDispatch();

  const columns = [
    {
      header: "Service",
      accessor: "name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Scissors className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        </div>
      ),
    },
    { header: "Duration", accessor: "duration" },
    {
      header: "Price",
      accessor: "price",
      render: (val) => `$${val.toFixed(2)}`,
    },
    { header: "Category", accessor: "category" },
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
      id: "category",
      label: "Category",
      placeholder: "Select category",
      type: "select",
      options: [
        { value: "hair", label: "Hair" },
        { value: "facial", label: "Facial" },
        { value: "massage", label: "Massage" },
        { value: "nails", label: "Nails" },
        { value: "other", label: "Other" },
      ],
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

  const handleData = async (data) => {};

  const services = [];

  return (
    <div className="flex  h-full bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className={cn("flex-1 flex flex-col overflow-hidden px-2")}>
        <Header />
        <main className="flex-1 overflow-y-auto py-4">
          <PageCreator
            title="Service & Pricing Management"
            description="Manage your salon services and pricing"
            data={services}
            columns={columns}
            formFields={formFields}
            onFormSubmit={(formData) => handleData(formData)}
            searchKeys={["name", "category"]}
            addButtonText="Add Service"
          />
        </main>
      </div>
    </div>
  );
};

export default ServiceManagement;

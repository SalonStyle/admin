"use client";
import { CalendarCheck2 } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/haeder";
import { useSidebar } from "../../components/sidebar-provider";
import { cn } from "@/lib/utils";
import { PageCreator } from "../../components/PageCreator";

const bookings = [
  // Static/mock booking data for now – replace with your real data source
  {
    id: 1,
    customer: "John Doe",
    service: "Haircut",
    staff: "Emily",
    date: "2025-04-18",
    time: "14:00",
    status: "confirmed",
  },
];

const BookingsManagement = () => {
  const { collapsed } = useSidebar();

  const columns = [
    {
      header: "Booking",
      accessor: "customer",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <CalendarCheck2 className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <div className="font-medium">{row.customer}</div>
            <div className="text-sm text-gray-500">{row.service}</div>
          </div>
        </div>
      ),
    },
    { header: "Staff", accessor: "staff" },
    { header: "Date", accessor: "date" },
    { header: "Time", accessor: "time" },
    {
      header: "Status",
      accessor: "status",
      render: (val) => (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            val === "confirmed"
              ? "bg-green-100 text-green-800"
              : val === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </div>
      ),
    },
  ];

  const formFields = [
    {
      id: "customer",
      label: "Customer Name",
      placeholder: "Enter customer name",
      type: "text",
      col: "col-span-12",
      //   mobileCol: "sm:col-span-12",
    },
    {
      id: "service",
      label: "Service",
      placeholder: "Enter service name",
      type: "text",
      col: "col-span-12",
    },
    {
      id: "staff",
      label: "Staff Member",
      placeholder: "Enter staff name",
      type: "text",
      col: "col-span-12",
    },
    {
      id: "date",
      label: "Date",
      placeholder: "Select booking date",
      type: "date",
      col: "col-span-6",
    },
    {
      id: "time",
      label: "Time",
      placeholder: "Enter booking time",
      type: "time",
      col: "col-span-6",
    },
    {
      id: "status",
      label: "Status",
      placeholder: "Select status",
      type: "select",
      col: "col-span-12",
      options: [
        { value: "confirmed", label: "Confirmed" },
        { value: "pending", label: "Pending" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className={cn("flex-1 flex flex-col overflow-hidden px-2")}>
        <Header />
        <main className="flex-1 overflow-y-auto mt-4">
          <PageCreator
            title="Booking Management"
            description="Manage appointments and bookings"
            data={bookings}
            columns={columns}
            formFields={formFields}
            onFormSubmit={(formData) =>
              console.log("New booking submitted:", formData)
            }
            searchKeys={["customer", "service", "staff"]}
            addButtonText="Add Booking"
          />
        </main>
      </div>
    </div>
  );
};

export default BookingsManagement;

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ServerDataTable } from "@/components/admin/server-data-table";
import { useGetBookingsQuery, useCancelBookingMutation } from "@/lib/redux/features/bookings/bookings-api";
import { Button } from "@/components/ui/button";
import { XCircle, Eye } from "lucide-react";
import { formatPrice } from "@/lib/helper";
import BookingWizard from "@/components/admin/Booking/BookingWizard";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function BookingsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleCancelClick = (row) => {
    setBookingToCancel(row);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel.id).unwrap();
      setCancelModalOpen(false);
      setBookingToCancel(null);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  const columns = [
    {
      header: "Customer",
      accessorKey: "customer.full_name",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.customer?.full_name || "Unknown"}</div>
          <div className="text-sm text-gray-500">{row.customer?.phone}</div>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "starts_at",
      cell: (row) => (
        <div>
          <div className="font-medium">
            {row.starts_at ? format(new Date(row.starts_at), "MMM d, yyyy") : "N/A"}
          </div>
          <div className="text-sm text-gray-500">
            {row.starts_at ? format(new Date(row.starts_at), "h:mm a") : "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "total_price",
      cell: (row) => <span>{formatPrice(row.total_price || 0)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            STATUS_COLORS[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status || "Unknown"}
        </span>
      ),
    },
  ];

  const rowActions = (row) => [
    <Button
      key="cancel"
      variant="outline"
      size="icon"
      onClick={() => handleCancelClick(row)}
      disabled={row.status === "cancelled" || row.status === "completed"}
      title="Cancel Booking"
    >
      <XCircle className="h-4 w-4 text-red-500" />
    </Button>,
  ];

  return (
    <div className="space-y-5">
      <ServerDataTable
        useQuery={useGetBookingsQuery}
        columns={columns}
        actions={rowActions}
        onAddNew={() => setIsWizardOpen(true)}
        addNewLabel="Add Booking"
        title="Bookings"
        subtitle="Manage salon appointments and schedules."
      />

      <DeleteConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        description={`Are you sure you want to cancel the booking for ${bookingToCancel?.customer?.full_name}?`}
        isDeleting={isCancelling}
        confirmText="Yes, Cancel Booking"
      />

      {isWizardOpen && (
        <BookingWizard onClose={() => setIsWizardOpen(false)} />
      )}
    </div>
  );
}

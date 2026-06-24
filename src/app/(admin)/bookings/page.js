"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Clock, User, Scissors } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { UIModal } from "@/components/admin/ui-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { SimpleForm } from "@/components/admin/simple-form";
import { TableSkeleton } from "@/components/Skeleton/table-skeleton";
import { FilterBar, FILTER_TYPES } from "@/components/admin/filter-bar";
import { DatePicker } from "@/components/admin/date-picker";
import {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useUpdateBookingStatusMutation,
} from "@/lib/redux/features/bookings/bookings-api";
import {
  selectSelectedBooking,
  setSelectedBooking,
  selectFilters,
  setFilters,
} from "@/lib/redux/features/bookings/bookings-slice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function BookingsPage() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filters = useSelector(selectFilters);
  const selectedBooking = useSelector(selectSelectedBooking);

  // Convert filter values for API
  const apiFilters = useMemo(() => {
    const apiFilter = {};
    if (filters.status) apiFilter.status = filters.status;
    if (filters.date_range?.from) {
      const fromDate = filters.date_range.from instanceof Date 
        ? filters.date_range.from 
        : new Date(filters.date_range.from);
      if (!isNaN(fromDate.getTime())) {
        apiFilter.date_from = fromDate.toISOString().split("T")[0];
      }
    }
    if (filters.date_range?.to) {
      const toDate = filters.date_range.to instanceof Date 
        ? filters.date_range.to 
        : new Date(filters.date_range.to);
      if (!isNaN(toDate.getTime())) {
        apiFilter.date_to = toDate.toISOString().split("T")[0];
      }
    }
    if (filters.staff_id) apiFilter.staff_id = filters.staff_id;
    if (filters.service_id) apiFilter.service_id = filters.service_id;
    return apiFilter;
  }, [filters]);

  // RTK Query hooks - with mock data for now (until API is ready)
  // When API is ready, uncomment and remove mock data
  const { data: bookingsData, isLoading, error } = useGetBookingsQuery({
    page,
    pageSize,
    filters: apiFilters,
  });

  // Mock data structure for development (remove when API is ready)
  const mockBookings = [];
  const mockTotal = 0;

  // Use API data if available, otherwise use mock
  const bookings = bookingsData?.data || mockBookings;
  const totalBookings = bookingsData?.total || mockTotal;

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteBooking(bookingToDelete.id).unwrap();
      setDeleteModalOpen(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const handleEditBooking = (booking) => {
    dispatch(setSelectedBooking(booking));
    setIsModalOpen(true);
  };

  const handleAddBooking = () => {
    dispatch(setSelectedBooking(null));
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (data) => {
    try {
      if (selectedBooking) {
        await updateBooking({
          id: selectedBooking.id,
          ...data,
        }).unwrap();
      } else {
        await createBooking(data).unwrap();
      }
      setIsModalOpen(false);
      dispatch(setSelectedBooking(null));
    } catch (error) {
      console.error("Failed to save booking:", error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateStatus({ id: bookingId, status: newStatus }).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Booking Form Fields
  const formFields = [
    {
      id: "customer_name",
      label: "Customer Name",
      placeholder: "Enter customer name",
      type: "text",
      col: "col-span-12 md:col-span-6",
      required: true,
    },
    {
      id: "customer_mobile",
      label: "Mobile Number",
      placeholder: "+91 9876543210",
      type: "tel",
      col: "col-span-12 md:col-span-6",
      required: true,
    },
    {
      id: "customer_email",
      label: "Email (Optional)",
      placeholder: "customer@example.com",
      type: "email",
      col: "col-span-12",
    },
    {
      id: "service_id",
      label: "Service",
      placeholder: "Select service",
      type: "select",
      col: "col-span-12 md:col-span-6",
      options: [
        // TODO: Fetch from services API
        { value: "haircut", label: "Haircut" },
        { value: "beard", label: "Beard Trim" },
        { value: "facial", label: "Facial" },
        { value: "hair_wash", label: "Hair Wash" },
        { value: "hair_color", label: "Hair Color" },
        { value: "massage", label: "Massage" },
      ],
      required: true,
    },
    {
      id: "staff_id",
      label: "Staff Member",
      placeholder: "Select staff",
      type: "select",
      col: "col-span-12 md:col-span-6",
      options: [
        // TODO: Fetch from users/staff API
        { value: "staff1", label: "John Doe" },
        { value: "staff2", label: "Jane Smith" },
        { value: "staff3", label: "Mike Johnson" },
      ],
    },
    {
      id: "booking_date",
      label: "Booking Date",
      placeholder: "Select date",
      type: "date",
      col: "col-span-12 md:col-span-6",
      required: true,
    },
    {
      id: "booking_time",
      label: "Booking Time",
      placeholder: "Select time",
      type: "time",
      col: "col-span-12 md:col-span-6",
      required: true,
    },
    {
      id: "duration",
      label: "Duration (minutes)",
      placeholder: "60",
      type: "number",
      col: "col-span-12 md:col-span-6",
    },
    {
      id: "status",
      label: "Status",
      placeholder: "Select status",
      type: "select",
      col: "col-span-12 md:col-span-6",
      options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no_show", label: "No Show" },
      ],
      required: true,
    },
    {
      id: "payment_status",
      label: "Payment Status",
      placeholder: "Select payment status",
      type: "select",
      col: "col-span-12 md:col-span-6",
      options: [
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "partially_paid", label: "Partially Paid" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    {
      id: "payment_method",
      label: "Payment Method",
      placeholder: "Select payment method",
      type: "select",
      col: "col-span-12 md:col-span-6",
      options: [
        { value: "cash", label: "Cash" },
        { value: "card", label: "Card" },
        { value: "upi", label: "UPI" },
        { value: "online", label: "Online" },
      ],
    },
    {
      id: "total_amount",
      label: "Total Amount (₹)",
      placeholder: "0.00",
      type: "number",
      col: "col-span-12 md:col-span-6",
      step: "0.01",
    },
    {
      id: "paid_amount",
      label: "Paid Amount (₹)",
      placeholder: "0.00",
      type: "number",
      col: "col-span-12 md:col-span-6",
      step: "0.01",
    },
    {
      id: "customer_notes",
      label: "Customer Notes / Special Requests",
      placeholder: "Any special requests or notes...",
      type: "textarea",
      col: "col-span-12",
    },
    {
      id: "notes",
      label: "Internal Notes",
      placeholder: "Staff notes...",
      type: "textarea",
      col: "col-span-12",
    },
  ];

  // Table Columns
  const columns = [
    {
      header: "Customer",
      accessorKey: "customer_name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <User className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <div className="font-medium">{row.customer_name}</div>
            <div className="text-sm text-gray-500">{row.customer_mobile}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Service",
      accessorKey: "service_name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-gray-400" />
          <span>{row.service_name}</span>
        </div>
      ),
    },
    {
      header: "Staff",
      accessorKey: "staff_name",
      cell: (row) => row.staff_name || "—",
    },
    {
      header: "Date & Time",
      accessorKey: "booking_date",
      cell: (row) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3" />
            {row.booking_date ? new Date(row.booking_date).toLocaleDateString() : "—"}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-3 w-3" />
            {row.booking_time || "—"}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800",
          confirmed: "bg-blue-100 text-blue-800",
          completed: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
          no_show: "bg-gray-100 text-gray-800",
        };

        return (
          <Select
            value={row.status || "pending"}
            onValueChange={(value) => handleStatusChange(row.id, value)}
          >
            <SelectTrigger className={`w-32 ${statusColors[row.status] || statusColors.pending}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      header: "Payment",
      accessorKey: "payment_status",
      cell: (row) => {
        const paymentColors = {
          pending: "bg-yellow-100 text-yellow-800",
          paid: "bg-green-100 text-green-800",
          partially_paid: "bg-blue-100 text-blue-800",
          refunded: "bg-red-100 text-red-800",
        };
        const status = row.payment_status || "pending";
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentColors[status] || paymentColors.pending}`}>
            {status.replace("_", " ").toUpperCase()}
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: (row) => (
        <div>
          <div className="font-medium">₹{row.total_amount?.toFixed(2) || "0.00"}</div>
          {row.payment_status !== "paid" && (
            <div className="text-xs text-gray-500">Paid: ₹{row.paid_amount?.toFixed(2) || "0.00"}</div>
          )}
        </div>
      ),
    },
  ];

  const rowActions = (row) => [
    <Button
      key="edit"
      variant="outline"
      size="icon"
      onClick={() => handleEditBooking(row)}
    >
      <Edit className="h-4 w-4" />
    </Button>,
    <Button
      key="delete"
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(row)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>,
  ];

  // Filter Configuration
  const filterConfig = [
    {
      id: "status",
      label: "Status",
      type: FILTER_TYPES.SELECT,
      placeholder: "Select status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no_show", label: "No Show" },
      ],
    },
    {
      id: "date_range",
      label: "Date",
      type: FILTER_TYPES.DATE_RANGE,
      placeholder: "Select date range",
    },
    {
      id: "staff_id",
      label: "Staff",
      type: FILTER_TYPES.SELECT,
      placeholder: "Select staff",
      options: [
        // TODO: Fetch from API
        { value: "staff1", label: "John Doe" },
        { value: "staff2", label: "Jane Smith" },
        { value: "staff3", label: "Mike Johnson" },
      ],
    },
    {
      id: "service_id",
      label: "Service",
      type: FILTER_TYPES.SELECT,
      placeholder: "Select service",
      options: [
        // TODO: Fetch from API
        { value: "haircut", label: "Haircut" },
        { value: "beard", label: "Beard Trim" },
        { value: "facial", label: "Facial" },
      ],
    },
  ];

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="space-y-5">
      {isLoading ? (
        <TableSkeleton
          columns={columns}
          rows={10}
          addNewLabel="Add Booking"
          title="Booking Management"
        />
      ) : (
        <DataTable
          data={bookings}
          columns={columns}
          searchField="customer_name"
          actions={rowActions}
          onAddNew={handleAddBooking}
          addNewLabel="Add Booking"
          maxVisibleActions={3}
          title="Booking Management"
          subtitle={totalBookings > 0 ? `Total: ${totalBookings} bookings` : ""}
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          filterValues={filters}
          enableInternalFiltering={false}
        />
      )}

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(setSelectedBooking(null));
        }}
        title={selectedBooking ? "Edit Booking" : "Add New Booking"}
        onSubmit={handleBookingSubmit}
        submitText={selectedBooking ? "Update Booking" : "Create Booking"}
        cancelText="Cancel"
        onCancel={() => {
          setIsModalOpen(false);
          dispatch(setSelectedBooking(null));
        }}
        isSubmitting={isCreating || isUpdating}
        size="2xl"
      >
        <SimpleForm
          fields={formFields}
          initialData={selectedBooking || {}}
          formId="booking-form"
        />
      </UIModal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBookingToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
        itemName={bookingToDelete?.customer_name}
        isDeleting={isDeleting}
      />
    </div>
  );
}

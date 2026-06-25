import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// This will be replaced with your API URL later
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/bookings`,
    // Add auth headers if needed
    prepareHeaders: (headers, { getState }) => {
      // Add auth token from state if available
      // const token = getState().auth?.user?.access_token;
      // if (token) {
      //   headers.set("authorization", `Bearer ${token}`);
      // }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    // Get all bookings
    getBookings: builder.query({
      query: ({ page = 1, pageSize = 10, filters = {} } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("pageSize", pageSize);
        
        if (filters.status) params.append("status", filters.status);
        if (filters.date_from) params.append("date_from", filters.date_from);
        if (filters.date_to) params.append("date_to", filters.date_to);
        if (filters.staff_id) params.append("staff_id", filters.staff_id);
        if (filters.service_id) params.append("service_id", filters.service_id);
        
        return {
          url: `?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Booking"],
    }),

    // Get single booking
    getBookingById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // Create booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Update booking
    updateBooking: builder.mutation({
      query: ({ id, ...bookingData }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: bookingData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }, "Booking"],
    }),

    // Delete booking
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Update booking status
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }, "Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useUpdateBookingStatusMutation,
} = bookingsApi;


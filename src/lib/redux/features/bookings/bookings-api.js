import { createApi } from "@reduxjs/toolkit/query/react";
import { buildListQueryParams } from "@/lib/api/list-query";
import { baseQueryWithReauth } from "@/lib/redux/api/base-query";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    // Get all bookings (filters based on - date, status, member_id, page and limit)
    getBookings: builder.query({
      query: (params = {}) => `/v1/bookings${buildListQueryParams(params)}`,
      providesTags: ["Booking"],
    }),

    // Get single booking
    getBookingById: builder.query({
      query: (id) => `/v1/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // Create booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/v1/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Update booking (keep for compatibility, fallback to standard path)
    updateBooking: builder.mutation({
      query: ({ id, ...bookingData }) => ({
        url: `/v1/bookings/${id}`,
        method: "PATCH",
        body: bookingData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Booking", id }, "Booking"],
    }),

    // Delete booking (keep for compatibility, fallback to standard path)
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/v1/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Cancel booking (PATCH - /v1/bookings/{id}/cancel)
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/v1/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Booking", id }, "Booking"],
    }),

    // Get me schedule (GET - /v1/bookings/me/schedule)
    getMeSchedule: builder.query({
      query: (params = {}) => `/v1/bookings/me/schedule${buildListQueryParams(params)}`,
    }),

    // Get availability slots (POST - /v1/bookings/availability/slots)
    getAvailabilitySlots: builder.query({
      query: (body) => ({
        url: "/v1/bookings/availability/slots",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useCancelBookingMutation,
  useGetMeScheduleQuery,
  useGetAvailabilitySlotsQuery,
} = bookingsApi;



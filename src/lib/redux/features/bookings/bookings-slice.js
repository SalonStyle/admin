import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  selectedBooking: null,
  filters: {
    status: null,
    date_range: null, // { from: Date, to: Date } or null
    staff_id: null,
    service_id: null,
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  isLoading: false,
  error: null,
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setBookings,
  setSelectedBooking,
  setFilters,
  setPagination,
  setLoading,
  setError,
  resetFilters,
} = bookingsSlice.actions;

// Selectors
export const selectBookings = (state) => state.bookings?.bookings || [];
export const selectSelectedBooking = (state) => state.bookings?.selectedBooking || null;
export const selectFilters = (state) => state.bookings?.filters || initialState.filters;
export const selectPagination = (state) => state.bookings?.pagination || initialState.pagination;
export const selectBookingsLoading = (state) => state.bookings?.isLoading || false;
export const selectBookingsError = (state) => state.bookings?.error || null;

export default bookingsSlice.reducer;


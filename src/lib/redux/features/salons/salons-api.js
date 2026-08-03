import { createApi } from "@reduxjs/toolkit/query/react"
import { unwrapListResponse, unwrapAuthResponse, unwrapApiResponse } from "@/lib/api/unwrap-response"
import { AUTH_API_PATHS } from "@/lib/auth/constants"
import { baseQueryWithReauth } from "@/lib/redux/api/base-query"

export const salonsApi = createApi({
  reducerPath: "salonsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Salon"],
  endpoints: (builder) => ({
    getSalons: builder.query({
      query: (params) => ({
        url: "/v1/salons",
        params,
      }),
      transformResponse: unwrapListResponse,
      providesTags: ["Salon"],
    }),
    createSalon: builder.mutation({
      query: (payload) => ({
        url: AUTH_API_PATHS.SIGN_UP,
        method: "POST",
        body: payload,
      }),
      transformResponse: unwrapAuthResponse,
      invalidatesTags: ["Salon"],
    }),
    getSalonMe: builder.query({
      query: () => "/v1/salons/me",
      providesTags: ["Salon"],
    }),
    updateSalonMe: builder.mutation({
      query: (payload) => ({
        url: "/v1/salons/me",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Salon"],
    }),
    updateSalon: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/v1/salons/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Salon"],
    }),
    getOnboardingMe: builder.query({
      query: (token) => ({
        url: "/v1/onboarding/me",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: unwrapApiResponse,
    }),
    updateOnboardingMe: builder.mutation({
      query: ({ token, payload }) => ({
        url: "/v1/onboarding/me",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }),
      transformResponse: unwrapApiResponse,
    }),
  }),
})

export const {
  useGetSalonsQuery,
  useCreateSalonMutation,
  useGetSalonMeQuery,
  useUpdateSalonMeMutation,
  useUpdateSalonMutation,
  useGetOnboardingMeQuery,
  useLazyGetOnboardingMeQuery,
  useUpdateOnboardingMeMutation,
} = salonsApi


import { createApi } from "@reduxjs/toolkit/query/react"
import { unwrapListResponse } from "@/lib/api/unwrap-response"
import { AUTH_API_PATHS } from "@/lib/auth/constants"
import { baseQueryWithReauth } from "@/lib/redux/api/base-query"

export const salonsApi = createApi({
  reducerPath: "salonsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Salon"],
  endpoints: (builder) => ({
    getSalons: builder.query({
      query: () => "/v1/salons",
      transformResponse: unwrapListResponse,
      providesTags: ["Salon"],
    }),
    createSalon: builder.mutation({
      query: (payload) => ({
        url: AUTH_API_PATHS.SIGN_UP,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Salon"],
    }),
  }),
})

export const { useGetSalonsQuery, useCreateSalonMutation } = salonsApi

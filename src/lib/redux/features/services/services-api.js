import { createApi } from "@reduxjs/toolkit/query/react"
import { buildListQueryParams } from "@/lib/api/list-query"
import { baseQueryWithReauth } from "@/lib/redux/api/base-query"

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (params = {}) => `/v1/services${buildListQueryParams(params)}`,
      providesTags: ["Service"],
    }),
    getServiceById: builder.query({
      query: (id) => `/v1/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation({
      query: (serviceData) => ({
        url: "/v1/services",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...serviceData }) => ({
        url: `/v1/services/${id}`,
        method: "PATCH",
        body: serviceData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Service", id }, "Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/v1/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi

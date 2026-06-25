import { createApi } from "@reduxjs/toolkit/query/react"
import { buildListQueryParams } from "@/lib/api/list-query"
import { baseQueryWithReauth } from "@/lib/redux/api/base-query"

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (params = {}) => `/v1/categories${buildListQueryParams(params)}`,
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query({
      query: (id) => `/v1/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/v1/categories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/v1/categories/${id}`,
        method: "PATCH",
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }, "Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/v1/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi

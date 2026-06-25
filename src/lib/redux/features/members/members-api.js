import { createApi } from "@reduxjs/toolkit/query/react"
import { buildListQueryParams } from "@/lib/api/list-query"
import { baseQueryWithReauth } from "@/lib/redux/api/base-query"

export const membersApi = createApi({
  reducerPath: "membersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Member"],
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: (params = {}) => `/v1/members${buildListQueryParams(params)}`,
      providesTags: ["Member"],
    }),
    createMember: builder.mutation({
      query: (memberData) => ({
        url: "/v1/members",
        method: "POST",
        body: memberData,
      }),
      invalidatesTags: ["Member"],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/v1/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Member"],
    }),
  }),
})

export const {
  useGetMembersQuery,
  useCreateMemberMutation,
  useDeleteMemberMutation,
} = membersApi

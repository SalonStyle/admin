import { createApi } from "@reduxjs/toolkit/query/react"
import { AUTH_API_PATHS } from "@/lib/auth/constants"
import { unwrapAuthResponse, unwrapUserResponse } from "@/lib/api/unwrap-response"
import { baseQueryWithReauth } from "@/lib/redux/api/base-query"
import { setUser } from "@/lib/redux/features/auth/auth-slice"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API_PATHS.SIGN_IN,
        method: "POST",
        body: credentials,
      }),
      transformResponse: unwrapAuthResponse,
      invalidatesTags: ["Auth"],
    }),
    signUp: builder.mutation({
      query: (payload) => ({
        url: AUTH_API_PATHS.SIGN_UP,
        method: "POST",
        body: payload,
      }),
      transformResponse: unwrapAuthResponse,
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: AUTH_API_PATHS.REFRESH,
        method: "POST",
        body: { refresh_token: refreshToken },
      }),
      transformResponse: unwrapAuthResponse,
    }),
    logout: builder.mutation({
      query: () => ({
        url: AUTH_API_PATHS.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query({
      query: () => AUTH_API_PATHS.ME,
      transformResponse: (response) => ({
        user: unwrapUserResponse(response),
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.user) {
            dispatch(setUser(data.user))
          }
        } catch {
          // Handled by AuthInitializer on isError
        }
      },
      providesTags: ["Auth"],
    }),
  }),
})

export const {
  useSignInMutation,
  useSignUpMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi

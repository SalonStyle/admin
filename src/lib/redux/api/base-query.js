import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { unwrapAuthResponse } from "@/lib/api/unwrap-response"
import { AUTH_API_PATHS } from "@/lib/auth/constants"
import {
  clearAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthSession,
} from "@/lib/auth/token-storage"
import { getPrimaryRoleCode } from "@/lib/auth/permissions"
import { logout, setCredentials } from "@/lib/redux/features/auth/auth-slice"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken || getStoredAccessToken()

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    headers.set("Content-Type", "application/json")
    return headers
  },
})

export async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) {
    return result
  }

  const refreshToken = api.getState().auth?.refreshToken || getStoredRefreshToken()

  if (!refreshToken) {
    api.dispatch(logout())
    clearAuthSession()
    return result
  }

  const refreshResult = await rawBaseQuery(
    {
      url: AUTH_API_PATHS.REFRESH,
      method: "POST",
      body: { refresh_token: refreshToken },
    },
    api,
    extraOptions
  )

  if (!refreshResult.data) {
    api.dispatch(logout())
    clearAuthSession()
    return result
  }

  const credentials = unwrapAuthResponse(refreshResult.data)
  const roleCode = getPrimaryRoleCode(credentials.user)

  api.dispatch(setCredentials(credentials))
  persistAuthSession({
    access_token: credentials.access_token,
    refresh_token: credentials.refresh_token,
    roleCode,
  })

  return rawBaseQuery(args, api, extraOptions)
}

export { API_BASE_URL }

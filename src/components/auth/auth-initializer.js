"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { PUBLIC_ROUTES } from "@/lib/auth/constants"
import { getDefaultRouteForRole } from "@/lib/auth/routes"
import { getPrimaryRoleCode } from "@/lib/auth/permissions"
import {
  hydrateAuthSession,
  logout,
  selectAccessToken,
  selectIsAuthInitialized,
  selectIsAuthenticated,
  setInitialized,
} from "@/lib/redux/features/auth/auth-slice"
import { authApi, useGetMeQuery } from "@/lib/redux/features/auth/auth-api"
import { getStoredAuthSession } from "@/lib/auth/token-storage"

function isPublicPath(pathname) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

function SessionLoader() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#f3f3f3]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8850FF] border-t-transparent" />
        <p className="text-sm font-medium text-gray-500">Loading session...</p>
      </div>
    </div>
  )
}

export function AuthInitializer({ children }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const isPublicRoute = isPublicPath(pathname)

  const isInitialized = useSelector(selectIsAuthInitialized)
  const accessToken = useSelector(selectAccessToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    const session = getStoredAuthSession()

    if (session.accessToken) {
      dispatch(
        hydrateAuthSession({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        })
      )
    }

    dispatch(setInitialized())
  }, [dispatch])

  const shouldValidateSession = Boolean(accessToken) && !isPublicRoute

  const { isError, isSuccess, data } = useGetMeQuery(undefined, {
    skip: !shouldValidateSession,
  })

  useEffect(() => {
    if (!isError) return

    dispatch(logout())
    dispatch(authApi.util.resetApiState())
  }, [dispatch, isError])

  useEffect(() => {
    if (!isPublicRoute || !isSuccess || !data?.user) return
    const roleCode = getPrimaryRoleCode(data.user)
    router.replace(getDefaultRouteForRole(roleCode))
  }, [data, isPublicRoute, isSuccess, router])

  if (!isInitialized) {
    return <SessionLoader />
  }

  if (isPublicRoute) {
    return children
  }

  // Keep protected routes blocked until session is fully restored
  if (shouldValidateSession && !isAuthenticated) {
    return <SessionLoader />
  }

  return children
}

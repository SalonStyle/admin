"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function AuthGuard({ children, fallback = null }) {
  const router = useRouter()
  const { isAuthenticated, isInitialized, isLoading, accessToken, isLoggingOut } = useAuth()

  useEffect(() => {
    if (!isInitialized || isLoading || isLoggingOut) return

    // Session still restoring from cookies — AuthInitializer handles this
    if (accessToken && !isAuthenticated) return

    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [accessToken, isAuthenticated, isInitialized, isLoading, isLoggingOut, router])

  if (!isInitialized || isLoading || isLoggingOut) {
    return (
      fallback || (
        <div className="flex min-h-svh w-full items-center justify-center bg-[#f3f3f3]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

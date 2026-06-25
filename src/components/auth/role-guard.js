"use client"

import { useAuth } from "@/hooks/useAuth"
import { hasRole } from "@/lib/auth/permissions"

export function RoleGuard({ roles, children, fallback = null }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return fallback
  }

  if (!user || !hasRole(user, roles)) {
    return fallback
  }

  return children
}

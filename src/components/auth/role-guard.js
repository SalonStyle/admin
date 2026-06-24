"use client";

import { useAuth } from "@/hooks/useAuth";
import { hasRole } from "@/lib/permissions";

/**
 * Component that renders children only if user has required role(s)
 * @param {Object} props
 * @param {string|string[]} props.roles - Required role(s)
 * @param {React.ReactNode} props.children - Children to render
 * @param {React.ReactNode} props.fallback - Optional fallback to render if user doesn't have role
 */
export function RoleGuard({ roles, children, fallback = null }) {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!profile || !hasRole(profile, roles)) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Component that renders children only if user has required permission
 * @param {Object} props
 * @param {string} props.permission - Required permission
 * @param {React.ReactNode} props.children - Children to render
 * @param {React.ReactNode} props.fallback - Optional fallback to render if user doesn't have permission
 */
export function PermissionGuard({ permission, children, fallback = null }) {
  const { hasPermission: checkPermission, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!checkPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}


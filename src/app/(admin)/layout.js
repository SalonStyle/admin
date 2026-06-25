"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/useAuth"
import { canAccessRoute, getDefaultRouteForRole } from "@/lib/auth/routes"

function RouteAccessGuard({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { primaryRole, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading || !primaryRole) return

    if (!canAccessRoute(primaryRole, pathname)) {
      router.replace(getDefaultRouteForRole(primaryRole))
    }
  }, [isLoading, pathname, primaryRole, router])

  return children
}

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <AuthGuard>
      <RouteAccessGuard>
        <div className="min-h-screen bg-[#f3f3f3]">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div
            className={`transition-all duration-300 ${
              collapsed ? "md:ml-16" : "md:ml-64"
            }`}
          >
            <main className="min-h-screen bg-[#f3f3f3] p-6">{children}</main>
          </div>
        </div>
      </RouteAccessGuard>
    </AuthGuard>
  )
}

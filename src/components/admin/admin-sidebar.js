"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Scissors,
  Tags,
  Calendar,
  ChevronLeft,
  Menu,
  ChevronDown,
  LogOut,
  Search,
  ChevronRight,
  Rocket,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { canAccessRoute } from "@/lib/auth/routes"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Salons",
    href: "/salons",
    icon: Store,
  },
  {
    title: "Services",
    href: "/services",
    icon: Scissors,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    title: "Members",
    href: "/members",
    icon: Users,
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: Calendar,
  },
]

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { user, signOut, isLoggingOut, primaryRole } = useAuth()

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => canAccessRoute(primaryRole, item.href)),
    [primaryRole]
  )

  const handleLogout = async () => {
    await signOut()
    router.replace("/login")
  }

  const displayName = user?.email?.split("@")[0] || "User"
  const roleLabel = primaryRole?.replace("_", " ")

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-5 left-4 z-50 border border-gray-200 bg-white shadow-sm md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen transition-all duration-300",
          "border-r border-gray-200 bg-[#f3f3f3] text-white",
          "md:translate-x-0",
          collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
          "w-64 md:w-64",
          collapsed && "md:w-18"
        )}
      >
        <div className="flex h-full flex-col">
          <div
            className={cn(
              "flex items-center justify-between px-4 py-4",
              collapsed && "md:justify-center"
            )}
          >
            {!collapsed && <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                onClick={() => setCollapsed(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="w-full px-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="search"
                placeholder={collapsed ? "" : "Search"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-10 w-full border-gray-200 bg-white text-gray-900 focus:border-[#8850FF] focus:ring-[#8850FF] ${collapsed ? "" : "pl-9 pr-8"}`}
              />
              {!collapsed && (
                <kbd className="pointer-events-none absolute right-2 top-1/2 inline-flex h-5 -translate-y-1/2 transform select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                  K
                </kbd>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setCollapsed(false)}
                  className={cn(
                    "relative mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#8850FF] text-white"
                      : "text-gray-900 hover:bg-gray-200 hover:text-gray-900",
                    collapsed && "md:justify-center md:px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {!collapsed && (
            <div className="mx-3 mb-3 rounded-lg border border-gray-200 bg-gray-200 p-4">
              <div className="flex items-start gap-3">
                <Rocket className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-900" />
                <div className="flex-1">
                  <p className="mb-1 text-sm font-semibold text-gray-900">Trial Ending Soon!</p>
                  <p className="mb-3 text-xs text-gray-400">
                    Your access expires in 6 days. Upgrade now for access!
                  </p>
                  <Button
                    size="sm"
                    className="h-8 w-full bg-[#8850FF] text-xs text-white hover:bg-[#8850FF]/90"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-auto w-full items-center gap-2 rounded-lg bg-gray-200 p-2",
                    collapsed ? "md:justify-center" : "justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8850FF] text-sm font-semibold text-white">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {!collapsed && (
                      <div className="flex min-w-0 flex-col text-left">
                        <span className="max-w-[150px] truncate text-sm font-medium text-gray-900">
                          {displayName}
                        </span>
                        <span className="max-w-[150px] truncate text-xs text-gray-500">
                          {user?.email}
                        </span>
                      </div>
                    )}
                  </div>
                  {!collapsed && <ChevronDown className="h-4 w-4 text-gray-400" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={collapsed ? "end" : "start"}
                side={collapsed ? "right" : "top"}
                className="w-56 bg-white"
              >
                <DropdownMenuLabel>
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="truncate text-sm font-medium text-gray-900">{user?.email}</p>
                  {roleLabel && <p className="text-xs text-gray-500">{roleLabel}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-[#8850FF]/10 hover:text-[#8850FF]"
                  disabled={isLoggingOut}
                  onSelect={(event) => {
                    event.preventDefault()
                    handleLogout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  )
}

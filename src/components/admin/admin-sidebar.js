"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  User,
  X,
  Search,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
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
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: Calendar,
  },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  
  const handleLogout = async () => {
    try {
      // Sign out from Supabase to clear session cookies
      
      // Clear Redux state
      
      // Refresh router to ensure middleware picks up the cleared session
      router.refresh()
      // Navigate using Next.js router for proper client-side navigation
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      // Even on error, clear state and redirect to login
      router.refresh()
      router.push("/login")
    }
  }


  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-5 left-4 z-50 md:hidden bg-white border border-gray-200 shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar - Dark Theme */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen transition-all duration-300",
          "bg-[#f3f3f3] text-white border-r border-gray-200",
          // Mobile: slide in/out from left
          "md:translate-x-0",
          collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
          // Desktop: width changes
          "w-64 md:w-64",
          collapsed && "md:w-18"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Dashboard Header */}
          <div className={cn(
            "px-4 py-4 flex items-center justify-between",
            collapsed && "md:justify-center"
          )}>
            {!collapsed && (
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-200"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-200"
                onClick={() => setCollapsed(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Bar */}
          
            <div className={`w-full px-3`}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={collapsed ? "" : "Search"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-white h-10 border-gray-200 text-gray-900 focus:border-[#8850FF] focus:ring-[#8850FF] ${collapsed ? "" : "pl-9 pr-8"}`}
                />
                {!collapsed && <kbd className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                  K
                </kbd>}
              </div>
            </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setCollapsed(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all mb-1 relative",
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
              );
            })}
          </nav>

          {/* Trial Card */}
          {!collapsed && (
            <div className="mx-3 mb-3 p-4 rounded-lg bg-gray-200 border border-gray-200">
              <div className="flex items-start gap-3">
                <Rocket className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Trial Ending Soon!</p>
                  <p className="text-xs text-gray-400 mb-3">
                    Your access expires in 6 days. Upgrade now for access!
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-[#8850FF] hover:bg-[#8850FF]/90 text-white text-xs h-8"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center h-auto gap-2 bg-gray-200 p-2 rounded-lg",
                    collapsed ? "md:justify-center" : "justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8850FF] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {/* {user?.email?.charAt(0).toUpperCase()} */}
                      H
                    </div>
                    {!collapsed && (
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                          {/* {user?.email?.split("@")[0]} */}
                          Harhist Bakraniya
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[100px]">
                          {/* {user?.email} */}
                          harshit@gmail.com
                        </span>
                      </div>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={collapsed ? "end" : "start"}
                side={collapsed ? "right" : "top"}
                className="w-56 bg-white"
              >
                <DropdownMenuLabel>
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {/* {user?.email} */}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-[#8850FF]/10 hover:text-[#8850FF]"
                  onSelect={(event) => {
                    event.preventDefault();
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}


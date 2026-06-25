"use client";

import {
  LayoutDashboard,
  Users,
  Scissors,
  Calendar,
  BarChart2,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, href: "/", label: "Dashboard" },
    { icon: Users, href: "/members", label: "Members" },
    { icon: Scissors, href: "/services", label: "Services" },
    { icon: Calendar, href: "/bookings", label: "Bookings" },
    // { icon: BarChart2, href: "/reports", label: "Reports" },
    // { icon: MessageSquare, href: "/messages", label: "Messages" },
    // { icon: Settings, href: "/settings", label: "Settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden ",
          collapsed ? "hidden" : "block"
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 px-2 h-full bg-[#0f172a] text-white flex flex-col transition-all duration-300 lg:relative rounded-xl",
          collapsed ? "w-[60px]" : "w-[220px]",
          "lg:z-0"
        )}
      >
        <div className={`flex items-center justify-between border-b border-gray-800 gap-4 mt-3 pb-2 mb-2 ${collapsed ? "mx-auto" : ""}`}>
          {!collapsed && (
            <div className="flex items-center">
              {/* <div className="bg-blue-500 rounded-full p-2">
                <Scissors className="h-5 w-5 text-white" />
              </div> */}
              <span className="ml-3 text-lg font-bold">Barber</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex text-white hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="py-2 rounded-lg overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center py-2 mx-2 rounded-md",
                      collapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        isActive ? "bg-indigo-600 hover:bg-indigo-700 hover:opacity-90" : "bg-slate-200"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-white" : "text-slate-800"
                        )}
                      />
                    </div>
                    {!collapsed && (
                      <span
                        className={cn(
                          "ml-3",
                          isActive ? "text-white font-medium hover:text-white hover:opacity-90" : "text-gray-300"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

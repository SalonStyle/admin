"use client";

import AdminSidebar from "@/components/admin/admin-sidebar";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);    
  // Show loading state while redirecting (prevents blank screen)


  return (
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
  );
}


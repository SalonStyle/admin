"use client";

import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext(undefined);

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize with localStorage value if available
  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setCollapsed(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (mounted) {
      localStorage.setItem("sidebarCollapsed", String(newState));
    }
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      <div className="p-3 h-full">{children}</div>
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

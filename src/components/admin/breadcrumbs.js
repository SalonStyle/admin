"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items }) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || (() => {
    const paths = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Dashboard", href: "/" }];
    
    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      crumbs.push({
        label,
        href: currentPath,
        isLast: index === paths.length - 1,
      });
    });
    
    return crumbs;
  })();

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <div key={item.href || index} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 hover:text-gray-900 transition-colors",
                  isLast && "text-gray-900 font-medium"
                )}
              >
                <Home className="h-4 w-4" />
                {item.label}
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
            {item.count !== undefined && (
              <span className="text-gray-500 ml-1">{item.count}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}


"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";

export function TableSkeleton({
  columns,
  rows = 5,
  searchField = true,
  showActions = true,
  showCheckbox = false,
  showAddButton = true,
  addNewLabel = "Add New",
  title = "All Items",
}) {
  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 ml-10 md:ml-0">{title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {searchField && (
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." disabled className="pl-10 bg-white border-gray-200 rounded-lg h-10 shadow-none" />
              </div>
            )}
            {showAddButton && (
              <Button disabled className="shrink-0 bg-gradient-to-r from-[#4a52d9] to-[#141FBB] hover:opacity-90 rounded-lg h-10">
                <Plus className="mr-2 h-4 w-4" /> {addNewLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                {showCheckbox && (
                  <TableHead className="w-[50px] px-4">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                )}
                {columns.map((column, index) => (
                  <TableHead key={index} className="!text-gray-600/70 font-semibold text-sm px-4 py-3 capitalize">
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
                {showActions && (
                  <TableHead className="text-right text-gray-600/70 font-semibold text-sm px-4 py-3 capitalize">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-gray-100">
                  {showCheckbox && (
                    <TableCell className="px-4 py-4">
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="px-4 py-4">
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


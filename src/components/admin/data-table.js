"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FilterBar, FILTER_TYPES } from "@/components/admin/filter-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  ChevronsLeft,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function DataTable({
  data,
  columns,
  searchField,
  onRowClick,
  actions,
  onAddNew,
  deleteSelectedEnable,
  deleteAllEnable,
  addNewLabel = "Add New",
  emptyMessage = "No data found",
  maxVisibleActions = 3,
  title = "All Items",
  subtitle,
  filters = [],
  onFilterChange,
  filterValues = {},
  enableInternalFiltering = true,
  manualPagination = false,
  totalCount = 0,
  page: externalPage = 1,
  pageSize: externalPageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  searchValue: externalSearchValue,
}) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const searchTerm =
    externalSearchValue !== undefined ? externalSearchValue : internalSearchTerm;
  const [selectedRows, setSelectedRows] = useState([]);
  const [internalFilterValues, setInternalFilterValues] = useState({});
  const paginationOptions = [10, 25, 50, 100];
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const currentPage = manualPagination ? Number(externalPage) : internalPage;
  const pageSize = manualPagination ? externalPageSize : internalPageSize;

  // Use external filter values if provided, otherwise use internal state
  const activeFilterValues =
    Object.keys(filterValues).length > 0 ? filterValues : internalFilterValues;

  // Handle filter changes
  const handleFilterChange = (newFilterValues) => {
    if (onFilterChange) {
      onFilterChange(newFilterValues);
    } else if (enableInternalFiltering) {
      setInternalFilterValues(newFilterValues);
    }
    if (!manualPagination) {
      setInternalPage(1);
    }
  };

  // Apply search filter
  const searchFilteredData = useMemo(() => {
    if (onSearchChange || manualPagination || !searchField) return data || [];

    const dataArray = Array.isArray(data) ? data : [];
    return dataArray.filter((item) => {
      const searchValue =
        item && item[searchField] !== undefined && item[searchField] !== null
          ? item[searchField].toString().toLowerCase()
          : "";
      return searchValue.includes(searchTerm.toLowerCase());
    });
  }, [data, manualPagination, onSearchChange, searchField, searchTerm]);

  // Apply all filters (search + custom filters)
  const filteredData = useMemo(() => {
    let result = searchFilteredData;

    if (!enableInternalFiltering || manualPagination) {
      return result;
    }

    result = result.filter((item) => {
      return filters.every((filter) => {
        const filterValue = activeFilterValues[filter.id];

        // Skip filter if no value
        if (!filterValue && filterValue !== 0 && filterValue !== false) {
          return true;
        }

        const itemValue = item[filter.field || filter.id];

        switch (filter.type) {
          case FILTER_TYPES.SELECT:
            return String(itemValue) === String(filterValue);

          case FILTER_TYPES.DATE:
            if (!itemValue || !filterValue) return true;
            const itemDate = new Date(itemValue).toISOString().split("T")[0];
            const filterDate = new Date(filterValue)
              .toISOString()
              .split("T")[0];
            return itemDate === filterDate;

          case FILTER_TYPES.DATE_RANGE:
            if (!itemValue || !filterValue) return true;
            const itemDateValue = new Date(itemValue);
            const fromDate = filterValue.from
              ? new Date(filterValue.from)
              : null;
            const toDate = filterValue.to ? new Date(filterValue.to) : null;

            if (fromDate && itemDateValue < fromDate) return false;
            if (toDate && itemDateValue > toDate) return false;
            return true;

          case FILTER_TYPES.TEXT:
            if (!itemValue || !filterValue) return true;
            return String(itemValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());

          case FILTER_TYPES.NUMBER:
            if (
              itemValue === undefined ||
              itemValue === null ||
              filterValue === undefined ||
              filterValue === null
            ) {
              return true;
            }
            const numValue = Number(itemValue);
            const numFilter = Number(filterValue);
            if (filter.operator === "greater_than")
              return numValue > numFilter;
            if (filter.operator === "less_than") return numValue < numFilter;
            if (filter.operator === "equals") return numValue === numFilter;
            return numValue === numFilter;

          default:
            return true;
        }
      });
    });

    return result;
  }, [
    searchFilteredData,
    activeFilterValues,
    filters,
    enableInternalFiltering,
    manualPagination,
  ]);

  const totalItems = manualPagination ? totalCount || 0 : filteredData.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  console.log(totalItems);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = manualPagination
    ? data || []
    : filteredData?.slice(startIndex, endIndex);

  const allCurrentPageSelected =
    currentData?.length > 0 &&
    currentData.every((item) =>
      selectedRows.includes(filteredData?.indexOf(item))
    );

  const goToPage = (page) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (manualPagination) {
      onPageChange?.(nextPage);
      return;
    }
    setInternalPage(nextPage);
  };

  const handleChangePageSize = (value) => {
    const newPageSize = parseInt(value, 10);
    if (manualPagination) {
      onPageSizeChange?.(newPageSize);
      return;
    }
    setInternalPageSize(newPageSize);
    const firstItemIndex = (currentPage - 1) * pageSize;
    const newPage = Math.floor(firstItemIndex / newPageSize) + 1;
    setInternalPage(
      Math.max(1, Math.min(newPage, Math.ceil(totalItems / newPageSize)))
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(filteredData.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (index, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, index]);
    } else {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    }
  };

  const renderActions = (row, rowIndex) => {
    if (!actions) return null;

    const actionElements = actions(row, rowIndex);

    if (!Array.isArray(actionElements)) return actionElements;

    if (actionElements.length <= maxVisibleActions) {
      return <div className="flex justify-end gap-2">{actionElements}</div>;
    }

    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actionElements.map((action, i) => (
              <DropdownMenuItem
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  const onClick = action.props.onClick;
                  if (onClick) onClick(e);
                }}
              >
                {action.props.children}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-600 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {searchField && (
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (onSearchChange) {
                      onSearchChange(value);
                    } else {
                      setInternalSearchTerm(value);
                      setInternalPage(1);
                    }
                  }}
                  className="pl-10 bg-white border-gray-200 rounded-lg h-10 shadow-none"
                />
              </div>
            )}
            {onAddNew && (
              <Button
                onClick={onAddNew}
                className="shrink-0 bg-primary hover:bg-primary/90 rounded-lg h-10 text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" /> {addNewLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {filters && filters.length > 0 && (
        <div>
          <FilterBar
            filters={filters}
            values={activeFilterValues}
            onChange={handleFilterChange}
            onClear={() => handleFilterChange({})}
          />
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto rounded-lg">
          <Table className="rounded-lg">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                {(deleteSelectedEnable || deleteAllEnable) && (
                  <TableHead className={cn(
                    "w-[50px] px-4 border-none",
                    "rounded-tl-lg"
                  )}>
                    <Checkbox
                      checked={allCurrentPageSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column, index) => {
                  const isFirst = index === 0 && !(deleteSelectedEnable || deleteAllEnable);
                  const isLast = index === columns.length - 1 && !actions;
                  return (
                    <TableHead
                      key={index}
                      className={cn(
                        "!text-gray-600 font-medium text-sm px-4 py-3 capitalize border-b border-gray-200",
                        isFirst && "rounded-tl-lg",
                        isLast && "rounded-tr-lg",
                        column.className
                      )}
                    >
                      {column.header}
                    </TableHead>
                  );
                })}
                {actions && (
                  <TableHead className="text-right text-gray-600 font-medium text-sm px-4 py-3 capitalize rounded-tr-lg border-b border-gray-200">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child_td:first-child]:rounded-bl-lg [&_tr:last-child_td:last-child]:rounded-br-lg">
              {currentData?.length === 0 ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell
                    colSpan={
                      columns.length +
                      (actions ? 1 : 0) +
                      (deleteSelectedEnable || deleteAllEnable ? 1 : 0)
                    }
                    className="text-center h-32 text-gray-500 px-4 bg-transparent hover:bg-transparent border-none rounded-b-lg"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.map((row, index) => {
                  const originalIndex = filteredData.indexOf(row);
                  const isLastRow = index === currentData.length - 1;
                  const totalCols = columns.length + (actions ? 1 : 0) + (deleteSelectedEnable || deleteAllEnable ? 1 : 0);

                  return (
                    <TableRow
                      key={index}
                      className={cn(
                        "bg-transparent hover:bg-gray-50/50 border-none",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {(deleteSelectedEnable || deleteAllEnable) && (
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "px-4 py-4 border-none",
                            isLastRow && "!rounded-bl-lg"
                          )}
                        >
                          <Checkbox
                            checked={selectedRows.includes(originalIndex)}
                            onCheckedChange={(checked) =>
                              handleSelectRow(originalIndex, checked)
                            }
                          />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => {
                        const isFirstCol = colIndex === 0;
                        const isLastCol = colIndex === columns.length - 1;
                        const isFirstCell = isFirstCol;
                        const isLastCell = isLastCol;

                        return (
                          <TableCell
                            key={colIndex}
                            className={cn(
                              "px-4 py-4 font-medium text-[#272829] text-[0.95rem] border-none",
                              isLastRow && isFirstCell && "!rounded-bl-lg",
                              isLastRow && isLastCell && "!rounded-br-lg",
                              column.className
                            )}
                          >
                            {column.cell
                              ? column.cell(row)
                              : row[column.accessorKey]}
                          </TableCell>
                        );
                      })}
                      {actions && (
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "px-4 py-4 border-none",
                            isLastRow && "!rounded-br-lg"
                          )}
                        >
                          {renderActions(row, originalIndex)}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(manualPagination ? totalItems > pageSize : totalPages > 1) && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing data {Math.min(totalItems, 1 + startIndex)} to {endIndex}{" "}
              of {totalItems.toLocaleString()} entries
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-600"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-600"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 7;

                  if (totalPages <= maxVisible) {
                    // Show all pages if total is less than max
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);

                    if (currentPage <= 4) {
                      // Show first 5 pages
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i);
                      }
                      pages.push("...");
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 3) {
                      // Show last 5 pages
                      pages.push("...");
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Show pages around current
                      pages.push("...");
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                      }
                      pages.push("...");
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 min-w-8 rounded-lg text-sm font-medium",
                          currentPage === page
                            ? "bg-primary text-primary-foreground border-0 shadow-sm"
                            : "border-gray-200 hover:bg-gray-50 text-gray-600 bg-white"
                        )}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  });
                })()}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-600"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-600"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

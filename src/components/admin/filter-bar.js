"use client";

import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterDatePicker } from "@/components/admin/filter-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const FILTER_TYPES = {
  SELECT: "select",
  DATE: "date",
  DATE_RANGE: "date_range",
  NUMBER: "number",
  TEXT: "text",
};

export function FilterBar({ filters = [], values = {}, onChange, onClear, className }) {
  const [openFilters, setOpenFilters] = React.useState({});

  const appliedFilters = React.useMemo(() => {
    return filters.filter((filter) => {
      const value = values[filter.id];
      if (value === null || value === undefined || value === "") return false;
      if (filter.type === FILTER_TYPES.DATE_RANGE) {
        return (value?.from || value?.to) ? true : false;
      }
      return true;
    });
  }, [filters, values]);

  const handleFilterChange = (filterId, newValue) => {
    onChange({
      ...values,
      [filterId]: newValue,
    });
  };

  const handleRemoveFilter = (filterId) => {
    const newValues = { ...values };
    delete newValues[filterId];
    onChange(newValues);
  };

  const handleClearAll = () => {
    onChange({});
    if (onClear) onClear();
  };

  const toggleFilter = (filterId) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const formatFilterValue = (filter, value) => {
    if (filter.formatValue) {
      return filter.formatValue(value);
    }

    switch (filter.type) {
      case FILTER_TYPES.SELECT:
        const option = filter.options?.find((opt) => opt.value === value);
        return option?.label || value;
      
      case FILTER_TYPES.DATE:
        return value ? format(new Date(value), "MMM d, yyyy") : "";
      
      case FILTER_TYPES.DATE_RANGE:
        if (value?.from && value?.to) {
          return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`;
        }
        if (value?.from) {
          return `Starting from ${format(value.from, "MMM d, yyyy")}`;
        }
        return "";
      
      case FILTER_TYPES.NUMBER:
        if (filter.operator) {
          return `${filter.label}: ${filter.operator} ${value}`;
        }
        return `${filter.label}: ${value}`;
      
      case FILTER_TYPES.TEXT:
        return value;
      
      default:
        return String(value);
    }
  };

  const renderFilterContent = (filter) => {
    const value = values[filter.id];
    const isPopoverOpen = openFilters[filter.id];

    switch (filter.type) {
      case FILTER_TYPES.SELECT:
        return (
          <div className="py-1">
            {filter.options?.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  handleFilterChange(filter.id, option.value);
                  setOpenFilters((prev) => ({ ...prev, [filter.id]: false }));
                }}
              >
                {option.label}
                {value === option.value && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        );

      case FILTER_TYPES.DATE:
        return (
          <FilterDatePicker
            date={value ? new Date(value) : undefined}
            onDateChange={(date) => {
              handleFilterChange(filter.id, date ? date.toISOString().split("T")[0] : null);
              // Close popover after date selection
              setOpenFilters((prev) => ({ ...prev, [filter.id]: false }));
            }}
          />
        );

      case FILTER_TYPES.DATE_RANGE:
        return (
          <FilterDatePicker
            mode="range"
            date={value}
            onDateChange={(dateRange) => {
              handleFilterChange(filter.id, dateRange);
              // Close popover after date range is complete
              if (dateRange?.from && dateRange?.to) {
                setOpenFilters((prev) => ({ ...prev, [filter.id]: false }));
              }
            }}
          />
        );

      case FILTER_TYPES.NUMBER:
        return (
          <div className="p-2 space-y-2">
            {filter.operator && (
              <Select
                value={filter.operator}
                onValueChange={(op) => {
                  // Store operator in filter config or handle separately
                }}
              >
                <SelectTrigger className="w-full border-none shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => {
                handleFilterChange(filter.id, e.target.value ? Number(e.target.value) : null);
              }}
              placeholder={filter.placeholder || `Enter ${filter.label}`}
              className="border-none shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
        );

      case FILTER_TYPES.TEXT:
        return (
          <div className="p-2">
            <Input
              type="text"
              value={value || ""}
              onChange={(e) => {
                handleFilterChange(filter.id, e.target.value || null);
              }}
              placeholder={filter.placeholder || `Enter ${filter.label}`}
              className="border-none shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Show all filters as chips */}
      {filters.map((filter) => {
        const value = values[filter.id];
        const hasValue = value !== null && value !== undefined && value !== "";
        const isDateRangeFilled = filter.type === FILTER_TYPES.DATE_RANGE 
          ? (value?.from || value?.to)
          : false;
        const isFilterApplied = hasValue || isDateRangeFilled;
        const displayValue = isFilterApplied 
          ? formatFilterValue(filter, value)
          : filter.placeholder || `Select ${filter.label}`;

        return (
          <Popover
            key={filter.id}
            open={openFilters[filter.id]}
            onOpenChange={(open) => setOpenFilters((prev) => ({ ...prev, [filter.id]: open }))}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3 text-xs bg-white border-none"
              >
                <span className="font-medium">{filter.label}:</span>
                <span className={cn(
                  isFilterApplied ? "text-foreground" : "text-muted-foreground"
                )}>
                  {displayValue}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
                {isFilterApplied && (
                  <X
                    className="h-3 w-3 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFilter(filter.id);
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className={cn(
                filter.type === FILTER_TYPES.DATE || filter.type === FILTER_TYPES.DATE_RANGE 
                  ? "w-auto p-0" 
                  : filter.type === FILTER_TYPES.SELECT
                  ? "w-[200px] p-1"
                  : "w-64 p-2"
              )} 
              align="start"
              onOpenAutoFocus={(e) => {
                // Prevent auto focus on popover open for select
                if (filter.type === FILTER_TYPES.SELECT) {
                  e.preventDefault();
                }
              }}
            >
              {renderFilterContent(filter)}
            </PopoverContent>
          </Popover>
        );
      })}

      {/* Clear All Button */}
      {appliedFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleClearAll}
        >
          <X className="h-3 w-3" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export { FILTER_TYPES };


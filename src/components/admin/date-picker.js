"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Select date",
  className,
  label,
  disabled,
  fromDate,
  toDate,
  mode = "single", // "single" | "range"
  ...props
}) {
  const [open, setOpen] = React.useState(false);

  const displayValue = React.useMemo(() => {
    if (!date) return placeholder;
    if (mode === "range" && date.from && date.to) {
      return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
    }
    if (mode === "range" && date.from) {
      return `Starting from ${format(date.from, "MMM d, yyyy")}`;
    }
    if (mode === "single" && date) {
      return format(date, "MMM d, yyyy");
    }
    return placeholder;
  }, [date, placeholder, mode]);

  // DatePicker for forms - always shows with button trigger
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground px-1">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {displayValue}
            </span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode={mode}
            selected={date}
            onSelect={(selectedDate) => {
              if (mode === "range") {
                onDateChange(selectedDate);
                // Auto-close when range is complete
                if (selectedDate?.from && selectedDate?.to) {
                  setOpen(false);
                }
              } else {
                onDateChange(selectedDate);
                setOpen(false);
              }
            }}
            fromDate={fromDate}
            toDate={toDate}
            numberOfMonths={mode === "range" ? 2 : 1}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


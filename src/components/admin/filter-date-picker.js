"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

/**
 * FilterDatePicker - For use in FilterBar
 * Renders just the Calendar component without any trigger button
 */
export function FilterDatePicker({
  date,
  onDateChange,
  fromDate,
  toDate,
  mode = "single", // "single" | "range"
  ...props
}) {
  return (
    <Calendar
      mode={mode}
      selected={date}
      onSelect={(selectedDate) => {
        onDateChange(selectedDate);
        // Popover closing is handled by the parent (FilterBar)
      }}
      fromDate={fromDate}
      toDate={toDate}
      numberOfMonths={mode === "range" ? 2 : 1}
      {...props}
    />
  );
}


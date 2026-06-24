"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Combobox({
  options = [],
  value,
  onValueChange,
  placeholder = "Select or type...",
  allowCustom = true,
  className,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const containerRef = React.useRef(null);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  // Check if current value is in options
  const isCustomValue = value && !options.includes(value);

  // Update search value when value changes externally
  React.useEffect(() => {
    setSearchValue(value || "");
  }, [value]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setIsOpen(true);
    onValueChange(newValue);
    setHighlightedIndex(-1);
  };

  const handleSelect = (option) => {
    setSearchValue(option);
    onValueChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
      setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      } else if (allowCustom && searchValue) {
        // Use current search value as custom value
        onValueChange(searchValue);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
    onValueChange("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="pr-8"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <div className="p-1">
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm cursor-pointer rounded-sm hover:bg-gray-100",
                    value === option && "bg-gray-100",
                    highlightedIndex === index && "bg-gray-100"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </div>
              ))}
              {allowCustom && searchValue && !options.includes(searchValue) && (
                <>
                  <div className="border-t my-1" />
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    Press Enter to use "{searchValue}"
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-3 text-sm text-muted-foreground text-center">
              {allowCustom && searchValue ? (
                <div>
                  <div>No match found</div>
                  <div className="text-xs mt-1">Press Enter to use "{searchValue}"</div>
                </div>
              ) : (
                "No options available"
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/admin/date-picker";

export const SimpleForm = forwardRef(function SimpleForm(
  { fields, initialData = {}, formId = "dynamic-form", onFormChange },
  ref
) {
  const [formValues, setFormValues] = useState(initialData);

  useEffect(() => {
    setFormValues(initialData);
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    getValues: () => formValues,
  }));

  // Update form data attribute when formValues change
  useEffect(() => {
    if (typeof document !== "undefined") {
      const form = document.getElementById(formId);
      if (form) {
        form.setAttribute("data-form-values", JSON.stringify(formValues));
      }
    }
  }, [formValues, formId]);

  const handleChange = (id, value) => {
    const newValues = { ...formValues, [id]: value };
    setFormValues(newValues);
    if (onFormChange) {
      onFormChange(newValues);
    }
  };

  const renderField = (field) => {
    const value = formValues[field.id] || "";

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "tel":
      case "time":
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="focus-visible:ring-[1px] shadow-none"
            step={field.step}
            required={field.required}
          />
        );
      case "date":
        return (
          <DatePicker
            date={value ? new Date(value) : undefined}
            onDateChange={(date) => {
              handleChange(field.id, date ? date.toISOString().split("T")[0] : "");
            }}
            placeholder={field.placeholder || "Select date"}
            label=""
            className="w-full"
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="focus-visible:ring-[1px] shadow-none"
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
            <SelectTrigger id={field.id} className="w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  // Create a form that can be submitted
  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        return false;
      }}
      data-form-values={JSON.stringify(formValues)}
    >
      <div className="grid grid-cols-12 gap-4">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`${field.col || "col-span-12"} ${field.mobileCol || ""}`}
          >
            <Label htmlFor={field.id} className="mb-2">
              {field.label}
            </Label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </form>
  );
});


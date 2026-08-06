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
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";

export const SimpleForm = forwardRef(function SimpleForm(
  { fields, initialData = {}, formId = "dynamic-form", onFormChange },
  ref
) {
  const [formValues, setFormValues] = useState(initialData);

  useEffect(() => {
    setFormValues(initialData);
  }, [initialData]);

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => formValues,
      reset: (values = initialData) => setFormValues(values),
    }),
    [formValues, initialData]
  );

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
      case "password":
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
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={!!value}
              onCheckedChange={(checked) => handleChange(field.id, checked)}
            />
          </div>
        );
      case "image":
        let previewUrl = "";
        if (value) {
          if (typeof value === "string") {
            previewUrl = value;
          } else if (value instanceof File) {
            previewUrl = URL.createObjectURL(value);
          }
        }
        return (
          <div className="flex flex-col gap-2">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover border"
              />
            )}
            <Input
              id={field.id}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange(field.id, file);
                } else {
                  handleChange(field.id, "");
                }
              }}
              className="focus-visible:ring-[1px] shadow-none"
              required={field.required && !value}
            />
          </div>
        );
      case "multi-select":
        return (
          <MultiSelect
            options={field.options || []}
            selected={Array.isArray(value) ? value : []}
            onChange={(newVal) => handleChange(field.id, newVal)}
            placeholder={field.placeholder || "Select items..."}
          />
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


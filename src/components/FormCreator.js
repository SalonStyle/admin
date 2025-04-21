import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FormCreator({ open, onOpenChange, fields, onSubmit }) {
  const [formValues, setFormValues] = useState({});

  const handleChange = (id, value) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "date":
      case "time":
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="focus-visible:ring-[2px] shadow-none focus-visible:ring-ring/10 focus-visible:ring-destructive/10"
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="focus-visible:ring-[2px] shadow-none focus-visible:ring-ring/10 focus-visible:ring-destructive/10"
          />
        );
      case "select":
        return (
          <Select onValueChange={(value) => handleChange(field.id, value)}>
            <SelectTrigger id={field.id} className="w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogDescription>Fill in the information below.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4 py-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className={`${field.col || "col-span-12"} ${
                field.mobileCol || ""
              }`}
            >
              <Label htmlFor={field.id} className="mb-2">
                {field.label}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 cursor-pointer text-white"
            onClick={() => {
              onSubmit(formValues);
              onOpenChange(false);
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

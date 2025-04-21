// components/FormDialog.js
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormDialog({
  title,
  description,
  triggerLabel,
  fields,
  onSubmit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>{triggerLabel}</div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div className="grid gap-2" key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>

              {field.type === "select" ? (
                <Select onValueChange={(val) => handleChange(field.name, val)}>
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue
                      placeholder={field.placeholder || "Select..."}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 text-white" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

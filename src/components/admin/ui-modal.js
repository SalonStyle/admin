"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function collectFormData(contentArea, formId, formRef) {
  if (formRef?.current?.getValues) {
    return formRef.current.getValues();
  }

  const form =
    contentArea?.querySelector(`form#${formId}`) ||
    contentArea?.querySelector("form") ||
    document.getElementById(formId);

  if (!form) {
    return null;
  }

  const formDataAttr = form.getAttribute("data-form-values");
  if (formDataAttr) {
    try {
      return JSON.parse(formDataAttr);
    } catch (error) {
      console.error("Failed to parse form data", error);
    }
  }

  const entries = new FormData(form);
  return Object.fromEntries(entries.entries());
}

export function UIModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "default",
  footer,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  isSubmitting = false,
  formRef,
  formId = "dynamic-form",
}) {
  const contentRef = useRef(null);
  const sizeClasses = {
    default: "sm:max-w-[425px]",
    lg: "sm:max-w-[600px]",
    xl: "sm:max-w-[800px]",
    "2xl": "sm:max-w-[1000px]",
    full: "sm:max-w-[95vw]",
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!onSubmit) {
      return;
    }

    const formData = collectFormData(contentRef.current, formId, formRef);

    if (formData) {
      onSubmit(formData);
      return;
    }

    console.warn(`UIModal: could not collect form data (formId="${formId}")`);
  };

  const shouldShowSubmit = Boolean(onSubmit || formRef || formId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${sizeClasses[size]} max-h-[90vh] flex flex-col p-0`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {(title || description) && (
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
            {title && (
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="mt-1">{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {children}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 flex-shrink-0 rounded-b-lg">
          <div className="flex justify-end gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
            {shouldShowSubmit && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(e);
                }}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Submitting..." : submitText}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

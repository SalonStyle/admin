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
    // Prevent event bubbling to parent modals
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Find form within this modal's content area only, not globally
    const contentArea = contentRef.current;
    let form = null;
    
    if (contentArea) {
      form = contentArea.querySelector(`form#${formId}`);
    }
    
    // Fallback: try global search (for backward compatibility)
    if (!form) {
      form = document.getElementById(formId);
    }
    
    // Try to get form data from data attribute (set by SimpleForm)
    if (form) {
      const formDataAttr = form.getAttribute("data-form-values");
      if (formDataAttr) {
        try {
          const formData = JSON.parse(formDataAttr);
          if (onSubmit) {
            onSubmit(formData);
            return;
          }
        } catch (e) {
          console.error("Failed to parse form data", e);
        }
      }
      
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
        return;
      }
    }
    
    // Other fallbacks
    if (formRef?.current) {
      formRef.current.submit();
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const shouldShowSubmit = Boolean(onSubmit || formRef || formId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${sizeClasses[size]} max-h-[90vh] flex flex-col p-0`}
      >
        {/* Fixed Header */}
        {(title || description) && (
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
            {title && <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>}
            {description && <DialogDescription className="mt-1">{description}</DialogDescription>}
          </DialogHeader>
        )}

        {/* Scrollable Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {children}
        </div>

        {/* Fixed Footer */}
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
                  className="bg-indigo-600 hover:bg-indigo-700 hover:opacity-90 text-white"
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


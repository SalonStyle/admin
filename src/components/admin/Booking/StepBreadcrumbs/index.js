import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEPS } from "@/lib/constant"

function StepBreadcrumbs({ currentStep, onStepClick, completedSteps }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.has(step.id);
        const isClickable = isCompleted && !isActive;

        return (
          <span key={step.id} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            )}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={cn(
                "transition-colors",
                isActive && "font-medium text-gray-900",
                isClickable && "hover:text-gray-700 cursor-pointer",
                !isActive && !isClickable && "cursor-default",
              )}
            >
              {step.label}
            </button>
          </span>
        );
      })}
    </nav>
  );
}

export default StepBreadcrumbs;

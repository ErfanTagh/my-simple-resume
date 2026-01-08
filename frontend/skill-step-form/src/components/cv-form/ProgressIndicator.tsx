import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (stepIndex: number) => void;
}

export const ProgressIndicator = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
}: ProgressIndicatorProps) => {
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

  const handleStepClick = (index: number) => {
    // Allow clicking on any step (forward or backward navigation)
    if (onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="relative pl-1 sm:pl-0">
        {/* Progress Bar */}
        <div className="absolute top-4 sm:top-5 left-0 h-1 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {stepLabels.map((label, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = onStepClick !== undefined;

            return (
              <div key={index} className="flex flex-col items-center flex-shrink-0">
                <div
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-background border-muted-foreground/30 text-muted-foreground",
                    isClickable && "cursor-pointer hover:scale-110 hover:shadow-md"
                  )}
                  title={isClickable ? `Click to go to: ${label}` : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <span className="text-xs sm:text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "hidden sm:block mt-2 text-xs font-medium text-center max-w-[80px] transition-colors duration-300",
                    index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

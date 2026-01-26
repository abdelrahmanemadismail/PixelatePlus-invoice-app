import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 0, label: 'Type' },
  { id: 1, label: 'Client Info' },
  { id: 2, label: 'Service Details' },
  { id: 3, label: 'Terms & Conditions' },
  { id: 4, label: 'Preview' },
];

interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

export function Stepper({ currentStep, onStepClick, completedSteps = [] }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || step.id < currentStep);

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                    'font-semibold text-sm border-2',
                    {
                      'bg-primary text-primary-foreground border-primary': isCurrent,
                      'bg-green-500 text-white border-green-500': isCompleted && !isCurrent,
                      'bg-muted text-muted-foreground border-muted': !isCurrent && !isCompleted,
                      'cursor-pointer hover:scale-110': isClickable,
                      'cursor-not-allowed': !isClickable,
                    }
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id + 1
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-sm font-medium text-center',
                    {
                      'text-foreground': isCurrent,
                      'text-green-600': isCompleted && !isCurrent,
                      'text-muted-foreground': !isCurrent && !isCompleted,
                    }
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all',
                    {
                      'bg-green-500': isCompleted,
                      'bg-primary': isCurrent,
                      'bg-muted': !isCurrent && !isCompleted,
                    }
                  )}
                  style={{ maxWidth: '120px' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

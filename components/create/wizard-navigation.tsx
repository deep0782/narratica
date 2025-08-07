'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Circle } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
}

interface WizardNavigationProps {
  steps: Step[]
  currentStep: number
  onStepClick: (stepIndex: number) => void
}

export function WizardNavigation({ steps, currentStep, onStepClick }: WizardNavigationProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-purple-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isClickable = index <= currentStep

            return (
              <div key={step.id} className="flex items-center">
                <Button
                  variant="ghost"
                  className={`flex flex-col items-center p-3 h-auto ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Circle className={`h-5 w-5 ${isCurrent ? 'fill-current' : ''}`} />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 max-w-20 leading-tight">
                      {step.description}
                    </div>
                  </div>
                </Button>

                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

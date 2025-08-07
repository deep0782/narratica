'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  onNext: () => void
  onPrevious: () => void
  isLastStep: boolean
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onNext,
  onPrevious,
  isLastStep
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
      <div>
        {currentStep > 0 ? (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        ) : (
          <div></div>
        )}
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Step {currentStep + 1} of {totalSteps}</span>
      </div>

      <div>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center space-x-2 ${
            isLastStep 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
              : ''
          }`}
        >
          {isLastStep ? (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Review & Generate</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

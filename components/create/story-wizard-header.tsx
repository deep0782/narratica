'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

interface StoryWizardHeaderProps {
  currentStep: number
  totalSteps: number
  stepTitle: string
  stepDescription: string
}

export function StoryWizardHeader({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  stepDescription 
}: StoryWizardHeaderProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Your Story</h1>
            <p className="text-sm text-gray-600">Step {currentStep + 1} of {totalSteps}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{stepTitle}</h2>
            <p className="text-gray-600">{stepDescription}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

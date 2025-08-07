'use client'

import { Progress } from '@/components/ui/progress'
import { BookOpen, Sparkles } from 'lucide-react'

interface StoryWizardHeaderProps {
  currentStep: number
  totalSteps: number
  title: string
}

export function StoryWizardHeader({ currentStep, totalSteps, title }: StoryWizardHeaderProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Story Creation Wizard
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </h1>
                <p className="text-gray-600">{title}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                Step {currentStep + 1} of {totalSteps}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(progress)}% Complete
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  )
}

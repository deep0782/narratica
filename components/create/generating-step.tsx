'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkles, BookOpen, Palette, Users, Film, Wand2 } from 'lucide-react'

const GENERATION_STEPS = [
  { id: 'analyzing', label: 'Analyzing your story', icon: BookOpen, duration: 2000 },
  { id: 'characters', label: 'Creating characters', icon: Users, duration: 3000 },
  { id: 'scenes', label: 'Structuring scenes', icon: Film, duration: 2500 },
  { id: 'artwork', label: 'Generating artwork', icon: Palette, duration: 4000 },
  { id: 'finalizing', label: 'Adding magical touches', icon: Wand2, duration: 2000 }
]

export function GeneratingStep() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let totalDuration = 0
    let currentDuration = 0

    // Calculate total duration
    GENERATION_STEPS.forEach(step => {
      totalDuration += step.duration
    })

    const runStep = (stepIndex: number) => {
      if (stepIndex >= GENERATION_STEPS.length) {
        setProgress(100)
        return
      }

      setCurrentStepIndex(stepIndex)
      const step = GENERATION_STEPS[stepIndex]
      
      // Animate progress for current step
      const stepStartProgress = (currentDuration / totalDuration) * 100
      const stepEndProgress = ((currentDuration + step.duration) / totalDuration) * 100
      
      let stepProgress = stepStartProgress
      const progressIncrement = (stepEndProgress - stepStartProgress) / (step.duration / 100)
      
      const progressInterval = setInterval(() => {
        stepProgress += progressIncrement
        setProgress(Math.min(stepProgress, stepEndProgress))
        
        if (stepProgress >= stepEndProgress) {
          clearInterval(progressInterval)
          currentDuration += step.duration
          setTimeout(() => runStep(stepIndex + 1), 200)
        }
      }, 100)
    }

    runStep(0)
  }, [])

  const currentStep = GENERATION_STEPS[currentStepIndex]
  const CurrentIcon = currentStep?.icon || Sparkles

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-purple-200 rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">Creating Your Magical Story</h2>
        <p className="text-gray-600">
          Our AI is working hard to bring your story to life with beautiful illustrations and engaging narration
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <CurrentIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentStep?.label || 'Preparing...'}
              </h3>
              <p className="text-sm text-gray-600">
                This may take a few moments...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Steps */}
      <div className="space-y-3">
        {GENERATION_STEPS.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isPending = index > currentStepIndex

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                isCompleted
                  ? 'bg-green-50 text-green-700'
                  : isCurrent
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-200'
                    : isCurrent
                    ? 'bg-purple-200 animate-pulse'
                    : 'bg-gray-200'
                }`}
              >
                <StepIcon className="h-4 w-4" />
              </div>
              <span className="font-medium">{step.label}</span>
              {isCompleted && (
                <div className="ml-auto">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fun Facts */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            Did You Know?
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Our AI analyzes thousands of children's stories to create the perfect narrative structure</p>
            <p>• Each illustration is uniquely generated based on your story's specific details</p>
            <p>• The average story generation uses advanced language models trained on educational content</p>
            <p>• Your story will be optimized for your child's age group and interests</p>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Time */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Estimated completion time: 2-3 minutes
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Creating something magical takes time! ✨
        </p>
      </div>
    </div>
  )
}

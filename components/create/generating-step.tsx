'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Wand2, Sparkles, BookOpen, Palette, CheckCircle } from 'lucide-react'

const GENERATION_STEPS = [
  { id: 'analyzing', label: 'Analyzing child profile', icon: Wand2, duration: 2000 },
  { id: 'crafting', label: 'Crafting personalized story', icon: BookOpen, duration: 3000 },
  { id: 'illustrating', label: 'Creating beautiful illustrations', icon: Palette, duration: 4000 },
  { id: 'finalizing', label: 'Adding magical touches', icon: Sparkles, duration: 2000 },
  { id: 'complete', label: 'Your story is ready!', icon: CheckCircle, duration: 1000 }
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

    const updateProgress = () => {
      if (currentStepIndex < GENERATION_STEPS.length - 1) {
        const currentStep = GENERATION_STEPS[currentStepIndex]
        currentDuration += currentStep.duration

        // Update progress
        const newProgress = (currentDuration / totalDuration) * 100
        setProgress(newProgress)

        // Move to next step
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1)
        }, currentStep.duration)
      }
    }

    updateProgress()
  }, [currentStepIndex])

  const currentStep = GENERATION_STEPS[currentStepIndex]
  const IconComponent = currentStep.icon

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-12 text-center">
          {/* Main Animation */}
          <div className="mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-8 inline-block mb-6">
                <IconComponent className="h-16 w-16 text-purple-600 animate-pulse" />
              </div>
              
              {/* Floating sparkles animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className={`absolute h-4 w-4 text-yellow-400 animate-bounce`}
                    style={{
                      left: `${20 + (i * 12)}%`,
                      top: `${30 + (i % 2) * 20}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Creating Your Magical Story
            </h3>
            <p className="text-lg text-purple-600 font-medium mb-4">
              {currentStep.label}
            </p>
            <p className="text-gray-600">
              Our AI is working its magic to create a personalized adventure just for your child
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Step Indicators */}
          <div className="space-y-3">
            {GENERATION_STEPS.slice(0, -1).map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-purple-50 border border-purple-200' 
                      : isCompleted 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-400 text-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive 
                      ? 'text-purple-900' 
                      : isCompleted 
                        ? 'text-green-900'
                        : 'text-gray-600'
                  }`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="ml-auto">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Fun Messages */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 italic">
              "Every great story begins with a single spark of imagination..."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

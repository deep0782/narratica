'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkles, BookOpen, Palette, Users, Film, Wand2, CheckCircle } from 'lucide-react'

const GENERATION_STEPS = [
  { id: 'analyzing', label: 'Analyzing your story', icon: BookOpen, duration: 2000 },
  { id: 'characters', label: 'Creating characters', icon: Users, duration: 3000 },
  { id: 'scenes', label: 'Structuring scenes', icon: Film, duration: 2500 },
  { id: 'artwork', label: 'Generating magical artwork', icon: Palette, duration: 12000 },
  { id: 'finalizing', label: 'Adding magical touches', icon: Wand2, duration: 2000 }
]

interface GeneratedImage {
  url: string
  prompt: string
  sceneId?: string
}

export function GeneratingStep() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentImagePrompt, setCurrentImagePrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  useEffect(() => {
    let totalDuration = 0
    let currentDuration = 0

    // Calculate total duration
    GENERATION_STEPS.forEach(step => {
      totalDuration += step.duration
    })

    const generateArtwork = async () => {
      setIsGeneratingImage(true)
      const imagePrompts = [
        'A magical forest with talking animals and sparkling trees',
        'A brave child character standing in a beautiful meadow',
        'A wise owl sitting on a branch with golden eyes',
        'A castle in the clouds with rainbow bridges',
        'Friends celebrating together in a magical garden'
      ]

      try {
        for (let i = 0; i < imagePrompts.length; i++) {
          const prompt = imagePrompts[i]
          setCurrentImagePrompt(prompt)
          
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: prompt,
              steps: 4,
              guidance_scale: 1.0
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            setGeneratedImages(prev => [...prev, {
              url: data.imageUrl,
              prompt: data.prompt,
              sceneId: `scene-${i + 1}`
            }])
          } else {
            console.error('Failed to generate image:', await response.text())
          }
          
          // Small delay between generations
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (error) {
        console.error('Failed to generate artwork:', error)
      } finally {
        setIsGeneratingImage(false)
        setCurrentImagePrompt('')
      }
    }

    const runStep = async (stepIndex: number) => {
      if (stepIndex >= GENERATION_STEPS.length) {
        setProgress(100)
        return
      }

      setCurrentStepIndex(stepIndex)
      const step = GENERATION_STEPS[stepIndex]

      // If this is the artwork step, trigger image generation
      if (step.id === 'artwork') {
        generateArtwork()
      }

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
    <div className="max-w-4xl mx-auto space-y-8">
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
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {currentStep?.label || 'Preparing...'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentStep?.id === 'artwork' && isGeneratingImage && currentImagePrompt
                  ? `Creating: ${currentImagePrompt}`
                  : 'This may take a few moments...'}
              </p>
            </div>
            {currentStep?.id === 'artwork' && generatedImages.length > 0 && (
              <div className="text-sm text-green-600 font-medium">
                {generatedImages.length} images generated
              </div>
            )}
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
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span className="font-medium flex-1">{step.label}</span>
              {step.id === 'artwork' && isCurrent && generatedImages.length > 0 && (
                <div className="text-xs text-purple-600">
                  {generatedImages.length}/5 images
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

      {/* Generated Images Preview */}
      {generatedImages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Generated Artwork ({generatedImages.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Generated scene ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fun Facts */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            Did You Know?
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Our AI analyzes thousands of children's stories to create the perfect narrative structure</p>
            <p>• Each illustration is uniquely generated using advanced AI models trained on children's book art</p>
            <p>• The story generation process considers your child's age group and educational themes</p>
            <p>• Every image is created fresh - no two stories will have identical illustrations</p>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Time */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Estimated completion time: 3-4 minutes
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Creating magical artwork takes time! ✨
        </p>
      </div>
    </div>
  )
}

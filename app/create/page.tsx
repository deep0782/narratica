'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StoryWizardHeader } from '@/components/create/story-wizard-header'
import { ChildSelectionStep } from '@/components/create/child-selection-step'
import { StoryPreferencesStep } from '@/components/create/story-preferences-step'
import { StoryDetailsStep } from '@/components/create/story-details-step'
import { ReviewStep } from '@/components/create/review-step'
import { GeneratingStep } from '@/components/create/generating-step'
import { WizardNavigation } from '@/components/create/wizard-navigation'
import { getCurrentUser, getProfile, trackUsage, isDatabaseAvailable } from '@/lib/supabase'
import type { ParentProfile, Child } from '@/lib/supabase'

export interface StoryFormData {
  // Child Selection
  selectedChild: Child | null
  newChildData?: {
    name: string
    age_group: 'toddlers' | 'elementary' | 'preteens'
    favorite_activities: string[]
    character_traits: string[]
  }
  
  // Story Preferences
  target_age_group: 'toddlers' | 'elementary' | 'preteens'
  educational_theme: string
  art_style: string
  story_length: 'short' | 'medium' | 'long'
  
  // Story Details
  story_description: string
  specific_elements: string[]
  moral_lesson?: string
  setting_preference?: string
  character_role: 'protagonist' | 'supporting' | 'narrator'
}

const WIZARD_STEPS = [
  { id: 'child', title: 'Select Child', description: 'Choose who will be the star of this story' },
  { id: 'preferences', title: 'Story Preferences', description: 'Set the theme and style' },
  { id: 'details', title: 'Story Details', description: 'Describe your story idea' },
  { id: 'review', title: 'Review & Generate', description: 'Review and create your story' },
  { id: 'generating', title: 'Creating Magic', description: 'AI is crafting your personalized story' }
]

export default function CreateStoryPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDatabaseReady, setIsDatabaseReady] = useState(false)
  const [formData, setFormData] = useState<StoryFormData>({
    selectedChild: null,
    target_age_group: 'elementary',
    educational_theme: '',
    art_style: '',
    story_length: 'medium',
    story_description: '',
    specific_elements: [],
    character_role: 'protagonist'
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Check if database is available
      const dbAvailable = await isDatabaseAvailable()
      setIsDatabaseReady(dbAvailable)

      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const userProfile = await getProfile(user.id)
      setProfile(userProfile)

      // Load mock children data (replace with real data when database is connected)
      setChildren(mockChildren)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock children data (replace with real data when database is connected)
  const mockChildren: Child[] = [
    {
      id: 'child-1',
      parent_id: 'user-1',
      name: 'Emma',
      age_group: 'elementary',
      favorite_activities: ['reading', 'drawing', 'playing outside'],
      character_traits: ['brave', 'curious', 'kind'],
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    },
    {
      id: 'child-2',
      parent_id: 'user-1',
      name: 'Alex',
      age_group: 'elementary',
      favorite_activities: ['building blocks', 'adventure games'],
      character_traits: ['adventurous', 'creative', 'helpful'],
      created_at: '2024-01-12T14:00:00Z',
      updated_at: '2024-01-12T14:00:00Z'
    }
  ]

  const updateFormData = (updates: Partial<StoryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Child Selection
        return formData.selectedChild !== null || formData.newChildData !== undefined
      case 1: // Story Preferences
        return formData.educational_theme && formData.art_style
      case 2: // Story Details
        return formData.story_description.trim().length > 0
      case 3: // Review
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleGenerateStory = async () => {
    try {
      setCurrentStep(4) // Move to generating step
      
      // Track usage (will be skipped if database not available)
      if (profile) {
        await trackUsage(profile.id, 'story_create', formData.selectedChild?.id)
      }

      // TODO: Implement actual story generation with AI
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Redirect to dashboard or story view
      router.push('/dashboard')
    } catch (error) {
      console.error('Error generating story:', error)
      // Handle error - maybe show error step or go back to review
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your story creation wizard...</p>
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ChildSelectionStep
            children={children}
            selectedChild={formData.selectedChild}
            newChildData={formData.newChildData}
            onChildSelect={(child) => updateFormData({ selectedChild: child, newChildData: undefined })}
            onNewChildData={(data) => updateFormData({ newChildData: data, selectedChild: null })}
          />
        )
      case 1:
        return (
          <StoryPreferencesStep
            formData={formData}
            onUpdate={updateFormData}
          />
        )
      case 2:
        return (
          <StoryDetailsStep
            formData={formData}
            onUpdate={updateFormData}
          />
        )
      case 3:
        return (
          <ReviewStep
            formData={formData}
            profile={profile}
            onGenerate={handleGenerateStory}
          />
        )
      case 4:
        return <GeneratingStep />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <StoryWizardHeader 
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length - 1} // Exclude generating step from progress
        stepTitle={WIZARD_STEPS[currentStep].title}
        stepDescription={WIZARD_STEPS[currentStep].description}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Database Status Banner (for development) */}
          {!isDatabaseReady && currentStep < 4 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> Database not connected. Story creation will use sample data.
                </p>
              </div>
            </div>
          )}

          {renderCurrentStep()}
          
          {currentStep < 4 && (
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={WIZARD_STEPS.length - 1}
              canProceed={canProceedToNext()}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLastStep={currentStep === 3}
            />
          )}
        </div>
      </div>
    </div>
  )
}

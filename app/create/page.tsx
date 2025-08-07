'use client'

import { useState, useEffect } from 'react'
import { StoryWizardHeader } from '@/components/create/story-wizard-header'
import { WizardNavigation } from '@/components/create/wizard-navigation'
import { ChildSelectionStep } from '@/components/create/child-selection-step'
import { StoryInputStep } from '@/components/create/story-input-step'
import { ArtStyleSelectionStep } from '@/components/create/art-style-selection-step'
import { CharacterManagementStep } from '@/components/create/character-management-step'
import { SceneManagementStep } from '@/components/create/scene-management-step'
import { StoryDetailsStep } from '@/components/create/story-details-step'
import { StoryPreferencesStep } from '@/components/create/story-preferences-step'
import { ReviewStep } from '@/components/create/review-step'
import { GeneratingStep } from '@/components/create/generating-step'
import { saveDraft, loadDraft, clearDraft } from '@/lib/draft-storage'

export interface StoryFormData {
  // Child Information
  child_name: string
  child_age: number
  child_interests: string[]
  child_photo?: File | null
  
  // Story Input
  story_input: string
  story_description: string
  specific_elements: string[]
  
  // Art Style
  art_style: string
  
  // Characters
  characters: Array<{
    id: string
    name: string
    description: string
    role: string
    appearance: string
    personality: string[]
    isMainCharacter: boolean
  }>
  
  // Scenes
  scenes: Array<{
    id: string
    title: string
    description: string
    characters: string[]
    setting: string
    mood: string
    order: number
  }>
  
  // Story Details
  title: string
  genre: string
  theme: string
  educational_theme: string
  moral_lesson: string
  
  // Story Preferences
  length: 'short' | 'medium' | 'long'
  reading_level: string
  language: string
  include_moral: boolean
  interactive_elements: boolean
  
  // Generated Content
  generated_title?: string
  generated_scenes?: Array<{
    id: string
    title: string
    content: string
    image_prompt: string
    image_url?: string
  }>
}

const initialFormData: StoryFormData = {
  child_name: '',
  child_age: 5,
  child_interests: [],
  child_photo: null,
  story_input: '',
  story_description: '',
  specific_elements: [],
  art_style: '',
  characters: [],
  scenes: [],
  title: '',
  genre: '',
  theme: '',
  educational_theme: '',
  moral_lesson: '',
  length: 'medium',
  reading_level: 'beginner',
  language: 'english',
  include_moral: true,
  interactive_elements: false,
}

const steps = [
  { id: 'child', title: 'Child Profile', description: 'Tell us about your child' },
  { id: 'input', title: 'Story Input', description: 'Share your story ideas' },
  { id: 'art', title: 'Art Style', description: 'Choose visual style' },
  { id: 'characters', title: 'Characters', description: 'Manage story characters' },
  { id: 'scenes', title: 'Scenes', description: 'Organize story scenes' },
  { id: 'details', title: 'Story Details', description: 'Set title and theme' },
  { id: 'preferences', title: 'Preferences', description: 'Customize your story' },
  { id: 'review', title: 'Review', description: 'Review and confirm' },
  { id: 'generating', title: 'Generating', description: 'Creating your story' },
]

export default function CreateStoryPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<StoryFormData>(initialFormData)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load draft on component mount
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setFormData(draft)
    }
  }, [])

  // Auto-save draft when form data changes
  useEffect(() => {
    if (formData.child_name || formData.story_input || formData.title) {
      saveDraft(formData)
    }
  }, [formData])

  const updateFormData = (updates: Partial<StoryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setCurrentStep(steps.length - 1) // Go to generating step
    
    // Simulate story generation
    setTimeout(() => {
      // Clear draft after successful generation
      clearDraft()
      // Redirect to generated story or show success
      window.location.href = '/story/generated-story-id'
    }, 5000)
  }

  const renderCurrentStep = () => {
    switch (steps[currentStep].id) {
      case 'child':
        return (
          <ChildSelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )
      case 'input':
        return (
          <StoryInputStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 'art':
        return (
          <ArtStyleSelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 'characters':
        return (
          <CharacterManagementStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 'scenes':
        return (
          <SceneManagementStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 'details':
        return (
          <StoryDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 'preferences':
        return (
          <StoryPreferencesStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 'review':
        return (
          <ReviewStep
            formData={formData}
            onGenerate={handleGenerate}
            onPrev={prevStep}
            onEdit={goToStep}
          />
        )
      case 'generating':
        return (
          <GeneratingStep
            formData={formData}
            isGenerating={isGenerating}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <StoryWizardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <WizardNavigation
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
          
          <div className="mt-8">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  )
}

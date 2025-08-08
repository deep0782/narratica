'use client'

import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react'
import { StoryFormData, initialFormData } from '@/app/create/page'

// 1. Define State and Action Types
interface WizardState {
  formData: StoryFormData
  currentStep: number
}

type WizardAction =
  | { type: 'UPDATE_FORM'; payload: Partial<StoryFormData> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET_WIZARD' }

interface WizardContextProps {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  updateForm: (payload: Partial<StoryFormData>) => void
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  resetWizard: () => void
}

// 2. Create Reducer
const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 }
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 }
    case 'RESET_WIZARD':
      return { formData: initialFormData, currentStep: 0 }
    default:
      return state
  }
}

// 3. Create Context
const WizardContext = createContext<WizardContextProps | undefined>(undefined)

// 4. Create Provider Component
interface WizardProviderProps {
  children: ReactNode
}

export const WizardProvider = ({ children }: WizardProviderProps) => {
  const [state, dispatch] = useReducer(wizardReducer, {
    formData: initialFormData,
    currentStep: 0,
  })

  const updateForm = (payload: Partial<StoryFormData>) => dispatch({ type: 'UPDATE_FORM', payload })
  const goToStep = (step: number) => dispatch({ type: 'SET_STEP', payload: step })
  const nextStep = () => dispatch({ type: 'NEXT_STEP' })
  const prevStep = () => dispatch({ type: 'PREV_STEP' })
  const resetWizard = () => dispatch({ type: 'RESET_WIZARD' })

  const value = useMemo(() => ({
    state,
    dispatch,
    updateForm,
    goToStep,
    nextStep,
    prevStep,
    resetWizard,
  }), [state])

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  )
}

// 5. Create Custom Hook
export const useWizard = () => {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}

// 6. (Optional) Create a hook for checking if the user can proceed
export const useCanProceed = () => {
  const { state } = useWizard()
  // Customize this logic based on what fields are required for each step
  const { storyDescription, educational_theme } = state.formData
  return storyDescription.trim().length > 0 && !!educational_theme
}
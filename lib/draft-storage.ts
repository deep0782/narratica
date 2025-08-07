import type { StoryFormData } from '@/app/create/page'

const DRAFT_KEY = 'narratica-story-draft'

export const autoSaveDraft = (formData: Partial<StoryFormData>) => {
  try {
    const draftData = {
      ...formData,
      lastSaved: new Date().toISOString()
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
  } catch (error) {
    console.error('Error saving draft:', error)
  }
}

export const loadDraft = (): Partial<StoryFormData> | null => {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Check if draft is less than 24 hours old
      const lastSaved = new Date(parsed.lastSaved)
      const now = new Date()
      const hoursDiff = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff < 24) {
        return parsed
      } else {
        // Clear old draft
        clearDraft()
      }
    }
  } catch (error) {
    console.error('Error loading draft:', error)
  }
  return null
}

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch (error) {
    console.error('Error clearing draft:', error)
  }
}

export const hasDraft = (): boolean => {
  return loadDraft() !== null
}

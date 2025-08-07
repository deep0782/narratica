import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Database types based on the PRD schema
export interface ParentProfile {
  id: string
  email: string
  full_name?: string
  guardian_type: 'parent' | 'guardian' | 'educator'
  subscription_tier: 'free' | 'premium' | 'pro'
  subscription_status: 'active' | 'canceled' | 'expired'
  subscription_expires_at?: string
  created_at: string
  updated_at: string
}

export interface Child {
  id: string
  parent_id: string
  name: string
  age_group: 'toddlers' | 'elementary' | 'preteens'
  favorite_activities: string[]
  character_traits: string[]
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  parent_id: string
  auto_generated_title: string
  story_description: string
  target_age_group: 'toddlers' | 'elementary' | 'preteens'
  educational_theme?: string
  art_style: string
  scene_count: number
  featured_children: string[]
  status: 'draft' | 'generating' | 'complete' | 'error'
  content_safety_approved: boolean
  exports: {
    pdf_url?: string
    video_url?: string
    last_exported?: string
  }
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  expires_at?: string
}

// Mock data for development/preview
const createMockProfile = (userId: string): ParentProfile => ({
  id: userId,
  email: 'demo@narratica.com',
  full_name: 'Demo Parent',
  guardian_type: 'parent',
  subscription_tier: 'free',
  subscription_status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})

// Auth helper functions
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    // Return mock user for development
    return {
      id: 'demo-user-id',
      email: 'demo@narratica.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as any
  }
}

export const getProfile = async (userId: string): Promise<ParentProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.warn('Database not available, using mock profile:', error)
    // Return mock profile for development/preview
    return createMockProfile(userId)
  }
}

export const createProfile = async (userId: string, profileData: Partial<ParentProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.warn('Database not available, returning mock profile:', error)
    // Return mock profile for development
    return createMockProfile(userId)
  }
}

// Usage tracking functions
export const trackUsage = async (
  parentId: string, 
  actionType: 'story_create' | 'character_generate' | 'export_pdf' | 'export_video',
  childId?: string,
  resourceId?: string
) => {
  try {
    const billingPeriod = new Date().toISOString().slice(0, 7) // YYYY-MM format
    
    const { error } = await supabase
      .from('usage_logs')
      .insert({
        parent_id: parentId,
        action_type: actionType,
        child_id: childId,
        resource_id: resourceId,
        billing_period: billingPeriod
      })
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.warn('Database not available, usage tracking skipped:', error)
    // In development, we just log the usage attempt
  }
}

// Get current month usage
export const getCurrentUsage = async (parentId: string) => {
  try {
    const billingPeriod = new Date().toISOString().slice(0, 7)
    
    const { data, error } = await supabase
      .from('usage_logs')
      .select('action_type')
      .eq('parent_id', parentId)
      .eq('billing_period', billingPeriod)
    
    if (error) {
      throw error
    }
    
    // Count usage by action type
    const usage = data.reduce((acc, log) => {
      acc[log.action_type] = (acc[log.action_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return usage
  } catch (error) {
    console.warn('Database not available, returning mock usage:', error)
    // Return mock usage data for development
    return {
      story_create: 1,
      export_pdf: 2,
      export_video: 0,
      character_generate: 3
    }
  }
}

// Helper function to check if database is available
export const isDatabaseAvailable = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    return !error
  } catch (error) {
    return false
  }
}

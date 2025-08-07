import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentMonth = new Date().toISOString().slice(0, 7)
    
    // Mock usage data - replace with actual database queries
    const usage = {
      billing_period: currentMonth,
      story_create: 1,
      export_pdf: 2,
      export_video: 0,
      character_generate: 3,
      scene_generate: 8
    }

    return NextResponse.json({ usage })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action_type, resource_id } = await request.json()
    
    if (!['story_create', 'export_pdf', 'export_video', 'character_generate', 'scene_generate'].includes(action_type)) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 })
    }

    // Mock usage tracking - replace with actual database insert
    const usageLog = {
      id: `usage_${Date.now()}`,
      parent_id: user.id,
      action_type,
      resource_id,
      billing_period: new Date().toISOString().slice(0, 7),
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ usageLog })
  } catch (error) {
    console.error('Error tracking usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

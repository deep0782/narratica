export interface SubscriptionLimits {
  stories_per_month: number
  max_scenes_per_story: number
  characters_per_story: number
  exports_per_month: number
  art_styles: number
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    stories_per_month: 2,
    max_scenes_per_story: 5,
    characters_per_story: 2,
    exports_per_month: 2,
    art_styles: 3
  },
  premium: {
    stories_per_month: 15,
    max_scenes_per_story: 12,
    characters_per_story: 5,
    exports_per_month: -1, // unlimited
    art_styles: -1 // unlimited
  },
  pro: {
    stories_per_month: -1, // unlimited
    max_scenes_per_story: 20,
    characters_per_story: -1, // unlimited
    exports_per_month: -1, // unlimited
    art_styles: -1 // unlimited
  }
}

export async function checkUsageLimit(
  userId: string,
  actionType: 'story_create' | 'export_pdf' | 'export_video' | 'character_generate' | 'scene_generate',
  subscriptionTier: 'free' | 'premium' | 'pro'
): Promise<{ allowed: boolean; message?: string }> {
  try {
    // Get current usage
    const response = await fetch('/api/usage')
    if (!response.ok) {
      return { allowed: false, message: 'Unable to check usage limits' }
    }

    const { usage } = await response.json()
    const limits = SUBSCRIPTION_LIMITS[subscriptionTier]

    switch (actionType) {
      case 'story_create':
        if (limits.stories_per_month === -1) return { allowed: true }
        if (usage.story_create >= limits.stories_per_month) {
          return { 
            allowed: false, 
            message: `You've reached your monthly limit of ${limits.stories_per_month} stories. Upgrade to create more!` 
          }
        }
        break

      case 'export_pdf':
      case 'export_video':
        if (limits.exports_per_month === -1) return { allowed: true }
        const totalExports = usage.export_pdf + usage.export_video
        if (totalExports >= limits.exports_per_month) {
          return { 
            allowed: false, 
            message: `You've reached your monthly limit of ${limits.exports_per_month} exports. Upgrade for unlimited exports!` 
          }
        }
        break

      default:
        return { allowed: true }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Error checking usage limit:', error)
    return { allowed: false, message: 'Unable to verify usage limits' }
  }
}

export async function trackUsageAction(
  actionType: 'story_create' | 'export_pdf' | 'export_video' | 'character_generate' | 'scene_generate',
  resourceId?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: actionType, resource_id: resourceId })
    })

    return response.ok
  } catch (error) {
    console.error('Error tracking usage:', error)
    return false
  }
}

export function formatPrice(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount / 100)
}

export function calculateUpgradeProration(
  currentPlan: string,
  newPlan: string,
  daysRemaining: number
): number {
  const planPrices = {
    free: 0,
    premium: 59900, // ₹599 in paise
    pro: 99900      // ₹999 in paise
  }

  const currentPrice = planPrices[currentPlan as keyof typeof planPrices] || 0
  const newPrice = planPrices[newPlan as keyof typeof planPrices] || 0
  
  if (newPrice <= currentPrice) return 0

  const priceDifference = newPrice - currentPrice
  const dailyRate = priceDifference / 30
  
  return Math.round(dailyRate * daysRemaining)
}

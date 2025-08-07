'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Crown, Sparkles, Zap, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import type { ParentProfile } from '@/lib/supabase'

interface UsageLimitsProps {
  profile: ParentProfile | null
  usage: Record<string, number>
  className?: string
}

const USAGE_LIMITS = {
  free: {
    stories_per_month: 2,
    max_scenes_per_story: 5,
    characters_per_story: 2,
    exports_per_month: 2,
  },
  premium: {
    stories_per_month: 15,
    max_scenes_per_story: 12,
    characters_per_story: 5,
    exports_per_month: -1, // unlimited
  },
  pro: {
    stories_per_month: -1, // unlimited
    max_scenes_per_story: 20,
    characters_per_story: -1, // unlimited
    exports_per_month: -1, // unlimited
  }
}

export function UsageLimits({ profile, usage, className }: UsageLimitsProps) {
  if (!profile) return null

  const tier = profile.subscription_tier
  const limits = USAGE_LIMITS[tier]
  
  const storiesUsed = usage.story_create || 0
  const exportsUsed = (usage.export_pdf || 0) + (usage.export_video || 0)
  
  const storiesProgress = limits.stories_per_month === -1 ? 0 : 
    Math.min((storiesUsed / limits.stories_per_month) * 100, 100)
  
  const exportsProgress = limits.exports_per_month === -1 ? 0 : 
    Math.min((exportsUsed / limits.exports_per_month) * 100, 100)

  const isNearLimit = storiesProgress > 80 || exportsProgress > 80
  const isAtLimit = storiesProgress >= 100 || exportsProgress >= 100

  if (tier === 'pro') {
    return (
      <Card className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pro Plan - Unlimited Creativity!</h3>
                <p className="text-white/90">Create unlimited stories with all premium features</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{storiesUsed}</div>
              <div className="text-sm text-white/80">Stories Created</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${isAtLimit ? 'border-red-200 bg-red-50' : isNearLimit ? 'border-yellow-200 bg-yellow-50' : 'bg-white'} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${tier === 'premium' ? 'bg-purple-100' : 'bg-gray-100'}`}>
              {tier === 'premium' ? (
                <Crown className="h-6 w-6 text-purple-600" />
              ) : (
                <Sparkles className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {tier} Plan Usage
              </h3>
              <p className="text-gray-600">
                {tier === 'free' ? 'Try our magical story creation' : 'Premium storytelling features'}
              </p>
            </div>
          </div>
          
          {(isNearLimit || isAtLimit) && (
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-5 w-5 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={`text-sm font-medium ${isAtLimit ? 'text-red-700' : 'text-yellow-700'}`}>
                {isAtLimit ? 'Limit Reached' : 'Near Limit'}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Stories Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Stories This Month</span>
              <span className="text-sm text-gray-600">
                {storiesUsed} / {limits.stories_per_month === -1 ? '∞' : limits.stories_per_month}
              </span>
            </div>
            {limits.stories_per_month !== -1 && (
              <Progress 
                value={storiesProgress} 
                className={`h-2 ${storiesProgress >= 100 ? 'bg-red-200' : storiesProgress > 80 ? 'bg-yellow-200' : 'bg-gray-200'}`}
              />
            )}
          </div>

          {/* Exports Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Exports This Month</span>
              <span className="text-sm text-gray-600">
                {exportsUsed} / {limits.exports_per_month === -1 ? '∞' : limits.exports_per_month}
              </span>
            </div>
            {limits.exports_per_month !== -1 && (
              <Progress 
                value={exportsProgress} 
                className={`h-2 ${exportsProgress >= 100 ? 'bg-red-200' : exportsProgress > 80 ? 'bg-yellow-200' : 'bg-gray-200'}`}
              />
            )}
          </div>
        </div>

        {/* Upgrade CTA */}
        {tier === 'free' && (isNearLimit || isAtLimit) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {isAtLimit ? 'Upgrade to Continue Creating' : 'Almost at Your Limit!'}
                </h4>
                <p className="text-sm text-gray-600">
                  Upgrade to Premium for 15 stories per month and unlimited exports
                </p>
              </div>
              <Link href="/dashboard/subscription">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        {tier === 'premium' && isNearLimit && (
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Consider Pro for Unlimited Stories</h4>
                <p className="text-sm text-gray-600">
                  Upgrade to Pro for unlimited stories and advanced features
                </p>
              </div>
              <Link href="/dashboard/subscription">
                <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                  <Crown className="h-4 w-4 mr-2" />
                  Go Pro
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

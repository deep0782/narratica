'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Crown, Zap, X } from 'lucide-react'
import Link from 'next/link'

interface UsageLimitModalProps {
  isOpen: boolean
  onClose: () => void
  limitType: 'stories' | 'exports' | 'characters' | 'scenes'
  currentUsage: number
  limit: number
  subscriptionTier: 'free' | 'premium' | 'pro'
}

const LIMIT_MESSAGES = {
  stories: {
    title: 'Story Creation Limit Reached',
    description: 'You\'ve reached your monthly story creation limit.',
    upgrade: 'Upgrade to create more amazing stories for your children!'
  },
  exports: {
    title: 'Export Limit Reached',
    description: 'You\'ve reached your monthly export limit.',
    upgrade: 'Upgrade to export unlimited stories as PDF and video!'
  },
  characters: {
    title: 'Character Limit Reached',
    description: 'You\'ve reached the character limit for this story.',
    upgrade: 'Upgrade to add more characters to your stories!'
  },
  scenes: {
    title: 'Scene Limit Reached',
    description: 'You\'ve reached the scene limit for this story.',
    upgrade: 'Upgrade to create longer, more detailed stories!'
  }
}

const UPGRADE_BENEFITS = {
  free: {
    premium: [
      '15 stories per month (vs 2)',
      '12 scenes per story (vs 5)',
      '5 characters per story (vs 2)',
      'Unlimited exports',
      'All art styles',
      'No story expiration'
    ],
    pro: [
      'Unlimited stories',
      '20 scenes per story',
      'Unlimited characters',
      'Custom art styles',
      'Commercial usage rights',
      'Priority support'
    ]
  },
  premium: {
    pro: [
      'Unlimited stories (vs 15/month)',
      '20 scenes per story (vs 12)',
      'Unlimited characters (vs 5)',
      'Custom art style requests',
      'Commercial usage rights',
      'Phone support'
    ]
  }
}

export function UsageLimitModal({
  isOpen,
  onClose,
  limitType,
  currentUsage,
  limit,
  subscriptionTier
}: UsageLimitModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  
  const message = LIMIT_MESSAGES[limitType]
  const progress = Math.min((currentUsage / limit) * 100, 100)
  
  const availableUpgrades = UPGRADE_BENEFITS[subscriptionTier as keyof typeof UPGRADE_BENEFITS] || {}

  const handleUpgrade = async (plan: 'premium' | 'pro') => {
    setIsUpgrading(true)
    // Redirect to subscription page with selected plan
    window.location.href = `/dashboard/subscription?upgrade=${plan}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <span>{message.title}</span>
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Usage</span>
              <span className="font-medium">{currentUsage} / {limit}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Upgrade Options */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{message.upgrade}</p>
            
            {subscriptionTier === 'free' && (
              <div className="grid gap-3">
                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-900">Premium Plan</span>
                    </div>
                    <span className="text-lg font-bold text-purple-900">₹599/mo</span>
                  </div>
                  <ul className="space-y-1 text-sm text-purple-800 mb-3">
                    {availableUpgrades.premium?.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>

                <div className="p-4 border border-pink-200 rounded-lg bg-pink-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-pink-600" />
                      <span className="font-medium text-pink-900">Pro Plan</span>
                    </div>
                    <span className="text-lg font-bold text-pink-900">₹999/mo</span>
                  </div>
                  <ul className="space-y-1 text-sm text-pink-800 mb-3">
                    {availableUpgrades.pro?.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-pink-600 rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={() => handleUpgrade('pro')}
                    disabled={isUpgrading}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            )}

            {subscriptionTier === 'premium' && availableUpgrades.pro && (
              <div className="p-4 border border-pink-200 rounded-lg bg-pink-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-pink-600" />
                    <span className="font-medium text-pink-900">Upgrade to Pro</span>
                  </div>
                  <span className="text-lg font-bold text-pink-900">₹999/mo</span>
                </div>
                <ul className="space-y-1 text-sm text-pink-800 mb-3">
                  {availableUpgrades.pro.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-pink-600 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => handleUpgrade('pro')}
                  disabled={isUpgrading}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </div>

          {/* Alternative Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Maybe Later
            </Button>
            <Link href="/dashboard/subscription" className="flex-1">
              <Button variant="ghost" className="w-full">
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

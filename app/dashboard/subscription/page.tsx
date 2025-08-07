'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Crown, Sparkles, Check, X, Calendar, CreditCard, Download, AlertTriangle, Zap } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { getCurrentUser, getProfile } from '@/lib/supabase'
import type { ParentProfile } from '@/lib/supabase'

interface Subscription {
  id: string
  plan: 'free' | 'premium' | 'pro'
  status: 'active' | 'canceled' | 'past_due'
  current_period_end: string
  cancel_at_period_end: boolean
}

interface Usage {
  story_create: number
  export_pdf: number
  export_video: number
  character_generate: number
  scene_generate: number
}

interface Invoice {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  invoice_pdf?: string
  billing_period_start: string
  billing_period_end: string
  created_at: string
  paid_at?: string
}

const PLAN_LIMITS = {
  free: {
    stories_per_month: 2,
    max_scenes_per_story: 5,
    characters_per_story: 2,
    exports_per_month: 2,
    art_styles: 3,
    features: ['PDF export only', 'Stories expire after 30 days', 'Basic art styles', 'Email support']
  },
  premium: {
    stories_per_month: 15,
    max_scenes_per_story: 12,
    characters_per_story: 5,
    exports_per_month: -1,
    art_styles: -1,
    features: ['PDF & video export', 'No story expiration', 'All art styles', 'Priority processing', 'Remove watermarks', 'Email support']
  },
  pro: {
    stories_per_month: -1,
    max_scenes_per_story: 20,
    characters_per_story: -1,
    exports_per_month: -1,
    art_styles: -1,
    features: ['Unlimited everything', 'Custom art styles', 'Commercial usage rights', 'Advanced video features', 'Phone support', 'Early access to features']
  }
}

const PLAN_PRICES = {
  premium: { monthly: 599, yearly: 5990 },
  pro: { monthly: 999, yearly: 9990 }
}

export default function SubscriptionPage() {
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null)

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setIsLoading(true)
      
      const user = await getCurrentUser()
      if (!user) return

      const userProfile = await getProfile(user.id)
      setProfile(userProfile)

      // Load subscription data
      const subResponse = await fetch('/api/subscriptions')
      if (subResponse.ok) {
        const { subscription } = await subResponse.json()
        setSubscription(subscription)
      }

      // Load usage data
      const usageResponse = await fetch('/api/usage')
      if (usageResponse.ok) {
        const { usage } = await usageResponse.json()
        setUsage(usage)
      }

      // Load billing history
      const invoicesResponse = await fetch('/api/billing/invoices')
      if (invoicesResponse.ok) {
        const { invoices } = await invoicesResponse.json()
        setInvoices(invoices)
      }

    } catch (error) {
      console.error('Error loading subscription data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (plan: 'premium' | 'pro') => {
    try {
      setIsUpgrading(true)
      setSelectedPlan(plan)

      // Create payment order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const { order } = await orderResponse.json()

      // Initialize Razorpay (mock implementation)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Narratica',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan
            })
          })

          if (verifyResponse.ok) {
            await loadSubscriptionData()
            alert('Subscription upgraded successfully!')
          } else {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: profile?.full_name,
          email: profile?.email
        },
        theme: {
          color: '#8B5CF6'
        }
      }

      // Mock Razorpay integration - in real app, use actual Razorpay
      console.log('Would open Razorpay with options:', options)
      
      // For demo, simulate successful payment
      setTimeout(async () => {
        const mockResponse = {
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_signature: 'mock_signature'
        }
        
        const verifyResponse = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...mockResponse,
            plan
          })
        })

        if (verifyResponse.ok) {
          await loadSubscriptionData()
          alert('Subscription upgraded successfully!')
        }
      }, 2000)

    } catch (error) {
      console.error('Error upgrading subscription:', error)
      alert('Failed to upgrade subscription')
    } finally {
      setIsUpgrading(false)
      setSelectedPlan(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription || !confirm('Are you sure you want to cancel your subscription?')) return

    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadSubscriptionData()
        alert('Subscription canceled successfully')
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('Failed to cancel subscription')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount / 100)
  }

  const getUsageProgress = (used: number, limit: number) => {
    if (limit === -1) return 0
    return Math.min((used / limit) * 100, 100)
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Crown className="h-5 w-5 text-purple-600" />
      case 'pro':
        return <Crown className="h-5 w-5 text-pink-600" />
      default:
        return <Sparkles className="h-5 w-5 text-gray-600" />
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      case 'pro':
        return <Badge className="bg-pink-100 text-pink-700">Pro</Badge>
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader profile={profile} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlan = subscription?.plan || 'free'
  const limits = PLAN_LIMITS[currentPlan]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader profile={profile} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-gray-600">Manage your subscription, view usage, and billing history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPlanIcon(currentPlan)}
                    <div>
                      <CardTitle className="capitalize">{currentPlan} Plan</CardTitle>
                      <p className="text-sm text-gray-600">
                        {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  {getPlanBadge(currentPlan)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription && subscription.plan !== 'free' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next billing date:</span>
                    <span className="font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {subscription?.cancel_at_period_end && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Your subscription will be canceled at the end of the current period.
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Plan Features:</h4>
                  <ul className="space-y-1">
                    {limits.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {usage && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Stories Created</span>
                        <span className="text-sm text-gray-600">
                          {usage.story_create} / {limits.stories_per_month === -1 ? '∞' : limits.stories_per_month}
                        </span>
                      </div>
                      {limits.stories_per_month !== -1 && (
                        <Progress value={getUsageProgress(usage.story_create, limits.stories_per_month)} />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Exports</span>
                        <span className="text-sm text-gray-600">
                          {usage.export_pdf + usage.export_video} / {limits.exports_per_month === -1 ? '∞' : limits.exports_per_month}
                        </span>
                      </div>
                      {limits.exports_per_month !== -1 && (
                        <Progress value={getUsageProgress(usage.export_pdf + usage.export_video, limits.exports_per_month)} />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{usage.character_generate}</div>
                        <div className="text-sm text-gray-600">Characters Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{usage.scene_generate}</div>
                        <div className="text-sm text-gray-600">Scenes Generated</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(invoice.billing_period_start).toLocaleDateString()} - {new Date(invoice.billing_period_end).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}>
                            {invoice.status}
                          </Badge>
                          {invoice.invoice_pdf && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No billing history available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Options */}
          <div className="space-y-6">
            {currentPlan === 'free' && (
              <>
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-purple-900">Premium Plan</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-900">₹599</div>
                      <div className="text-sm text-purple-700">per month</div>
                    </div>
                    <ul className="space-y-2">
                      {PLAN_LIMITS.premium.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleUpgrade('premium')}
                      disabled={isUpgrading && selectedPlan === 'premium'}
                    >
                      {isUpgrading && selectedPlan === 'premium' ? (
                        'Processing...'
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-pink-200 bg-pink-50">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-pink-600" />
                      <CardTitle className="text-pink-900">Pro Plan</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-900">₹999</div>
                      <div className="text-sm text-pink-700">per month</div>
                    </div>
                    <ul className="space-y-2">
                      {PLAN_LIMITS.pro.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      onClick={() => handleUpgrade('pro')}
                      disabled={isUpgrading && selectedPlan === 'pro'}
                    >
                      {isUpgrading && selectedPlan === 'pro' ? (
                        'Processing...'
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Pro
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {currentPlan === 'premium' && (
              <Card className="border-pink-200 bg-pink-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-pink-600" />
                    <CardTitle className="text-pink-900">Upgrade to Pro</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-900">₹999</div>
                    <div className="text-sm text-pink-700">per month</div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Unlimited stories</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Custom art styles</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Commercial usage rights</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Phone support</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={() => handleUpgrade('pro')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Subscription Management */}
            {subscription && subscription.plan !== 'free' && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Change Billing Date
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </div>
                  <Separator />
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleCancelSubscription}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

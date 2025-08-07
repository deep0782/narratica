import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()
    
    const planPrices = {
      premium: 59900, // ₹599 in paise
      pro: 99900      // ₹999 in paise
    }

    if (!planPrices[plan as keyof typeof planPrices]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Mock Razorpay order creation - replace with actual Razorpay integration
    const order = {
      id: `order_${Date.now()}`,
      amount: planPrices[plan as keyof typeof planPrices],
      currency: 'INR',
      status: 'created',
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan: plan
      },
      created_at: Math.floor(Date.now() / 1000)
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

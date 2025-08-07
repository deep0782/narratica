import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await request.json()
    
    // Mock payment verification - replace with actual Razorpay signature verification
    const isValidSignature = true // In real implementation, verify using Razorpay webhook secret
    
    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Mock subscription activation
    const subscription = {
      id: `sub_${Date.now()}`,
      user_id: user.id,
      plan,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Payment verified and subscription activated successfully'
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

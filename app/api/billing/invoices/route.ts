import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock invoice data - replace with actual billing provider
    const invoices = [
      {
        id: 'inv_001',
        subscription_id: 'sub_mock_123',
        amount: 59900, // in paise (₹599)
        currency: 'INR',
        status: 'paid',
        invoice_pdf: '/invoices/inv_001.pdf',
        billing_period_start: '2024-01-01T00:00:00Z',
        billing_period_end: '2024-01-31T23:59:59Z',
        created_at: '2024-01-01T00:00:00Z',
        paid_at: '2024-01-01T00:05:00Z'
      },
      {
        id: 'inv_002',
        subscription_id: 'sub_mock_123',
        amount: 59900,
        currency: 'INR',
        status: 'pending',
        invoice_pdf: null,
        billing_period_start: '2024-02-01T00:00:00Z',
        billing_period_end: '2024-02-29T23:59:59Z',
        created_at: '2024-02-01T00:00:00Z',
        paid_at: null
      }
    ]

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { orderConfirmationEmail, ownerNotificationEmail } from '@/lib/emails'

export async function POST(request: NextRequest) {
  try {
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.warn('RESEND_API_KEY not set — skipping email')
      return NextResponse.json({ success: true, skipped: true })
    }

    const { order } = await request.json()
    if (!order?.email) {
      return NextResponse.json({ error: 'Missing order data' }, { status: 400 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(resendKey)

    // Send to customer
    await resend.emails.send({
      from: 'Cary Grant Clothing <onboarding@resend.dev>',
      to: order.email,
      subject: `Order confirmed — CGC #${order.id?.slice(0, 12)?.toUpperCase() || 'NEW'}`,
      html: orderConfirmationEmail(order),
    })

    // Notify owner
    await resend.emails.send({
      from: 'CGC Store <onboarding@resend.dev>',
      to: 'cary@carygrantclothing.com',
      subject: `🛍️ New order — ${order.customer_name} — $${order.total?.toFixed(2)} CAD`,
      html: ownerNotificationEmail(order),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

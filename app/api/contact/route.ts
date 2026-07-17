import { NextRequest, NextResponse } from 'next/server'
import { saveMessage } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    await saveMessage({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })

    // Optionally notify the owner via email
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: 'CGC Website <onboarding@resend.dev>',
          to: 'cary@carygrantclothing.com',
          subject: `New contact message from ${name}`,
          html: `
            <div style="font-family:Inter,Arial,sans-serif;max-width:520px;padding:32px;">
              <h2 style="color:#141414;">New contact message</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border:none;border-top:1px solid #E6E3DD;margin:16px 0;" />
              <p style="color:#6B6B6B;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
              <hr style="border:none;border-top:1px solid #E6E3DD;margin:16px 0;" />
              <p style="font-size:12px;color:#9a9a9a;">Sent from carygrantclothing.com contact form</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to notify owner:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Please fill in all required fields' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Send email using Gmail
    const success = await sendContactEmail({ name, email, subject, message });
    
    if (!success) {
      console.log('[CONTACT] Email not sent (Gmail not configured), but form submitted successfully');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}

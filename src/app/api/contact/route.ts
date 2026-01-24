import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const adminEmail = process.env.ADMIN_EMAIL || 'tsatwente@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'TSA TWENTE <onboarding@resend.dev>';

    // Send email to admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: subject ? `Contact Form: ${subject}` : `Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #E30A17; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Message</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">From:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <a href="mailto:${email}">${email}</a>
                </td>
              </tr>
              ${subject ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
              </tr>
              ` : ''}
            </table>
            <div style="margin-top: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
            This message was sent from the TSA TWENTE website contact form.
          </div>
        </div>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Thank you for contacting TSA TWENTE',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #E30A17; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">TSA TWENTE</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Thank you for reaching out, ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              We have received your message and will get back to you as soon as possible, 
              typically within 24-48 hours.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your message:</h3>
              <p style="color: #666;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              In the meantime, feel free to check out our upcoming events on our website!
            </p>
          </div>
          <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
            TSA TWENTE - Turkish Student Association at University of Twente
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}

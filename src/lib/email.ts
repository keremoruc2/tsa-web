import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'TSA TWENTE <noreply@tsatwente.nl>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tsatwente@gmail.com';

interface MembershipData {
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studyProgram?: string;
  notes?: string;
}

/**
 * Send confirmation email to user when they submit membership request
 */
export async function sendMembershipConfirmationEmail(data: MembershipData): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Resend not configured - would send confirmation to:', data.email);
    console.log('[EMAIL] Content:', generateUserConfirmationEmail(data));
    return false;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Welcome to TSA TWENTE! - Application Received',
      html: generateUserConfirmationEmail(data),
      text: generateUserConfirmationText(data),
    });
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send confirmation:', error);
    return false;
  }
}

/**
 * Send notification email to admin when someone submits membership request
 */
export async function sendAdminNotificationEmail(data: MembershipData): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Resend not configured - would send admin notification to:', ADMIN_EMAIL);
    console.log('[EMAIL] Content:', generateAdminNotificationEmail(data));
    return false;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Membership Request: ${data.name}`,
      html: generateAdminNotificationEmail(data),
      text: generateAdminNotificationText(data),
      replyTo: data.email,
    });
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send admin notification:', error);
    return false;
  }
}

// ============ EMAIL TEMPLATES ============

function generateUserConfirmationEmail(data: MembershipData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Welcome to TSA TWENTE</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f5f5; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: #E30A17; padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .body h2 { color: #333; margin: 0 0 16px; }
    .body p { color: #666; line-height: 1.6; margin: 0 0 16px; }
    .footer { background: #f9f9f9; padding: 24px 32px; text-align: center; border-top: 1px solid #eee; }
    .footer p { color: #999; font-size: 12px; margin: 0; }
    .footer a { color: #E30A17; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>TSA TWENTE</h1>
        <p>Turkish Student Association at University of Twente</p>
      </div>
      <div class="body">
        <h2>Merhaba ${data.name}! 👋</h2>
        <p>Thank you for your interest in joining TSA TWENTE! We have received your application and will get back to you soon.</p>
        <p>Our team will review your information and reach out to you with next steps. In the meantime, feel free to follow us on social media to stay updated on our events and activities.</p>
        <p>We're excited to have you as part of our community!</p>
        <p style="margin-top: 24px;">
          Warm regards,<br/>
          <strong>TSA TWENTE Team</strong>
        </p>
      </div>
      <div class="footer">
        <p>Turkish Student Association at University of Twente</p>
        <p><a href="https://tsatwente.nl">tsatwente.nl</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateUserConfirmationText(data: MembershipData): string {
  return `
Merhaba ${data.name}!

Thank you for your interest in joining TSA TWENTE! We have received your application and will get back to you soon.

Our team will review your information and reach out to you with next steps. In the meantime, feel free to follow us on social media to stay updated on our events and activities.

We're excited to have you as part of our community!

Warm regards,
TSA TWENTE Team

---
Turkish Student Association at University of Twente
https://tsatwente.nl
  `.trim();
}

function generateAdminNotificationEmail(data: MembershipData): string {
  const timestamp = new Date().toLocaleString('en-NL', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>New Membership Request</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f5f5; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: #E30A17; padding: 24px 32px; }
    .header h1 { color: white; margin: 0; font-size: 20px; }
    .header p { color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 12px; }
    .body { padding: 24px 32px; }
    .field { margin-bottom: 16px; padding: 12px 16px; background: #f9f9f9; border-left: 3px solid #E30A17; }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #E30A17; font-weight: bold; margin-bottom: 4px; }
    .field-value { color: #333; font-size: 15px; }
    .timestamp { text-align: center; padding: 16px; color: #999; font-size: 12px; border-top: 1px solid #eee; }
    a { color: #E30A17; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>🎉 New Membership Request</h1>
        <p>Someone wants to join TSA TWENTE!</p>
      </div>
      <div class="body">
        <div class="field">
          <div class="field-label">Name</div>
          <div class="field-value">${data.name}</div>
        </div>
        <div class="field">
          <div class="field-label">Email</div>
          <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>
        ${data.phone ? `
        <div class="field">
          <div class="field-label">Phone</div>
          <div class="field-value">${data.phone}</div>
        </div>
        ` : ''}
        ${data.university ? `
        <div class="field">
          <div class="field-label">University</div>
          <div class="field-value">${data.university}</div>
        </div>
        ` : ''}
        ${data.studyProgram ? `
        <div class="field">
          <div class="field-label">Study Program</div>
          <div class="field-value">${data.studyProgram}</div>
        </div>
        ` : ''}
        ${data.notes ? `
        <div class="field">
          <div class="field-label">Notes</div>
          <div class="field-value">${data.notes}</div>
        </div>
        ` : ''}
      </div>
      <div class="timestamp">
        Received: ${timestamp}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateAdminNotificationText(data: MembershipData): string {
  const timestamp = new Date().toLocaleString('en-NL', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam'
  });

  return `
NEW MEMBERSHIP REQUEST
======================

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.university ? `University: ${data.university}` : ''}
${data.studyProgram ? `Study Program: ${data.studyProgram}` : ''}
${data.notes ? `Notes: ${data.notes}` : ''}

Received: ${timestamp}
  `.trim();
}

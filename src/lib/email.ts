import nodemailer from 'nodemailer';

// Gmail SMTP Configuration
// Requires: GMAIL_USER and GMAIL_APP_PASSWORD in environment variables
const transporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

// Email configuration
const FROM_EMAIL = process.env.GMAIL_USER || 'tsatwente@gmail.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tsatwente@gmail.com';

interface MembershipData {
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studyProgram?: string;
  notes?: string;
}

interface ContactData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Send confirmation email to user when they submit membership request
 */
export async function sendMembershipConfirmationEmail(data: MembershipData): Promise<boolean> {
  if (!transporter) {
    console.log('[EMAIL] Gmail not configured - would send confirmation to:', data.email);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `TSA TWENTE <${FROM_EMAIL}>`,
      to: data.email,
      subject: 'Welcome to TSA TWENTE! - Application Received',
      html: generateUserConfirmationEmail(data),
      text: generateUserConfirmationText(data),
    });
    console.log('[EMAIL] Confirmation sent to:', data.email);
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
  if (!transporter) {
    console.log('[EMAIL] Gmail not configured - would send admin notification to:', ADMIN_EMAIL);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `TSA TWENTE <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Application: ${data.name}`,
      html: generateAdminNotificationEmail(data),
      text: generateAdminNotificationText(data),
      replyTo: data.email,
    });
    console.log('[EMAIL] Admin notification sent for:', data.name);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send admin notification:', error);
    return false;
  }
}

/**
 * Send contact form email to admin
 */
export async function sendContactEmail(data: ContactData): Promise<boolean> {
  if (!transporter) {
    console.log('[EMAIL] Gmail not configured - would send contact email to:', ADMIN_EMAIL);
    return false;
  }

  try {
    // Send to admin
    await transporter.sendMail({
      from: `TSA TWENTE <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: data.subject ? `Contact Form: ${data.subject}` : `Contact Form Message from ${data.name}`,
      html: generateContactAdminEmail(data),
      replyTo: data.email,
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: `TSA TWENTE <${FROM_EMAIL}>`,
      to: data.email,
      subject: 'Thank you for contacting TSA TWENTE',
      html: generateContactConfirmationEmail(data),
    });

    console.log('[EMAIL] Contact emails sent for:', data.name);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send contact email:', error);
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
        <p><a href="https://instagram.com/tsatwente">@tsatwente</a></p>
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
Instagram: @tsatwente
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
  <title>New Application</title>
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
        <h1>🎉 New Application</h1>
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
        ${data.studyProgram ? `
        <div class="field">
          <div class="field-label">Study Program</div>
          <div class="field-value">${data.studyProgram}</div>
        </div>
        ` : ''}
        ${data.notes ? `
        <div class="field">
          <div class="field-label">Message</div>
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
NEW APPLICATION
===============

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.studyProgram ? `Study Program: ${data.studyProgram}` : ''}
${data.notes ? `Message: ${data.notes}` : ''}

Received: ${timestamp}
  `.trim();
}

function generateContactAdminEmail(data: ContactData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #E30A17; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Contact Form Message</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">From:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <a href="mailto:${data.email}">${data.email}</a>
        </td>
      </tr>
      ${data.subject ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.subject}</td>
      </tr>
      ` : ''}
    </table>
    <div style="margin-top: 20px;">
      <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
    </div>
  </div>
  <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
    This message was sent from the TSA TWENTE website contact form.
  </div>
</body>
</html>
  `.trim();
}

function generateContactConfirmationEmail(data: ContactData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #E30A17; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">TSA TWENTE</h1>
  </div>
  <div style="padding: 30px;">
    <h2 style="color: #333;">Thank you for reaching out, ${data.name}!</h2>
    <p style="color: #666; line-height: 1.6;">
      We have received your message and will get back to you as soon as possible.
    </p>
    <p style="color: #666; line-height: 1.6;">
      In the meantime, feel free to follow us on Instagram 
      <a href="https://instagram.com/tsatwente" style="color: #E30A17;">@tsatwente</a> 
      for the latest updates and events.
    </p>
    <p style="color: #666; margin-top: 24px;">
      Best regards,<br/>
      <strong>TSA TWENTE Team</strong>
    </p>
  </div>
  <div style="padding: 20px; text-align: center; background: #f9f9f9; border-top: 1px solid #eee;">
    <p style="color: #999; font-size: 12px; margin: 0;">
      Turkish Student Association at University of Twente
    </p>
  </div>
</body>
</html>
  `.trim();
}

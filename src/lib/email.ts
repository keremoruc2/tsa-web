import nodemailer from 'nodemailer';

// Create a reusable transporter
// In development, logs to console; in production, uses SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, text, html } = options;
  
  // In development without SMTP configured, log to console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('=== EMAIL WOULD BE SENT ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    if (html) console.log('HTML:', html);
    console.log('=== END EMAIL ===');
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendMembershipNotification(data: {
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studyProgram?: string;
  interests?: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@tsatwente.nl';
  
  const subject = `New TSA TWENTE Membership Request: ${data.name}`;
  const text = `
New membership request received!

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
University/School: ${data.university || 'Not provided'}
Study Program: ${data.studyProgram || 'Not provided'}
Interests: ${data.interests || 'Not provided'}

---
This is an automated email from the TSA TWENTE website.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #E30A17; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #E30A17; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🇹🇷 New Membership Request</h1>
    </div>
    <div class="content">
      <div class="field"><span class="label">Name:</span> ${data.name}</div>
      <div class="field"><span class="label">Email:</span> ${data.email}</div>
      <div class="field"><span class="label">Phone:</span> ${data.phone || 'Not provided'}</div>
      <div class="field"><span class="label">University/School:</span> ${data.university || 'Not provided'}</div>
      <div class="field"><span class="label">Study Program:</span> ${data.studyProgram || 'Not provided'}</div>
      <div class="field"><span class="label">Interests:</span> ${data.interests || 'Not provided'}</div>
    </div>
    <div class="footer">
      This is an automated email from the TSA TWENTE website.
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: adminEmail, subject, text, html });
}

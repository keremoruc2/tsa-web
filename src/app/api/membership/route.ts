import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMembershipConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, phone, university, studyProgram, notes } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store in database
    const membershipData = {
      name,
      email,
      phone: phone || null,
      university: university || null,
      studyProgram: studyProgram || null,
      notes: notes || null,
    };

    const membership = await prisma.membershipRequest.create({
      data: membershipData,
    });

    // Send emails (non-blocking - we don't wait for them)
    const emailData = { name, email, phone, university, studyProgram, notes };
    
    // Send confirmation to user
    const userEmailSent = await sendMembershipConfirmationEmail(emailData);
    
    // Send notification to admin
    const adminEmailSent = await sendAdminNotificationEmail(emailData);

    // Update database with email status
    await prisma.membershipRequest.update({
      where: { id: membership.id },
      data: {
        userEmailSent,
        adminEmailSent,
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Application submitted successfully! We\'ll be in touch soon.',
      id: membership.id,
    });
  } catch (error) {
    console.error('Membership submission error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// GET: Admin endpoint to list all membership requests
export async function GET() {
  try {
    // Note: This should be protected by auth, but keeping simple for now
    const requests = await prisma.membershipRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, requests });
  } catch (error) {
    console.error('Failed to fetch membership requests:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

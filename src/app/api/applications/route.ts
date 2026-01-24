import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMembershipConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST: Public endpoint to submit application
export async function POST(request: Request) {
  try {
    const { name, email, phone, university, studyProgram, message, type } = await request.json();

    // Validate required fields
    if (!name || !email || !type) {
      return NextResponse.json(
        { ok: false, error: 'Name, email, and type are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['TEAM', 'MEMBER'].includes(type)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid application type' },
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
    const application = await prisma.application.create({
      data: {
        type,
        name,
        email,
        phone: phone || null,
        university: university || null,
        studyProgram: studyProgram || null,
        message: message || null,
      },
    });

    // Send emails (best effort)
    const emailData = { name, email, phone, university, studyProgram, notes: message };
    
    // Send confirmation to user
    await sendMembershipConfirmationEmail(emailData);
    
    // Send notification to admin
    await sendAdminNotificationEmail(emailData);

    return NextResponse.json({
      ok: true,
      message: 'Application submitted successfully!',
      id: application.id,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// GET: Admin endpoint to list applications
export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where = type && ['TEAM', 'MEMBER'].includes(type) 
      ? { type: type as 'TEAM' | 'MEMBER' } 
      : {};

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, applications });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// PATCH: Admin endpoint to update status
export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: 'ID and status are required' },
        { status: 400 }
      );
    }

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, application: updated });
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMembershipNotification } from '@/lib/email';

export const runtime = 'nodejs';

interface JoinRequestBody {
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studyProgram?: string;
  interests?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: JoinRequestBody = await request.json();

    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Try to save to database
    let savedToDb = false;
    try {
      await prisma.membershipRequest.create({
        data: {
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          phone: body.phone?.trim() || null,
          university: body.university?.trim() || null,
          studyProgram: body.studyProgram?.trim() || null,
          interests: body.interests?.trim() || null,
          emailSent: false,
        },
      });
      savedToDb = true;
    } catch (dbError) {
      console.error('Database error (continuing with email):', dbError);
      // Continue even if DB fails - we'll still try to send email
    }

    // Send email notification
    const emailSent = await sendMembershipNotification({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim(),
      university: body.university?.trim(),
      studyProgram: body.studyProgram?.trim(),
      interests: body.interests?.trim(),
    });

    // Update DB record if email was sent
    if (savedToDb && emailSent) {
      try {
        await prisma.membershipRequest.updateMany({
          where: { email: body.email.trim().toLowerCase() },
          data: { emailSent: true },
        });
      } catch {
        // Non-critical - log but don't fail
        console.error('Failed to update emailSent status');
      }
    }

    // Log for debugging
    console.log('Membership request received:', {
      name: body.name,
      email: body.email,
      savedToDb,
      emailSent,
    });

    return NextResponse.json({
      ok: true,
      message: 'Membership request received successfully',
      savedToDb,
      emailSent,
    });
  } catch (error) {
    console.error('Join API error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

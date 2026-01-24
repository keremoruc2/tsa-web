import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireRole } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await requireRole('EDITOR');
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ ok: false, error: 'Invalid file type. Please upload an image.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ ok: false, error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `events/${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ 
      ok: true, 
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ ok: false, error: 'Upload failed' }, { status: 500 });
  }
}

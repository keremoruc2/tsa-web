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
    try {
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      return NextResponse.json({ 
        ok: true, 
        url: blob.url,
        filename: blob.pathname,
      });
    } catch (blobError) {
      // If blob upload fails (e.g., in local development), convert to base64 data URL
      console.error('Vercel Blob upload failed, trying data URL fallback:', blobError);
      
      // Check if this is a local development issue
      const isLocalDev = !process.env.VERCEL && !process.env.VERCEL_URL;
      
      if (isLocalDev) {
        // Convert file to base64 data URL for local development
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        return NextResponse.json({ 
          ok: true, 
          url: dataUrl,
          filename: file.name,
          note: 'Using data URL (local dev mode). Images will upload to Vercel Blob in production.'
        });
      }
      
      // Re-throw for production errors
      throw blobError;
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    
    // Get the actual error message
    let errorMessage = 'Upload failed';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error name:', error.name);
      console.error('Error stack:', error.stack);
    }
    
    // Check for common issues
    if (errorMessage.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json({ ok: false, error: 'Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN.' }, { status: 500 });
    }
    
    if (errorMessage.includes('unauthorized') || errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ ok: false, error: 'Blob token invalid or expired. Please check BLOB_READ_WRITE_TOKEN.' }, { status: 500 });
    }

    if (errorMessage.includes('store') || errorMessage.includes('not found')) {
      return NextResponse.json({ ok: false, error: 'Blob store not found. Make sure the token matches your blob store.' }, { status: 500 });
    }
    
    return NextResponse.json({ ok: false, error: `Upload failed: ${errorMessage}` }, { status: 500 });
  }
}

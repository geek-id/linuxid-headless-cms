import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloud } from '@/lib/storage/cloud-storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  try {
    // Check authentication for image uploads
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'images';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to cloud storage
    const result = await uploadImageToCloud(
      buffer,
      file.name,
      file.type,
      folder
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload image',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Get signed upload URL for direct client-side uploads
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');
    const mimetype = searchParams.get('mimetype');
    const folder = searchParams.get('folder') || 'images';

    if (!filename || !mimetype) {
      return NextResponse.json(
        { error: 'Filename and mimetype are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');
    if (!allowedTypes.includes(mimetype)) {
      return NextResponse.json(
        { error: `File type ${mimetype} is not allowed` },
        { status: 400 }
      );
    }

    // Generate unique key
    const timestamp = new Date().toISOString().split('T')[0];
    const uuid = Math.random().toString(36).substring(2, 8);
    const ext = filename.split('.').pop();
    const key = `${folder}/${timestamp}/${uuid}.${ext}`;

    // This would be implemented if using signed URLs
    // const signedUrl = await cloudStorage.getSignedUploadUrl(key, mimetype);

    return NextResponse.json({
      key,
      // signedUrl,
      message: 'Use POST endpoint for direct upload'
    });

  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 
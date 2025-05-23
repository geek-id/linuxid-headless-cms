import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromCloud, cloudStorage } from '@/lib/storage/cloud-storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { key } = params;
    
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Decode the key (it might be URL encoded)
    const decodedKey = decodeURIComponent(key);

    // Delete from cloud storage
    await deleteImageFromCloud(decodedKey);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete file',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params;
    
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Decode the key
    const decodedKey = decodeURIComponent(key);

    // Get public URL
    const publicUrl = cloudStorage.getPublicUrl(decodedKey);

    return NextResponse.json({
      key: decodedKey,
      url: publicUrl,
      success: true
    });

  } catch (error) {
    console.error('File info error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get file info',
        success: false 
      },
      { status: 500 }
    );
  }
} 
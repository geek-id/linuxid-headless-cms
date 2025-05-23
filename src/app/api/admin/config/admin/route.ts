import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getAdminConfig, updateAdminConfig } from '@/lib/config/file-storage';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const config = getAdminConfig();
    return NextResponse.json({ success: true, data: config });

  } catch (error) {
    console.error('Admin config fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    updateAdminConfig(updates);

    return NextResponse.json({
      success: true,
      message: 'Admin configuration updated successfully',
      data: getAdminConfig()
    });

  } catch (error) {
    console.error('Admin config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update admin configuration' },
      { status: 500 }
    );
  }
} 
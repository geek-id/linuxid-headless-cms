import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getSiteConfig, updateSiteConfig } from '@/lib/config/file-storage';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const config = getSiteConfig();
    return NextResponse.json({ success: true, data: config });

  } catch (error) {
    console.error('Site config fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site configuration' },
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
    updateSiteConfig(updates);

    return NextResponse.json({
      success: true,
      message: 'Site configuration updated successfully',
      data: getSiteConfig()
    });

  } catch (error) {
    console.error('Site config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update site configuration' },
      { status: 500 }
    );
  }
} 
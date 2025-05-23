import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getAdminUsers, addAdminUser, removeAdminUser } from '@/lib/config/file-storage';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const users = getAdminUsers();
    return NextResponse.json({ success: true, data: users });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
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

    const { email, action } = await request.json();

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Email and action are required' },
        { status: 400 }
      );
    }

    if (action === 'add') {
      addAdminUser(email);
      return NextResponse.json({
        success: true,
        message: `Admin user ${email} added successfully`,
        data: getAdminUsers()
      });
    } else if (action === 'remove') {
      removeAdminUser(email);
      return NextResponse.json({
        success: true,
        message: `Admin user ${email} removed successfully`,
        data: getAdminUsers()
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Admin users management error:', error);
    return NextResponse.json(
      { error: 'Failed to manage admin users' },
      { status: 500 }
    );
  }
} 
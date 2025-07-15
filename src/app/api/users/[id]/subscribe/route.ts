import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(user.userId);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    const isSubscribed = currentUser.subscriptions.includes(params.id);
    
    if (isSubscribed) {
      // Unsubscribe
      currentUser.subscriptions = currentUser.subscriptions.filter(
        (id: string) => id !== params.id
      );
      targetUser.subscribersCount = Math.max(0, (targetUser.subscribersCount || 0) - 1);
    } else {
      // Subscribe
      currentUser.subscriptions.push(params.id);
      targetUser.subscribersCount = (targetUser.subscribersCount || 0) + 1;
    }

    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({
      message: isSubscribed ? 'Unsubscribed' : 'Subscribed',
      subscribersCount: targetUser.subscribersCount,
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

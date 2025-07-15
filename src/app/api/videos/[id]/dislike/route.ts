import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Video } from '@/models/Video';
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

    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user already disliked the video
    const hasLiked = video.likedBy.includes(user.userId);
    const hasDisliked = video.dislikedBy.includes(user.userId);
    
    if (hasDisliked) {
      // Remove dislike
      video.dislikedBy = video.dislikedBy.filter((id: string) => id !== user.userId);
      video.dislikes = Math.max(0, video.dislikes - 1);
    } else {
      // Add dislike
      video.dislikedBy.push(user.userId);
      video.dislikes += 1;
      
      // Remove like if it exists
      if (hasLiked) {
        video.likedBy = video.likedBy.filter((id: string) => id !== user.userId);
        video.likes = Math.max(0, video.likes - 1);
      }
    }

    await video.save();

    return NextResponse.json({
      message: hasDisliked ? 'Dislike removed' : 'Video disliked',
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error('Error disliking video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

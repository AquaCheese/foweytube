import { NextRequest, NextResponse } from 'next/server';
import { mockVideos } from '@/lib/mockData';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const video = mockVideos.find(v => v._id === params.id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user already liked the video
    const hasLiked = video.likedBy.includes(user.userId);
    const hasDisliked = video.dislikedBy.includes(user.userId);
    
    if (hasLiked) {
      // Remove like
      video.likedBy = video.likedBy.filter((id: string) => id !== user.userId);
      video.likes = Math.max(0, video.likes - 1);
    } else {
      // Add like
      video.likedBy.push(user.userId);
      video.likes += 1;
      
      // Remove dislike if it exists
      if (hasDisliked) {
        video.dislikedBy = video.dislikedBy.filter((id: string) => id !== user.userId);
        video.dislikes = Math.max(0, video.dislikes - 1);
      }
    }

    return NextResponse.json({
      message: hasLiked ? 'Like removed' : 'Video liked',
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error('Error liking video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

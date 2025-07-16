import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockVideos } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find user in mock data
    const user = mockUsers.find(u => u._id === id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Find videos uploaded by this user
    const userVideos = mockVideos.filter(v => v.uploaderId === id);

    return NextResponse.json({
      success: true,
      channel: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        subscribersCount: user.subscribersCount,
        createdAt: user.createdAt
      },
      videos: userVideos.map(video => ({
        id: video._id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnail,
        views: video.views,
        likes: video.likes,
        duration: video.duration,
        createdAt: video.createdAt
      }))
    });
  } catch (error: any) {
    console.error('Get channel error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

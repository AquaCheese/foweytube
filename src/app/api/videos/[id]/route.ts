import { NextRequest, NextResponse } from 'next/server';
import { mockVideos, mockUsers } from '@/lib/mockData';

export const dynamic = 'force-static';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find video in mock data
    const video = mockVideos.find(v => v._id === id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Find the uploader user
    const uploader = mockUsers.find(u => u._id === video.uploaderId);

    return NextResponse.json({
      success: true,
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnail,
        uploadedBy: uploader ? {
          id: uploader._id,
          username: uploader.username,
          displayName: uploader.displayName,
          avatar: uploader.avatar
        } : null,
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        duration: video.duration,
        createdAt: video.createdAt,
        tags: video.tags
      }
    });
  } catch (error: any) {
    console.error('Get video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find video in mock data
    const video = mockVideos.find(v => v._id === id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // In a real app, you would delete from database
    // For mock data, we'll just return success
    return NextResponse.json({
      message: 'Video deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

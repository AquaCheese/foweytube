import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Video } from '@/models/Video';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const videos = await Video.find({ uploaderId: params.id })
      .populate('uploaderId', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .lean() as any[];

    const formattedVideos = videos.map((video) => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      views: video.views,
      duration: video.duration,
      createdAt: video.createdAt,
      uploaderId: video.uploaderId._id,
      uploader: {
        displayName: video.uploaderId.displayName,
        username: video.uploaderId.username,
        avatar: video.uploaderId.avatar,
      },
    }));

    return NextResponse.json({
      videos: formattedVideos,
    });
  } catch (error) {
    console.error('Error fetching user videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

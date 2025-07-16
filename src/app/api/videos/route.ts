import { NextRequest, NextResponse } from 'next/server';
import { mockVideos, mockUsers } from '@/lib/mockData';
import { verifyToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Use mock data instead of database
    const videos = mockVideos.slice(skip, skip + limit);
    const user = mockUsers[0]; // First mock user
    
    // Transform the data to match our interface
    const transformedVideos = videos.map((video) => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: video.duration,
      views: video.views,
      uploaderId: video.uploaderId,
      uploader: {
        displayName: user.displayName,
        username: user.username,
        avatar: user.avatar,
      },
      createdAt: video.createdAt,
    }));
    
    return NextResponse.json({
      videos: transformedVideos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockVideos.length / limit),
        totalVideos: mockVideos.length,
        hasNextPage: page * limit < mockVideos.length,
        hasPrevPage: page > 1,
      }
    });
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookie or header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create mock video entry
    const newVideo = {
      _id: uuidv4(),
      title: title.trim(),
      description: description?.trim() || '',
      thumbnail: '/placeholder-thumbnail.jpg',
      videoUrl: '/demo-video.mp4',
      uploaderId: user.userId,
      tags: [],
      views: 0,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      duration: Math.floor(Math.random() * 600) + 60, // Random duration 1-10 minutes
      isPublic: true,
      createdAt: new Date().toISOString(),
    };

    // Add to mock data (in memory only)
    mockVideos.unshift(newVideo);

    return NextResponse.json({
      message: 'Video uploaded successfully (demo mode)',
      video: newVideo
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

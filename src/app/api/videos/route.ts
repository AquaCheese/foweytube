import { NextRequest, NextResponse } from 'next/server';
import { mockVideos, mockUsers } from '@/lib/mockData';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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
    // Remove database connection
    // await connectDB();
    
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
    const videoFile = formData.get('video') as File;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    if (!videoFile || !title) {
      return NextResponse.json(
        { error: 'Video file and title are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const videosDir = join(uploadsDir, 'videos');
    const thumbnailsDir = join(uploadsDir, 'thumbnails');
    
    try {
      await mkdir(uploadsDir, { recursive: true });
      await mkdir(videosDir, { recursive: true });
      await mkdir(thumbnailsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filenames
    const videoId = uuidv4();
    const videoExtension = videoFile.name.split('.').pop();
    const videoFilename = `${videoId}.${videoExtension}`;
    const videoPath = join(videosDir, videoFilename);
    
    // Save video file
    const videoBytes = await videoFile.arrayBuffer();
    const videoBuffer = Buffer.from(videoBytes);
    await writeFile(videoPath, videoBuffer);

    let thumbnailUrl = '';
    if (thumbnailFile) {
      const thumbnailExtension = thumbnailFile.name.split('.').pop();
      const thumbnailFilename = `${videoId}.${thumbnailExtension}`;
      const thumbnailPath = join(thumbnailsDir, thumbnailFilename);
      
      const thumbnailBytes = await thumbnailFile.arrayBuffer();
      const thumbnailBuffer = Buffer.from(thumbnailBytes);
      await writeFile(thumbnailPath, thumbnailBuffer);
      
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
    } else {
      // Use a default thumbnail
      thumbnailUrl = '/placeholder-thumbnail.jpg';
    }

    // Parse tags
    const videoTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // For demo, just return a success response
    // In a real app, this would save to database
    const newVideo = {
      _id: videoId,
      title: title.trim(),
      description: description?.trim() || '',
      thumbnail: thumbnailUrl,
      duration: 0,
      views: 0,
      uploaderId: user.userId,
      uploader: {
        displayName: 'Demo User',
        username: 'demouser',
        avatar: null,
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Video uploaded successfully',
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

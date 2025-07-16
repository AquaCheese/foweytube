import { NextRequest, NextResponse } from 'next/server';
import { mockVideos } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userVideos = mockVideos.filter(v => v.uploaderId === params.id);
    
    return NextResponse.json({
      videos: userVideos,
      totalVideos: userVideos.length,
    });
  } catch (error) {
    console.error('Error fetching user videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

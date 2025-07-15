import { NextRequest, NextResponse } from 'next/server';
import { mockComments, mockUsers } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Filter comments for this video
    const videoComments = mockComments.filter(c => c.videoId === id);

    return NextResponse.json({
      success: true,
      comments: videoComments.map(comment => {
        // Find the author user
        const author = mockUsers.find(u => u._id === comment.authorId);
        return {
          id: comment._id,
          content: comment.content,
          author: author ? {
            id: author._id,
            username: author.username,
            displayName: author.displayName,
            avatar: author.avatar
          } : null,
          likes: comment.likes,
          createdAt: comment.createdAt
        };
      })
    });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // In a real app, you would save to database
    // For mock data, we'll just return success
    const newComment = {
      id: `comment_${Date.now()}`,
      content: content.trim(),
      author: {
        id: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        avatar: null
      },
      likes: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      comment: newComment
    });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
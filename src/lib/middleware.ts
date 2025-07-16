import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }
    
    const user = await getUserById(decoded.userId);
    return user;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return handler(request, user);
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/auth-service';

export async function verifyAdminAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  user?: any;
  response?: NextResponse;
}> {
  try {
    const sessionToken = request.cookies.get('auth-token')?.value;

    if (!sessionToken) {
      return {
        isAuthenticated: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        ),
      };
    }

    const sessionData = await authService.validateSession(sessionToken);

    if (!sessionData) {
      return {
        isAuthenticated: false,
        response: NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        ),
      };
    }

    return {
      isAuthenticated: true,
      user: sessionData.user,
    };

  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      isAuthenticated: false,
      response: NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      ),
    };
  }
}

export function withAdminAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await verifyAdminAuth(request);
    
    if (!authResult.isAuthenticated) {
      return authResult.response!;
    }

    return handler(request, authResult.user);
  };
}

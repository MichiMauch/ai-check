import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/auth-service';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Login durchführen
    const loginResult = await authService.login(username, password, {
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Session-Cookie setzen
    const cookieStore = cookies();
    cookieStore.set('auth-token', loginResult.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 Stunden
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: loginResult.user,
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

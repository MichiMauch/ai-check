import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/auth-service';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('auth-token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Session validieren
    const sessionData = await authService.validateSession(sessionToken);

    if (!sessionData) {
      // Ungültiges Token - Cookie löschen
      cookieStore.delete('auth-token');
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Session verlängern bei erfolgreicher Validierung
    await authService.extendSession(sessionToken);

    return NextResponse.json({
      success: true,
      user: sessionData.user,
    });

  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

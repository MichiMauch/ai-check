import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/auth-service';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('auth-token')?.value;

    if (sessionToken) {
      // Session aus der Datenbank löschen
      await authService.logout(sessionToken);
    }

    // Cookie löschen
    cookieStore.delete('auth-token');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);
    
    // Auch bei Fehlern Cookie löschen
    const cookieStore = cookies();
    cookieStore.delete('auth-token');

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

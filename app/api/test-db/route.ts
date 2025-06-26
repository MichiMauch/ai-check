import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL);
    console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'SET' : 'NOT SET');
    
    const db = getDB();
    console.log('Database client created successfully');
    
    // Simple test query
    const result = await db.run('SELECT 1 as test');
    console.log('Test query result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      envVars: {
        url: process.env.TURSO_DATABASE_URL,
        tokenSet: !!process.env.TURSO_AUTH_TOKEN
      }
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

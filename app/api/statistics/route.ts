import { NextResponse } from 'next/server';
import { assessmentService, emailLeadService } from '@/lib/db/services';

export async function GET() {
  try {
    const [assessmentStats, leadStats] = await Promise.all([
      assessmentService.getStatistics(),
      emailLeadService.getLeadStatistics(),
    ]);

    return NextResponse.json({
      assessments: assessmentStats,
      leads: leadStats,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

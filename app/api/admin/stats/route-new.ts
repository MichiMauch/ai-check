import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/admin-middleware';
import { assessmentService, emailLeadService } from '@/lib/db/services';

async function handleStatsRequest(request: NextRequest, user: any) {
  try {
    // Erweiterte Statistiken für Admin-Dashboard
    const [
      totalAssessments,
      totalLeads,
      industryStats,
      levelStats,
      companySizeStats,
      recentAssessments,
      recentLeads,
    ] = await Promise.all([
      // Gesamtzahl Assessments
      assessmentService.getTotalAssessments(),
      
      // Gesamtzahl Leads
      emailLeadService.getTotalLeads(),
      
      // Statistiken nach Industrie
      assessmentService.getStatsByIndustry(),
      
      // Statistiken nach Level
      assessmentService.getStatsByLevel(),
      
      // Statistiken nach Unternehmensgröße
      assessmentService.getStatsByCompanySize(),

      // Letzte Assessments
      assessmentService.getRecentAssessments(10),

      // Letzte Leads
      emailLeadService.getRecentLeads(10),
    ]);

    return NextResponse.json({
      summary: {
        totalAssessments,
        totalLeads,
        conversionRate: totalAssessments > 0 ? ((totalLeads / totalAssessments) * 100).toFixed(2) : '0',
      },
      industryStats,
      levelStats,
      companySizeStats,
      recent: {
        assessments: recentAssessments,
        leads: recentLeads,
      },
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleStatsRequest);

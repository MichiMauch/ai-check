import { NextRequest, NextResponse } from 'next/server';
import { assessmentService, emailLeadService } from '@/lib/db/services';
import type { AssessmentResult } from '@/types/assessment';

// Hilfsfunktion für Client-IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      result,
      answers,
      email,
      completionTimeMs,
    }: {
      result: AssessmentResult;
      answers: number[];
      email?: string;
      completionTimeMs?: number;
    } = body;

    // Validierung
    if (!result || !answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'Assessment result and answers are required' },
        { status: 400 }
      );
    }

    // Meta-Daten sammeln
    const metadata = {
      email,
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || undefined,
      completionTimeMs,
      answers,
    };

    // Assessment speichern
    const assessmentId = await assessmentService.saveAssessment(result, metadata);

    // E-Mail-Lead speichern falls vorhanden
    let leadId: string | undefined;
    if (email) {
      leadId = await emailLeadService.saveOrUpdateLead(email, {
        assessmentId,
        industryId: result.company_info.industry, // Jetzt ist es bereits eine ID
        companySize: result.company_info.companySize,
        calculatedLevel: result.calculated_level,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        source: 'assessment',
      });
    }

    return NextResponse.json({
      success: true,
      assessmentId,
      leadId,
    });

  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Query-Parameter für Assessment-ID
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('id');

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const assessment = await assessmentService.getAssessment(assessmentId);

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ assessment });

  } catch (error) {
    console.error('Error retrieving assessment:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve assessment' },
      { status: 500 }
    );
  }
}

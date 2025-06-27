import { NextRequest, NextResponse } from 'next/server';
import { dynamicUseCaseEngine } from '@/lib/dynamic-use-case-engine';
import type { AssessmentResult } from '@/types/assessment';

// Vercel Function Configuration
export const maxDuration = 60; // 60 seconds for OpenAI API calls
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const assessmentResult: AssessmentResult = await request.json();

    if (!assessmentResult || !assessmentResult.company_info) {
      return NextResponse.json(
        { error: 'Invalid assessment data' },
        { status: 400 }
      );
    }

    console.log('=== DYNAMIC USE CASE GENERATION ===');
    console.log('Assessment Industry:', assessmentResult.company_info.industry);
    console.log('Company Size:', assessmentResult.company_info.companySize);
    console.log('Maturity Level:', assessmentResult.calculated_level);
    console.log('Score:', assessmentResult.score);

    // Generiere dynamische Use Case Empfehlungen mit OpenAI
    const recommendations = await dynamicUseCaseEngine.generateRecommendations(assessmentResult);

    const processingTime = Date.now() - startTime;
    console.log('Generated Dynamic Recommendations:', recommendations.length);
    console.log('Processing Time:', processingTime + 'ms');
    console.log('Recommendations IDs:', recommendations.map(r => r.useCase.id));

    return NextResponse.json({
      recommendations,
      meta: {
        totalCount: recommendations.length,
        industry: assessmentResult.company_info.industry,
        maturityLevel: assessmentResult.calculated_level,
        score: assessmentResult.score,
        generatedAt: new Date().toISOString(),
        generationType: 'dynamic-ai-powered',
        processingTimeMs: processingTime
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Dynamic use case generation error:', error);
    console.error('Processing Time before error:', processingTime + 'ms');
    
    // Spezielle Behandlung für Timeout-Errors
    if (error instanceof Error && (
      error.message.includes('timeout') || 
      error.message.includes('ETIMEDOUT') ||
      processingTime > 55000 // 55 Sekunden
    )) {
      return NextResponse.json(
        { 
          error: 'AI generation timeout - please try again',
          errorType: 'timeout',
          processingTimeMs: processingTime,
          suggestion: 'The AI service is currently experiencing high load. Please try again in a moment.'
        },
        { status: 408 } // Request Timeout
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate AI-powered recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTimeMs: processingTime
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { AI_USE_CASES, getUseCasesByIndustry, getUseCasesByComplexity } from '@/lib/ai-use-cases-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const complexity = searchParams.get('complexity');
    const category = searchParams.get('category');

    let filteredUseCases = AI_USE_CASES;

    // Filter nach Industrie
    if (industry) {
      filteredUseCases = getUseCasesByIndustry(industry);
    }

    // Filter nach Komplexität
    if (complexity && ['low', 'medium', 'high'].includes(complexity)) {
      filteredUseCases = getUseCasesByComplexity(complexity as 'low' | 'medium' | 'high');
    }

    // Filter nach Kategorie
    if (category) {
      filteredUseCases = filteredUseCases.filter(useCase => useCase.category === category);
    }

    return NextResponse.json({
      useCases: filteredUseCases,
      meta: {
        totalCount: filteredUseCases.length,
        filters: {
          industry,
          complexity,
          category
        }
      }
    });

  } catch (error) {
    console.error('Use cases fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch use cases' },
      { status: 500 }
    );
  }
}

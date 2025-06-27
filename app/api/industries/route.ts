import { NextResponse } from 'next/server';
import { industryService } from '@/lib/db/services';

// GET: Industries abrufen
export async function GET() {
  try {
    const industries = await industryService.getAllActiveIndustries();
    
    return NextResponse.json({
      success: true,
      industries: industries,
      count: industries.length,
    });

  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}

// POST: Industries seeden (nur für Development/Setup)
export async function POST() {
  try {
    await industryService.seedIndustries();
    
    const industries = await industryService.getAllActiveIndustries();
    
    return NextResponse.json({
      success: true,
      message: 'Industries seeded successfully',
      industries: industries,
      count: industries.length,
    });

  } catch (error) {
    console.error('Error seeding industries:', error);
    return NextResponse.json(
      { error: 'Failed to seed industries' },
      { status: 500 }
    );
  }
}

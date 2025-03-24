import { NextRequest, NextResponse } from 'next/server';
import expertMatchingService from '../../services/ai/expertMatchingService';

// Configure route for static export
export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  try {
    const { projectDescription, location, budget } = await req.json();
    
    if (!projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }
    
    // Use the expert matching service to find matching experts
    const results = await expertMatchingService.findMatchingExperts(
      projectDescription,
      location || 'Any',
      budget || 0
    );
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Expert matching API error:', error);
    return NextResponse.json(
      { error: 'Failed to process expert matching request' },
      { status: 500 }
    );
  }
}

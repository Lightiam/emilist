import { NextRequest, NextResponse } from 'next/server';
import materialRecommendationService from '../../services/ai/materialRecommendationService';

// Configure route for static export
export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  try {
    const { projectDescription, budget, pricePoint } = await req.json();
    
    if (!projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }
    
    // Use the material recommendation service to find matching materials
    const results = await materialRecommendationService.recommendMaterials(
      projectDescription,
      budget || 0
    );
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Material recommendation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process material recommendation request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const materialName = url.searchParams.get('material') || '';
    const pricePoint = (url.searchParams.get('pricePoint') || 'standard') as 'budget' | 'standard' | 'premium';
    
    if (!materialName) {
      return NextResponse.json(
        { error: 'Material name is required' },
        { status: 400 }
      );
    }
    
    // Find alternative materials
    const alternatives = await materialRecommendationService.findAlternativeMaterials(
      materialName,
      pricePoint
    );
    
    return NextResponse.json(alternatives);
  } catch (error) {
    console.error('Alternative materials API error:', error);
    return NextResponse.json(
      { error: 'Failed to find alternative materials' },
      { status: 500 }
    );
  }
}

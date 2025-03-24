import { NextRequest, NextResponse } from 'next/server';
import imageAnalysisService from '../../services/ai/imageAnalysisService';

// Configure route for static export
export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, projectDescription } = await req.json();
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    let results;
    
    // Determine which analysis to perform based on the request
    if (projectDescription) {
      // If project description is provided, suggest improvements
      results = await imageAnalysisService.suggestProjectImprovements(
        imageBase64,
        projectDescription
      );
    } else {
      // Otherwise, perform basic image analysis
      results = await imageAnalysisService.analyzeProjectImage(imageBase64);
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Image analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image analysis request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const imageBase64 = url.searchParams.get('image') || '';
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // Identify materials from the image
    const materials = await imageAnalysisService.identifyMaterialFromImage(imageBase64);
    
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Material identification API error:', error);
    return NextResponse.json(
      { error: 'Failed to identify materials from image' },
      { status: 500 }
    );
  }
}

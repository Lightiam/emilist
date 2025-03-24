import { NextRequest, NextResponse } from 'next/server';
import enhancedSearchService from '../../services/ai/enhancedSearchService';

// Configure route for static export
export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  try {
    const { query, language = 'en-US' } = await req.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Use the enhanced search service to process the query
    const results = await enhancedSearchService.enhanceSearchQuery(query, language);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Enhanced search API error:', error);
    return NextResponse.json(
      { error: 'Failed to process search query' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const partialQuery = url.searchParams.get('q') || '';
    const language = url.searchParams.get('lang') || 'en-US';
    
    // Get search suggestions based on partial query
    const suggestions = await enhancedSearchService.getSearchSuggestions(partialQuery, language);
    
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Search suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to get search suggestions' },
      { status: 500 }
    );
  }
}

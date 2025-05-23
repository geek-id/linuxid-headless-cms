import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/content/parser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') as 'post' | 'page' | 'review' | undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const results = searchContent(query.trim(), type);
    
    // Filter published content only
    const publishedResults = results
      .filter(content => content.published)
      .slice(0, limit);

    return NextResponse.json({
      query: query.trim(),
      total: publishedResults.length,
      results: publishedResults
    });
  } catch (error) {
    console.error('Error searching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
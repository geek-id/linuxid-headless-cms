import { NextRequest, NextResponse } from 'next/server';
import { getContentBySlug, markdownToHtml } from '@/lib/content/parser';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; slug: string } }
) {
  try {
    const { type, slug } = params;
    
    // Validate content type
    if (!['post', 'page', 'review'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const content = getContentBySlug(type as 'post' | 'page' | 'review', slug);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Check if content is published (unless explicitly requesting drafts)
    const includeDrafts = request.nextUrl.searchParams.get('draft') === 'true';
    if (!content.published && !includeDrafts) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Convert markdown to HTML if requested
    const includeHtml = request.nextUrl.searchParams.get('html') === 'true';
    const response = {
      ...content,
      html: includeHtml ? await markdownToHtml(content.content) : undefined
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
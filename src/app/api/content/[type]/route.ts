import { NextRequest, NextResponse } from 'next/server';
import { getAllContent, searchContent } from '@/lib/content/parser';
import { ContentQuery, ContentResponse } from '@/types/content';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    
    // Validate content type
    if (!['post', 'page', 'review'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query: ContentQuery = {
      type: type as 'post' | 'page' | 'review',
      published: searchParams.get('published') !== 'false',
      featured: searchParams.get('featured') === 'true' || undefined,
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'publishedAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    // Get content
    let content = query.search 
      ? searchContent(query.search, type as 'post' | 'page' | 'review')
      : getAllContent(type as 'post' | 'page' | 'review');

    // Filter by published status
    if (query.published !== undefined) {
      content = content.filter(item => item.published === query.published);
    }

    // Filter by featured status
    if (query.featured !== undefined) {
      content = content.filter(item => item.featured === query.featured);
    }

    // Filter by category
    if (query.category) {
      content = content.filter(item => item.category === query.category);
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      content = content.filter(item => 
        item.tags?.some(tag => query.tags!.includes(tag))
      );
    }

    // Sort content
    content.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (query.sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'updatedAt':
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
        default:
          aValue = a.publishedAt || a.createdAt;
          bValue = b.publishedAt || b.createdAt;
      }

      if (query.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Pagination
    const total = content.length;
    const totalPages = Math.ceil(total / query.limit!);
    const startIndex = (query.page! - 1) * query.limit!;
    const endIndex = startIndex + query.limit!;
    const paginatedContent = content.slice(startIndex, endIndex);

    const response: ContentResponse = {
      data: paginatedContent,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages
      }
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
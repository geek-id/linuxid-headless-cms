import { getAllContent } from '@/lib/content/parser';
import { BlogPost, Review, Page } from '@/types/content';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all content from the parser
    const allPosts = getAllContent('post') as BlogPost[];
    const allReviews = getAllContent('review') as Review[];
    const allPages = getAllContent('page') as Page[];

    // Convert to a format suitable for the admin interface
    const contentData = {
      posts: allPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        type: 'post',
        status: post.published ? 'published' : 'draft',
        publishedAt: post.publishedAt?.toISOString(),
        excerpt: post.excerpt,
        author: typeof post.author === 'string' ? post.author : post.author?.name || 'Unknown Author',
        category: post.category,
        tags: post.tags || [],
        featured: post.featured || false,
        content: post.content,
        views: Math.floor(Math.random() * 10000) // Mock views for now
      })),
      reviews: allReviews.map(review => ({
        id: review.id,
        title: review.title,
        slug: review.slug,
        type: 'review',
        status: review.published ? 'published' : 'draft',
        publishedAt: review.publishedAt?.toISOString(),
        excerpt: review.excerpt,
        author: typeof review.author === 'string' ? review.author : review.author?.name || 'Unknown Author',
        category: review.category,
        tags: review.tags || [],
        rating: review.rating,
        featured: review.featured || false,
        content: review.content,
        views: Math.floor(Math.random() * 5000) // Mock views for now
      })),
      pages: allPages.map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        type: 'page',
        status: page.published ? 'published' : 'draft',
        publishedAt: page.publishedAt?.toISOString(),
        excerpt: page.excerpt,
        author: typeof page.author === 'string' ? page.author : page.author?.name || 'Unknown Author',
        category: page.category,
        tags: page.tags || [],
        template: page.template || 'default',
        featured: page.featured || false,
        content: page.content,
        views: Math.floor(Math.random() * 2000) // Mock views for now
      }))
    };

    return NextResponse.json(contentData);
  } catch (error) {
    console.error('Error loading content:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getAllContent } from '@/lib/content/parser';
import { getPostsByStatus, isPostVisible } from '@/lib/content/scheduler';
import { BlogPost } from '@/types/content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url || 'http://localhost:3000/api/admin/posts');
    const status = url.searchParams.get('status') as 'draft' | 'scheduled' | 'published' | null;

    let posts: BlogPost[];

    if (status) {
      posts = getPostsByStatus(status) as BlogPost[];
    } else {
      // Get all posts and determine their status
      const allPosts = getAllContent('post') as BlogPost[];
      posts = allPosts.map(post => ({
        ...post,
        status: !post.published 
          ? 'draft' 
          : isPostVisible(post) 
            ? 'published' 
            : 'scheduled'
      })) as any;
    }

    // Ensure posts is an array
    if (!Array.isArray(posts)) {
      console.error('Posts is not an array:', posts);
      return NextResponse.json([], { status: 200 });
    }

    // Transform posts for admin interface
    const adminPosts = posts.map(post => ({
      id: post.id || post.slug || 'unknown',
      title: post.title || 'Untitled',
      slug: post.slug || 'untitled',
      status: (post as any).status || (!post.published ? 'draft' : isPostVisible(post) ? 'published' : 'scheduled'),
      publishedAt: post.publishedAt,
      scheduledAt: post.publishedAt && !isPostVisible(post) ? post.publishedAt : undefined,
      excerpt: post.excerpt || '',
      author: post.author?.name || post.author || 'Unknown',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    console.log(`Returning ${adminPosts.length} posts for admin dashboard`);
    return NextResponse.json(adminPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
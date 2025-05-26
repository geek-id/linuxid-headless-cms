import { NextRequest, NextResponse } from 'next/server';
import { getAllContent } from '@/lib/content/parser';
import { getPostsByStatus, isPostVisible } from '@/lib/content/scheduler';
import { BlogPost } from '@/types/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'scheduled' | 'published' | null;

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

    // Transform posts for admin interface
    const adminPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: (post as any).status || (!post.published ? 'draft' : isPostVisible(post) ? 'published' : 'scheduled'),
      publishedAt: post.publishedAt,
      scheduledAt: post.publishedAt && !isPostVisible(post) ? post.publishedAt : undefined,
      excerpt: post.excerpt,
      author: post.author?.name || 'Unknown',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    return NextResponse.json(adminPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 
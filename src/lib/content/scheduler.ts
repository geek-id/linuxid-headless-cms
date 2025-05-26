import { ContentType, BlogPost } from '@/types/content';
import { getAllContent } from './parser';

export interface ScheduledPost extends BlogPost {
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'published';
}

/**
 * Get all posts that should be published based on current time
 */
export function getPublishedPosts(): BlogPost[] {
  const allPosts = getAllContent('post') as BlogPost[];
  const now = new Date();

  return allPosts.filter(post => {
    // Check if post is marked as published
    if (!post.published) return false;

    // Check if post has a future publish date
    const publishDate = post.publishedAt || post.createdAt;
    return publishDate <= now;
  });
}

/**
 * Get posts scheduled for future publication
 */
export function getScheduledPosts(): ScheduledPost[] {
  const allPosts = getAllContent('post') as BlogPost[];
  const now = new Date();

  return allPosts
    .filter(post => {
      const publishDate = post.publishedAt || post.createdAt;
      return post.published && publishDate > now;
    })
    .map(post => ({
      ...post,
      status: 'scheduled' as const,
      scheduledAt: post.publishedAt
    }));
}

/**
 * Get draft posts (unpublished)
 */
export function getDraftPosts(): ScheduledPost[] {
  const allPosts = getAllContent('post') as BlogPost[];

  return allPosts
    .filter(post => !post.published)
    .map(post => ({
      ...post,
      status: 'draft' as const
    }));
}

/**
 * Get posts by status
 */
export function getPostsByStatus(status: 'draft' | 'scheduled' | 'published'): ScheduledPost[] {
  switch (status) {
    case 'draft':
      return getDraftPosts();
    case 'scheduled':
      return getScheduledPosts();
    case 'published':
      return getPublishedPosts().map(post => ({
        ...post,
        status: 'published' as const
      }));
    default:
      return [];
  }
}

/**
 * Check if a post should be visible based on current time
 */
export function isPostVisible(post: BlogPost): boolean {
  if (!post.published) return false;
  
  const now = new Date();
  const publishDate = post.publishedAt || post.createdAt;
  
  return publishDate <= now;
}

/**
 * Get next scheduled post
 */
export function getNextScheduledPost(): ScheduledPost | null {
  const scheduledPosts = getScheduledPosts();
  
  if (scheduledPosts.length === 0) return null;
  
  // Sort by scheduled date (earliest first)
  scheduledPosts.sort((a, b) => {
    const dateA = a.scheduledAt || a.publishedAt || a.createdAt;
    const dateB = b.scheduledAt || b.publishedAt || b.createdAt;
    return dateA.getTime() - dateB.getTime();
  });
  
  return scheduledPosts[0];
}

/**
 * Get posts scheduled for a specific date range
 */
export function getPostsInDateRange(startDate: Date, endDate: Date): ScheduledPost[] {
  const allPosts = getAllContent('post') as BlogPost[];
  
  return allPosts
    .filter(post => {
      const publishDate = post.publishedAt || post.createdAt;
      return publishDate >= startDate && publishDate <= endDate;
    })
    .map(post => ({
      ...post,
      status: isPostVisible(post) ? 'published' as const : 'scheduled' as const,
      scheduledAt: post.publishedAt
    }));
}

/**
 * Generate a publishing calendar
 */
export function getPublishingCalendar(): {
  today: ScheduledPost[];
  thisWeek: ScheduledPost[];
  thisMonth: ScheduledPost[];
  upcoming: ScheduledPost[];
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  
  return {
    today: getPostsInDateRange(today, todayEnd),
    thisWeek: getPostsInDateRange(weekStart, weekEnd),
    thisMonth: getPostsInDateRange(monthStart, monthEnd),
    upcoming: getScheduledPosts()
  };
} 
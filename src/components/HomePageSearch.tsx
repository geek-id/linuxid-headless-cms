'use client';

import { BlogPost, Review, Page } from '@/types/content';
import SearchBox from './SearchBox';

interface HomePageSearchProps {
  posts: BlogPost[];
  reviews: Review[];
  pages: Page[];
}

export default function HomePageSearch({ posts, reviews, pages }: HomePageSearchProps) {
  // Transform content for search
  const searchContent = [
    ...posts.filter(post => post.published).map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || '',
      slug: post.slug,
      type: 'post' as const,
      category: post.category,
      tags: post.tags,
      publishedAt: new Date(post.publishedAt || post.createdAt),
      featuredImage: post.featuredImage ? {
        url: post.featuredImage.url,
        alt: post.featuredImage.alt || post.title,
      } : undefined,
    })),
    ...reviews.filter(review => review.published).map(review => ({
      id: review.id,
      title: review.title,
      excerpt: review.excerpt || '',
      slug: review.slug,
      type: 'review' as const,
      category: review.category,
      tags: review.tags,
      publishedAt: new Date(review.publishedAt || review.createdAt),
      featuredImage: review.featuredImage ? {
        url: review.featuredImage.url,
        alt: review.featuredImage.alt || review.title,
      } : undefined,
      rating: 'rating' in review ? review.rating : undefined,
    })),
    ...pages.filter(page => page.published).map(page => ({
      id: page.id,
      title: page.title,
      excerpt: page.excerpt || '',
      slug: page.slug,
      type: 'page' as const,
      category: page.category,
      tags: page.tags,
      publishedAt: new Date(page.publishedAt || page.createdAt),
      featuredImage: page.featuredImage ? {
        url: page.featuredImage.url,
        alt: page.featuredImage.alt || page.title,
      } : undefined,
    })),
  ];

  return (
    <SearchBox
      content={searchContent}
      placeholder="🔍 Search posts, reviews, pages..."
    />
  );
} 
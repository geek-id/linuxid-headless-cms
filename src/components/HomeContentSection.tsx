'use client';

import { BlogPost, Review } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Star } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from './PaginationControls';

interface HomeContentSectionProps {
  posts: BlogPost[];
  reviews: Review[];
}

interface CombinedContent {
  id: string;
  type: 'post' | 'review';
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  createdAt: Date;
  category?: string;
  tags?: string[];
  featuredImage?: {
    url: string;
    alt?: string;
  };
  rating?: number;
  featured?: boolean;
}

export default function HomeContentSection({ posts, reviews }: HomeContentSectionProps) {
  // Combine and sort all content by published date (newest first)
  const allContent: CombinedContent[] = [
    ...posts.map(post => ({
      id: post.id,
      type: 'post' as const,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      publishedAt: post.publishedAt || post.createdAt,
      createdAt: post.createdAt,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage,
      featured: post.featured,
    })),
    ...reviews.map(review => ({
      id: review.id,
      type: 'review' as const,
      title: review.title,
      slug: review.slug,
      excerpt: review.excerpt || '',
      publishedAt: review.publishedAt || review.createdAt,
      createdAt: review.createdAt,
      category: review.category,
      tags: review.tags,
      featuredImage: review.featuredImage,
      rating: review.rating,
      featured: review.featured,
    }))
  ].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const pagination = usePagination(allContent, 10);

  return (
    <>
      {pagination.paginatedItems.map((content) => {
        const href = content.type === 'post' ? `/posts/${content.slug}` : `/reviews/${content.slug}`;
        
        return (
          <article key={content.id} className="post-card">
            <div className="post-image">
              {content.featuredImage ? (
                <Image
                  src={content.featuredImage.url}
                  alt={content.featuredImage.alt || content.title}
                  width={800}
                  height={200}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Image
                  src={content.type === 'post' ? "/static/img/default-post.svg" : "/static/img/default-review.svg"}
                  alt={`Default ${content.type} image`}
                  width={800}
                  height={200}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>
            <div className="post-content">
              <div className="post-meta">
                <span>{formatDistanceToNow(content.publishedAt)} ago</span>
                {content.category && (
                  <span className="post-tag">{content.category}</span>
                )}
                {/* Show rating for reviews */}
                {content.type === 'review' && content.rating && (
                  <span className="flex items-center text-sm">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {content.rating}/5
                  </span>
                )}
                {content.tags && content.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="post-tag">{tag}</span>
                ))}
              </div>
              <h3 className="post-title">
                <Link href={href}>
                  {content.title}
                </Link>
              </h3>
              <p className="post-excerpt">
                {content.excerpt}
              </p>
              <Link href={href} className="read-more">
                {content.type === 'post' ? 'Read solution' : 'Read review'} <ArrowRight className="inline w-3 h-3 ml-1" />
              </Link>
            </div>
          </article>
        );
      })}
      
      {pagination.totalPages > 1 && (
        <div style={{ marginTop: '3rem' }}>
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
            visiblePages={pagination.getVisiblePages()}
            onPageChange={pagination.goToPage}
            onPrevious={pagination.goToPrevious}
            onNext={pagination.goToNext}
          />
        </div>
      )}
    </>
  );
} 
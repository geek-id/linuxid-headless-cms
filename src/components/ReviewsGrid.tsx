'use client';

import { Review } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from './PaginationControls';

interface ReviewsGridProps {
  reviews: Review[];
}

// Color schemes for review cards
const reviewCardColors = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }, // Purple gradient
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }, // Pink gradient  
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }, // Blue gradient
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }, // Green gradient
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }, // Orange gradient
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }, // Light gradient
  { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }, // Soft pink
  { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }, // Peach
];

function getReviewCardStyle(index: number) {
  return reviewCardColors[index % reviewCardColors.length];
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  const pagination = usePagination(reviews, 15);

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem'
      }}>
        {pagination.paginatedItems.map((review, index) => {
          const cardStyle = getReviewCardStyle(index);
          const rating = 'rating' in review ? (review as any).rating : 0;
          return (
            <Link 
              key={review.id} 
              href={`/reviews/${review.slug}`}
              className="regular-card"
              style={{ 
                '--card-bg': cardStyle.bg,
                position: 'relative'
              } as React.CSSProperties}
            >
              {/* Featured Image */}
              {review.featuredImage ? (
                <div style={{ 
                  width: 'calc(100% + 3rem)',
                  height: '200px',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  overflow: 'hidden',
                  marginBottom: '0',
                  position: 'relative',
                  marginTop: '-1.5rem',
                  marginLeft: '-1.5rem',
                  marginRight: '-1.5rem'
                }}>
                  <Image
                    src={review.featuredImage.url}
                    alt={review.featuredImage.alt || review.title}
                    width={800}
                    height={200}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ) : (
                <div style={{ 
                  width: 'calc(100% + 3rem)',
                  height: '200px',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  overflow: 'hidden',
                  marginBottom: '0',
                  position: 'relative',
                  marginTop: '-1.5rem',
                  marginLeft: '-1.5rem',
                  marginRight: '-1.5rem'
                }}>
                  <Image
                    src="/static/img/default-review.svg"
                    alt="Default review image"
                    width={800}
                    height={200}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              
              {/* Content */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ 
                  fontSize: '0.8rem', 
                  opacity: '0.9', 
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{format(review.publishedAt || review.createdAt, 'MMM d, yyyy')}</span>
                  {rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '1rem' }}>⭐</span>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{rating}/5</span>
                    </div>
                  )}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  lineHeight: '1.3'
                }}>
                  {review.title}
                </h3>
                
                <p style={{ 
                  opacity: '0.9', 
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  marginBottom: '1rem'
                }}>
                  {review.excerpt}
                </p>
                
                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {review.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author */}
                {review.author && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    opacity: '0.8',
                    fontStyle: 'italic'
                  }}>
                    Reviewed by {review.author.name}
                  </div>
                )}

                {/* Featured Badge */}
                {review.featured && (
                  <div style={{ 
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255,255,255,0.9)',
                    color: 'var(--primary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    ⭐ Featured
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

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
    </>
  );
} 
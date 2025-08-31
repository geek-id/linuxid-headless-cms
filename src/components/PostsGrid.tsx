'use client';

import { BlogPost } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from './PaginationControls';

interface PostsGridProps {
  posts: BlogPost[];
}

// All Solutions & Insights color scheme - teal to dark gray gradient only
const solutionsCardColors = [
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '🐧' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '🔧' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '⚙️' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '🛠️' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '📦' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '🔒' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '📊' },
  { bg: 'linear-gradient(135deg, #08D9D6 0%, #252A34 100%)', icon: '🌐' },
];

function getSolutionsCardStyle(index: number) {
  return solutionsCardColors[index % solutionsCardColors.length];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  const pagination = usePagination(posts, 15);

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem'
      }}>
        {pagination.paginatedItems.map((post, index) => {
          const cardStyle = getSolutionsCardStyle(index);
          return (
            <Link 
              key={post.id} 
              href={`/posts/${post.slug}`}
              className="regular-card"
              style={{ 
                '--card-bg': cardStyle.bg 
              } as React.CSSProperties}
            >
              {/* Featured Image */}
              {post.featuredImage ? (
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
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
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
                    src="/static/img/default-post.svg"
                    alt="Default post image"
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
                  marginBottom: '0.75rem'
                }}>
                  {format(post.publishedAt || post.createdAt, 'MMM d, yyyy')}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  lineHeight: '1.3'
                }}>
                  {post.title}
                </h3>
                
                <p style={{ 
                  opacity: '0.9', 
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  marginBottom: '1rem'
                }}>
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {post.tags.slice(0, 3).map(tag => (
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
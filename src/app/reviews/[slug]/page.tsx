import { getAllContent, getContentBySlug } from '@/lib/content/parser';
import { Review } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TableOfContents from '@/components/TableOfContents';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const reviews = getAllContent('review') as Review[];
  return reviews
    .filter(review => review.published)
    .map(review => ({
      slug: review.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = getContentBySlug('review', params.slug) as Review | null;
  
  if (!review || !review.published) {
    return {
      title: 'Review Not Found',
    };
  }

  return {
    title: review.seo?.title || review.title,
    description: review.seo?.description || review.excerpt,
    keywords: review.seo?.keywords?.join(', ') || review.tags?.join(', '),
    openGraph: {
      title: review.seo?.ogTitle || review.title,
      description: review.seo?.ogDescription || review.excerpt,
      images: review.featuredImage ? [review.featuredImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: review.seo?.twitterTitle || review.title,
      description: review.seo?.twitterDescription || review.excerpt,
      images: review.featuredImage ? [review.featuredImage.url] : [],
    },
  };
}

function renderStars(rating: number) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: '1.2rem',
            color: star <= rating ? '#fbbf24' : 'var(--text-muted)'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default async function ReviewPage({ params }: Props) {
  const review = getContentBySlug('review', params.slug) as Review | null;
  
  if (!review || !review.published) {
    notFound();
  }

  const rating = 'rating' in review ? (review as any).rating : 0;

  // Get related reviews
  const allReviews = getAllContent('review') as Review[];
  const relatedReviews = allReviews
    .filter(r => 
      r.published && 
      r.id !== review.id && 
      (r.category === review.category || r.tags?.some(tag => review.tags?.includes(tag)))
    )
    .slice(0, 3);

  const reviewUrl = `${siteConfig.siteUrl}/reviews/${review.slug}`;

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Article Header */}
      <header className="article-header">
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ 
            marginBottom: '1rem', 
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
          }}>
            <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>→</span>
            <Link href="/reviews" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Reviews</Link>
            <span style={{ margin: '0 0.5rem' }}>→</span>
            <span>{review.title}</span>
          </div>

          {/* Category and Meta */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {review.category && (
              <span className="post-tag" style={{ 
                background: 'var(--accent)', 
                color: 'white',
                fontSize: '0.8rem'
              }}>
                {review.category}
              </span>
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              📅 {format(review.publishedAt || review.createdAt, 'MMMM d, yyyy')}
            </span>
            {rating > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'var(--bg-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '2px solid var(--accent)'
              }}>
                {renderStars(rating)}
                <span style={{ 
                  fontWeight: '700', 
                  color: 'var(--accent)',
                  fontSize: '1rem'
                }}>
                  {rating}/5
                </span>
              </div>
            )}
          </div>

          <h1 className="article-title">{review.title}</h1>

          {/* Excerpt */}
          {review.excerpt && (
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
              fontStyle: 'italic'
            }}>
              {review.excerpt}
            </p>
          )}

          <div className="article-meta">
            {review.author && (
              <>
                <span>👤 Reviewed by: {review.author.name}</span>
                <span>•</span>
              </>
            )}
            <span>🔄 Updated: {formatDistanceToNow(review.updatedAt || review.createdAt)} ago</span>
            {rating > 0 && (
              <>
                <span>•</span>
                <span>⭐ Rating: {rating}/5 stars</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <main className="main">
        <div className="container">
          <div className="post-layout">
            {/* Main Review Content */}
            <div className="post-main">
              {/* Featured Image */}
              {review.featuredImage && (
                <div style={{ marginBottom: '3rem' }}>
                  <div style={{ 
                    aspectRatio: '16/9', 
                    position: 'relative', 
                    borderRadius: '0.5rem', 
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <Image
                      src={review.featuredImage.url}
                      alt={review.featuredImage.alt || review.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                  {review.featuredImage.caption && (
                    <p style={{ 
                      textAlign: 'center', 
                      marginTop: '0.5rem', 
                      fontSize: '0.9rem', 
                      color: 'var(--text-muted)', 
                      fontStyle: 'italic' 
                    }}>
                      {review.featuredImage.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Rating Summary */}
              {rating > 0 && (
                <div style={{ 
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }}>
                  <h2 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    Overall Rating
                  </h2>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '3rem', 
                      fontWeight: '700', 
                      color: 'var(--accent)'
                    }}>
                      {rating}
                    </span>
                    <div>
                      {renderStars(rating)}
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.9rem',
                        marginTop: '0.25rem'
                      }}>
                        out of 5 stars
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <article className="article-content">
                <div dangerouslySetInnerHTML={{ __html: review.content }} />
              </article>

              {/* Tags */}
              {review.tags && review.tags.length > 0 && (
                <div style={{ 
                  marginTop: '3rem', 
                  paddingTop: '2rem', 
                  borderTop: '1px solid var(--border)' 
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem', 
                    color: 'var(--text-primary)' 
                  }}>
                    Tags:
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {review.tags.map((tag) => (
                      <span key={tag} className="post-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ 
                marginTop: '3rem', 
                paddingTop: '2rem', 
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Link
                  href="/reviews"
                  className="cta-button"
                  style={{ 
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⭐ More Reviews
                </Link>
              </div>
            </div>

            {/* Table of Contents Sidebar */}
            <aside className="post-sidebar">
              <TableOfContents 
                content={review.content} 
                postTitle={review.title}
                postUrl={reviewUrl}
              />
            </aside>
          </div>
        </div>
      </main>

      {/* Related Reviews */}
      {relatedReviews.length > 0 && (
        <section style={{ 
          background: 'var(--bg-secondary)', 
          padding: '4rem 0',
          marginTop: '4rem'
        }}>
          <div className="container">
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: 'var(--text-primary)',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              Related Reviews
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {relatedReviews.map((relatedReview) => {
                const relatedRating = 'rating' in relatedReview ? (relatedReview as any).rating : 0;
                return (
                  <article key={relatedReview.id} className="post-card">
                    <div className="post-content">
                      <div className="post-meta">
                        <span>{formatDistanceToNow(relatedReview.publishedAt || relatedReview.createdAt)} ago</span>
                        {relatedRating > 0 && (
                          <span className="post-tag" style={{ background: 'var(--accent)', color: 'white' }}>
                            ⭐ {relatedRating}/5
                          </span>
                        )}
                      </div>
                      <h3 className="post-title">
                        <Link href={`/reviews/${relatedReview.slug}`}>
                          {relatedReview.title}
                        </Link>
                      </h3>
                      <p className="post-excerpt">{relatedReview.excerpt}</p>
                      <Link href={`/reviews/${relatedReview.slug}`} className="read-more">
                        Read review →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
} 
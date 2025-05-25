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

// Enhanced metadata generation for reviews
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = getContentBySlug('review', params.slug) as Review | null;
  
  if (!review || !review.published) {
    return {
      title: 'Review Not Found',
    };
  }

  const seoTitle = review.seo?.title || `${review.title} | ${siteConfig.siteName}`;
  const seoDescription = review.seo?.description || review.excerpt || '';
  const seoKeywords = review.seo?.keywords || review.tags || [];
  const reviewUrl = `${siteConfig.siteUrl}/reviews/${review.slug}`;
  const canonicalUrl = (review as any).canonical || reviewUrl;
  const featuredImageUrl = typeof review.featuredImage === 'string' 
    ? review.featuredImage 
    : review.featuredImage?.url;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.join(', '),
    robots: 'index, follow',
    
    openGraph: {
      title: review.seo?.title || review.title,
      description: review.seo?.description || review.excerpt || '',
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      type: 'article',
      publishedTime: review.publishedAt?.toISOString(),
      modifiedTime: review.updatedAt?.toISOString(),
      authors: review.author?.name ? [review.author.name] : [],
      section: review.category,
      tags: review.tags,
      images: featuredImageUrl ? [{
        url: featuredImageUrl,
        width: 1200,
        height: 630,
        alt: typeof review.featuredImage === 'object' 
          ? review.featuredImage?.alt || review.title 
          : review.title,
      }] : [],
    },
    
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: review.seo?.title || review.title,
      description: review.seo?.description || review.excerpt || '',
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
    
    alternates: {
      canonical: canonicalUrl,
    },
    
    other: {
      'article:author': review.author?.name || siteConfig.author,
      'article:section': review.category || 'Reviews',
      'article:tag': review.tags?.join(', ') || '',
      'article:published_time': review.publishedAt?.toISOString() || '',
      'article:modified_time': review.updatedAt?.toISOString() || '',
      'canonical': canonicalUrl,
    },
  };
}

// Generate schema markup for reviews
function generateReviewSchemaMarkup(review: Review): { review: any; breadcrumb: any } {
  const reviewUrl = `${siteConfig.siteUrl}/reviews/${review.slug}`;
  const canonicalUrl = (review as any).canonical || reviewUrl;
  const featuredImageUrl = typeof review.featuredImage === 'string' 
    ? review.featuredImage 
    : review.featuredImage?.url;
  const rating = (review as any).rating || 0;

  const reviewSchema: any = {
    '@context': 'https://schema.org',
    '@type': (review as any).schema?.type || 'Review',
    headline: review.title,
    description: review.excerpt || '',
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    datePublished: (review as any).schema?.datePublished || review.publishedAt?.toISOString() || review.createdAt.toISOString(),
    dateModified: review.updatedAt?.toISOString() || review.createdAt.toISOString(),
    author: {
      '@type': 'Person',
      name: review.author?.name || siteConfig.author,
      url: `${siteConfig.siteUrl}/author/${encodeURIComponent(review.author?.name || siteConfig.author)}`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.siteUrl}/static/img/linux-id_logo.png`,
      },
    },
    image: featuredImageUrl ? {
      '@type': 'ImageObject',
      url: featuredImageUrl,
      width: typeof review.featuredImage === 'object' ? review.featuredImage?.width || 1200 : 1200,
      height: typeof review.featuredImage === 'object' ? review.featuredImage?.height || 630 : 630,
    } : undefined,
    articleSection: review.category || 'Reviews',
    keywords: review.tags?.join(', ') || '',
    inLanguage: 'en-US',
  };

  // Add reading time if available
  if ((review as any).readingTime || (review as any).schema?.readingTime) {
    const readingTimeValue = (review as any).readingTime || (review as any).schema?.readingTime || '';
    const minutes = readingTimeValue.match(/(\d+)/)?.[1] || '15';
    reviewSchema.timeRequired = `PT${minutes}M`;
  }

  // Add rating if available
  if (rating > 0) {
    reviewSchema.reviewRating = {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Reviews',
        item: `${siteConfig.siteUrl}/reviews`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: review.seo?.breadcrumbTitle || review.title,
        item: canonicalUrl,
      },
    ],
  };

  return {
    review: reviewSchema,
    breadcrumb: breadcrumbSchema,
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

  const rating = (review as any).rating || 0;
  const readingTime = (review as any).readingTime || '';

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
  const schemas = generateReviewSchemaMarkup(review);

  return (
    <div>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.review) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      
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
            {readingTime && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ⏱️ {readingTime} read
              </span>
            )}
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
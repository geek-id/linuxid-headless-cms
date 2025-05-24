import { getAllContent } from '@/lib/content/parser';
import { Review } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'Browse all our product reviews and ratings',
};

// Color schemes for review cards
const reviewCardColors = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '⭐' }, // Purple gradient
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🔍' }, // Pink gradient  
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '📊' }, // Blue gradient
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '✅' }, // Green gradient
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '🏆' }, // Orange gradient
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', icon: '📝' }, // Light gradient
  { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', icon: '🎯' }, // Soft pink
  { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', icon: '💎' }, // Peach
];

function getReviewCardStyle(index: number) {
  return reviewCardColors[index % reviewCardColors.length];
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-yellow-300' : 'text-white/30'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const allReviews = getAllContent('review') as Review[];
  const publishedReviews = allReviews.filter(review => review.published);

  // Calculate average rating
  const reviewsWithRating = publishedReviews.filter(review => 'rating' in review && review.rating);
  const averageRating = reviewsWithRating.length > 0 
    ? reviewsWithRating.reduce((sum, review) => sum + (review as any).rating, 0) / reviewsWithRating.length 
    : 0;

  // Separate featured and regular reviews
  const featuredReviews = publishedReviews.filter(review => review.featured);
  const regularReviews = publishedReviews.filter(review => !review.featured);

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="nav container">
          <Link href="/" className="logo">
            {siteConfig.siteName}
          </Link>
          <ul className="nav-menu">
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="/posts" className="nav-link">Blog</Link></li>
            <li><Link href="/reviews" className="nav-link active">Reviews</Link></li>
            <li><Link href="/about" className="nav-link">About</Link></li>
          </ul>
          <ThemeToggle />
          <button className="mobile-menu-btn">☰</button>
        </nav>
      </header>

      {/* Page Header */}
      <section style={{ 
        padding: '3rem 0 2rem', 
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            Product Reviews & Ratings
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            marginBottom: '2rem'
          }}>
            Honest, in-depth reviews of VPS providers, hosting services, development tools, and tech products from real-world usage.
          </p>

          {/* Rating Summary */}
          {reviewsWithRating.length > 0 && (
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: '1.5rem',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--text-primary)'
                }}>
                  {averageRating.toFixed(1)}
                </span>
                <div style={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: '1.25rem',
                        color: star <= Math.round(averageRating) ? '#fbbf24' : 'var(--text-muted)'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Based on {reviewsWithRating.length} review{reviewsWithRating.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          
          {/* Featured Reviews */}
          {featuredReviews.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '600', 
                marginBottom: '2rem',
                color: 'var(--text-primary)'
              }}>
                Featured Reviews
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '2rem',
                marginBottom: '3rem'
              }}>
                {featuredReviews.slice(0, 2).map((review, index) => {
                  const cardStyle = getReviewCardStyle(index);
                  const rating = 'rating' in review ? (review as any).rating : 0;
                  return (
                    <Link 
                      key={review.id} 
                      href={`/reviews/${review.slug}`}
                      className="featured-card"
                      style={{ 
                        '--card-bg': cardStyle.bg 
                      } as React.CSSProperties}
                    >
                      {/* Icon */}
                      <div style={{ 
                        fontSize: '3rem', 
                        textAlign: 'center',
                        marginBottom: '1rem',
                        opacity: '0.9'
                      }}>
                        {cardStyle.icon}
                      </div>
                      
                      {/* Content */}
                      <div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          opacity: '0.9', 
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span>📅 {format(review.publishedAt || review.createdAt, 'MMM d, yyyy')}</span>
                          {rating > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {renderStars(rating)}
                              <span style={{ fontWeight: '600' }}>{rating}/5</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700', 
                          marginBottom: '1rem',
                          lineHeight: '1.3'
                        }}>
                          {review.title}
                        </h3>
                        
                        <p style={{ 
                          opacity: '0.9', 
                          lineHeight: '1.6',
                          marginBottom: '1.5rem'
                        }}>
                          {review.excerpt}
                        </p>
                        
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          Read review →
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* All Reviews Grid */}
          <section>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              marginBottom: '2rem',
              color: 'var(--text-primary)'
            }}>
              All Reviews
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '1.5rem'
            }}>
              {regularReviews.map((review, index) => {
                const cardStyle = getReviewCardStyle(index + featuredReviews.length);
                const rating = 'rating' in review ? (review as any).rating : 0;
                return (
                  <Link 
                    key={review.id} 
                    href={`/reviews/${review.slug}`}
                    className="regular-card"
                    style={{ 
                      '--card-bg': cardStyle.bg 
                    } as React.CSSProperties}
                  >
                    {/* Icon */}
                    <div style={{ 
                      fontSize: '2.5rem', 
                      textAlign: 'center',
                      marginBottom: '1rem',
                      opacity: '0.9'
                    }}>
                      {cardStyle.icon}
                    </div>
                    
                    {/* Content */}
                    <div>
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
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Empty State */}
            {publishedReviews.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 0',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  No reviews yet
                </h3>
                <p>Be the first to share your review!</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>{siteConfig.siteName}</h4>
              <p>{siteConfig.description}</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/posts">Blog</Link></li>
                <li><Link href="/reviews">Reviews</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Categories</h4>
              <ul>
                <li><a href="#">VPS Reviews</a></li>
                <li><a href="#">Hosting Services</a></li>
                <li><a href="#">Development Tools</a></li>
                <li><a href="#">Tech Products</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 {siteConfig.siteName}. Built with Next.js and ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
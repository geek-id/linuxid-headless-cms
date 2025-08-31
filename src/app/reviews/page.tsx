import { getAllContent } from '@/lib/content/parser';
import { Review } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';
import SearchBox from '@/components/SearchBox';
import { siteConfig } from '@/lib/config/site';
import Header from '@/components/Header';
import ReviewsGrid from '@/components/ReviewsGrid';
import Footer from '@/components/Footer';
import { Star, Search, BarChart3, CheckCircle, Trophy, Edit, Target, Gem, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'Browse all our product reviews and ratings',
};

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

  // Separate featured and regular reviews
  const featuredReviews = publishedReviews.filter(review => review.featured);

  // Sort all reviews by date for pagination
  const sortedReviews = publishedReviews.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt);
    const dateB = new Date(b.publishedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Latest published first (descending order)
  });

  return (
    <div>
      {/* Header */}
      <Header />

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
            maxWidth: '600px'
          }}>
            Honest, in-depth reviews of VPS providers, hosting services, development tools, and tech products from real-world usage.
          </p>
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
                      {/* Featured Image */}
                      {review.featuredImage ? (
                        <div style={{ 
                          width: 'calc(100% + 4rem)',
                          height: '250px',
                          borderRadius: '1rem 1rem 0 0',
                          overflow: 'hidden',
                          marginBottom: '0',
                          position: 'relative',
                          marginTop: '-2rem',
                          marginLeft: '-2rem',
                          marginRight: '-2rem'
                        }}>
                          <Image
                            src={review.featuredImage.url}
                            alt={review.featuredImage.alt || review.title}
                            width={800}
                            height={250}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{ 
                          width: 'calc(100% + 4rem)',
                          height: '250px',
                          borderRadius: '1rem 1rem 0 0',
                          overflow: 'hidden',
                          marginBottom: '0',
                          position: 'relative',
                          marginTop: '-2rem',
                          marginLeft: '-2rem',
                          marginRight: '-2rem'
                        }}>
                          <Image
                            src="/static/img/default-review.svg"
                            alt="Default review image"
                            width={800}
                            height={250}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div style={{ marginTop: '2rem' }}>
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

          {/* All Reviews Grid with Pagination */}
          <section>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              marginBottom: '2rem',
              color: 'var(--text-primary)'
            }}>
              All Reviews
            </h2>
            
            <ReviewsGrid reviews={sortedReviews} />

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
      <Footer />
    </div>
  );
} 
import { getAllContent } from '@/lib/content/parser';
import { ContentType, BlogPost, Review, Page } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { siteConfig } from '@/lib/config/site';
import Header from '@/components/Header';
import HomePageSearch from '@/components/HomePageSearch';
import HomeContentSection from '@/components/HomeContentSection';
import Footer from '@/components/Footer';
import { Search, ArrowRight, Calendar, Tag } from 'lucide-react';

export default async function HomePage() {
  // Get latest content
  const allPosts = getAllContent('post') as BlogPost[];
  const allPages = getAllContent('page') as Page[];
  const allReviews = getAllContent('review') as Review[];
  
  // Filter published content
  const publishedPosts = allPosts.filter(post => post.published);
  const publishedReviews = allReviews.filter(review => review.published);
  const latestPosts = publishedPosts.slice(0, 6);
  const latestReviews = publishedReviews.slice(0, 5);

  // Get all unique tags for trending tags
  const allTags = [...allPosts, ...allReviews, ...allPages]
    .flatMap(content => content.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const trendingTags = Object.entries(allTags)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([tag]) => tag);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>System Administrator's Journey</h1>
            <p>Real-world Linux solutions, SRE best practices, DevOps insights, and honest VPS/Cloud provider reviews from the trenches of system administration.</p>
            <Link href="/posts" className="cta-button">
              Explore Solutions <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="content-grid">
            <section className="posts-section">
              <h2>Latest Solutions & Insights</h2>
              
              <HomeContentSection 
                posts={publishedPosts}
                reviews={publishedReviews}
              />
            </section>

            <aside className="sidebar">
              <div className="widget">
                <h3><Search className="inline w-4 h-4 mr-2" />Search Content</h3>
                <HomePageSearch 
                  posts={publishedPosts}
                  reviews={publishedReviews}
                  pages={allPages.filter(page => page.published)}
                />
              </div>

              <div className="widget">
                <h3>Popular Topics</h3>
                <div className="tag-cloud">
                  {trendingTags.map((tag) => (
                    <span key={tag} className="post-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="widget">
                <h3>Recent Solutions</h3>
                <ul className="recent-posts">
                  {latestPosts.slice(0, 5).map((post) => (
                    <li key={post.id}>
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {latestReviews.length > 0 && (
                <div className="widget">
                  <h3>Latest Reviews</h3>
                  <ul className="recent-posts">
                    {latestReviews.map((review) => (
                      <li key={review.id}>
                        <Link href={`/reviews/${review.slug}`}>
                          {review.title}
                          {review.type === 'review' && 'rating' in review && review.rating && (
                            <span style={{ float: 'right', color: 'var(--accent)' }}>
                              ★ {review.rating}/5
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="widget">
                <h3>About {siteConfig.siteName}</h3>
                <p>Sharing real-world system administration experiences, DevOps insights, and honest reviews from someone who's been in the trenches for years. Every solution has been battle-tested in production.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer 
        latestPosts={latestPosts.map(post => ({ title: post.title, slug: post.slug }))}
        popularTags={trendingTags}
      />
    </div>
  );
}

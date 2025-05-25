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
        <div className="container-hero">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>System Administrator's Journey</h1>
              <p>Real-world Linux solutions, SRE best practices, DevOps insights, and honest VPS/Cloud provider reviews from the trenches of system administration.</p>
              <div className="hero-buttons">
                <Link href="/posts" className="btn-primary">
                  Blog Posts
                </Link>
                <Link href="/reviews" className="btn-secondary">
                  Reviews <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="hero-illustration">
              <svg viewBox="0 0 300 275" className="illustration-svg">
                {/* Main Terminal Window */}
                <rect x="0" y="20" width="768" height="260" rx="8" fill="#000000" stroke="#333333" strokeWidth="1"/>
                
                {/* Terminal Header */}
                <rect x="0" y="20" width="768" height="28" rx="8 8 0 0" fill="#2d2d2d"/>
                <circle cx="16" cy="34" r="5" fill="#ff5f57"/>
                <circle cx="36" cy="34" r="5" fill="#ffbd2e"/>
                <circle cx="56" cy="34" r="5" fill="#28ca42"/>
                <text x="80" y="39" fill="#ffffff" fontSize="11" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace" fontWeight="400">root@linuxserver: ~</text>
                
                {/* Terminal Content with exact spacing */}
                <text x="16" y="68" fill="#00ff00" fontSize="13" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">root@linuxserver:~#</text>
                <text x="168" y="68" fill="#ffffff" fontSize="13" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">systemctl status nginx</text>
                
                <text x="16" y="88" fill="#00ff00" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">●</text>
                <text x="30" y="88" fill="#ffffff" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">nginx.service - A high performance web server and reverse proxy</text>
                
                <text x="16" y="106" fill="#808080" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)</text>
                <text x="16" y="122" fill="#808080" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">     Active:</text>
                <text x="75" y="122" fill="#00ff00" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">active (running)</text>
                <text x="195" y="122" fill="#808080" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">since Mon 2024-01-15 10:30:25 UTC; 2 days ago</text>
                
                <text x="16" y="138" fill="#808080" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">       Docs: man:nginx(8)</text>
                <text x="16" y="154" fill="#808080" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">    Process: 1234 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)</text>
                
                <text x="16" y="176" fill="#00ff00" fontSize="13" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">root@linuxserver:~#</text>
                <text x="168" y="176" fill="#ffffff" fontSize="13" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">docker ps</text>
                
                <text x="16" y="196" fill="#00aaff" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">CONTAINER ID   IMAGE         COMMAND                  CREATED       STATUS</text>
                <text x="16" y="212" fill="#ffffff" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">a1b2c3d4e5f6   nginx:latest  "/docker-entrypoint.…"   2 days ago    Up 2 days</text>
                <text x="16" y="228" fill="#ffffff" fontSize="12" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">b7c8d9e0f1a2   redis:alpine  "docker-entrypoint.s…"   2 days ago    Up 2 days</text>
                
                <text x="16" y="250" fill="#00ff00" fontSize="13" fontFamily="SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace">root@linuxserver:~#</text>
                <rect x="168" y="240" width="8" height="14" fill="#00ff00" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="1.2s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
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

import { getAllContent } from '@/lib/content/parser';
import { BlogPost } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';
import SearchBox from '@/components/SearchBox';
import { siteConfig } from '@/lib/config/site';
import Header from '@/components/Header';
import PostsGrid from '@/components/PostsGrid';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Browse all our blog posts and articles',
};

// Color schemes for cards
const cardColors = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🐧' }, // Purple gradient
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🔧' }, // Pink gradient  
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '⚙️' }, // Blue gradient
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '🛠️' }, // Green gradient
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '📦' }, // Orange gradient
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', icon: '🔒' }, // Light gradient
  { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', icon: '📊' }, // Soft pink
  { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', icon: '🌐' }, // Peach
];

// Featured posts color scheme - solid #F38181
const featuredCardColors = [
  { bg: '#F38181', icon: '⭐' },
  { bg: '#F38181', icon: '🚀' },
  { bg: '#F38181', icon: '💎' },
  { bg: '#F38181', icon: '🔥' },
  { bg: '#F38181', icon: '🐧' },
  { bg: '#F38181', icon: '🔧' },
  { bg: '#F38181', icon: '⚙️' },
  { bg: '#F38181', icon: '🛠️' },
];

function getCardStyle(index: number) {
  return cardColors[index % cardColors.length];
}

function getFeaturedCardStyle(index: number) {
  return featuredCardColors[index % featuredCardColors.length];
}

export default async function PostsPage() {
  const allPosts = getAllContent('post') as BlogPost[];
  const publishedPosts = allPosts.filter(post => post.published);
  
  // Transform posts for search
  const searchContent = publishedPosts.map(post => ({
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
  }));
  
  // Get categories and tags for filtering
  const categories = [...new Set(publishedPosts.map(post => post.category).filter(Boolean))];
  const allTags = publishedPosts.flatMap(post => post.tags || []);
  const popularTags = [...new Set(allTags)]
    .map(tag => ({ tag, count: allTags.filter(t => t === tag).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Featured posts
  const featuredPosts = publishedPosts.filter(post => post.featured);

  // Randomly select 2 featured posts for each visitor
  const randomFeaturedPosts = featuredPosts.length > 0 
    ? featuredPosts
        .sort(() => Math.random() - 0.5) // Shuffle the array randomly
        .slice(0, 2) // Take first 2 from shuffled array
    : [];

  // Sort all posts by date for pagination
  const sortedPosts = publishedPosts.sort((a, b) => {
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
            Latest Tutorials & Guides
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px'
          }}>
            Practical Linux system administration, DevOps solutions, and step-by-step tutorials tested in production environments.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          
          {/* Featured Posts */}
          {randomFeaturedPosts.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '600', 
                marginBottom: '2rem',
                color: 'var(--text-primary)'
              }}>
                Featured Tutorials
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '3rem'
              }}>
                {randomFeaturedPosts.map((post, index) => {
                  const cardStyle = getFeaturedCardStyle(index);
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
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Calendar size={14} />
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
            </section>
          )}

          {/* All Posts Grid with Pagination */}
          <section>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600', 
              marginBottom: '2rem',
              color: 'var(--text-primary)'
            }}>
              All Solutions & Insights
            </h2>
            
            <PostsGrid posts={sortedPosts} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 
import { getAllContent, getContentBySlug } from '@/lib/content/parser';
import { BlogPost } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import { generatePostMetadata, generateSchemaMarkup } from '@/lib/seo/metadata';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TableOfContents from '@/components/TableOfContents';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getAllContent('post') as BlogPost[];
  return posts
    .filter(post => post.published)
    .map(post => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getContentBySlug('post', params.slug) as BlogPost | null;
  
  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
    };
  }

  return generatePostMetadata(post);
}

export default async function PostPage({ params }: Props) {
  const post = getContentBySlug('post', params.slug) as BlogPost | null;
  
  if (!post || !post.published) {
    notFound();
  }

  // Get related posts
  const allPosts = getAllContent('post') as BlogPost[];
  const relatedPosts = allPosts
    .filter(p => 
      p.published && 
      p.id !== post.id && 
      (p.category === post.category || p.tags?.some(tag => post.tags?.includes(tag)))
    )
    .slice(0, 3);

  const postUrl = `${siteConfig.siteUrl}/posts/${post.slug}`;
  const schemas = generateSchemaMarkup(post);

  return (
    <div>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
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
            <Link href="/posts" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Blog</Link>
            <span style={{ margin: '0 0.5rem' }}>→</span>
            <span>{post.title}</span>
          </div>

          {/* Category and Meta */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {post.category && (
              <span className="post-tag" style={{ 
                background: 'var(--primary)', 
                color: 'white',
                fontSize: '0.8rem'
              }}>
                {post.category}
              </span>
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              📅 {format(post.publishedAt || post.createdAt, 'MMMM d, yyyy')}
            </span>
            {post.readingTime && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ⏱️ {post.readingTime} min read
              </span>
            )}
          </div>

          <h1 className="article-title">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
              fontStyle: 'italic'
            }}>
              {post.excerpt}
            </p>
          )}

          <div className="article-meta">
            {post.author && (
              <>
                <span>👤 Author: {post.author.name}</span>
                <span>•</span>
              </>
            )}
            <span>🔄 Updated: {formatDistanceToNow(post.updatedAt || post.createdAt)} ago</span>
            {post.series && (
              <>
                <span>•</span>
                <span>📚 Series: {post.series}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <main className="main">
        <div className="container">
          <div className="post-layout">
            {/* Main Article Content */}
            <div className="post-main">
              {/* Featured Image */}
              {post.featuredImage && (
                <div style={{ marginBottom: '3rem' }}>
                  <div style={{ 
                    aspectRatio: '16/9', 
                    position: 'relative', 
                    borderRadius: '0.5rem', 
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                  {post.featuredImage.caption && (
                    <p style={{ 
                      textAlign: 'center', 
                      marginTop: '0.5rem', 
                      fontSize: '0.9rem', 
                      color: 'var(--text-muted)', 
                      fontStyle: 'italic' 
                    }}>
                      {post.featuredImage.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Article Content */}
              <article className="article-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
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
                    {post.tags.map((tag) => (
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
                  href="/posts"
                  className="cta-button"
                  style={{ 
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📖 More Posts
                </Link>
              </div>
            </div>

            {/* Table of Contents Sidebar */}
            <aside className="post-sidebar">
              <TableOfContents 
                content={post.content} 
                postTitle={post.title}
                postUrl={postUrl}
              />
            </aside>
          </div>
        </div>
      </main>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
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
              Related Posts
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="post-card">
                  <div className="post-content">
                    <div className="post-meta">
                      <span>{formatDistanceToNow(relatedPost.publishedAt || relatedPost.createdAt)} ago</span>
                      {relatedPost.category && (
                        <span className="post-tag">{relatedPost.category}</span>
                      )}
                    </div>
                    <h3 className="post-title">
                      <Link href={`/posts/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="post-excerpt">{relatedPost.excerpt}</p>
                    <Link href={`/posts/${relatedPost.slug}`} className="read-more">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
} 
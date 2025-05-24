import { getAllContent, getContentBySlug } from '@/lib/content/parser';
import { Page } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import ThemeToggle from '@/components/ThemeToggle';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const pages = getAllContent('page') as Page[];
  return pages
    .filter(page => page.published)
    .map(page => ({
      slug: page.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getContentBySlug('page', params.slug) as Page | null;
  
  if (!page || !page.published) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
    keywords: page.seo?.keywords?.join(', ') || page.tags?.join(', '),
    openGraph: {
      title: page.seo?.ogTitle || page.title,
      description: page.seo?.ogDescription || page.excerpt,
      images: page.featuredImage ? [page.featuredImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo?.twitterTitle || page.title,
      description: page.seo?.twitterDescription || page.excerpt,
      images: page.featuredImage ? [page.featuredImage.url] : [],
    },
  };
}

export default async function PageRoute({ params }: Props) {
  const page = getContentBySlug('page', params.slug) as Page | null;
  
  if (!page || !page.published) {
    notFound();
  }

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
            <li><Link href="/reviews" className="nav-link">Reviews</Link></li>
            <li><Link href="/about" className={`nav-link ${params.slug === 'about' ? 'active' : ''}`}>About</Link></li>
          </ul>
          <ThemeToggle />
          <button className="mobile-menu-btn">☰</button>
        </nav>
      </header>

      {/* Article Header */}
      <header className="article-header">
        <div className="container">
          <h1 className="article-title">{page.title}</h1>
          <div className="article-meta">
            <span>Published: {format(page.publishedAt || page.createdAt, 'MMMM d, yyyy')}</span>
            {page.author && (
              <>
                <span>•</span>
                <span>Author: {page.author.name}</span>
              </>
            )}
            <span>•</span>
            <span>Updated: {formatDistanceToNow(page.updatedAt)} ago</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Featured Image */}
          {page.featuredImage && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ aspectRatio: '16/9', position: 'relative', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <Image
                  src={page.featuredImage.url}
                  alt={page.featuredImage.alt || page.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {page.featuredImage.caption && (
                <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {page.featuredImage.caption}
                </p>
              )}
            </div>
          )}

          {/* Page Content */}
          <article className="article-content">
            {page.content}
          </article>

          {/* Tags */}
          {page.tags && page.tags.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Tags:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {page.tags.map((tag) => (
                  <span
                    key={tag}
                    className="post-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
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
                <li><a href="#">System Admin</a></li>
                <li><a href="#">DevOps</a></li>
                <li><a href="#">SRE</a></li>
                <li><a href="#">VPS Reviews</a></li>
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
'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';

interface FooterProps {
  latestPosts?: Array<{
    title: string;
    slug: string;
  }>;
  popularTags?: string[];
}

export default function Footer({ latestPosts = [], popularTags = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h4>{siteConfig.siteName}</h4>
            <p>{siteConfig.description}</p>
            <div className="social-links" style={{ marginTop: '1rem' }}>
              <a 
                href="https://github.com/linuxid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                📱 GitHub
              </a>
              <a 
                href="https://twitter.com/linuxid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                🐦 Twitter
              </a>
              <a 
                href="mailto:contact@linuxid.com"
                className="social-link"
              >
                ✉️ Contact
              </a>
            </div>
          </div>

          {/* Categories Menu */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><a href="/posts?category=system-admin">🖥️ System Admin</a></li>
              <li><a href="/posts?category=devops">🚀 DevOps</a></li>
              <li><a href="/posts?category=sre">🔧 SRE</a></li>
              <li><a href="/posts?category=tutorials">📚 Tutorials</a></li>
              <li><a href="/reviews?category=vps">☁️ VPS Reviews</a></li>
              <li><a href="/reviews?category=hosting">🌐 Hosting Services</a></li>
            </ul>
          </div>

          {/* Popular Tags */}
          {popularTags.length > 0 && (
            <div className="footer-section">
              <h4>Popular Tags</h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}>
                {popularTags.slice(0, 10).map((tag) => (
                  <Link
                    key={tag}
                    href={`/posts?tag=${encodeURIComponent(tag)}`}
                    className="footer-tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Resources & Legal */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link href="/sitemap.xml">🗺️ Sitemap</Link></li>
              <li><Link href="/rss.xml">📡 RSS Feed</Link></li>
              <li><a href="https://status.example.com" target="_blank" rel="noopener noreferrer">📊 Status Page</a></li>
            </ul>
            <h4 style={{ marginTop: '1.5rem' }}>Legal</h4>
            <ul>
              <li><Link href="/privacy">🔒 Privacy Policy</Link></li>
              <li><Link href="/terms">📋 Terms of Service</Link></li>
              <li><Link href="/disclaimer">⚠️ Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p>© {currentYear} {siteConfig.siteName}. Built with Next.js and ❤️</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>🚀 Performance optimized</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>🔒 Privacy focused</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>📱 Mobile friendly</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
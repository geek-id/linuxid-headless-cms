'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';
import { 
  Github, 
  Twitter, 
  Mail, 
  Monitor, 
  Rocket, 
  Wrench, 
  BookOpen, 
  Cloud, 
  Globe, 
  Map, 
  Rss, 
  BarChart3, 
  Shield, 
  FileText, 
  AlertTriangle,
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';

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
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Github size={16} />
                GitHub
              </a>
              <a 
                href="https://twitter.com/linuxid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Twitter size={16} />
                Twitter
              </a>
              <a 
                href="mailto:contact@linuxid.com"
                className="social-link"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Mail size={16} />
                Contact
              </a>
            </div>
          </div>

          {/* Categories Menu */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><a href="/posts?category=system-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={16} />System Admin</a></li>
              <li><a href="/posts?category=devops" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Rocket size={16} />DevOps</a></li>
              <li><a href="/posts?category=sre" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wrench size={16} />SRE</a></li>
              <li><a href="/posts?category=tutorials" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={16} />Tutorials</a></li>
              <li><a href="/reviews?category=vps" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cloud size={16} />VPS Reviews</a></li>
              <li><a href="/reviews?category=hosting" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={16} />Hosting Services</a></li>
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
              <li><Link href="/sitemap.xml" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Map size={16} />Sitemap</Link></li>
              <li><Link href="/rss.xml" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Rss size={16} />RSS Feed</Link></li>
              <li><a href="https://status.example.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart3 size={16} />Status Page</a></li>
            </ul>
            <h4 style={{ marginTop: '1.5rem' }}>Legal</h4>
            <ul>
              <li><Link href="/privacy" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={16} />Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} />Terms of Service</Link></li>
              <li><Link href="/disclaimer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={16} />Disclaimer</Link></li>
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Zap size={12} />Performance optimized</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Lock size={12} />Privacy focused</span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Smartphone size={12} />Mobile friendly</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
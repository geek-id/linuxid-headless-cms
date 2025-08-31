/**
 * Centralized Site Configuration
 * Uses environment variables with sensible defaults
 */

export interface SiteConfig {
  // Basic site information
  siteName: string;
  description: string;
  siteUrl: string;
  
  // SEO
  keywords: string[];
  author: string;
  email: string;
  
  // Social Media
  twitterHandle?: string;
  githubUrl?: string;
  
  // Open Graph / Social Sharing
  ogImage: string;
  ogType: string;
  ogLocale: string;
  
  // Analytics
  gaTrackingId?: string;
  plausibleDomain?: string;
}

export const siteConfig: SiteConfig = {
  // Basic site information
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'LinuxID',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Modern, SEO-optimized static site built with Next.js',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://linux-id.net',
  
  // SEO
  keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(',') || [
    'nextjs',
    'static-site',
    'typescript',
    'tailwind',
    'markdown',
    'blog',
    'reviews'
  ],
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'LinuxID Team',
  email: process.env.NEXT_PUBLIC_SITE_EMAIL || 'hello@linux-id.net',
  
  // Social Media
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@linuxid',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geek-id/linuxid-static-site',
  
  // Open Graph / Social Sharing
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || '/static/img/og-image.jpg',
  ogType: process.env.NEXT_PUBLIC_OG_TYPE || 'website',
  ogLocale: process.env.NEXT_PUBLIC_OG_LOCALE || 'en_US',
  
  // Analytics (optional)
  gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
};

export default siteConfig; 
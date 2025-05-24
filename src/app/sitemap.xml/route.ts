import { getAllContent } from '@/lib/content/parser';
import { BlogPost, Review, Page } from '@/types/content';
import { siteConfig } from '@/lib/config/site';

export async function GET() {
  const baseUrl = siteConfig.siteUrl || 'https://your-domain.com';

  // Get all content
  const posts = getAllContent('post') as BlogPost[];
  const reviews = getAllContent('review') as Review[];
  const pages = getAllContent('page') as Page[];

  // Filter published content
  const publishedPosts = posts.filter(post => post.published);
  const publishedReviews = reviews.filter(review => review.published);
  const publishedPages = pages.filter(page => page.published);

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/posts</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/reviews</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Dynamic pages -->
  ${publishedPages.map((page) => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${new Date(page.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Blog posts -->
  ${publishedPosts.map((post) => `
  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Reviews -->
  ${publishedReviews.map((review) => `
  <url>
    <loc>${baseUrl}/reviews/${review.slug}</loc>
    <lastmod>${new Date(review.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
} 
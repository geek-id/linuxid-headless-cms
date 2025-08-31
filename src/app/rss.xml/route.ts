import { getAllContent } from '@/lib/content/parser';
import { BlogPost, Review } from '@/types/content';
import { siteConfig } from '@/lib/config/site';

export async function GET() {
  const baseUrl = siteConfig.siteUrl || 'https://your-domain.com';
  
  // Get all content
  const posts = getAllContent('post') as BlogPost[];
  const reviews = getAllContent('review') as Review[];
  
  // Filter published content and sort by date
  const allContent = [
    ...posts.filter(post => post.published),
    ...reviews.filter(review => review.published)
  ].sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.siteName}</title>
    <description>${siteConfig.description}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>contact@linuxid.com (${siteConfig.siteName})</managingEditor>
    <webMaster>contact@linuxid.com (${siteConfig.siteName})</webMaster>
    <ttl>60</ttl>
    
    ${allContent.map((item) => {
      const link = item.type === 'post' ? `${baseUrl}/posts/${item.slug}` : `${baseUrl}/reviews/${item.slug}`;
      const pubDate = (item.publishedAt || item.createdAt).toUTCString();
      const category = item.category || (item.type === 'post' ? 'Blog Post' : 'Review');
      
      return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.excerpt || ''}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${category}]]></category>
      ${item.author ? `<author>contact@linuxid.com (${item.author.name})</author>` : ''}
      ${item.tags ? item.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ') : ''}
    </item>`;
    }).join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
} 
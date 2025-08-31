import { Metadata } from 'next';
import { BlogPost, SchemaMarkup, SEOMetadata } from '@/types/content';
import { siteConfig } from '@/lib/config/site';

export function generatePostMetadata(post: BlogPost): Metadata {
  const seoTitle = post.seo?.title || `${post.title} | ${siteConfig.siteName}`;
  const seoDescription = post.seo?.description || post.excerpt || '';
  const seoKeywords = post.seo?.keywords || post.tags || [];
  const postUrl = `${siteConfig.siteUrl}/posts/${post.slug}`;
  const canonicalUrl = (post as any).canonical || postUrl;
  const featuredImageUrl = typeof post.featuredImage === 'string' 
    ? post.featuredImage 
    : post.featuredImage?.url;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.join(', '),
    robots: 'index, follow',
    
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt || '',
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: post.author?.name ? [post.author.name] : [],
      section: post.category,
      tags: post.tags,
      images: featuredImageUrl ? [{
        url: featuredImageUrl,
        width: 1200,
        height: 630,
        alt: typeof post.featuredImage === 'object' 
          ? post.featuredImage?.alt || post.title 
          : post.title,
      }] : [],
    },
    
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt || '',
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
    
    alternates: {
      canonical: canonicalUrl,
    },
    
    other: {
      'article:author': post.author?.name || siteConfig.author,
      'article:section': post.category || 'Technology',
      'article:tag': post.tags?.join(', ') || '',
      'article:published_time': post.publishedAt?.toISOString() || '',
      'article:modified_time': post.updatedAt?.toISOString() || '',
      'canonical': canonicalUrl,
    },
  };
}

export function generateSchemaMarkup(post: BlogPost): { article: any; breadcrumb: any } {
  const postUrl = `${siteConfig.siteUrl}/posts/${post.slug}`;
  const canonicalUrl = (post as any).canonical || postUrl;
  const featuredImageUrl = typeof post.featuredImage === 'string' 
    ? post.featuredImage 
    : post.featuredImage?.url;

  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': post.schema?.type || 'Article',
    headline: post.schema?.headline || post.title,
    description: post.excerpt || '',
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    datePublished: post.schema?.datePublished || post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.schema?.dateModified || post.updatedAt?.toISOString() || post.createdAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.schema?.author?.name || post.author?.name || siteConfig.author,
      url: post.schema?.author?.url || `${siteConfig.siteUrl}/author/${encodeURIComponent(post.author?.name || siteConfig.author)}`,
    },
    publisher: {
      '@type': 'Organization',
      name: post.schema?.publisher?.name || siteConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: post.schema?.publisher?.logo || `${siteConfig.siteUrl}/static/img/linux-id_logo.png`,
      },
    },
    image: featuredImageUrl ? {
      '@type': 'ImageObject',
      url: featuredImageUrl,
      width: typeof post.featuredImage === 'object' ? post.featuredImage?.width || 1200 : 1200,
      height: typeof post.featuredImage === 'object' ? post.featuredImage?.height || 630 : 630,
    } : undefined,
    articleSection: post.category || 'Technology',
    keywords: post.tags?.join(', ') || '',
    wordCount: post.schema?.wordCount,
    inLanguage: post.schema?.inLanguage || 'en-US',
    about: post.schema?.about,
    mentions: post.schema?.mentions,
  };

  // Add reading time and difficulty if available
  if (post.readingTime || post.schema?.readingTime) {
    const readingTimeValue = post.readingTime || post.schema?.readingTime || '';
    // Extract number from "X minutes" format
    const minutes = readingTimeValue.match(/(\d+)/)?.[1] || '15';
    baseSchema.timeRequired = `PT${minutes}M`;
  }

  if (post.difficulty || post.schema?.difficulty) {
    baseSchema.educationalLevel = post.difficulty || post.schema?.difficulty;
  }

  // Add breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteConfig.siteUrl}/posts`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.seo?.breadcrumbTitle || post.title,
        item: canonicalUrl,
      },
    ],
  };

  return {
    article: baseSchema,
    breadcrumb: breadcrumbSchema,
  };
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return `${readingTime}`;
}

export function extractKeywords(title: string, content: string, tags?: string[]): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cannot', 'this', 'that', 'these', 'those'];
  
  const titleWords = title.toLowerCase().split(/\s+/).filter(word => 
    word.length > 2 && !commonWords.includes(word)
  );
  
  const contentWords = content.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && !commonWords.includes(word)
  );
  
  const wordFreq: Record<string, number> = {};
  [...titleWords, ...contentWords].forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const topWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([word]) => word);
  
  return [...(tags || []), ...topWords].slice(0, 15);
} 
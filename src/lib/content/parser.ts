import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ContentType, BlogPost, Page, Review, Frontmatter, ImageMetadata } from '@/types/content';

const CONTENT_DIR = process.env.CONTENT_DIR || './content';

// Configure marked options for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true
});

// Custom renderer for better HTML output
const renderer = new marked.Renderer();

// Enhanced code block rendering
renderer.code = function(code, language) {
  const validLanguage = language && language.trim() ? language.trim() : 'text';
  return `<pre><code class="language-${validLanguage}">${code}</code></pre>`;
};

// Enhanced link rendering (add target="_blank" for external links)
renderer.link = function(href, title, text) {
  const isExternal = href.startsWith('http') && !href.includes(process.env.NEXT_PUBLIC_SITE_URL || 'localhost');
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
};

// Enhanced image rendering with lazy loading and responsive attributes
renderer.image = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text ? ` alt="${text}"` : ' alt=""';
  return `<img src="${href}"${altAttr}${titleAttr} loading="lazy" style="max-width: 100%; height: auto;" />`;
};

// Enhanced blockquote rendering
renderer.blockquote = function(quote) {
  return `<blockquote>${quote}</blockquote>`;
};

// Enhanced table rendering
renderer.table = function(header, body) {
  return `<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
};

marked.use({ renderer });

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Generate slug from title if not provided
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Parse image metadata from frontmatter
function parseImageMetadata(imageData: string | ImageMetadata | undefined): ImageMetadata | undefined {
  if (!imageData) return undefined;
  
  if (typeof imageData === 'string') {
    return {
      url: imageData,
      key: extractKeyFromUrl(imageData),
    };
  }
  
  return imageData;
}

// Parse multiple images from frontmatter
function parseImagesMetadata(imagesData: string[] | ImageMetadata[] | undefined): ImageMetadata[] {
  if (!imagesData || !Array.isArray(imagesData)) return [];
  
  return imagesData.map(image => {
    if (typeof image === 'string') {
      return {
        url: image,
        key: extractKeyFromUrl(image),
      };
    }
    return image;
  });
}

// Extract storage key from URL
function extractKeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove leading slash and return path
    return urlObj.pathname.substring(1);
  } catch {
    // If URL parsing fails, try to extract from common cloud storage patterns
    const parts = url.split('/');
    if (parts.length >= 3) {
      return parts.slice(-3).join('/'); // Return last 3 parts (folder/date/filename)
    }
    return url;
  }
}

// Extract images from markdown content
function extractImagesFromMarkdown(content: string): ImageMetadata[] {
  const images: ImageMetadata[] = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const alt = match[1] || '';
    const url = match[2];
    
    images.push({
      url,
      key: extractKeyFromUrl(url),
      alt,
    });
  }
  
  return images;
}

// Process and optimize markdown content for images
function processMarkdownImages(content: string): string {
  // Add loading="lazy" to images for better performance
  return content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, url) => {
      // Add lazy loading and responsive attributes
      return `![${alt}](${url} "loading=lazy")`;
    }
  );
}

// Parse markdown file and return content object
export function parseMarkdownFile(filePath: string, type: 'post' | 'page' | 'review'): ContentType | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    const fileName = path.basename(filePath, '.md');
    const stats = fs.statSync(filePath);
    
    // Parse tags if they're a string
    let tags: string[] = [];
    if (frontmatter.tags) {
      if (typeof frontmatter.tags === 'string') {
        tags = frontmatter.tags.split(',').map(tag => tag.trim());
      } else if (Array.isArray(frontmatter.tags)) {
        tags = frontmatter.tags;
      }
    }

    // Process images
    const processedContent = processMarkdownImages(content);
    const contentImages = extractImagesFromMarkdown(processedContent);
    const featuredImage = parseImageMetadata(frontmatter.featuredImage);
    const frontmatterImages = parseImagesMetadata(frontmatter.images);
    
    // Combine all images (remove duplicates by URL)
    const allImages = [...contentImages, ...frontmatterImages];
    const uniqueImages = allImages.filter((image, index, array) => 
      array.findIndex(img => img.url === image.url) === index
    );

    // Convert markdown to HTML
    const htmlContent = marked(processedContent);

    const baseContent = {
      id: fileName,
      slug: frontmatter.slug || generateSlug(frontmatter.title || fileName),
      title: frontmatter.title || fileName,
      content: htmlContent, // Store as HTML instead of markdown
      excerpt: frontmatter.excerpt,
      featured: frontmatter.featured || false,
      published: frontmatter.published !== false, // default to true
      publishedAt: frontmatter.publishedAt ? new Date(frontmatter.publishedAt) : stats.birthtime,
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
      author: frontmatter.author ? {
        name: frontmatter.author,
        email: '', // Could be enhanced with author database
        avatar: ''
      } : undefined,
      seo: {
        title: frontmatter.seo?.title || frontmatter.title,
        description: frontmatter.seo?.description || frontmatter.excerpt,
        keywords: frontmatter.seo?.keywords || tags,
        canonical: frontmatter.seo?.canonical,
        ogTitle: frontmatter.seo?.ogTitle,
        ogDescription: frontmatter.seo?.ogDescription,
        ogImage: frontmatter.seo?.ogImage || featuredImage?.url,
        ogType: frontmatter.seo?.ogType || 'article',
        twitterCard: frontmatter.seo?.twitterCard || 'summary_large_image',
        twitterTitle: frontmatter.seo?.twitterTitle,
        twitterDescription: frontmatter.seo?.twitterDescription,
        twitterImage: frontmatter.seo?.twitterImage || featuredImage?.url,
        schema: frontmatter.seo?.schema
      },
      tags,
      category: frontmatter.category,
      featuredImage,
      images: uniqueImages
    };

    // Return type-specific content
    switch (type) {
      case 'post':
        return {
          ...baseContent,
          type: 'post',
          readingTime: calculateReadingTime(processedContent),
          series: frontmatter.series,
          seriesOrder: frontmatter.seriesOrder
        } as BlogPost;

      case 'page':
        return {
          ...baseContent,
          type: 'page',
          template: frontmatter.template || 'default',
          parentId: frontmatter.parentId,
          order: frontmatter.order || 0
        } as Page;

      case 'review':
        return {
          ...baseContent,
          type: 'review',
          rating: frontmatter.rating,
          productName: frontmatter.productName,
          productUrl: frontmatter.productUrl,
          productImage: parseImageMetadata(frontmatter.productImage),
          pros: frontmatter.pros || [],
          cons: frontmatter.cons || [],
          verdict: frontmatter.verdict
        } as Review;

      default:
        return null;
    }
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    return null;
  }
}

// Get all files from a directory
export function getContentFiles(type: 'post' | 'page' | 'review'): string[] {
  const dirPath = path.join(process.cwd(), CONTENT_DIR, `${type}s`);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return [];
  }

  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dirPath, file));
}

// Parse all content of a specific type
export function getAllContent(type: 'post' | 'page' | 'review'): ContentType[] {
  const files = getContentFiles(type);
  return files
    .map(file => parseMarkdownFile(file, type))
    .filter((content): content is ContentType => content !== null)
    .sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
}

// Get content by slug
export function getContentBySlug(type: 'post' | 'page' | 'review', slug: string): ContentType | null {
  const allContent = getAllContent(type);
  return allContent.find(content => content.slug === slug) || null;
}

// Convert markdown to HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown);
}

// Search content
export function searchContent(query: string, type?: 'post' | 'page' | 'review'): ContentType[] {
  const types: ('post' | 'page' | 'review')[] = type ? [type] : ['post', 'page', 'review'];
  const allContent: ContentType[] = [];

  types.forEach(t => {
    allContent.push(...getAllContent(t));
  });

  const searchTerms = query.toLowerCase().split(' ');
  
  return allContent.filter(content => {
    const searchText = `
      ${content.title} 
      ${content.excerpt || ''} 
      ${content.content} 
      ${content.tags?.join(' ') || ''} 
      ${content.category || ''}
    `.toLowerCase();

    return searchTerms.every(term => searchText.includes(term));
  });
}

// Get all images used across content
export function getAllContentImages(): ImageMetadata[] {
  const allContent = [
    ...getAllContent('post'),
    ...getAllContent('page'),
    ...getAllContent('review')
  ];

  const allImages: ImageMetadata[] = [];
  
  allContent.forEach(content => {
    if (content.featuredImage) {
      allImages.push(content.featuredImage);
    }
    if (content.images) {
      allImages.push(...content.images);
    }
    if (content.type === 'review' && content.productImage) {
      allImages.push(content.productImage);
    }
  });

  // Remove duplicates by URL
  return allImages.filter((image, index, array) => 
    array.findIndex(img => img.url === image.url) === index
  );
} 
import { getContentBySlug, getAllContent, markdownToHtml } from '@/lib/content/parser';
import { getSiteConfig } from '@/lib/config/file-storage';
import { BlogPost } from '@/types/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllContent('post') as BlogPost[];
  return posts
    .filter(post => post.published)
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getContentBySlug('post', params.slug) as BlogPost;
  
  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteConfig = getSiteConfig();

  return {
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    keywords: post.seo.keywords,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.seo.ogTitle || post.title,
      description: post.seo.ogDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.featuredImage ? [post.featuredImage.url] : undefined,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.twitterTitle || post.title,
      description: post.seo.twitterDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getContentBySlug('post', params.slug) as BlogPost;
  
  if (!post || !post.published) {
    notFound();
  }

  const siteConfig = getSiteConfig();
  const html = await markdownToHtml(post.content);
  
  // Get related posts
  const allPosts = getAllContent('post') as BlogPost[];
  const relatedPosts = allPosts
    .filter(p => p.published && p.id !== post.id && (
      p.category === post.category || 
      p.tags?.some(tag => post.tags?.includes(tag))
    ))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {siteConfig.siteName}
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/posts" className="text-gray-600 hover:text-blue-600 font-medium">
                ← Back to Posts
              </Link>
              <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          {/* Category and Date */}
          <div className="flex items-center space-x-4 mb-4">
            {post.category && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
            )}
            <time className="text-gray-500 text-sm">
              {format(post.publishedAt || post.createdAt, 'MMMM d, yyyy')}
            </time>
            {post.readingTime && (
              <span className="text-gray-500 text-sm">{post.readingTime} min read</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
            <div className="flex items-center">
              {post.author && (
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-xs text-gray-500">
                      Published {formatDistanceToNow(post.publishedAt || post.createdAt)} ago
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Series Info */}
            {post.series && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Part of series:</p>
                <p className="text-sm font-medium text-blue-600">{post.series}</p>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.featuredImage.caption && (
              <p className="text-sm text-gray-500 text-center mt-2 italic">
                {post.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Share this post</h3>
              <div className="flex space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(siteConfig.siteUrl + '/posts/' + post.slug)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteConfig.siteUrl + '/posts/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <Link
              href="/posts"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              More Posts
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {relatedPost.featuredImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={relatedPost.featuredImage.url}
                        alt={relatedPost.featuredImage.alt || relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {relatedPost.category && (
                        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {relatedPost.category}
                        </span>
                      )}
                      <span className="ml-auto text-gray-500 text-sm">
                        {formatDistanceToNow(relatedPost.publishedAt || relatedPost.createdAt)} ago
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/posts/${relatedPost.slug}`} className="hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 {siteConfig.siteName}. Built with Next.js and powered by LinuxID Headless CMS.
          </p>
        </div>
      </footer>
    </div>
  );
} 
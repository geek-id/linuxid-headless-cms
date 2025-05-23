import { getContentBySlug, getAllContent, markdownToHtml } from '@/lib/content/parser';
import { getSiteConfig } from '@/lib/config/file-storage';
import { Review } from '@/types/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const reviews = getAllContent('review') as Review[];
  return reviews
    .filter(review => review.published)
    .map((review) => ({
      slug: review.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const review = getContentBySlug('review', params.slug) as Review;
  
  if (!review || !review.published) {
    return {
      title: 'Review Not Found',
    };
  }

  const siteConfig = getSiteConfig();

  return {
    title: review.seo.title || review.title,
    description: review.seo.description || review.excerpt,
    keywords: review.seo.keywords,
    authors: review.author ? [{ name: review.author.name }] : undefined,
    openGraph: {
      title: review.seo.ogTitle || review.title,
      description: review.seo.ogDescription || review.excerpt,
      type: 'article',
      publishedTime: review.publishedAt?.toISOString(),
      modifiedTime: review.updatedAt.toISOString(),
      images: review.featuredImage ? [review.featuredImage.url] : undefined,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: review.seo.twitterTitle || review.title,
      description: review.seo.twitterDescription || review.excerpt,
      images: review.featuredImage ? [review.featuredImage.url] : undefined,
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const review = getContentBySlug('review', params.slug) as Review;
  
  if (!review || !review.published) {
    notFound();
  }

  const siteConfig = getSiteConfig();
  const html = await markdownToHtml(review.content);
  
  // Get related reviews
  const allReviews = getAllContent('review') as Review[];
  const relatedReviews = allReviews
    .filter(r => r.published && r.id !== review.id && (
      r.category === review.category || 
      r.tags?.some(tag => review.tags?.includes(tag))
    ))
    .slice(0, 3);

  const hasRating = 'rating' in review && review.rating;

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
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 font-medium">
                ← Back to Reviews
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
            {review.category && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {review.category}
              </span>
            )}
            <time className="text-gray-500 text-sm">
              {format(review.publishedAt || review.createdAt, 'MMMM d, yyyy')}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {review.title}
          </h1>

          {/* Rating */}
          {hasRating && (
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= (review as any).rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  {(review as any).rating}/5
                </span>
                <span className="text-gray-600">
                  ({(review as any).rating === 5 ? 'Excellent' : 
                    (review as any).rating === 4 ? 'Very Good' : 
                    (review as any).rating === 3 ? 'Good' : 
                    (review as any).rating === 2 ? 'Fair' : 'Poor'})
                </span>
              </div>
            </div>
          )}

          {/* Excerpt */}
          {review.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {review.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
            <div className="flex items-center">
              {review.author && (
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.author.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{review.author.name}</p>
                    <p className="text-xs text-gray-500">
                      Reviewed {formatDistanceToNow(review.publishedAt || review.createdAt)} ago
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Review Summary */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Review Type:</p>
              <p className="text-sm font-medium text-blue-600 capitalize">{review.type}</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {review.featuredImage && (
          <div className="mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={review.featuredImage.url}
                alt={review.featuredImage.alt || review.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {review.featuredImage.caption && (
              <p className="text-sm text-gray-500 text-center mt-2 italic">
                {review.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Review Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
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

        {/* Rating Summary */}
        {hasRating && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Summary</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {(review as any).rating}
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= (review as any).rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {(review as any).rating >= 4 ? 'Recommended' : 
                     (review as any).rating >= 3 ? 'Consider' : 'Not Recommended'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on detailed review
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Share this review</h3>
              <div className="flex space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(siteConfig.siteUrl + '/reviews/' + review.slug)}&text=${encodeURIComponent(review.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteConfig.siteUrl + '/reviews/' + review.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <Link
              href="/reviews"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              More Reviews
            </Link>
          </div>
        </div>
      </article>

      {/* Related Reviews */}
      {relatedReviews.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedReviews.map((relatedReview) => (
                <article key={relatedReview.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {relatedReview.featuredImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={relatedReview.featuredImage.url}
                        alt={relatedReview.featuredImage.alt || relatedReview.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {'rating' in relatedReview && relatedReview.rating && (
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= (relatedReview as any).rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-900">
                            {(relatedReview as any).rating}/5
                          </span>
                        </div>
                      )}
                      <span className="text-gray-500 text-sm">
                        {formatDistanceToNow(relatedReview.publishedAt || relatedReview.createdAt)} ago
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/reviews/${relatedReview.slug}`} className="hover:text-blue-600 transition-colors">
                        {relatedReview.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedReview.excerpt}</p>
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
import { getAllContent } from '@/lib/content/parser';
import { Review } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';
import SearchBox from '@/components/SearchBox';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'Browse all our product reviews and ratings',
};

export default async function ReviewsPage() {
  const allReviews = getAllContent('review') as Review[];
  const publishedReviews = allReviews.filter(review => review.published);

  // Transform reviews for search
  const searchContent = publishedReviews.map(review => ({
    id: review.id,
    title: review.title,
    excerpt: review.excerpt || '',
    slug: review.slug,
    type: 'review' as const,
    category: review.category,
    tags: review.tags,
    publishedAt: new Date(review.publishedAt || review.createdAt),
    featuredImage: review.featuredImage ? {
      url: review.featuredImage.url,
      alt: review.featuredImage.alt || review.title,
    } : undefined,
    rating: 'rating' in review ? review.rating : undefined,
  }));

  // Calculate average rating
  const reviewsWithRating = publishedReviews.filter(review => 'rating' in review && review.rating);
  const averageRating = reviewsWithRating.length > 0 
    ? reviewsWithRating.reduce((sum, review) => sum + (review as any).rating, 0) / reviewsWithRating.length 
    : 0;

  // Group by rating
  const ratingGroups = {
    5: publishedReviews.filter(review => 'rating' in review && (review as any).rating === 5),
    4: publishedReviews.filter(review => 'rating' in review && (review as any).rating === 4),
    3: publishedReviews.filter(review => 'rating' in review && (review as any).rating === 3),
    2: publishedReviews.filter(review => 'rating' in review && (review as any).rating === 2),
    1: publishedReviews.filter(review => 'rating' in review && (review as any).rating === 1),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {siteConfig.siteName}
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
                ← Home
              </Link>
              <Link href="/posts" className="text-gray-600 hover:text-blue-600 font-medium">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Reviews
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Honest reviews and ratings of products and services
          </p>
          
          {/* Search Box */}
          <div className="max-w-md mx-auto mb-8">
            <SearchBox
              content={searchContent}
              placeholder="⭐ Search reviews..."
              className="w-full"
            />
          </div>
          
          {/* Rating Summary */}
          {reviewsWithRating.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">
                Based on {reviewsWithRating.length} review{reviewsWithRating.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Rating</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({rating})</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {ratingGroups[rating as keyof typeof ratingGroups].length}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-medium text-blue-600">{publishedReviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-medium text-green-600">
                      {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Reviews</h2>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="newest">Newest First</option>
                <option value="rating-high">Highest Rated</option>
                <option value="rating-low">Lowest Rated</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {publishedReviews.map((review) => (
                <article key={review.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="md:flex">
                    {review.featuredImage && (
                      <div className="md:w-1/3">
                        <div className="aspect-video md:aspect-square relative">
                          <Image
                            src={review.featuredImage.url}
                            alt={review.featuredImage.alt || review.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`p-6 ${review.featuredImage ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {'rating' in review && review.rating && (
                            <div className="flex items-center space-x-1">
                              <div className="flex">
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
                              <span className="text-sm font-medium text-gray-900">
                                {(review as any).rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {formatDistanceToNow(review.publishedAt || review.createdAt)} ago
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link href={`/reviews/${review.slug}`} className="hover:text-blue-600 transition-colors">
                          {review.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{review.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {review.author && (
                            <span>By {review.author.name}</span>
                          )}
                          {review.category && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {review.category}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/reviews/${review.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Read Review →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {publishedReviews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share your review!</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            © 2024 {siteConfig.siteName}. Built with Next.js and powered by LinuxID Headless CMS.
          </p>
        </div>
      </footer>
    </div>
  );
} 
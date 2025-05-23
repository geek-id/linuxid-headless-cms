import { getAllContent } from '@/lib/content/parser';
import { ContentType, BlogPost, Review, Page } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import HomePageSearch from '@/components/HomePageSearch';
import { siteConfig } from '@/lib/config/site';

export default async function HomePage() {
  // Get latest content
  const allPosts = getAllContent('post') as BlogPost[];
  const allPages = getAllContent('page') as Page[];
  const allReviews = getAllContent('review') as Review[];
  
  // Filter published content
  const publishedPosts = allPosts.filter(post => post.published);
  const featuredPosts = publishedPosts.filter(post => post.featured).slice(0, 3);
  const latestPosts = publishedPosts.slice(0, 6);
  const latestReviews = allReviews.filter(review => review.published).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                {siteConfig.siteName}
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/posts" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Blog
                </Link>
                <Link href="/reviews" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {siteConfig.siteName}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {siteConfig.description}
          </p>
          
          {/* Search Box */}
          <div className="mb-8">
            <HomePageSearch 
              posts={allPosts}
              reviews={allReviews}
              pages={allPages}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/posts"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Read Our Blog
            </Link>
            <Link
              href="/reviews"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Browse Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {post.featuredImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Featured
                      </span>
                      {post.category && (
                        <span className="ml-2 text-gray-500 text-sm">{post.category}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDistanceToNow(post.publishedAt || post.createdAt)} ago</span>
                      {post.readingTime && <span>{post.readingTime} min read</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <Link href="/posts" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Posts →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article key={post.id} className="group">
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {post.featuredImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {post.category && (
                        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      )}
                      <span className="ml-auto text-gray-500 text-sm">
                        {formatDistanceToNow(post.publishedAt || post.createdAt)} ago
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reviews */}
      {latestReviews.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Latest Reviews</h2>
              <Link href="/reviews" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Reviews →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{review.title}</h3>
                    {review.type === 'review' && 'rating' in review && review.rating && (
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{review.excerpt}</p>
                  <Link
                    href={`/reviews/${review.slug}`}
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Read Review →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">{publishedPosts.length}</div>
              <div className="text-gray-300">Blog Posts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">{allReviews.filter(r => r.published).length}</div>
              <div className="text-gray-300">Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">{allPages.filter(p => p.published).length}</div>
              <div className="text-gray-300">Pages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            © 2024 {siteConfig.siteName}. Built with Next.js.
          </p>
        </div>
      </footer>
    </div>
  );
}

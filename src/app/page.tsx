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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Navigation */}
      <nav className="glass-morphism border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {siteConfig.siteName}
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Home
              </Link>
              <Link href="/posts" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Blog
              </Link>
              <Link href="/reviews" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                Reviews
              </Link>
              <Link href="/posts" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        </div>
        
        <div className="container max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-gray-900 mb-2">Welcome to</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {siteConfig.siteName}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {siteConfig.description}
            </p>
            
            {/* Enhanced Search Box */}
            <div className="mb-12 animate-slide-up">
              <div className="max-w-2xl mx-auto">
                <HomePageSearch 
                  posts={allPosts}
                  reviews={allReviews}
                  pages={allPages}
                />
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
              <Link
                href="/posts"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
              >
                <span className="flex items-center justify-center">
                  Explore Our Content
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/reviews"
                className="group glass-morphism border border-white/20 text-gray-700 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 transform"
              >
                <span className="flex items-center justify-center">
                  Browse Reviews
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20 px-6 lg:px-8">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">FEATURED CONTENT</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">Trending Articles</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover our most popular and insightful content, handpicked for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article key={post.id} className={`group card-hover glass-morphism rounded-3xl overflow-hidden border border-white/20 ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                  {post.featuredImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        FEATURED
                      </span>
                      {post.category && (
                        <span className="text-gray-500 text-sm font-medium">{post.category}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium">{formatDistanceToNow(post.publishedAt || post.createdAt)} ago</span>
                      {post.readingTime && <span className="bg-gray-100 px-3 py-1 rounded-full">{post.readingTime} min read</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg">LATEST INSIGHTS</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Recent Posts</h2>
            </div>
            <Link href="/posts" className="group text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              View All Posts
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article key={post.id} className="group">
                <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  {post.featuredImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {post.category && (
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      )}
                      <span className="text-gray-400 text-sm">
                        {formatDistanceToNow(post.publishedAt || post.createdAt)} ago
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{tag}
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
        <section className="py-20 px-6 lg:px-8">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent font-semibold text-lg">EXPERT REVIEWS</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">Latest Reviews</h2>
              </div>
              <Link href="/reviews" className="group text-green-600 hover:text-green-700 font-semibold flex items-center">
                View All Reviews
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestReviews.map((review) => (
                <div key={review.id} className="card-hover bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">{review.title}</h3>
                    {review.type === 'review' && 'rating' in review && review.rating && (
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="ml-1 text-sm font-bold text-gray-700">{review.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-4 mb-6">{review.excerpt}</p>
                  <Link
                    href={`/reviews/${review.slug}`}
                    className="group inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
                  >
                    Read Full Review
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/static/img/pattern.svg')] opacity-10"></div>
        <div className="container max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Growing Community</h2>
            <p className="text-xl text-gray-300">Join thousands of readers who trust our content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center glass-morphism border border-white/10 rounded-2xl p-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                {publishedPosts.length}
              </div>
              <div className="text-gray-300 font-semibold">Published Articles</div>
            </div>
            <div className="text-center glass-morphism border border-white/10 rounded-2xl p-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                {allReviews.filter(r => r.published).length}
              </div>
              <div className="text-gray-300 font-semibold">Expert Reviews</div>
            </div>
            <div className="text-center glass-morphism border border-white/10 rounded-2xl p-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                {allPages.filter(p => p.published).length}
              </div>
              <div className="text-gray-300 font-semibold">Resource Pages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6 lg:px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{siteConfig.siteName}</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                {siteConfig.description}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                  <span className="text-sm font-bold">tw</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <span className="text-sm font-bold">fb</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                  <span className="text-sm font-bold">ig</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/posts" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                <li><Link href="/reviews" className="hover:text-blue-600 transition-colors">Reviews</Link></li>
                <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">News</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-500">
              © 2024 {siteConfig.siteName}. Built with Next.js and ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

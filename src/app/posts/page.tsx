import { getAllContent } from '@/lib/content/parser';
import { getSiteConfig } from '@/lib/config/file-storage';
import { BlogPost } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Browse all our blog posts and articles',
};

export default async function PostsPage() {
  const siteConfig = getSiteConfig();
  const allPosts = getAllContent('post') as BlogPost[];
  const publishedPosts = allPosts.filter(post => post.published);
  
  // Get categories and tags for filtering
  const categories = [...new Set(publishedPosts.map(post => post.category).filter(Boolean))];
  const allTags = publishedPosts.flatMap(post => post.tags || []);
  const popularTags = [...new Set(allTags)]
    .map(tag => ({ tag, count: allTags.filter(t => t === tag).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Featured posts
  const featuredPosts = publishedPosts.filter(post => post.featured);
  const regularPosts = publishedPosts.filter(post => !post.featured);

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
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover insights, tutorials, and stories from our team
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-sm p-2 max-w-md w-full">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-2 border-0 focus:ring-0 focus:outline-none"
                id="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-medium text-blue-600">{publishedPosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured</span>
                  <span className="font-medium text-green-600">{featuredPosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-medium text-purple-600">{categories.length}</span>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const count = publishedPosts.filter(post => post.category === category).length;
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                            {category}
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(({ tag, count }) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        {tag} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <article key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{formatDistanceToNow(post.publishedAt || post.createdAt)} ago</span>
                          {post.readingTime && <span>{post.readingTime} min read</span>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* All Posts */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {regularPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="md:flex">
                      {post.featuredImage && (
                        <div className="md:w-1/3">
                          <div className="aspect-video md:aspect-square relative">
                            <Image
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt || post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div className={`p-6 ${post.featuredImage ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex items-center mb-3">
                          {post.category && (
                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {post.category}
                            </span>
                          )}
                          <span className="ml-auto text-gray-500 text-sm">
                            {formatDistanceToNow(post.publishedAt || post.createdAt)} ago
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags && post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {post.readingTime && (
                            <span className="text-gray-500 text-sm">{post.readingTime} min read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              {publishedPosts.length > 10 && (
                <div className="text-center mt-12">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Load More Posts
                  </button>
                </div>
              )}
            </section>
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
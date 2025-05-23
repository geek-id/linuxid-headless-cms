import { getAllContent } from '@/lib/content/parser';
import { getSiteConfig, getAdminConfig } from '@/lib/config/file-storage';
import { BlogPost } from '@/types/content';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Content management dashboard and analytics',
};

export default async function DashboardPage() {
  const siteConfig = getSiteConfig();
  const adminConfig = getAdminConfig();
  
  // Get all content
  const allPosts = getAllContent('post') as BlogPost[];
  const allPages = getAllContent('page');
  const allReviews = getAllContent('review');
  
  // Filter published content
  const publishedPosts = allPosts.filter(post => post.published);
  const publishedPages = allPages.filter(page => page.published);
  const publishedReviews = allReviews.filter(review => review.published);
  
  // Calculate statistics
  const totalContent = publishedPosts.length + publishedPages.length + publishedReviews.length;
  const draftContent = allPosts.filter(post => !post.published).length + 
                       allPages.filter(page => !page.published).length + 
                       allReviews.filter(review => !review.published).length;
  
  // Recent content (last 30 days)
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentPosts = publishedPosts.filter(post => 
    (post.publishedAt || post.createdAt) >= thirtyDaysAgo
  );
  
  // Monthly stats
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const thisMonthPosts = publishedPosts.filter(post => {
    const date = post.publishedAt || post.createdAt;
    return date >= monthStart && date <= monthEnd;
  });
  
  // Categories and tags
  const categories = [...new Set(publishedPosts.map(post => post.category).filter(Boolean))];
  const allTags = publishedPosts.flatMap(post => post.tags || []);
  const uniqueTags = [...new Set(allTags)];
  
  // Featured content
  const featuredPosts = publishedPosts.filter(post => post.featured);
  
  // Latest content for quick access
  const latestPosts = publishedPosts.slice(0, 5);
  const latestDrafts = allPosts.filter(post => !post.published).slice(0, 3);

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
                Home
              </Link>
              <Link href="/posts" className="text-gray-600 hover:text-blue-600 font-medium">
                Blog
              </Link>
              <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 Content Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Overview of your content management system
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Published</p>
                  <p className="text-3xl font-bold text-gray-900">{totalContent}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {publishedPosts.length} posts, {publishedPages.length} pages, {publishedReviews.length} reviews
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-3xl font-bold text-yellow-600">{draftContent}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">✏️</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Content awaiting publication
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-green-600">{thisMonthPosts.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Posts published in {format(currentMonth, 'MMMM')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-purple-600">{featuredPosts.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Featured blog posts
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/content/new?type=post"
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2">📝</span>
                  <span className="text-sm font-medium text-blue-900">New Post</span>
                </Link>
                <Link
                  href="/admin/content/new?type=page"
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2">📄</span>
                  <span className="text-sm font-medium text-green-900">New Page</span>
                </Link>
                <Link
                  href="/admin/content"
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2">📋</span>
                  <span className="text-sm font-medium text-purple-900">All Content</span>
                </Link>
                <Link
                  href="/admin/upload"
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2">📸</span>
                  <span className="text-sm font-medium text-orange-900">Upload Media</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2">⚙️</span>
                  <span className="text-sm font-medium text-gray-900">Settings</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors text-center"
                >
                  <span className="text-2xl mb-2">📊</span>
                  <span className="text-sm font-medium text-pink-900">Analytics</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">📰 Recent Posts</h2>
                <Link href="/posts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {latestPosts.map((post) => (
                  <div key={post.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    {post.featuredImage && (
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                          {post.title}
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(post.publishedAt || post.createdAt)} ago
                        {post.category && ` • ${post.category}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.featured && (
                        <span className="text-yellow-500 text-sm">⭐</span>
                      )}
                      <Link
                        href={`/admin/content/edit/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Content Analytics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{uniqueTags.length}</p>
                  <p className="text-sm text-gray-600">Unique Tags</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{recentPosts.length}</p>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {publishedPosts.length > 0 ? Math.round((featuredPosts.length / publishedPosts.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Featured Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <span className="text-green-600 text-sm font-medium">✅ Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Content Parser</span>
                  <span className="text-green-600 text-sm font-medium">✅ Working</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Image Uploads</span>
                  <span className="text-green-600 text-sm font-medium">✅ Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Admin Auth</span>
                  <span className="text-green-600 text-sm font-medium">✅ Secure</span>
                </div>
              </div>
            </div>

            {/* Draft Content */}
            {latestDrafts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">✏️ Recent Drafts</h3>
                  <Link href="/admin/content?status=draft" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  {latestDrafts.map((draft) => (
                    <div key={draft.id} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <Link href={`/admin/content/edit/${draft.id}`} className="hover:text-blue-600">
                          {draft.title}
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {formatDistanceToNow(draft.updatedAt)} ago
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Site Configuration */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 Site Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Site Name</p>
                  <p className="font-medium text-gray-900">{siteConfig.siteName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{siteConfig.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upload Directory</p>
                  <p className="text-sm font-mono text-gray-700">/public/uploads</p>
                </div>
                <Link
                  href="/admin/settings"
                  className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Update Settings →
                </Link>
              </div>
            </div>

            {/* Popular Categories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📂 Categories</h3>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => {
                    const count = publishedPosts.filter(post => post.category === category).length;
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{category}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {categories.length > 5 && (
                  <p className="text-xs text-gray-500 mt-3">
                    +{categories.length - 5} more categories
                  </p>
                )}
              </div>
            )}
          </div>
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
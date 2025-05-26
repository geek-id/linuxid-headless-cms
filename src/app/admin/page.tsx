'use client';

import { useState, useEffect } from 'react';
import './admin.css';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Eye, 
  EyeOff, 
  Play, 
  Search,
  Filter,
  MoreVertical,
  Plus,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  ExternalLink,
  Edit3,
  Trash2,
  Archive,
  Home,
  Users,
  Activity
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'scheduled' | 'published';
  publishedAt?: Date;
  scheduledAt?: Date;
  excerpt?: string;
  author?: string;
  views?: number;
  category?: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    // Enhanced mock data with more realistic content
    const mockPosts: ScheduledPost[] = [
      {
        id: '1',
        title: 'Complete tmux Commands & Cheatsheet Guide',
        slug: 'tmux-commands-cheatsheet',
        status: 'published',
        publishedAt: new Date('2022-04-22'),
        excerpt: 'Master tmux with this comprehensive guide covering essential commands, keyboard shortcuts, and advanced features.',
        author: 'Linux-ID Team',
        views: 15420,
        category: 'Tools'
      },
      {
        id: '2',
        title: 'Advanced Docker Networking Strategies',
        slug: 'advanced-docker-networking-strategies',
        status: 'scheduled',
        publishedAt: new Date('2024-12-25'),
        scheduledAt: new Date('2024-12-25'),
        excerpt: 'Explore advanced Docker networking concepts including custom networks, service discovery, and multi-host networking.',
        author: 'Linux-ID Team',
        views: 0,
        category: 'DevOps'
      },
      {
        id: '3',
        title: 'Kubernetes Security Best Practices',
        slug: 'kubernetes-security-best-practices',
        status: 'draft',
        excerpt: 'Comprehensive guide to securing Kubernetes clusters in production environments.',
        author: 'Linux-ID Team',
        views: 0,
        category: 'Security'
      },
      {
        id: '4',
        title: 'PostgreSQL Performance Optimization',
        slug: 'postgresql-performance-optimization',
        status: 'published',
        publishedAt: new Date('2023-03-15'),
        excerpt: 'Advanced PostgreSQL tuning techniques for query optimization and indexing strategies.',
        author: 'Database Team',
        views: 8930,
        category: 'Database'
      },
      {
        id: '5',
        title: 'CI/CD Pipeline with GitHub Actions',
        slug: 'cicd-pipeline-github-actions',
        status: 'scheduled',
        publishedAt: new Date('2024-01-15'),
        scheduledAt: new Date('2024-01-15'),
        excerpt: 'Build robust CI/CD pipelines using GitHub Actions for automated testing and deployment.',
        author: 'DevOps Team',
        views: 0,
        category: 'DevOps'
      }
    ];

    // Simulate loading with realistic delay
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) : [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published': return 'admin-status-published';
      case 'scheduled': return 'admin-status-scheduled';
      case 'draft': return 'admin-status-draft';
      default: return 'admin-status-draft';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatViews = (views: number = 0) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const totalViews = Array.isArray(posts) ? posts.reduce((sum, p) => sum + (p.views || 0), 0) : 0;
  const publishedCount = Array.isArray(posts) ? posts.filter(p => p.status === 'published').length : 0;
  const scheduledCount = Array.isArray(posts) ? posts.filter(p => p.status === 'scheduled').length : 0;
  const draftCount = Array.isArray(posts) ? posts.filter(p => p.status === 'draft').length : 0;

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-content">
          <div className="admin-loading-spinner"></div>
          <h2>Loading Admin Dashboard...</h2>
          <p>Preparing your content management interface</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body">
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <h1>Content Hub</h1>
          </div>
          <ul className="admin-nav-menu">
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'dashboard' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('dashboard'); }}
              >
                <Home className="admin-nav-icon" />
                Dashboard
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'posts' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('posts'); }}
              >
                <FileText className="admin-nav-icon" />
                Posts
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'analytics' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('analytics'); }}
              >
                <BarChart3 className="admin-nav-icon" />
                Analytics
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'users' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('users'); }}
              >
                <Users className="admin-nav-icon" />
                Users
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'settings' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('settings'); }}
              >
                <Settings className="admin-nav-icon" />
                Settings
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="admin-main-content">
          {/* Header */}
          <header className="admin-header">
            <h2>Welcome back, Admin</h2>
            <div className="admin-user-info">
              <div className="admin-user-avatar">A</div>
              <span className="admin-user-name">Admin User</span>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">Total Posts</span>
                <div className="admin-stat-icon">
                  <FileText size={20} />
                </div>
              </div>
              <div className="admin-stat-value">{Array.isArray(posts) ? posts.length : 0}</div>
              <div className="admin-stat-change">↗ +2 this week</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">Published</span>
                <div className="admin-stat-icon">
                  <Eye size={20} />
                </div>
              </div>
              <div className="admin-stat-value">{publishedCount}</div>
              <div className="admin-stat-change">↗ Live content</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">Scheduled</span>
                <div className="admin-stat-icon">
                  <Clock size={20} />
                </div>
              </div>
              <div className="admin-stat-value">{scheduledCount}</div>
              <div className="admin-stat-change">↗ Coming soon</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">Total Views</span>
                <div className="admin-stat-icon">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="admin-stat-value">{formatViews(totalViews)}</div>
              <div className="admin-stat-change">↗ +12% this month</div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="admin-dashboard-grid">
            <div className="admin-chart-container">
              <h3 className="admin-section-title">Analytics Overview</h3>
              <div className="admin-chart-placeholder">
                Interactive Chart Placeholder
                <br />
                <small style={{ opacity: 0.6 }}>Content performance and engagement metrics</small>
              </div>
            </div>

            <div className="admin-activity-feed">
              <h3 className="admin-section-title">Recent Activity</h3>
              <div className="admin-activity-item">
                <div className="admin-activity-dot green"></div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">New post published</div>
                  <div className="admin-activity-time">2 minutes ago</div>
                </div>
              </div>
              <div className="admin-activity-item">
                <div className="admin-activity-dot blue"></div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">Post scheduled</div>
                  <div className="admin-activity-time">15 minutes ago</div>
                </div>
              </div>
              <div className="admin-activity-item">
                <div className="admin-activity-dot orange"></div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">Content updated</div>
                  <div className="admin-activity-time">1 hour ago</div>
                </div>
              </div>
              <div className="admin-activity-item">
                <div className="admin-activity-dot red"></div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">Draft saved</div>
                  <div className="admin-activity-time">3 hours ago</div>
                </div>
              </div>
              <div className="admin-activity-item">
                <div className="admin-activity-dot green"></div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">SEO optimized</div>
                  <div className="admin-activity-time">6 hours ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="admin-search-filters">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
              <button className="admin-action-btn">
                <Plus size={16} style={{ marginRight: '0.5rem' }} />
                New Post
              </button>
            </div>
            
            <div className="admin-filter-buttons">
              {['all', 'published', 'scheduled', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`admin-filter-button ${filter === status ? 'active' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                    ({status === 'all' ? (Array.isArray(posts) ? posts.length : 0) : (Array.isArray(posts) ? posts.filter(p => p.status === status).length : 0)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Posts Table */}
          <div className="admin-posts-table">
            <h3 className="admin-section-title">Content Management</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div>
                        <div className="admin-post-title">{post.title}</div>
                        <div className="admin-post-excerpt">{post.excerpt}</div>
                        {post.category && (
                          <span style={{ 
                            display: 'inline-block', 
                            marginTop: '0.5rem', 
                            padding: '0.25rem 0.75rem', 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            {post.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${getStatusClass(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{formatDate(post.scheduledAt || post.publishedAt)}</div>
                        {post.status === 'scheduled' && (
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                            Scheduled
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart3 size={16} style={{ opacity: 0.6 }} />
                        <span style={{ fontWeight: 500 }}>{formatViews(post.views)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {post.author?.charAt(0)}
                        </div>
                        <span>{post.author}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-action-buttons">
                        {post.status === 'scheduled' && (
                          <button
                            className="admin-action-button primary"
                            onClick={() => alert('Publish now functionality would be implemented here')}
                          >
                            Publish
                          </button>
                        )}
                        {post.status === 'draft' && (
                          <button
                            className="admin-action-button primary"
                            onClick={() => alert('Schedule functionality would be implemented here')}
                          >
                            Schedule
                          </button>
                        )}
                        <button className="admin-action-button">
                          <Edit3 size={14} />
                        </button>
                        <button className="admin-action-button">
                          <ExternalLink size={14} />
                        </button>
                        <button className="admin-action-button">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <FileText size={24} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                No posts found
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                {filter === 'all' 
                  ? searchTerm 
                    ? `No posts match "${searchTerm}"`
                    : 'No posts available.' 
                  : `No ${filter} posts found.`
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="admin-action-btn"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="admin-quick-actions">
            <button className="admin-action-btn">Generate Report</button>
            <button className="admin-action-btn secondary">Export Data</button>
            <button className="admin-action-btn secondary">Manage Content</button>
          </div>

          {/* Demo Notice */}
          <div style={{
            marginTop: '2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={20} style={{ color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  Modern Admin Dashboard
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  This is a demonstration of the modern admin dashboard with glassmorphism design. 
                  In a full implementation, this would connect to your content management system with real-time data and full CRUD operations.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', fontSize: '0.9rem' }}>
                  <div>
                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem' }}>Current Features:</h4>
                    <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, listStyle: 'none', padding: 0 }}>
                      <li>• Modern glassmorphism design</li>
                      <li>• Real-time search and filtering</li>
                      <li>• Interactive dashboard</li>
                      <li>• Responsive layout</li>
                      <li>• Performance metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem' }}>Ready for Implementation:</h4>
                    <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, listStyle: 'none', padding: 0 }}>
                      <li>• Content management system integration</li>
                      <li>• Authentication & authorization</li>
                      <li>• Real scheduling functionality</li>
                      <li>• File upload and media management</li>
                      <li>• Analytics and reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
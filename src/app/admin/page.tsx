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
  Activity,
  Star,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Tag,
  Globe,
  BookOpen,
  MessageSquare,
  Layers
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'post' | 'review' | 'page';
  status: 'draft' | 'scheduled' | 'published';
  publishedAt?: string;
  scheduledAt?: string;
  excerpt?: string;
  author?: string;
  views?: number;
  category?: string;
  tags?: string[];
  rating?: number; // For reviews
  template?: string; // For pages
  featured?: boolean;
  content?: string;
}

interface ContentFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  status: 'draft' | 'scheduled' | 'published';
  featured: boolean;
  publishedAt: string;
  rating?: number; // For reviews
  template?: string; // For pages
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'reviews' | 'pages'>('dashboard');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingItem, setSchedulingItem] = useState<ContentItem | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    featured: false,
    publishedAt: new Date().toISOString().slice(0, 16),
    rating: 5,
    template: 'default'
  });

  // Auto-publish scheduled posts
  useEffect(() => {
    const checkScheduledPosts = () => {
      const now = new Date();
      setContentItems(items => 
        items.map(item => {
          if (item.status === 'scheduled' && item.scheduledAt) {
            const scheduledDate = new Date(item.scheduledAt);
            if (scheduledDate <= now) {
              return {
                ...item,
                status: 'published' as const,
                publishedAt: now.toISOString(),
                scheduledAt: undefined
              };
            }
          }
          return item;
        })
      );
    };

    // Check every minute for scheduled posts
    const interval = setInterval(checkScheduledPosts, 60000);
    
    // Check immediately on load
    checkScheduledPosts();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load real content from API
    const loadRealContent = async () => {
      try {
        const response = await fetch('/api/admin/content');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        
        const data = await response.json();
        
        // Convert API response to ContentItem format
        const convertedContent: ContentItem[] = [
          // Convert posts
          ...data.posts.map((post: any) => ({
            ...post,
            publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
            scheduledAt: undefined
          })),
          // Convert reviews
          ...data.reviews.map((review: any) => ({
            ...review,
            publishedAt: review.publishedAt ? new Date(review.publishedAt) : undefined,
            scheduledAt: undefined
          })),
          // Convert pages
          ...data.pages.map((page: any) => ({
            ...page,
            publishedAt: page.publishedAt ? new Date(page.publishedAt) : undefined,
            scheduledAt: undefined
          }))
        ];

        setContentItems(convertedContent);
        setLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to empty array if there's an error
        setContentItems([]);
        setLoading(false);
      }
    };

    loadRealContent();
  }, []);

  const getCurrentContent = () => {
    let filtered = contentItems;
    
    // Filter by type based on active tab
    if (activeTab !== 'dashboard') {
      filtered = filtered.filter(item => item.type === activeTab.slice(0, -1)); // Remove 's' from 'posts', 'reviews', 'pages'
    }
    
    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.status === filter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const getContentStats = () => {
    const posts = contentItems.filter(item => item.type === 'post');
    const reviews = contentItems.filter(item => item.type === 'review');
    const pages = contentItems.filter(item => item.type === 'page');
    
    return {
      total: contentItems.length,
      posts: posts.length,
      reviews: reviews.length,
      pages: pages.length,
      published: contentItems.filter(item => item.status === 'published').length,
      scheduled: contentItems.filter(item => item.status === 'scheduled').length,
      drafts: contentItems.filter(item => item.status === 'draft').length,
      totalViews: contentItems.reduce((sum, item) => sum + (item.views || 0), 0)
    };
  };

  const handleCreateNew = () => {
    const type = activeTab === 'dashboard' ? 'post' : activeTab.slice(0, -1);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft',
      featured: false,
      publishedAt: new Date().toISOString().slice(0, 16),
      rating: type === 'review' ? 5 : undefined,
      template: type === 'page' ? 'default' : undefined
    });
    setEditingItem(null);
    setShowCreateModal(true);
  };

  const handleEdit = (item: ContentItem) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || '',
      tags: item.tags?.join(', ') || '',
      status: item.status,
      featured: item.featured || false,
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      rating: item.rating,
      template: item.template
    });
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSchedule = (item: ContentItem) => {
    setSchedulingItem(item);
    // Default to 1 hour from now
    const defaultScheduleTime = new Date(Date.now() + 60 * 60 * 1000);
    setScheduleDate(defaultScheduleTime.toISOString().slice(0, 16));
    setShowScheduleModal(true);
  };

  const handleQuickSchedule = (item: ContentItem, hours: number) => {
    const scheduledTime = new Date(Date.now() + hours * 60 * 60 * 1000);
    const updatedItem = { 
      ...item, 
      status: 'scheduled' as const, 
      scheduledAt: scheduledTime.toISOString() 
    };
    setContentItems(items => items.map(i => i.id === item.id ? updatedItem : i));
  };

  const confirmSchedule = () => {
    if (schedulingItem && scheduleDate) {
      const updatedItem = { 
        ...schedulingItem, 
        status: 'scheduled' as const, 
        scheduledAt: new Date(scheduleDate).toISOString() 
      };
      setContentItems(items => items.map(i => i.id === schedulingItem.id ? updatedItem : i));
      setShowScheduleModal(false);
      setSchedulingItem(null);
    }
  };

  const handleSave = () => {
    const newItem: ContentItem = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      type: editingItem?.type || (activeTab === 'dashboard' ? 'post' : activeTab.slice(0, -1)) as 'post' | 'review' | 'page',
      status: formData.status,
      publishedAt: formData.status === 'published' ? formData.publishedAt : undefined,
      scheduledAt: formData.status === 'scheduled' ? formData.publishedAt : undefined,
      excerpt: formData.excerpt,
      author: 'Admin User',
      views: editingItem?.views || 0,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      rating: formData.rating,
      template: formData.template,
      featured: formData.featured,
      content: formData.content
    };

    if (editingItem) {
      setContentItems(items => items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setContentItems(items => [...items, newItem]);
    }

    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setContentItems(items => items.filter(item => item.id !== id));
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published': return 'admin-status-published';
      case 'scheduled': return 'admin-status-scheduled';
      case 'draft': return 'admin-status-draft';
      default: return 'admin-status-draft';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText size={16} />;
      case 'review': return <Star size={16} />;
      case 'page': return <Globe size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const formatDate = (date: string | Date | undefined) => {
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

  const getTimeUntilScheduled = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diffMs = scheduled.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Publishing now...';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes}m`;
    } else {
      return `in ${diffMinutes}m`;
    }
  };

  const stats = getContentStats();
  const currentContent = getCurrentContent();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-content">
          <div className="admin-loading-spinner"></div>
          <h2>Loading Admin Dashboard...</h2>
          <p>Loading content from markdown files...</p>
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
                onClick={(e) => { e.preventDefault(); setActiveNav('dashboard'); setActiveTab('dashboard'); }}
              >
                <Home className="admin-nav-icon" />
                Dashboard
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'posts' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('posts'); setActiveTab('posts'); }}
              >
                <FileText className="admin-nav-icon" />
                Posts
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                  {stats.posts}
                </span>
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'reviews' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('reviews'); setActiveTab('reviews'); }}
              >
                <Star className="admin-nav-icon" />
                Reviews
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                  {stats.reviews}
                </span>
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeNav === 'pages' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveNav('pages'); setActiveTab('pages'); }}
              >
                <Globe className="admin-nav-icon" />
                Pages
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                  {stats.pages}
                </span>
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
            <h2>
              {activeTab === 'dashboard' ? 'Welcome back, Admin' : 
               activeTab === 'posts' ? 'Manage Posts' :
               activeTab === 'reviews' ? 'Manage Reviews' :
               activeTab === 'pages' ? 'Manage Pages' : 'Content Management'}
            </h2>
            <div className="admin-user-info">
              <div className="admin-user-avatar">A</div>
              <span className="admin-user-name">Admin User</span>
            </div>
          </header>

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card" onClick={() => setActiveTab('posts')}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Blog Posts</span>
                    <div className="admin-stat-icon">
                      <FileText size={20} />
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.posts}</div>
                  <div className="admin-stat-change">↗ Click to manage</div>
                </div>

                <div className="admin-stat-card" onClick={() => setActiveTab('reviews')}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Reviews</span>
                    <div className="admin-stat-icon">
                      <Star size={20} />
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.reviews}</div>
                  <div className="admin-stat-change">↗ Click to manage</div>
                </div>

                <div className="admin-stat-card" onClick={() => setActiveTab('pages')}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Pages</span>
                    <div className="admin-stat-icon">
                      <Globe size={20} />
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.pages}</div>
                  <div className="admin-stat-change">↗ Click to manage</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Scheduled</span>
                    <div className="admin-stat-icon">
                      <Clock size={20} />
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.scheduled}</div>
                  <div className="admin-stat-change">↗ Auto-publishing</div>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="admin-dashboard-grid">
                <div className="admin-chart-container">
                  <h3 className="admin-section-title">Content Analytics</h3>
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
                      <div className="admin-activity-text">Content loaded from API</div>
                      <div className="admin-activity-time">Just now</div>
                    </div>
                  </div>
                  <div className="admin-activity-item">
                    <div className="admin-activity-dot blue"></div>
                    <div className="admin-activity-content">
                      <div className="admin-activity-text">Found {stats.posts} posts</div>
                      <div className="admin-activity-time">Just now</div>
                    </div>
                  </div>
                  <div className="admin-activity-item">
                    <div className="admin-activity-dot orange"></div>
                    <div className="admin-activity-content">
                      <div className="admin-activity-text">Found {stats.reviews} reviews</div>
                      <div className="admin-activity-time">Just now</div>
                    </div>
                  </div>
                  <div className="admin-activity-item">
                    <div className="admin-activity-dot purple"></div>
                    <div className="admin-activity-content">
                      <div className="admin-activity-text">Scheduler active ({stats.scheduled} scheduled)</div>
                      <div className="admin-activity-time">Running</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Content Management Interface */}
          {activeTab !== 'dashboard' && (
            <>
              {/* Search and Filters */}
              <div className="admin-search-filters">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                  />
                  <button className="admin-action-btn" onClick={handleCreateNew}>
                    <Plus size={16} style={{ marginRight: '0.5rem' }} />
                    New {activeTab.slice(0, -1)}
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
                        ({status === 'all' ? currentContent.length : currentContent.filter(item => item.status === status).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Table */}
              <div className="admin-posts-table">
                <h3 className="admin-section-title">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Content</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Views</th>
                      <th>Author</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContent.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div>
                            <div className="admin-post-title">{item.title}</div>
                            <div className="admin-post-excerpt">{item.excerpt}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                              {item.category && (
                                <span style={{ 
                                  display: 'inline-block', 
                                  padding: '0.25rem 0.75rem', 
                                  background: 'rgba(255, 255, 255, 0.1)', 
                                  borderRadius: '12px', 
                                  fontSize: '0.75rem',
                                  color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                  {item.category}
                                </span>
                              )}
                              {item.featured && (
                                <span style={{ 
                                  display: 'inline-block', 
                                  padding: '0.25rem 0.75rem', 
                                  background: 'rgba(255, 215, 0, 0.2)', 
                                  borderRadius: '12px', 
                                  fontSize: '0.75rem',
                                  color: '#ffd700'
                                }}>
                                  ⭐ Featured
                                </span>
                              )}
                              {item.rating && (
                                <span style={{ 
                                  display: 'inline-block', 
                                  padding: '0.25rem 0.75rem', 
                                  background: 'rgba(255, 165, 0, 0.2)', 
                                  borderRadius: '12px', 
                                  fontSize: '0.75rem',
                                  color: '#ffa500'
                                }}>
                                  ★ {item.rating}/5
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getTypeIcon(item.type)}
                            <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-status-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 500 }}>{formatDate(item.scheduledAt || item.publishedAt)}</div>
                            {item.status === 'scheduled' && item.scheduledAt && (
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                                {getTimeUntilScheduled(item.scheduledAt)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BarChart3 size={16} style={{ opacity: 0.6 }} />
                            <span style={{ fontWeight: 500 }}>{formatViews(item.views)}</span>
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
                              {item.author?.charAt(0)}
                            </div>
                            <span>{item.author}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-action-buttons">
                            {item.status === 'scheduled' && (
                              <button
                                className="admin-action-button primary"
                                onClick={() => {
                                  const updatedItem = { ...item, status: 'published' as const, publishedAt: new Date().toISOString(), scheduledAt: undefined };
                                  setContentItems(items => items.map(i => i.id === item.id ? updatedItem : i));
                                }}
                              >
                                Publish Now
                              </button>
                            )}
                            {item.status === 'draft' && (
                              <>
                                <button
                                  className="admin-action-button primary"
                                  onClick={() => handleSchedule(item)}
                                >
                                  <Clock size={14} style={{ marginRight: '0.25rem' }} />
                                  Schedule
                                </button>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <button
                                    className="admin-action-button secondary"
                                    onClick={() => handleQuickSchedule(item, 1)}
                                    title="Schedule for 1 hour from now"
                                  >
                                    1h
                                  </button>
                                </div>
                              </>
                            )}
                            <button className="admin-action-button" onClick={() => handleEdit(item)}>
                              <Edit3 size={14} />
                            </button>
                            <button className="admin-action-button">
                              <ExternalLink size={14} />
                            </button>
                            <button className="admin-action-button danger" onClick={() => handleDelete(item.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {currentContent.length === 0 && (
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
                    {getTypeIcon(activeTab.slice(0, -1))}
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    No {activeTab} found
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                    {searchTerm 
                      ? `No ${activeTab} match "${searchTerm}"`
                      : `No ${activeTab} available. Create your first ${activeTab.slice(0, -1)}!`
                    }
                  </p>
                  <button onClick={handleCreateNew} className="admin-action-btn">
                    <Plus size={16} style={{ marginRight: '0.5rem' }} />
                    Create {activeTab.slice(0, -1)}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Quick Actions */}
          <div className="admin-quick-actions">
            <button className="admin-action-btn">Generate Report</button>
            <button className="admin-action-btn secondary">Export Data</button>
            <button className="admin-action-btn secondary">Backup Content</button>
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
                <Clock size={20} style={{ color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  Enhanced Scheduler System
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  The admin interface now includes an advanced scheduling system with automatic publishing! 
                  Schedule posts for specific times, use quick scheduling options, and watch as content automatically publishes when scheduled.
                  The system checks every minute for scheduled content and publishes it automatically.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', fontSize: '0.9rem' }}>
                  <div>
                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem' }}>Scheduler Features:</h4>
                    <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, listStyle: 'none', padding: 0 }}>
                      <li>• Custom date/time scheduling</li>
                      <li>• Quick schedule buttons (1h, 24h)</li>
                      <li>• Automatic publishing system</li>
                      <li>• Real-time countdown display</li>
                      <li>• Manual publish override</li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.75rem' }}>Current Status:</h4>
                    <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, listStyle: 'none', padding: 0 }}>
                      <li>• {stats.scheduled} posts scheduled</li>
                      <li>• {stats.published} posts published</li>
                      <li>• {stats.drafts} drafts available</li>
                      <li>• Auto-check every 60 seconds</li>
                      <li>• Real-time status updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && schedulingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Schedule "{schedulingItem.title}"
              </h2>
              <button 
                onClick={() => { setShowScheduleModal(false); setSchedulingItem(null); }}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Schedule for:
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="admin-search-input"
                style={{ width: '100%', maxWidth: 'none' }}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
                Content will automatically publish at the scheduled time
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                onClick={() => {
                  const oneHour = new Date(Date.now() + 60 * 60 * 1000);
                  setScheduleDate(oneHour.toISOString().slice(0, 16));
                }}
                className="admin-action-btn secondary"
              >
                <Clock size={16} style={{ marginRight: '0.5rem' }} />
                In 1 Hour
              </button>
              <button 
                onClick={() => {
                  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
                  setScheduleDate(tomorrow.toISOString().slice(0, 16));
                }}
                className="admin-action-btn secondary"
              >
                <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                Tomorrow
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => { setShowScheduleModal(false); setSchedulingItem(null); }}
                className="admin-action-btn secondary"
              >
                Cancel
              </button>
              <button onClick={confirmSchedule} className="admin-action-btn">
                <Clock size={16} style={{ marginRight: '0.5rem' }} />
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {editingItem ? 'Edit' : 'Create'} {editingItem?.type || activeTab.slice(0, -1)}
              </h2>
              <button 
                onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%', maxWidth: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%', maxWidth: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="admin-search-input"
                  style={{ width: '100%', maxWidth: 'none', minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%', maxWidth: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%', maxWidth: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="admin-search-input"
                    style={{ width: '100%', maxWidth: 'none' }}
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {formData.status === 'scheduled' ? 'Schedule Date' : 'Publish Date'}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="admin-search-input"
                    style={{ width: '100%', maxWidth: 'none' }}
                    min={formData.status === 'scheduled' ? new Date().toISOString().slice(0, 16) : undefined}
                  />
                </div>
                {(editingItem?.type === 'review' || (!editingItem && activeTab === 'reviews')) && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="admin-search-input"
                      style={{ width: '100%', maxWidth: 'none' }}
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>
                )}
                {(editingItem?.type === 'page' || (!editingItem && activeTab === 'pages')) && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Template</label>
                    <select
                      value={formData.template}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                      className="admin-search-input"
                      style={{ width: '100%', maxWidth: 'none' }}
                    >
                      <option value="default">Default</option>
                      <option value="contact">Contact</option>
                      <option value="legal">Legal</option>
                      <option value="landing">Landing</option>
                    </select>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label style={{ fontWeight: 500 }}>Featured Content</label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content (Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="admin-search-input"
                  style={{ width: '100%', maxWidth: 'none', minHeight: '200px', resize: 'vertical', fontFamily: 'monospace' }}
                  placeholder="Write your content in Markdown format..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                  className="admin-action-btn secondary"
                >
                  Cancel
                </button>
                <button onClick={handleSave} className="admin-action-btn">
                  <Save size={16} style={{ marginRight: '0.5rem' }} />
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
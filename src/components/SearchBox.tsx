'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  type: 'post' | 'review' | 'page';
  category?: string;
  tags?: string[];
  publishedAt: Date;
  featuredImage?: {
    url: string;
    alt: string;
  };
  rating?: number;
}

interface SearchBoxProps {
  content: SearchResult[];
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ content, placeholder = "Search content...", className = "" }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = content.filter(item => {
      return (
        item.title.toLowerCase().includes(searchQuery) ||
        item.excerpt.toLowerCase().includes(searchQuery) ||
        item.category?.toLowerCase().includes(searchQuery) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    });

    setResults(filtered.slice(0, 10)); // Limit to 10 results
    setIsOpen(true);
  }, [query, content]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'review': return '⭐';
      case 'page': return '📄';
      default: return '📄';
    }
  };

  const getTypePath = (type: string) => {
    switch (type) {
      case 'post': return '/posts';
      case 'review': return '/reviews';
      case 'page': return '';
      default: return '/posts';
    }
  };

  return (
    <div style={{ position: 'relative' }} className={className}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.75rem 2.5rem 0.75rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 2px rgba(13, 148, 136, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        )}
        {!query && (
          <div style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            🔍
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '0.5rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          maxHeight: '24rem',
          overflowY: 'auto'
        }}>
          <div style={{
            padding: '0.75rem',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </div>
          
          {results.map((result) => (
            <Link
              key={result.id}
              href={`${getTypePath(result.type)}/${result.slug}`}
              onClick={clearSearch}
              style={{
                display: 'block',
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem', marginTop: '0.1rem' }}>
                  {getTypeIcon(result.type)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {result.title}
                    </h4>
                    {result.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>★</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{result.rating}</span>
                      </div>
                    )}
                  </div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 0.5rem 0',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4'
                  }}>
                    {result.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      textTransform: 'capitalize'
                    }}>
                      {result.type}
                    </span>
                    {result.category && (
                      <span style={{
                        background: 'var(--secondary)',
                        color: 'var(--primary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px'
                      }}>
                        {result.category}
                      </span>
                    )}
                    <span>
                      {formatDistanceToNow(result.publishedAt)} ago
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {results.length === 10 && (
            <div style={{
              padding: '0.75rem',
              textAlign: 'center',
              borderTop: '1px solid var(--border)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              Showing first 10 results. Try a more specific search.
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.length >= 2 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '0.5rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: '0 0 0.25rem 0'
          }}>
            No results found
          </h4>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
} 
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
      case 'page': return '/pages';
      default: return '/posts';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        {!query && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
          
          {results.map((result) => (
            <Link
              key={result.id}
              href={`${getTypePath(result.type)}/${result.slug}`}
              onClick={clearSearch}
              className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-1">
                  {getTypeIcon(result.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {result.title}
                    </h4>
                    {result.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs text-gray-600">{result.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {result.excerpt}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-full capitalize">
                      {result.type}
                    </span>
                    {result.category && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
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
            <div className="p-3 text-center border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Showing first 10 results. Try a more specific search.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">No results found</h4>
          <p className="text-xs text-gray-600">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
} 
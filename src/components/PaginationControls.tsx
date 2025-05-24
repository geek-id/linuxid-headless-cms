'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  visiblePages: (number | string)[];
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  hasPrevious,
  hasNext,
  visiblePages,
  onPageChange,
  onPrevious,
  onNext
}: PaginationControlsProps) {
  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '3rem',
        padding: '2rem 0'
      }}>
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: !hasPrevious ? 'var(--bg-secondary)' : 'var(--primary)',
            color: !hasPrevious ? 'var(--text-muted)' : 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: !hasPrevious ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Page Numbers */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  style={{
                    padding: '0.75rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                  }}
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                style={{
                  padding: '0.75rem 1rem',
                  background: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: isActive ? 'white' : 'var(--text-primary)',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.3s ease',
                  minWidth: '2.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: !hasNext ? 'var(--bg-secondary)' : 'var(--primary)',
            color: !hasNext ? 'var(--text-muted)' : 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: !hasNext ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Pagination Info */}
      <div style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        marginTop: '1rem'
      }}>
        Showing {startIndex + 1}-{endIndex} of {totalItems} items
      </div>
    </>
  );
} 
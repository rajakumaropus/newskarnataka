'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();
  const pageNumbers = [];

  // Calculate page numbers to display
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${baseUrl}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12 mb-6">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed">
          ← Previous
        </span>
      )}

      {/* First Page */}
      {startPage > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
          <Link
            href={createPageUrl(totalPages)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed">
          Next →
        </span>
      )}

      {/* Page Info */}
      <span className="ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}

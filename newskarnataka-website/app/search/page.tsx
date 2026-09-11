'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { useSearchArticles } from '@/lib/hooks/useArticles';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { articles, loading, error, pagination } = useSearchArticles(query, page);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <span>Search</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          {query && (
            <p className="text-gray-600 mt-2">
              Results for: <span className="font-semibold text-gray-900">"{query}"</span>
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* New Search */}
        <div className="mb-12">
          <SearchBar />
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Enter a search term to get started.</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">Error: {error}</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No articles found matching <span className="font-semibold">"{query}"</span>
            </p>
            <p className="text-gray-500 mb-6">Try searching with different keywords.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {pagination.total} article{pagination.total !== 1 ? 's' : ''}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pageCount > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pageCount}
                baseUrl={`/search?q=${encodeURIComponent(query)}`}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center">&copy; 2026 NewsKarnataka. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

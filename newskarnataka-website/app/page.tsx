'use client';

import { Suspense, useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import { useArticles, useFeaturedArticles } from '@/lib/hooks/useArticles';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [pageSize] = useState(12);

  const { articles, loading: articlesLoading, pagination } = useArticles(page, pageSize);
  const { articles: featuredArticles, loading: featuredLoading } = useFeaturedArticles(3);

  if (articlesLoading) {
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
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Search and Filter Section */}
      <section className="mb-12">
        <SearchBar />
        <CategoryFilter />
      </section>

      {/* Featured Articles Section */}
      {!featuredLoading && featuredArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* All Articles Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pageCount}
              baseUrl="/"
            />
          </>
        )}
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">NewsKarnataka</h1>
          <p className="text-gray-600 mt-1">Your source for local news from Karnataka</p>
        </div>
      </header>

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
        <HomeContent />
      </Suspense>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center">&copy; 2026 NewsKarnataka. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

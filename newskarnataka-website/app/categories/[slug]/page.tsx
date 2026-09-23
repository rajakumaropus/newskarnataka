'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { useArticlesByCategory, useArticles } from '@/lib/hooks/useArticles';
import { useCategoryBySlug } from '@/lib/hooks/useCategories';
import { useParams, useSearchParams } from 'next/navigation';

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { category, loading: categoryLoading } = useCategoryBySlug(slug);
  const { articles, loading: articlesLoading, pagination } = useArticlesByCategory(slug, page);
  const { articles: allArticles } = useArticles(1, 0);

  if (categoryLoading || articlesLoading) {
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = category.name || 'Category';
  const categoryDescription = category.description || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <span>{categoryName}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{categoryName}</h1>
          {categoryDescription && <p className="text-gray-600 mt-2">{categoryDescription}</p>}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <section className="mb-12">
          <SearchBar />
          <CategoryFilter />
        </section>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No articles found in this category.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to All Articles
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {articles.length} Article{articles.length !== 1 ? 's' : ''} in {categoryName}
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
                baseUrl={`/categories/${slug}`}
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

export default function CategoryPage() {
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
      <CategoryContent />
    </Suspense>
  );
}

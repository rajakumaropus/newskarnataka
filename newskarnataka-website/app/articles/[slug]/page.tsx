'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useArticleBySlug } from '@/lib/hooks/useArticles';
import { formatDate, getReadingTime } from '@/lib/utils';
import { useParams } from 'next/navigation';

function ArticleContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { article, loading, error } = useArticleBySlug(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-300 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2 mt-4" />
            <div className="h-64 bg-gray-300 rounded mt-6" />
            <div className="space-y-3 mt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-300 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    content,
    publishedAt,
    category,
    author,
    is_featured,
  } = article.attributes;

  const categoryData = category as any;
  const authorData = author as any;
  const categoryName = categoryData?.data?.attributes?.name || 'Uncategorized';
  const categorySlug = categoryData?.data?.attributes?.slug || '';
  const authorName = authorData?.data?.attributes?.name || 'Anonymous';
  const readingTime = getReadingTime(content || description);

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href={`/categories/${categorySlug}`} className="hover:text-gray-900">
              {categoryName}
            </Link>
          </nav>

          {/* Featured Badge */}
          {is_featured && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <span>{formatDate(publishedAt)}</span>
            <span className="text-gray-400">•</span>
            <span>{readingTime} min read</span>
            <span className="text-gray-400">•</span>
            <span>By {authorName}</span>
          </div>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl font-semibold">Featured Image</p>
          <p className="text-sm opacity-75 mt-2">Image placeholder for {title}</p>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Description/Lead */}
        <div className="prose prose-lg max-w-none mb-8 text-xl text-gray-700 font-semibold">
          {description}
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <p>{content || description}</p>

          {/* Additional sections can be added here */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Article Information</h3>
            <p className="text-gray-700">
              This article provides important insights about {categoryName.toLowerCase()} news and events in Karnataka.
            </p>
          </div>
        </div>

        {/* Category Info */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 text-sm uppercase tracking-wide font-semibold">Category</p>
          <Link
            href={`/categories/${categorySlug}`}
            className="text-xl text-blue-600 hover:text-blue-800 font-semibold mt-2 inline-block"
          >
            {categoryName} →
          </Link>
        </div>

        {/* Social Share & Related */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Share */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Article</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                  Copy Link
                </button>
              </div>
            </div>

            {/* Back to Articles */}
            <div className="flex flex-col justify-end">
              <Link
                href="/"
                className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back to All Articles
              </Link>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}

export default function ArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-300 rounded w-3/4" />
              <div className="h-6 bg-gray-300 rounded w-1/2 mt-4" />
              <div className="h-64 bg-gray-300 rounded mt-6" />
            </div>
          </div>
        </div>
      }
    >
      <ArticleContent />
    </Suspense>
  );
}

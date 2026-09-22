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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
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
  } = article;

  const categoryName = category?.name || 'Uncategorized';
  const categorySlug = category?.slug || '';
  const authorName = author?.name || 'NewsKarnataka';
  const readingTime = getReadingTime(content || description || '');

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Article Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600 font-semibold transition">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            {categorySlug && (
              <>
                <Link href={`/categories/${categorySlug}`} className="hover:text-blue-600 font-semibold transition">
                  {categoryName}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-semibold truncate">{title}</span>
          </nav>

          {/* Category Badge */}
          {categorySlug && (
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-bold rounded-full">
                {categoryName}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                {authorName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{authorName}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="font-semibold text-gray-900">{formatDate(publishedAt)}</p>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div>
              <p className="text-sm text-gray-500">Reading Time</p>
              <p className="font-semibold text-gray-900">{readingTime} minutes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="w-full h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="text-center z-10">
          <p className="text-white text-6xl mb-4">📰</p>
          <p className="text-white text-xl font-bold">Featured Image</p>
          <p className="text-white/80 text-sm mt-2">High-quality image placeholder</p>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Description/Lead */}
        <div className="prose-lg mb-12 text-2xl font-semibold text-gray-900 leading-relaxed">
          {description}
        </div>

        {/* Article Body */}
        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed mb-12">
          <p className="text-lg text-gray-800 whitespace-pre-wrap">
            {content || description}
          </p>

          {/* Additional sections */}
          <div className="mt-12 p-8 bg-blue-50 rounded-xl border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">📍 About This Article</h3>
            <p className="text-gray-700">
              This article provides important insights and updates about {categoryName.toLowerCase()} news and events happening in Karnataka. Stay tuned for more detailed coverage and analysis.
            </p>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Share This Article</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all transform hover:scale-105">
              📘 Facebook
            </button>
            <button className="px-6 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 hover:shadow-lg transition-all transform hover:scale-105">
              𝕏 Twitter
            </button>
            <button className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 hover:shadow-lg transition-all transform hover:scale-105">
              🔗 Copy Link
            </button>
            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-lg transition-all transform hover:scale-105">
              ❤️ Save
            </button>
          </div>
        </div>

        {/* Category Link */}
        {categorySlug && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide mb-2">More in this category</p>
            <h3 className="text-3xl font-bold mb-4">{categoryName}</h3>
            <Link
              href={`/categories/${categorySlug}`}
              className="inline-block px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              Browse More Articles →
            </Link>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-lg transition-colors group"
          >
            <span className="transform group-hover:-translate-x-2 transition-transform">←</span>
            Back to All Articles
          </Link>
        </div>
      </main>
    </article>
  );
}

export default function ArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

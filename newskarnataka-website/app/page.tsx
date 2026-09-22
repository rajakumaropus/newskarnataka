'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
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
  const { articles: featuredArticles, loading: featuredLoading } = useFeaturedArticles(6);

  if (articlesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Hero Section with Featured Article */}
      {!featuredLoading && featuredArticles.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-16 mb-16 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Main Featured Article */}
              <div className="lg:col-span-2 animate-slide-in-left">
                <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4 backdrop-blur">
                  🔥 Featured Story
                </span>
                <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                  {featuredArticles[0]?.title}
                </h2>
                <p className="text-lg text-white/90 mb-6 line-clamp-2">
                  {featuredArticles[0]?.description}
                </p>
                <Link
                  href={`/articles/${featuredArticles[0]?.slug}`}
                  className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Read Full Story →
                </Link>
              </div>

              {/* Featured Image Placeholder */}
              <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="aspect-video bg-white/10 rounded-2xl backdrop-blur flex items-center justify-center border-2 border-white/20 hover:border-white/40 transition-all hover:shadow-glow">
                  <div className="text-center">
                    <p className="text-3xl">📰</p>
                    <p className="text-sm text-white/80 mt-2">Featured Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Category Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="space-y-6">
          <SearchBar />
          <CategoryFilter />
        </div>
      </section>

      {/* Trending Articles Section */}
      {!featuredLoading && featuredArticles.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full animate-pulse-glow"></div>
            <h2 className="text-3xl font-black text-gray-900">🔥 Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.slice(1, 4).map((article, index) => (
              <div 
                key={article.id}
                style={{ 
                  animation: `slideUp 0.6s ease-out ${300 + index * 100}ms both`
                }}
              >
                <ArticleCard article={article} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full animate-pulse-glow"></div>
          <h2 className="text-3xl font-black text-gray-900">📚 Browse by Category</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Karnataka', icon: '🌟', color: 'from-blue-500 to-blue-600' },
            { name: 'Technology', icon: '💻', color: 'from-purple-500 to-purple-600' },
            { name: 'Sports', icon: '⚽', color: 'from-green-500 to-green-600' },
            { name: 'Business', icon: '💼', color: 'from-orange-500 to-orange-600' },
            { name: 'Entertainment', icon: '🎬', color: 'from-pink-500 to-pink-600' },
            { name: 'Education', icon: '🎓', color: 'from-indigo-500 to-indigo-600' },
          ].map((category, index) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase()}`}
              style={{ 
                animation: `fadeIn 0.6s ease-out ${600 + index * 50}ms both`
              }}
            >
              <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 cursor-pointer`}>
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{category.icon}</div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-xs text-white/80 mt-2">Explore articles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Articles Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-black text-gray-900">Latest News</h2>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm animate-fade-in">
            <p className="text-gray-500 text-lg">📰 No articles found at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  style={{ 
                    animation: `slideUp 0.6s ease-out ${index * 50}ms both`
                  }}
                >
                  <ArticleCard article={article} index={index} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pageCount > 1 && (
              <div className="mt-12 animate-fade-in">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pageCount}
                  baseUrl="/"
                />
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 rounded-2xl mx-4 mb-16 animate-slide-up shadow-glow" style={{ animationDelay: '200ms' }}>
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">✉️ Stay Updated</h3>
          <p className="text-white/90 mb-8">Get the latest news from Karnataka delivered to your inbox</p>
          <div className="flex gap-2 max-w-md mx-auto flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                NK
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NewsKarnataka
                </h1>
                <p className="text-xs text-gray-600">Local News from Karnataka</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition duration-300">
                Home
              </Link>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition duration-300">
                Categories
              </Link>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition duration-300">
                About
              </Link>
            </nav>

            {/* Search Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition duration-300">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <HomeContent />
      </Suspense>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div className="animate-fade-in">
              <h3 className="text-white font-bold mb-4 text-lg">NewsKarnataka</h3>
              <p className="text-sm text-gray-400">Your trusted source for local news and updates from Karnataka. Bringing you the stories that matter.</p>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition duration-300">🏠 Home</Link></li>
                <li><Link href="/" className="hover:text-white transition duration-300">📁 Categories</Link></li>
                <li><Link href="/" className="hover:text-white transition duration-300">ℹ️ About Us</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-white font-bold mb-4 text-lg">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition duration-300">🌟 Karnataka</Link></li>
                <li><Link href="/" className="hover:text-white transition duration-300">💻 Technology</Link></li>
                <li><Link href="/" className="hover:text-white transition duration-300">⚽ Sports</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="text-white font-bold mb-4 text-lg">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:shadow-glow transition-all duration-300 transform hover:scale-110">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 hover:shadow-glow transition-all duration-300 transform hover:scale-110">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 hover:shadow-glow transition-all duration-300 transform hover:scale-110">
                  📷
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 NewsKarnataka. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

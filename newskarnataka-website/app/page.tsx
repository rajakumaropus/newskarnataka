'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
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
      {/* Enhanced Hero Section */}
      {!featuredLoading && featuredArticles.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-20 mb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Main Featured Article */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-bold backdrop-blur border border-white/30">
                    🔥 TRENDING
                  </span>
                  <span className="text-xs font-semibold text-blue-100">2 min read</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                  {featuredArticles[0]?.title}
                </h2>
                
                <p className="text-lg text-white/95 line-clamp-3 font-medium">
                  {featuredArticles[0]?.description}
                </p>
                
                <div className="flex gap-4 pt-4">
                  <Link
                    href={`/articles/${featuredArticles[0]?.slug}`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Read Full Story
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
                    Share
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.75 12.938 11 12.226 11 10.5c0-2.45-2.239-4.5-5-4.5S1 8.05 1 10.5c0 1.726 1.25 2.438 2.316 2.842m8.684-13.342l-.925-.766A10.025 10.025 0 006 1c-5.621 0-10.196 3.98-10.196 8.9 0 .569.033 1.133.098 1.69M23 19.5c0-2.485-1.902-4.5-4.5-4.5S14 17.015 14 19.5s1.902 4.5 4.5 4.5 4.5-2.015 4.5-4.5zm-2-1h-5v5h5v-5z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="hidden lg:block">
                <div className="relative aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300 shadow-2xl group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-300">📰</p>
                      <p className="text-sm text-white/70 font-medium">Featured Story</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Category Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="space-y-6">
          <SearchBar />
          <CategoryFilter />
        </div>
      </section>

      {/* Trending Articles */}
      {!featuredLoading && featuredArticles.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h2 className="text-4xl font-black text-gray-900">🔥 Trending Now</h2>
              <span className="ml-auto text-sm text-gray-600 font-semibold">Top stories this week</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredArticles.slice(1, 4).map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-4xl font-black text-gray-900">📚 Browse by Category</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            { name: 'Karnataka', icon: '🌟', color: 'from-blue-500 to-blue-600' },
            { name: 'Technology', icon: '💻', color: 'from-purple-500 to-purple-600' },
            { name: 'Sports', icon: '⚽', color: 'from-green-500 to-green-600' },
            { name: 'Business', icon: '💼', color: 'from-orange-500 to-orange-600' },
            { name: 'Entertainment', icon: '🎬', color: 'from-pink-500 to-pink-600' },
            { name: 'Education', icon: '🎓', color: 'from-indigo-500 to-indigo-600' },
          ].map((category) => (
            <Link key={category.name} href={`/categories/${category.name.toLowerCase()}`}>
              <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 cursor-pointer border border-white/20`}>
                <div className="text-5xl mb-4 block">{category.icon}</div>
                <h3 className="font-black text-lg">{category.name}</h3>
                <p className="text-xs text-white/80 mt-3 font-medium">Explore</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-4xl font-black text-gray-900">Latest News</h2>
            <span className="ml-auto text-sm text-gray-600 font-semibold">{pagination?.total || 0} articles</span>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">📰 No articles found at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>

            {pagination.pageCount > 1 && (
              <div className="mt-12">
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
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-16 rounded-3xl mx-4 mb-16 shadow-2xl">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="mb-8">
            <p className="text-blue-100 text-sm font-black uppercase tracking-widest mb-3">📧 Stay Updated</p>
            <h3 className="text-5xl font-black mb-4">Get Latest News</h3>
            <p className="text-white/90 mb-8 text-lg font-medium">Subscribe to our newsletter and never miss breaking news from Karnataka</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); }} className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row mb-6">
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all font-medium placeholder-gray-600"
            />
            <button type="submit" className="px-8 py-3.5 bg-white text-blue-600 font-black rounded-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
              Subscribe
            </button>
          </form>

          <p className="text-white/70 text-sm font-medium">
            ✓ No spam · Unsubscribe anytime · 100% free
          </p>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16 bg-white rounded-3xl p-12 shadow-lg">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-black text-gray-900 mb-4">📱 Follow Us</h3>
          <p className="text-gray-600 text-lg font-medium">Get real-time updates and exclusive content on social media</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Facebook', icon: '📘', color: 'from-blue-500 to-blue-600', followers: '45.2K', handle: '@NewsKarnataka' },
            { name: 'Twitter', icon: '𝕏', color: 'from-gray-700 to-gray-800', followers: '32.8K', handle: '@NewsKarnataka' },
            { name: 'Instagram', icon: '📷', color: 'from-pink-500 to-rose-500', followers: '28.5K', handle: '@NewsKarnataka' },
            { name: 'YouTube', icon: '▶️', color: 'from-red-500 to-red-600', followers: '15.9K', handle: '@NewsKarnataka' },
          ].map((social) => (
            <a key={social.name} href="#" className="group">
              <div className={`bg-gradient-to-br ${social.color} rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20`}>
                <div className="text-6xl mb-4">{social.icon}</div>
                <h4 className="text-xl font-black mb-2">{social.name}</h4>
                <p className="text-white/90 text-sm mb-3 font-bold">{social.handle}</p>
                <p className="text-white/70 text-xs font-black mb-4">{social.followers} Followers</p>
                <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-black text-sm hover:bg-gray-100 transition-all duration-300">
                  Follow
                </button>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
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

      {/* Professional Footer */}
      <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black">
                  NK
                </div>
                <h3 className="text-white font-black text-lg">NewsKarnataka</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Your trusted source for local news and breaking stories from Karnataka.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">🏠 Home</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">📁 Categories</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">ℹ️ About Us</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">📧 Contact</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-black mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">🌟 Karnataka</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">💻 Technology</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">⚽ Sports</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">💼 Business</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-black mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">❓ FAQ</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">📋 Privacy Policy</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">⚖️ Terms of Service</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">📧 Contact Us</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-black mb-4">Follow Us</h4>
              <div className="flex gap-3 mb-6">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110 font-bold">f</a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 font-bold">𝕏</a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-all duration-300 hover:scale-110">📷</a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-all duration-300 hover:scale-110 font-bold">▶️</a>
              </div>
              <p className="text-xs text-gray-500">Subscribe to our channels for the latest updates</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">© 2026 NewsKarnataka. All rights reserved.</p>
              <div className="flex gap-6 text-sm">
                <Link href="/" className="text-gray-500 hover:text-gray-300 transition duration-300">Privacy</Link>
                <Link href="/" className="text-gray-500 hover:text-gray-300 transition duration-300">Terms</Link>
                <Link href="/" className="text-gray-500 hover:text-gray-300 transition duration-300">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

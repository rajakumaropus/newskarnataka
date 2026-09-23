import Link from 'next/link';
import { Article } from '@/lib/strapi';
import { formatDate, truncateText, getReadingTime } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

export default function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const { title, slug, description, content, publishedAt, tags, category } = article;

  const categoryName = category?.name || 'Uncategorized';
  const categorySlug = category?.slug || '';
  const readingTime = getReadingTime(content || description || '');
  const tagList = tags?.split(',')[0]?.trim() || '';

  // Professional color gradients for each card
  const gradients = [
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-pink-500 to-rose-700',
    'from-green-500 to-emerald-700',
    'from-orange-500 to-red-700',
    'from-indigo-500 to-blue-700',
  ];

  // Category color map
  const categoryColors: Record<string, { bg: string; text: string }> = {
    'technology': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'sports': { bg: 'bg-green-100', text: 'text-green-700' },
    'business': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'entertainment': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'education': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'karnataka': { bg: 'bg-orange-100', text: 'text-orange-700' },
  };

  const gradient = gradients[index % gradients.length];
  const categoryColor = categoryColors[categorySlug?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className={`relative w-full h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 group-hover:from-black/60 transition-all duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`inline-block px-3.5 py-1.5 ${categoryColor.bg} ${categoryColor.text} text-xs font-bold rounded-full shadow-lg backdrop-blur`}>
            {categoryName}
          </div>
        </div>

        {/* Reading Time Badge */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 backdrop-blur rounded-full text-xs font-bold text-gray-900 shadow-lg">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            {readingTime}m
          </div>
        </div>

        {/* Featured Icon */}
        {featured && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-black rounded-full shadow-lg">
              ⭐ FEATURED
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Tags */}
        {tagList && (
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-all duration-300 hover:scale-105">
              <span className="text-lg">🏷️</span>
              {tagList}
            </span>
          </div>
        )}

        {/* Title */}
        <Link href={`/articles/${slug}`} className="group/title block">
          <h3 className="text-xl font-black text-gray-900 line-clamp-2 group-hover/title:text-transparent group-hover/title:bg-gradient-to-r group-hover/title:from-blue-600 group-hover/title:to-purple-600 group-hover/title:bg-clip-text transition-all duration-300 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {truncateText(description, 120)}
        </p>

        {/* Meta Information */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <time className="hover:text-gray-700 transition-colors">
              {formatDate(publishedAt)}
            </time>
          </div>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
            {readingTime}m read
          </span>
        </div>

        {/* Read More Link */}
        <Link
          href={`/articles/${slug}`}
          className="inline-flex items-center gap-2.5 text-blue-600 font-bold text-sm mt-2 group/link hover:text-blue-800 transition-all duration-300"
        >
          Read Story
          <span className="text-lg transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>
    </article>
  );
}

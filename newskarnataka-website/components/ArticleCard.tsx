import Link from 'next/link';
import { Article } from '@/lib/strapi';
import { formatDate, truncateText, getReadingTime } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

export default function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const { title, slug, description, content, publishedAt, tags } = article;

  const categoryName = article.category?.name || 'Uncategorized';
  const categorySlug = article.category?.slug || '';
  const readingTime = getReadingTime(content || description || '');
  const tagList = tags?.split(',')[0]?.trim() || '';

  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-indigo-400 to-indigo-600',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <article className="group rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      {/* Featured Image */}
      <div className={`w-full h-56 bg-gradient-to-br ${gradient} flex items-end justify-start overflow-hidden relative`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>
        <div className="p-4 z-10">
          <div className="inline-block px-3 py-1 bg-white/95 backdrop-blur rounded-full text-xs font-bold text-gray-900 shadow-lg">
            {categoryName}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tags */}
        {tagList && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
              #{tagList}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-black text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all line-clamp-2 mb-2">
          <Link href={`/articles/${slug}`}>{title}</Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {truncateText(description, 120)}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <time>{formatDate(publishedAt)}</time>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded font-semibold">
            {readingTime}m read
          </span>
        </div>

        {/* Read More Link */}
        <Link
          href={`/articles/${slug}`}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors group/link"
        >
          Read More
          <span className="transform group-hover/link:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </article>
  );
}

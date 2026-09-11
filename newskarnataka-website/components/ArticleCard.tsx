import Link from 'next/link';
import { Article } from '@/lib/strapi';
import { formatDate, truncateText, getReadingTime } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { title, slug, description, content, publishedAt, category, is_featured } =
    article.attributes;

  const categoryData = category as any;
  const categoryName = categoryData?.data?.attributes?.name || 'Uncategorized';
  const categorySlug = categoryData?.data?.attributes?.slug || '';
  const readingTime = getReadingTime(content || description);

  return (
    <article
      className={`group rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Placeholder for featured image */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
        <div className="text-white text-center p-4">
          <p className="text-sm font-semibold">{categoryName}</p>
          <p className="text-xs opacity-75 mt-1">Featured Image</p>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Category Badge */}
        <Link href={`/categories/${categorySlug}`}>
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
            {categoryName}
          </span>
        </Link>

        {/* Featured Badge */}
        {is_featured && (
          <span className="inline-block ml-2 px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
            Featured
          </span>
        )}

        {/* Title */}
        <h3 className="mt-3 text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link href={`/articles/${slug}`}>{title}</Link>
        </h3>

        {/* Description */}
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">
          {truncateText(description, 150)}
        </p>

        {/* Meta Information */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(publishedAt)}</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Read More Link */}
        <Link
          href={`/articles/${slug}`}
          className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

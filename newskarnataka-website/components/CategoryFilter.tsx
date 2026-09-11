'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCategories } from '@/lib/hooks/useCategories';

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
        Filter by Category
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-4">
        {/* All Categories */}
        <Link
          href="/"
          className={`px-4 py-2 rounded-full font-medium transition-colors flex-shrink-0 ${
            !searchParams.get('category')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All
        </Link>

        {/* Category Links */}
        {categories.map((category) => {
          const categorySlug = category.attributes?.slug || '';
          const isActive = searchParams.get('category') === categorySlug;

          return (
            <Link
              key={category.id}
              href={`/categories/${categorySlug}`}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex-shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.attributes?.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

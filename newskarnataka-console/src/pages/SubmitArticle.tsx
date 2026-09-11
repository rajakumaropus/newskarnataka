import { useState, useEffect } from 'react';
import { submitArticle, getCategories } from '../lib/api';
import { slugify } from '../lib/utils';
import { useStore } from '../lib/store';
import { canPerform } from '../lib/rbac';
import { submitLimiter, checkRateLimit, formatResetTime } from '../lib/rateLimiter';

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

export default function SubmitArticle() {
  const { user } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitError, setRateLimitError] = useState('');

  // Check if user can create articles
  const canCreate = canPerform(user?.role, 'create');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: slugify(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRateLimitError('');

    // Check rate limit
    const userId = user?.id || 'anonymous';
    const rateLimitCheck = checkRateLimit(submitLimiter, userId);

    if (!rateLimitCheck.allowed) {
      setRateLimitError(
        `Too many submissions. Please try again ${formatResetTime(rateLimitCheck.resetTimeMs)}.`
      );
      setLoading(false);
      return;
    }

    try {
      await submitArticle({
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        description: formData.description,
        content: formData.content,
        category: parseInt(formData.categoryId),
      });

      setSubmitted(true);
      setFormData({
        title: '',
        slug: '',
        description: '',
        content: '',
        categoryId: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to submit article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canCreate) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 text-lg">You don't have permission to submit articles.</p>
        <p className="text-gray-500 text-sm mt-2">Contact an administrator to upgrade your role.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Article</h1>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          ✓ Article submitted successfully! It's now in the review queue.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {rateLimitError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          ⏱️ {rateLimitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Article title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-gray-900 mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="article-slug"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Category *
          </label>
          <select
            id="category"
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.attributes.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Article summary (will be displayed as preview)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            required
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Full article content"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Article'}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                title: '',
                slug: '',
                description: '',
                content: '',
                categoryId: '',
              })
            }
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

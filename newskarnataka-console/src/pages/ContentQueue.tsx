import { useState, useEffect } from 'react';
import { getArticleQueue, publishArticle, deleteArticle } from '../lib/api';
import { formatDate, getStatusBadgeColor } from '../lib/utils';

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ContentQueue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await getArticleQueue();
      setArticles(response.data.data);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (articleId: number) => {
    try {
      setPublishing(articleId);
      await publishArticle(articleId);
      await fetchQueue();
    } catch (error) {
      console.error('Failed to publish article:', error);
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      setDeleting(articleId);
      await deleteArticle(articleId);
      await fetchQueue();
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-300 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Queue</h1>

      {articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No articles in queue</p>
          <p className="text-gray-500 text-sm mt-2">All submissions have been processed</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{article.attributes.title}</p>
                      <p className="text-sm text-gray-600">{article.attributes.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        article.attributes.status
                      )}`}
                    >
                      {article.attributes.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(article.attributes.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handlePublish(article.id)}
                      disabled={publishing === article.id}
                      className="inline-block px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {publishing === article.id ? 'Publishing...' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deleting === article.id}
                      className="inline-block px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {deleting === article.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

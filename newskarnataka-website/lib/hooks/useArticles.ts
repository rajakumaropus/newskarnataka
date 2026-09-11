'use client';

import { useState, useEffect } from 'react';
import { articleAPI, Article, ApiResponse } from '@/lib/strapi';

export const useArticles = (page = 1, pageSize = 12) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    pageCount: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleAPI.getAll({ page, pageSize });
        setArticles(response.data as Article[]);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, pageSize]);

  return { articles, loading, error, pagination };
};

export const useFeaturedArticles = (limit = 6) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleAPI.getFeatured(limit);
        setArticles(response.data as Article[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  return { articles, loading, error };
};

export const useArticleBySlug = (slug: string | null) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const fetchedArticle = await articleAPI.getBySlug(slug);
        setArticle((fetchedArticle as any) || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return { article, loading, error };
};

export const useArticlesByCategory = (categorySlug: string | null, page = 1) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    pageCount: 0,
    total: 0,
  });

  useEffect(() => {
    if (!categorySlug) return;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleAPI.getByCategory(categorySlug, page);
        const articlesData = Array.isArray(response.data) ? response.data : [response.data];
        setArticles(articlesData as Article[]);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categorySlug, page]);

  return { articles, loading, error, pagination };
};

export const useSearchArticles = (query: string | null, page = 1) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    pageCount: 0,
    total: 0,
  });

  useEffect(() => {
    if (!query || query.length < 2) {
      setArticles([]);
      return;
    }

    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleAPI.search(query, page);
        const articlesData = Array.isArray(response.data) ? response.data : [response.data];
        setArticles(articlesData as Article[]);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search articles');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(timer);
  }, [query, page]);

  return { articles, loading, error, pagination };
};

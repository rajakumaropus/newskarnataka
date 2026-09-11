'use client';

import { useState, useEffect } from 'react';
import { categoryAPI, Category } from '@/lib/strapi';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryAPI.getAll();
        const categoriesData = Array.isArray(response.data) ? response.data : [response.data];
        setCategories(categoriesData as Category[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useCategoryBySlug = (slug: string | null) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const fetchedCategory = await categoryAPI.getBySlug(slug);
        setCategory((fetchedCategory as any) || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
};

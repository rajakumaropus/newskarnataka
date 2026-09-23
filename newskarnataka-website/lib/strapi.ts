import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://strapi.opusinfiniti.com';
// Use the fresh Strapi API token with full access
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 
                  process.env.STRAPI_API_TOKEN ||
                  '2b9048b75723c62315e2c9332c734967764a4cde11ea324734ae98a437bc970b295866816a8b051721af4b4612070d43371c1ac1132c1045823cf6c6d8b7ff4c4e4a83fd723a40fd81b8a73292275ffcb2d3369424247d6e5ff977c0e8d4a5355c3f958f42725007407c11878285a1e09e92a0bcb65c73a1dee5733b3179a3f8';

export const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// Interfaces - Strapi v5 Format (flat structure, no attributes wrapper)
export interface Article {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  excerpt?: string;
  tags?: string;
  wordpressPostId?: number;
  wordpressUrl?: string;
  views?: number;
  isSticky?: boolean;
  contentFormat?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author?: Author;
  category?: Category;
  cover?: {
    id: number;
    url: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Author {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T | T[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Article API calls
export const articleAPI = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
    filters?: Record<string, any>;
  }) => {
    const query = new URLSearchParams();
    query.append('populate', '*');
    query.append('pagination[pageSize]', String(params?.pageSize || 12));
    query.append('pagination[page]', String(params?.page || 1));

    if (params?.sort) {
      query.append('sort', params.sort);
    }

    const response = await strapiClient.get<ApiResponse<Article[]>>(
      `/articles?${query.toString()}`
    );
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await strapiClient.get<ApiResponse<Article[]>>(
      `/articles?filters[slug][$eq]=${slug}&populate=*`
    );
    const articles = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    return articles[0] || null;
  },

  getFeatured: async (limit = 6) => {
    const response = await strapiClient.get<ApiResponse<Article[]>>(
      `/articles?filters[is_featured][$eq]=true&pagination[pageSize]=${limit}&populate=*`
    );
    return response.data;
  },

  getByCategory: async (categorySlug: string, page = 1, pageSize = 12) => {
    const response = await strapiClient.get<ApiResponse<Article[]>>(
      `/articles?filters[category][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`
    );
    return response.data;
  },

  search: async (query: string, page = 1, pageSize = 12) => {
    const response = await strapiClient.get<ApiResponse<Article[]>>(
      `/articles?filters[$or][0][title][$contains]=${query}&filters[$or][1][description][$contains]=${query}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`
    );
    return response.data;
  },
};

// Category API calls
export const categoryAPI = {
  getAll: async () => {
    const response = await strapiClient.get<ApiResponse<Category[]>>(
      '/categories?populate=*'
    );
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await strapiClient.get<ApiResponse<Category[]>>(
      `/categories?filters[slug][$eq]=${slug}`
    );
    const categories = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    return categories[0] || null;
  },
};

// Author API calls
export const authorAPI = {
  getAll: async () => {
    const response = await strapiClient.get<ApiResponse<Author[]>>(
      '/authors?populate=*'
    );
    return response.data;
  },
};

import axios from 'axios';

// Hardcode for now - Vercel env vars may not be set
const STRAPI_URL = 'https://strapi.opusinfiniti.com';
const API_TOKEN = 'e137038b3e009f54434a83a6084cebead5beb48d91bb4fed7185ccedd91baa046f95b759a87cc25ac21bc32b33db326dbf495cac5e67686a6f819d97773b0f63e67c183ad927507f293080eac48334b30ab392edbcad864f390b58fc964a1a8aae2eef6f73156f1be0070e686852290afddb1129de5368f760e2b5496776ab32';

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

import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://103.191.208.235:1337';
// Try multiple env variable names for compatibility
const API_TOKEN = process.env.STRAPI_API_TOKEN_FULL_ACCESS || 
                  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
                  process.env.STRAPI_API_TOKEN ||
                  'c47da022dfd6b7d5ecf75684672004d91db115923a8bb480e9f8f376dcd61192e88f88a086957d0402810135d8e00156339b474563987ad8087c0143338b4853508655f066dbcecdf98e8f609b73c1dd181fdd0ecb46ffdb92f152cbe4de4cd87e0883a67eceda20a33cc9f186df9134e502ce839d5cc57e3f060de7866573d2';

export const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// Interfaces
export interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    content: string;
    status: 'published' | 'draft';
    is_featured: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    category?: {
      data: {
        id: number;
        attributes: Category;
      };
    };
    author?: {
      data: {
        id: number;
        attributes: Author;
      };
    };
  };
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description: string;
  };
}

export interface Author {
  id: number;
  attributes: {
    name: string;
    email: string;
    bio: string;
    avatar?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
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

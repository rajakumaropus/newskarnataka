import axios from 'axios';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://103.191.208.235:1337';
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

export const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// Article submission
export const submitArticle = async (data: {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: number;
}) => {
  return strapiClient.post('/articles', { data });
};

// Get articles in queue
export const getArticleQueue = async (page = 1, pageSize = 10) => {
  return strapiClient.get(
    `/articles?filters[status][$eq]=draft&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`
  );
};

// Get all articles
export const getAllArticles = async (page = 1, pageSize = 10) => {
  return strapiClient.get(
    `/articles?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`
  );
};

// Get categories
export const getCategories = async () => {
  return strapiClient.get('/categories?populate=*');
};

// Update article status
export const updateArticleStatus = async (articleId: number, status: string) => {
  return strapiClient.put(`/articles/${articleId}`, {
    data: { status },
  });
};

// Publish article
export const publishArticle = async (articleId: number) => {
  return strapiClient.put(`/articles/${articleId}`, {
    data: { status: 'published', publishedAt: new Date().toISOString() },
  });
};

// Delete article
export const deleteArticle = async (articleId: number) => {
  return strapiClient.delete(`/articles/${articleId}`);
};

// Get dashboard stats
export const getDashboardStats = async () => {
  const [articles, draft, published, categories] = await Promise.all([
    strapiClient.get('/articles'),
    strapiClient.get('/articles?filters[status][$eq]=draft'),
    strapiClient.get('/articles?filters[status][$eq]=published'),
    strapiClient.get('/categories'),
  ]);

  return {
    totalArticles: articles.data.meta.pagination.total,
    draftArticles: draft.data.meta.pagination.total,
    publishedArticles: published.data.meta.pagination.total,
    totalCategories: categories.data.meta.pagination.total,
  };
};

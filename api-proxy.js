#!/usr/bin/env node
/**
 * NewsKarnataka API Proxy Server
 * Acts as a bridge between public Console (Vercel) and private Strapi backend
 * 
 * This proxy:
 * - Exposes a public API endpoint
 * - Forwards requests to private Strapi internally
 * - Handles authentication and CORS
 * - Can be deployed on your private cloud server
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Internal Strapi URL (within private network)
const STRAPI_URL = process.env.STRAPI_URL || 'http://103.191.208.235:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Initialize Strapi client
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  },
});

// Middleware
app.use(cors({
  origin: [
    'https://newskarnataka-console.vercel.app',
    'https://newskarnataka-website.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// PROXY ENDPOINTS
// ============================================================================

// Get all articles with optional filters
app.get('/api/articles', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, category } = req.query;
    let url = `/articles?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
    
    if (status) url += `&filters[status][$eq]=${status}`;
    if (category) url += `&filters[category][slug][$eq]=${category}`;
    
    const response = await strapiClient.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('[GET /api/articles] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch articles',
      message: error.message,
    });
  }
});

// Get single article
app.get('/api/articles/:id', async (req, res) => {
  try {
    const response = await strapiClient.get(`/articles/${req.params.id}?populate=*`);
    res.json(response.data);
  } catch (error) {
    console.error('[GET /api/articles/:id] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch article',
      message: error.message,
    });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const response = await strapiClient.get('/categories?populate=*');
    res.json(response.data);
  } catch (error) {
    console.error('[GET /api/categories] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch categories',
      message: error.message,
    });
  }
});

// Get authors
app.get('/api/authors', async (req, res) => {
  try {
    const response = await strapiClient.get('/authors?populate=*');
    res.json(response.data);
  } catch (error) {
    console.error('[GET /api/authors] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch authors',
      message: error.message,
    });
  }
});

// Get tags
app.get('/api/tags', async (req, res) => {
  try {
    const response = await strapiClient.get('/tags?populate=*');
    res.json(response.data);
  } catch (error) {
    console.error('[GET /api/tags] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch tags',
      message: error.message,
    });
  }
});

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [articles, drafted, published, categories] = await Promise.all([
      strapiClient.get('/articles?pagination[page]=1&pagination[pageSize]=1'),
      strapiClient.get('/articles?filters[status][$eq]=draft&pagination[page]=1&pagination[pageSize]=1'),
      strapiClient.get('/articles?filters[status][$eq]=published&pagination[page]=1&pagination[pageSize]=1'),
      strapiClient.get('/categories?pagination[page]=1&pagination[pageSize]=1'),
    ]);

    res.json({
      totalArticles: articles.data?.meta?.pagination?.total || 0,
      draftArticles: drafted.data?.meta?.pagination?.total || 0,
      publishedArticles: published.data?.meta?.pagination?.total || 0,
      totalCategories: categories.data?.meta?.pagination?.total || 0,
    });
  } catch (error) {
    console.error('[GET /api/dashboard/stats] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch stats',
      message: error.message,
    });
  }
});

// Submit article (with token validation)
app.post('/api/articles', async (req, res) => {
  try {
    // Validate token from client
    const clientToken = req.headers.authorization?.split(' ')[1];
    if (clientToken !== STRAPI_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const response = await strapiClient.post('/articles', { data: req.body });
    res.status(201).json(response.data);
  } catch (error) {
    console.error('[POST /api/articles] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to create article',
      message: error.message,
    });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    // Validate token
    const clientToken = req.headers.authorization?.split(' ')[1];
    if (clientToken !== STRAPI_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const response = await strapiClient.put(`/articles/${req.params.id}`, { data: req.body });
    res.json(response.data);
  } catch (error) {
    console.error('[PUT /api/articles/:id] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to update article',
      message: error.message,
    });
  }
});

// Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    // Validate token
    const clientToken = req.headers.authorization?.split(' ')[1];
    if (clientToken !== STRAPI_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await strapiClient.delete(`/articles/${req.params.id}`);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/articles/:id] Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete article',
      message: error.message,
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   NewsKarnataka API Proxy Server Running   ║
╚════════════════════════════════════════════╝

🔗 API URL: http://localhost:${PORT}
🔐 Strapi Backend: ${STRAPI_URL}
✅ Health Check: http://localhost:${PORT}/health

Allowed Origins:
  - https://newskarnataka-console.vercel.app
  - https://newskarnataka-website.vercel.app
  - http://localhost:3000
  - http://localhost:5173
  `);
});

module.exports = app;

#!/usr/bin/env node

/**
 * Simple Data Seeding Script for Strapi
 * 
 * Seeds sample data into existing Strapi collections
 * Run this AFTER creating the 4 collections in Strapi Admin UI
 * 
 * Usage: node seed-data.js
 * 
 * Requirements:
 * - STRAPI_API_TOKEN environment variable set
 * - Collections already created in Strapi
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://103.191.208.235:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable not set');
  process.exit(1);
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

/**
 * Seed Categories
 */
async function seedCategories() {
  log('\n🌱 Seeding Categories...', 'blue');

  const categories = [
    { name: 'Bengaluru', color: '#FF6B6B' },
    { name: 'Mangaluru', color: '#4ECDC4' },
    { name: 'Udupi', color: '#45B7D1' },
    { name: 'Mysuru', color: '#FFA07A' },
    { name: 'Business', color: '#98D8C8' },
    { name: 'Technology', color: '#6BCB77' },
    { name: 'Entertainment', color: '#FF6B9D' },
    { name: 'Sports', color: '#4D96FF' },
    { name: 'Politics', color: '#FFD93D' },
    { name: 'Health', color: '#A8E6CF' },
  ];

  let created = 0;
  let skipped = 0;

  for (const cat of categories) {
    try {
      const response = await api.post('/categories', {
        data: {
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
          color: cat.color,
          description: `${cat.name} news coverage`,
        },
      });
      log(`  ✅ ${cat.name}`, 'green');
      created++;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
        log(`  ⚠️  ${cat.name} (already exists)`, 'yellow');
        skipped++;
      } else {
        log(`  ❌ ${cat.name}: ${error.message}`, 'red');
      }
    }
  }

  log(`\n  Created: ${created}, Skipped: ${skipped}`, 'green');
  return created > 0;
}

/**
 * Seed Authors
 */
async function seedAuthors() {
  log('\n🌱 Seeding Authors...', 'blue');

  const authors = [
    { name: 'News Karnataka Team', email: 'team@newskarnataka.com', bio: 'Main editorial team' },
    { name: 'Bengaluru Correspondent', email: 'bengaluru@newskarnataka.com', bio: 'Bengaluru coverage specialist' },
    { name: 'Tech Reporter', email: 'tech@newskarnataka.com', bio: 'Technology and innovation' },
    { name: 'Business Editor', email: 'business@newskarnataka.com', bio: 'Business and economy' },
    { name: 'Sports Editor', email: 'sports@newskarnataka.com', bio: 'Sports and fitness' },
  ];

  let created = 0;
  let skipped = 0;

  for (const author of authors) {
    try {
      const response = await api.post('/authors', {
        data: {
          name: author.name,
          email: author.email,
          bio: author.bio,
        },
      });
      log(`  ✅ ${author.name}`, 'green');
      created++;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
        log(`  ⚠️  ${author.name} (already exists)`, 'yellow');
        skipped++;
      } else {
        log(`  ❌ ${author.name}: ${error.message}`, 'red');
      }
    }
  }

  log(`\n  Created: ${created}, Skipped: ${skipped}`, 'green');
  return created > 0;
}

/**
 * Seed Tags
 */
async function seedTags() {
  log('\n🌱 Seeding Tags...', 'blue');

  const tags = [
    'Breaking News',
    'Latest',
    'Opinion',
    'Analysis',
    'Interview',
    'Event Coverage',
    'In-Depth',
    'Spotlight',
  ];

  let created = 0;
  let skipped = 0;

  for (const tag of tags) {
    try {
      const response = await api.post('/tags', {
        data: {
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, '-'),
        },
      });
      log(`  ✅ ${tag}`, 'green');
      created++;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
        log(`  ⚠️  ${tag} (already exists)`, 'yellow');
        skipped++;
      } else {
        log(`  ❌ ${tag}: ${error.message}`, 'red');
      }
    }
  }

  log(`\n  Created: ${created}, Skipped: ${skipped}`, 'green');
  return created > 0;
}

/**
 * Seed Sample Article
 */
async function seedArticle() {
  log('\n🌱 Seeding Sample Article...', 'blue');

  try {
    // Get first category and author
    const cats = await api.get('/categories?pagination[limit]=1');
    const authors = await api.get('/authors?pagination[limit]=1');
    const tags = await api.get('/tags?pagination[limit]=2');

    if (!cats.data.data.length || !authors.data.data.length) {
      log('  ⚠️  No categories or authors found. Create some first.', 'yellow');
      return false;
    }

    const categoryId = cats.data.data[0].id;
    const authorId = authors.data.data[0].id;
    const tagIds = tags.data.data.map(t => t.id) || [];

    const response = await api.post('/articles', {
      data: {
        title: 'Welcome to NewsKarnataka - Powered by Strapi',
        slug: 'welcome-newskarnataka-strapi',
        excerpt: 'NewsKarnataka launches its new modern platform',
        description: '<p>We are thrilled to announce the launch of our new Strapi-powered platform.</p>',
        content: `
          <h2>A New Era for News Karnataka</h2>
          <p>NewsKarnataka has migrated to a modern, open-source Strapi backend with Next.js and React frontends.</p>
          <h3>What's New</h3>
          <ul>
            <li>Faster, more reliable platform</li>
            <li>Better user experience</li>
            <li>Advanced search and filtering</li>
            <li>Real-time updates</li>
          </ul>
          <p>Thank you for being part of our journey!</p>
        `,
        publishedDate: new Date().toISOString(),
        readTime: 3,
        metaDescription: 'NewsKarnataka launches new Strapi platform',
        keywords: 'news,karnataka,strapi,platform',
        status: 'published',
        isFeatured: true,
        category: categoryId,
        author: authorId,
        tags: tagIds,
      },
    });

    log(`  ✅ Article created: "${response.data.data.attributes.title}"`, 'green');
    return true;
  } catch (error) {
    log(`  ❌ Error: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  log('\n' + '='.repeat(70), 'blue');
  log('🚀 STRAPI DATA SEEDING SCRIPT', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  log(`Strapi: ${STRAPI_URL}`, 'yellow');
  log(`Token: ${STRAPI_TOKEN.substring(0, 20)}...`, 'yellow');

  try {
    // Seed data
    await seedCategories();
    await seedAuthors();
    await seedTags();
    await seedArticle();

    log('\n' + '='.repeat(70), 'blue');
    log('✅ DATA SEEDING COMPLETE', 'green');
    log('='.repeat(70) + '\n', 'blue');

    log('📋 Next Steps:', 'yellow');
    log('1. Check Strapi Admin: http://103.191.208.235:1337/admin', 'yellow');
    log('2. View website: https://newskarnataka-website.vercel.app', 'yellow');
    log('3. Check console: https://newskarnataka-console.vercel.app', 'yellow');
    log('4. Create more articles manually or via console', 'yellow');
  } catch (error) {
    log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();

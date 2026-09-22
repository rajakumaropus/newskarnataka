#!/usr/bin/env node
/**
 * NewsKarnataka WordPress to Strapi Migration
 * Scrapes WordPress articles and imports them into Strapi
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const WORDPRESS_URL = 'https://api.newskarnataka.com';
const STRAPI_URL = process.env.STRAPI_URL || 'http://103.191.208.235:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Create axios clients
const wpClient = axios.create({
  baseURL: WORDPRESS_URL,
  headers: {
    'User-Agent': 'NewsKarnataka-Scraper/1.0',
  },
});

const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  },
});

// ============================================================================
// WORDPRESS DATA FETCHING
// ============================================================================

/**
 * Fetch all WordPress posts using REST API with pagination
 */
async function fetchAllWordPressPosts(maxPages = 5) {
  const allPosts = [];
  
  for (let page = 1; page <= maxPages; page++) {
    try {
      console.log(`📄 Fetching WordPress posts (page ${page}/${maxPages})...`);
      
      const response = await wpClient.get('/wp-json/wp/v2/posts', {
        params: {
          page,
          per_page: 100,
          _embed: false, // Don't embed to speed up requests
        },
        timeout: 30000,
      });

      if (!response.data || response.data.length === 0) {
        console.log(`✅ Reached end of posts at page ${page}`);
        break;
      }

      allPosts.push(...response.data);
      console.log(`✅ Got ${response.data.length} posts (Total: ${allPosts.length})`);

    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ No more posts available`);
        break;
      }
      console.error(`⚠️  Error on page ${page}:`, error.message);
      // Continue anyway to import what we have
      break;
    }
  }

  return allPosts;
}

/**
 * Fetch all WordPress categories
 */
async function fetchWordPressCategories() {
  try {
    console.log('📁 Fetching WordPress categories...');
    
    const response = await wpClient.get('/wp-json/wp/v2/categories', {
      params: {
        per_page: 100,
      },
    });

    console.log(`✅ Got ${response.data.length} categories`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error.message);
    return [];
  }
}

/**
 * Fetch all WordPress authors
 */
async function fetchWordPressAuthors() {
  try {
    console.log('👥 Fetching WordPress authors...');
    
    const response = await wpClient.get('/wp-json/wp/v2/users', {
      params: {
        per_page: 100,
      },
    });

    console.log(`✅ Got ${response.data.length} authors`);
    return response.data;
  } catch (error) {
    console.error('⚠️  Failed to fetch authors (may require auth):', error.message);
    return [];
  }
}

/**
 * Fetch all WordPress tags
 */
async function fetchWordPressTags() {
  try {
    console.log('🏷️ Fetching WordPress tags...');
    
    const response = await wpClient.get('/wp-json/wp/v2/tags', {
      params: {
        per_page: 100,
      },
    });

    console.log(`✅ Got ${response.data.length} tags`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch tags:', error.message);
    return [];
  }
}

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

/**
 * Clean HTML content
 */
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<\/?[^>]+>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

/**
 * Transform WordPress post to Strapi article format
 */
function transformPost(post) {
  // Generate slug
  const slug = post.slug || post.title.rendered
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');

  // Extract excerpt - clean HTML
  let excerpt = '';
  if (post.excerpt?.rendered) {
    excerpt = cleanHtml(post.excerpt.rendered).substring(0, 200);
  } else if (post.content?.rendered) {
    excerpt = cleanHtml(post.content.rendered).substring(0, 200);
  }

  // Get featured image
  let featuredImage = '';
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
  }

  // Get first category
  let categoryId = null;
  if (post.categories && post.categories.length > 0) {
    categoryId = post.categories[0];
  }

  // Clean content
  const content = cleanHtml(post.content?.rendered || '');

  // Estimate read time (5 min per 1000 words)
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title: post.title.rendered,
    slug,
    description: excerpt,
    content,
    featuredImage,
    category: categoryId,
    author: post.author,
    tags: post.tags || [],
    publishedDate: post.date,
    updatedDate: post.modified,
    isFeatured: false,
    isBreakingNews: false,
    readTime,
    metaDescription: excerpt,
    keywords: (post.tags || []).map(t => `tag-${t}`).join(', '),
    viewsCount: 0,
    status: post.status === 'publish' ? 'published' : 'draft',
  };
}

/**
 * Transform WordPress category to Strapi format
 */
function transformCategory(wpCategory) {
  return {
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description || '',
    icon: '📰',
    color: '#007bff',
  };
}

/**
 * Transform WordPress author to Strapi format
 */
function transformAuthor(wpAuthor) {
  return {
    name: wpAuthor.name,
    email: wpAuthor.email || `author-${wpAuthor.id}@newskarnataka.com`,
    bio: wpAuthor.description || '',
    avatar: wpAuthor.avatar_urls?.['96'] || '',
    socialLinks: {},
  };
}

/**
 * Transform WordPress tag to Strapi format
 */
function transformTag(wpTag) {
  return {
    name: wpTag.name,
    slug: wpTag.slug,
  };
}

// ============================================================================
// STRAPI DATA MANAGEMENT
// ============================================================================

/**
 * Create or update category in Strapi
 */
async function syncCategory(wpCategory) {
  try {
    const strapiCategory = transformCategory(wpCategory);
    
    // Check if category exists
    const existing = await strapiClient.get('/categories', {
      params: {
        'filters[slug][$eq]': wpCategory.slug,
      },
    });

    if (existing.data.data && existing.data.data.length > 0) {
      return existing.data.data[0].id;
    }

    // Create new category
    const response = await strapiClient.post('/categories', {
      data: strapiCategory,
    });

    console.log(`  ✅ Category created: ${wpCategory.name}`);
    return response.data.data.id;
  } catch (error) {
    console.error(`  ❌ Failed to sync category: ${error.message}`);
    return null;
  }
}

/**
 * Create or update tag in Strapi
 */
async function syncTag(wpTag) {
  try {
    const strapiTag = transformTag(wpTag);
    
    // Check if tag exists
    const existing = await strapiClient.get('/tags', {
      params: {
        'filters[slug][$eq]': wpTag.slug,
      },
    });

    if (existing.data.data && existing.data.data.length > 0) {
      return existing.data.data[0].id;
    }

    // Create new tag
    const response = await strapiClient.post('/tags', {
      data: strapiTag,
    });

    console.log(`  ✅ Tag created: ${wpTag.name}`);
    return response.data.data.id;
  } catch (error) {
    console.error(`  ❌ Failed to sync tag: ${error.message}`);
    return null;
  }
}

/**
 * Import article into Strapi
 */
async function importArticle(article) {
  try {
    // Check if article already exists
    const existing = await strapiClient.get('/articles', {
      params: {
        'filters[slug][$eq]': article.slug,
      },
    });

    if (existing.data.data && existing.data.data.length > 0) {
      return { exists: true, id: existing.data.data[0].id };
    }

    // Create new article
    const response = await strapiClient.post('/articles', {
      data: article,
    });

    return { exists: false, id: response.data.data.id };
  } catch (error) {
    console.error(`  ❌ Failed to import article: ${error.message}`);
    if (error.response?.data) {
      console.error('   Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return { exists: false, id: null, error: error.message };
  }
}

// ============================================================================
// MAIN MIGRATION FLOW
// ============================================================================

async function migrate() {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  NewsKarnataka WordPress → Strapi Migration           ║
╚════════════════════════════════════════════════════════╝

🔗 WordPress: ${WORDPRESS_URL}
🔗 Strapi: ${STRAPI_URL}
  `);

  try {
    // Step 1: Verify connections
    console.log('\n[1/5] Verifying connections...');
    
    try {
      await wpClient.get('/wp-json/');
      console.log('✅ WordPress connection OK');
    } catch (error) {
      console.error('❌ WordPress connection failed');
      throw error;
    }

    try {
      await strapiClient.get('/articles?pagination[page]=1&pagination[pageSize]=1');
      console.log('✅ Strapi connection OK');
    } catch (error) {
      console.error('❌ Strapi connection failed');
      throw error;
    }

    // Step 2: Fetch WordPress data
    console.log('\n[2/5] Fetching WordPress data...');
    const [wpPosts, wpCategories, wpTags] = await Promise.all([
      fetchAllWordPressPosts(5), // Start with first 500 articles (5 pages)
      fetchWordPressCategories(),
      fetchWordPressTags(),
    ]);

    console.log(`\n📊 Summary:`);
    console.log(`   Posts: ${wpPosts.length}`);
    console.log(`   Categories: ${wpCategories.length}`);
    console.log(`   Tags: ${wpTags.length}`);

    // Step 3: Sync categories and tags
    console.log('\n[3/5] Syncing taxonomies...');
    
    const categoryMap = {};
    for (const wpCat of wpCategories) {
      const id = await syncCategory(wpCat);
      if (id) categoryMap[wpCat.id] = id;
    }
    console.log(`✅ Synced ${Object.keys(categoryMap).length} categories`);

    const tagMap = {};
    for (const wpTag of wpTags) {
      const id = await syncTag(wpTag);
      if (id) tagMap[wpTag.id] = id;
    }
    console.log(`✅ Synced ${Object.keys(tagMap).length} tags`);

    // Step 4: Transform posts
    console.log('\n[4/5] Transforming posts...');
    const articles = wpPosts.map(post => transformPost(post));
    console.log(`✅ Transformed ${articles.length} articles`);

    // Step 5: Import articles
    console.log('\n[5/5] Importing articles...');
    let successCount = 0;
    let existsCount = 0;
    let failCount = 0;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      // Show progress every 10 articles
      if ((i + 1) % 10 === 0 || i === 0) {
        console.log(`\n   Progress: ${i + 1}/${articles.length}`);
      }

      const result = await importArticle(article);
      
      if (result.id) {
        if (result.exists) {
          existsCount++;
        } else {
          successCount++;
          // Show success for important articles only
          if (i < 5 || i % 50 === 0) {
            console.log(`     ✅ ${article.title.substring(0, 50)}...`);
          }
        }
      } else {
        failCount++;
        console.log(`     ❌ ${article.title.substring(0, 50)}...`);
      }

      // Rate limiting - add small delay every 10 requests
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Summary
    console.log(`
╔════════════════════════════════════════════════════════╗
║  Migration Complete ✅                                ║
╚════════════════════════════════════════════════════════╝

📊 Articles:
   ✅ Successfully imported: ${successCount}
   ℹ️  Already exist: ${existsCount}
   ❌ Failed: ${failCount}
   📦 Total processed: ${articles.length}

📁 Categories: ${Object.keys(categoryMap).length}
🏷️ Tags: ${Object.keys(tagMap).length}

🎯 Next steps:
   1. Verify data in Strapi Admin: http://103.191.208.235:1337/admin
   2. Refresh Console: https://newskarnataka-console.vercel.app
   3. Check Dashboard for updated article counts
   4. Review some articles for formatting

    `);

    return { successCount, existsCount, failCount, total: articles.length };

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  migrate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { migrate };

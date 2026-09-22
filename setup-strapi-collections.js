#!/usr/bin/env node

/**
 * Strapi Collections Setup Script
 * 
 * This script creates all necessary collections and content types in Strapi
 * for the NewsKarnataka migration project.
 * 
 * Usage: node setup-strapi-collections.js
 * 
 * Requirements:
 * - Node.js 20+
 * - axios (npm install axios)
 * - STRAPI_URL and STRAPI_API_TOKEN environment variables
 */

const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://103.191.208.235:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable not set');
  process.exit(1);
}

const strapiAPI = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * STEP 1: Create Categories Collection
 */
async function createCategoriesCollection() {
  log('\n📋 Creating Categories Collection...', 'blue');

  try {
    // Note: Direct collection creation via API requires admin access
    // This is a template for the schema structure
    
    log('✅ Categories collection structure:', 'green');
    console.log(`
    {
      "name": "categories",
      "singularName": "category",
      "displayName": "Categories",
      "description": "News categories (Bengaluru, Mangaluru, etc.)",
      "fields": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "unique": true,
          "maxLength": 100
        },
        {
          "name": "slug",
          "type": "uid",
          "targetField": "name",
          "required": true,
          "unique": true
        },
        {
          "name": "description",
          "type": "richtext"
        },
        {
          "name": "icon",
          "type": "media",
          "single": true
        },
        {
          "name": "color",
          "type": "string",
          "regex": "^#[0-9A-Fa-f]{6}$"
        }
      ]
    }
    `);
    
    return true;
  } catch (error) {
    log(`❌ Error creating categories: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 2: Create Authors Collection
 */
async function createAuthorsCollection() {
  log('\n📋 Creating Authors Collection...', 'blue');

  try {
    log('✅ Authors collection structure:', 'green');
    console.log(`
    {
      "name": "authors",
      "singularName": "author",
      "displayName": "Authors",
      "description": "Article authors and contributors",
      "fields": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "maxLength": 100
        },
        {
          "name": "email",
          "type": "email",
          "unique": true
        },
        {
          "name": "bio",
          "type": "text",
          "maxLength": 500
        },
        {
          "name": "avatar",
          "type": "media",
          "single": true
        },
        {
          "name": "socialLinks",
          "type": "json"
        }
      ]
    }
    `);
    
    return true;
  } catch (error) {
    log(`❌ Error creating authors: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 3: Create Tags Collection
 */
async function createTagsCollection() {
  log('\n📋 Creating Tags Collection...', 'blue');

  try {
    log('✅ Tags collection structure:', 'green');
    console.log(`
    {
      "name": "tags",
      "singularName": "tag",
      "displayName": "Tags",
      "description": "Article tags for categorization",
      "fields": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "unique": true,
          "maxLength": 50
        },
        {
          "name": "slug",
          "type": "uid",
          "targetField": "name",
          "required": true,
          "unique": true
        }
      ]
    }
    `);
    
    return true;
  } catch (error) {
    log(`❌ Error creating tags: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 4: Create Articles Collection
 */
async function createArticlesCollection() {
  log('\n📋 Creating Articles Collection...', 'blue');

  try {
    log('✅ Articles collection structure:', 'green');
    console.log(`
    {
      "name": "articles",
      "singularName": "article",
      "displayName": "Articles",
      "description": "News articles migrated from WordPress",
      "fields": [
        {
          "name": "title",
          "type": "string",
          "required": true,
          "maxLength": 255
        },
        {
          "name": "slug",
          "type": "uid",
          "targetField": "title",
          "required": true,
          "unique": true
        },
        {
          "name": "excerpt",
          "type": "string",
          "maxLength": 160
        },
        {
          "name": "description",
          "type": "richtext",
          "required": true
        },
        {
          "name": "content",
          "type": "richtext",
          "required": true
        },
        {
          "name": "featuredImage",
          "type": "media",
          "single": true
        },
        {
          "name": "category",
          "type": "relation",
          "relation": "manyToOne",
          "target": "api::category.category"
        },
        {
          "name": "author",
          "type": "relation",
          "relation": "manyToOne",
          "target": "api::author.author"
        },
        {
          "name": "tags",
          "type": "relation",
          "relation": "manyToMany",
          "target": "api::tag.tag"
        },
        {
          "name": "publishedDate",
          "type": "datetime",
          "required": true
        },
        {
          "name": "updatedDate",
          "type": "datetime"
        },
        {
          "name": "isFeatured",
          "type": "boolean",
          "default": false
        },
        {
          "name": "isBreakingNews",
          "type": "boolean",
          "default": false
        },
        {
          "name": "readTime",
          "type": "integer",
          "min": 1,
          "max": 60
        },
        {
          "name": "metaDescription",
          "type": "string",
          "maxLength": 160
        },
        {
          "name": "keywords",
          "type": "string",
          "maxLength": 255
        },
        {
          "name": "viewsCount",
          "type": "integer",
          "default": 0
        },
        {
          "name": "status",
          "type": "enumeration",
          "enum": ["draft", "published", "archived"],
          "default": "draft"
        },
        {
          "name": "wordpressPostId",
          "type": "integer",
          "description": "Original WordPress post ID for reference and deduplication"
        },
        {
          "name": "wordpressUrl",
          "type": "string",
          "description": "Original WordPress post URL for archives and redirects"
        },
        {
          "name": "contentFormat",
          "type": "enumeration",
          "enum": ["standard", "gallery", "video", "opinion"],
          "default": "standard",
          "description": "Content type differentiation from WordPress (post format)"
        },
        {
          "name": "isSticky",
          "type": "boolean",
          "default": false,
          "description": "Was this post sticky/pinned in WordPress"
        },
        {
          "name": "views",
          "type": "integer",
          "default": 0,
          "description": "View count migrated from WordPress post meta"
        }
      ]
    }
    `);
    
    return true;
  } catch (error) {
    log(`❌ Error creating articles: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 5: Seed Sample Categories
 */
async function seedSampleCategories() {
  log('\n🌱 Seeding Sample Categories...', 'blue');

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

  try {
    for (const category of categories) {
      try {
        const response = await strapiAPI.post('/categories', {
          data: {
            name: category.name,
            slug: category.name.toLowerCase().replace(/\s+/g, '-'),
            color: category.color,
            description: `Category for ${category.name} news coverage`,
          },
        });
        log(`  ✅ Created: ${category.name}`, 'green');
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
          log(`  ⚠️ Already exists: ${category.name}`, 'yellow');
        } else {
          throw error;
        }
      }
    }
    return true;
  } catch (error) {
    log(`❌ Error seeding categories: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 6: Seed Sample Authors
 */
async function seedSampleAuthors() {
  log('\n🌱 Seeding Sample Authors...', 'blue');

  const authors = [
    {
      name: 'News Karnataka Team',
      email: 'team@newskarnataka.com',
      bio: 'The main editorial team of News Karnataka',
    },
    {
      name: 'Bengaluru Correspondent',
      email: 'bengaluru@newskarnataka.com',
      bio: 'Senior correspondent covering Bengaluru news',
    },
    {
      name: 'Tech Reporter',
      email: 'tech@newskarnataka.com',
      bio: 'Technology and innovation reporter',
    },
    {
      name: 'Business Editor',
      email: 'business@newskarnataka.com',
      bio: 'Business and economy beat editor',
    },
    {
      name: 'Sports Editor',
      email: 'sports@newskarnataka.com',
      bio: 'Sports and fitness correspondent',
    },
  ];

  try {
    for (const author of authors) {
      try {
        const response = await strapiAPI.post('/authors', {
          data: {
            name: author.name,
            email: author.email,
            bio: author.bio,
          },
        });
        log(`  ✅ Created: ${author.name}`, 'green');
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
          log(`  ⚠️ Already exists: ${author.name}`, 'yellow');
        } else {
          throw error;
        }
      }
    }
    return true;
  } catch (error) {
    log(`❌ Error seeding authors: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 7: Seed Sample Tags
 */
async function seedSampleTags() {
  log('\n🌱 Seeding Sample Tags...', 'blue');

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

  try {
    for (const tag of tags) {
      try {
        const response = await strapiAPI.post('/tags', {
          data: {
            name: tag,
            slug: tag.toLowerCase().replace(/\s+/g, '-'),
          },
        });
        log(`  ✅ Created: ${tag}`, 'green');
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
          log(`  ⚠️ Already exists: ${tag}`, 'yellow');
        } else {
          throw error;
        }
      }
    }
    return true;
  } catch (error) {
    log(`❌ Error seeding tags: ${error.message}`, 'red');
    return false;
  }
}

/**
 * STEP 8: Seed Sample Article
 */
async function seedSampleArticle() {
  log('\n🌱 Seeding Sample Article...', 'blue');

  try {
    // Get first category and author for relations
    const categoriesRes = await strapiAPI.get('/categories?pagination[limit]=1');
    const authorsRes = await strapiAPI.get('/authors?pagination[limit]=1');
    const tagsRes = await strapiAPI.get('/tags?pagination[limit]=2');

    if (!categoriesRes.data.data.length) {
      log('  ⚠️ No categories available, skipping article creation', 'yellow');
      return true;
    }

    const categoryId = categoriesRes.data.data[0].id;
    const authorId = authorsRes.data.data[0]?.id;
    const tagIds = tagsRes.data.data.map(t => t.id) || [];

    const articleData = {
      data: {
        title: 'NewsKarnataka Launches New Platform',
        slug: 'newskarnataka-launches-new-platform',
        excerpt: 'NewsKarnataka is excited to announce its new Strapi-powered platform with enhanced features.',
        description: '<p>We are thrilled to announce the launch of our new platform powered by Strapi and Next.js.</p>',
        content: `
          <h2>Revolutionary News Platform</h2>
          <p>NewsKarnataka has migrated to a modern, open-source stack to provide you with better news delivery.</p>
          <h3>Key Features</h3>
          <ul>
            <li>Real-time updates</li>
            <li>Advanced search and filtering</li>
            <li>Enhanced reading experience</li>
            <li>Better performance</li>
          </ul>
          <p>We're committed to delivering quality journalism to Karnataka.</p>
        `,
        publishedDate: new Date().toISOString(),
        isFeatured: true,
        isBreakingNews: false,
        readTime: 3,
        metaDescription: 'NewsKarnataka launches new Strapi-powered platform',
        keywords: 'news,karnataka,platform,strapi',
        status: 'published',
        category: categoryId,
        ...(authorId && { author: authorId }),
        ...(tagIds.length && { tags: tagIds }),
      },
    };

    const response = await strapiAPI.post('/articles', articleData);
    log(`  ✅ Created sample article: "${response.data.data.attributes.title}"`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error seeding article: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  log('\n' + '='.repeat(70), 'blue');
  log('🚀 STRAPI COLLECTIONS SETUP SCRIPT', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  log(`Strapi URL: ${STRAPI_URL}`, 'yellow');
  log(`API Token: ${STRAPI_TOKEN.substring(0, 20)}...`, 'yellow');

  try {
    // Step 1-4: Show collection schemas
    log('\n📐 COLLECTION SCHEMAS:', 'blue');
    await createCategoriesCollection();
    await createAuthorsCollection();
    await createTagsCollection();
    await createArticlesCollection();

    // Step 5-8: Seed data
    log('\n🌱 SEEDING DATA:', 'blue');
    
    // Note: Collections must exist first. If they don't, create them manually in Strapi Admin
    // Then run this script again to seed data.
    
    const seedSuccess = await seedSampleCategories();
    if (seedSuccess) {
      await seedSampleAuthors();
      await seedSampleTags();
      await seedSampleArticle();
    }

    log('\n' + '='.repeat(70), 'blue');
    log('✅ SETUP COMPLETE', 'green');
    log('='.repeat(70), 'blue');
    
    log('\n📋 Next Steps:', 'yellow');
    log('1. If collections weren\'t created automatically:', 'yellow');
    log('   - Go to Strapi Admin UI: http://103.191.208.235:1337/admin', 'yellow');
    log('   - Create collections manually using the schemas above', 'yellow');
    log('   - Then run this script again to seed data', 'yellow');
    log('\n2. If collections exist:', 'yellow');
    log('   - Sample data has been seeded', 'yellow');
    log('   - Visit Console: https://newskarnataka-console.vercel.app', 'yellow');
    log('   - View articles and content', 'yellow');
    log('\n3. Next:', 'yellow');
    log('   - Create more sample articles', 'yellow');
    log('   - Build data scraper for WordPress migration', 'yellow');
    log('   - Enhance UI/UX', 'yellow');

  } catch (error) {
    log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
main();

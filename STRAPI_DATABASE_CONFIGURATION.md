# Strapi 5.x PostgreSQL Database Configuration
## NewsKarnataka Project - Complete Strapi Setup Guide

**Strapi Version:** 5.x  
**Database:** PostgreSQL 14+  
**Database Host:** 103.191.208.235  
**Date:** September 2026

---

## SECTION 1: STRAPI PROJECT SETUP

### 1.1 Create New Strapi Project

```bash
# Create new Strapi project
npx create-strapi-app@latest newskarnataka-cms --quickstart

# Or with custom template
npx create-strapi-app@latest newskarnataka-cms --typescript

# Change to project directory
cd newskarnataka-cms
```

### 1.2 Install PostgreSQL Driver

```bash
# Install PostgreSQL adapter
npm install pg

# Install connection string parser
npm install pg-connection-string

# Verify installation
npm list pg
```

---

## SECTION 2: DATABASE CONFIGURATION

### 2.1 Configure Database Connection

Create `config/database.js`:

```javascript
// config/database.js

const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  // Parse connection string or use individual parameters
  const connectionString = env('DATABASE_URL');
  let dbConfig = {
    host: env('DB_HOST', '103.191.208.235'),
    port: env.int('DB_PORT', 5432),
    database: env('DB_NAME', 'newskarnataka'),
    user: env('DB_USER', 'news'),
    password: env('DB_PASSWORD', 'news321'),
    ssl: env.bool('DB_SSL', true),
    schema: env('DB_SCHEMA', 'public'),
  };

  // If connection string provided, parse it
  if (connectionString) {
    const parsed = parse(connectionString);
    dbConfig = {
      host: parsed.host || dbConfig.host,
      port: parseInt(parsed.port) || dbConfig.port,
      database: parsed.database || dbConfig.database,
      user: parsed.user || dbConfig.user,
      password: parsed.password || dbConfig.password,
      ssl: dbConfig.ssl,
      schema: dbConfig.schema,
    };
  }

  return {
    connection: {
      client: 'postgres',
      connection: dbConfig,
      acquireConnectionTimeout: env.int('DB_CONNECTION_TIMEOUT', 10000),
      pool: {
        min: env.int('DB_POOL_MIN', 5),
        max: env.int('DB_POOL_MAX', 20),
        acquireTimeoutMillis: env.int('DB_ACQUIRE_TIMEOUT', 10000),
        idleTimeoutMillis: env.int('DB_IDLE_TIMEOUT', 30000),
        reapIntervalMillis: env.int('DB_REAP_INTERVAL', 1000),
      },
      debug: env.bool('DB_DEBUG', false),
      useNullAsDefault: true,
      searchPath: ['public'],
    },
    useSSL: env.bool('DB_SSL', true),
  };
};
```

### 2.2 Create .env File

Create `.env` in Strapi root:

```bash
# Database Configuration
DATABASE_URL=postgresql://news:news321@103.191.208.235:5432/newskarnataka
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_CONNECTION_TIMEOUT=10000
DB_IDLE_TIMEOUT=30000

# Strapi Core
NODE_ENV=production
STRAPI_PORT=1337
STRAPI_HOST=0.0.0.0

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
ADMIN_JWT_SECRET=your-super-secret-admin-jwt-key-change-in-production
JWT_SECRET=your-jwt-secret-key-change-in-production
API_TOKEN_SALT=your-api-token-salt-change-in-production

# Application Settings
APP_URL=http://localhost:1337
ADMIN_URL=http://localhost:1337/admin

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Feature Flags
FEATURE_AI_VALIDATION=true
FEATURE_BULK_OPERATIONS=true
FEATURE_ADVANCED_ANALYTICS=true

# Logging
LOG_LEVEL=info
ENABLE_CORS=true
```

### 2.3 Create .env.example

Create `.env.example` (for reference, no secrets):

```bash
# Copy from .env but remove actual values
DATABASE_URL=postgresql://user:password@host:5432/database
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=your_password_here
DB_NAME=newskarnataka
DB_SSL=true

# ... rest of settings
```

### 2.4 Add to .gitignore

```bash
# .gitignore
.env
.env.local
.env.*.local
.env.production.local

# Don't commit
.DS_Store
node_modules/
dist/
build/
*.log
```

---

## SECTION 3: STRAPI MIDDLEWARE CONFIGURATION

### 3.1 Configure Core Middleware

Create `config/middlewares.js`:

```javascript
// config/middlewares.js

module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];
```

### 3.2 Configure CORS

Create `config/plugins.js`:

```javascript
// config/plugins.js

module.exports = ({ env }) => ({
  'strapi-plugin-populate-middleware': {
    enabled: true,
  },
  // Additional plugin configurations
});
```

### 3.3 Configure Server

Create `config/server.js`:

```javascript
// config/server.js

module.exports = ({ env }) => ({
  host: env('STRAPI_HOST', '0.0.0.0'),
  port: env.int('STRAPI_PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('STRAPI_URL', 'http://localhost:1337'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
  api: {
    prefix: '/api',
    version: 'v1',
    responses: {
      privateAttributes: [],
    },
  },
  transfer: {
    token: {
      salt: env('API_TOKEN_SALT'),
    },
  },
});
```

---

## SECTION 4: DATABASE INITIALIZATION

### 4.1 Initialize Database

```bash
# Build Strapi
npm run build

# Start Strapi (will initialize database)
npm run develop

# Or in production
npm start
```

### 4.2 Verify Database Connection

After starting Strapi, check:

```bash
# Check if tables were created
psql -h 103.191.208.235 -U news -d newskarnataka -c "\dt"

# Should show Strapi system tables:
# - strapi_core_store_settings
# - strapi_role
# - strapi_permission
# - strapi_user
# - admin_permissions_role_links
# etc.
```

### 4.3 Create Admin User (First Time)

1. Open browser: `http://localhost:1337/admin`
2. Create admin account on first-run screen
3. Set admin email and password
4. Strapi will automatically create admin role and permissions

---

## SECTION 5: IMPORT DATABASE SCHEMA

### 5.1 Create Custom Models/Content Types in Strapi

**Option 1: Using Strapi Admin UI**

1. Go to `http://localhost:1337/admin`
2. Click "Content-type Builder" (left sidebar)
3. Create content types matching our schema:
   - Articles
   - Categories
   - Comments
   - Users
   - ArticleSources
   - ArticleSubmissions
   - etc.

**Option 2: Using SQL Migration**

```bash
# Export our schema design as SQL
psql -h 103.191.208.235 -U news -d newskarnataka < DATABASE_IMPLEMENTATION_SCRIPTS.sql

# Strapi will detect existing tables and auto-generate models
npm run strapi models:sync
```

### 5.2 Define Content Types via API

```bash
# Create Article content type
curl -X POST http://localhost:1337/admin/content-type-builder/content-types \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "contentType": {
      "displayName": "Article",
      "singularName": "article",
      "pluralName": "articles",
      "kind": "collectionType",
      "attributes": {
        "title": {
          "type": "string",
          "required": true
        },
        "content": {
          "type": "richtext",
          "required": true
        },
        "excerpt": {
          "type": "string"
        },
        "status": {
          "type": "enumeration",
          "enum": ["draft", "published", "archived"]
        },
        "category": {
          "type": "relation",
          "relation": "manyToOne",
          "target": "api::category.category"
        }
      }
    }
  }'
```

---

## SECTION 6: PLUGIN CONFIGURATION

### 6.1 Install Essential Plugins

```bash
# Search plugin
npm install @strapi/plugin-search-api

# Google Auth plugin
npm install @strapi/plugin-cloud

# Webhooks plugin (built-in)
# No installation needed

# Custom plugins
npm install @strapi/plugin-users-permissions
```

### 6.2 Enable Plugins in `config/plugins.js`

```javascript
// config/plugins.js

module.exports = ({ env }) => ({
  'search-api': {
    enabled: true,
  },
  'users-permissions': {
    enabled: true,
    resolve: './src/plugins/users-permissions',
  },
  'content-releases': {
    enabled: true,
  },
  'graphql': {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
    },
  },
});
```

---

## SECTION 7: CUSTOM EXTENSIONS FOR ARTICLE WORKFLOW

### 7.1 Create Article Service with Workflow

Create `src/api/article/services/article.js`:

```javascript
// src/api/article/services/article.js

'use strict';

/**
 * article service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  
  // Submit article for review
  async submitForReview(id, data) {
    const article = await strapi.entityService.update('api::article.article', id, {
      data: {
        ...data,
        status: 'submitted',
        submitted_at: new Date(),
      },
    });
    
    // Trigger AI validation workflow
    await this.validateWithAI(article);
    
    return article;
  },

  // Validate article with Groq AI
  async validateWithAI(article) {
    try {
      // Call Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{
            role: 'user',
            content: `Validate this news article for quality, accuracy, and bias. Return a JSON with confidence_score (0-1) and verdict (green/yellow/red/black):\n\nTitle: ${article.title}\nContent: ${article.content}`,
          }],
        }),
      });

      const result = await groqResponse.json();
      const validation = JSON.parse(result.choices[0].message.content);

      // Update article with AI validation result
      await strapi.entityService.update('api::article.article', article.id, {
        data: {
          ai_validation_result: validation.verdict,
          ai_confidence_score: validation.confidence_score,
          ai_validation_at: new Date(),
        },
      });

      // Auto-approve if high confidence
      if (validation.verdict === 'green' && validation.confidence_score > 0.85) {
        await this.autoApprove(article.id);
      }

      return validation;
    } catch (error) {
      console.error('AI validation error:', error);
      throw error;
    }
  },

  // Auto-approve article
  async autoApprove(id) {
    return strapi.entityService.update('api::article.article', id, {
      data: {
        status: 'approved',
        approved_at: new Date(),
        approved_by: 'system_ai',
      },
    });
  },

  // Publish article
  async publishArticle(id) {
    return strapi.entityService.update('api::article.article', id, {
      data: {
        status: 'published',
        published_at: new Date(),
      },
    });
  },
}));
```

### 7.2 Create Article Controller with Workflow Endpoints

Create `src/api/article/controllers/article.js`:

```javascript
// src/api/article/controllers/article.js

'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  
  // Submit for review endpoint
  async submitForReview(ctx) {
    try {
      const { id } = ctx.params;
      const article = await strapi.service('api::article.article').submitForReview(id, {
        submitted_by: ctx.state.user.id,
      });
      ctx.body = { data: article };
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },

  // Publish endpoint
  async publish(ctx) {
    try {
      const { id } = ctx.params;
      
      // Check permission
      if (!ctx.state.user.roles.some(r => ['editor', 'admin'].includes(r.name))) {
        return ctx.throw(403, 'Not authorized to publish');
      }

      const article = await strapi.service('api::article.article').publishArticle(id);
      ctx.body = { data: article };
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },

  // Get pending reviews
  async pendingReviews(ctx) {
    const articles = await strapi.entityService.findMany('api::article.article', {
      filters: { status: { $eq: 'submitted' } },
      sort: { created_at: 'desc' },
      pagination: ctx.query.pagination || { limit: 10, offset: 0 },
    });
    ctx.body = { data: articles };
  },
}));
```

### 7.3 Register Custom Routes

Create `src/api/article/routes/article.js`:

```javascript
// src/api/article/routes/article.js

'use strict';

/**
 * article router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::article.article');

const customRoutes = [
  {
    method: 'POST',
    path: '/articles/:id/submit-for-review',
    handler: 'api::article.article.submitForReview',
    config: {
      policies: ['api::article.policies.canSubmitArticles'],
    },
  },
  {
    method: 'POST',
    path: '/articles/:id/publish',
    handler: 'api::article.article.publish',
    config: {
      policies: ['api::article.policies.canPublishArticles'],
    },
  },
  {
    method: 'GET',
    path: '/articles/pending-reviews',
    handler: 'api::article.article.pendingReviews',
    config: {
      policies: ['api::article.policies.canReviewArticles'],
    },
  },
];

module.exports = {
  routes: [
    ...defaultRouter,
    ...customRoutes,
  ],
};
```

---

## SECTION 8: PERMISSIONS & ROLE SETUP

### 8.1 Create Roles in Strapi

```javascript
// Script to create roles via API
const createRoles = async () => {
  const roles = [
    { name: 'Super Admin', description: 'Full system access' },
    { name: 'Admin', description: 'Administrative access' },
    { name: 'Editor', description: 'Create and publish content' },
    { name: 'Reviewer', description: 'Review and approve submissions' },
    { name: 'Contributor', description: 'Create content for review' },
    { name: 'Viewer', description: 'Read-only access' },
  ];

  for (const role of roles) {
    await strapi.service('plugin::users-permissions.role').createRole({
      name: role.name,
      description: role.description,
      type: 'custom',
    });
  }
};
```

### 8.2 Assign Permissions to Roles

Use Strapi admin panel:
1. Go to Settings → User & Permission Plugin → Roles
2. Create roles for: Admin, Editor, Reviewer, Contributor, Viewer
3. For each role, assign permissions for:
   - Articles (read, create, update, delete, publish)
   - Submissions (review, approve)
   - Comments (moderate)
   - Analytics (read)
   - Users (manage - admin only)

---

## SECTION 9: DEPLOYMENT CONFIGURATION

### 9.1 Production Build

```bash
# Build for production
npm run build

# Start in production
NODE_ENV=production npm start
```

### 9.2 Environment-Specific Configuration

Create `config/env/production/database.js`:

```javascript
// config/env/production/database.js

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DB_HOST'),
      port: env.int('DB_PORT'),
      database: env('DB_NAME'),
      user: env('DB_USER'),
      password: env('DB_PASSWORD'),
      ssl: true,
      schema: 'public',
    },
    pool: {
      min: 10,
      max: 50,
      acquireTimeoutMillis: 10000,
      idleTimeoutMillis: 60000,
    },
    debug: false,
  },
});
```

### 9.3 Docker Production Image

```dockerfile
# Dockerfile

FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app
COPY . .

# Build Strapi
RUN npm run build

# Expose port
EXPOSE 1337

# Start Strapi
CMD ["npm", "start"]
```

---

## SECTION 10: MIGRATION FROM WORDPRESS

### 10.1 Prepare WordPress Data Export

```bash
# Export WordPress database
mysqldump -u wordpress_user -p wordpress_database > wordpress_backup.sql

# Or use WordPress plugins:
# - All-in-One WP Migration
# - Duplicator
# - UpdraftPlus
```

### 10.2 Create Migration Script

Create `scripts/migrate-wordpress.js`:

```javascript
// scripts/migrate-wordpress.js

const migrationService = {
  async migrateArticles() {
    // Connect to WordPress database
    // Map WordPress posts to Strapi articles
    // Copy content, categories, tags, media
    // Generate UUIDs for all records
  },

  async migrateUsers() {
    // Migrate WordPress users to Strapi
    // Assign roles based on WordPress capabilities
    // Hash passwords if needed
  },

  async migrateComments() {
    // Migrate WordPress comments to Strapi
    // Link to corresponding articles
  },

  async migrateMedia() {
    // Download WordPress media files
    // Upload to S3/storage
    // Update references in articles
  },
};

// Execute migration
migrationService.migrateArticles()
  .then(() => migrationService.migrateUsers())
  .then(() => migrationService.migrateComments())
  .then(() => migrationService.migrateMedia())
  .catch(error => console.error('Migration failed:', error));
```

---

## SECTION 11: TROUBLESHOOTING

### Issue 1: Connection Error

```bash
# Check database connectivity
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Check .env file exists and has correct values
cat .env | grep DB_

# Clear Strapi cache
rm -rf .strapi-updater.json
rm -rf .cache
```

### Issue 2: Tables Not Found

```bash
# Strapi auto-creates tables on first run
# If tables still missing, manually create them:

psql -h 103.191.208.235 -U news -d newskarnataka < DATABASE_IMPLEMENTATION_SCRIPTS.sql

# Then restart Strapi:
npm run develop
```

### Issue 3: JWT Secret Errors

```bash
# Regenerate JWT secrets
# In .env, set new values:
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)

# Restart Strapi
npm run develop
```

---

## QUICK REFERENCE

### Start Strapi
```bash
npm run develop    # Development mode
npm start          # Production mode
```

### Database Connection String
```
postgresql://news:news321@103.191.208.235:5432/newskarnataka
```

### Admin URL
```
http://localhost:1337/admin
```

### Health Check Endpoint
```
curl http://localhost:1337/health
```

### API Documentation (OpenAPI/Swagger)
```
http://localhost:1337/documentation
```

---

**Status:** ✅ **STRAPI CONFIGURATION COMPLETE**

Ready for:
- Local development
- Content type creation
- User role setup
- Article workflow implementation
- Migration from WordPress
- Production deployment


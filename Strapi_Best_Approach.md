# 📘 STRAPI BEST APPROACH GUIDE
## NewsKarnataka.com - Deployment & Customization Strategy

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Status:** Approved for Production Use  
**Decision:** Use NPM Package Approach + Docker Deployment  

---

## 🎯 EXECUTIVE SUMMARY

This document defines the official strategy for using Strapi in the NewsKarnataka.com project. 

**Official Decision:**
- ✅ Install Strapi via `npm install` (NOT GitHub clone)
- ✅ Customize via `src/` directory extension points
- ✅ Deploy via Docker containers to AWS
- ✅ Manage updates via `npm update`
- ✅ No modification of Strapi core files needed

**Why This Approach:**
- 🎯 Simplest setup (5 minutes)
- 🎯 Professional & scalable
- 🎯 Easy maintenance & updates
- 🎯 Production-ready out of the box
- 🎯 Perfect for startup-scale projects
- 🎯 What industry uses

---

## 📚 TABLE OF CONTENTS

1. [Strapi Architecture Overview](#strapi-architecture-overview)
2. [Three Ways to Use Strapi](#three-ways-to-use-strapi)
3. [Recommended Approach (NPM Package)](#recommended-approach-npm-package)
4. [Current Project Setup](#current-project-setup)
5. [Customization Without Modifying Core](#customization-without-modifying-core)
6. [Deployment Strategy](#deployment-strategy)
7. [Update & Maintenance](#update--maintenance)
8. [Common Customizations](#common-customizations)
9. [Production Checklist](#production-checklist)
10. [Troubleshooting](#troubleshooting)
11. [FAQ](#faq)
12. [Decision Matrix](#decision-matrix)

---

## 🏗️ STRAPI ARCHITECTURE OVERVIEW

### What is Strapi?

Strapi is an open-source headless CMS built with Node.js. It provides:
- RESTful API endpoints (what you're using)
- GraphQL API (optional)
- User authentication & authorization
- Role-based access control (RBAC)
- Content type builder
- Admin panel
- Plugin ecosystem
- Built-in extensibility

### How Strapi Works

```
┌─────────────────────────────────────┐
│         Frontend Apps               │
│  (React, Next.js, Mobile, etc)     │
└──────────────┬──────────────────────┘
               │
         HTTP/REST/GraphQL
               │
┌──────────────▼──────────────────────┐
│      Strapi CMS (Your Server)      │
│  ├─ API Routes                     │
│  ├─ Controllers                    │
│  ├─ Services                       │
│  ├─ Models/Content Types           │
│  ├─ Admin Panel                    │
│  └─ Plugins                        │
└──────────────┬──────────────────────┘
               │
        Database (PostgreSQL)
```

### Strapi File Structure

```
Strapi Core (in node_modules)
├── API Framework
├── Admin Interface
├── Plugin System
├── Built-in Plugins
└── Core Utilities

Your Custom Code (in src/)
├── Content Type APIs
├── Custom Controllers
├── Business Logic
├── Policies (Permissions)
├── Middleware
└── Plugins
```

---

## 🔄 THREE WAYS TO USE STRAPI

### 📦 **OPTION 1: NPM PACKAGE (RECOMMENDED) ✅**

**What it is:**
- Install Strapi as an npm dependency
- Strapi core downloaded into `node_modules/`
- Runs from pre-built binaries
- Customize via `src/` directory

**Installation:**
```bash
# Option A: Create new project
npx create-strapi-app newskarnataka-cms --quickstart

# Option B: Install in existing project
cd newskarnataka-cms
npm install @strapi/strapi @strapi/plugin-users-permissions
```

**Running:**
```bash
# Development (with hot reload)
npm run develop

# Production (optimized)
npm run build
npm start
```

**Project Structure:**
```
newskarnataka-cms/
├── node_modules/
│   └── @strapi/             # ← Strapi code here
├── config/                  # ← Configuration
├── src/
│   ├── api/                 # ← Your content types
│   ├── policies/            # ← Your permissions
│   ├── middlewares/         # ← Custom middleware
│   ├── extensions/          # ← Strapi extensions
│   ├── plugins/             # ← Custom plugins
│   └── index.ts             # ← App entry
├── public/                  # ← Static files
├── .env                     # ← Environment variables
├── package.json             # ← Dependencies
├── docker-compose.yml       # ← Local dev services
└── Dockerfile               # ← Production container
```

**Pros:**
- ✅ Simplest setup (5 minutes)
- ✅ No source code management needed
- ✅ Auto-downloaded binaries
- ✅ Easy to update (`npm update`)
- ✅ Professional approach
- ✅ Industry standard

**Cons:**
- ❌ Can't modify Strapi core (not needed)
- ❌ Limited to extension points
- ❌ Larger bundle (but acceptable)

**When to Use:**
- ✅ Startups & SMBs
- ✅ Most projects
- ✅ Time-sensitive launches
- ✅ Team with Node.js knowledge
- ✅ Cloud deployments

---

### 🐙 **OPTION 2: CLONE FROM GITHUB (NOT RECOMMENDED) ❌**

**What it is:**
- Download full Strapi source code from GitHub
- 2GB+ repository
- Customize by modifying core files
- Build from source each time

**Installation:**
```bash
# Clone repository
git clone https://github.com/strapi/strapi.git newskarnataka-cms
cd newskarnataka-cms

# Install dependencies
npm install

# Build from source
npm run build

# Run
npm start
```

**Project Structure:**
```
strapi/                     # ← Full GitHub repo
├── packages/               # ← Strapi source code
│   ├── core/
│   ├── plugins/
│   └── utils/
├── tests/
├── node_modules/
└── package.json
```

**Pros:**
- ✅ Full access to source code
- ✅ Can modify core (if absolutely needed)
- ✅ Good for deep customization

**Cons:**
- ❌ Complex setup (30+ minutes)
- ❌ 2GB+ repository size
- ❌ Build takes time
- ❌ Updates very complicated
- ❌ Git conflicts when merging updates
- ❌ Requires expertise
- ❌ Not recommended for most projects

**When to Use:**
- ✅ Only if you MUST modify Strapi core
- ✅ Enterprise with dedicated team
- ✅ Custom Strapi distribution
- ✅ Contributing to Strapi project

**⚠️ NOT RECOMMENDED FOR YOUR PROJECT**

---

### 🐳 **OPTION 3: DOCKER CONTAINER (BEST FOR PRODUCTION)**

**What it is:**
- Run Strapi inside a Docker container
- Can use npm approach + Docker
- Consistent across dev/staging/production
- Easy scaling and deployment

**Dockerfile (Using NPM Approach):**
```dockerfile
# Use official Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (includes Strapi from npm)
RUN npm ci --only=production

# Copy custom code
COPY . .

# Build Strapi
RUN npm run build

# Expose Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "start"]
```

**Build & Run:**
```bash
# Build image
docker build -t newskarnataka-cms:latest .

# Run locally
docker run -p 1337:1337 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your-secret \
  newskarnataka-cms:latest

# Push to AWS ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI
docker tag newskarnataka-cms:latest $ECR_URI/newskarnataka-cms:latest
docker push $ECR_URI/newskarnataka-cms:latest

# Deploy to AWS ECS/EC2
docker pull $ECR_URI/newskarnataka-cms:latest
docker run -d -p 1337:1337 $ECR_URI/newskarnataka-cms:latest
```

**Pros:**
- ✅ Consistent across environments
- ✅ Easy horizontal scaling
- ✅ Cloud-native deployment
- ✅ CI/CD friendly
- ✅ Environment isolation

**Cons:**
- ❌ Requires Docker knowledge
- ❌ Slightly slower startup
- ❌ Larger image size

**When to Use:**
- ✅ Production deployments
- ✅ Cloud platforms (AWS, Azure, GCP)
- ✅ Kubernetes orchestration
- ✅ CI/CD pipelines

---

## ✅ RECOMMENDED APPROACH (NPM PACKAGE)

**Official Decision for NewsKarnataka.com:**

Use **Option 1 (NPM Package) + Option 3 (Docker)** for production.

```
Development → npm install → Local testing
Production  → npm install → Docker → AWS
```

### Why NPM Package?

| Criterion | Score | Reason |
|-----------|-------|--------|
| Setup Speed | ⭐⭐⭐⭐⭐ | 5 minutes |
| Maintainability | ⭐⭐⭐⭐⭐ | Standard npm management |
| Production Ready | ⭐⭐⭐⭐⭐ | Industry standard |
| Update Path | ⭐⭐⭐⭐⭐ | `npm update` simplicity |
| Team Knowledge | ⭐⭐⭐⭐ | All Node devs know npm |
| Customization | ⭐⭐⭐⭐ | Extension points sufficient |
| Total Score | 27/30 | RECOMMENDED ✅ |

### Why NOT GitHub Clone?

- ❌ Unnecessary complexity
- ❌ Update nightmare (git conflicts)
- ❌ Source code management burden
- ❌ Team expertise overhead
- ❌ No benefit for standard customization

---

## 📁 CURRENT PROJECT SETUP

### Your Current Structure (Correct!)

```
C:\Users\rajku\newskarnataka-dev\newskarnataka-cms\
├── node_modules/
│   ├── @strapi/              # ← Strapi installed via npm
│   ├── @strapi/strapi/
│   ├── @strapi/plugin-users-permissions/
│   ├── @strapi/plugin-i18n/
│   └── ... (1534+ packages)
├── config/
│   ├── server.js             # ← Server config
│   ├── database.js           # ← Database config
│   └── admin.js              # ← Admin panel config
├── src/
│   ├── api/                  # ← YOUR CONTENT TYPES
│   │   ├── article/
│   │   │   ├── content-types/article/
│   │   │   │   └── schema.json
│   │   │   ├── controllers/
│   │   │   │   └── article.ts
│   │   │   ├── services/
│   │   │   │   └── article.ts
│   │   │   └── routes/
│   │   │       └── article.ts
│   │   ├── category/
│   │   ├── comment/
│   │   ├── user/
│   │   └── approval-workflow/
│   ├── extensions/           # ← YOUR EXTENSIONS
│   │   └── users-permissions/
│   ├── policies/             # ← YOUR PERMISSIONS
│   │   ├── is-reviewer.ts
│   │   ├── is-admin.ts
│   │   └── can-approve.ts
│   ├── middlewares/          # ← CUSTOM MIDDLEWARE
│   │   ├── logger.ts
│   │   └── rate-limit.ts
│   └── index.ts              # ← App entry point
├── public/
│   └── uploads/              # ← User uploads
├── .env                      # ← Environment variables
├── .env.example
├── package.json              # ← Dependencies (Strapi in here)
├── package-lock.json
├── docker-compose.yml        # ← Local PostgreSQL + Redis
├── Dockerfile                # ← Production image
├── DATABASE_SCHEMA.sql       # ← Schema file
├── execute-schema.js         # ← Setup script
└── verify-db-connection.js   # ← Verification script
```

### What's in node_modules/@strapi/?

```
node_modules/@strapi/
├── strapi/                   # Core Strapi framework
├── plugin-users-permissions/ # User authentication
├── plugin-i18n/              # Internationalization
├── plugin-upload/            # File uploads
├── database/                 # Database utilities
├── utils/                    # Helper utilities
└── ... (many more)
```

**Key Point:** You DON'T modify files in `node_modules/`. You extend Strapi via `src/`.

---

## 🔧 CUSTOMIZATION WITHOUT MODIFYING CORE

### ✅ Approved Customization Methods

#### 1. Create Custom Content Types (Preferred)

```typescript
// src/api/article/content-types/article/schema.json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article",
    "description": "News articles with approval workflow"
  },
  "options": {
    "increments": true,
    "timestamps": ["createdAt", "updatedAt"],
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "content": {
      "type": "richtext",
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["submitted", "ai_validating", "pending_approval", "published"],
      "default": "submitted"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "articles"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    }
  }
}
```

#### 2. Create Custom Controllers

```typescript
// src/api/article/controllers/article.ts
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  {
    // Override default find action
    async find(ctx) {
      // Add custom logic
      console.log("Finding articles...");
      return super.find(ctx);
    },

    // Add custom action
    async getTrending(ctx) {
      const articles = await strapi.db.query("api::article.article")
        .findMany({
          orderBy: { views: "desc" },
          limit: 5,
          where: { status: "published" },
        });

      return articles;
    },

    // Custom approval action
    async approveArticle(ctx) {
      const { id } = ctx.params;
      const article = await strapi
        .service("api::article.article")
        .findOne(id);

      if (!article) {
        return ctx.notFound();
      }

      if (article.status !== "pending_approval") {
        return ctx.badRequest("Article not in pending approval state");
      }

      article.status = "published";
      article.approvedAt = new Date();
      article.approvedBy = ctx.state.user.id;

      await strapi
        .service("api::article.article")
        .update(id, article);

      return article;
    },
  }
);
```

#### 3. Create Custom Routes

```typescript
// src/api/article/routes/article.ts
export default {
  routes: [
    {
      method: "GET",
      path: "/articles/trending",
      handler: "article.getTrending",
      config: {
        policies: ["is-public"],
      },
    },
    {
      method: "POST",
      path: "/articles/:id/approve",
      handler: "article.approveArticle",
      config: {
        policies: ["is-authenticated", "can-approve"],
      },
    },
    {
      method: "POST",
      path: "/articles/:id/share",
      handler: "article.shareArticle",
      config: {
        policies: ["is-authenticated"],
      },
    },
  ],
};
```

#### 4. Create Custom Services

```typescript
// src/api/article/services/article.ts
import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::article.article",
  {
    async publishArticle(id) {
      const article = await this.findOne(id);

      if (article.status !== "pending_approval") {
        throw new Error("Article not ready for publishing");
      }

      // Send notification to subscribers
      await strapi
        .service("api::notification.notification")
        .notifyNewArticle(article);

      // Increment publish count
      await strapi.db.query("api::article.article")
        .update({
          where: { id },
          data: { status: "published", publishedAt: new Date() },
        });

      return this.findOne(id);
    },

    async getAnalytics(id) {
      const article = await this.findOne(id);

      return {
        title: article.title,
        views: article.views || 0,
        likes: article.likes || 0,
        comments: (article.comments || []).length,
        shares: article.shares || 0,
        engagement: {
          rate: ((article.likes || 0) / (article.views || 1)) * 100,
          avgTimeOnPage: article.avgTimeOnPage || 0,
        },
      };
    },
  }
);
```

#### 5. Create Custom Policies (Permissions)

```typescript
// src/policies/can-approve.ts
export default async (policyContext, config) => {
  const user = policyContext.state.user;

  if (!user) {
    return false;
  }

  // Check if user has Reviewer or Admin role
  const hasRole = user.role?.name === "Reviewer" || user.role?.name === "Admin";

  if (!hasRole) {
    return false;
  }

  return true;
};

// src/policies/is-admin.ts
export default async (policyContext, config) => {
  const user = policyContext.state.user;

  if (!user) {
    return false;
  }

  return user.role?.name === "Admin";
};

// src/policies/is-public.ts
export default async (policyContext, config) => {
  return true; // Allow all
};
```

#### 6. Create Custom Middleware

```typescript
// src/middlewares/custom-logger.ts
export default (options) => {
  return async (ctx, next) => {
    const start = Date.now();

    console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.path}`);

    await next();

    const duration = Date.now() - start;
    console.log(`Response: ${ctx.status} (${duration}ms)`);
  };
};

// src/middlewares/rate-limiter.ts
const limits = new Map();

export default (options) => {
  const { windowMs = 60000, maxRequests = 100 } = options;

  return async (ctx, next) => {
    const userId = ctx.state.user?.id || ctx.ip;
    const now = Date.now();

    if (!limits.has(userId)) {
      limits.set(userId, []);
    }

    const userRequests = limits.get(userId);
    const recentRequests = userRequests.filter(
      (time) => now - time < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      return ctx.throw(429, "Too many requests");
    }

    recentRequests.push(now);
    limits.set(userId, recentRequests);

    await next();
  };
};
```

#### 7. Extend Built-in Plugins

```typescript
// src/extensions/users-permissions/content-types/user/schema.json
{
  "kind": "collectionType",
  "collectionName": "up_users",
  "attributes": {
    "email": {
      "type": "email",
      "required": true,
      "unique": true
    },
    "username": {
      "type": "string",
      "unique": true,
      "configurable": false,
      "searchable": true
    },
    "provider": {
      "type": "string",
      "configurable": false
    },
    "confirmed": {
      "type": "boolean",
      "default": false,
      "configurable": false
    },
    "blocked": {
      "type": "boolean",
      "default": false,
      "configurable": false
    },
    "role": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.role",
      "inversedBy": "users"
    },
    "phoneNumber": {
      "type": "string",
      "unique": true
    },
    "department": {
      "type": "string"
    },
    "isVerified": {
      "type": "boolean",
      "default": false
    },
    "articles": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::article.article",
      "mappedBy": "author"
    }
  }
}
```

#### 8. Create Custom Plugins

```typescript
// src/plugins/custom-analytics/strapi-server.ts
export default (plugin) => {
  plugin.routes = {
    "content-api": {
      type: "content-api",
      routes: [
        {
          method: "GET",
          path: "/analytics/trending",
          handler: "analytics.getTrending",
        },
      ],
    },
  };

  plugin.controllers = {
    analytics: {
      async getTrending(ctx) {
        const articles = await strapi.db
          .query("api::article.article")
          .findMany({
            orderBy: { views: "desc" },
            limit: 10,
          });

        return articles;
      },
    },
  };

  return plugin;
};
```

### ❌ DO NOT DO THESE

```typescript
// ❌ DON'T modify node_modules files
// Don't edit: node_modules/@strapi/strapi/...

// ❌ DON'T clone and modify GitHub repo
// Don't do: git clone strapi/strapi

// ❌ DON'T modify core Strapi config directly
// This might work but breaks on updates

// ❌ DON'T bypass extension points
// Always use src/ directory structure
```

---

## 🚀 DEPLOYMENT STRATEGY

### Development Workflow

```bash
# 1. Development with hot reload
npm run develop

# Opens admin panel at http://localhost:1337/admin
# Opens API at http://localhost:1337/api/
# Changes auto-reload (in src/)

# 2. Test locally
npm run build
npm start

# 3. Deploy to staging
git push origin feature-branch
# CI/CD pipeline runs tests
# Deploys to staging environment

# 4. Deploy to production
git merge to main
git push
# CI/CD pipeline runs full test suite
# Builds Docker image
# Pushes to AWS ECR
# Deploys to AWS ECS/EC2
```

### Production Deployment Steps

#### Step 1: Prepare Production Build

```bash
cd newskarnataka-cms

# Install dependencies
npm install --production

# Build for production
npm run build

# Verify build
npm start
# Should see: Strapi server running at http://localhost:1337
```

#### Step 2: Create Docker Image

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies (includes Strapi)
RUN npm ci --only=production

# Copy your custom code
COPY . .

# Build Strapi production bundle
RUN npm run build

# Expose Strapi port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/admin || exit 1

# Start Strapi
CMD ["npm", "start"]
```

#### Step 3: Build & Test Locally

```bash
# Build Docker image
docker build -t newskarnataka-cms:latest .

# Test image locally
docker run -d \
  --name newskarnataka-test \
  -p 1337:1337 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret-key" \
  -e ADMIN_JWT_SECRET="admin-secret-key" \
  newskarnataka-cms:latest

# Check logs
docker logs newskarnataka-test

# Test API
curl http://localhost:1337/api/articles

# Stop & remove
docker stop newskarnataka-test
docker rm newskarnataka-test
```

#### Step 4: Push to AWS ECR

```bash
# Get AWS ECR login
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag newskarnataka-cms:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest
```

#### Step 5: Deploy to AWS EC2/ECS

**Option A: EC2 with Docker Compose**

```bash
# SSH to EC2 instance
ssh -i key.pem ec2-user@instance-ip

# Pull latest image
docker pull $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

# Stop old container
docker stop newskarnataka-cms || true

# Run new container
docker run -d \
  --name newskarnataka-cms \
  -p 1337:1337 \
  --restart unless-stopped \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  -e NODE_ENV="production" \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

# Check status
docker ps
```

**Option B: AWS ECS**

```bash
# Create ECS task definition
aws ecs register-task-definition \
  --family newskarnataka-cms \
  --container-definitions '[
    {
      "name": "newskarnataka-cms",
      "image": "'$AWS_ACCOUNT_ID'.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest",
      "portMappings": [{"containerPort": 1337}],
      "environment": [
        {"name": "DATABASE_URL", "value": "postgresql://..."},
        {"name": "JWT_SECRET", "value": "..."},
        {"name": "NODE_ENV", "value": "production"}
      ]
    }
  ]'

# Update ECS service
aws ecs update-service \
  --cluster newskarnataka-cluster \
  --service newskarnataka-cms-service \
  --force-new-deployment
```

#### Step 6: Setup Monitoring & Logs

```bash
# CloudWatch logs
docker run ... \
  --log-driver awslogs \
  --log-opt awslogs-group=/ecs/newskarnataka-cms \
  --log-opt awslogs-region=us-east-1 \
  ...

# Environment file on EC2
cat > /app/.env << EOF
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/db
JWT_SECRET=your-secret
ADMIN_JWT_SECRET=admin-secret
NODE_ENV=production
EOF
```

---

## 🔄 UPDATE & MAINTENANCE

### Updating Strapi

```bash
# Check current version
npm list @strapi/strapi

# Update to latest
npm update @strapi/strapi

# Or update to specific version
npm install @strapi/strapi@4.25.0

# Rebuild
npm run build

# Test locally
npm start

# Deploy new version
docker build -t newskarnataka-cms:latest .
docker push ...
```

### What Happens During Updates

1. ✅ npm downloads new version to `node_modules/`
2. ✅ Your code in `src/` remains unchanged
3. ✅ Strapi migrations run automatically
4. ✅ Extension compatibility checked
5. ✅ Database schema updated if needed

### Backup Before Update

```bash
# Backup database
pg_dump -U postgres newskarnataka > backup-before-update.sql

# Backup environment
cp .env .env.backup

# Backup docker compose state
docker-compose down
docker-compose up -d  # Back to previous state if needed
```

### Troubleshooting Update Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Strapi cache
rm -rf .strapi

# Rebuild
npm run build

# Check for errors
npm start
```

---

## 📋 COMMON CUSTOMIZATIONS

### 1. Add Custom Fields to User

Already covered in extensions section above.

### 2. Add Email Notification Service

```typescript
// src/api/notification/services/notification.ts
export default {
  async sendWelcomeEmail(user) {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "noreply@newskarnataka.com",
      to: user.email,
      subject: "Welcome to NewsKarnataka",
      html: `<h1>Welcome ${user.username}!</h1>`,
    });
  },
};
```

### 3. Add File Upload Handler

```typescript
// src/api/article/controllers/article.ts
async createWithFile(ctx) {
  const file = ctx.request.files.file;
  const entry = ctx.request.body;

  // Upload file
  const uploaded = await strapi.plugins.upload.services.upload.upload({
    files: file,
  });

  entry.featuredImage = uploaded[0].id;

  return this.create(ctx);
}
```

### 4. Add API Key Authentication

```typescript
// src/policies/api-key.ts
export default async (policyContext, config) => {
  const apiKey = policyContext.request.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return false;
  }

  return true;
};
```

### 5. Add Rate Limiting

Already shown in middleware section above.

### 6. Add Caching

```typescript
// src/api/article/services/article.ts
async getWithCache(id) {
  const cacheKey = `article-${id}`;

  // Check Redis cache
  const cached = await strapi.redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Get from database
  const article = await this.findOne(id);

  // Cache for 1 hour
  await strapi.redis.set(cacheKey, JSON.stringify(article), "EX", 3600);

  return article;
}
```

---

## ✅ PRODUCTION CHECKLIST

Before deploying to production (Sept 22):

### Environment
- [ ] NODE_ENV=production
- [ ] DATABASE_URL points to production RDS
- [ ] JWT_SECRET is strong (random 32+ chars)
- [ ] ADMIN_JWT_SECRET is strong
- [ ] All secrets in environment variables (.env)
- [ ] No secrets in code or git

### Database
- [ ] PostgreSQL 14+ running
- [ ] All migrations applied
- [ ] Database backups configured
- [ ] Replication working (if needed)
- [ ] SSL/TLS enabled for DB connection

### Performance
- [ ] npm run build completes successfully
- [ ] Build size is reasonable
- [ ] Response time <150ms
- [ ] Memory usage <500MB
- [ ] CPU usage <50%

### Security
- [ ] HTTPS/SSL enabled
- [ ] CORS configured correctly
- [ ] SQL injection protection active
- [ ] XSS protection enabled
- [ ] CSRF tokens working
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

### Monitoring
- [ ] CloudWatch logs active
- [ ] Error tracking enabled
- [ ] Health check endpoint working
- [ ] Alerts configured for errors
- [ ] Alerting for high CPU/memory

### Deployment
- [ ] Docker image builds
- [ ] ECR push works
- [ ] ECS deployment configured
- [ ] Load balancer health checks
- [ ] SSL certificate valid

### Testing
- [ ] All API endpoints tested
- [ ] Authentication flows tested
- [ ] Permission policies tested
- [ ] Error handling tested
- [ ] Load testing completed

### Documentation
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Custom policies documented
- [ ] Deployment procedure documented
- [ ] Rollback procedure documented

---

## 🔧 TROUBLESHOOTING

### Issue: Module not found errors

```bash
# Solution
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Port 1337 already in use

```bash
# Find process using port
lsof -i :1337

# Kill process
kill -9 <PID>

# Or change port
PORT=1338 npm start
```

### Issue: Database connection fails

```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check env variables
cat .env | grep DATABASE_URL
```

### Issue: Admin panel not loading

```bash
# Clear cache
rm -rf .strapi

# Rebuild
npm run build
npm start
```

### Issue: Custom API not responding

```bash
# Check routes exist
ls src/api/article/routes/

# Check controller exists
ls src/api/article/controllers/

# Check logs
npm start  # Run in foreground to see logs
```

---

## ❓ FAQ

### Q: Do I need to download Strapi source code?
**A:** No! Using npm install is the correct approach. You never need the GitHub source code unless you're contributing to Strapi itself.

### Q: Can I modify Strapi core?
**A:** Not recommended. Use extension points in `src/` instead. If you absolutely must modify core, you would need to clone from GitHub, which is complex.

### Q: How do I update Strapi?
**A:** Simply run `npm update @strapi/strapi` and rebuild. Your code in `src/` won't break.

### Q: What if I need a feature Strapi doesn't have?
**A:** Create a custom controller, service, or middleware in `src/`. This is the proper way.

### Q: Can I run Strapi in production?
**A:** Yes! npm install + Docker + AWS is the recommended approach for production.

### Q: How do I backup my Strapi database?
**A:** Use `pg_dump` for PostgreSQL backups. Configure automatic backups in RDS.

### Q: What about Strapi GraphQL?
**A:** Optional. Install `@strapi/plugin-graphql` if needed. You're currently using REST API.

### Q: How do I handle database migrations?
**A:** Strapi handles migrations automatically when you change content types. Test in staging first.

### Q: What's the performance overhead of npm packages?
**A:** Negligible. npm packages are pre-built binaries. No performance cost compared to GitHub clone.

### Q: Can I run multiple Strapi instances?
**A:** Yes. Use a load balancer and share the same database. Configure properly in config/.

### Q: What about environment-specific configs?
**A:** Create `.env.production`, `.env.staging`, etc. Use `NODE_ENV` variable.

---

## 📊 DECISION MATRIX

**Question:** Which Strapi approach should I use?

| Your Situation | Answer | Reason |
|---|---|---|
| I'm building a startup | NPM ✅ | Fastest, simplest, production-ready |
| I need production deployment | NPM + Docker ✅ | Industry standard |
| I need to modify Strapi core | GitHub Clone ⚠️ | Only if absolutely necessary |
| I want quick development | NPM ✅ | Hot reload, easy updates |
| I need to scale horizontally | NPM + Docker ✅ | Cloud-native, container-ready |
| I have limited DevOps expertise | NPM ✅ | Minimal DevOps knowledge needed |
| I want community support | NPM ✅ | More people use this approach |
| I'm contributing to Strapi | GitHub Clone ✅ | Proper approach for contribution |

---

## 🎯 CONCLUSION

**For NewsKarnataka.com:**

✅ **Use NPM Package approach**
- Install Strapi via `npm install`
- Customize via `src/` directory
- Deploy via Docker containers
- Update via `npm update`

✅ **Benefits:**
- Simple (5 min setup)
- Scalable
- Production-ready
- Easy maintenance
- Industry standard
- No source code burden

❌ **Never:**
- Clone from GitHub
- Modify node_modules
- Try to fork Strapi
- Break encapsulation

**Result:**
Clean, maintainable codebase ready for production launch September 22, 2026.

---

## 📞 SUPPORT & QUESTIONS

For questions about this approach:
1. Review this document
2. Check [Strapi Documentation](https://docs.strapi.io)
3. Consult team leads
4. File GitHub issue if bug

**Document Approved By:** Project Team  
**Effective Date:** September 2026  
**Review Cycle:** Quarterly  

---

**NEWSKARNATAKA.COM STRAPI STRATEGY - APPROVED ✅**


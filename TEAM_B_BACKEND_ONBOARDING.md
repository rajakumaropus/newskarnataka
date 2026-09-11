# Team B: Backend Onboarding Guide
## Strapi 5.x + PostgreSQL + Article Workflow

**Team:** 4 Backend Developers  
**Tech Stack:** Strapi 5.x, PostgreSQL 14+, Node.js 18+, Groq AI API  
**Database:** 103.191.208.235 (newskarnataka)  
**Duration:** Ongoing reference during Sprint 1 & beyond

---

## YOUR MISSION

Build the **content management backbone** with:
- **PostgreSQL schema** (30+ tables, UUID PKs, audit triggers)
- **Strapi content types** (Articles, Authors, Sources, Categories, etc)
- **Article workflow** (submission → validation → approval → publishing)
- **AI integration** (Groq AI validation, scoring, auto-publish logic)
- **REST + GraphQL APIs** (for Team A frontend consumption)

**Success = 99.9% database uptime + zero data loss + 100+ tps throughput**

---

## SPRINT 1 GOALS (Week 1)

### Monday EOD
- ✅ Strapi project created & initialized
- ✅ .env configured with production database credentials
- ✅ Database connection verified
- ✅ npm run build successful
- ✅ Strapi admin dashboard accessible
- ✅ Code pushed to GitHub

### Tuesday EOD
- ✅ PostgreSQL connectivity verified (all 4 devs)
- ✅ Connection pooling configured
- ✅ Monitoring dashboards active
- ✅ Team tested end-to-end

### Wednesday EOD
- ✅ 30+ database tables initialized
- ✅ All indexes & triggers created
- ✅ Schema matches design document
- ✅ Foreign key relationships validated

### Thursday EOD
- ✅ 6 Strapi roles created
- ✅ 40+ permissions assigned
- ✅ Access control tested
- ✅ Permission matrix verified

### Friday EOD
- ✅ First content types (Articles, Authors) created
- ✅ Article workflow partially implemented
- ✅ API endpoints responding
- ✅ Ready for Team A integration testing

---

## SETUP: MONDAY MORNING (BEFORE BREAKOUT)

### 1. Verify Prerequisites (5 min)

```bash
# Check Node.js version (must be 18+)
node --version
# Expected: v18.x.x or v20.x.x

# Check npm
npm --version
# Expected: 9.x.x or higher

# Check PostgreSQL client
psql --version
# Expected: PostgreSQL 12+

# Check Docker (optional but recommended)
docker --version
docker-compose --version

# Check Git
git --version
```

### 2. Test Database Connection (5 min)

```bash
# Test connectivity to production database
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT version();"

# Expected output: PostgreSQL version info

# If connection fails, check:
# - VPN/Network access: ping 103.191.208.235
# - Firewall: nc -zv 103.191.208.235 5432
# - Credentials: Double-check user, password, database name
# - Ask Team C for help with network issues
```

### 3. Configure Git (5 min)

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@newskarnataka.com"

# Helpful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
```

### 4. Prepare Environment File (10 min)

Create a `.env` file template for reference:
```bash
# Database (Production - 103.191.208.235)
DATABASE_URL=postgresql://news:news321@103.191.208.235:5432/newskarnataka
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true

# Strapi Configuration
NODE_ENV=production
STRAPI_PORT=1337
STRAPI_HOST=0.0.0.0

# Admin & JWT Secrets (Generate with: openssl rand -base64 32)
ADMIN_JWT_SECRET=<generate-new-random-secret>
JWT_SECRET=<generate-new-random-secret>
API_TOKEN_SALT=<generate-new-random-secret>

# AI Integration (Groq)
GROQ_API_KEY=<get-from-team-lead>
GROQ_MODEL=mixtral-8x7b-32768

# Redis (for caching/sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Environment
APP_KEYS=<generate-new-random-secret>
```

---

## MONDAY BREAKOUT SESSION (10:30 AM - 12:00 PM)

### Step 1: Create Strapi Project (15 min)

```bash
# Navigate to development folder
cd ~/newskarnataka-dev

# Create Strapi project (use quickstart, then we'll modify)
npx create-strapi-app@latest newskarnataka-cms --quickstart

# STOP the automatic startup (Ctrl+C immediately)
# We need to configure the database first

cd newskarnataka-cms
```

### Step 2: Delete SQLite & Configure PostgreSQL (10 min)

```bash
# Remove default SQLite database
rm -f .tmp/data.db .tmp/data.db-shm .tmp/data.db-wal

# Create .env file with production database credentials
cat > .env << 'EOF'
DATABASE_URL=postgresql://news:news321@103.191.208.235:5432/newskarnataka
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true

NODE_ENV=production
STRAPI_PORT=1337
STRAPI_HOST=0.0.0.0

ADMIN_JWT_SECRET=generate-with-openssl-rand-base64-32
JWT_SECRET=generate-with-openssl-rand-base64-32
API_TOKEN_SALT=generate-with-openssl-rand-base64-32
APP_KEYS=generate-with-openssl-rand-base64-32
EOF

# Generate secure random secrets
# On macOS/Linux:
# openssl rand -base64 32

# On Windows PowerShell:
# [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Update .env with actual secrets (replace the placeholder values)
```

### Step 3: Add to .gitignore (5 min)

```bash
# Add to .gitignore
cat >> .gitignore << 'EOF'

# Environment files
.env
.env.local
.env.*.local

# Strapi
.cache/
.strapi-updater.json

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
EOF
```

### Step 4: Build Strapi (10 min)

```bash
# Install dependencies (if not already done)
npm install

# Build the project
npm run build

# Expected output:
# ...
# ✓ The project's structure was successfully created
# ✓ Your application will start in a few seconds
```

### Step 5: Initialize Database (10 min)

```bash
# Start Strapi development server
npm run develop

# This will:
# 1. Connect to PostgreSQL
# 2. Create initial Strapi tables
# 3. Prompt you to create admin user (fill in details)
# 4. Start the admin panel

# Browser should open to: http://localhost:1337/admin
# You should see the Strapi admin login screen
```

### Step 6: Verify Database Connection (5 min)

In a **new terminal window**:
```bash
# Test direct database connection
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

# Expected: Should show number of tables created by Strapi (typically 40+)

# List tables
psql -h 103.191.208.235 -U news -d newskarnataka -c "\dt"

# Expected output shows tables like:
# - core_admin_users
# - strapi_db_migrations
# - files_folder
# - etc.
```

### Step 7: Initialize Git & Push (5 min)

Back in the project directory:
```bash
# Initialize Git
git init

# Create initial commit
git add .
git commit -m "feat: Initialize Strapi 5.x project with PostgreSQL"

# Add remote (ask Team Lead for repo URL)
git remote add origin https://github.com/newskarnataka/newskarnataka-backend.git

# Create feature branch
git checkout -b feature/database-setup

# Push to GitHub
git push -u origin feature/database-setup
```

### Step 8: Screenshot & Report Success (5 min)

```bash
# Take screenshots:
# 1. Strapi admin panel (http://localhost:1337/admin)
# 2. psql output showing database tables
# 3. Terminal showing "npm run develop" running

# Post in #team-backend Slack:
"""
✅ Strapi initialized successfully!

Database: 103.191.208.235
Tables created: 45+
Admin panel: Running on localhost:1337
Developers ready: [list your names]

Next: Continue with database schema setup
"""
```

---

## MONDAY AFTERNOON: DATABASE SCHEMA (1:00 PM - 5:00 PM)

### Create Database Schema & Tables

You have two options:

**OPTION A: Using SQL Script (Faster, Recommended)**

```bash
# From the DATABASE_IMPLEMENTATION_SCRIPTS.md file in workspace
# Copy the SQL script

# Run against production database
psql -h 103.191.208.235 -U news -d newskarnataka -f database_schema.sql

# Verify all 30+ tables created
psql -h 103.191.208.235 -U news -d newskarnataka -c "\dt"

# Verify indexes
psql -h 103.191.208.235 -U news -d newskarnataka -c "\di"

# Verify triggers
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT * FROM information_schema.triggers WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema');"
```

**OPTION B: Using Strapi Content Type Builder (Manual, Educational)**

In Strapi admin panel:

1. **Articles Collection:**
   - Navigate to: Content-Type Builder (hammer icon)
   - Click: Create New Collection Type
   - Display Name: Article
   - API ID: article
   - Add fields:
     ```
     - title (Text, required)
     - slug (Text, unique)
     - content (Rich Text)
     - excerpt (Text)
     - author (Relation → Authors)
     - source (Relation → Sources)
     - category (Relation → Categories)
     - status (Enumeration: draft, published, rejected)
     - ai_score (Decimal)
     - is_featured (Boolean)
     - views_count (Integer)
     - published_at (DateTime)
     - created_at (DateTime, auto)
     - updated_at (DateTime, auto)
     ```

2. **Authors Collection:**
   - Display Name: Author
   - Fields:
     ```
     - name (Text, required)
     - email (Email, required)
     - bio (Rich Text)
     - articles (Relation → Articles)
     ```

3. **Sources Collection:**
   - Display Name: Source
   - Fields:
     ```
     - name (Text, required, unique)
     - trust_level (Integer: 0-100)
     - api_endpoint (Text)
     - requires_approval (Boolean)
     - articles (Relation → Articles)
     ```

4. **Categories Collection:**
   - Display Name: Category
   - Fields:
     ```
     - name (Text, required)
     - slug (Text, unique)
     - description (Text)
     - articles (Relation → Articles)
     ```

---

## TUESDAY: DATABASE CONNECTIVITY GATING (CRITICAL)

### Gate #1: Full Team Connectivity

Each developer must verify:

```bash
# 1. Connect to database
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Expected: (1 row) 1

# 2. Check active connections
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;"

# 3. Verify Strapi connection pooling
npm run develop

# Check logs for: "database connected successfully"

# 4. All team members report in #team-backend:
# "✅ [Your Name] - Database connected and Strapi running"
```

### Gate #1 Success Criteria:
- [ ] All 4 team members connected to database
- [ ] All 4 team members have Strapi running
- [ ] Zero connection errors
- [ ] No firewall/network issues

**If fails:** Escalate to Team C immediately

---

## WEDNESDAY: DATABASE SCHEMA INITIALIZATION

### Initialize 30+ Tables

```bash
# Verify all tables created from DATABASE_IMPLEMENTATION_SCRIPTS.md
psql -h 103.191.208.235 -U news -d newskarnataka << 'EOF'

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count total tables
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- List all indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- List all triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema');

EOF
```

### Gate #2: Schema Verification Checklist

```bash
# Must verify ALL of these:

✅ Core Tables (should have 30+):
   - articles
   - authors
   - sources
   - categories
   - users
   - roles
   - permissions
   - audit_logs
   - (+ 22 more from design doc)

✅ Indexes Created (should have 45+):
   - articles_idx_slug
   - articles_idx_source_id
   - articles_idx_created_at
   - (+ 42 more)

✅ Triggers Active (should have 8+):
   - audit_articles_insert
   - audit_articles_update
   - audit_articles_delete
   - (+ 5 more)

✅ Foreign Keys Valid:
   - All relationships intact
   - Referential integrity checked

✅ UUID Fields:
   - All PKs using UUID v4
   - Verified correct format

Post screenshot in #team-backend showing all verifications passed
```

---

## THURSDAY: ROLES & PERMISSIONS

### Create 6 Roles

In Strapi admin panel:

```
Settings → Users & Permissions → Roles
```

Create these roles:

**1. Admin**
- Can manage all content
- Can manage users & roles
- Can manage settings
- Full API access

**2. Editor**
- Can create & edit articles
- Can publish articles
- Cannot manage users
- API access: articles, authors, categories

**3. Reviewer**
- Can view articles (all statuses)
- Can approve/reject articles
- Cannot edit articles
- Cannot delete articles
- API access: articles (read-only + approve endpoint)

**4. Author**
- Can create & edit own articles
- Cannot publish directly
- Cannot edit other authors' articles
- API access: own articles only

**5. Source Agent**
- Can create articles from API
- Can update article metadata
- Cannot publish directly
- API access: article creation endpoint only

**6. Viewer**
- Can view published articles only
- Cannot edit/create
- API access: read-only, published articles

### Assign 40+ Permissions

For each role, configure permissions:

```
Example for Editor role:

Content:
✅ articles: create, read, update, publish, delete
✅ authors: read, create
✅ categories: read
✅ sources: read

Settings:
❌ users: cannot access
❌ roles: cannot access
❌ permissions: cannot access
```

### Test Permissions

```bash
# Using Postman or curl:

# 1. Get JWT token for each role
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "editor@newskarnataka.com",
    "password": "password123"
  }'

# Expected response:
# {
#   "jwt": "eyJhbGc...",
#   "user": { ... }
# }

# 2. Use token to access protected endpoints
curl -X GET http://localhost:1337/api/articles \
  -H "Authorization: Bearer eyJhbGc..."

# Should succeed for Editor role
# Should fail for Viewer role (with 403 Forbidden)
```

---

## FRIDAY: FIRST CONTENT TYPES

### Create First 3 Content Types

**1. Articles Content Type**

```javascript
// config/schema.graphql or Strapi Content-Type Builder

type Article {
  id: ID!
  title: String! @unique
  slug: String! @unique
  content: String!
  excerpt: String
  status: ArticleStatus! # draft, reviewing, approved, published, rejected
  author: Author!
  source: Source!
  category: Category
  ai_score: Float # 0-100
  ai_feedback: String # Why score is what it is
  is_featured: Boolean
  views_count: Int
  published_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
}

enum ArticleStatus {
  DRAFT
  SUBMITTED
  AI_VALIDATING
  PENDING_APPROVAL
  APPROVED
  PUBLISHED
  REJECTED
}
```

**2. Authors Content Type**

```javascript
type Author {
  id: ID!
  name: String! @unique
  email: Email! @unique
  bio: String
  avatar: String
  articles: [Article] @relation(name: "ArticleToAuthor")
  created_at: DateTime!
  updated_at: DateTime!
}
```

**3. Sources Content Type**

```javascript
type Source {
  id: ID!
  name: String! @unique
  description: String
  trust_level: Int # 0-100
  requires_approval: Boolean!
  api_key: String
  api_endpoint: String
  webhook_secret: String
  articles: [Article] @relation(name: "ArticleToSource")
  created_at: DateTime!
  updated_at: DateTime!
}
```

### Create Workflow Endpoint

```bash
# Create custom Strapi plugin/controller for article workflow

mkdir -p src/api/article/controllers

cat > src/api/article/controllers/workflow.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', {
  async submitForApproval(ctx) {
    const { id } = ctx.params;
    
    const article = await strapi.entityService.findOne('api::article.article', id);
    
    if (!article) {
      return ctx.badRequest('Article not found');
    }
    
    if (article.status !== 'draft') {
      return ctx.badRequest('Only draft articles can be submitted');
    }
    
    // Update status to AI_VALIDATING
    const updated = await strapi.entityService.update('api::article.article', id, {
      data: {
        status: 'AI_VALIDATING',
      },
    });
    
    // TODO: Call Groq AI API for validation
    // TODO: Update status based on AI score
    
    ctx.body = updated;
  },

  async approveArticle(ctx) {
    const { id } = ctx.params;
    
    const article = await strapi.entityService.findOne('api::article.article', id);
    
    if (!article) {
      return ctx.badRequest('Article not found');
    }
    
    if (article.status !== 'pending_approval') {
      return ctx.badRequest('Only pending articles can be approved');
    }
    
    const updated = await strapi.entityService.update('api::article.article', id, {
      data: {
        status: 'published',
        published_at: new Date(),
      },
    });
    
    ctx.body = updated;
  },

  async rejectArticle(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;
    
    const updated = await strapi.entityService.update('api::article.article', id, {
      data: {
        status: 'rejected',
        rejection_reason: reason,
      },
    });
    
    ctx.body = updated;
  },
});
EOF
```

### Update Routes

```bash
# Configure routes for workflow endpoints
cat > src/api/article/routes/workflow.js << 'EOF'
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/articles/:id/submit',
      handler: 'workflow.submitForApproval',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/articles/:id/approve',
      handler: 'workflow.approveArticle',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/articles/:id/reject',
      handler: 'workflow.rejectArticle',
      config: {
        auth: false,
      },
    },
  ],
};
EOF
```

---

## EOD FRIDAY: VERIFICATION & COMMIT

```bash
# 1. Verify all systems operational
npm run develop

# Wait for "✓ Server is running" message

# 2. Test API endpoints
curl -X GET http://localhost:1337/api/articles

# 3. Check database
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT COUNT(*) FROM articles;"

# 4. Commit & push
git add .
git commit -m "feat: Add Strapi configuration, content types, and article workflow"
git push origin feature/database-setup

# 5. Create Pull Request
# - Go to GitHub
# - Add description with screenshots
# - Request review from Team Lead
# - Submit PR

# 6. Post in #team-backend
"""
✅ Sprint 1 Backend Complete!

Deliverables:
✅ Strapi 5.x initialized
✅ 30+ database tables created
✅ 6 roles & 40+ permissions configured
✅ Article workflow partially implemented
✅ API endpoints responding
✅ Database connectivity verified (all 4 devs)

Ready for Team A integration next sprint!
"""
```

---

## DAILY STANDUP TEMPLATE

**When:** 9:00 AM - 9:15 AM  
**Where:** Zoom link in Slack  
**Report In:** #daily-standup channel

```
🟢 Team B - Backend Status

Yesterday (Mon):
✅ Strapi project initialized
✅ PostgreSQL connection established
✅ Admin panel running
✅ Database schema created

Today (Tue):
🎯 Verify all team members can connect to database
🎯 Configure connection pooling
🎯 Test database performance

Blockers:
❌ None currently

Wins:
🎉 All developers connected to database without issues!
```

---

## IMPORTANT COMMANDS

```bash
# Development
npm run develop              # Start Strapi dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
psql -h 103.191.208.235 -U news -d newskarnataka  # Connect to DB
\dt                        # List tables (in psql)
\di                        # List indexes (in psql)
\df                        # List functions (in psql)

# Testing APIs
curl -X GET http://localhost:1337/api/articles  # Get articles
curl -X POST http://localhost:1337/api/articles # Create article

# Git
git status
git add .
git commit -m "message"
git push origin feature-branch
```

---

## FREQUENTLY ASKED QUESTIONS

**Q: How do I connect to the production database from my machine?**
A:
```bash
psql -h 103.191.208.235 -U news -d newskarnataka -W
# Enter password: news321
```

**Q: What if Strapi won't connect to the database?**
A: Check:
- [ ] .env file has correct credentials
- [ ] VPN is connected (if required)
- [ ] Firewall allows port 5432
- [ ] PostgreSQL server is running
- [ ] Ask Team C if port 5432 is blocked

**Q: How do I reset the database?**
A: WARNING - This deletes all data!
```bash
psql -h 103.191.208.235 -U news -d newskarnataka -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then re-run: npm run develop
```

**Q: How do I add a new content type?**
A: In Strapi admin → Content-Type Builder (hammer icon) → Create new collection type

**Q: How do I create a new API endpoint?**
A: Create file in src/api/[collection]/controllers/ and define route

**Q: How do I test the API?**
A: Use Postman or curl:
```bash
curl -X GET http://localhost:1337/api/articles
```

---

## SUCCESS CHECKLIST

By Friday EOD, you should have:

- [ ] Strapi project created and running
- [ ] PostgreSQL connected (all 4 developers)
- [ ] 30+ database tables initialized
- [ ] 45+ indexes created
- [ ] 8 audit triggers active
- [ ] 6 roles configured
- [ ] 40+ permissions assigned
- [ ] First 3 content types created
- [ ] Basic workflow endpoints working
- [ ] Team trained on Strapi & database
- [ ] All PRs reviewed and merged
- [ ] Documentation complete

---

## NEXT STEPS (AFTER SPRINT 1)

- Sprint 2: Create remaining content types (categories, comments, etc)
- Sprint 2: Implement full article approval workflow
- Sprint 3: Integrate Groq AI for article validation
- Sprint 4: Implement batch article import (15K articles)
- Sprint 5: Performance optimization & load testing

---

**Questions?** Ask in #team-backend Slack channel.

**Let's build something great!** 🚀


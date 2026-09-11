# Database Setup Quick Start Guide
## NewsKarnataka.com PostgreSQL Implementation - Step-by-Step Execution

**Project:** NewsKarnataka.com Strapi Migration  
**Timeline:** 15 minutes setup  
**Difficulty:** Intermediate  
**Date:** September 2026

---

## ⚡ QUICK SETUP (5 minutes)

### Step 1: Verify PostgreSQL Installation

```bash
# Check PostgreSQL version (should be 14+)
psql --version

# Expected output:
# psql (PostgreSQL) 14.5
```

If not installed:
- **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/windows/) 
- **macOS:** `brew install postgresql@14`
- **Linux:** `sudo apt-get install postgresql-14`

---

### Step 2: Create Database

```bash
# Create the news database
createdb newskarnataka_prod

# Verify creation
psql -l | grep newskarnataka

# Expected output:
# newskarnataka_prod | <owner> | UTF8 | en_US.UTF-8 | en_US.UTF-8 |
```

---

### Step 3: Connect to Database

```bash
# Connect to the newly created database
psql newskarnataka_prod

# You should see the prompt:
# newskarnataka_prod=#
```

---

### Step 4: Install Extensions

```sql
-- Run these commands inside psql:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Verify extensions
\dx

-- You should see:
-- uuid-ossp
-- pgcrypto
-- pg_trgm
-- citext
```

---

## 📋 FULL IMPLEMENTATION (10 minutes)

### Option 1: Execute Full Script (Recommended)

```bash
# 1. Save the DATABASE_IMPLEMENTATION_SCRIPTS.md SQL content to a file:
# Copy the SQL sections into: /tmp/setup.sql

# 2. Execute the script:
psql newskarnataka_prod -f /tmp/setup.sql

# 3. Expected output:
# CREATE SCHEMA
# CREATE EXTENSION
# CREATE TABLE
# CREATE INDEX
# CREATE TRIGGER
# ...
# [Many lines indicating success]

# 4. Check for errors:
# If you see ERROR messages, resolve them before proceeding
```

---

### Option 2: Execute Section by Section (Detailed)

If you prefer to understand each step:

```bash
# 1. Open psql connection
psql newskarnataka_prod

# 2. Copy and paste Section 0 (Environment Setup)
# Section 0: ENVIRONMENT SETUP - Creates helper functions
# [Paste from DATABASE_IMPLEMENTATION_SCRIPTS.md]

# 3. Copy and paste Section 1 (Users)
# Section 1: USER & ROLE MANAGEMENT TABLES

# 4. Continue with remaining sections...
# Section 2: CATEGORIES & TAGS
# Section 3: MEDIA & ATTACHMENTS
# Section 4: ARTICLES CORE TABLES
# Section 5: ARTICLE SOURCE WORKFLOW TABLES
# Section 6: ENGAGEMENT TABLES
# Section 7: AUDIT & COMPLIANCE TABLES
# Section 8: APPROVAL WORKFLOW PROCEDURES
# Section 9: AUDIT TRIGGERS
# Section 10: VERIFICATION & TESTING
```

---

## ✅ VERIFICATION (2 minutes)

### Check Installation Success

```sql
-- Connect to database
psql newskarnataka_prod

-- 1. Count tables created
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: 22 tables

-- 2. Count functions created
SELECT COUNT(*) as function_count 
FROM information_schema.routines 
WHERE routine_schema = 'public';
-- Expected: 8+ functions

-- 3. Verify article_sources data
SELECT name, code, trust_score, auto_publish_enabled
FROM article_sources
ORDER BY trust_score DESC;
-- Expected output:
-- name                   | code     | trust_score | auto_publish_enabled
-- Agence France-Presse   | AFP      | 95          | t
-- Reuters                | REUTERS  | 95          | t
-- Internal Staff         | STAFF    | 100         | f
-- ...

-- 4. Verify triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
-- Expected: 8 triggers on various tables

-- 5. List all tables
\dt

-- 6. List all functions
\df

-- 7. Describe users table
\d users
```

---

## 🧪 TEST SAMPLE WORKFLOW (2 minutes)

### Create Test User & Article

```sql
-- 1. Create a test user
INSERT INTO users (
  username, email, display_name, role, email_verified
) VALUES (
  'test_editor_' || gen_random_uuid()::TEXT,
  'test@newskarnataka.com',
  'Test Editor',
  'editor',
  TRUE
) RETURNING id as user_id;

-- Note the user_id returned (you'll need it below)

-- 2. Set this as your audit user (replace UUID with returned ID)
SELECT set_audit_user('00000000-0000-0000-0000-000000000001'::UUID, TRUE);

-- 3. Create a test article
INSERT INTO articles (
  title, content, excerpt, category_id, author_id, 
  source_id, submitted_by_user_id, slug, status
) VALUES (
  'Breaking: Test Article Successfully Created',
  'This article demonstrates the complete workflow system working correctly. When this article is submitted, it will go through AI validation, and based on the source trust level, may be auto-approved.',
  'Test excerpt for article',
  (SELECT id FROM categories WHERE slug = 'breaking-news' LIMIT 1),
  (SELECT id FROM users WHERE role = 'editor' LIMIT 1),
  (SELECT id FROM article_sources WHERE code = 'STAFF' LIMIT 1),
  (SELECT id FROM users WHERE role = 'editor' LIMIT 1),
  'test-article-' || gen_random_uuid()::TEXT,
  'submitted'
) RETURNING id as article_id;

-- Note the article_id returned

-- 4. Check article submission was auto-created
SELECT id, status, source_id, ai_validation_result
FROM article_submissions
WHERE status = 'submitted'
ORDER BY submitted_at DESC LIMIT 1;

-- 5. Simulate AI validation
UPDATE article_submissions
SET 
  ai_validation_status = 'completed',
  ai_validation_result = 'green',
  ai_confidence_score = 0.92,
  status = 'ai_validating'
WHERE status = 'submitted'
LIMIT 1;

-- 6. Check activity logs (audit trail)
SELECT user_id, action_type, entity_type, created_at
FROM activity_logs
ORDER BY created_at DESC LIMIT 5;

-- Expected output showing:
-- Article creation logged
-- Submission creation logged
```

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Extension uuid-ossp does not exist"

```bash
# Solution: Install postgresql-contrib package
# Windows: Already included in PostgreSQL installer
# macOS: brew install postgresql-contrib
# Linux: sudo apt-get install postgresql-contrib-14
```

### Issue 2: "Permission denied for schema public"

```bash
# Solution: Grant permissions
psql newskarnataka_prod -U postgres

-- Run these commands:
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO public;
GRANT ALL ON SCHEMA public TO public;
```

### Issue 3: "Database already exists"

```bash
# Solution: Drop and recreate
dropdb newskarnataka_prod
createdb newskarnataka_prod
```

### Issue 4: "Cannot connect to PostgreSQL server"

```bash
# Check if PostgreSQL is running:

# Windows:
# Services -> PostgreSQL -> Start

# macOS:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 📊 EXPECTED RESULTS

### After Successful Installation:

```
✅ 22 tables created
✅ 8 functions created
✅ 8 audit triggers enabled
✅ 45+ optimized indexes
✅ 9 article sources configured
✅ 6 sample categories configured
✅ Complete audit trail system ready
✅ AI validation workflow configured
✅ Article approval automation ready
```

### Database Size:
- **Schema Only:** ~50MB
- **With 55K articles:** ~500MB
- **With 3-year history:** ~1.5GB

---

## 🚀 NEXT STEPS

After database setup is complete:

### Step 1: Backup Configuration

```bash
# Create initial backup
pg_dump newskarnataka_prod > backup_initial.sql

# Verify backup
psql newskarnataka_prod < backup_initial.sql
```

### Step 2: AWS RDS Setup (if using cloud)

```bash
# Create AWS RDS instance:
# - Engine: PostgreSQL 14.6
# - Multi-AZ: Yes (for production)
# - Storage: 100GB, GP3
# - Backup retention: 30 days
# - Enhanced monitoring: Yes

# Restore from backup:
# psql -h newskarnataka.xxxxx.rds.amazonaws.com -U postgres newskarnataka_prod < backup_initial.sql
```

### Step 3: Configure Monitoring

```sql
-- Create monitoring view
CREATE VIEW database_stats AS
SELECT 
  (SELECT COUNT(*) FROM articles) as total_articles,
  (SELECT COUNT(*) FROM article_submissions) as total_submissions,
  (SELECT COUNT(*) FROM activity_logs) as audit_events,
  (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as active_users,
  (SELECT COUNT(*) FROM comments) as total_comments,
  pg_size_pretty(pg_database_size(current_database())) as database_size;

SELECT * FROM database_stats;
```

### Step 4: Strapi Integration

Connect Strapi to this PostgreSQL database:

```javascript
// In strapi/config/database.js
module.exports = {
  connection: {
    client: 'postgres',
    connection: {
      host: 'localhost', // or RDS endpoint
      port: 5432,
      database: 'newskarnataka_prod',
      user: 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' // True for AWS RDS
    }
  }
};
```

### Step 5: Application Integration

```python
# In Python backend (for AI integration):
import psycopg2

conn = psycopg2.connect(
    host="localhost",  # or RDS endpoint
    database="newskarnataka_prod",
    user="postgres",
    password="your_password"
)

# Use connection for Groq AI validation
# and workflow automation
```

---

## 📝 CONNECTION STRINGS

### Local Development
```
psql newskarnataka_prod
postgresql://postgres:password@localhost:5432/newskarnataka_prod
```

### AWS RDS Production
```
postgresql://postgres:password@newskarnataka.xxxxx.rds.amazonaws.com:5432/newskarnataka_prod?sslmode=require
```

### Docker (if using containers)
```bash
docker run --name newskarnataka_db \
  -e POSTGRES_PASSWORD=securepassword \
  -e POSTGRES_DB=newskarnataka_prod \
  -p 5432:5432 \
  postgres:14
```

---

## ✨ KEY FEATURES NOW ACTIVE

```
✅ UUID Primary Keys
   └─ Every article has globally unique identifier
   └─ Easy migration from WordPress
   └─ Distributed systems ready

✅ Multi-Source Tracking
   └─ 9 predefined sources (AFP, ANI, Freelancers, etc.)
   └─ Trust-based routing (0-100 score)
   └─ Per-source configuration

✅ AI-Driven Approval Workflow
   └─ Groq LLM validation
   └─ Confidence scoring (0-1)
   └─ Auto-approval for trusted sources
   └─ Manual review for others

✅ Complete Audit Trail
   └─ Every change logged
   └─ Who, what, when tracked
   └─ 7-year retention for compliance

✅ Submission Workflow
   └─ submitted → ai_validating → pending_approval → published
   └─ SLA tracking
   └─ Rejection handling

✅ Engagement Tracking
   └─ Comments, likes, shares
   └─ View count tracking
   └─ User interaction metrics
```

---

## 📞 SUPPORT CONTACTS

### Database Issues
- PostgreSQL Docs: https://www.postgresql.org/docs/14/
- Stack Overflow: Tag `postgresql`

### Strapi Integration
- Strapi Docs: https://docs.strapi.io/
- Database Plugin: https://docs.strapi.io/dev-docs/plugins

### AWS RDS Support
- AWS Console: https://console.aws.amazon.com/rds/
- AWS Support: https://console.aws.amazon.com/support/

---

## ✅ SETUP COMPLETE CHECKLIST

- [ ] PostgreSQL 14+ installed
- [ ] Database created: `newskarnataka_prod`
- [ ] All extensions installed
- [ ] All 22 tables created
- [ ] All 8 functions created
- [ ] All 8 triggers enabled
- [ ] Sample test workflow completed
- [ ] Backup created
- [ ] Monitoring configured (optional)
- [ ] Team trained on usage

---

**Status:** ✅ **DATABASE READY FOR STRAPI INTEGRATION**

**Documentation:**
- Full design: POSTGRESQL_DATABASE_DESIGN_UUID.md
- Implementation: DATABASE_IMPLEMENTATION_SCRIPTS.md
- Workflows: ARTICLE_SOURCE_WORKFLOW_SYSTEM.md

**Estimated Time to Integrate with Strapi:** 2-3 hours

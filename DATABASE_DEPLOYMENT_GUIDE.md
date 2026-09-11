# 📚 DATABASE SCHEMA DEPLOYMENT GUIDE
## NewsKarnataka.com - Step-by-Step Implementation

**Version:** 1.0  
**Date:** September 10, 2026  
**Target Database:** newskarnataka (103.191.208.235)  
**Status:** Ready for Deployment  

---

## 📋 QUICK START (5 minutes)

### Option 1: Using pgAdmin 4 UI (Easiest)

```
1. Open pgAdmin: http://localhost:5050
2. Login: admin@newskarnataka.com / admin123
3. Right-click "newskarnataka" database
4. Select "Query Tool"
5. Copy content from 00_SCHEMA_DEPLOYMENT_MASTER_SCRIPT.sql
6. Paste into Query Tool
7. Click "Execute" button (play icon)
8. Wait 5-10 minutes for completion
9. See confirmation messages at bottom
```

### Option 2: Using Docker Container

```powershell
# Set password
$env:PGPASSWORD="news321"

# Execute schema deployment script
docker run --rm `
  -v "d:\Personal\Kiro\newsKarnataka\00_SCHEMA_DEPLOYMENT_MASTER_SCRIPT.sql:/schema.sql" `
  postgres:14 `
  psql -h 103.191.208.235 -U news -d newskarnataka -f /schema.sql
```

### Option 3: Using psql Command Line

```bash
# From Windows PowerShell
$env:PGPASSWORD="news321"

psql -h 103.191.208.235 -U news -d newskarnataka -f "d:\Personal\Kiro\newsKarnataka\00_SCHEMA_DEPLOYMENT_MASTER_SCRIPT.sql"
```

---

## 📊 DETAILED DEPLOYMENT STEPS

### STEP 1: Pre-Deployment Verification (10 minutes)

**Check PostgreSQL Connectivity:**

```sql
-- Run this query in pgAdmin
SELECT version();
```

Expected output: PostgreSQL 14+ version information

**Check Database Exists:**

```sql
SELECT datname FROM pg_database WHERE datname = 'newskarnataka';
```

Expected output: newskarnataka

**Check User Permissions:**

```sql
SELECT current_user;
```

Expected output: news

---

### STEP 2: Backup Current Database (15 minutes, if needed)

```powershell
# Create backup before deployment
docker run --rm `
  -v "d:\Personal\Kiro\newsKarnataka\backups:/backups" `
  postgres:14 `
  pg_dump -h 103.191.208.235 -U news -d newskarnataka > /backups/newskarnataka_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

---

### STEP 3: Deploy Schema (7-10 minutes)

**Using pgAdmin:**

1. Open pgAdmin 4: http://localhost:5050
2. Login with: admin@newskarnataka.com / admin123
3. Expand "Servers" → "PostgreSQL Local"
4. Expand "Databases" → "newskarnataka"
5. Click "Tools" → "Query Tool"
6. Open file: `00_SCHEMA_DEPLOYMENT_MASTER_SCRIPT.sql`
7. Copy entire content (Ctrl+A, Ctrl+C)
8. Paste into Query Tool (Ctrl+V)
9. Click Execute button (▶ icon) or press F5
10. Wait for completion (watch progress bar at bottom)

**Expected Console Output:**

```
CREATE EXTENSION
CREATE FUNCTION
CREATE TABLE users
CREATE INDEX
CREATE TRIGGER
...
[repeated for all 35 tables, 50+ indexes, 8+ triggers]
...
INSERT 0 6    -- 6 roles inserted
INSERT 0 43   -- 43 permissions inserted
INSERT 0 9    -- 9 article sources inserted
SELECT 35     -- 35 tables verified
SELECT 50     -- 50+ indexes verified
SELECT 8      -- 8+ triggers verified
SELECT 6      -- 6 roles verified
SELECT 43     -- 43 permissions verified
SELECT 9      -- 9 article sources verified
```

---

### STEP 4: Post-Deployment Verification (15 minutes)

**Run verification queries in pgAdmin Query Tool:**

#### Query 1: Count All Tables

```sql
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected: 35 tables

#### Query 2: Count All Indexes

```sql
SELECT COUNT(*) as total_indexes 
FROM pg_indexes 
WHERE schemaname = 'public';
```

Expected: 50+ indexes

#### Query 3: Verify Core Tables Exist

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected: All 35 tables listed (articles, users, categories, etc.)

#### Query 4: Check Roles Inserted

```sql
SELECT name FROM roles ORDER BY name;
```

Expected output:
```
admin
author
editor
reviewer
source_agent
viewer
```

#### Query 5: Check Permissions Inserted

```sql
SELECT COUNT(*) as total_permissions FROM permissions;
```

Expected: 40+ permissions

#### Query 6: Check Article Sources

```sql
SELECT name FROM article_sources ORDER BY name;
```

Expected: 9 sources (WordPress, Direct API, Manual Entry, etc.)

#### Query 7: Check Triggers

```sql
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY trigger_name;
```

Expected: articles_insert_audit, articles_update_audit, articles_delete_audit, plus timestamp triggers

#### Query 8: Sample Article Table Structure

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'articles' 
ORDER BY ordinal_position;
```

Expected: 25 columns with correct data types

---

### STEP 5: Test CRUD Operations (10 minutes)

**Test 1: Insert a Test User**

```sql
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name
) VALUES (
  'test@newskarnataka.com',
  '$2b$12$test_hash_here',  -- bcrypt hash
  'Test',
  'User'
) RETURNING id, email, created_at;
```

Expected: User inserted with UUID and current timestamp

**Test 2: Insert a Test Category**

```sql
INSERT INTO categories (
  name, 
  slug, 
  description
) VALUES (
  'Test Category',
  'test-category',
  'Test category for verification'
) RETURNING id, name, slug;
```

Expected: Category inserted with UUID

**Test 3: Test Full-Text Search**

```sql
SELECT COUNT(*) as total_articles FROM articles;
-- Should be 0 at this point
```

Expected: 0 articles (schema only, no data yet)

**Test 4: Verify Indexes**

```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'articles' 
ORDER BY indexname;
```

Expected: 10+ indexes on articles table

**Test 5: Check Audit Logging**

```sql
SELECT COUNT(*) as total_audit_logs FROM audit_logs;
```

Expected: Some entries from our test operations (inserts are audited)

---

## 📋 VERIFICATION CHECKLIST

### Schema Deployment Verification

- [ ] PostgreSQL connectivity working
- [ ] Database "newskarnataka" accessible
- [ ] All 35 tables created
- [ ] All 50+ indexes created
- [ ] All 8 audit triggers deployed
- [ ] Timestamp triggers active on all tables
- [ ] All 6 roles inserted
- [ ] All 40+ permissions inserted
- [ ] All 9 article sources inserted
- [ ] Full-text search configured
- [ ] UUID extension enabled
- [ ] Functions created (update_timestamp, audit functions)

### Data Integrity Verification

- [ ] Foreign key relationships valid
- [ ] Unique constraints enforced
- [ ] Check constraints working (status values, etc.)
- [ ] Default values applied (created_at, updated_at)
- [ ] Audit logging working
- [ ] Search vector generated correctly

### Performance Verification

- [ ] Index creation completed
- [ ] Query performance acceptable (< 50ms for basic queries)
- [ ] Full-text search functional
- [ ] Pagination working with offsets
- [ ] Sorting by indexes working

---

## 🔍 TROUBLESHOOTING

### Issue 1: Permission Denied Error

```
ERROR: permission denied for schema public
```

**Solution:**
- Verify you're connecting as user "news"
- Check user has CREATEDB privilege
- Contact Team C (DevOps) for permission escalation

---

### Issue 2: Extension UUID Not Found

```
ERROR: extension "uuid-ossp" does not exist
```

**Solution:**
```sql
-- Create extension with IF NOT EXISTS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

### Issue 3: Foreign Key Constraint Error

```
ERROR: relation "categories" does not exist
```

**Solution:**
- Ensure you're running the FULL script
- Don't skip any sections
- Tables must be created in order (dependencies first)

---

### Issue 4: Timeout During Deployment

```
timeout occurred after 60 seconds
```

**Solution:**
- Script is large (~10,000 lines)
- Increase timeout in pgAdmin (Settings → Query Tool → Timeout)
- Or break script into smaller sections
- Contact Team C if issues persist

---

### Issue 5: Duplicate Key Error

```
ERROR: duplicate key value violates unique constraint
```

**Solution:**
- Schema might already be partially created
- Backup and drop existing tables: `DROP SCHEMA public CASCADE;`
- Recreate public schema: `CREATE SCHEMA public;`
- Rerun deployment script

---

## 📊 DEPLOYMENT TIMELINE

```
Estimated Time Breakdown:

Pre-deployment checks:        5-10 minutes
├─ Network verification
├─ Database verification
└─ Permissions check

Schema deployment:            5-10 minutes
├─ Table creation (35 tables)
├─ Index creation (50+ indexes)
├─ Trigger deployment (8 triggers)
└─ System data initialization

Post-deployment verification: 10-15 minutes
├─ Table count verification
├─ Index verification
├─ CRUD tests
└─ Audit logging tests

TOTAL TIME:                   20-35 minutes
```

---

## ✅ SUCCESS INDICATORS

**After deployment, you should see:**

1. ✅ 35 tables in information_schema
2. ✅ 50+ indexes in pg_indexes
3. ✅ 6 roles in roles table
4. ✅ 40+ permissions in permissions table
5. ✅ 9 article sources in article_sources table
6. ✅ All foreign key relationships intact
7. ✅ Triggers firing on INSERT/UPDATE/DELETE
8. ✅ Audit logs populating on data changes
9. ✅ Full-text search vectors generating
10. ✅ UUID generation working on new inserts

---

## 🔄 NEXT STEPS AFTER DEPLOYMENT

### Day 1: Post-Deployment (Today)

```
1. ✅ Run full verification suite
2. ✅ Create backup of fresh schema
3. ✅ Document any issues encountered
4. ✅ Notify Team B (Backend) that schema is ready
5. ✅ Get sign-off from Database Administrator
```

### Day 2-3: Data Migration Prep

```
1. ⏳ Create WordPress migration mapping tables
2. ⏳ Prepare data extraction scripts
3. ⏳ Test data loading procedures
4. ⏳ Create validation procedures
```

### Week 1: Data Loading

```
1. ⏳ Extract 55K-80K articles from WordPress
2. ⏳ Transform data format
3. ⏳ Load into staging tables
4. ⏳ Validate data integrity
5. ⏳ Perform final verification
```

### Week 2+: Production Readiness

```
1. ⏳ Performance testing
2. ⏳ Security audit
3. ⏳ Backup verification
4. ⏳ Disaster recovery testing
5. ⏳ Go-live readiness
```

---

## 📞 SUPPORT & ESCALATION

### If Deployment Fails

1. **Take Screenshot** - Error message is important
2. **Check Logs** - Review pgAdmin query results
3. **Contact Team Lead:**
   - Team B (Backend): If schema/API issue
   - Team C (DevOps): If database/connectivity issue
4. **Provide:**
   - Error message (full text)
   - Last successful query
   - Time of failure
   - Your database user (should be "news")

### Key Contacts

- **Team B Lead (Backend):** Strapi configuration
- **Team C Lead (DevOps):** Database administration
- **Database Admin:** Schema issues

---

## 📝 DEPLOYMENT LOG TEMPLATE

```
=== SCHEMA DEPLOYMENT LOG ===

Date:                 ___________
Deployed By:         ___________
Database:            newskarnataka
Host:                103.191.208.235
User:                news
Port:                5432

Pre-deployment checks:
  [ ] Database accessible
  [ ] User permissions OK
  [ ] Backup created (Y/N)

Deployment:
  Start Time:        ___________
  End Time:          ___________
  Duration:          ___________ minutes
  Status:            [ ] Success [ ] Failed

Post-deployment checks:
  [ ] 35 tables created
  [ ] 50+ indexes created
  [ ] 8+ triggers deployed
  [ ] 6 roles inserted
  [ ] 40+ permissions inserted
  [ ] 9 article sources inserted
  [ ] CRUD tests passed
  [ ] Audit logging working

Issues Encountered:  ___________
Resolution:         ___________

Sign-off:           ___________
Date:               ___________
```

---

## 📚 RELATED DOCUMENTS

For more information, see:

- `00_SCHEMA_DEPLOYMENT_MASTER_SCRIPT.sql` - Deployment script
- `DATABASE_DEPLOYMENT_READINESS_CHECK.md` - Pre-deployment verification
- `POSTGRESQL_DATABASE_DESIGN_UUID.md` - Database design details
- `ACTION_ITEMS_BRIDGE_GAP.md` - Overall project timeline

---

**DATABASE SCHEMA DEPLOYMENT GUIDE - COMPLETE**

**Status:** Ready for immediate deployment  
**Next Step:** Execute deployment script using pgAdmin  
**Estimated Time:** 20-35 minutes total  
**Expected Outcome:** 35 production-ready tables with full schema


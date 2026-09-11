# 🔌 TEAM B: IMMEDIATE EXECUTION GUIDE
## Backend - Strapi 5.x + PostgreSQL Configuration

**Timeline:** Monday Afternoon - Friday EOD (Sprint 1)  
**Mission:** Initialize Strapi, connect PostgreSQL, create database schema (30+ tables)  
**Target:** Production-ready backend with 6 roles, 40+ permissions, article workflow

---

## 🎯 MONDAY AFTERNOON EXECUTION (1:30 PM - 5:00 PM)

### PHASE 1: Strapi Project Setup (1:30 PM - 2:45 PM)

**Step 1: Create Strapi Project**
```bash
# Navigate to workspace
cd ~/newskarnataka-dev

# Create Strapi project
npx create-strapi-app@latest newskarnataka-cms --quickstart

# IMPORTANT: When prompted, press Ctrl+C to STOP auto-start
# We need to configure the database first
```

**Step 2: Stop & Configure Database**
```bash
# You should already be in the project directory
cd newskarnataka-cms

# Remove default SQLite database
rm -f .tmp/data.db .tmp/data.db-shm .tmp/data.db-wal

# Create .env file with PostgreSQL credentials
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

ADMIN_JWT_SECRET=change-me-to-random-secret-1
JWT_SECRET=change-me-to-random-secret-2
API_TOKEN_SALT=change-me-to-random-secret-3
APP_KEYS=change-me-to-random-secret-4
EOF

# Generate random secrets (optional but recommended)
# For Windows PowerShell:
# [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Step 3: Add to .gitignore**
```bash
# Append to .gitignore
cat >> .gitignore << 'EOF'

# Environment
.env
.env.local
.env.*.local

# Strapi
.cache/
.strapi-updater.json

# OS
.DS_Store
Thumbs.db
EOF
```

**Step 4: Build Strapi**
```bash
# Install dependencies (if not already done)
npm install

# Build the project
npm run build

# Expected output: "✓ The project's structure was successfully created"
```

**Expected by 2:45 PM:**
- ✅ Strapi project created
- ✅ SQLite removed
- ✅ .env configured with PostgreSQL
- ✅ npm run build successful

---

### PHASE 2: Initialize & Verify (2:45 PM - 4:00 PM)

**Step 1: Start Strapi Development Server**
```bash
# Start Strapi
npm run develop

# Expected:
# - Browser opens to http://localhost:1337/admin
# - Prompted to create admin user
# - Enter your credentials
# - Wait for initialization to complete
```

**Step 2: Create Admin User (In Browser)**
When prompted in Strapi admin panel:
```
Email:    admin@newskarnataka.com
Username: admin
Password: [strong password]
```

**Step 3: Verify Database Connection (In New Terminal)**
```bash
# Keep Strapi running in first terminal
# Open new terminal/PowerShell window

# Test database connection
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';"

# Expected: Should show table count (40+ if Strapi tables created)
```

**Step 4: Screenshot & Document**
```
Take screenshots of:
1. Strapi admin dashboard (http://localhost:1337/admin)
2. PostgreSQL query showing table count
3. Strapi console showing "✓ Strapi is running"

Post in #team-backend Slack channel:
"✅ Strapi initialized and connected to PostgreSQL at 103.191.208.235"
```

**Expected by 4:00 PM:**
- ✅ Strapi running on localhost:1337
- ✅ Admin dashboard accessible
- ✅ PostgreSQL connected (50+ system tables created)
- ✅ Screenshots documented
- ✅ Connection verified

---

### PHASE 3: Version Control & EOD (4:00 PM - 5:00 PM)

**Initialize Git**
```bash
# Initialize Git
git init

# Create .gitignore (already done above)
# Add everything
git add .

# Initial commit
git commit -m "feat: Initialize Strapi 5.x with PostgreSQL configuration"

# Add remote
git remote add origin https://github.com/newskarnataka/newskarnataka-backend.git

# Create feature branch
git checkout -b feature/database-setup

# Push to GitHub
git push -u origin feature/database-setup
```

**Post EOD Status in Slack**
```
Post in #team-backend and #daily-standup:

✅ Team B - Monday EOD Report

Strapi Status:
✅ Strapi 5.x initialized
✅ PostgreSQL connected (103.191.208.235:5432)
✅ Admin user created
✅ Admin dashboard running (localhost:1337)

Database:
✅ Connection verified
✅ 50+ Strapi system tables created
✅ Credentials working (news/news321)

Infrastructure:
✅ .env configured
✅ GitHub repository initialized
✅ Initial commit pushed

Next (Tuesday):
🎯 Gate #1: All developers connect to database
🎯 Verify connection pooling
🎯 Establish performance baseline

Blockers: NONE ✅
```

---

## 📋 TUESDAY - GATE #1 EXECUTION

### Critical: All 4 Team B Developers Must Connect

**Each Developer:**
```bash
# Test connection individually
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Expected: (1 row) 1

# Get database info
psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT 
  current_database() as database,
  current_user as user,
  version() as postgresql_version;
"

# Post in Slack: "✅ [Your Name] - Connected to database"
```

**Team Lead Verifies:**
```bash
# Count active connections
psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT count(*) FROM pg_stat_activity WHERE datname='newskarnataka';
"

# Expected: Should show connection count from all team members
```

**Gate #1 Success Criteria (All MUST pass):**
- [ ] All 4 developers connected
- [ ] Connection pooling: 5-20 connections
- [ ] Performance: <100ms response
- [ ] Zero connection errors
- [ ] Strapi running without issues

**Post in #database-sync if all pass:**
```
✅ GATE #1 PASSED - Database Connectivity Verified

Connected Developers: [all 4 names]
Active Connections: X
Average Response Time: Xms
Strapi Status: ✅ Running
Next: Proceed to Wednesday schema initialization
```

---

## 📋 WEDNESDAY - DATABASE SCHEMA INITIALIZATION (Gate #2)

### Critical: Create 30+ Tables with UUID Primary Keys

**Download SQL Schema Script:**
From: `d:\Personal\Kiro\KeralaNews\DATABASE_IMPLEMENTATION_SCRIPTS.md`

**Execute Schema Creation:**
```bash
# Connect to database
psql -h 103.191.208.235 -U news -d newskarnataka

# Run the SQL script from DATABASE_IMPLEMENTATION_SCRIPTS.md
# This will create:
# - 30+ tables with UUID PKs
# - 45+ indexes
# - 8 audit triggers
# - Foreign key relationships
```

**Verify Tables Created:**
```bash
# Count tables
psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema='public';
"

# Expected: 30+

# List all tables
psql -h 103.191.208.235 -U news -d newskarnataka -c "\dt"

# Verify indexes
psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT COUNT(*) as index_count 
FROM pg_indexes 
WHERE schemaname='public';
"

# Expected: 45+

# Verify triggers
psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT COUNT(*) as trigger_count 
FROM information_schema.triggers 
WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema');
"

# Expected: 8
```

**Gate #2 Success Criteria (All MUST verify):**
- [ ] 30+ tables created
- [ ] 45+ indexes created
- [ ] 8 triggers active
- [ ] All foreign keys valid
- [ ] Performance baseline <100ms

**Post in #database-sync:**
```
✅ GATE #2 PASSED - Schema Initialization Complete

Tables: 30+ ✅
Indexes: 45+ ✅
Triggers: 8 ✅
Foreign Keys: Valid ✅
Performance: Stable ✅

Next: Proceed to Thursday roles & permissions
```

---

## 📋 THURSDAY - ROLES & PERMISSIONS (Gate #3)

### Create 6 Roles with 40+ Permissions

**In Strapi Admin Panel:**

Navigate to: Settings → Users & Permissions → Roles

**Create 6 Roles:**

1. **Admin Role**
   - Name: Admin
   - All permissions enabled
   - Full system access

2. **Editor Role**
   - Name: Editor
   - Can create/edit/publish articles
   - Cannot delete articles
   - Cannot manage users

3. **Reviewer Role**
   - Name: Reviewer
   - Can view all articles
   - Can approve/reject articles
   - Cannot edit articles

4. **Author Role**
   - Name: Author
   - Can create own articles
   - Cannot publish directly
   - Cannot edit others' articles

5. **Source Agent Role**
   - Name: SourceAgent
   - Can create articles via API
   - Cannot delete
   - Limited to source-specific data

6. **Viewer Role**
   - Name: Viewer
   - Read-only access
   - Published articles only

**Assign Permissions** (per role):
```
Articles: create, read, update, publish, delete (varies by role)
Authors: read, create
Categories: read
Sources: read (varies by role)
Users: manage (admin only)
Roles: manage (admin only)
Permissions: manage (admin only)
```

**Test Permissions:**
```bash
# For each role, verify access:
# 1. Login to Strapi with role-specific account
# 2. Try creating article (should work/fail based on permissions)
# 3. Try editing another's article (should fail for non-admins)
# 4. Try deleting (should fail for non-admins)
```

**Gate #3 Success Criteria (All MUST verify):**
- [ ] 6 roles created
- [ ] 40+ permissions assigned
- [ ] Role-based access working
- [ ] Unauthorized access denied (403)
- [ ] API endpoints responding

**Post in #team-backend:**
```
✅ GATE #3 PASSED - Roles & Permissions Complete

Roles: 6 ✅
Admin ✅
Editor ✅
Reviewer ✅
Author ✅
SourceAgent ✅
Viewer ✅

Permissions: 40+ ✅
Access Control: Tested ✅
API Endpoints: Responding ✅

Ready for Sprint 2
```

---

## 📋 FRIDAY - SPRINT REVIEW & PLANNING

### Team B Deliverables Checklist

- [ ] Strapi 5.x initialized & running
- [ ] PostgreSQL connected (103.191.208.235)
- [ ] 30+ database tables created
- [ ] 45+ indexes active
- [ ] 8 audit triggers operational
- [ ] 6 roles configured
- [ ] 40+ permissions assigned
- [ ] All 4 developers trained
- [ ] Documentation complete
- [ ] GitHub repository ready
- [ ] All PRs reviewed & merged

---

## 🎯 SPRINT 1 SUCCESS CRITERIA

**By Friday 5:00 PM:**

- ✅ Strapi fully operational
- ✅ Database schema complete (30+ tables)
- ✅ All indexes & triggers active
- ✅ Roles & permissions configured
- ✅ API endpoints responding
- ✅ All gates passed
- ✅ Team trained

---

## 📞 BLOCKERS & ESCALATION

**If blocked at any point:**

1. **15 min:** Contact Team B Lead
2. **1 hour:** Escalate to Tech Lead
3. **Same day:** Contact Project Manager

---

## 🚀 YOU'VE GOT THIS!

**Strapi + PostgreSQL = Your foundation for success**

**Monday afternoon → Friday EOD = Production-ready backend**

**Let's build!** 💪

---

*Team B Execution Guide*  
*Sprint 1 Backend Development*  
*Strapi 5.x + PostgreSQL*


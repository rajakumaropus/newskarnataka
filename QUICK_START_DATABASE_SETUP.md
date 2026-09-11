# Quick Start - Database Setup & Connection
## NewsKarnataka Project - Get Connected in 5 Minutes

**Database:** PostgreSQL at 103.191.208.235  
**Status:** ✅ READY TO USE  
**Time to Connect:** 5 minutes

---

## 🚀 QUICK START (Choose Your Path)

### Path 1: Direct Connection via psql (2 minutes)

```bash
# 1. Test connection
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT version();"

# 2. You should see PostgreSQL version info
# If it works, you're connected! ✅

# 3. To connect and explore
psql -h 103.191.208.235 -U news -d newskarnataka

# Type: \dt (to list tables)
# Type: \q (to quit)
```

### Path 2: Connect with Strapi (10 minutes)

```bash
# 1. Create new Strapi project
npx create-strapi-app@latest newskarnataka-cms --quickstart

# 2. Stop the process (Ctrl+C) when it starts

# 3. Create .env file in Strapi root:
cat > .env << EOF
DATABASE_URL=postgresql://news:news321@103.191.208.235:5432/newskarnataka
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true
NODE_ENV=production
STRAPI_PORT=1337
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
EOF

# 4. Start Strapi
npm run develop

# 5. Open browser: http://localhost:1337/admin
# 6. Create admin user on first-run screen ✅
```

### Path 3: Docker Deployment (5 minutes)

```bash
# 1. Copy docker-compose.yml (included in project)
# Already provided: d:\Personal\Kiro\KeralaNews\docker-compose.yml

# 2. Create .env in same directory as docker-compose.yml
echo "DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true" > .env

# 3. Start all services
docker-compose up -d

# 4. Check logs
docker-compose logs -f strapi

# 5. Open browser: http://localhost:1337/admin ✅
```

---

## 📋 DATABASE CREDENTIALS

```
╔══════════════════════════════════════════╗
║          COPY-PASTE REFERENCE           ║
╠══════════════════════════════════════════╣
║ Host:       103.191.208.235             ║
║ Port:       5432                        ║
║ Database:   newskarnataka               ║
║ User:       news                        ║
║ Password:   news321                     ║
║ SSL:        true                        ║
╚══════════════════════════════════════════╝
```

### Connection Strings

```
# psql command
psql -h 103.191.208.235 -U news -d newskarnataka

# Connection URL
postgresql://news:news321@103.191.208.235:5432/newskarnataka

# For Docker
DB_HOST=103.191.208.235
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
```

---

## ✅ VERIFICATION CHECKLIST

After connecting, verify everything works:

```bash
# 1. Can connect to database
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"
# Expected: Should show "1" in output

# 2. Check database exists
psql -h 103.191.208.235 -U news -c "\l" | grep newskarnataka
# Expected: newskarnataka | news | UTF8 | ...

# 3. Check tables exist (after running setup scripts)
psql -h 103.191.208.235 -U news -d newskarnataka -c "\dt"
# Expected: List of tables (if schema created)

# 4. Test insert
psql -h 103.191.208.235 -U news -d newskarnataka -c \
  "INSERT INTO test_table VALUES (1, 'test');"
# Expected: INSERT 0 1

# 5. Verify SSL is working
psql -h 103.191.208.235 -U news -d newskarnataka -c "SHOW ssl;"
# Expected: on
```

---

## 🐳 DOCKER QUICK COMMANDS

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart a service
docker-compose restart strapi

# View running containers
docker-compose ps

# SSH into container
docker-compose exec strapi bash

# Check Strapi status
docker-compose exec strapi curl http://localhost:1337/health

# View database from pgAdmin
# Open: http://localhost:5050
# Email: admin@newskarnataka.com
# Password: admin123
```

---

## 🛠️ TROUBLESHOOTING

### "Connection refused"
```bash
# Check if host is reachable
ping 103.191.208.235

# Check if port is open
nc -zv 103.191.208.235 5432

# If failed, check network/firewall settings
```

### "Password authentication failed"
```bash
# Verify credentials
echo "Host: 103.191.208.235"
echo "User: news"
echo "Password: news321"
echo "Database: newskarnataka"

# Try connection again
psql -h 103.191.208.235 -U news -d newskarnataka
```

### "SSL connection error"
```bash
# The database requires SSL, this is expected
# Make sure DB_SSL=true is set in your config

# If you get SSL certificate error:
# Add to connection: ?sslmode=require

# Connection string:
postgresql://news:news321@103.191.208.235:5432/newskarnataka?sslmode=require
```

### "Too many connections"
```bash
# Check active connections
psql -h 103.191.208.235 -U news -d newskarnataka -c \
  "SELECT COUNT(*) FROM pg_stat_activity;"

# Reduce connection pool size in config
DB_POOL_MAX=10  # Instead of 20
```

---

## 📁 FILES CREATED FOR YOUR PROJECT

In `d:\Personal\Kiro\KeralaNews\`:

```
✅ .env.example
   └─ Environment variables template

✅ DATABASE_CONNECTION_SETUP.md
   └─ Complete connection guide (all frameworks)

✅ docker-compose.yml
   └─ Docker setup (Strapi + Redis + Backend)

✅ STRAPI_DATABASE_CONFIGURATION.md
   └─ Detailed Strapi setup guide

✅ PRODUCTION_DATABASE_CREDENTIALS.md
   └─ Security & credential management

✅ QUICK_START_DATABASE_SETUP.md
   └─ This file - quick reference
```

---

## 🚀 NEXT STEPS (After Connection Verified)

### Step 1: Set Up Development Environment
```bash
# Copy and configure .env
cp .env.example .env
# Edit .env with your preferred editor
# Update any settings needed for your environment
```

### Step 2: Create Database Schema
```bash
# Option A: Run SQL scripts directly
psql -h 103.191.208.235 -U news -d newskarnataka < DATABASE_IMPLEMENTATION_SCRIPTS.sql

# Option B: Let Strapi create tables automatically
# Just start Strapi, it will initialize on first run
```

### Step 3: Start Strapi
```bash
# Development mode (with hot reload)
npm run develop

# Or production mode
npm start
```

### Step 4: Access Admin Panel
```
Open browser: http://localhost:1337/admin
Create admin user
Start building content types!
```

---

## 📊 ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────┐
│         Your Applications               │
├─────────────────────────────────────────┤
│  React Frontend │ Strapi CMS │ Backend  │
├─────────────────────────────────────────┤
│          ↓↓↓ Database Connection         │
├─────────────────────────────────────────┤
│     PostgreSQL (103.191.208.235)        │
│                                         │
│  Database: newskarnataka               │
│  User: news                            │
│  Tables: 30+ (articles, users, etc)    │
│  Size: ~500MB (55K articles)           │
├─────────────────────────────────────────┤
│      Optional Services                 │
│  Redis Cache │ Elasticsearch │ S3      │
└─────────────────────────────────────────┘
```

---

## 🔒 SECURITY BEST PRACTICES

### ✅ DO
- Store credentials in .env (not in code)
- Use different passwords for dev/staging/prod
- Enable SSL for all connections
- Limit database access to your app servers only
- Rotate passwords quarterly
- Monitor access logs
- Backup database regularly

### ❌ DON'T
- Commit .env to Git
- Use same credentials everywhere
- Hardcode passwords in code
- Share credentials via email/chat
- Use weak passwords
- Disable SSL
- Store backups on same server

---

## 🆘 SUPPORT & HELP

### Common Issues Quick Fixes

| Issue | Solution |
|-------|----------|
| Can't connect | Check host is 103.191.208.235, user is "news" |
| SSL errors | Make sure DB_SSL=true in config |
| Too slow | Check connection pool settings |
| Table not found | Run DATABASE_IMPLEMENTATION_SCRIPTS.sql |
| Memory issues | Increase Docker memory: `docker-compose.yml` |
| Port in use | Change port in docker-compose.yml |

### Get Help
1. Check `DATABASE_CONNECTION_SETUP.md` for detailed guide
2. Review `STRAPI_DATABASE_CONFIGURATION.md` for Strapi-specific issues
3. See `PRODUCTION_DATABASE_CREDENTIALS.md` for security questions

---

## ⏱️ TYPICAL SETUP TIMES

```
Direct Connection:              5 minutes
  └─ Just connect via psql

Strapi Setup:                  15 minutes
  └─ Create project + configure + start

Docker Full Stack:             10 minutes
  └─ docker-compose up + wait for services

Database Schema Setup:          5 minutes
  └─ Run SQL initialization scripts
```

---

## 📞 TEAM ACCESS

**Database Host:** 103.191.208.235  
**For Access:** Contact your DevOps/Database Administrator

Authorized Users:
- [ ] Backend Team (full access)
- [ ] Frontend Team (via API only)
- [ ] DevOps Team (admin access)
- [ ] Analytics Team (read-only access)

---

## 🎯 YOU'RE ALL SET!

Your database connection is ready. You can now:

✅ Connect from any application  
✅ Deploy with Docker  
✅ Set up Strapi CMS  
✅ Begin development  
✅ Migrate data from WordPress  

---

**Status:** ✅ **READY FOR DEVELOPMENT**

**Next Actions:**
1. Verify connection (run verification checklist)
2. Choose your setup path (psql / Strapi / Docker)
3. Follow the setup steps
4. Start building your application!

---

**Questions?** See the detailed documentation files listed above.

**Date Created:** September 2026  
**Last Updated:** September 2026


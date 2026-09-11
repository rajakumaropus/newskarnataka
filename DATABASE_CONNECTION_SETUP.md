# PostgreSQL Database Connection Setup
## NewsKarnataka Project - Production Database Configuration

**Database Server:** 103.191.208.235  
**Database Name:** newskarnataka  
**Database User:** news  
**Port:** 5432 (standard)  
**Date:** September 2026

---

## 🔐 DATABASE CREDENTIALS

```
Host:     103.191.208.235
Port:     5432
Database: newskarnataka
User:     news
Password: news321
```

⚠️ **SECURITY WARNING:** These credentials should be stored in:
- Environment variables (.env file - NOT committed to git)
- AWS Secrets Manager (production)
- Vault system (enterprise)
- Never hardcoded in source files

---

## SECTION 1: DIRECT DATABASE CONNECTION

### 1.1 Connect via psql (Command Line)

```bash
# Option 1: Full connection string
psql -h 103.191.208.235 -U news -d newskarnataka -p 5432

# Option 2: Using connection string
psql "postgresql://news:news321@103.191.208.235:5432/newskarnataka"

# Option 3: Using environment variables
export PGHOST=103.191.208.235
export PGUSER=news
export PGPASSWORD=news321
export PGDATABASE=newskarnataka
psql
```

### 1.2 Test Connection

```bash
# Test connectivity from command line
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT version();"

# Expected output (PostgreSQL version info)
# If connection fails, check:
# - Network connectivity (ping 103.191.208.235)
# - Firewall rules (port 5432 open?)
# - Credentials correct?
```

---

## SECTION 2: STRAPI CONFIGURATION

### 2.1 Strapi 5.x PostgreSQL Setup

```javascript
// config/database.js (Strapi configuration)

const parse = require('pg-connection-string').parse;

const config = parse(process.env.DATABASE_URL || 
  'postgresql://news:news321@103.191.208.235:5432/newskarnataka'
);

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DB_HOST', '103.191.208.235'),
      port: env.int('DB_PORT', 5432),
      database: env('DB_NAME', 'newskarnataka'),
      user: env('DB_USER', 'news'),
      password: env('DB_PASSWORD', 'news321'),
      ssl: env.bool('DB_SSL', true),
      schema: env('DB_SCHEMA', 'public'),
    },
    useNullAsDefault: true,
    debug: env.bool('DB_DEBUG', false),
    pool: {
      min: env.int('DB_POOL_MIN', 5),
      max: env.int('DB_POOL_MAX', 20),
      acquireTimeoutMillis: env.int('DB_CONNECTION_TIMEOUT', 10000),
      idleTimeoutMillis: env.int('DB_IDLE_TIMEOUT', 30000),
    },
  },
});
```

### 2.2 Strapi .env File

```bash
# .env (place in Strapi root directory)

# Database
DATABASE_URL=postgresql://news:news321@103.191.208.235:5432/newskarnataka
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true

# Strapi
NODE_ENV=production
STRAPI_PORT=1337
ADMIN_JWT_SECRET=your-super-secret-change-this
JWT_SECRET=your-jwt-secret-change-this
API_TOKEN_SALT=your-api-token-salt-change-this
```

### 2.3 Initialize Strapi with PostgreSQL

```bash
# Create new Strapi project with PostgreSQL
npx create-strapi-app@latest newskarnataka-cms --quickstart

# Or for existing project, update package.json:
npm install pg

# Then run migrations
npm run build
npm start
```

---

## SECTION 3: BACKEND APPLICATION SETUP

### 3.1 Node.js / Express Configuration

```javascript
// db/connection.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '103.191.208.235',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'newskarnataka',
  user: process.env.DB_USER || 'news',
  password: process.env.DB_PASSWORD || 'news321',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
});

// Log pool events
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', (client) => {
  console.log('New connection to database');
});

module.exports = pool;
```

### 3.2 Sequelize ORM Configuration

```javascript
// config/database.js (Sequelize)
module.exports = {
  development: {
    username: process.env.DB_USER || 'news',
    password: process.env.DB_PASSWORD || 'news321',
    database: process.env.DB_NAME || 'newskarnataka',
    host: process.env.DB_HOST || '103.191.208.235',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    ssl: process.env.DB_SSL === 'true',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: parseInt(process.env.DB_POOL_MIN) || 5,
      acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
      idle: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
    },
    logging: process.env.DB_DEBUG === 'true' ? console.log : false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 10000,
      idle: 30000,
    },
    logging: false,
  },
};
```

### 3.3 TypeORM Configuration

```javascript
// ormconfig.js (TypeORM)
module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || '103.191.208.235',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'news',
  password: process.env.DB_PASSWORD || 'news321',
  database: process.env.DB_NAME || 'newskarnataka',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  synchronize: false, // Use migrations instead
  logging: process.env.DB_DEBUG === 'true',
  ssl: process.env.DB_SSL === 'true',
  extra: {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: parseInt(process.env.DB_POOL_MAX) || 20,
    min: parseInt(process.env.DB_POOL_MIN) || 5,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
  },
};
```

---

## SECTION 4: DOCKER CONFIGURATION

### 4.1 Docker Compose for Local Development

```yaml
# docker-compose.yml (connecting to remote PostgreSQL)

version: '3.8'

services:
  # Remote PostgreSQL (external)
  # postgresql:
  #   Skip - using external server at 103.191.208.235

  # Strapi CMS
  strapi:
    image: node:18-alpine
    container_name: newskarnataka-strapi
    working_dir: /app
    volumes:
      - ./strapi:/app
    ports:
      - "1337:1337"
    environment:
      DB_HOST: 103.191.208.235
      DB_PORT: 5432
      DB_USER: news
      DB_PASSWORD: news321
      DB_NAME: newskarnataka
      DB_SSL: "true"
      NODE_ENV: production
      STRAPI_PORT: 1337
    command: npm start
    depends_on:
      - redis

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: newskarnataka-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Backend API (optional)
  backend:
    image: node:18-alpine
    container_name: newskarnataka-backend
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "3000:3000"
    environment:
      DB_HOST: 103.191.208.235
      DB_PORT: 5432
      DB_USER: news
      DB_PASSWORD: news321
      DB_NAME: newskarnataka
      DB_SSL: "true"
      NODE_ENV: production
    command: npm start
    depends_on:
      - redis

volumes:
  redis_data:
```

### 4.2 Run Docker Container

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f strapi

# Test connection
docker-compose exec strapi npm run db:check

# Stop services
docker-compose down
```

---

## SECTION 5: MIGRATION & DATA SETUP

### 5.1 Run Initial Database Setup

```bash
# Option 1: Using psql directly
psql -h 103.191.208.235 -U news -d newskarnataka -f DATABASE_IMPLEMENTATION_SCRIPTS.sql

# Option 2: Using pgAdmin
# 1. Open pgAdmin (web UI)
# 2. Connect to 103.191.208.235
# 3. Select newskarnataka database
# 4. Run SQL scripts from Query Editor

# Option 3: Using Strapi migrations
npx strapi database:migrate up
```

### 5.2 Verify Database Setup

```sql
-- Connect to database
psql -h 103.191.208.235 -U news -d newskarnataka

-- Check database exists
\l newskarnataka

-- List tables
\dt

-- Expected tables (from our design):
-- articles, users, categories, comments, likes, shares
-- article_sources, article_submissions, article_submission_history
-- activity_logs, audit_logs, roles, permissions, etc.

-- Check record counts
SELECT table_name, 
       (SELECT count(*) FROM information_schema.tables 
        WHERE table_schema = 'public') as table_count
FROM information_schema.tables 
WHERE table_schema = 'public'
GROUP BY table_name;

-- Test insert
INSERT INTO roles (name, code, description, is_system_role) 
VALUES ('test', 'test_role', 'Test role', true);

-- Verify
SELECT * FROM roles WHERE code = 'test_role';
```

---

## SECTION 6: PERFORMANCE TUNING

### 6.1 Connection Pool Configuration

```javascript
// Recommended pool settings for production
const poolConfig = {
  min: 5,              // Minimum idle connections
  max: 20,             // Maximum connections (adjust based on load)
  acquireTimeoutMillis: 10000,   // Wait max 10s to get connection
  idleTimeoutMillis: 30000,      // Close idle connections after 30s
  reapIntervalMillis: 1000,      // Check for idle connections every 1s
};
```

### 6.2 Query Optimization

```javascript
// Use connection pooling for all queries
const result = await pool.query(
  'SELECT * FROM articles WHERE id = $1',
  [articleId]
);

// Prepared statements (prevents SQL injection)
const { rows } = await pool.query(
  'INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *',
  [title, content]
);

// Batch operations
const queries = articles.map((article, index) => ({
  text: 'INSERT INTO articles (title, content) VALUES ($1, $2)',
  values: [article.title, article.content]
}));
await pool.query(queries);
```

### 6.3 Index Management

```sql
-- Check missing indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Monitor query performance
EXPLAIN ANALYZE
SELECT * FROM articles WHERE category_id = 'uuid' LIMIT 10;

-- Create indexes for frequently queried columns
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE status = 'published';
```

---

## SECTION 7: BACKUP & DISASTER RECOVERY

### 7.1 Create Database Backup

```bash
# Full database backup
pg_dump -h 103.191.208.235 -U news -d newskarnataka > backup_newskarnataka.sql

# Backup with compression
pg_dump -h 103.191.208.235 -U news -d newskarnataka | gzip > backup_newskarnataka.sql.gz

# Backup specific table
pg_dump -h 103.191.208.235 -U news -d newskarnataka -t articles > backup_articles.sql

# Scheduled backup (cron job)
# Add to crontab:
# 0 2 * * * pg_dump -h 103.191.208.235 -U news -d newskarnataka | gzip > /backups/newskarnataka_$(date +\%Y\%m\%d).sql.gz
```

### 7.2 Restore from Backup

```bash
# Restore full database
psql -h 103.191.208.235 -U news -d newskarnataka < backup_newskarnataka.sql

# Restore from compressed backup
gunzip -c backup_newskarnataka.sql.gz | psql -h 103.191.208.235 -U news -d newskarnataka

# Restore specific table
psql -h 103.191.208.235 -U news -d newskarnataka < backup_articles.sql
```

---

## SECTION 8: MONITORING & HEALTH CHECKS

### 8.1 Database Health Check

```javascript
// Health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});
```

### 8.2 Monitor Active Connections

```sql
-- Check active connections
SELECT 
  datname,
  usename,
  application_name,
  state,
  query,
  query_start
FROM pg_stat_activity
WHERE datname = 'newskarnataka'
ORDER BY query_start DESC;

-- Kill idle connections (if needed)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'newskarnataka'
  AND state = 'idle'
  AND query_start < NOW() - INTERVAL '30 minutes';
```

### 8.3 Database Statistics

```sql
-- Database size
SELECT 
  datname as database,
  pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
WHERE datname = 'newskarnataka';

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index sizes
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## SECTION 9: TROUBLESHOOTING

### Issue 1: Connection Refused

```bash
# Check if database is running
ping 103.191.208.235

# Check port 5432 is open
nc -zv 103.191.208.235 5432

# Check firewall
sudo ufw status
sudo ufw allow 5432/tcp

# Verify credentials
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"
```

### Issue 2: SSL Connection Error

```javascript
// If SSL error occurs, try:
const pool = new Pool({
  host: '103.191.208.235',
  port: 5432,
  database: 'newskarnataka',
  user: 'news',
  password: 'news321',
  ssl: {
    rejectUnauthorized: false  // Only for development!
  }
});
```

### Issue 3: Too Many Connections

```sql
-- Check connection limits
SHOW max_connections;

-- Increase pool idle timeout to close unused connections
-- In config: idleTimeoutMillis: 15000  // 15 seconds instead of 30

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'newskarnataka'
  AND state = 'idle'
  AND now() - pg_stat_activity.state_change > interval '5 minutes';
```

### Issue 4: Slow Queries

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s
SELECT pg_reload_conf();

-- Check slow queries log
SHOW log_directory;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM articles WHERE status = 'published' LIMIT 10;
```

---

## SECTION 10: SECURITY BEST PRACTICES

### 10.1 Environment Variables (.env)

```bash
# NEVER commit .env file to git
# Add to .gitignore:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# Use .env.example for reference
cp .env.example .env

# Use environment-specific files
.env              # Local development
.env.production   # Production (on server)
.env.staging      # Staging (on server)
```

### 10.2 Database User Permissions

```sql
-- Create read-only user for analytics
CREATE USER news_readonly WITH PASSWORD 'readonly_pass';
GRANT CONNECT ON DATABASE newskarnataka TO news_readonly;
GRANT USAGE ON SCHEMA public TO news_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO news_readonly;

-- Create API user with limited permissions
CREATE USER news_api WITH PASSWORD 'api_pass';
GRANT CONNECT ON DATABASE newskarnataka TO news_api;
GRANT USAGE ON SCHEMA public TO news_api;
GRANT SELECT, INSERT, UPDATE ON articles TO news_api;
GRANT SELECT, INSERT, UPDATE ON comments TO news_api;

-- Review user permissions
SELECT usename, usesuper, usecreatedb FROM pg_user;
```

### 10.3 SSL Configuration

```javascript
// Always use SSL in production
const pool = new Pool({
  host: '103.191.208.235',
  port: 5432,
  database: 'newskarnataka',
  user: 'news',
  password: 'news321',
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});
```

---

## SECTION 11: IMPLEMENTATION CHECKLIST

- [ ] Test connection from local machine
- [ ] Create .env file with credentials
- [ ] Configure Strapi with PostgreSQL
- [ ] Run database initialization scripts
- [ ] Verify all tables created
- [ ] Test sample queries
- [ ] Configure connection pooling
- [ ] Set up database backups
- [ ] Configure monitoring/health checks
- [ ] Document database access procedures
- [ ] Train team on database access
- [ ] Set up alerts for connection issues

---

## QUICK REFERENCE

### Connection String
```
postgresql://news:news321@103.191.208.235:5432/newskarnataka
```

### psql Quick Command
```bash
psql -h 103.191.208.235 -U news -d newskarnataka
```

### Test Query
```sql
SELECT COUNT(*) as article_count FROM articles;
```

### Environment Variables
```bash
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true
```

---

**Status:** ✅ **DATABASE CONNECTION CONFIGURED**

**Ready for:**
- Strapi integration
- Backend API development
- Data migration from WordPress
- Production deployment

**Next Steps:**
1. Copy .env.example to .env
2. Update credentials (already provided)
3. Test connection
4. Run database setup scripts
5. Begin Strapi installation

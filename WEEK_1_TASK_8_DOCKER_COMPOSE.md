# 🐳 WEEK 1 - TASK 8: Docker Compose Setup
## Complete local development infrastructure

**Task:** Create Docker Compose for all services (Strapi, PostgreSQL, Redis, Elasticsearch)  
**Duration:** 2-3 hours  
**Status:** IN PROGRESS  

---

## 📋 OVERVIEW

**Services to containerize:**
1. PostgreSQL - Database
2. Strapi - CMS Backend
3. Elasticsearch - Search
4. Redis - Cache & Sessions
5. pgAdmin - Database UI (optional)
6. Nginx - Reverse Proxy (optional)

---

## 🔧 DOCKER COMPOSE FILE

**File: `docker-compose.yml`** (at workspace root)

```yaml
version: '3.9'

services:
  # ===== DATABASE =====
  postgres:
    image: postgres:15-alpine
    container_name: newskarnataka_postgres
    environment:
      POSTGRES_USER: ${DATABASE_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-postgres}
      POSTGRES_DB: ${DATABASE_NAME:-newskarnataka}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8"
    ports:
      - "${DATABASE_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - newskarnataka_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ===== STRAPI CMS =====
  strapi:
    image: node:18-alpine
    container_name: newskarnataka_strapi
    working_dir: /app/strapi
    command: npm run develop
    environment:
      NODE_ENV: development
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: ${DATABASE_NAME:-newskarnataka}
      DATABASE_USERNAME: ${DATABASE_USERNAME:-postgres}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD:-postgres}
      DATABASE_SSL: 'false'
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET:-change_me}
      TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT:-change_me}
      API_TOKEN_SALT: ${API_TOKEN_SALT:-change_me}
      STRAPI_ADMIN_URL: http://localhost:1337/admin
      STRAPI_API_URL: http://localhost:1337
      ELASTICSEARCH_HOST: elasticsearch
      ELASTICSEARCH_PORT: 9200
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "${STRAPI_PORT:-1337}:1337"
    volumes:
      - ./strapi:/app/strapi
      - node_modules_strapi:/app/strapi/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      elasticsearch:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - newskarnataka_network
    restart: unless-stopped

  # ===== ELASTICSEARCH =====
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    container_name: newskarnataka_elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - cluster.name=newskarnataka
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - newskarnataka_network
    restart: unless-stopped
    healthcheck:
      test: curl -s http://localhost:9200 >/dev/null || exit 1
      interval: 30s
      timeout: 10s
      retries: 5

  # ===== REDIS =====
  redis:
    image: redis:7-alpine
    container_name: newskarnataka_redis
    command: redis-server --appendonly yes
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    networks:
      - newskarnataka_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ===== PGADMIN (Optional) =====
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: newskarnataka_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@newskarnataka.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - newskarnataka_network
    restart: unless-stopped
    depends_on:
      - postgres

  # ===== NGINX REVERSE PROXY (Optional) =====
  nginx:
    image: nginx:alpine
    container_name: newskarnataka_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    networks:
      - newskarnataka_network
    restart: unless-stopped
    depends_on:
      - strapi

volumes:
  postgres_data:
    driver: local
  elasticsearch_data:
    driver: local
  redis_data:
    driver: local
  pgadmin_data:
    driver: local
  node_modules_strapi:
    driver: local

networks:
  newskarnataka_network:
    driver: bridge
```

---

## 🔧 ENVIRONMENT FILE

**File: `.env.docker`** (or use `.env.local`)

```bash
# Docker Compose Environment

NODE_ENV=development

# Database
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=newskarnataka
DATABASE_PORT=5432

# Strapi
STRAPI_PORT=1337
ADMIN_JWT_SECRET=my_super_secret_jwt_key_change_this
TRANSFER_TOKEN_SALT=transfer_token_salt_change_this
API_TOKEN_SALT=api_token_salt_change_this

# Redis
REDIS_PORT=6379

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=newskarnataka
```

---

## 🗄️ DATABASE INITIALIZATION SCRIPT

**File: `scripts/init-db.sql`**

```sql
-- Initialize database with existing collections

-- Check if tables exist, if not create them
-- This runs when PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create tables for AI Console collections
CREATE TABLE IF NOT EXISTS article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  code VARCHAR(50) UNIQUE NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  description TEXT,
  source_url VARCHAR(2000),
  contact_name VARCHAR(200),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  requires_manual_approval BOOLEAN DEFAULT true,
  ai_validation_required BOOLEAN DEFAULT true,
  confidence_threshold NUMERIC(5,4),
  auto_publish_enabled BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 50,
  daily_submission_limit INTEGER,
  is_active BOOLEAN DEFAULT true,
  total_articles_submitted INTEGER DEFAULT 0,
  total_articles_published INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sources_code ON article_sources(code);
CREATE INDEX IF NOT EXISTS idx_sources_active ON article_sources(is_active);

-- Add sample data
INSERT INTO article_sources (name, code, source_type, trust_score, is_active)
VALUES 
  ('WhatsApp Groups', 'WHATSAPP', 'social_media', 70, true),
  ('Twitter Feed', 'TWITTER', 'social_media', 80, true),
  ('Staff Reporters', 'STAFF', 'staff_reporter', 95, true),
  ('Wire Services', 'WIRE', 'wire_agency', 98, true),
  ('User Submissions', 'USER', 'user_submission', 60, true)
ON CONFLICT (code) DO NOTHING;
```

---

## 🚀 QUICK START COMMANDS

### Start Services

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f strapi
docker-compose logs -f postgres
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Execute Commands in Containers

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d newskarnataka

# Access Strapi shell
docker-compose exec strapi npm run strapi console

# Access Redis CLI
docker-compose exec redis redis-cli

# View container status
docker-compose ps
```

---

## 🔍 ACCESSING SERVICES

| Service | URL | Credentials |
|---------|-----|-------------|
| Strapi Admin | http://localhost:1337/admin | Set during first login |
| Strapi API | http://localhost:1337 | No auth required for public |
| pgAdmin | http://localhost:5050 | admin@newskarnataka.com / admin123 |
| Elasticsearch | http://localhost:9200 | No auth |
| Redis | localhost:6379 | No auth (local only) |
| PostgreSQL | localhost:5432 | postgres / postgres |

---

## 🛠️ USEFUL DOCKER COMMANDS

### Container Management

```bash
# List all containers
docker ps -a

# View container logs
docker logs -f container_name

# Execute command in container
docker exec -it container_name bash

# Copy file to/from container
docker cp container_name:/path/to/file ./local/path
docker cp ./local/file container_name:/path/to/file
```

### Debugging

```bash
# Inspect container
docker inspect container_name

# Check resource usage
docker stats

# View network
docker network ls
docker inspect newskarnataka_network
```

### Cleanup

```bash
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything (be careful!)
docker system prune -a
```

---

## 📊 HEALTH CHECKS

### Test PostgreSQL

```bash
docker-compose exec postgres pg_isready -U postgres
# Response: accepting connections
```

### Test Elasticsearch

```bash
curl http://localhost:9200/_cluster/health
# Response: {"status":"green",...}
```

### Test Redis

```bash
docker-compose exec redis redis-cli ping
# Response: PONG
```

### Test Strapi

```bash
curl http://localhost:1337/admin
# Should return HTML
```

---

## 🔐 PRODUCTION CONSIDERATIONS

**For production deployments:**

1. **Use Docker Secrets** instead of env vars for sensitive data
2. **Enable SSL/TLS** in Elasticsearch
3. **Set resource limits** (memory, CPU)
4. **Use health checks** (already configured)
5. **Implement backup strategy** for volumes
6. **Use external database** instead of container
7. **Enable authentication** on Redis
8. **Use managed services** (RDS, ElastiCache, etc.)

**Example production compose:**

```yaml
postgres:
  # ... use external managed database
  environment:
    DATABASE_HOST: prod-db.newskarnataka.internal

elasticsearch:
  # ... use cloud service
  environment:
    ELASTICSEARCH_HOSTS: https://elastic.prod.newskarnataka.com
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Docker and Docker Compose installed
- [ ] `docker-compose.yml` created
- [ ] `.env.docker` configured
- [ ] All services start without errors
- [ ] PostgreSQL is healthy and accessible
- [ ] Strapi admin accessible at http://localhost:1337/admin
- [ ] Elasticsearch returning cluster health
- [ ] Redis accepting connections
- [ ] Sample data in database
- [ ] Logs show no errors

---

## 🎯 POST-SETUP

After Docker Compose is running:

1. **Configure Strapi collections** (Task #3 - done via UI)
2. **Create test data** in collections
3. **Test API endpoints** via Postman or curl
4. **Start Next.js project**: `npm run dev` (port 3000)
5. **Start React Console**: `npm run dev` (port 5173)

---

## 🚀 WEEK 1 COMPLETION

After all 8 tasks complete:

✅ Next.js public website (Task #1)  
✅ React AI Console (Task #2)  
✅ Strapi collections (Task #3)  
✅ GitHub CI/CD (Task #4)  
✅ Elasticsearch (Task #5)  
✅ Redis (Task #6)  
✅ .env files (Task #7)  
✅ Docker Compose (Task #8)  

**Then:** Begin Week 2 - Actual implementation (frontend, backend, AI pipeline)

---

**Status: READY FOR EXECUTION**


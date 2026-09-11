# Technology Stack Specification
## newskarnataka Migration: WordPress to Strapi + AI Console

**Project:** newskarnataka.com CMS Migration  
**Status:** Pre-Implementation Planning  
**Date:** September 2026  
**Prepared For:** Infrastructure & Development Teams

---

## EXECUTIVE OVERVIEW

This document defines the complete technology stack required for migrating newskarnataka.com from WordPress to Strapi with AI-enabled console. The stack is designed for:
- ✅ **High performance** (2-3x faster than WordPress)
- ✅ **Scalability** (handle 55K articles + growth to 250K users)
- ✅ **AI integration** (Groq LLM, real-time validation)
- ✅ **Zero-downtime** (parallel operation, blue-green deployment)
- ✅ **Enterprise reliability** (99.9%+ availability)

---

## PART 1: BACKEND TECHNOLOGY STACK

### 1.1 Application Runtime & Framework

| Component | Specification | Justification |
|-----------|---|---|
| **Node.js** | v18.x (LTS) or v20.x | Mature, high performance, excellent ecosystem |
| **Runtime** | Node.js 18+ with npm 9+ | Stable LTS version, security updates guaranteed |
| **Package Manager** | npm v9+ | Standard, integrated with Node.js |
| **Language** | TypeScript 5.x | Type safety, better IDE support, fewer bugs |
| **Framework** | Strapi 5.x | Headless CMS optimized for APIs, extensible |

**Why TypeScript?**
- Type checking prevents common errors
- Better tooling and IDE autocompletion
- Easier maintenance for large team
- Catches bugs at compile time, not runtime

**Why Strapi 5.x?**
- Latest version with performance improvements
- Native REST + GraphQL APIs
- Webhook support (critical for AI integration)
- Content versioning & audit trails
- Flexible content model (no schema limitations)

### 1.2 Database & Data Layer

| Component | Specification | Purpose |
|-----------|---|---|
| **Primary Database** | PostgreSQL 14+ | Relational data, strong consistency |
| **Connection Pool** | PgBouncer or pg-pool | Connection management, performance |
| **Query Builder** | Sequelize or Prisma | ORM, type-safe queries |
| **Database Hosting** | AWS RDS PostgreSQL (Multi-AZ) | Managed service, automated backups |
| **Read Replicas** | 1-2 read replicas | Scale read-heavy queries, analytics |

**PostgreSQL Specifications:**
```
Version:              14.8 or newer
Instance Type:        db.t4g.xlarge (prod), db.t4g.large (staging)
Multi-AZ:             Enabled (automatic failover)
Storage:              500 GB gp3 (production), expandable
Backup:               Daily automated, 30-day retention
Performance Insights: Enabled
Enhanced Monitoring:  Enabled (1-minute granularity)
```

**Connection Pool Configuration:**
```
Max connections:      300
Min connections:      50
Queue timeout:        30 seconds
Idle timeout:         900 seconds (15 min)
Connection TTL:       1 hour
```

### 1.3 Caching Layer

| Component | Specification | Purpose |
|-----------|---|---|
| **In-Memory Cache** | Redis 7.x | Session cache, query results, real-time counters |
| **Hosting** | AWS ElastiCache Redis | Managed service, high availability |
| **Mode** | Cluster mode disabled (simplified) or enabled (scale) | Start without cluster, upgrade if needed |
| **Data Structure** | String, Hash, List, Set, Sorted Set | Flexible data modeling |

**Redis Specifications:**
```
Version:              7.0 or 7.2
Node Type:            cache.t4g.large (prod)
Nodes:                1 primary, 1 replica (high availability)
Automatic Failover:   Enabled
Backup:               Daily snapshots
Eviction Policy:      allkeys-lru (remove least recently used)
Max Memory:           16 GB (expandable)
```

**Redis Usage Patterns:**
```
Session Store:        Sessions + user preferences (TTL: 24 hours)
Query Cache:          Frequently accessed articles (TTL: 1 hour)
Real-time Counters:   Page views, engagement metrics (perpetual)
Rate Limiting:        API rate limits per user (TTL: 1 hour)
Task Queue:           Background jobs (BullMQ)
```

### 1.4 Search & Indexing

| Component | Specification | Purpose |
|-----------|---|---|
| **Full-Text Search** | Elasticsearch 8.x | Complex search, filtering, faceting |
| **Hosting** | AWS OpenSearch or self-hosted | Managed alternative or full control |
| **Index Strategy** | One index per content type (articles, users, etc.) | Better management, easier reindexing |
| **Query Language** | Elasticsearch Query DSL | Standard, powerful search capabilities |

**Elasticsearch Specifications:**
```
Version:              8.9 or latest
Cluster Size:         3 master nodes + 2 data nodes (prod)
Data Node Type:       m5.xlarge.elasticsearch
Storage:              500 GB gp2 per node (expandable)
Replica Shards:       2 per index (high availability)
Refresh Interval:     5 seconds (near real-time)
```

**Index Design:**
```
articles
├── article_id (keyword)
├── title (text, analyzed)
├── content (text, analyzed)
├── category (keyword)
├── tags (keyword)
├── locations (geo_point)
├── author (keyword)
├── published_at (date)
└── view_count (integer)

Analyzer: Standard analyzer for English + Kannada
Tokenizer: Standard tokenizer with lowercase
```

### 1.5 Message Queue & Background Jobs

| Component | Specification | Purpose |
|-----------|---|---|
| **Queue Service** | BullMQ (Redis-based) | Reliable job processing, retries |
| **Workers** | Node.js worker threads | Process background tasks in parallel |
| **Persistent Storage** | Redis (via BullMQ) | Queue durability, job state |

**BullMQ Configuration:**
```
Redis Connection:     ElastiCache Redis
Max Concurrency:      10 workers (adjustable)
Job Timeout:          30 minutes (default)
Max Retries:          3 attempts
Backoff Strategy:     Exponential (1s, 2s, 4s)
Job Lifetime:         Keep for 30 days (archived)
```

**Use Cases:**
- Content migration batches (100-500 articles)
- Image processing (resize, optimize)
- Elasticsearch re-indexing
- Search index updates
- Email notifications
- AI validation queues (Groq API calls)

### 1.6 Migration Adapter

| Component | Specification | Purpose |
|-----------|---|---|
| **Framework** | Node.js + Express | API endpoints for migration control |
| **WordPress Connection** | REST API or read-only DB replica | Extract WordPress data |
| **Transformation** | Custom transformation pipeline | Convert WordPress → Strapi format |
| **Validation** | JSON Schema + custom rules | Ensure data integrity |
| **Retry Logic** | Exponential backoff in BullMQ | Handle transient failures |

**Adapter Architecture:**
```
WordPress Data Source
        │
        ├─ REST API endpoint (http://oldsite.com/wp-json/)
        └─ MySQL read-only replica (if API insufficient)
        │
        ▼
Extractor Service (Node.js)
├─ Paginate through WordPress records (1000 at a time)
├─ Extract post metadata, categories, tags, images
└─ Place batches in Redis queue
        │
        ▼
Transformer Service (Node.js)
├─ Sanitize HTML content
├─ Convert Gutenberg blocks → Strapi rich text
├─ Rewrite image URLs
├─ Map taxonomies to Strapi vocabulary
└─ Update batch status in queue
        │
        ▼
Loader Service (Node.js)
├─ Create/update Strapi records via REST API
├─ Handle rate limiting & retries
├─ Log success/failure for reconciliation
└─ Update import_batch table with results
        │
        ▼
Validation Service (Node.js)
├─ Compare source vs destination counts
├─ Field-level checksum validation
├─ Generate migration report
└─ List exceptions for manual review
```

---

## PART 2: FRONTEND TECHNOLOGY STACK

### 2.1 Mobile Application

| Component | Specification | Purpose |
|-----------|---|---|
| **Framework** | Flutter 3.x (stable) | Single codebase for iOS/Android |
| **Language** | Dart 3.x | Type-safe, performant mobile development |
| **State Management** | Riverpod or Provider | Modern, composable state management |
| **API Integration** | HTTP client (http package) or Dio | Clean API consumption |
| **Local Storage** | Hive or Drift | Offline persistence, fast access |
| **Analytics** | Firebase Analytics or Mixpanel | User engagement tracking |

**Flutter Specifications:**
```
Version:              3.13+ (stable channel)
iOS Support:          iOS 11.0+
Android Support:      Android 5.0+ (API level 21+)
Performance Target:   60 FPS minimum, 120 FPS preferred
App Size:             < 50 MB (iOS), < 80 MB (Android)
```

**Key Dependencies:**
```
http: ^1.1.0                 # HTTP requests
riverpod: ^2.4.0             # State management
drift: ^2.13.0               # Local database
firebase_analytics: ^10.5.0  # Analytics
cached_network_image: ^3.3.0 # Image caching
intl: ^0.19.0                # Internationalization (Kannada support)
```

**Build & Deployment:**
```
iOS:      AppStore (requires Apple Developer Account)
Android:  Google Play Store
CI/CD:    GitHub Actions for automated builds
Signing:  Code signing certificates managed
```

### 2.2 Web Application (PWA)

| Component | Specification | Purpose |
|-----------|---|---|
| **Framework** | React 18.x | Component-based UI, excellent ecosystem |
| **Meta Framework** | Next.js 14.x | Server-side rendering, static generation, API routes |
| **Language** | TypeScript 5.x | Type safety, better IDE support |
| **State Management** | Zustand or Redux Toolkit | Lightweight, predictable state |
| **Data Fetching** | React Query (TanStack Query) | Server state management, caching |
| **Styling** | Tailwind CSS 3.x | Utility-first CSS, rapid development |
| **UI Components** | Shadcn/ui or Material-UI | Reusable, accessible components |
| **PWA Features** | Service Workers + Web App Manifest | Offline capability, installable |

**Next.js Specifications:**
```
Version:              14.x
Rendering:            SSR (Server-side rendering)
Static Generation:    ISR (Incremental Static Regeneration)
Image Optimization:   Next Image component (automatic WebP)
Performance:          Core Web Vitals optimized
```

**Deployment:**
```
Hosting:              Vercel or AWS Amplify
Auto-deployment:      On git push to main branch
CDN:                  Built-in (Vercel) or CloudFront (AWS)
SSL/TLS:              Automatic with HTTPS
```

### 2.3 Admin Dashboard (Strapi Console)

| Component | Specification | Purpose |
|-----------|---|---|
| **Framework** | React 18.x + Next.js | Match main app stack |
| **State Management** | Zustand | Lightweight for admin UX |
| **Real-time Updates** | WebSockets (Socket.io) | Live feed of article updates |
| **Data Visualization** | Recharts or Chart.js | Engagement metrics, analytics |
| **Tables** | TanStack Table (React Table) | Large dataset handling |

**Real-time Architecture:**
```
Server (Strapi):      Emit WebSocket events on content changes
Client (Dashboard):   Subscribe to article updates
Libraries:            Socket.io for real-time communication
Fallback:             Polling every 5 minutes if WebSocket fails
```

---

## PART 3: AI/ML TECHNOLOGY STACK

### 3.1 LLM Integration

| Component | Specification | Purpose |
|-----------|---|---|
| **Primary LLM** | Groq Mixtral 8x7b | Ultra-fast inference (<100ms), cost-effective |
| **Backup LLM** | OpenAI GPT-4 Turbo | High accuracy, edge case handling |
| **Fallback LLM** | Google Gemini Pro | Cost-effective fallback, diverse capability |
| **SDK** | Groq Python SDK or REST API | Direct API integration for performance |

**Groq Configuration:**
```
Model:                mixtral-8x7b-32768
Temperature:          0.3 (low for consistency)
Max Tokens:           500 (validation response size)
Rate Limit:           Async batch processing
Timeout:              10 seconds per request
Retry Logic:          3 attempts with exponential backoff
```

**Cost Management:**
```
Groq Rate:            ~$0.35 per 1000 stories
Daily Volume:         1000 stories = $0.35/day
Monthly Budget:       $10-15 for validation service
Token Allocation:     Input: 150-200 tokens, Output: 50-100 tokens
```

### 3.2 Content Validation Pipeline

| Component | Specification | Purpose |
|-----------|---|---|
| **Language** | Python 3.11+ | ML/AI ecosystem advantage |
| **Framework** | FastAPI | High-performance async API |
| **ML Libraries** | Scikit-learn, TensorFlow | Engagement prediction, ML models |
| **NLP** | spaCy, NLTK | Named entity recognition, linguistic analysis |
| **Fact-checking** | Integration with fact-check APIs | Cross-reference verification |

**Python Service Stack:**
```
fastapi: ^0.104.0        # Web framework
groq: ^0.4.1             # Groq LLM client
pydantic: ^2.5.0         # Data validation
sqlalchemy: ^2.0.23      # Database ORM
redis: ^5.0.1            # Cache client
httpx: ^0.25.2           # Async HTTP requests
```

**AI Validation Pipeline:**
```
Input Article
    │
    ▼
1. Text Preprocessing
   ├─ Remove HTML/shortcodes
   ├─ Normalize Unicode (Kannada)
   └─ Tokenization
    │
    ▼
2. Groq LLM Analysis (<100ms)
   ├─ Content understanding
   ├─ Quality assessment
   ├─ Misinformation detection
   └─ Priority assignment (RED/ORANGE/YELLOW/GREEN/BLACK)
    │
    ▼
3. ML Model Scoring
   ├─ Engagement prediction
   ├─ Trending probability
   ├─ Viral potential
    │
    ▼
4. Fact-checking (if high-risk)
   ├─ Query fact-check APIs
   ├─ Cross-reference verification
    │
    ▼
5. Output Priority & Confidence
   ├─ Color-coded priority
   ├─ Confidence score (0-100)
   ├─ Risk flags
    │
    ▼
Store in Strapi + Update Article Metadata
```

### 3.3 ML Model Training

| Component | Specification | Purpose |
|-----------|---|---|
| **Framework** | TensorFlow 2.x or PyTorch | Model training & inference |
| **Training Data** | Historical WordPress articles + engagement metrics | Learn from past content performance |
| **Retraining** | Weekly batch jobs | Improve model accuracy over time |
| **Model Storage** | Model registry + versioning | Track model performance, rollback if needed |

**Model Types:**
```
Engagement Predictor:     Neural network to predict engagement
Trending Detector:        Classification model for trending stories
Topic Classifier:         Multi-label classification for categories
Sentiment Analyzer:       Positive/negative/neutral sentiment
```

---

## PART 4: CLOUD INFRASTRUCTURE (AWS)

### 4.1 Compute Services

| Service | Specification | Purpose |
|---------|---|---|
| **Container Orchestration** | AWS ECS (Fargate) | Serverless containers, no VM management |
| **Application Load Balancer** | AWS ALB | Distribute traffic across instances |
| **Auto Scaling** | Application Auto Scaling | Scale based on CPU, memory, request count |
| **Monitoring Dashboards** | CloudWatch | Real-time performance metrics |

**ECS Task Specifications:**
```
Task Definition:      Strapi Application
CPU:                  2048 (2 vCPU) per task
Memory:               4096 (4 GB) per task
Desired Count:        3 tasks (high availability)
Min Count:            2 tasks
Max Count:            10 tasks (auto-scaling)
Health Check:         HTTP /health every 30 seconds
Task Timeout:         300 seconds
```

**Load Balancer Configuration:**
```
Target Group:         App ECS Service
Port:                 3000 (Strapi default)
Protocol:             HTTP (upgraded to HTTPS via WAF)
Health Check Path:    /health
Health Check Interval: 30 seconds
Deregistration Delay: 30 seconds
Sticky Sessions:      Disabled (stateless)
```

### 4.2 Database Services

| Service | Specification | Instance Type |
|---------|---|---|
| **RDS PostgreSQL** | Primary database | db.t4g.xlarge (prod), db.t4g.large (staging) |
| **RDS Read Replicas** | Scale read queries | db.t4g.large (1-2 replicas) |
| **RDS Backup** | Automated daily snapshots | 30-day retention |
| **Parameter Group** | Strapi-optimized settings | Connection pooling, query cache |

**PostgreSQL Performance Tuning:**
```
shared_buffers:           25% of instance memory (1-2 GB)
effective_cache_size:     75% of instance memory
work_mem:                 256 MB per operation
maintenance_work_mem:     2 GB
wal_buffers:              16 MB
checkpoint_timeout:       30 min
max_connections:          300
```

### 4.3 Caching & Session Store

| Service | Specification | Configuration |
|---------|---|---|
| **ElastiCache Redis** | In-memory cache | cache.t4g.large, 2 nodes (HA) |
| **Session Store** | Redis | 24-hour TTL for sessions |
| **Query Cache** | Redis | 1-hour TTL for article queries |

**ElastiCache Configuration:**
```
Engine:               Redis 7.x
Node Type:            cache.t4g.large
Number of Nodes:      2 (one primary, one replica)
Automatic Failover:   Enabled
Backup:               Daily snapshots
Maintenance Window:   Sunday 03:00-04:00 UTC
```

### 4.4 Search Service

| Service | Specification | Configuration |
|---------|---|---|
| **OpenSearch/Elasticsearch** | Full-text search | 3 master + 2 data nodes |
| **Index Replication** | 2 replicas per shard | High availability |
| **Backup** | Snapshot repository (S3) | Daily snapshots |

**OpenSearch Domain Configuration:**
```
Elasticsearch Version:     8.9 or latest
Data Nodes:               2x m5.xlarge.opensearch
Master Nodes:             3x t3.small.opensearch
Storage:                  500 GB gp2 per node
Replication:              2 replicas
Backup:                   Automated snapshots to S3
```

### 4.5 Storage Services

| Service | Specification | Purpose |
|---------|---|---|
| **S3 Buckets** | Multiple buckets per environment | Images, backups, assets |
| **CloudFront** | CDN in front of S3 | Global content delivery, caching |
| **S3 Versioning** | Enabled for backups | Point-in-time recovery |
| **S3 Lifecycle Policies** | Archive old backups to Glacier | Cost optimization |

**S3 Bucket Structure:**
```
newskarnataka-prod-content/
├── articles/              # Article images
├── media/                 # User-uploaded media
├── backups/               # Database backups
│   └── db-yyyy-mm-dd/     # Daily snapshots
├── migrations/            # Migration logs & data
└── temp/                  # Temporary files (auto-cleanup)

Replication:              Cross-region to us-east-1
Versioning:               Enabled
Encryption:               AES-256 (default)
Public Access:            Blocked
```

### 4.6 Networking & Security

| Service | Specification | Configuration |
|---------|---|---|
| **VPC** | Custom VPC (10.0.0.0/16) | Private, isolated network |
| **Subnets** | 3 public + 3 private across AZs | High availability design |
| **Security Groups** | Restrictive inbound rules | Principle of least privilege |
| **NAT Gateway** | 1 per AZ for outbound traffic | Allow private subnet outbound access |
| **VPC Flow Logs** | Enable for network debugging | Troubleshooting network issues |

**Security Group Rules:**
```
App Layer (ECS):
├─ Inbound: Port 3000 from ALB
├─ Outbound: All

Database Layer (RDS):
├─ Inbound: Port 5432 from App security group
├─ Outbound: None needed (RDS is destination)

Redis Layer (ElastiCache):
├─ Inbound: Port 6379 from App security group
├─ Outbound: None needed

Elasticsearch:
├─ Inbound: Port 9200 from App security group
├─ Outbound: None needed
```

---

## PART 5: DEPLOYMENT & CI/CD PIPELINE

### 5.1 Container & Artifact Management

| Component | Specification | Purpose |
|-----------|---|---|
| **Container Registry** | AWS ECR (Elastic Container Registry) | Store Docker images |
| **Docker Version** | 24.x | Latest stable release |
| **Container Base Image** | node:18-alpine | Lightweight, minimal attack surface |
| **Image Build** | Buildkit (Docker native) | Fast, efficient builds |

**Dockerfile Strategy:**
```
# Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### 5.2 CI/CD Pipeline

| Stage | Tool | Actions |
|-------|------|---------|
| **Trigger** | GitHub webhooks | On push, PR, release tag |
| **Source** | GitHub repository | Mono-repo for Strapi + adapters |
| **Build** | GitHub Actions | Build Docker image, run tests |
| **Test** | Jest + Supertest | Unit tests, integration tests |
| **Security Scan** | Snyk or Trivy | Vulnerability scanning |
| **Registry** | AWS ECR | Push image to private registry |
| **Deploy** | AWS ECS + CloudFormation | Blue-green deployment |
| **Smoke Test** | Postman + Newman | Post-deploy verification |
| **Monitor** | CloudWatch + DataDog | Real-time metrics & alerts |

**GitHub Actions Workflow:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
      - run: snyk test
      
  docker:
    needs: [build, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t app:${{ github.sha }} .
      - run: docker tag app:${{ github.sha }} ${{ env.ECR_URI }}:latest
      - run: aws ecr get-login-password | docker login --username AWS --password-stdin ${{ env.ECR_URI }}
      - run: docker push ${{ env.ECR_URI }}:latest
      
  deploy:
    needs: docker
    runs-on: ubuntu-latest
    steps:
      - run: aws ecs update-service --cluster production --service app --force-new-deployment
```

### 5.3 Environment Configuration

| Environment | Server Count | CPU/Memory | Purpose |
|-----------|---|---|---|
| **Development** | 1 | 1 vCPU / 2 GB | Local development, feature testing |
| **Staging** | 2 | 2 vCPU / 4 GB | Migration rehearsal, UAT |
| **Production** | 3 | 2 vCPU / 4 GB | Live traffic, high availability |

**Environment Variables:**
```
STRAPI_ENV=production|staging|development
STRAPI_HOST=0.0.0.0
STRAPI_PORT=3000
DATABASE_HOST=rds-endpoint
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
REDIS_HOST=elasticache-endpoint
ELASTICSEARCH_HOST=opensearch-endpoint
GROQ_API_KEY=xxx (from AWS Secrets Manager)
JWT_SECRET=xxx (from AWS Secrets Manager)
AWS_REGION=us-east-1
```

---

## PART 6: MONITORING, LOGGING & OBSERVABILITY

### 6.1 Application Performance Monitoring

| Tool | Specification | Metrics |
|------|---|---|
| **CloudWatch** | AWS native monitoring | CPU, memory, disk, network |
| **DataDog** (optional) | Third-party APM | Request latency, error rates, traces |
| **New Relic** (optional) | Alternative APM | Full-stack monitoring |

**CloudWatch Dashboards:**
```
Strapi Application:
├── Request Rate (requests/min)
├── P50, P95, P99 Latency (ms)
├── Error Rate (%)
├── Active Connections
└── Database Query Latency

Database:
├── Connections (current/max)
├── Query Performance Insights
├── Storage Usage
├── Replica Lag
└── Backup Status

Cache (Redis):
├── Hit/Miss Ratio
├── Memory Usage
├── Eviction Rate
└── Connection Count

Search (Elasticsearch):
├── Indexing Rate
├── Query Latency
├── Shard Allocation
└── Index Size
```

### 6.2 Logging & Log Aggregation

| Component | Specification | Configuration |
|-----------|---|---|
| **Application Logs** | CloudWatch Logs | JSON format, structured logging |
| **Database Logs** | RDS Enhanced Monitoring | Query logs, slow query log |
| **Access Logs** | ALB Access Logs → S3 | Request metadata for debugging |
| **Log Retention** | 30 days in CloudWatch, archive to S3 | Cost optimization |

**Log Format (JSON):**
```json
{
  "timestamp": "2026-09-08T14:30:45Z",
  "level": "info",
  "service": "strapi",
  "request_id": "req_12345",
  "user_id": "usr_98765",
  "method": "POST",
  "path": "/api/articles",
  "status": 201,
  "duration_ms": 342,
  "message": "Article created successfully"
}
```

### 6.3 Alerting & On-Call

| Alert | Threshold | Action |
|-------|-----------|--------|
| **High CPU** | > 80% for 5 min | Page on-call engineer |
| **High Memory** | > 85% for 5 min | Page on-call engineer |
| **Database Error Rate** | > 5% | Page database team |
| **API Error Rate** | > 1% | Trigger incident |
| **Response Latency** | P95 > 2s | Investigation |
| **Disk Space** | < 10% free | Alert ops team |

---

## PART 7: SECURITY INFRASTRUCTURE

### 7.1 Network Security

| Layer | Component | Configuration |
|-------|-----------|---|
| **WAF** | AWS WAF + CloudFront | Block malicious requests |
| **DDoS** | AWS Shield Standard | Built-in (free) |
| **SSL/TLS** | AWS Certificate Manager | HTTPS everywhere |
| **VPN** | AWS VPN Client | Secure admin access |

**WAF Rules:**
```
Rule 1: Rate Limiting
├─ 2000 requests per 5 minutes per IP
└─ Action: Block IP for 5 minutes

Rule 2: SQL Injection Protection
├─ Pattern matching for SQL keywords
└─ Action: Block request

Rule 3: Cross-Site Scripting (XSS)
├─ Pattern matching for script tags
└─ Action: Block request

Rule 4: Geo-blocking (Optional)
├─ Allow: India, US (for API access)
└─ Action: Block other countries

Rule 5: Bot Protection
├─ CAPTCHA on suspicious patterns
└─ Action: Require CAPTCHA
```

### 7.2 Authentication & Authorization

| Component | Specification | Purpose |
|-----------|---|---|
| **User Auth** | JWT + OAuth 2.0 | Secure authentication |
| **Session Store** | Redis | Session state management |
| **MFA** | TOTP (Google Authenticator) | Two-factor authentication for admins |
| **API Keys** | AWS Secrets Manager | Secure credential storage |

**JWT Configuration:**
```
Algorithm:            HS256 (HMAC SHA-256)
Secret Key:           64-character random string (AWS Secrets Manager)
Expiration:           24 hours for access token, 30 days for refresh
Payload:
  ├─ sub: user_id
  ├─ email: user_email
  ├─ roles: [admin, editor, author]
  └─ iat, exp: timestamps
```

### 7.3 Data Protection

| Aspect | Specification | Configuration |
|--------|---|---|
| **Encryption at Rest** | AES-256 | All databases, backups, S3 |
| **Encryption in Transit** | TLS 1.3 | All network communication |
| **Secret Management** | AWS Secrets Manager | Store API keys, DB passwords |
| **Backup Encryption** | AES-256 | All automated backups |

**Secrets Manager Configuration:**
```
Secrets:
├─ db_password: Rotate every 30 days
├─ groq_api_key: Rotate monthly
├─ jwt_secret: Rotate annually
├─ aws_access_keys: Rotate quarterly
└─ encryption_keys: Rotate annually

Rotation Strategy: Automatic, with notifications
```

---

## PART 8: DISASTER RECOVERY & BACKUP

### 8.1 Backup Strategy

| Component | Frequency | Retention | Recovery Time |
|-----------|-----------|-----------|---|
| **Database** | Daily | 30 days | 5-15 minutes |
| **Elasticsearch Indices** | Daily | 30 days | 10-30 minutes |
| **S3 Content** | Continuous versioning | Indefinite | Immediate (restore from version) |
| **Configuration** | On deployment | 90 days | 5 minutes |

**Backup Process:**
```
Database (PostgreSQL):
├─ Automated RDS snapshots (daily)
├─ Cross-region replication (every 6 hours)
└─ Point-in-time recovery (last 35 days)

Elasticsearch:
├─ Snapshot repository to S3 (daily)
├─ Retain 30 snapshots
└─ Restore in < 30 minutes

Configuration:
├─ Infrastructure as Code (CloudFormation) in Git
├─ Secrets in AWS Secrets Manager (backed up)
└─ Application config in environment variables
```

### 8.2 Disaster Recovery Plan

| Scenario | RTO | RPO | Plan |
|----------|-----|-----|------|
| **Single AZ outage** | < 1 min | 0 | Auto-failover (multi-AZ RDS + ECS across AZs) |
| **Region outage** | < 15 min | < 1 hour | Restore from S3 snapshots in backup region |
| **Data corruption** | < 1 hour | < 1 day | Restore from dated backup |
| **Full infrastructure failure** | < 4 hours | < 1 hour | Complete rebuild from IaC + backups |

**RTO/RPO Targets:**
```
RTO (Recovery Time Objective):   < 15 minutes for most scenarios
RPO (Recovery Point Objective):  < 1 hour of data loss acceptable
Availability Target:             99.9% (8.76 hours downtime/year)
```

---

## PART 9: COST ESTIMATION

### 9.1 Monthly AWS Costs (Production)

| Service | Specification | Monthly Cost |
|---------|---|---|
| **Compute (ECS)** | 3x t4g.large tasks | ₹8,000 |
| **Database (RDS)** | db.t4g.xlarge multi-AZ | ₹15,000 |
| **Cache (ElastiCache)** | cache.t4g.large, 2 nodes | ₹6,000 |
| **Search (OpenSearch)** | 5 nodes (2 data, 3 master) | ₹12,000 |
| **Storage (S3)** | 500 GB content + backups | ₹3,000 |
| **CDN (CloudFront)** | 50-100 GB/month transfer | ₹4,000 |
| **Data Transfer** | Inter-region + outbound | ₹2,000 |
| **Backups** | RDS + EBS snapshots | ₹1,000 |
| **Monitoring** | CloudWatch + DataDog | ₹5,000 |
| **Others** | Load balancer, NAT, etc. | ₹3,000 |
| **TOTAL** | | ₹59,000/month |

**Annual AWS Cost: ₹7,08,000**

### 9.2 Third-Party Services

| Service | Monthly | Purpose |
|---------|---------|---------|
| **Groq LLM** | ₹500-1000 | AI validation |
| **GitHub Premium** | ₹2,000 | Private repos + CI/CD |
| **DataDog** (optional) | ₹8,000 | Advanced APM |
| **StatusPage** | ₹1,500 | Incident communication |
| **Slack Integration** | ₹2,000 | Alert notifications |
| **TOTAL** | ₹14,000-16,000 | |

**Annual Third-Party Cost: ₹1,68,000 - ₹1,92,000**

---

## PART 10: PRE-TESTING CHECKLIST

### Infrastructure Ready For Testing

- [ ] **AWS Account**
  - [ ] VPC created (10.0.0.0/16)
  - [ ] Subnets configured (3 public, 3 private)
  - [ ] Internet Gateway attached
  - [ ] NAT Gateways deployed
  - [ ] Route tables configured

- [ ] **Compute (ECS)**
  - [ ] ECS cluster created
  - [ ] ALB deployed and tested
  - [ ] Security groups configured
  - [ ] Auto-scaling groups set up

- [ ] **Database (RDS PostgreSQL)**
  - [ ] RDS instance created (multi-AZ)
  - [ ] Parameter group tuned
  - [ ] Read replicas created
  - [ ] Backups automated
  - [ ] Connection tested from app layer

- [ ] **Cache (ElastiCache Redis)**
  - [ ] Redis cluster created
  - [ ] High availability enabled
  - [ ] Security group rules applied
  - [ ] Connection tested

- [ ] **Search (Elasticsearch/OpenSearch)**
  - [ ] Domain created
  - [ ] Indices created
  - [ ] Shards/replicas configured
  - [ ] Backup repository set up

- [ ] **Storage (S3)**
  - [ ] Buckets created for each environment
  - [ ] Versioning enabled
  - [ ] Encryption configured
  - [ ] Lifecycle policies set
  - [ ] Public access blocked

- [ ] **CDN (CloudFront)**
  - [ ] Distribution created
  - [ ] Origin configured (ALB/S3)
  - [ ] Cache behaviors set
  - [ ] SSL certificate assigned
  - [ ] WAF attached

- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions configured
  - [ ] ECR repository created
  - [ ] Docker builds automated
  - [ ] Deploy workflow tested
  - [ ] Rollback procedure documented

- [ ] **Monitoring & Logging**
  - [ ] CloudWatch dashboards created
  - [ ] Log groups configured
  - [ ] Alarms set for critical metrics
  - [ ] SNS topics for notifications
  - [ ] On-call setup complete

- [ ] **Security**
  - [ ] WAF rules deployed
  - [ ] Security groups validated
  - [ ] SSL certificate installed
  - [ ] Secrets Manager configured
  - [ ] Access logs enabled

- [ ] **Backup & DR**
  - [ ] Automated backups configured
  - [ ] Backup testing completed
  - [ ] Restore procedures documented
  - [ ] Cross-region failover tested

- [ ] **Application**
  - [ ] Strapi built and containerized
  - [ ] Environment variables configured
  - [ ] Database migrations ready
  - [ ] Elasticsearch indices defined
  - [ ] Health checks implemented

---

## SUMMARY

This technology stack is designed to support:
- ✅ **55,000 article migration**
- ✅ **2-3x performance improvement** over WordPress
- ✅ **99.9% availability** (enterprise SLA)
- ✅ **Real-time AI validation** (Groq <100ms)
- ✅ **Horizontal scaling** (add more containers)
- ✅ **Geographic distribution** (CDN)
- ✅ **Complete disaster recovery** (< 15 min RTO)

All components are **production-ready**, **cost-optimized**, and **operationally sound**.

---

**Technology Stack Specification - COMPLETE**

**Status:** Ready for Infrastructure Team Implementation  
**Next Step:** Begin environment provisioning (Week 0-1)



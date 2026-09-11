# 🔐 WEEK 1 - TASK 7: Environment Configuration
## Set up .env files for all services

**Task:** Create comprehensive .env configuration for local, staging, production  
**Duration:** 1-2 hours  
**Status:** IN PROGRESS  

---

## 📋 OVERVIEW

**Files to create:**
1. `.env.example` - Template (committed to git)
2. `.env.local` - Local development (gitignored)
3. `.env.staging` - Staging environment
4. `.env.production` - Production environment

---

## 🔧 ROOT .env.example

**File: `d:\Personal\Kiro\newsKarnataka\.env.example`**

```bash
# ===== ENVIRONMENT =====
NODE_ENV=development
APP_NAME=NewsKarnataka
APP_VERSION=1.0.0

# ===== NEXT.JS PUBLIC WEBSITE =====
# Note: NEXT_PUBLIC_ variables exposed to browser

# API & GraphQL URLs
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:1337/graphql
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Analytics
NEXT_PUBLIC_GA_ID=G_XXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Feature flags
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_SHARING=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Stripe (if using payments)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# ===== REACT AI CONSOLE (VITE) =====
VITE_API_URL=http://localhost:1337
VITE_GRAPHQL_URL=http://localhost:1337/graphql
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=AI Console
VITE_LOG_LEVEL=debug

# ===== STRAPI CMS =====
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=newskarnataka
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Strapi Admin
ADMIN_JWT_SECRET=your_super_secret_jwt_key_change_this
TRANSFER_TOKEN_SALT=your_transfer_token_salt_change_this
API_TOKEN_SALT=your_api_token_salt_change_this

# Strapi Config
STRAPI_ADMIN_URL=http://localhost:1337/admin
STRAPI_API_URL=http://localhost:1337

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@newskarnataka.com
SMTP_FROM_NAME=NewsKarnataka

# ===== ELASTICSEARCH =====
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_INDEX_PREFIX=strapi

# ===== REDIS =====
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ===== AI SERVICES =====

# Groq LLM
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL=mixtral-8x7b-32768

# OpenAI (alternative)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4

# Google Gemini (alternative)
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxx
GOOGLE_MODEL=gemini-pro

# ===== AUTHENTICATION =====

# JWT
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRE=24h

# OAuth (GitHub, Google, etc.)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ===== LOGGING & MONITORING =====

# Sentry
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ENVIRONMENT=development
SENTRY_TRACE_SAMPLE_RATE=0.1

# LogRocket (frontend)
NEXT_PUBLIC_LOGROCKET_APP_ID=your_logrocket_id

# ===== EXTERNAL SERVICES =====

# AWS S3 (for media storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=newskarnataka-media
AWS_CLOUDFRONT_URL=https://cdn.newskarnataka.com

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxx

# Twilio (SMS notifications)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# ===== SECURITY =====

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== PORTS =====
PORT=3000
ADMIN_PORT=5173
STRAPI_PORT=1337
SOCKET_PORT=3001

# ===== DEBUG =====
DEBUG=false
VERBOSE_LOGS=false
```

---

## 🎯 NEXT.JS PUBLIC WEBSITE .env.local

**File: `newskarnataka-web/.env.local`**

```bash
# Public website - Local Development

NODE_ENV=development

# API
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:1337/graphql
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Analytics (disabled in local)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Features
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_SHARING=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Internal
NEXTAUTH_SECRET=your_local_secret_key_12345

# Revalidation intervals
NEXT_ISR_REVALIDATE=60

# Debugging
DEBUG=false
```

---

## 🎯 REACT AI CONSOLE .env.local

**File: `ai-console/.env.local`**

```bash
# AI Console - Local Development

VITE_APP_NAME=AI Console

# API & GraphQL
VITE_API_URL=http://localhost:1337
VITE_GRAPHQL_URL=http://localhost:1337/graphql
VITE_SOCKET_URL=http://localhost:3001

# Console settings
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEV_TOOLS=true
VITE_MOCK_API=false

# Groq API (optional for testing)
VITE_GROQ_API_KEY=

# Debugging
VITE_DEBUG=true
```

---

## 🎯 STRAPI .env.local

**File: `strapi/.env.local`** (or root `.env.local` if Strapi is in root)

```bash
# Strapi - Local Development

NODE_ENV=development

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=103.191.208.235
DATABASE_PORT=5432
DATABASE_NAME=newskarnataka
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# JWT & Tokens
ADMIN_JWT_SECRET=my_super_secret_jwt_key_local_123
TRANSFER_TOKEN_SALT=transfer_token_salt_local_456
API_TOKEN_SALT=api_token_salt_local_789

# URLs
STRAPI_ADMIN_URL=http://localhost:1337/admin
STRAPI_API_URL=http://localhost:1337

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@newskarnataka.com
SMTP_FROM_NAME=NewsKarnataka

# Elasticsearch
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_INDEX_PREFIX=strapi

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# AI Services
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL=mixtral-8x7b-32768

# Security
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:1337

# Port
PORT=1337

# Debug
DEBUG=strapi:*
```

---

## 🚀 PRODUCTION .env.production

**File: `.env.production`** (Keep secure, don't commit real values)

```bash
# Production Environment

NODE_ENV=production

# === PUBLIC WEBSITE ===
NEXT_PUBLIC_API_URL=https://api.newskarnataka.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.newskarnataka.com/graphql
NEXT_PUBLIC_SOCKET_URL=https://socket.newskarnataka.com

# Analytics
NEXT_PUBLIC_GA_ID=G_PRODUCTION_ID
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/prod_id

# Features
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_SHARING=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# === AI CONSOLE ===
VITE_API_URL=https://api.newskarnataka.com
VITE_GRAPHQL_URL=https://api.newskarnataka.com/graphql
VITE_SOCKET_URL=https://socket.newskarnataka.com
VITE_LOG_LEVEL=error

# === STRAPI ===
DATABASE_CLIENT=postgres
DATABASE_HOST=prod-db.newskarnataka.internal
DATABASE_PORT=5432
DATABASE_NAME=newskarnataka_prod
DATABASE_USERNAME=strapi_prod
DATABASE_PASSWORD=SECURE_PASSWORD_FROM_VAULT
DATABASE_SSL=true

ADMIN_JWT_SECRET=SECURE_KEY_FROM_VAULT
TRANSFER_TOKEN_SALT=SECURE_SALT_FROM_VAULT
API_TOKEN_SALT=SECURE_SALT_FROM_VAULT

# Elasticsearch (Cloud)
ELASTICSEARCH_HOST=https://elastic.prod.newskarnataka.com
ELASTICSEARCH_PORT=443
ELASTICSEARCH_USERNAME=elastic_prod
ELASTICSEARCH_PASSWORD=SECURE_PASSWORD_FROM_VAULT

# Redis (Cloud)
REDIS_HOST=redis.prod.newskarnataka.com
REDIS_PORT=6379
REDIS_PASSWORD=SECURE_PASSWORD_FROM_VAULT
REDIS_DB=0
REDIS_SSL=true

# AI Services
GROQ_API_KEY=PROD_KEY_FROM_VAULT
OPENAI_API_KEY=PROD_KEY_FROM_VAULT

# Security
CORS_ORIGIN=https://newskarnataka.com,https://console.newskarnataka.com

# Ports
PORT=1337

# Debug
DEBUG=
VERBOSE_LOGS=false
```

---

## 🔐 ENVIRONMENT SETUP CHECKLIST

### Local Development

```bash
# 1. Copy template
cp .env.example .env.local

# 2. Update with local values
# - Database: postgres user/pass
# - JWT secrets (can be random for local)
# - API keys (can be empty or test keys)
# - URLs: localhost

# 3. Install dependencies
npm install

# 4. Start services
docker-compose up -d
npm run dev
```

### Staging Deployment

```bash
# Use GitHub Secrets for staging
STAGING_DATABASE_PASSWORD=xxx
STAGING_STRAPI_JWT_SECRET=xxx
STAGING_GROQ_API_KEY=xxx
```

### Production Deployment

```bash
# Use AWS Secrets Manager or similar for production
# NEVER commit production .env files
# Store secrets in:
# - GitHub Secrets (CI/CD only)
# - AWS Secrets Manager
# - HashiCorp Vault
# - 1Password / LastPass
```

---

## 🛠️ VALIDATION SCRIPT

**File: `scripts/validate-env.js`**

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredEnvs = {
  development: [
    'NODE_ENV',
    'NEXT_PUBLIC_API_URL',
    'DATABASE_HOST',
    'DATABASE_NAME',
    'ADMIN_JWT_SECRET'
  ],
  production: [
    'NODE_ENV',
    'NEXT_PUBLIC_API_URL',
    'DATABASE_HOST',
    'DATABASE_PASSWORD',
    'ADMIN_JWT_SECRET'
  ]
};

const nodeEnv = process.env.NODE_ENV || 'development';
const required = requiredEnvs[nodeEnv] || requiredEnvs.development;

let missing = [];

required.forEach(env => {
  if (!process.env[env]) {
    missing.push(env);
  }
});

if (missing.length > 0) {
  console.error(`❌ Missing required env variables: ${missing.join(', ')}`);
  process.exit(1);
} else {
  console.log(`✅ All required env variables present for ${nodeEnv}`);
  process.exit(0);
}
```

**Usage:**
```bash
npm run validate-env
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] `.env.example` created and documented
- [ ] `newskarnataka-web/.env.local` created
- [ ] `ai-console/.env.local` created
- [ ] `strapi/.env.local` created
- [ ] All files added to `.gitignore`
- [ ] `.env.example` committed to git
- [ ] Validation script working
- [ ] All services can read env variables
- [ ] No secrets in `.env.example`
- [ ] Production template created (not with real secrets)

---

## 🚀 NEXT STEPS

- Task #8: Create Docker Compose setup

---

**Status: READY FOR EXECUTION**


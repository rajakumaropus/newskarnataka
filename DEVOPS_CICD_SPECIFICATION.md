# DevOps & CI/CD Pipeline Specification
## NewsKarnataka: Deployment & Infrastructure Automation

**Project:** NewsKarnataka WordPress to Strapi Migration  
**Status:** Pre-Implementation  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

Complete CI/CD pipeline enabling:
- **Automated testing** (unit, integration, E2E)
- **Containerized deployment** (Docker → ECR → ECS)
- **Blue-green deployment** (zero-downtime updates)
- **Infrastructure as Code** (CloudFormation, Terraform)
- **Automated rollback** (if deployment fails)
- **Environment management** (dev, staging, prod)

---

## PART 1: VERSION CONTROL & REPOSITORY

### 1.1 Git Repository Structure

```
Repository: newskarnataka-migration
URL: https://github.com/spearhead-media/newskarnataka-migration
Type: Monorepo (single repo for all services)

Directory Structure:
newskarnataka-migration/
├── .github/
│   ├── workflows/
│   │   ├── ci-backend.yml        # Backend CI/CD
│   │   ├── ci-frontend.yml       # Frontend CI/CD
│   │   ├── ci-mobile.yml         # Mobile CI/CD
│   │   ├── deploy-staging.yml    # Deploy to staging
│   │   ├── deploy-production.yml # Deploy to production
│   │   └── security-scan.yml     # Security scanning
│   └── CODEOWNERS                # Code ownership rules
│
├── backend/                       # Strapi API
│   ├── src/
│   │   ├── api/
│   │   ├── plugins/
│   │   └── config/
│   ├── tests/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                      # React/Next.js web
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── tests/
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   └── README.md
│
├── mobile/                        # Flutter app
│   ├── lib/
│   ├── test/
│   ├── pubspec.yaml
│   ├── pubspec.lock
│   └── README.md
│
├── ai-service/                    # Python AI/ML
│   ├── app/
│   ├── models/
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── infrastructure/                # IaC (CloudFormation/Terraform)
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── vpc.tf
│   │   ├── rds.tf
│   │   ├── ecs.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── cloudformation/
│   │   ├── vpc-stack.yaml
│   │   ├── rds-stack.yaml
│   │   └── ecs-stack.yaml
│   └── scripts/
│       ├── deploy.sh
│       ├── rollback.sh
│       └── health-check.sh
│
├── migration/                     # Data migration tools
│   ├── adapters/
│   ├── transformers/
│   ├── validators/
│   └── README.md
│
├── docker-compose.yml             # Local development
├── .dockerignore
├── .gitignore
└── README.md

Branch Strategy (Git Flow):
├── main (production)
│  └─ Protected branch (require 2 PR reviews)
│
├── staging (staging environment)
│  └─ Deployed to staging on each commit
│
├── develop (development)
│  └─ Main development branch
│
├── feature/* (feature branches)
│  └─ Branch from develop, PR to develop
│
└── hotfix/* (critical fixes)
   └─ Branch from main, PR to main & develop
```

### 1.2 Commit & PR Conventions

```
Commit Message Format:
<type>(<scope>): <subject>

<body>

<footer>

Types:
├── feat: New feature
├── fix: Bug fix
├── docs: Documentation
├── style: Code style (formatting, missing semicolons)
├── refactor: Code refactoring
├── test: Adding tests
├── chore: Dependencies, build tools
└── ci: CI/CD changes

Examples:
├── feat(articles): Add auto-publish for GREEN priority
├── fix(search): Fix Elasticsearch query timeout
├── docs(api): Update API endpoint documentation
└── ci(github): Add security scanning workflow

Pull Request Checklist:
- [ ] Tests pass (100% success rate)
- [ ] Code review completed (2 approvals for main)
- [ ] Security scan passed (no critical vulnerabilities)
- [ ] Documentation updated
- [ ] Breaking changes noted in description
- [ ] Ready to deploy

PR Template:
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation

## Testing
How was this tested?

## Screenshots (if UI change)
Include before/after

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
```

---

## PART 2: CI/CD PIPELINES

### 2.1 Backend CI/CD (Strapi)

```yaml
# .github/workflows/ci-backend.yml
name: Backend CI/CD

on:
  push:
    branches: [develop, staging, main]
    paths:
      - 'backend/**'
      - '.github/workflows/ci-backend.yml'
  pull_request:
    branches: [develop, staging]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: newskarnataka_test
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'backend/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Lint
        run: |
          cd backend
          npm run lint
      
      - name: Run tests
        run: |
          cd backend
          npm run test -- --coverage
        env:
          DATABASE_URL: postgres://postgres:password@localhost:5432/newskarnataka_test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          cd backend
          docker build -t newskarnataka-strapi:${{ github.sha }} .
          docker tag newskarnataka-strapi:${{ github.sha }} newskarnataka-strapi:latest
      
      - name: Security scan (Trivy)
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image --severity HIGH,CRITICAL \
            newskarnataka-strapi:${{ github.sha }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsRole
          aws-region: us-east-1
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker push ${{ secrets.ECR_REGISTRY }}/newskarnataka-strapi:${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/newskarnataka-strapi:latest
      
      - name: Update ECS service (staging)
        run: |
          aws ecs update-service \
            --cluster newskarnataka-staging-cluster \
            --service newskarnataka-strapi-service \
            --force-new-deployment

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Create GitHub deployment
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production',
              required_contexts: []
            })
      
      - name: Manual approval required
        run: |
          echo "Deployment ready for approval"
          echo "Review and approve in GitHub Actions"
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsRole
          aws-region: us-east-1
      
      - name: Blue-Green Deployment
        run: |
          cd backend
          ./scripts/deploy-blue-green.sh \
            --cluster newskarnataka-prod-cluster \
            --service newskarnataka-strapi-service \
            --image ${{ secrets.ECR_REGISTRY }}/newskarnataka-strapi:${{ github.sha }}
```

### 2.2 Frontend CI/CD (React/Next.js)

```yaml
# .github/workflows/ci-frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [develop, staging, main]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [develop, staging]

jobs:
  lint-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Lint
        run: |
          cd frontend
          npm run lint
      
      - name: Format check
        run: |
          cd frontend
          npm run format -- --check
      
      - name: Run tests
        run: |
          cd frontend
          npm run test -- --coverage --passWithNoTests
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.9.x
          lhci autorun --config=./frontend/lighthouserc.json

  deploy-preview:
    needs: lint-test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy preview to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: spearhead-media

  deploy-staging:
    needs: lint-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (staging)
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          scope: spearhead-media

  deploy-production:
    needs: lint-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (production)
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: spearhead-media
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "✅ Frontend deployment to production successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Frontend Deployment*\n*Status:* ✅ Success\n*Commit:* ${{ github.event.head_commit.message }}\n*Author:* ${{ github.event.head_commit.author.name }}"
                  }
                }
              ]
            }
```

### 2.3 Mobile CI/CD (Flutter)

```yaml
# .github/workflows/ci-mobile.yml
name: Mobile CI/CD

on:
  push:
    branches: [develop, staging, main]
    paths:
      - 'mobile/**'
  pull_request:
    branches: [develop, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.13.x'
          channel: 'stable'
      
      - name: Get dependencies
        run: |
          cd mobile
          flutter pub get
      
      - name: Analyze
        run: |
          cd mobile
          flutter analyze
      
      - name: Format check
        run: |
          cd mobile
          flutter format --set-exit-if-changed .
      
      - name: Run tests
        run: |
          cd mobile
          flutter test --coverage

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.13.x'
      
      - name: Build APK
        run: |
          cd mobile
          flutter build apk --release
      
      - name: Build App Bundle
        run: |
          cd mobile
          flutter build appbundle --release
      
      - name: Upload to Google Play (staging)
        if: github.ref == 'refs/heads/staging'
        run: |
          cd mobile
          ./scripts/deploy-google-play.sh --track=internal

  build-ios:
    needs: test
    runs-on: macos-latest
    if: success()
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.13.x'
      
      - name: Build iOS
        run: |
          cd mobile
          flutter build ios --release --no-codesign
      
      - name: Upload to TestFlight (staging)
        if: github.ref == 'refs/heads/staging'
        run: |
          cd mobile
          ./scripts/deploy-testflight.sh
```

---

## PART 3: INFRASTRUCTURE AS CODE

### 3.1 Terraform Configuration

```hcl
# infrastructure/terraform/main.tf
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "newskarnataka-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "NewsKarnataka"
      ManagedBy   = "Terraform"
      CreatedAt   = timestamp()
    }
  }
}

# VPC
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr = "10.0.0.0/16"
  public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

# RDS PostgreSQL
module "rds" {
  source = "./modules/rds"
  
  instance_class = "db.t4g.xlarge"
  allocated_storage = 500
  multi_az = true
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}

# ElastiCache Redis
module "elasticache" {
  source = "./modules/elasticache"
  
  engine_version = "7.0"
  node_type = "cache.t4g.large"
  num_cache_nodes = 2
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.cache_subnet_ids
}

# ECS Cluster & Services
module "ecs" {
  source = "./modules/ecs"
  
  cluster_name = "newskarnataka-prod"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}

# CloudFront CDN
module "cloudfront" {
  source = "./modules/cloudfront"
  
  domain_name = "newskarnataka.com"
  origin_domain = module.ecs.alb_dns_name
  s3_bucket_id = aws_s3_bucket.content.id
}

# Outputs
output "alb_dns_name" {
  value = module.ecs.alb_dns_name
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "redis_endpoint" {
  value = module.elasticache.endpoint
}
```

### 3.2 Deployment Scripts

```bash
#!/bin/bash
# infrastructure/scripts/deploy-blue-green.sh

set -e

CLUSTER=$1
SERVICE=$2
IMAGE=$3

echo "Starting blue-green deployment..."

# Get current task definition
CURRENT_TASK_DEF=$(aws ecs describe-services \
  --cluster $CLUSTER \
  --services $SERVICE \
  --query 'services[0].taskDefinition' \
  --output text)

# Create new task definition revision
NEW_TASK_DEF=$(aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --image $IMAGE \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

echo "New task definition: $NEW_TASK_DEF"

# Update service with new task definition
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --task-definition $NEW_TASK_DEF \
  --force-new-deployment

echo "Waiting for deployment to complete..."

# Wait for service to stabilize
aws ecs wait services-stable \
  --cluster $CLUSTER \
  --services $SERVICE

# Run smoke tests
echo "Running smoke tests..."
./scripts/smoke-tests.sh

echo "✅ Deployment successful!"
```

---

## PART 4: DOCKER CONTAINERIZATION

### 4.1 Backend Dockerfile (Strapi)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/admin/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/index.js"]
```

### 4.2 Frontend Dockerfile (Next.js)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
```

---

## PART 5: LOCAL DEVELOPMENT ENVIRONMENT

### 5.1 Docker Compose

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: newskarnataka
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapi
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U strapi"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - '9200:9200'
    healthcheck:
      test: ["CMD-SHELL", "curl -s http://localhost:9200 >/dev/null || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  strapi:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: newskarnataka
      DATABASE_USER: strapi
      DATABASE_PASSWORD: strapi
      REDIS_HOST: redis
      REDIS_PORT: 6379
      ELASTICSEARCH_HOST: elasticsearch
      ELASTICSEARCH_PORT: 9200
    ports:
      - '1337:3000'
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      elasticsearch:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:1337
      NEXT_PUBLIC_CDN_URL: http://localhost:3000
    ports:
      - '3000:3000'
    depends_on:
      - strapi
    volumes:
      - ./frontend:/app

volumes:
  postgres_data:
```

---

## PART 6: DEPLOYMENT STRATEGIES

### 6.1 Blue-Green Deployment

```
Blue-Green Deployment Process:

1. Current State (Blue)
   └─ Production serving traffic
   └─ Route: newskarnataka.com → Blue environment
   └─ ECS service: 3 tasks running

2. Deploy New Version (Green)
   ├─ Create new ECS task definition
   ├─ Launch new tasks (Green environment)
   ├─ Run health checks (3 times = success)
   └─ Run smoke tests (verify functionality)

3. Traffic Switch
   ├─ Update ALB target group
   ├─ Route 10% traffic to Green (canary)
   ├─ Monitor metrics (errors, latency)
   ├─ Gradual rollout: 25% → 50% → 100%
   └─ Or full switch (if using ALB listener priority)

4. Validation
   ├─ Monitor error rate (target: < 0.5%)
   ├─ Monitor latency (target: < 500ms P99)
   ├─ Monitor cache hit rate
   └─ Gather user feedback

5. Finalization
   ├─ If successful: Keep Green, decommission Blue
   ├─ If failed: Rollback to Blue (instant)
   └─ Document deployment in incident log

Zero-Downtime: ✅
Rollback Time: < 1 minute
Testing: Automated smoke tests
Risk: Low (previous version still running)
```

### 6.2 Rollback Procedure

```bash
#!/bin/bash
# infrastructure/scripts/rollback.sh

set -e

CLUSTER=$1
SERVICE=$2
REVISION=$3  # e.g., "5" (previous task definition revision)

echo "Rolling back to task definition revision $REVISION..."

# Get previous task definition
PREVIOUS_TASK_DEF=$(aws ecs describe-task-definition \
  --task-definition $SERVICE:$REVISION \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

echo "Previous task definition: $PREVIOUS_TASK_DEF"

# Update service to previous task definition
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --task-definition $PREVIOUS_TASK_DEF \
  --force-new-deployment

echo "Waiting for rollback to complete..."

aws ecs wait services-stable \
  --cluster $CLUSTER \
  --services $SERVICE

echo "✅ Rollback successful!"
```

---

## SUMMARY

**CI/CD Capabilities:**
- ✅ Automated testing (unit, integration, E2E)
- ✅ Containerized deployment (Docker → ECR)
- ✅ Blue-green deployment (zero-downtime)
- ✅ Infrastructure as Code (Terraform)
- ✅ Automated rollback
- ✅ Environment-based workflows (dev, staging, prod)
- ✅ Security scanning (Trivy, Snyk)
- ✅ Performance monitoring (Lighthouse CI)

**Tools & Technologies:**
- GitHub Actions (CI/CD orchestration)
- Docker (containerization)
- AWS ECR (container registry)
- AWS ECS Fargate (container orchestration)
- Terraform (Infrastructure as Code)
- CloudFormation (alternative IaC)

**Deployment Frequency:**
- Staging: On every commit to staging branch (instant)
- Production: On main branch merge (requires approval)
- Hotfixes: Direct to main (emergency only)

---

**DevOps & CI/CD Specification - COMPLETE**



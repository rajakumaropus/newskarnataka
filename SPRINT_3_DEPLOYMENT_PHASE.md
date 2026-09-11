# 🔧 SPRINT 3 - PRODUCTION DEPLOYMENT PHASE GUIDE
## Detailed Procedures for Sept 15-19 Deployment

**Phase Duration:** 5 days (Monday Sept 15 - Friday Sept 19)  
**Goal:** Deploy all systems to production & validate  
**Teams:** All 3 teams executing in parallel  
**Outcome:** Production ready for launch Sept 22  

---

## 📅 DEPLOYMENT PHASE SCHEDULE

```
Monday (15)    → Sprint kickoff + deployment starts
Tuesday (16)   → Deployment continues + integration testing
Wednesday (17) → Production validation + basic load test
Thursday (18)  → Advanced load testing + security scan
Friday (19)    → Go/No-Go decision meeting
```

---

## 🎯 DAY 1: MONDAY, SEPTEMBER 15 - DEPLOYMENT KICKOFF

### 9:00 AM - All-Hands Sprint 3 Kickoff (30 min)

**Attendees:** All 10 developers + project manager + tech leads

**Agenda:**
1. Sprint 3 objectives review (5 min)
2. Team assignments confirmation (5 min)
3. Deployment timeline walkthrough (10 min)
4. Risk mitigation discussion (5 min)
5. Q&A (5 min)

**Output:**
- ✅ All team members understand their roles
- ✅ Timeline confirmed
- ✅ Blockers identified & mitigated
- ✅ Communication channels active

---

### Team A: Frontend Production Optimization (9:30 AM - 5 PM)

#### Task 1.1: Production Build Optimization

```bash
# Step 1: Create production build
cd newskarnataka-frontend
npm run build

# Step 2: Analyze bundle size
npm run build -- --analyze

# Expected output:
# - main.js: <200KB (gzipped)
# - vendor.js: <100KB (gzipped)
# Total: <500KB gzipped
```

**Optimizations:**
- Minify JavaScript & CSS
- Tree-shake unused code
- Compress images (JPEG 80%, PNG 9x)
- Remove console.log statements
- Code splitting for routes

```typescript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/material'],
  },
});
```

**Verification:**
- [ ] Build completes without errors
- [ ] No console warnings
- [ ] Bundle size <500KB (gzipped)
- [ ] All routes load successfully

#### Task 1.2: AWS S3 Configuration

```bash
# Step 1: Create S3 bucket for frontend
aws s3api create-bucket \
  --bucket newskarnataka-com-frontend-prod \
  --region us-east-1

# Step 2: Enable versioning
aws s3api put-bucket-versioning \
  --bucket newskarnataka-com-frontend-prod \
  --versioning-configuration Status=Enabled

# Step 3: Block public access (will be accessed via CloudFront)
aws s3api put-public-access-block \
  --bucket newskarnataka-com-frontend-prod \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Step 4: Upload production build
aws s3 sync ./out s3://newskarnataka-com-frontend-prod/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "404.html" \
  --exclude "500.html"

# Step 5: Upload HTML files (no cache)
aws s3 sync ./out s3://newskarnataka-com-frontend-prod/ \
  --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"
```

**Verification:**
- [ ] S3 bucket created
- [ ] Build files uploaded
- [ ] Versioning enabled
- [ ] Public access blocked

#### Task 1.3: CloudFront CDN Setup

```bash
# Step 1: Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# cloudfront-config.json
{
  "CallerReference": "newskarnataka-prod-$(date +%s)",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3Origin",
        "DomainName": "newskarnataka-com-frontend-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CacheBehaviors": [
    {
      "PathPattern": "/index.html",
      "TargetOriginId": "S3Origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "ForwardedValues": {
        "QueryString": false
      },
      "MinTTL": 0,
      "DefaultTTL": 0,
      "MaxTTL": 0
    }
  ],
  "Comment": "NewsKarnataka Frontend CDN",
  "Enabled": true
}
```

**Verification:**
- [ ] CloudFront distribution created
- [ ] Origin configured
- [ ] Cache behaviors set
- [ ] Distribution deploying (takes 15-20 min)

#### Task 1.4: SSL/TLS Certificate Setup

```bash
# Step 1: Request SSL certificate from ACM
aws acm request-certificate \
  --domain-name newskarnataka.com \
  --subject-alternative-names www.newskarnataka.com \
  --validation-method DNS \
  --region us-east-1

# Step 2: Verify DNS records
# (Wait for verification email, add DNS records)

# Step 3: Attach to CloudFront
aws cloudfront update-distribution \
  --id <DISTRIBUTION_ID> \
  --distribution-config file://updated-config.json
  # Include ACM certificate ARN in ViewerCertificate
```

**SSL Configuration:**
```json
{
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/...",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "Certificate": "...",
    "CertificateSource": "acm"
  }
}
```

**Verification:**
- [ ] Certificate issued
- [ ] DNS verified
- [ ] HTTPS working
- [ ] Security A+ rating (SSL Labs)

---

### Team B: Backend Strapi Deployment (9:30 AM - 5 PM)

#### Task 2.1: Docker Image Creation

```bash
# Step 1: Create optimized Dockerfile
cd newskarnataka-cms

cat > Dockerfile << 'EOF'
# Multi-stage build for optimization
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Strapi
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/.strapi ./.strapi
COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist

# Copy necessary directories
COPY src ./src
COPY config ./config
COPY public ./public
COPY .env.production ./.env.production

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/admin || exit 1

# Start Strapi
CMD ["npm", "start"]
EOF
```

**Build Optimization Points:**
- Multi-stage build (reduces image size)
- Alpine Linux (5MB vs 300MB+ for Ubuntu)
- Production dependencies only
- Removed dev packages
- Layer caching optimization

```bash
# Step 2: Build Docker image
docker build -t newskarnataka-cms:latest .

# Step 3: Tag for ECR
docker tag newskarnataka-cms:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

# Step 4: Verify image
docker run --rm newskarnataka-cms:latest npm -v
# Output should show npm version

# Expected image size: <300MB
docker images | grep newskarnataka-cms
```

**Verification:**
- [ ] Dockerfile created
- [ ] Image builds successfully
- [ ] Image size <300MB
- [ ] Health check working
- [ ] Image tagged for ECR

#### Task 2.2: Local Testing

```bash
# Step 1: Test image locally
docker run -d \
  --name newskarnataka-test \
  -p 1337:1337 \
  -e DATABASE_URL="postgresql://localhost/newskarnataka_test" \
  -e JWT_SECRET="test-secret-key" \
  -e ADMIN_JWT_SECRET="admin-secret-key" \
  -e NODE_ENV="production" \
  newskarnataka-cms:latest

# Step 2: Wait for startup
sleep 10

# Step 3: Test health check
curl http://localhost:1337/admin
# Should return admin panel

# Step 4: Test API endpoint
curl http://localhost:1337/api/articles
# Should return articles (or empty array)

# Step 5: Check logs
docker logs newskarnataka-test

# Step 6: Cleanup
docker stop newskarnataka-test
docker rm newskarnataka-test
```

**Verification:**
- [ ] Container starts successfully
- [ ] Health check passes
- [ ] API responds
- [ ] No errors in logs
- [ ] Admin panel accessible

#### Task 2.3: AWS ECR Push

```bash
# Step 1: Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Step 2: Create ECR repository
aws ecr create-repository \
  --repository-name newskarnataka-cms \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES

# Step 3: Push image to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

# Step 4: Verify in ECR
aws ecr list-images --repository-name newskarnataka-cms --region us-east-1

# Step 5: Tag as production
aws ecr put-image-tag-mutability \
  --repository-name newskarnataka-cms \
  --image-tag-mutability MUTABLE \
  --region us-east-1
```

**Verification:**
- [ ] ECR repository created
- [ ] Image pushed successfully
- [ ] Image scanning enabled
- [ ] Image accessible from AWS

#### Task 2.4: Environment Configuration

```bash
# Create .env.production for Strapi
cat > /tmp/strapi-env << 'EOF'
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=newskarnataka-prod.c7zl9q9v8r5w.us-east-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=newskarnataka
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<STRONG_PASSWORD>
DATABASE_SSL=true

# JWT
JWT_SECRET=<GENERATE_STRONG_SECRET_32_CHARS>
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=<GENERATE_STRONG_SECRET_32_CHARS>

# Environment
NODE_ENV=production
APP_KEYS=<GENERATE_KEYS>
API_TOKEN_SALT=<GENERATE_SALT>

# Redis
REDIS_HOST=newskarnataka-redis.abcdef.ng.0001.use1.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=<REDIS_PASSWORD>

# URL
URL=https://api.newskarnataka.com

# CORS
CORS_ORIGIN=https://newskarnataka.com

# Admin
ADMIN_PATH=/admin

# Logging
LOG_LEVEL=info

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
EOF

# Secure copy to EC2 (DO NOT commit to git)
# Use AWS Secrets Manager or Parameter Store instead
aws secretsmanager create-secret \
  --name strapi-prod-env \
  --description "Strapi production environment variables" \
  --secret-string file:///tmp/strapi-env
```

**Security Notes:**
- ✅ Never commit .env to git
- ✅ Use AWS Secrets Manager
- ✅ Rotate secrets regularly
- ✅ Use strong passwords (32+ chars)
- ✅ Enable SSL for database

**Verification:**
- [ ] Environment variables created
- [ ] Stored in AWS Secrets Manager
- [ ] Not in git repository
- [ ] All required vars present

---

### Team C: AWS Infrastructure Setup (9:30 AM - 5 PM)

#### Task 3.1: EC2 Instance Setup

```bash
# Step 1: Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name newskarnataka-prod \
  --security-group-ids sg-newskarnataka-prod \
  --subnet-id subnet-prod-1a \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=newskarnataka-cms-prod}]'

# Step 2: Wait for instance to be running
aws ec2 wait instance-running --instance-ids i-xxxxx

# Step 3: Get instance details
aws ec2 describe-instances --instance-ids i-xxxxx \
  --query 'Reservations[0].Instances[0].[PublicIpAddress,PrivateIpAddress]'

# Step 4: SSH to instance
ssh -i newskarnataka-prod.pem ec2-user@EC2_PUBLIC_IP

# Step 5: Update system
sudo yum update -y
sudo yum install -y docker git

# Step 6: Start Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Step 7: Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Step 8: Verify installation
docker --version
docker-compose --version
```

**Instance Specifications:**
- Type: t3.large (2 CPU, 8GB RAM)
- OS: Amazon Linux 2
- Storage: 100GB gp3
- Network: VPC with security groups

**Verification:**
- [ ] Instance running
- [ ] Docker installed
- [ ] Can SSH to instance
- [ ] Docker commands work

#### Task 3.2: Load Balancer Configuration

```bash
# Step 1: Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name newskarnataka-alb \
  --subnets subnet-prod-1a subnet-prod-1b \
  --security-groups sg-alb \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Step 2: Create target group
aws elbv2 create-target-group \
  --name newskarnataka-tg \
  --protocol HTTP \
  --port 1337 \
  --vpc-id vpc-prod \
  --health-check-protocol HTTP \
  --health-check-path /admin \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 2

# Step 3: Register target
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/... \
  --targets Id=i-xxxxx,Port=1337

# Step 4: Create listener with HTTPS
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:ACCOUNT:certificate/... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...

# Step 5: Create HTTP->HTTPS redirect
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"
```

**ALB Configuration:**
- Type: Application Load Balancer
- Ports: 80 (HTTP), 443 (HTTPS)
- Subnets: 2 AZs for HA
- Health check: /admin endpoint
- SSL: ACM certificate

**Verification:**
- [ ] ALB created
- [ ] Target group healthy
- [ ] HTTPS listener active
- [ ] HTTP redirects to HTTPS

#### Task 3.3: RDS Database Connection

```bash
# Step 1: Get RDS endpoint
aws rds describe-db-instances \
  --db-instance-identifier newskarnataka-prod \
  --query 'DBInstances[0].Endpoint'

# Step 2: Test connection from EC2
ssh -i newskarnataka-prod.pem ec2-user@EC2_IP

# From EC2:
sudo yum install -y postgresql

psql -h newskarnataka-prod.c7zl9q9v8r5w.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newskarnataka \
  -c "SELECT version();"

# Should show PostgreSQL version

# Step 3: Run migrations
# (Will be done during deployment)
```

**RDS Details:**
- Engine: PostgreSQL 14
- Instance: db.t3.medium
- Multi-AZ: Enabled
- Backup: 30-day retention
- Encryption: Enabled

**Verification:**
- [ ] Database accessible from EC2
- [ ] Connection string working
- [ ] Can execute queries

#### Task 3.4: CloudWatch Monitoring Setup

```bash
# Step 1: Create CloudWatch log group
aws logs create-log-group --log-group-name /newskarnataka/strapi

# Step 2: Set retention
aws logs put-retention-policy \
  --log-group-name /newskarnataka/strapi \
  --retention-in-days 30

# Step 3: Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name newskarnataka-cpu-high \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-xxxxx

# Step 4: Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name newskarnataka-prod \
  --dashboard-body file://dashboard-config.json
```

**Monitoring Metrics:**
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Application errors
- API response time

**Verification:**
- [ ] Log group created
- [ ] Alarms configured
- [ ] Dashboard visible
- [ ] Logs streaming

---

## 🎯 DAY 2: TUESDAY, SEPTEMBER 16 - DEPLOYMENT CONTINUES

### Morning Standup (9:00 AM)

**Status Check:**
- Frontend: Build optimized, S3 configured, CloudFront deploying
- Backend: Docker image built, ECR push complete
- DevOps: EC2 ready, ALB configured, monitoring setup

### Team A: Frontend Deployment

```bash
# Step 1: Wait for CloudFront distribution (20 min)
# Check status
aws cloudfront get-distribution-config --id E3FJBDK1234567

# Step 2: Update Route53 DNS
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://route53-update.json

# route53-update.json
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "newskarnataka.com",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "Z2FDTNDATAQYW2",
        "DNSName": "d111111abcdef8.cloudfront.net",
        "EvaluateTargetHealth": false
      }
    }
  }]
}

# Step 3: Verify DNS propagation
dig newskarnataka.com
nslookup newskarnataka.com
curl -I https://newskarnataka.com

# Step 4: Test all routes
curl https://newskarnataka.com/
curl https://newskarnataka.com/articles
curl https://newskarnataka.com/login
```

**Verification:**
- [ ] CloudFront deployed
- [ ] DNS updated
- [ ] HTTPS working
- [ ] All routes accessible

### Team B: Backend Deployment

```bash
# Step 1: SSH to EC2
ssh -i newskarnataka-prod.pem ec2-user@EC2_IP

# Step 2: Setup ECR authentication
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Step 3: Create environment file
cat > /opt/strapi/.env << 'EOF'
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=production
EOF

# Step 4: Pull and run Strapi container
docker pull $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

docker run -d \
  --name newskarnataka-cms \
  -p 1337:1337 \
  --env-file /opt/strapi/.env \
  --restart unless-stopped \
  --log-driver awslogs \
  --log-opt awslogs-group=/newskarnataka/strapi \
  --log-opt awslogs-region=us-east-1 \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newskarnataka-cms:latest

# Step 5: Monitor startup
docker logs -f newskarnataka-cms

# Expected: "Strapi server running at http://localhost:1337"

# Step 6: Verify health
curl http://localhost:1337/admin

# Step 7: Verify database connection
curl http://localhost:1337/api/articles
```

**Verification:**
- [ ] Container running
- [ ] Health check passing
- [ ] Database connected
- [ ] API responding
- [ ] Logs in CloudWatch

### Team C: Infrastructure Validation

```bash
# Step 1: Test ALB
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:...

# Should show: State=healthy

# Step 2: Test via ALB
curl https://api.newskarnataka.com/admin
# Should redirect or load admin

# Step 3: Test database replication (if Multi-AZ)
aws rds describe-db-instances \
  --db-instance-identifier newskarnataka-prod \
  --query 'DBInstances[0].DBInstanceStatus'

# Step 4: Check backups configured
aws rds describe-db-backup-attributes \
  --db-instance-identifier newskarnataka-prod
```

**Verification:**
- [ ] ALB targets healthy
- [ ] Load balancer responding
- [ ] Database replicated
- [ ] Backups configured

### Evening Standup (5:00 PM)

**Deliverables:**
- ✅ Frontend deployed to CloudFront
- ✅ Backend running in Docker on EC2
- ✅ Database connected
- ✅ ALB routing traffic
- ✅ Monitoring active

---

## 🎯 DAY 3: WEDNESDAY, SEPTEMBER 17 - PRODUCTION VALIDATION

### Integration Testing (9:00 AM - 2:00 PM)

```bash
# Test all major flows

# 1. User Registration Flow
curl -X POST https://api.newskarnataka.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@newskarnataka.com",
    "username": "testuser",
    "password": "TestPassword123!"
  }'

# 2. User Login Flow
curl -X POST https://api.newskarnataka.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@newskarnataka.com",
    "password": "TestPassword123!"
  }'

# Save JWT token
export JWT_TOKEN="eyJhbGc..."

# 3. Article Creation
curl -X POST https://api.newskarnataka.com/api/articles \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "Test content",
    "category": 1
  }'

# 4. Article List
curl https://api.newskarnataka.com/api/articles

# 5. Article Detail
curl https://api.newskarnataka.com/api/articles/1

# 6. Search
curl "https://api.newskarnataka.com/api/articles/search?q=test"

# 7. Categories
curl https://api.newskarnataka.com/api/categories

# 8. Comments
curl https://api.newskarnataka.com/api/comments

# 9. User Profile
curl -H "Authorization: Bearer $JWT_TOKEN" \
  https://api.newskarnataka.com/api/users/me

# 10. Admin Endpoints
curl -H "Authorization: Bearer $JWT_TOKEN" \
  https://api.newskarnataka.com/api/admin/stats
```

**Integration Test Checklist:**
- [ ] All endpoints respond
- [ ] Authentication working
- [ ] Authorization working
- [ ] Data persisting
- [ ] No 500 errors
- [ ] No 404 errors
- [ ] Response times <150ms

### Frontend Testing (2:00 PM - 5:00 PM)

Test all major pages in production:

```
Homepage
- [ ] Loads
- [ ] Shows articles
- [ ] Navigation works
- [ ] Responsive on mobile

Articles Page
- [ ] Lists all articles
- [ ] Pagination works
- [ ] Search works
- [ ] Filter by category works

Article Detail Page
- [ ] Shows full article
- [ ] Comments display
- [ ] Like button works
- [ ] Share buttons work

Login Page
- [ ] Form renders
- [ ] Validation works
- [ ] Login succeeds
- [ ] Redirects to dashboard

Dashboard
- [ ] User info displays
- [ ] Can create article
- [ ] Can edit article
- [ ] Can delete article

Admin Panel
- [ ] Accessible
- [ ] User management works
- [ ] Content moderation works
- [ ] Analytics visible
```

---

## 🎯 DAY 4: THURSDAY, SEPTEMBER 18 - LOAD TESTING & SECURITY

### Morning: Load Testing

```bash
# Use Apache Bench or wrk

# Test 1: 100 concurrent users
ab -n 10000 -c 100 https://newskarnataka.com/

# Expected:
# - Requests per second: >100
# - Failed requests: 0
# - Mean time per request: <150ms

# Test 2: 500 concurrent users
wrk -t4 -c500 -d30s https://newskarnataka.com/

# Test 3: 1000 concurrent users
wrk -t8 -c1000 -d30s https://newskarnataka.com/

# Test specific endpoints
wrk -t4 -c500 -d30s https://api.newskarnataka.com/api/articles
wrk -t4 -c500 -d30s https://api.newskarnataka.com/api/categories
```

**Load Test Acceptance Criteria:**
- ✅ Error rate: <1%
- ✅ Response time p95: <300ms
- ✅ Response time p99: <500ms
- ✅ Throughput: >100 req/sec

### Afternoon: Security Scan

```bash
# Run security tests

# 1. SSL/TLS Check
testssl.sh https://newskarnataka.com/
# Expected: A+ rating

# 2. OWASP Top 10 Check
# Use automated tools like OWASPZAP or Burp

# 3. SQL Injection Test
# Manual testing with payloads
curl "https://api.newskarnataka.com/api/articles?search='; DROP TABLE articles; --"
# Should return 400 error (parameterized queries)

# 4. XSS Test
# Create article with XSS payload
curl -X POST https://api.newskarnataka.com/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<script>alert(\"XSS\")</script>",
    "content": "Test"
  }'
# Should sanitize/escape

# 5. CSRF Protection
# Verify CSRF tokens required

# 6. Rate Limiting
# Test rate limiting
for i in {1..1000}; do curl https://api.newskarnataka.com/api/articles; done
# Should start returning 429 (Too Many Requests)
```

**Security Checklist:**
- [ ] SSL certificate valid
- [ ] No vulnerabilities in dependencies
- [ ] SQL injection protected
- [ ] XSS protection active
- [ ] CSRF tokens working
- [ ] Rate limiting active
- [ ] Headers configured (CSP, X-Frame-Options, etc)

---

## 🎯 DAY 5: FRIDAY, SEPTEMBER 19 - GO/NO-GO DECISION

### 9:00 AM - 12:00 PM: Final Verification

```bash
# Final checklist before decision

# 1. Frontend check
curl -I https://newskarnataka.com/
# HTTP/2 200 OK

# 2. Backend check
curl -I https://api.newskarnataka.com/api/articles
# HTTP/2 200 OK

# 3. Database check
# Login to production RDS and verify data

# 4. Monitoring check
# Verify CloudWatch dashboards
# Verify alarms configured
# Verify logs streaming

# 5. Performance check
# Review metrics from load testing
# Confirm <150ms response times
# Confirm >1000 req/sec capacity

# 6. Security check
# Review security scan results
# Confirm no critical vulnerabilities
# Confirm SSL/TLS working

# 7. Backup check
# Verify database backup completed
# Verify backup restoration tested

# 8. Team check
# Confirm all developers ready
# Confirm support team trained
# Confirm on-call schedule ready
```

### 3:00 PM - GO/NO-GO DECISION MEETING

**Attendees:**
- Project Manager
- Tech Leads (3)
- Team Leads (3)
- 2-3 Senior Developers

**Agenda (60 min):**

1. **Frontend Status (10 min)**
   - Production build deployed
   - CloudFront active
   - DNS updated
   - HTTPS working
   - Performance baseline met

2. **Backend Status (10 min)**
   - Strapi deployed
   - Database connected
   - All 45+ endpoints tested
   - Authentication working
   - Logs streaming

3. **Infrastructure Status (10 min)**
   - EC2 running
   - ALB healthy
   - RDS replicated
   - Backups configured
   - Monitoring active

4. **Test Results (10 min)**
   - Load testing: 1000 concurrent users ✅
   - Security scan: No critical issues ✅
   - Integration testing: All flows working ✅
   - Performance: <150ms response time ✅

5. **Risk Assessment (10 min)**
   - Any known issues?
   - Mitigation plans?
   - Rollback readiness?
   - Support team readiness?

6. **Decision (10 min)**
   - Vote: GO or NO-GO
   - If GO: Launch Sept 22 confirmed
   - If NO-GO: Identify blockers, reschedule

**Decision Criteria:**

✅ **GO if:**
- All systems deployed successfully
- Load testing passed (1000 users)
- Security scan: No critical issues
- All API endpoints responding
- Performance targets met
- Monitoring active
- Team confident

❌ **NO-GO if:**
- Any critical issues remain
- Performance targets not met
- Security vulnerabilities found
- Deployment not complete
- Team expresses low confidence

**Output:**
- Official decision recorded
- Meeting minutes distributed
- Launch date confirmed or rescheduled
- Any issues documented
- Mitigation plans created

---

## ✅ DEPLOYMENT PHASE COMPLETION

### Deliverables by Friday EOD:

✅ Frontend production deployed
✅ Backend production deployed
✅ Database production configured
✅ All systems integrated
✅ Performance tested
✅ Security verified
✅ Monitoring active
✅ Team trained & ready
✅ Go/No-Go decision made

---

**SPRINT 3 DEPLOYMENT PHASE COMPLETE** 🎉

Ready for launch on September 22!


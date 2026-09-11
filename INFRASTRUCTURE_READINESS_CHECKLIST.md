# Infrastructure Readiness Checklist
## Pre-Testing Validation Gate - newskarnataka Migration

**Project:** newskarnataka.com Strapi Migration  
**Status:** Pre-Implementation  
**Date:** September 2026  
**Purpose:** Comprehensive validation before Week 1 testing begins

---

## PHASE 0: AWS ACCOUNT SETUP (Week -1)

### AWS Account Configuration

- [ ] **AWS Account Created**
  - [ ] Root account secured (MFA enabled, IAM users created)
  - [ ] Billing alarm set at ₹20,000/month
  - [ ] Cost allocation tags defined (env, app, team)
  - [ ] AWS Organizations setup (if multi-account)
  - [ ] CloudTrail enabled for API audit logs

- [ ] **IAM Users & Roles Created**
  - [ ] Admin user for infrastructure team
  - [ ] Developer user for app deployment
  - [ ] Read-only user for monitoring
  - [ ] Service roles for ECS, RDS, Lambda
  - [ ] Cross-account roles for backups (if DR region needed)

- [ ] **VPC Foundation**
  - [ ] VPC created (10.0.0.0/16)
  - [ ] Public subnets created (10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24)
  - [ ] Private subnets created (10.0.11-43.0/24 - 9 total)
  - [ ] Internet Gateway attached
  - [ ] NAT Gateways deployed (3x, one per AZ)
  - [ ] Route tables configured (public & private)
  - [ ] VPC Flow Logs enabled (for debugging)
  - [ ] DNS hostnames enabled

- [ ] **Security Foundation**
  - [ ] AWS KMS key created for encryption
  - [ ] AWS Secrets Manager enabled
  - [ ] CloudWatch Logs groups created
  - [ ] S3 bucket for logs created (newskarnataka-logs)

---

## PHASE 1: COMPUTE INFRASTRUCTURE (Week 0)

### ECS Cluster

- [ ] **Cluster Setup**
  - [ ] ECS cluster created (newskarnataka-prod-cluster)
  - [ ] Capacity providers configured (FARGATE, FARGATE_SPOT)
  - [ ] CloudWatch Container Insights enabled
  - [ ] Cluster capacity metrics visible

- [ ] **Load Balancer**
  - [ ] Application Load Balancer created
  - [ ] ALB security group configured
  - [ ] Subnets assigned (all 3 public subnets)
  - [ ] HTTP listener configured (port 80)
  - [ ] HTTPS listener configured (port 443)
  - [ ] Target group created (port 3000)
  - [ ] Health check path configured (/admin/health)
  - [ ] Stickiness disabled (stateless)
  - [ ] ALB DNS name accessible
  - [ ] ALB can reach ECS tasks (health check passing)

- [ ] **Auto Scaling**
  - [ ] Auto Scaling group created
  - [ ] Min = 2, Max = 10, Desired = 3 configured
  - [ ] CPU scaling policy created (target 70%)
  - [ ] Memory scaling policy created (target 80%)
  - [ ] Scaling cooldown periods set (60s out, 300s in)
  - [ ] CloudWatch metrics for scaling visible

---

## PHASE 2: DATABASE INFRASTRUCTURE (Week 0)

### RDS PostgreSQL

- [ ] **Database Instance**
  - [ ] RDS instance created (db.t4g.xlarge)
  - [ ] Multi-AZ enabled
  - [ ] VPC security group applied (newskarnataka-rds-sg)
  - [ ] DB subnet group assigned (3 subnets)
  - [ ] Storage allocated (500 GB gp3)
  - [ ] Encryption at rest enabled (KMS)
  - [ ] Master password created (in Secrets Manager)
  - [ ] Database accessible from ECS security group only

- [ ] **Database Configuration**
  - [ ] Parameter group applied (newskarnataka-strapi-pg14)
  - [ ] Slow query log enabled
  - [ ] Error log enabled
  - [ ] General log disabled (performance)
  - [ ] Performance Insights enabled (7-day retention)
  - [ ] Enhanced monitoring enabled (1-min granularity)

- [ ] **Backup & Recovery**
  - [ ] Automated backups enabled (30-day retention)
  - [ ] Backup window set (03:00-04:00 UTC)
  - [ ] Copy backups to backup vault (100-year retention)
  - [ ] First manual backup completed
  - [ ] Restore from backup tested (restore to different instance)
  - [ ] Point-in-time recovery tested (restore 1 hour ago)

- [ ] **Read Replicas**
  - [ ] Read Replica 1 created (us-east-1b, db.t4g.large)
  - [ ] Read Replica 2 created (us-east-1c, db.t4g.large)
  - [ ] Replica lag monitored (< 100ms expected)
  - [ ] Read-only user can connect to replicas
  - [ ] Replica promotion eligibility verified

- [ ] **Database Initialization**
  - [ ] Database `newskarnataka_prod` created
  - [ ] Database encoding set to UTF8
  - [ ] User `strapi_app` created (read/write)
  - [ ] User `strapi_admin` created (superuser)
  - [ ] User `read_only` created (select only)
  - [ ] Schemas created (strapi, content, users, analytics, audit)
  - [ ] Schema permissions granted to users
  - [ ] Test connection from ECS task successful

---

## PHASE 3: CACHE INFRASTRUCTURE (Week 0)

### ElastiCache Redis

- [ ] **Redis Cluster**
  - [ ] Redis cluster created (cache.t4g.large, 2 nodes)
  - [ ] Multi-AZ enabled
  - [ ] Automatic failover enabled
  - [ ] VPC security group applied (newskarnataka-redis-sg)
  - [ ] Subnet group assigned (2 subnets, different AZs)
  - [ ] Encryption at rest enabled (KMS)
  - [ ] Encryption in transit enabled (TLS)
  - [ ] Auth token created (in Secrets Manager)
  - [ ] Redis endpoint accessible from ECS only

- [ ] **Redis Configuration**
  - [ ] Maxmemory policy set to allkeys-lru
  - [ ] Maxmemory-samples set to 5
  - [ ] TCP keepalive configured
  - [ ] Timeout policy configured
  - [ ] Appendonly disabled (RDB backup sufficient)
  - [ ] Automatic snapshots enabled (daily)

- [ ] **Backup & Recovery**
  - [ ] Automatic snapshot scheduled (daily)
  - [ ] Manual snapshot created
  - [ ] Snapshot retention verified (5 snapshots kept)
  - [ ] Restore from snapshot tested

- [ ] **Monitoring**
  - [ ] CloudWatch metrics visible (CacheHits, Misses, Eviction)
  - [ ] Alarms configured:
    - [ ] EvictionCount > 1000/min
    - [ ] DatabaseMemoryUsagePercentage > 90%
    - [ ] CacheNodes < 2
    - [ ] CPU Utilization > 75%
    - [ ] SwapUsage > 0
  - [ ] SNS notifications configured

- [ ] **Testing**
  - [ ] Connected from ECS task using redis-cli
  - [ ] SET/GET operations verified
  - [ ] Pub/Sub tested (SUBSCRIBE/PUBLISH)
  - [ ] Key TTL tested (EXPIRE command)
  - [ ] Failover tested (stop primary, verify replica takeover)

---

## PHASE 4: SEARCH INFRASTRUCTURE (Week 0)

### OpenSearch/Elasticsearch

- [ ] **Domain Setup**
  - [ ] OpenSearch domain created (3 master, 2 data nodes)
  - [ ] Node types configured (t3.small masters, m5.xlarge data)
  - [ ] Storage allocated (500 GB per data node)
  - [ ] Multi-AZ enabled (3 AZs)
  - [ ] VPC security group applied (newskarnataka-es-sg)
  - [ ] Subnets assigned (3 subnets, different AZs)
  - [ ] Encryption at rest enabled (KMS)
  - [ ] Encryption in transit enabled (TLS 1.2+)
  - [ ] Domain access policy configured (IAM-based)

- [ ] **Index Configuration**
  - [ ] articles index created (3 shards, 2 replicas)
  - [ ] users index created (1 shard, 2 replicas)
  - [ ] analytics index created (2 shards, 1 replica)
  - [ ] Index mappings applied (fields, analyzers)
  - [ ] Custom analyzer for Kannada configured
  - [ ] Index lifecycle management (ILM) configured

- [ ] **Backup & Recovery**
  - [ ] Snapshot repository configured (S3 bucket)
  - [ ] Automated snapshots scheduled (daily)
  - [ ] First snapshot created
  - [ ] Restore from snapshot tested (restore to different index)

- [ ] **Monitoring**
  - [ ] CloudWatch metrics visible (Nodes, Shards, Indexing Rate)
  - [ ] Kibana access verified (if enabled)
  - [ ] Alarms configured:
    - [ ] ClusterHealthStatus not GREEN
    - [ ] ShardAllocationFailures > 0
    - [ ] InitializingShards > 0
    - [ ] RelocatingShards > 0
  - [ ] SNS notifications configured

- [ ] **Testing**
  - [ ] Connected to domain from ECS task
  - [ ] Index operations tested (PUT/GET)
  - [ ] Search query tested (GET /articles/_search)
  - [ ] Aggregations tested
  - [ ] Failover behavior observed

---

## PHASE 5: STORAGE INFRASTRUCTURE (Week 0)

### S3 & CloudFront

- [ ] **S3 Bucket Setup**
  - [ ] Bucket created (newskarnataka-prod-content)
  - [ ] Versioning enabled
  - [ ] Encryption enabled (AES-256)
  - [ ] Block public access enabled (all)
  - [ ] Folder structure created (articles/, media/, backups/, logs/)
  - [ ] Access logging enabled (to separate bucket)
  - [ ] MFA delete disabled (not required for auto-operations)

- [ ] **S3 Lifecycle Policies**
  - [ ] Archive backups to Glacier (30 days)
  - [ ] Archive logs to Glacier (60 days)
  - [ ] Delete temp uploads (7 days)
  - [ ] Cleanup non-current versions (90 days)
  - [ ] Delete old deleted markers (30 days)

- [ ] **S3 Access Control**
  - [ ] Bucket policy updated (CloudFront OAI only)
  - [ ] CORS configuration set (allow newskarnataka.com)
  - [ ] Public access explicitly blocked
  - [ ] Signed URLs tested (for private content)

- [ ] **CloudFront Distribution**
  - [ ] Distribution created (HTTPS enabled)
  - [ ] Origin configured (ALB + S3)
  - [ ] Behaviors configured (/articles/images/*, /api/*, /*)
  - [ ] Cache policies set (1 year for versioned, 1 day for others)
  - [ ] Compression enabled (gzip, brotli)
  - [ ] SSL certificate assigned (ACM)
  - [ ] HTTP to HTTPS redirect configured
  - [ ] Distribution deployed and accessible
  - [ ] DNS CNAME: cdn.newskarnataka.com → d111.cloudfront.net

- [ ] **CDN Testing**
  - [ ] Image served through CloudFront (check X-Cache headers)
  - [ ] Cache hit verified (second request shows HIT)
  - [ ] Compression verified (Accept-Encoding header)
  - [ ] TTL headers respected

---

## PHASE 6: NETWORK & SECURITY (Week 0)

### Security Groups

- [ ] **Security Group Validation**
  - [ ] ALB security group (inbound: 80, 443; outbound: all)
  - [ ] ECS security group (inbound: 3000 from ALB; outbound: 5432, 6379, 9200, 443, 53)
  - [ ] RDS security group (inbound: 5432 from ECS; outbound: none)
  - [ ] Redis security group (inbound: 6379 from ECS; outbound: none)
  - [ ] ES security group (inbound: 9200 from ECS, 9300 self; outbound: none)
  - [ ] Rules tested with traceroute/telnet

- [ ] **Network ACLs**
  - [ ] Public subnet NACL configured (allow 80, 443, ephemeral)
  - [ ] Private subnet NACL configured (allow internal, block internet)
  - [ ] VPC flow logs enabled and verified

### DNS & SSL

- [ ] **Route 53 (DNS)**
  - [ ] Hosted zone created (newskarnataka.com)
  - [ ] A record points to ALB DNS name (or alias)
  - [ ] CNAME record for www (optional)
  - [ ] CNAME record for api (api.newskarnataka.com)
  - [ ] CNAME record for cdn (cdn.newskarnataka.com → CloudFront)
  - [ ] TTL set to 300 seconds
  - [ ] DNS queries resolve correctly (nslookup/dig)

- [ ] **SSL/TLS Certificate**
  - [ ] ACM certificate issued (newskarnataka.com + *.newskarnataka.com)
  - [ ] DNS validation completed
  - [ ] Certificate assigned to ALB listener (443)
  - [ ] Certificate assigned to CloudFront distribution
  - [ ] Auto-renewal enabled
  - [ ] HTTPS redirect working (curl -L http://newskarnataka.com)
  - [ ] Mixed content warnings checked (no HTTP resources in HTTPS page)

---

## PHASE 7: CI/CD PIPELINE (Week 0)

### GitHub & ECR

- [ ] **GitHub Setup**
  - [ ] Repository created (newskarnataka-migration)
  - [ ] Main branch protected (require PR reviews)
  - [ ] Branch rules configured (no direct commits to main)
  - [ ] Webhook created to GitHub Actions
  - [ ] Deploy keys added (for deployment actions)

- [ ] **ECR Registry**
  - [ ] ECR repository created (newskarnataka-strapi)
  - [ ] Lifecycle policy configured (keep 5 recent images)
  - [ ] Image scanning enabled (for vulnerabilities)
  - [ ] Access role created (for GitHub Actions push)

- [ ] **GitHub Actions**
  - [ ] Workflow file created (.github/workflows/deploy.yml)
  - [ ] Workflow triggers configured (push to main, manual dispatch)
  - [ ] Build step: npm install, lint, test
  - [ ] Security scan step: npm audit, snyk
  - [ ] Docker build step: Build and push to ECR
  - [ ] Deploy step: Update ECS service
  - [ ] Rollback step: Manual trigger to previous image
  - [ ] Workflow tested (triggered successfully)

- [ ] **ECS Task Definition**
  - [ ] Task definition created (newskarnataka-strapi)
  - [ ] Container definition configured (port 3000)
  - [ ] Environment variables set
  - [ ] Log driver configured (CloudWatch Logs)
  - [ ] Secrets from Secrets Manager referenced
  - [ ] CPU/Memory allocated (2048/4096)
  - [ ] Task role assigned (for AWS API access)
  - [ ] Task execution role assigned (for ECR pull, logs, secrets)

---

## PHASE 8: MONITORING & ALERTING (Week 0)

### CloudWatch

- [ ] **Dashboards Created**
  - [ ] Application dashboard (request rate, latency, errors)
  - [ ] Database dashboard (connections, query latency, replication lag)
  - [ ] Cache dashboard (hit/miss ratio, memory usage, evictions)
  - [ ] Search dashboard (indexing rate, query latency, shard health)
  - [ ] Infrastructure dashboard (CPU, memory, network, disk)

- [ ] **Log Groups**
  - [ ] /aws/ecs/newskarnataka created
  - [ ] /aws/rds/newskarnataka created
  - [ ] /aws/elasticache/newskarnataka created
  - [ ] /aws/opensearch/newskarnataka created
  - [ ] Retention policies set (30 days default, 90 days for archives)

- [ ] **Alarms Configured**
  - [ ] High CPU (> 80% for 5 min) → SNS notification
  - [ ] High Memory (> 85% for 5 min) → SNS notification
  - [ ] Database errors (> 5%) → SNS notification
  - [ ] API errors (> 1%) → SNS notification
  - [ ] Response latency (P95 > 2s) → SNS notification
  - [ ] Cache evictions (> 1000/min) → SNS notification
  - [ ] ES cluster health (not GREEN) → SNS notification
  - [ ] Low disk space (< 10% free) → SNS notification

- [ ] **SNS Topics**
  - [ ] Topic created (newskarnataka-alerts)
  - [ ] Email subscriptions added (ops team)
  - [ ] Slack integration configured (optional)
  - [ ] Test alert sent and received

### Logging & Debugging

- [ ] **Log Aggregation**
  - [ ] Application logs in CloudWatch Logs
  - [ ] Log format: JSON with timestamps, request_id, user_id
  - [ ] Log levels: error, warn, info, debug (configurable)
  - [ ] Log retention: 30 days in CloudWatch, 1 year in S3

- [ ] **Request Tracing**
  - [ ] X-Ray enabled for ECS tasks
  - [ ] Service map visible in X-Ray console
  - [ ] Trace sampling configured (10% of requests)
  - [ ] Database queries visible in traces

---

## PHASE 9: SECURITY & COMPLIANCE (Week 0)

### AWS WAF

- [ ] **WAF WebACL**
  - [ ] WebACL created (newskarnataka-waf)
  - [ ] AWS Managed Rules applied:
    - [ ] AWSManagedRulesCommonRuleSet (SQL injection, XSS)
    - [ ] AWSManagedRulesKnownBadInputsRuleSet
    - [ ] AWSManagedRulesAmazonIpReputationList
  - [ ] Custom rate limit rule (2000 req/5min)
  - [ ] Geo-blocking rule (optional: allow India/US)
  - [ ] WebACL associated with CloudFront distribution
  - [ ] WAF logging enabled (to CloudWatch Logs)

### Secrets Management

- [ ] **Secrets Manager**
  - [ ] Database password stored (strapi_app)
  - [ ] Admin password stored (strapi_admin)
  - [ ] Groq API key stored
  - [ ] JWT secret stored
  - [ ] AWS access keys stored (if using programmatic access)
  - [ ] Rotation enabled (every 30 days for sensitive)
  - [ ] Rotation lambda function configured
  - [ ] Retrieval policy tested from ECS task

### Access Control

- [ ] **IAM Policies**
  - [ ] ECS task role has minimal permissions (least privilege)
  - [ ] ECS task can read Secrets Manager only for required secrets
  - [ ] ECS task can write CloudWatch Logs
  - [ ] ECS task can access S3 buckets (specific prefixes only)
  - [ ] No * (wildcard) permissions unless unavoidable
  - [ ] Policy reviewed for security

- [ ] **VPC Endpoint Security**
  - [ ] S3 endpoint created (no NAT Gateway needed for S3)
  - [ ] Secrets Manager endpoint created (if using private link)
  - [ ] Endpoint policies configured (restrict to required services)

---

## PHASE 10: DISASTER RECOVERY (Week 0)

### Backup Testing

- [ ] **Database Backups**
  - [ ] RDS automated backup created
  - [ ] Point-in-time restore tested (restore to different instance)
  - [ ] Restore validation queries executed (count articles, verify data)
  - [ ] Cross-region backup tested (copied to different region)
  - [ ] Backup location documented

- [ ] **Elasticsearch Backups**
  - [ ] Snapshot to S3 created
  - [ ] Restore from snapshot tested
  - [ ] Restore validation queries executed
  - [ ] Backup retention verified (30 snapshots kept)

- [ ] **S3 Backups**
  - [ ] Versioning enabled (protection against deletion)
  - [ ] Cross-region replication configured (if needed)
  - [ ] Lifecycle policies tested (archive old versions)

### Failover Testing

- [ ] **Multi-AZ RDS Failover**
  - [ ] Manual failover initiated from RDS console
  - [ ] Failover time measured (< 2 minutes expected)
  - [ ] Read replicas promoted during failover
  - [ ] Application remained online during failover

- [ ] **Redis Failover**
  - [ ] Primary node stopped
  - [ ] Replica promoted to primary (< 30 seconds)
  - [ ] Application reconnected to new primary
  - [ ] Data integrity verified

- [ ] **Elasticsearch Cluster Resilience**
  - [ ] One data node stopped
  - [ ] Cluster status remained GREEN (replicas took over)
  - [ ] Queries executed without errors
  - [ ] Node brought back online (rejoined cluster)

---

## PHASE 11: APPLICATION READINESS (Week 1 Start)

### Strapi Application

- [ ] **Strapi Build**
  - [ ] Node.js 18+ installed
  - [ ] npm dependencies installed (npm ci)
  - [ ] TypeScript compiled (npm run build)
  - [ ] Build output verified (dist/ folder created)
  - [ ] No TypeScript errors or warnings

- [ ] **Docker Image**
  - [ ] Dockerfile created (multi-stage build)
  - [ ] Docker image built locally (docker build)
  - [ ] Docker image size < 200 MB
  - [ ] Docker image tested locally (docker run)
  - [ ] Health check endpoint accessible (curl localhost:3000/admin/health)

- [ ] **Environment Configuration**
  - [ ] Environment variables defined (.env.example)
  - [ ] Sensitive values in Secrets Manager
  - [ ] Application reads from Secrets Manager correctly
  - [ ] Database connection string works
  - [ ] Redis connection works
  - [ ] Elasticsearch connection works

- [ ] **Database Migrations**
  - [ ] Strapi database schema initialized
  - [ ] Content types (articles, users, categories) created
  - [ ] Custom fields added (priority, ai_status, etc.)
  - [ ] Permissions/roles configured (admin, editor, viewer)
  - [ ] Webhooks configured (for AI validation)

- [ ] **Health Checks**
  - [ ] /admin/health returns 200 OK
  - [ ] /api/articles returns empty array (no data yet)
  - [ ] /api/users returns empty array
  - [ ] Database connectivity verified
  - [ ] Cache connectivity verified
  - [ ] Elasticsearch connectivity verified

---

## PHASE 12: PRE-TESTING SIGN-OFF (Week 1 Morning)

### Infrastructure Team Approval

- [ ] **Infrastructure Lead Sign-Off**
  - [ ] Name: ___________________
  - [ ] Date: ___________________
  - [ ] All sections checked and verified
  - [ ] No blockers or exceptions
  - [ ] Ready for application deployment

### Operations Team Approval

- [ ] **Ops Lead Sign-Off**
  - [ ] Name: ___________________
  - [ ] Date: ___________________
  - [ ] Monitoring & alerting configured
  - [ ] Backup procedures tested
  - [ ] Runbooks documented
  - [ ] On-call rotation established

### Security Team Approval

- [ ] **Security Lead Sign-Off**
  - [ ] Name: ___________________
  - [ ] Date: ___________________
  - [ ] WAF rules verified
  - [ ] SSL/TLS certificate valid
  - [ ] Secrets stored securely
  - [ ] Access controls follow least privilege
  - [ ] No critical security issues

### Development Team Approval

- [ ] **Dev Lead Sign-Off**
  - [ ] Name: ___________________
  - [ ] Date: ___________________
  - [ ] Application builds successfully
  - [ ] All dependencies resolved
  - [ ] Health checks passing
  - [ ] Ready for deployment

---

## DEPLOYMENT AUTHORIZATION

**All sections complete and verified:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Infrastructure Lead | | | |
| Operations Lead | | | |
| Security Lead | | | |
| Development Lead | | | |
| Project Manager | | | |

**Authorization to proceed with Week 1 testing: YES / NO**

---

## NOTES & ISSUES

### Critical Issues Found
```
(Document any blockers preventing testing)
```

### Non-Critical Issues
```
(Document items needing follow-up)
```

### Assumptions Made
```
(Document any deviations from specification)
```

### Next Steps After Sign-Off
1. Deploy Strapi application to ECS cluster
2. Run smoke tests (verify endpoints responding)
3. Execute data migration from WordPress
4. Validate AI Console integration (Groq API)
5. Load testing (simulate 1000 concurrent users)
6. User acceptance testing (UAT) by stakeholders

---

**Infrastructure Readiness Checklist - COMPLETE**

**Status:** Ready for team sign-off  
**Estimated Completion Time:** 5-7 days (Week 0)



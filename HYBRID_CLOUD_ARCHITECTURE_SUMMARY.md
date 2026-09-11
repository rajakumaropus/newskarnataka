# Hybrid Cloud Architecture Summary
## Windows Private Cloud (Dev/Staging) + AWS (Production)

**Project:** NewsKarnataka.com Strapi Migration  
**Architecture Type:** Multi-Cloud Hybrid  
**Status:** Updated - Ready for Implementation  
**Date:** September 2026

---

## Executive Overview

The updated INFRASTRUCTURE_SPECIFICATION.md now includes a **complete hybrid cloud strategy** that optimizes cost, development velocity, and production reliability:

- **Development:** Windows Private Cloud (Hyper-V) - Fast feedback, offline capability, cost-effective
- **Staging:** AWS (smaller footprint) - Test AWS behavior, validate migrations
- **Production:** AWS (full scale) - 99.9% uptime, auto-scaling, managed services

---

## Key Changes to Infrastructure Specification

### 1. New Section 0: Windows Private Cloud Architecture

**What's New:**

```
SECTION 0 INCLUDES:
├─ Overview & architecture (Windows Hyper-V setup)
├─ Docker Compose for local development
├─ Infrastructure-as-Code for Windows VMs
├─ Network & security configuration (VPN, firewalls)
├─ Data sync strategy (Dev → AWS Staging → Prod)
├─ Disaster recovery drills (monthly testing)
└─ Backup procedures (PostgreSQL dumps to S3)
```

**Windows Private Cloud Components:**

| Component | Type | Resources | Purpose |
|-----------|------|-----------|---------|
| **Dev Integration Server** | Hyper-V VM | 4 vCPU, 16 GB RAM, 100 GB | Shared dev environment, Docker container orchestration |
| **CI/CD Server** | Hyper-V VM | 4 vCPU, 8 GB RAM, 50 GB | GitHub Actions runner, build automation |
| **Backup & DR Server** | Hyper-V VM | 2 vCPU, 4 GB RAM, 500 GB | Disaster recovery testing, backup validation |
| **Optional Staging Server** | Hyper-V VM | 4 vCPU, 16 GB RAM, - | Pre-AWS testing environment |

**Developer Workstations:**
- Windows 10/11 Pro with Docker Desktop + WSL2
- Local docker-compose (Strapi, PostgreSQL, Redis, Elasticsearch)
- VS Code, Git, node package manager
- Network: Connected to Windows Private Cloud via VPN

### 2. Updated Section 1: AWS Network Architecture

**Changes:**
- Separated **AWS Staging** (10.1.0.0/16) from **AWS Production** (10.0.0.0/16)
- Staging uses **smaller instances** (cost-optimized for testing)
- Production uses **multi-AZ with read replicas** (high availability)
- Environment parity maintained through Docker containers

**Staging vs Production Comparison:**

| Aspect | Staging | Production |
|--------|---------|-----------|
| **VPC CIDR** | 10.1.0.0/16 | 10.0.0.0/16 |
| **RDS Instance** | db.t3.small | db.t4g.xlarge Multi-AZ |
| **RDS Replicas** | 1 replica | 2 replicas (read scaling) |
| **ElastiCache** | t3.micro | r6g.xlarge cluster |
| **Elasticsearch** | t3.small (2 nodes) | m5.xlarge (5 nodes) |
| **ECS Task Size** | 0.5 vCPU, 1 GB | 1-2 vCPU, 2-4 GB |
| **Auto Scaling** | Disabled (min=max) | Enabled (min 3, max 10) |
| **CloudFront** | No CDN | Yes, with WAF |
| **Monthly Cost** | ~₹10K | ~₹64K |

### 3. New Section 11: CI/CD Pipeline (Hybrid)

**Workflow Flow:**

```
Developer Push to 'develop' branch
    ↓
[Windows Private Cloud CI/CD Server]
├─ Checkout code
├─ Run tests (npm run test:run)
├─ Run linter (npm run lint)
├─ Build application (npm run build)
    ↓
[If tests pass]
├─ Build Docker image
├─ Push to AWS ECR
    ↓
[Deploy to AWS Staging]
├─ Update ECS service
├─ Health checks
├─ Smoke tests
    ↓
[If manual approval]
├─ Create pre-deployment backup
├─ Blue-green deployment
├─ DNS cutover
    ↓
[Deploy to AWS Production]
├─ Monitor dashboards
├─ Team on-call alerts
└─ Status page updated
```

**Key Features:**
- Self-hosted GitHub Actions runner on Windows CI/CD VM
- Docker image builds run on CI server (faster, local)
- ECR (AWS Elastic Container Registry) for image storage
- Manual approval gate before production deployment
- Automatic rollback if smoke tests fail

### 4. New Section 12: Environment Parity Validation

**Ensures consistency across all environments:**

```yaml
✓ Database: PostgreSQL 14.x (all), UTF-8 encoding (all)
✓ Cache: Redis 7.x (all), allkeys-lru policy (all)
✓ Search: Elasticsearch 8.x (all), identical mappings (all)
✓ Containers: node:18-alpine (all), Strapi 5.x (all)
✓ Monitoring: CloudWatch (AWS), local metrics (Dev)
✓ TLS: 1.2+ (all), modern ciphers (all)
✓ Backup: Automated (all), different retention periods
```

### 5. Updated Section 13: Cost Summary & Timeline

**New Cost Breakdown (Hybrid Model):**

| Environment | Monthly | Annual |
|-------------|---------|--------|
| **Development** | ₹10K | ₹120K |
| **Staging** | ₹10K | ₹120K |
| **Production** | ₹64K | ₹768K |
| **TOTAL** | **₹84K/month** | **~₹10L/year** |

**Cost Savings vs Pure AWS:**
- Pure AWS (all 3 envs): ₹95K/month = ₹11.4L/year
- Hybrid (Windows + AWS): ₹84K/month = ₹10L/year
- **Savings: ~₹1.4L/year** (12% reduction)

**Timeline Remains 10 Weeks:**
- Weeks 1-2: Windows Private Cloud + Dev setup
- Weeks 3-5: AWS Staging deployment & testing
- Weeks 6-8: AWS Production infrastructure
- Weeks 9-10: Cutover & go-live

---

## Architecture Decisions Explained

### Why Windows Private Cloud for Development?

**Pros:**
1. **Cost Efficiency** - On-premises infrastructure already available (likely)
2. **Fast Feedback** - No AWS API latency, instant feedback during coding
3. **Offline Capability** - Developers work without internet dependency
4. **Learning Curve** - Team learns Docker + Strapi before AWS complexity
5. **Data Privacy** - Sensitive test data stays on-premises during dev

**Cons Mitigated:**
1. **Environment Drift** → Docker containers ensure consistency (same image in all envs)
2. **DevOps Complexity** → IaC (Terraform) + Docker Compose standardizes setup
3. **Team Skills** → Both Windows Server + AWS expertise required (mitigated by clear docs)

### Why AWS for Staging & Production?

**Staging Benefits:**
- **Exact AWS Configuration** - Tests multi-AZ behavior, load balancing, auto-scaling
- **Migration Validation** - Dry run of production deployment
- **Performance Testing** - Verify AWS-specific optimizations (CDN, WAF, CloudFront)

**Production Benefits:**
- **99.9% SLA** - Multi-AZ automatic failover, no manual intervention
- **Auto-Scaling** - Handle 10x traffic spikes (Black Friday, breaking news)
- **Managed Services** - AWS handles patching, backups, encryption
- **Global CDN** - CloudFront for worldwide article delivery
- **Security** - WAF, VPC isolation, encryption at rest/transit

---

## Data Flow: Windows → AWS

### Development Phase (Week 1-2)
```
WordPress Data (55K articles)
    ↓ [Extract via plugin]
├─ Article metadata (title, author, date)
├─ Article content (body, featured image)
├─ Category/tag mappings
├─ User accounts & roles
└─ Comment threads
    ↓ [Store in Windows PostgreSQL]
└─ newkarnataka_dev database
```

### Migration Phase (Week 3-5)
```
Windows PostgreSQL
    ↓ [pg_dump]
└─ dev_dump_2026-09-01.dump (500 MB)
    ↓ [Upload to S3]
└─ s3://newkarnataka-backups/dev-dumps/
    ↓ [RDS Restore in Staging]
└─ newkarnataka_staging database
    ↓ [Validation]
├─ Row count verification
├─ Checksum validation
├─ Referential integrity
└─ Data quality checks
```

### Production Cutover (Week 9)
```
Final Sync (Staging → Production)
    ↓ [Dual-write during transition]
├─ WordPress still active (read-only)
├─ Strapi backend accepting writes
└─ Parallel running (1 week)
    ↓ [Blue-green deployment]
├─ Blue (old): WordPress
├─ Green (new): Strapi + React
└─ Switch ALB target groups instantly
    ↓ [DNS TTL cutover]
├─ newkarnataka.com → AWS ALB
├─ Zero downtime
└─ Rollback available if needed
```

---

## Key Metrics & SLAs

### Development Environment
- **Availability:** 95% (development hours only)
- **RTO (Recovery Time Objective):** 4 hours (manual recovery)
- **RPO (Recovery Point Objective):** 1 day (daily backup)
- **Backup Retention:** 7 days
- **Database Replication:** None (single instance)

### Staging Environment
- **Availability:** 99% (testing hours)
- **RTO:** 2 hours (manual intervention needed)
- **RPO:** 1 hour (RDS snapshots)
- **Backup Retention:** 30 days
- **Database Replication:** 1 read replica (same AZ)

### Production Environment
- **Availability:** 99.9% (24/7/365)
- **RTO:** < 15 minutes (automatic failover)
- **RPO:** < 1 minute (continuous backup)
- **Backup Retention:** 90+ days (compliance)
- **Database Replication:** 2 read replicas (cross-AZ)

---

## Implementation Checklist

### Pre-Implementation
- [ ] AWS account created & quotas increased
- [ ] Windows Server hardware provisioned (or cloud-based)
- [ ] GitHub Actions setup completed
- [ ] Team trained on Docker, Strapi, AWS basics
- [ ] Security groups & IAM roles defined
- [ ] Budget approved (₹50-51L + ₹10L/year operations)

### Week 1-2: Dev Setup
- [ ] Hyper-V VMs created (Dev, CI, Backup)
- [ ] Docker Compose deployed
- [ ] CI/CD pipeline functional
- [ ] Developers onboarded & working

### Week 3-5: Staging
- [ ] AWS Staging VPC created
- [ ] RDS, ElastiCache, Elasticsearch deployed
- [ ] Data migration tested
- [ ] Backup & restore validated

### Week 6-8: Production
- [ ] AWS Production VPC created
- [ ] Multi-AZ RDS, ElastiCache, Elasticsearch
- [ ] CloudFront + WAF configured
- [ ] Blue-green deployment ready
- [ ] Disaster recovery tested

### Week 9-10: Cutover
- [ ] Final data sync completed
- [ ] Blue-green deployment executed
- [ ] DNS cutover (TTL reduced to 300s)
- [ ] Monitoring dashboards active
- [ ] Team on-call scheduled

---

## Risk Mitigation (Updated for Hybrid Model)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Windows Private Cloud hardware failure** | Medium | High | Daily backups to S3, Backup VM for failover, SLA with hardware vendor |
| **Data sync errors (Windows→AWS)** | Low | High | Comprehensive validation scripts, dry-run migrations, checksum verification |
| **AWS region outage** | Very Low | Critical | Multi-region RDS backup, cross-region replication, disaster recovery plan |
| **Docker image incompatibility** | Low | Medium | IaC ensures consistency, automated tests in staging |
| **Performance issues in production** | Medium | High | Load testing in staging, performance budgets (LCP <2.5s), CDN optimization |
| **Security breach** | Low | Critical | WAF, VPC isolation, encryption at rest/transit, regular security audits |
| **Team skill gap** | High | Medium | Training sessions, documentation, pair programming, vendor support |

---

## Success Criteria

### Technical Metrics
- ✓ Page load time: < 2.5s (LCP - Largest Contentful Paint)
- ✓ Availability: 99.9% uptime
- ✓ Database query: < 100ms (p99)
- ✓ API response: < 500ms (p99)
- ✓ Zero data loss during migration
- ✓ 55K articles migrated successfully

### Business Metrics
- ✓ Zero downtime during cutover
- ✓ 10-week timeline met
- ✓ Budget ≤ ₹50-51L (implementation) + ₹10L/year (ops)
- ✓ Team trained & ready for handoff
- ✓ System ready for 10x traffic spikes

### Operational Metrics
- ✓ Backup & restore procedure tested (monthly)
- ✓ Disaster recovery procedure documented & practiced
- ✓ Monitoring & alerting configured for all layers
- ✓ On-call rotation established
- ✓ Runbooks created for common operations

---

## Next Steps

1. **Get Stakeholder Approval** - Present hybrid architecture to IT/Finance teams
2. **AWS Account Provisioning** - Request account & quota increases (RDS Multi-AZ, ElastiCache, ES)
3. **Windows Server Procurement** - Order hardware (or use cloud-based private cloud service)
4. **Team Onboarding** - Training sessions on Strapi, Docker, AWS, deployment procedures
5. **Kickoff Meeting** - Confirm timeline, roles, budget, and go-live date

---

## References

**Updated Document:** `INFRASTRUCTURE_SPECIFICATION.md`
- Section 0: Windows Private Cloud (Dev)
- Section 1-10: AWS Staging & Production
- Section 11: CI/CD Pipeline
- Section 12: Cost Summary & Timeline

**Related Documents:**
- TECHNOLOGY_STACK_SPECIFICATION.md (Strapi 5.x, React 18, PostgreSQL 14)
- IMPLEMENTATION_ROADMAP_DETAILED.md (Week-by-week tasks)
- RISK_REGISTER_MITIGATION_PLAN.md (45 identified risks)
- DETAILED_MIGRATION_PLAN.md (WordPress → Strapi data flow)

---

**Status:** Infrastructure Specification Updated ✓  
**Approval:** Ready for IT Director + DevOps Lead sign-off  
**Cost:** ₹84K/month (~₹10L/year operations)  
**Timeline:** 10 weeks to go-live  
**Feasibility:** 95/100

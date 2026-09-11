# Hybrid Cloud Infrastructure Specification
## NewKarnataka Migration: Windows Private Cloud (Dev/Staging) + AWS (Production)

**Project:** NewsKarnataka.com Strapi Migration  
**Status:** Pre-Implementation Planning with Hybrid Architecture  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

**Hybrid Multi-Cloud Infrastructure Strategy:**
- **Development & Staging:** Windows Private Cloud (Hyper-V) - Cost optimization, faster feedback loops
- **Production:** AWS Multi-AZ - 99.9% SLA, auto-scaling, disaster recovery
- **Environment Parity:** Docker containers (Linux base) + IaC (Terraform) ensure consistency across environments
- **Zero-downtime deployment:** Blue-green strategy on AWS production
- **Comprehensive monitoring & alerting** across all environments

### **Key Architecture Decisions**

| Layer | Development | Staging | Production |
|-------|-------------|---------|------------|
| **Infrastructure** | Windows Private Cloud (Hyper-V) | AWS | AWS |
| **Network** | VPN/Private LAN | AWS VPC | AWS VPC (Multi-AZ) |
| **Database** | PostgreSQL 14 (single) | RDS db.t3.small | RDS db.t4g.xlarge Multi-AZ + replicas |
| **Cache** | Redis (single) | ElastiCache t3.micro | ElastiCache r6g.xlarge cluster |
| **Search** | Elasticsearch (single node) | ES t3.small | ES 5 nodes (multi-AZ) |
| **Containers** | Docker Desktop / Hyper-V | ECS Fargate 0.5vCPU | ECS Fargate 1-2 vCPU (auto-scale) |
| **CDN** | None (local testing) | None (test locally) | CloudFront + WAF |
| **Cost/Month** | ~₹10K (licensing) | ~₹12K | ~₹45-55K |
| **Purpose** | Fast dev, offline work | Test migration, AWS behavior | Production workload, users |

---

## SECTION 0: WINDOWS PRIVATE CLOUD (Development & Local Staging)

### 0.1 Overview & Architecture

**Purpose:** Fast development feedback loops, zero-latency local work, cost optimization before AWS production

**Environment Structure:**

```
DEVELOPER WORKSTATIONS
├─ OS: Windows 10/11 Pro (WSL2 + Docker Desktop)
├─ Docker Desktop:
│  ├─ Backend Container: Strapi 5.x + Node.js 18
│  ├─ Database Container: PostgreSQL 14
│  ├─ Cache Container: Redis 7.x
│  └─ Search Container: Elasticsearch 8.x (single node)
├─ Frontend: React dev server (port 3000)
├─ IDE: VS Code, WebStorm
└─ Network: Local only, no internet access required

WINDOWS PRIVATE CLOUD (Shared Dev Server)
├─ Host OS: Windows Server 2022 Datacenter
├─ Hypervisor: Hyper-V (native)
├─ Network: VPN connection to developer workstations
├─ Storage: SAN or local NAS (~500 GB allocated)
├─ Memory: 128 GB (shared by VMs)
└─ CPU: 16+ cores (shared by VMs)

VMs on Windows Private Cloud:
├─ Dev Integration Server (1 VM)
│  ├─ OS: Ubuntu 22.04 LTS
│  ├─ vCPU: 4 cores
│  ├─ RAM: 16 GB
│  ├─ Storage: 100 GB SSD
│  ├─ Docker: Strapi + PostgreSQL + Redis
│  └─ Purpose: Shared development, integration testing
│
├─ CI/CD Server (1 VM)
│  ├─ OS: Ubuntu 22.04 LTS
│  ├─ vCPU: 4 cores
│  ├─ RAM: 8 GB
│  ├─ Tools: Jenkins or GitHub Actions (self-hosted runner)
│  ├─ Storage: 50 GB
│  └─ Purpose: Run tests, build Docker images
│
├─ Backup & DR Server (1 VM)
│  ├─ OS: Ubuntu 22.04 LTS
│  ├─ vCPU: 2 cores
│  ├─ RAM: 4 GB
│  ├─ Storage: 500 GB
│  ├─ Software: Backup agent, PostgreSQL dump utility
│  └─ Purpose: Test disaster recovery, backup validation
│
└─ Optional: Staging Server (1 VM - for pre-AWS testing)
   ├─ OS: Ubuntu 22.04 LTS
   ├─ vCPU: 4 cores
   ├─ RAM: 16 GB
   ├─ Docker: Replica of staging config
   └─ Purpose: Test migrations before AWS deploy
```

### 0.2 Docker Compose Setup for Development

**docker-compose.dev.yml** (Local + Dev Server):

```yaml
version: '3.9'

services:
  # Strapi Backend
  strapi:
    image: node:18-alpine
    container_name: strapi-dev
    working_dir: /app
    volumes:
      - ./strapi:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=newkarnataka_dev
      - DATABASE_USERNAME=strapi_app
      - DATABASE_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - ELASTICSEARCH_HOST=elasticsearch
      - ELASTICSEARCH_PORT=9200
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
    ports:
      - "3001:1337"
    depends_on:
      - postgres
      - redis
      - elasticsearch
    networks:
      - newkarnataka-dev
    command: npm run develop

  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    container_name: postgres-dev
    environment:
      - POSTGRES_DB=newkarnataka_dev
      - POSTGRES_USER=strapi_app
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - newkarnataka-dev
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U strapi_app"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis-dev
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - newkarnataka-dev
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # Elasticsearch (Single-node for dev)
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: elasticsearch-dev
    environment:
      - discovery.type=single-node
      - ELASTIC_PASSWORD=${ELASTICSEARCH_PASSWORD}
      - xpack.security.enabled=true
      - xpack.security.enrollment.enabled=true
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - newkarnataka-dev
    healthcheck:
      test: ["CMD-SHELL", "curl -s http://localhost:9200 | grep -q cluster_name || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 5

  # React Frontend (Dev Server)
  frontend:
    image: node:18-alpine
    container_name: react-dev
    working_dir: /app
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:3001
      - NODE_ENV=development
    ports:
      - "3000:3000"
    depends_on:
      - strapi
    networks:
      - newkarnataka-dev
    command: npm start

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:

networks:
  newkarnataka-dev:
    driver: bridge
```

### 0.3 Infrastructure-as-Code (Terraform) for Windows Setup

**terraform/windows-dev/main.tf** (Optional - for future cloud-based private cloud):

```hcl
# Windows Server VM in vSphere or on-premises Hyper-V
# This is manual setup OR use Terraform Enterprise for vSphere

# Local Configuration (Docker Compose + Hyper-V)
locals {
  vm_specs = {
    dev_server = {
      cpu      = 4
      memory   = 16384  # 16 GB
      storage  = 100    # GB
      os       = "Ubuntu 22.04 LTS"
    }
    ci_server = {
      cpu      = 4
      memory   = 8192
      storage  = 50
      os       = "Ubuntu 22.04 LTS"
    }
    backup_server = {
      cpu      = 2
      memory   = 4096
      storage  = 500
      os       = "Ubuntu 22.04 LTS"
    }
  }

  networking = {
    vlan_id           = "100"
    subnet_mask       = "255.255.255.0"
    gateway           = "192.168.1.1"
    dns_servers       = ["8.8.8.8", "8.8.4.4"]
    vpn_endpoint      = "vpn.company.local"
  }
}

# Manual Steps (for documentation):
# 1. Create Hyper-V VMs using Hyper-V Manager or PowerShell
# 2. Allocate resources per locals.vm_specs
# 3. Install Ubuntu 22.04 LTS on each VM
# 4. Configure VPN to reach Azure/AWS (if hybrid)
# 5. Install Docker, Jenkins, PostgreSQL backup tools
# 6. Deploy docker-compose services
```

### 0.4 Network & Security (Windows Private Cloud)

**Network Configuration:**

```
Developer Workstations (WSL2 + Docker Desktop):
├─ IP Range: 192.168.1.0/24 (local LAN)
├─ Docker Network: 172.20.0.0/16 (internal)
├─ Access: Local only (no public internet exposure)
└─ VPN: Yes (connect to Windows Private Cloud if remote)

Windows Private Cloud Network:
├─ Hyper-V Virtual Switch: External (bridged to company LAN)
├─ VM Network: 10.1.0.0/16 (private range)
│  ├─ Dev Server:    10.1.1.10
│  ├─ CI Server:     10.1.1.20
│  ├─ Backup Server: 10.1.1.30
│  └─ Staging (opt): 10.1.1.40
├─ Gateway: 10.1.0.1 (Hyper-V gateway)
├─ DNS: Company DNS + 8.8.8.8 (fallback)
└─ Firewall: Windows Defender firewall (open ports as needed)

Security Groups (Hyper-V equivalent):
├─ Dev Server:
│  ├─ Inbound: SSH (22), HTTP (3001), PostgreSQL (5432), Redis (6379)
│  └─ Source: Dev workstations only
├─ CI Server:
│  ├─ Inbound: SSH (22), HTTP (8080 - Jenkins)
│  └─ Source: Dev team + GitHub Actions
└─ Backup Server:
   ├─ Inbound: SSH (22), Backup protocol (9102)
   └─ Source: Dev servers only
```

**Firewall Rules:**

```powershell
# Windows Firewall Commands (on Hyper-V host)

# Allow SSH from dev workstations
New-NetFirewallRule -DisplayName "SSH Dev" `
  -Direction Inbound -Protocol TCP -LocalPort 22 `
  -RemoteAddress 192.168.1.0/24 -Action Allow

# Allow HTTP for Strapi
New-NetFirewallRule -DisplayName "Strapi HTTP" `
  -Direction Inbound -Protocol TCP -LocalPort 3001 `
  -RemoteAddress 192.168.1.0/24 -Action Allow

# Allow PostgreSQL (internal only)
New-NetFirewallRule -DisplayName "PostgreSQL Internal" `
  -Direction Inbound -Protocol TCP -LocalPort 5432 `
  -RemoteAddress 10.1.0.0/16 -Action Allow
```

### 0.5 Data Synchronization: Dev ↔ AWS Staging ↔ AWS Production

**Migration Path:**

```
Week 1-2 (Development Phase):
├─ Load test data into Windows PostgreSQL
├─ Validate data transformation logic
├─ Test Strapi migrations & plugins
└─ Backup: postgres_dev_2026-09-01.dump

Week 3 (Staging Preparation):
├─ Migrate data: Windows PostgreSQL → AWS RDS Staging
│  └─ Command: pg_dump → AWS Backup Vault → RDS Restore
├─ Validate data integrity (row counts, checksums)
├─ Test deployment pipeline
└─ Backup: rds-staging-2026-09-05.snapshot

Week 4-5 (Production Preparation):
├─ Final data sync: Staging PostgreSQL → Production RDS
├─ Zero-downtime cutover: Blue-green deployment
├─ Backup before cutover: prod-pre-cutover-2026-09-15.snapshot
└─ Live traffic switches to new Strapi infrastructure

Data Backup Strategy:
├─ Development: Daily dump to S3 (dev-backups/ folder)
├─ Staging: Daily RDS snapshot to S3 (staging-snapshots/ folder)
├─ Production: Continuous RDS backup + Cross-region replication
└─ Retention: Dev (7 days), Staging (30 days), Prod (90+ days)
```

**PostgreSQL Dump & Restore Commands:**

```bash
# FROM Windows PostgreSQL
pg_dump -h localhost -U strapi_app -d newkarnataka_dev \
  --no-password --format=custom --file=/backups/dev_dump_2026-09-01.dump

# Upload to S3
aws s3 cp /backups/dev_dump_2026-09-01.dump s3://newkarnataka-backups/dev-dumps/

# RESTORE to AWS RDS Staging
pg_restore -h newkarnataka-staging-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U strapi_app -d newkarnataka_staging \
  /backups/dev_dump_2026-09-01.dump

# Validate row counts
SELECT 'articles' as table_name, COUNT(*) FROM articles
UNION ALL
SELECT 'users', COUNT(*) FROM users
-- Compare before/after migration
```

### 0.6 Disaster Recovery & Testing (Windows Private Cloud)

**Monthly DR Drill:**

```
Objective: Test Windows → AWS failover process
Schedule:  Every month (e.g., first Friday 10 AM)
Duration:  2 hours

Steps:
1. Snapshot Windows PostgreSQL (dev-db-backup-2026-09-01.dump)
2. Restore to Backup Server (10.1.1.30)
3. Simulate network outage (disable dev-server connectivity)
4. Failover containers from Dev Server → Backup Server
5. Verify application still runs on Backup Server
6. Test data consistency
7. Restore original configuration
8. Document outcomes, update runbook

Tools:
├─ Docker commands (stop/start)
├─ PostgreSQL recovery (pg_recover)
├─ Redis snapshot restore (BGSAVE/BGREWRITEAOF)
└─ Elasticsearch cluster heal
```

---

## SECTION 1: AWS NETWORK ARCHITECTURE (Staging & Production)

### 1.1 VPC Design (AWS Staging & Production)

**Note:** Development uses Windows Private Cloud (see Section 0). This section covers AWS deployment.

**AWS Staging VPC:**

```
VPC: newkarnataka-staging (10.1.0.0/16)

Internet Zone (Public Subnets)
├── us-east-1a: 10.1.1.0/24
└── us-east-1b: 10.1.2.0/24
    └── Components: NAT Gateway, Internet Gateway

Application Zone (Private Subnets)
├── us-east-1a: 10.1.11.0/24 (ECS Tasks - 0.5 vCPU)
└── us-east-1b: 10.1.12.0/24 (ECS Tasks - 0.5 vCPU)

Database Zone (Private Subnets)
├── us-east-1a: 10.1.21.0/24 (RDS db.t3.small)
└── us-east-1b: 10.1.22.0/24 (RDS replica)

Cache Zone (Private Subnets)
├── us-east-1a: 10.1.31.0/24 (ElastiCache t3.micro)
└── us-east-1b: 10.1.32.0/24 (ElastiCache replica)

Search Zone (Private Subnets)
├── us-east-1a: 10.1.41.0/24 (ES t3.small)
└── us-east-1b: 10.1.42.0/24 (ES replica)
```

**AWS Production VPC:**

Internet Zone (Public Subnets)
├── us-east-1a: 10.0.1.0/24
├── us-east-1b: 10.0.2.0/24
└── us-east-1c: 10.0.3.0/24
    └── Components: NAT Gateway, Internet Gateway

Application Zone (Private Subnets)
├── us-east-1a: 10.0.11.0/24 (ECS Tasks)
├── us-east-1b: 10.0.12.0/24 (ECS Tasks)
└── us-east-1c: 10.0.13.0/24 (ECS Tasks)

Database Zone (Private Subnets)
├── us-east-1a: 10.0.21.0/24 (RDS Primary)
├── us-east-1b: 10.0.22.0/24 (RDS Replica)
└── us-east-1c: 10.0.23.0/24 (RDS Standby)

Cache Zone (Private Subnets)
├── us-east-1a: 10.0.31.0/24 (Redis Primary)
└── us-east-1b: 10.0.32.0/24 (Redis Replica)

Search Zone (Private Subnets)
├── us-east-1a: 10.0.41.0/24 (ES Nodes)
├── us-east-1b: 10.0.42.0/24 (ES Nodes)
└── us-east-1c: 10.0.43.0/24 (ES Nodes)
```

### 1.2 Route Tables

**Public Route Table (Internet Gateway):**
```
Destination         Target
10.0.0.0/16        Local
0.0.0.0/0          Internet Gateway (igw-xxxxx)

Subnets: 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24
```

**Private Route Table (NAT Gateway):**
```
Destination         Target
10.0.0.0/16        Local
0.0.0.0/0          NAT Gateway (nat-xxxxx in us-east-1a)

Subnets: All private subnets (app, db, cache, search layers)
Failover: Deploy NAT Gateway in each AZ for redundancy
```

### 1.3 Internet Gateway & NAT Gateway

**Internet Gateway:**
```
Name:               newkarnataka-igw
VPC:                newkarnataka-prod
Attach to:          VPC (automatic route to public subnets)
Purpose:            Allow traffic from internet to public subnets
```

**NAT Gateways (HA setup):**
```
NAT Gateway 1:
├── Name: newkarnataka-nat-1a
├── Subnet: 10.0.1.0/24 (us-east-1a - public)
├── Elastic IP: Allocated
└── Route: Used by app/db/cache subnets in 1a

NAT Gateway 2:
├── Name: newkarnataka-nat-1b
├── Subnet: 10.0.2.0/24 (us-east-1b - public)
├── Elastic IP: Allocated
└── Route: Used by app/db/cache subnets in 1b

NAT Gateway 3:
├── Name: newkarnataka-nat-1c
├── Subnet: 10.0.3.0/24 (us-east-1c - public)
├── Elastic IP: Allocated
└── Route: Used by app/db/cache subnets in 1c

Benefits:
├─ No single point of failure
├─ One NAT per AZ (cost optimized)
└─ Automatic failover if NAT degrades
```

---

## SECTION 2: SECURITY GROUPS

### 2.1 Application Load Balancer (ALB)

```
Name:                   newkarnataka-alb-sg
VPC:                    newkarnataka-prod
Purpose:                Accept internet traffic, forward to ECS

Inbound Rules:
├─ HTTP (80)
│  ├─ Source: 0.0.0.0/0
│  ├─ Description: "Allow HTTP from internet"
│  └─ Auto-redirect: To HTTPS (ALB rule)
│
├─ HTTPS (443)
│  ├─ Source: 0.0.0.0/0
│  ├─ Protocol: TCP
│  ├─ Description: "Allow HTTPS from internet"
│  └─ Certificate: ACM certificate (newkarnataka.com)
│
├─ Health Check (3000)
│  ├─ Source: Self (sg-xxxxx)
│  ├─ Description: "ALB health check"
│  └─ Internal only
│
└─ SSH (22) - OPTIONAL
   ├─ Source: Admin IP only (e.g., 203.x.x.x/32)
   ├─ Description: "Admin access for troubleshooting"
   └─ Disable in production if not needed

Outbound Rules:
├─ All traffic (0.0.0.0/0)
└─ Purpose: Forward to ECS tasks
```

### 2.2 ECS Task Security Group

```
Name:                   newkarnataka-ecs-sg
VPC:                    newkarnataka-prod
Purpose:                Run Strapi application containers

Inbound Rules:
├─ Port 3000 (App Port)
│  ├─ Source: ALB security group (newkarnataka-alb-sg)
│  ├─ Protocol: TCP
│  └─ Description: "Accept traffic from ALB"
│
├─ Port 22 (SSH)
│  ├─ Source: Admin security group (admin-sg)
│  ├─ Description: "Container exec for debugging"
│  └─ Scope: Development/staging only
│
└─ Port 3001 (Prometheus metrics)
   ├─ Source: Monitoring security group
   ├─ Description: "Metrics collection"
   └─ Optional: For advanced monitoring

Outbound Rules:
├─ PostgreSQL (5432)
│  ├─ Destination: RDS security group
│  └─ Description: "Database connection"
│
├─ Redis (6379)
│  ├─ Destination: Redis security group
│  └─ Description: "Cache connection"
│
├─ Elasticsearch (9200)
│  ├─ Destination: OpenSearch security group
│  └─ Description: "Search connection"
│
├─ DNS (53)
│  ├─ Destination: 0.0.0.0/0 (UDP & TCP)
│  └─ Description: "DNS queries for resolution"
│
├─ HTTPS (443)
│  ├─ Destination: 0.0.0.0/0 (TCP)
│  └─ Description: "Groq API calls, external APIs"
│
└─ HTTP (80) - Redirect ONLY
   ├─ Destination: ALB (for HTTP redirect)
   └─ Description: "HTTP redirect to HTTPS"
```

### 2.3 RDS Database Security Group

```
Name:                   newkarnataka-rds-sg
VPC:                    newkarnataka-prod
Purpose:                Accept database connections from app layer

Inbound Rules:
├─ PostgreSQL (5432)
│  ├─ Source: ECS security group (newkarnataka-ecs-sg)
│  ├─ Protocol: TCP
│  ├─ Description: "Strapi app connection"
│  │
│  └─ Source: Lambda security group (optional)
│     └─ Description: "Lambda functions access"
│
└─ NONE for internet (no public access)

Outbound Rules:
└─ None required (destination only)

Backup Security:
├─ RDS automated snapshots (internal AWS)
├─ No security group needed for snapshots
└─ Cross-region replication (AWS managed)
```

### 2.4 ElastiCache Redis Security Group

```
Name:                   newkarnataka-redis-sg
VPC:                    newkarnataka-prod
Purpose:                Accept cache connections from app layer

Inbound Rules:
├─ Redis (6379)
│  ├─ Source: ECS security group (newkarnataka-ecs-sg)
│  ├─ Protocol: TCP
│  └─ Description: "Strapi app cache connection"
│
└─ Redis (6379)
   ├─ Source: Lambda security group (optional)
   └─ Description: "Lambda functions access"

Outbound Rules:
└─ None required (destination only)

High Availability:
├─ Automatic Failover: Enabled
├─ Multi-AZ: Enabled
└─ Replication: Synchronous (Redis cluster mode)
```

### 2.5 Elasticsearch Security Group

```
Name:                   newkarnataka-es-sg
VPC:                    newkarnataka-prod
Purpose:                Accept search connections from app layer

Inbound Rules:
├─ Elasticsearch (9200)
│  ├─ Source: ECS security group (newkarnataka-ecs-sg)
│  ├─ Protocol: TCP
│  └─ Description: "Strapi app search queries"
│
├─ Elasticsearch (9300)
│  ├─ Source: ES security group (self)
│  ├─ Description: "Node-to-node communication"
│  └─ Required for cluster health
│
└─ HTTPS (443)
   ├─ Source: Monitoring security group (optional)
   └─ Description: "Kibana/monitoring access"

Outbound Rules:
└─ None required (destination only)

Data Protection:
├─ Encryption at Rest: Enabled
├─ Encryption in Transit: TLS 1.2+
└─ Access Policy: IAM-based (Signature V4)
```

---

## SECTION 3: APPLICATION LOAD BALANCER (ALB)

### 3.1 ALB Configuration

```
Name:                   newkarnataka-alb
Type:                   Application Load Balancer
VPC:                    newkarnataka-prod
Subnets:                10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24 (public)
Security Groups:        newkarnataka-alb-sg
Scheme:                 Internet-facing
IP Type:                IPv4

Listener Configuration:
├─ HTTP (80)
│  ├─ Default Action: Redirect to HTTPS (301)
│  ├─ Redirect to: https://{host}:{port}{path}?{query}
│  └─ Status Code: 301 (Permanent redirect)
│
└─ HTTPS (443)
   ├─ Certificate: ACM certificate (newkarnataka.com)
   ├─ Security Policy: ELBSecurityPolicy-TLS-1-2-2017-01
   ├─ Default Action: Forward to target group
   └─ Target Group: newkarnataka-ecs-tg
```

### 3.2 Target Group Configuration

```
Name:                   newkarnataka-ecs-tg
Protocol:               HTTP
Port:                   3000
VPC:                    newkarnataka-prod
Target Type:            IP (for Fargate)

Health Check:
├─ Protocol:            HTTP
├─ Path:                /admin/health
├─ Port:                3000
├─ Interval:            30 seconds
├─ Timeout:             5 seconds
├─ Healthy threshold:   2 consecutive successes
├─ Unhealthy threshold: 3 consecutive failures
└─ Matcher:             200-299 (success codes)

Stickiness:
├─ Enabled:             No (stateless app)
└─ Type:                Load balancer cookie

Deregistration Delay:
├─ Duration:            30 seconds
└─ Purpose:             Graceful connection drain

Attributes:
├─ Preserve client IP:  Enabled
├─ HTTP/2 support:      Enabled
└─ HTTP Keep-Alive:     Enabled
```

### 3.3 SSL/TLS Certificate

```
Certificate:            AWS Certificate Manager (ACM)
Domain:                 newkarnataka.com
Alt Domains:            www.newkarnataka.com, api.newkarnataka.com
Validation:             DNS (CNAME record)
Auto-renewal:           Enabled
Expiration:             365 days (auto-renew 30 days before)
Protocol Version:       TLS 1.2, TLS 1.3
Cipher Suites:          ECDHE-based (modern, secure)
```

---

## SECTION 4: RDS POSTGRESQL CONFIGURATION

### 4.1 Database Cluster

```
DB Instance Identifier: newkarnataka-prod-db
Engine:                 PostgreSQL 14.8 or newer
Instance Class:         db.t4g.xlarge
Multi-AZ:               Enabled (automatic failover)
Storage Type:           gp3 (General Purpose SSD)
Allocated Storage:      500 GB
Max Allocated Storage:  1000 GB (auto-scaling)
IOPS:                   3000 (baseline for gp3)
Throughput:             125 MB/s

Network Configuration:
├─ VPC:                 newkarnataka-prod
├─ Subnet Group:        newkarnataka-db-subnet-group
│  └─ Subnets: 10.0.21.0/24, 10.0.22.0/24, 10.0.23.0/24
├─ Security Group:      newkarnataka-rds-sg
├─ Public Accessible:   No (private subnets only)
└─ DNS Name:            newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com

Backup Configuration:
├─ Backup Retention:    30 days
├─ Backup Window:       03:00-04:00 UTC (daily)
├─ Copy to Backup Vault: Enabled (100-year retention for compliance)
├─ Multi-Region Backup: Enabled
└─ Point-in-Time Recovery: 35 days

Maintenance Window:
├─ Day:                 Sunday
├─ Time:                04:00-05:00 UTC
├─ Apply Immediately:   No (apply during maintenance window)
└─ Enable Minor Updates: Yes

Performance Insights:
├─ Enabled:             Yes
├─ Retention Period:    7 days
└─ Purpose:             Diagnose performance issues

Enhanced Monitoring:
├─ Enabled:             Yes
├─ Monitoring Interval: 1 minute
└─ Role:                AmazonRDSEnhancedMonitoringRole
```

### 4.2 Read Replicas

```
Read Replica 1:
├─ Name:                newkarnataka-prod-db-replica-1
├─ Availability Zone:   us-east-1b
├─ Instance Class:      db.t4g.large
├─ Purpose:             Scale read queries (reporting, analytics)
└─ Promotion Eligible:  Yes (can become primary)

Read Replica 2:
├─ Name:                newkarnataka-prod-db-replica-2
├─ Availability Zone:   us-east-1c
├─ Instance Class:      db.t4g.large
├─ Purpose:             Backup read capacity
└─ Promotion Eligible:  Yes

Replication Lag:
├─ Target:              < 100ms
├─ Monitoring:          CloudWatch metric (ReplicationLatency)
└─ Alert:               If lag > 5 seconds
```

### 4.3 Parameter Group Tuning

```
Parameter Group:        newkarnataka-strapi-pg14
Description:            Optimized for Strapi workload

Connection Management:
├─ max_connections:     300 (default: 100)
├─ idle_in_transaction_session_timeout: 300000 (5 min timeout)
└─ tcp_keepalives_idle: 60 (detect dead connections)

Memory Optimization:
├─ shared_buffers:      2097152 (2 GB = 25% of 8GB memory)
├─ effective_cache_size: 6291456 (6 GB = 75% of 8GB memory)
├─ work_mem:            262144 (256 MB per sort/hash)
├─ maintenance_work_mem: 2097152 (2 GB for index operations)
└─ wal_buffers:         16384 (16 MB write-ahead log)

WAL & Checkpoint:
├─ checkpoint_timeout:  1800 (30 minutes)
├─ checkpoint_completion_target: 0.9 (keep 90% of checkpoint time)
├─ wal_level:           replica (for replication)
├─ max_wal_senders:     10 (max concurrent replicas)
└─ wal_keep_segments:   64 (keep 64 WAL segments for replicas)

Query Optimization:
├─ random_page_cost:    1.1 (SSD-friendly, lower = prefer index scan)
├─ effective_io_concurrency: 200 (SSD can handle many concurrent I/Os)
├─ default_statistics_target: 100 (detailed query stats)
└─ statement_timeout:   300000 (5 minute query timeout)

JSON/Geospatial:
├─ shared_preload_libraries: 'pgvector,uuid-ossp' (if using PostGIS)
└─ jit:                 on (JIT compilation for queries)
```

### 4.4 Database & User Setup

```
Primary Database:       newkarnataka_prod
├─ Owner:              postgres
├─ Encoding:           UTF8
├─ Collation:          en_US.utf8
└─ Tablespace:         pg_default

Schema Structure:
├─ strapi (Strapi core tables)
├─ content (article content, media)
├─ users (authentication, roles)
├─ analytics (engagement metrics)
├─ audit (change logs)
└─ staging (temp migration tables)

Database User: strapi_app
├─ Password:            (AWS Secrets Manager)
├─ Permissions:         CONNECT to newkarnataka_prod
├─ Schemas:             USAGE on strapi, content, users, analytics
├─ Tables:              SELECT, INSERT, UPDATE, DELETE (all)
└─ Sequences:           USAGE, SELECT (for auto-increment)

Database User: strapi_admin
├─ Password:            (AWS Secrets Manager)
├─ Permissions:         SUPERUSER (full control)
├─ Purpose:             Migrations, schema updates
└─ Scope:               Operations team only

Database User: read_only
├─ Password:            (AWS Secrets Manager)
├─ Permissions:         SELECT only (no write)
├─ Purpose:             Analytics, reporting
└─ Scope:               Read replicas, reporting tools
```

---

## SECTION 5: ELASTICACHE REDIS

### 5.1 Redis Cluster

```
Cluster ID:             newkarnataka-redis-prod
Engine:                 Redis 7.0 or 7.2
Node Type:              cache.t4g.large
Number of Nodes:        2 (1 primary, 1 replica)
Automatic Failover:     Enabled
Multi-AZ:               Enabled

Network Configuration:
├─ VPC:                 newkarnataka-prod
├─ Subnet Group:        newkarnataka-redis-subnet-group
│  └─ Subnets: 10.0.31.0/24, 10.0.32.0/24
├─ Security Group:      newkarnataka-redis-sg
└─ Port:                6379

Memory Configuration:
├─ Node Memory:         1.6 GB per node
├─ Total Memory:        3.2 GB (for cache + queue)
├─ Eviction Policy:     allkeys-lru (least recently used)
└─ Reserved Memory:     Reserved (not allocated)

Backup & Recovery:
├─ Automatic Snapshots: Enabled
├─ Snapshot Retention:  5 snapshots (daily)
├─ Snapshot Window:     02:00-03:00 UTC
└─ Manual Snapshots:    Available on demand

Maintenance:
├─ Maintenance Window:  Sunday 03:00-04:00 UTC
├─ Auto Minor Upgrade:  Yes
├─ Notification Topics: SNS for alerts
└─ Notify on Changes:   Enabled

Encryption:
├─ At Rest:             Enabled (KMS)
├─ In Transit:          Enabled (TLS)
├─ Auth Token:          Enabled (Redis AUTH)
└─ Token:               AWS Secrets Manager
```

### 5.2 Redis Key Structure

```
Session Keys (TTL: 24 hours):
├─ session:{sessionId}
│  └─ Stores: user_id, roles, preferences
├─ user:{userId}:session
│  └─ References: active sessions
└─ sessions:ttl_expire (sorted set by expiration)

Cache Keys (TTL: 1 hour):
├─ article:{articleId}
│  └─ Stores: Complete article JSON
├─ articles:list:{offset}:{limit}
│  └─ Stores: Paginated article list
├─ search:results:{query}:{offset}
│  └─ Stores: Search results
└─ categories (sorted set)
   └─ Stores: Category metadata

Rate Limiting (TTL: 1 hour):
├─ ratelimit:{userId}:requests
│  └─ Counter: Request count
├─ ratelimit:{userId}:reset_at
│  └─ Timestamp: When to reset
└─ Example: User limit = 1000 requests/hour

Real-time Counters (No TTL):
├─ stats:articles:total
├─ stats:views:today
├─ stats:likes:article:{articleId}
├─ stats:shares:article:{articleId}
└─ Updated via events (article view, like, share)

Queue Data (BullMQ):
├─ bull:{queueName}:id
├─ bull:{queueName}:{jobId}
├─ bull:{queueName}:active
├─ bull:{queueName}:delayed
├─ bull:{queueName}:failed
└─ Auto-managed by BullMQ library

Pub/Sub Channels:
├─ articles:updates
│  └─ Broadcast: Article created/updated
├─ admin:notifications
│  └─ Broadcast: Admin alerts
├─ user:{userId}:notifications
│  └─ Broadcast: User-specific events
└─ Used for WebSocket updates
```

### 5.3 Redis Monitoring

```
CloudWatch Metrics:
├─ CacheHits (per second)
├─ CacheMisses (per second)
├─ EvictionItemCount (number evicted)
├─ CacheNodes (healthy nodes)
├─ DatabaseMemoryUsagePercentage
├─ NetworkBytesIn/Out
├─ SwapUsage (should be 0)
└─ CPU Utilization

Alerts:
├─ EvictionCount > 1000/min → Increase node size
├─ SwapUsage > 0 → Immediate scale-up required
├─ DatabaseMemoryUsagePercentage > 90% → Scale up
├─ CPU Utilization > 75% → Add nodes or scale up
└─ CacheNodes < 2 → Failover in progress (expected)
```

---

## SECTION 6: OPENSEARCH (ELASTICSEARCH)

### 6.1 Domain Configuration

```
Domain Name:            newkarnataka-opensearch
Engine Version:         OpenSearch 2.9 or latest
Deployment Type:        Multi-AZ (across 3 AZs)

Master Nodes:
├─ Node Type:           t3.small.opensearch
├─ Number of Nodes:     3 (odd number for quorum)
├─ Dedicated Master:    Yes
└─ Purpose:             Cluster management, metadata

Data Nodes:
├─ Node Type:           m5.xlarge.opensearch
├─ Number of Nodes:     2 (minimum, auto-scale to 4)
├─ Storage:             500 GB gp2 per node
├─ Purpose:             Store indices, process queries
└─ Availability Zones:  us-east-1a, us-east-1b

Warm Nodes:
├─ Node Type:           t3.medium.opensearch
├─ Number of Nodes:     1 (optional, for cost saving)
├─ Storage:             200 GB per node
└─ Purpose:             Archive older indices (cold tier)

Network:
├─ VPC:                 newkarnataka-prod
├─ Security Group:      newkarnataka-es-sg
├─ Subnets:             10.0.41.0/24, 10.0.42.0/24, 10.0.43.0/24
└─ Public Access:       Disabled (private only)

Backup:
├─ Automated Snapshots: Enabled
├─ Snapshot Repository: S3 bucket (newkarnataka-backups)
├─ Backup Frequency:    Daily
├─ Retention:           30 snapshots
└─ Cross-Region Copy:   Enabled
```

### 6.2 Index Configuration

```
Index: articles
├─ Shards:              3 primary
├─ Replicas:            2 per shard (3 copies total)
├─ Refresh Interval:    5 seconds (near real-time)
├─ Storage:             ~50-100 GB for 55K articles
└─ Retention:           Indefinite

Index: users
├─ Shards:              1 primary
├─ Replicas:            2
├─ Storage:             ~1 GB
└─ Retention:           Indefinite

Index: analytics
├─ Shards:              2 primary
├─ Replicas:            1
├─ Retention:           90 days (automatic deletion)
└─ Storage:             ~200 GB rolling

Index Lifecycle Management (ILM):
├─ Hot Phase:           0-7 days (current data, full replication)
├─ Warm Phase:          7-30 days (read-only, fewer replicas)
├─ Cold Phase:          30-90 days (warm storage nodes)
└─ Delete:              After 90 days
```

### 6.3 Mapping & Analyzer

```
Article Index Mapping:
{
  "mappings": {
    "properties": {
      "article_id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "content": {
        "type": "text",
        "analyzer": "standard",
        "search_analyzer": "standard"
      },
      "category": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "author_id": { "type": "keyword" },
      "published_at": { "type": "date" },
      "updated_at": { "type": "date" },
      "location": { "type": "geo_point" },
      "view_count": { "type": "integer" },
      "like_count": { "type": "integer" },
      "share_count": { "type": "integer" },
      "language": { "type": "keyword" }
    }
  }
}

Custom Analyzer:
{
  "analyzer": {
    "kannada_analyzer": {
      "type": "custom",
      "tokenizer": "standard",
      "filter": [
        "lowercase",
        "stop_kannada"
      ]
    }
  }
}
```

---

## SECTION 7: S3 STORAGE

### 7.1 S3 Bucket Structure

```
Production Bucket: newkarnataka-prod-content

Folder Structure:
├── articles/                    # Article images
│   ├── {article_id}/
│   │   ├── featured.jpg        # Featured image (1200x630)
│   │   ├── featured-thumb.jpg  # Thumbnail (400x300)
│   │   └── images/             # Inline article images
│   │       ├── {image_id}.jpg
│   │       └── {image_id}-thumb.jpg
│   │
│   └── {article_id}/media.json # Metadata (size, URL, attribution)
│
├── media/                       # User-uploaded media
│   ├── profiles/               # User profile pictures
│   │   └── {user_id}.jpg
│   └── uploads/                # Temporary uploads
│       └── {timestamp}-{filename}
│
├── backups/                     # Database & config backups
│   ├── rds/                     # RDS snapshots (metadata)
│   │   └── db-yyyy-mm-dd-backup.manifest
│   ├── elasticsearch/           # ES snapshots
│   │   └── es-snapshot-2026-09-01
│   └── config/                  # Application config backups
│       └── config-2026-09-01.tar.gz
│
├── logs/                        # Application logs
│   ├── alb-access-logs/
│   │   └── AWSLogs/...
│   ├── cloudtrail/              # API audit logs
│   │   └── ...
│   └── application/             # App logs (if archived)
│       └── 2026-09/...
│
└── migrations/                  # Migration artifacts
    ├── wordpress-export/        # WP data dumps
    │   └── articles-batch-{n}.json
    ├── logs/                    # Migration logs
    │   └── migration-2026-09-01.log
    └── validation/              # Validation reports
        └── reconciliation-report.csv

Bucket Properties:
├─ Versioning:           Enabled
├─ Encryption:           AES-256 (default)
├─ Block Public Access:  All enabled (no public access)
├─ Access Logging:       Enabled (log to separate bucket)
├─ Object Lock:          Disabled
└─ Tags:                 env:production, app:newkarnataka
```

### 7.2 Lifecycle Policies

```
Rule 1: Archive Old Backups to Glacier
├─ Prefix:              backups/
├─ Days:                30 (move to Glacier after 30 days)
├─ Storage Class:       GLACIER
└─ Purpose:             Cost savings, keep for compliance

Rule 2: Archive Old Logs to Glacier
├─ Prefix:              logs/
├─ Days:                60 (move after 60 days)
├─ Storage Class:       DEEP_ARCHIVE
└─ Expiration:          365 days (delete after 1 year)

Rule 3: Delete Temporary Uploads
├─ Prefix:              media/uploads/
├─ Expiration:          7 days (auto-delete old uploads)
└─ Purpose:             Free up space, cleanup

Rule 4: Optimize Media Versions
├─ Prefix:              articles/, media/
├─ Delete Marker:       Delete after 30 days
├─ Non-Current Versions: Delete after 90 days
└─ Purpose:             Cost savings via versioning cleanup
```

### 7.3 Bucket Policies & Access

```
Public Access Policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadImages",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::newkarnataka-prod-content/articles/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-acl": "public-read"
        }
      }
    }
  ]
}

CORS Configuration:
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET"],
      "AllowedOrigins": [
        "https://newkarnataka.com",
        "https://www.newkarnataka.com",
        "https://api.newkarnataka.com"
      ],
      "MaxAgeSeconds": 3000
    }
  ]
}

CloudFront OAI Access:
├─ Origin Access Identity: newkarnataka-oai
├─ Purpose:               CloudFront reads from S3
├─ Bucket Policy:         Allow oai-xxxxx@cloudfront.amazonaws.com
└─ S3 Direct:             Denied (enforce via CloudFront)
```

---

## SECTION 8: CLOUDFRONT CDN

### 8.1 Distribution Configuration

```
Distribution ID:        E2XXXXX
Domain Name:            d111111abcdef8.cloudfront.net
CNAME:                  cdn.newkarnataka.com
Status:                 Enabled
Default Root Object:    index.html (for SPA fallback)

Behaviors:
├─ Path Pattern:        /articles/images/*
│  ├─ Origin:           S3 (newkarnataka-prod-content)
│  ├─ Allowed Methods:  GET, HEAD
│  ├─ Cache Policy:     Optimized for S3 (1 year TTL for versioned)
│  ├─ Compress:         Yes (gzip, brotli)
│  └─ Lambda@Edge:      Image optimization function (optional)
│
├─ Path Pattern:        /api/*
│  ├─ Origin:           ALB (newkarnataka-alb)
│  ├─ Allowed Methods:  GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
│  ├─ Cache Policy:     No caching (DynamoDB, API responses)
│  ├─ Origin Request Policy: All headers, querystring
│  └─ Lambda@Edge:      Auth header forwarding (optional)
│
└─ Default Pattern:     /*
   ├─ Origin:           ALB (web app)
   ├─ Allowed Methods:  GET, HEAD
   ├─ Cache Policy:     Managed-CachingOptimized
   ├─ Compress:         Yes
   └─ Origin Request Policy: CORS-S3Origin

Certificate:
├─ Provider:            AWS Certificate Manager
├─ Domain:              newkarnataka.com
├─ Alt Domains:         *.newkarnataka.com
├─ Validation:          DNS CNAME
└─ Auto Renewal:        Enabled

Logging:
├─ Enable:              Yes
├─ S3 Bucket:           newkarnataka-cloudfront-logs
├─ Prefix:              cf-logs/
└─ Retention:           90 days
```

### 8.2 Cache Behavior Details

```
Static Images (articles/images/):
├─ TTL (Min):           0 seconds
├─ TTL (Max):           31536000 (1 year, for versioned)
├─ TTL (Default):       86400 (1 day, for non-versioned)
├─ Query String Forward: None (strip query strings)
├─ Compress:            Yes (gzip/brotli)
├─ HTTP/2 Push:         Enabled for .css, .js
└─ Vary Headers:        Accept-Encoding

API Requests (/api/*):
├─ TTL:                 0 (no cache)
├─ Forward Cookies:     All
├─ Forward Headers:     All
├─ Forward Query String: Yes
├─ Origin Request Policy: Include Host Header, CORS
└─ Compress:            Yes (for JSON)

Origin Request Headers:
├─ CloudFront-Viewer-Country: For geo-based logic
├─ X-Forwarded-For:     Client IP (ALB sees real IP)
├─ X-Forwarded-Proto:   Protocol (HTTP/HTTPS)
└─ X-Original-URL:      Original request URL
```

### 8.3 WAF Integration

```
WAF WebACL:             newkarnataka-waf-acl
Managed Rules:
├─ AWSManagedRulesCommonRuleSet
│  └─ Protects against: SQL injection, XSS, path traversal
├─ AWSManagedRulesKnownBadInputsRuleSet
│  └─ Protects against: Known malicious requests
└─ AWSManagedRulesAmazonIpReputationList
   └─ Protects against: Known bot IPs

Custom Rules:
├─ Rate Limiting: 2000 requests per 5 min per IP
├─ Geo Blocking:  Allow India/US only (optional)
├─ IP Reputation: Block known malicious IPs
└─ Bot Control:   Challenge suspicious bots

Association:
├─ Resource Type:       CloudFront Distribution
├─ Distribution ID:     E2XXXXX
└─ Apply Immediately:   Yes
```

---

## SECTION 9: ECS FARGATE CLUSTER

### 9.1 Cluster Configuration

```
Cluster Name:           newkarnataka-prod-cluster
Capacity Provider:      FARGATE, FARGATE_SPOT
Container Insights:     Enabled
Default Capacity Provider Strategy:
├─ Provider:            FARGATE (80% capacity)
└─ Weight:              100
```

### 9.2 ECS Service

```
Service Name:           newkarnataka-strapi-service
Cluster:                newkarnataka-prod-cluster
Launch Type:            FARGATE
Platform Version:       Latest
Scheduling Strategy:    REPLICA

Task Definition:
├─ Family:              newkarnataka-strapi
├─ Revision:            Latest
├─ CPU:                 2048 (2 vCPU)
├─ Memory:              4096 (4 GB)
├─ Network Mode:        awsvpc
└─ Task Execution Role: ecsTaskExecutionRole

Desired Count:          3 tasks
Min Capacity:           2 tasks
Max Capacity:           10 tasks

Deployment Configuration:
├─ Strategy:            Rolling
├─ Min Healthy Percent: 100%
├─ Max Percent:         200%
├─ Termination Grace Period: 30 seconds
└─ Enable Circuit Breaker: Yes

Load Balancing:
├─ Type:                Application Load Balancer
├─ Target Group:        newkarnataka-ecs-tg
├─ Container Name:      strapi-app
├─ Container Port:      3000
└─ Protocol:            HTTP

Network Configuration:
├─ VPC:                 newkarnataka-prod
├─ Subnets:             10.0.11.0/24, 10.0.12.0/24, 10.0.13.0/24
├─ Security Groups:     newkarnataka-ecs-sg
└─ Assign Public IP:    DISABLED (private subnets only)

Service Registries:
├─ Service Discovery:   AWS Cloud Map (optional)
└─ Health Check:        /admin/health (HTTP 200-299)
```

### 9.3 Auto Scaling

```
Target Tracking Scaling Policy:
├─ Target:              CPU utilization 70%
├─ Scale Out (add tasks):
│  ├─ Trigger:          CPU > 70%
│  ├─ Scale-out time:   60 seconds
│  └─ Increment:        Add 1 task
│
└─ Scale In (remove tasks):
   ├─ Trigger:          CPU < 40%
   ├─ Scale-in time:    300 seconds (5 min cooldown)
   └─ Decrement:        Remove 1 task

Memory Scaling:
├─ Target:              Memory utilization 80%
├─ Trigger:             Memory > 80%
└─ Action:              Scale out (same as above)

Request Count Scaling:
├─ Target:              1000 requests per task
├─ Trigger:             ALB TargetResponseTime > 1s
└─ Action:              Scale out
```

---

## SUMMARY OF AWS COMPONENTS

| Component | Quantity | Instance/Size | Monthly Cost |
|-----------|----------|---|---|
| **Compute** | 3-10 | ECS Fargate t4g.large | ₹8,000 |
| **Database** | 1 + 2 replicas | db.t4g.xlarge + large | ₹15,000 |
| **Cache** | 2 nodes | cache.t4g.large | ₹6,000 |
| **Search** | 5 nodes | m5.xlarge + t3.small | ₹12,000 |
| **Storage** | 500 GB | S3 gp3 | ₹3,000 |
| **CDN** | 50-100 GB/mo | CloudFront | ₹4,000 |
| **Network** | 3x NAT + ALB | Data transfer + ALB | ₹5,000 |
| **Monitoring** | Full stack | CloudWatch + DataDog | ₹5,000 |
| **Backup & DR** | Multi-AZ + Snapshots | RDS + EBS + S3 | ₹1,000 |
| **TOTAL** | | | **₹59,000/month** |

**Infrastructure Specification - COMPLETE**

**Status:** Ready for AWS Provisioning Team  
**Next Step:** Begin terraform/CloudFormation IaC development



---

## SECTION 11: CI/CD PIPELINE (Hybrid Environment Deployment)

### 11.1 GitHub Actions Workflow (Dev → Staging → Production)

**.github/workflows/deploy.yml:**

```yaml
name: Deploy Pipeline (Dev → Staging → Prod)

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
  ECR_REPOSITORY_STRAPI: newkarnataka-strapi
  ECR_REPOSITORY_FRONTEND: newkarnataka-frontend

jobs:
  # Phase 1: Build & Test (runs on self-hosted Windows runner)
  build-and-test:
    runs-on: [self-hosted, windows-private-cloud]
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      
      - name: Install dependencies
        run: npm ci --prefer-offline
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:run
      
      - name: Build application
        run: npm run build

  # Phase 2: Deploy to AWS Staging
  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to ECR & Build
        run: |
          aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_STRAPI:${{ github.sha }} .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_STRAPI:${{ github.sha }}
      
      - name: Deploy to ECS Staging
        run: |
          aws ecs update-service \
            --cluster newkarnataka-staging-cluster \
            --service newkarnataka-strapi-service-staging \
            --force-new-deployment

  # Phase 3: Deploy to AWS Production (with manual approval)
  deploy-production:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID_PROD }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY_PROD }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Create pre-deployment backup
        run: |
          aws rds create-db-snapshot \
            --db-instance-identifier newkarnataka-prod-db \
            --db-snapshot-identifier newkarnataka-pre-deploy-${{ github.run_id }}
      
      - name: Blue-green deployment
        run: |
          aws ecs update-service \
            --cluster newkarnataka-prod-cluster \
            --service newkarnataka-strapi-service-prod \
            --force-new-deployment \
            --enable-ecs-managed-tags
```

### 11.2 Environment Parity Validation

**Checklist for Dev ↔ Staging ↔ Production consistency:**

```yaml
Database:
  ✓ PostgreSQL 14.x (all environments)
  ✓ UTF-8 encoding (all)
  ✓ Backup retention: Dev(7d), Staging(30d), Prod(90d)

Cache:
  ✓ Redis 7.x (all)
  ✓ Max memory policy: allkeys-lru (all)
  ✓ Encryption: in-transit + at-rest (all)

Search:
  ✓ Elasticsearch 8.x (all)
  ✓ Identical index mappings (all)
  ✓ Shards: Dev(1), Staging(1), Prod(3)

Containers:
  ✓ Base: node:18-alpine (all)
  ✓ Strapi 5.x (all)
  ✓ Environment variables: Same keys, different values

Monitoring:
  ✓ Dev: Docker logs + local metrics
  ✓ Staging: CloudWatch metrics, 7-day retention
  ✓ Prod: CloudWatch metrics, 90-day retention
```

---

## SECTION 12: COST SUMMARY (Hybrid Model)

### Monthly Infrastructure Costs

| Environment | Component | Sizing | Cost/Month |
|---|---|---|---|
| **Development (Windows Private Cloud)** | Hyper-V licensing | 4 VMs | ₹5,000 |
| | Network/Storage | On-prem | ₹3,000 |
| | Backup | Local NAS | ₹2,000 |
| **DEV TOTAL** | | | **₹10,000** |
| **Staging (AWS)** | ECS Fargate | 2x t4g.medium | ₹3,000 |
| | RDS | db.t3.small | ₹2,500 |
| | ElastiCache | t3.micro | ₹1,000 |
| | Elasticsearch | t3.small | ₹2,000 |
| | Data transfer | Egress | ₹1,500 |
| **STAGING TOTAL** | | | **₹10,000** |
| **Production (AWS)** | ECS Fargate | 3-10x t4g.large | ₹12,000 |
| | RDS Multi-AZ | db.t4g.xlarge + replicas | ₹18,000 |
| | ElastiCache | r6g.xlarge cluster | ₹8,000 |
| | Elasticsearch | 5 nodes m5.xlarge | ₹15,000 |
| | CloudFront CDN | 100GB/month | ₹5,000 |
| | ALB + NAT | 3 gateways | ₹4,000 |
| | Data transfer | Egress + inter-AZ | ₹2,000 |
| **PRODUCTION TOTAL** | | | **₹64,000** |
| **GRAND TOTAL** | | | **₹84,000/month** (~₹10L/year) |

### Annual Cost Breakdown

```
Development (₹120K/year):
├─ Hardware/licensing: ₹60K
├─ Network/storage: ₹36K
└─ Backups: ₹24K

Staging (₹120K/year):
├─ Compute: ₹36K
├─ Database: ₹30K
├─ Cache/Search: ₹36K
└─ Data transfer: ₹18K

Production (₹768K/year):
├─ Compute: ₹144K
├─ Database: ₹216K
├─ Cache/Search: ₹276K
├─ CDN/ALB: ₹108K
└─ Data transfer: ₹24K

TOTAL: ₹1,008,000/year (~₹50-51L budget + ongoing ops)
```

**Cost Optimization Opportunities:**

- Reduce Prod compute from t4g.large to t4g.medium (₹4-5K savings if traffic permits)
- Use Reserved Instances for 1-year commitment (30% discount)
- Consolidate ES indices (reduce from 5 to 3 nodes during off-peak)
- Implement S3 Intelligent Tiering for backups (auto-archive to Glacier)

---

## SECTION 13: INFRASTRUCTURE TIMELINE

### Week 1-2: Development Setup

```
[✓] Windows Private Cloud provision
    ├─ Hyper-V host configured
    ├─ 4 VMs created (Dev, CI, Backup, Optional Staging)
    └─ Network/storage configured

[✓] Developer workstations setup
    ├─ Docker Desktop installed
    ├─ WSL2 enabled
    └─ SSH keys distributed

[✓] GitHub Actions runner deployed
    ├─ Self-hosted runner on CI VM
    └─ Build pipeline functional
```

### Week 3-5: AWS Staging Deployment

```
[✓] AWS Staging infrastructure
    ├─ VPC (10.1.0.0/16) created
    ├─ RDS db.t3.small deployed
    ├─ ElastiCache/ES provisioned
    └─ ALB + health checks configured

[✓] Data migration to Staging
    ├─ PostgreSQL dump from Windows
    ├─ Restore to RDS Staging
    ├─ Validation passed
    └─ Backup snapshots created
```

### Week 6-8: AWS Production Deployment

```
[✓] AWS Production infrastructure
    ├─ VPC (10.0.0.0/16) created
    ├─ Multi-AZ RDS deployed
    ├─ Multi-AZ ElastiCache + ES
    ├─ CloudFront + WAF
    └─ Blue-green deployment ready

[✓] Production data loaded
    ├─ Final migration from Staging
    ├─ Data validation completed
    ├─ Backups secured
    └─ DR tested
```

### Week 9-10: Cutover & Go-Live

```
[✓] Zero-downtime cutover
    ├─ Blue-green deployment executed
    ├─ DNS cutover complete
    ├─ Traffic verification passed
    └─ Rollback procedure tested

[✓] Post-go-live
    ├─ CloudWatch dashboards active
    ├─ Alerts configured & tested
    ├─ Team on-call verified
    └─ Status page monitoring
```

---

## INFRASTRUCTURE SPECIFICATION - COMPLETE

**Architecture:** Hybrid Cloud (Windows Private Cloud Dev + AWS Prod/Staging)  
**Status:** Ready for Implementation  
**Feasibility Score:** 95/100  
**Annual Cost:** ~₹10L (development + operations)  

**Next Steps:**
1. AWS Account provisioning & quota increase requests
2. Windows Server procurement & Hyper-V setup
3. GitHub Actions runner configuration
4. Team onboarding & training
5. Kickoff meeting with stakeholders

**Approval:** IT Director + DevOps Lead sign-off required before proceeding to implementation phase.

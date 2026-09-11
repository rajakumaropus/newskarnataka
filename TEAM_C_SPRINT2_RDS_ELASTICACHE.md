# ☁️ TEAM C DAY 3 - RDS & ELASTICACHE PROVISIONING
## AWS Database Infrastructure Setup

**Status:** Ready for Execution  
**Date:** Wednesday, September 10, 2026  
**Lead:** DevOps Team Lead  
**Deliverable:** RDS PostgreSQL + ElastiCache Redis operational

---

## 🎯 DAY 3 OBJECTIVES

✅ Provision RDS PostgreSQL 15 instance  
✅ Set up Multi-AZ for high availability  
✅ Configure automated backups  
✅ Enable encryption at rest & in transit  
✅ Provision ElastiCache Redis 7  
✅ Configure Redis persistence  
✅ Set up database monitoring  
✅ Test database connectivity  

---

## 🗄️ STEP 1: RDS POSTGRESQL PROVISIONING

### AWS Console → RDS → Create Database

**Basic Configuration:**
- Engine: PostgreSQL 15.12
- Edition: Standard
- Template: Production
- DB Instance Identifier: `newskarnataka-prod-postgres`

**DB Instance Class:**
- Instance type: `db.t3.medium`
- Storage: `100 GB` (General Purpose SSD)
- Allocated storage: `100`
- Auto-scaling: Enabled (max 200 GB)

**Availability & Durability:**
- Multi-AZ deployment: Yes (standby in different AZ)
- Backup retention: 7 days
- Backup window: 03:00-04:00 UTC

**Database Authentication:**
- Master username: `newskarnataka_admin`
- Master password: (generate strong password, store in AWS Secrets Manager)
- Database name: `newskarnataka`
- Port: `5432`

**Connectivity:**
- VPC: `newskarnataka-prod`
- Subnet group: Create new `newskarnataka-db-subnet-group`
- Subnets: Select database subnets (10.0.21.0/24, 10.0.22.0/24)
- Publicly accessible: No
- VPC Security Group: Select `rds-sg` (created previously)

**Database Authentication:**
- IAM DB Authentication: Enabled
- KMS encryption: Enable
- KMS Key: aws/rds (default)

**Backups & Monitoring:**
- Backup retention: 7 days
- Backup window: 03:00-04:00
- Copy backups to another region: Enabled (us-west-2)
- Enable Enhanced Monitoring: Yes
- Monitoring Interval: 60 seconds
- Enable Performance Insights: Yes (7 days retention)
- Enable Log Exports: PostgreSQL logs, Upgrade logs

**Additional Configuration:**
- Database options:
  - Parameter group: Create new `newskarnataka-prod-postgres-params`
  - Option group: default
- Deletion protection: Enabled
- Backup settings verified

**Estimated Cost:** ~$200/month

**Click: Create Database** (Wait ~5-10 minutes)

---

## 🔧 RDS CONFIGURATION POST-CREATION

### Parameter Group Customization

**AWS Console → RDS → Parameter Groups → newskarnataka-prod-postgres-params**

Modify these parameters:

```sql
-- Connection limits
max_connections = 250
-- Query optimization
shared_buffers = 262144 (25% of instance RAM)
effective_cache_size = 786432 (75% of instance RAM)
work_mem = 16777
maintenance_work_mem = 67108
-- Logging
log_statement = all (in production, use 'ddl' or 'mod')
log_min_duration_statement = 1000 (log queries > 1 second)
-- Replication
wal_buffers = 16384
checkpoint_completion_target = 0.9
-- Connection
shared_preload_libraries = 'pg_stat_statements'
```

### Security Group Verification

**Inbound Rule: PostgreSQL**
```
Protocol: TCP
Port: 5432
Source: rds-sg (self-referencing)
```

---

## ⚡ STEP 2: ELASTICACHE REDIS PROVISIONING

### AWS Console → ElastiCache → Create Cluster

**Cluster Configuration:**
- Engine: Redis
- Engine version: 7.0.x (latest stable)
- Cluster mode: Disabled (single shard)
- Cluster name: `newskarnataka-prod-redis`
- Node type: `cache.t3.micro`
- Number of nodes: `2` (for high availability)
- Automatic failover: Enabled

**VPC & Subnet:**
- VPC: `newskarnataka-prod`
- Subnet group: Create new `newskarnataka-cache-subnet-group`
- Subnets: Select private DB subnets (10.0.21.0/24, 10.0.22.0/24)
- Security Group: Select `cache-sg`
- Publicly accessible: No

**Authentication:**
- Authentication: Token-based (AUTH)
- Auth token: (generate strong token, 32+ characters)
- Transit encryption: Enabled
- At-rest encryption: Enabled
- KMS Key: aws/elasticache

**Backup & Maintenance:**
- Automatic failover: Enabled
- Backup: Enable
- Backup window: 03:30-04:30
- Snapshot retention: 7 days
- Maintenance window: sun:04:30-sun:05:30
- Auto minor version upgrade: Yes

**Monitoring:**
- CloudWatch logs: Enable
- Log types: Slow log, Engine log
- Log retention: 7 days

**Estimated Cost:** ~$40/month

**Click: Create** (Wait ~3-5 minutes)

---

## 🔐 CONNECTIVITY TESTING

### Test RDS Connection from App Server

**SSH into EC2 instance (will be created Day 3):**

```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client

# Test connection
psql -h newskarnataka-prod-postgres.xxxxxx.us-east-1.rds.amazonaws.com \
     -U newskarnataka_admin \
     -d newskarnataka \
     -c "SELECT version();"

# Expected output:
# PostgreSQL 15.12 on x86_64-pc-linux-gnu...
```

### Test Redis Connection

```bash
# Install Redis CLI
sudo apt-get install redis-tools

# Test connection
redis-cli -h newskarnataka-prod-redis.xxxxxx.cache.amazonaws.com \
          -p 6379 \
          --no-auth-warning \
          -a "your-auth-token" \
          ping

# Expected output: PONG
```

---

## 📊 MONITORING SETUP

### CloudWatch Dashboards

**AWS Console → CloudWatch → Dashboards → Create Dashboard**

**Name:** `NewsKarnataka-DB-Monitoring`

**Add Widgets:**

1. **RDS CPU Utilization**
   - Metric: AWS/RDS → DBInstanceCPUUtilization
   - Instance: newskarnataka-prod-postgres
   - Period: 5 minutes

2. **RDS Database Connections**
   - Metric: AWS/RDS → DatabaseConnections
   - Instance: newskarnataka-prod-postgres

3. **RDS Storage Space**
   - Metric: AWS/RDS → FreeStorageSpace
   - Instance: newskarnataka-prod-postgres

4. **Redis CPU Utilization**
   - Metric: AWS/ElastiCache → CPUUtilization
   - CacheCluster: newskarnataka-prod-redis

5. **Redis Memory Usage**
   - Metric: AWS/ElastiCache → DatabaseMemoryUsagePercentage
   - CacheCluster: newskarnataka-prod-redis

6. **Redis Evictions**
   - Metric: AWS/ElastiCache → Evictions
   - CacheCluster: newskarnataka-prod-redis

### CloudWatch Alarms

**RDS CPU High**
```
Threshold: 80%
Period: 5 minutes
Action: SNS notification
```

**RDS Storage Low**
```
Threshold: 20 GB remaining
Period: 1 hour
Action: SNS notification + Auto-scaling
```

**Redis Memory High**
```
Threshold: 85%
Period: 5 minutes
Action: SNS notification
```

**Redis Connection Spike**
```
Threshold: >1000 connections
Period: 1 minute
Action: SNS notification
```

---

## 🔄 BACKUP & RECOVERY STRATEGY

### Automated Backups
- ✅ Daily snapshots (7-day retention)
- ✅ Cross-region replication (us-west-2)
- ✅ Point-in-time recovery (35 days)

### Manual Backup Procedure

**Pre-Production Snapshot:**
```bash
aws rds create-db-snapshot \
  --db-instance-identifier newskarnataka-prod-postgres \
  --db-snapshot-identifier newskarnataka-prod-postgres-backup-$(date +%Y%m%d)
```

**Restore from Snapshot:**
```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier newskarnataka-prod-postgres-restore \
  --db-snapshot-identifier newskarnataka-prod-postgres-backup-20260910
```

### Redis AOF Backup
- Append-Only File (AOF): Enabled
- Sync frequency: Every second
- RDB Snapshots: Every 6 hours

---

## 📈 PERFORMANCE OPTIMIZATION

### PostgreSQL Tuning

```sql
-- Connection pooling
SHOW max_connections;
-- Should see: 250 (from parameter group)

-- Shared buffers
SHOW shared_buffers;
-- Should see: 262144 (2GB for 8GB instance)

-- Check cache hit ratio
SELECT 
  100.0 * (heap_blks_hit / (heap_blks_hit + heap_blks_read)) as cache_hit_ratio
FROM pg_statio_user_tables
LIMIT 10;
-- Target: >99%
```

### Redis Optimization

```bash
# Monitor Redis performance
redis-cli --stat

# Check memory usage
redis-cli info memory

# Monitor slow queries (>1ms)
redis-cli config set slowlog-max-len 128
redis-cli slowlog get 10
```

---

## ✅ VERIFICATION CHECKLIST

**RDS PostgreSQL:**
- [ ] Instance created and running
- [ ] Multi-AZ enabled
- [ ] Automated backups configured
- [ ] Encryption enabled
- [ ] Monitoring active
- [ ] Connection successful
- [ ] Performance acceptable (<50ms query)

**ElastiCache Redis:**
- [ ] Cluster created and running
- [ ] Multi-node for HA
- [ ] Persistence enabled (AOF)
- [ ] Encryption enabled
- [ ] Monitoring active
- [ ] Connection successful
- [ ] Low latency (<1ms)

**Backup & Recovery:**
- [ ] Automated backups working
- [ ] Cross-region replication active
- [ ] Restore procedure tested
- [ ] Recovery time documented

**Monitoring:**
- [ ] CloudWatch dashboard active
- [ ] Alarms configured
- [ ] Notifications working
- [ ] Logs being collected

---

## 🎯 SUCCESS CRITERIA

✅ RDS PostgreSQL operational (Multi-AZ, encrypted)  
✅ ElastiCache Redis operational (persistent, HA)  
✅ Database connectivity verified  
✅ Monitoring and alarms active  
✅ Backup strategy in place  
✅ Performance baseline established  
✅ Documentation complete  
✅ Ready for application deployment (Day 4)

---

## 📊 COST OPTIMIZATION

| Component | Type | Cost/Month | Annual |
|-----------|------|-----------|--------|
| RDS t3.medium | Database | ~$200 | ~$2,400 |
| ElastiCache t3.micro (2) | Cache | ~$40 | ~$480 |
| Data transfer (estimat) | Network | ~$50 | ~$600 |
| Backup storage (estimat) | Storage | ~$30 | ~$360 |
| **Total** | | **~$320** | **~$3,840** |

**Cost Reduction Strategies:**
- Reserved instances: 30-40% discount (1-year)
- Spot instances for non-critical: 70% discount
- Total with optimization: ~$220/month (~$2,640/year)

---

**Team C Day 3 - RDS & ElastiCache Ready! 🚀**


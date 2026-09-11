# PostgreSQL Database Operations Guide
## NewsKarnataka Migration - Administration & Management

**Project:** NewsKarnataka.com Strapi Migration  
**Database:** PostgreSQL 14 on AWS RDS  
**Date:** September 2026

---

## SECTION 1: INITIAL SETUP & CONFIGURATION

### 1.1 RDS Instance Creation (AWS CLI)

```bash
#!/bin/bash

# Create PostgreSQL RDS Instance

aws rds create-db-instance \
  --db-instance-identifier newkarnataka-prod-db \
  --db-instance-class db.t4g.xlarge \
  --engine postgres \
  --engine-version 14.9 \
  --master-username postgres \
  --master-user-password "${DB_PASSWORD}" \
  --allocated-storage 500 \
  --storage-type gp3 \
  --iops 3000 \
  --storage-throughput 125 \
  --multi-az \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name newkarnataka-db-subnet-group \
  --backup-retention-period 30 \
  --backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --copy-tags-to-snapshot \
  --storage-encrypted \
  --kms-key-id arn:aws:kms:us-east-1:xxxxx:key/xxxxx \
  --db-parameter-group-name newkarnataka-pg14-params \
  --option-group-name default:postgres:14 \
  --deletion-protection \
  --enable-cloudwatch-logs-exports '["postgresql"]' \
  --enable-iam-database-authentication \
  --enable-performance-insights \
  --performance-insights-retention-period 7 \
  --tags Key=Environment,Value=production Key=Project,Value=newkarnataka

# Wait for instance to be available
aws rds wait db-instance-available \
  --db-instance-identifier newkarnataka-prod-db

echo "RDS Instance Created Successfully!"
```

### 1.2 Create Database & Schemas

```bash
#!/bin/bash

# Connect to RDS instance
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d postgres \
  <<EOF

-- Create main database
CREATE DATABASE newkarnataka_prod 
  WITH ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8';

-- Connect to new database
\c newkarnataka_prod

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schemas
CREATE SCHEMA content;
CREATE SCHEMA users;
CREATE SCHEMA analytics;
CREATE SCHEMA audit;
CREATE SCHEMA migrations;

-- Create strapi_app user with limited privileges
CREATE USER strapi_app WITH PASSWORD '${STRAPI_DB_PASSWORD}';
GRANT CONNECT ON DATABASE newkarnataka_prod TO strapi_app;
GRANT USAGE ON SCHEMA public, content, users, analytics, audit TO strapi_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO strapi_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO strapi_app;

-- Create read-only user for analytics
CREATE USER read_only WITH PASSWORD '${READ_ONLY_PASSWORD}';
GRANT CONNECT ON DATABASE newkarnataka_prod TO read_only;
GRANT SELECT ON ALL TABLES IN SCHEMA public, content, users, analytics TO read_only;

EOF

echo "Database and Schemas Created!"
```

---

## SECTION 2: USER & ACCESS MANAGEMENT

### 2.1 Create Application Users

```bash
#!/bin/bash

# Strapi Application User
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF

-- Strapi Application User (Read/Write)
CREATE USER strapi_app WITH PASSWORD '${STRAPI_DB_PASSWORD}';

-- Grant privileges
GRANT USAGE ON SCHEMA public, content, users, analytics, audit TO strapi_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO strapi_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO strapi_app;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO strapi_app;

-- Permissions for each role
GRANT SELECT, INSERT, UPDATE, DELETE ON articles TO strapi_app;
GRANT SELECT, INSERT, UPDATE ON users TO strapi_app;
GRANT SELECT, INSERT ON activity_logs TO strapi_app;
GRANT SELECT, INSERT ON content_validation_logs TO strapi_app;

-- Create read-only analytics user
CREATE USER analytics_user WITH PASSWORD '${ANALYTICS_PASSWORD}';
GRANT USAGE ON SCHEMA analytics TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO analytics_user;
GRANT SELECT ON article_engagement_metrics TO analytics_user;
GRANT SELECT ON search_analytics TO analytics_user;

-- Create migrations user (for schema updates)
CREATE USER migrations_user WITH PASSWORD '${MIGRATIONS_PASSWORD}';
ALTER USER migrations_user CREATEDB;
GRANT ALL ON DATABASE newkarnataka_prod TO migrations_user;

EOF

echo "Database Users Created!"
```

### 2.2 Row-Level Security (RLS) Setup

```bash
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF

-- Set current_user_id (for RLS policies)
ALTER ROLE strapi_app SET search_path = public, content, users, analytics, audit;

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- User can view own profile
CREATE POLICY user_profile_policy ON users
  FOR SELECT USING (
    id = CURRENT_SETTING('app.current_user_id')::BIGINT 
    OR CURRENT_SETTING('app.is_admin')::BOOLEAN = TRUE
  );

-- User can update own profile
CREATE POLICY user_update_policy ON users
  FOR UPDATE USING (
    id = CURRENT_SETTING('app.current_user_id')::BIGINT
  );

EOF

echo "RLS Policies Configured!"
```

---

## SECTION 3: BACKUP & RECOVERY PROCEDURES

### 3.1 Manual Backup Commands

```bash
#!/bin/bash

# Full Database Backup
BACKUP_FILE="/backups/newkarnataka_prod_$(date +%Y%m%d_%H%M%S).dump"

PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  --format=custom \
  --compress=9 \
  --verbose \
  --file="${BACKUP_FILE}"

# Upload to S3
aws s3 cp "${BACKUP_FILE}" s3://newkarnataka-backups/daily-dumps/

echo "Backup completed: ${BACKUP_FILE}"

# Cleanup old local backups (keep last 7 days)
find /backups -name "newkarnataka_prod_*.dump" -mtime +7 -delete

echo "Backup cleanup completed!"
```

### 3.2 Restore from Backup

```bash
#!/bin/bash

BACKUP_FILE="/backups/newkarnataka_prod_20260901_100000.dump"

# Download from S3 if needed
# aws s3 cp s3://newkarnataka-backups/daily-dumps/newkarnataka_prod_20260901_100000.dump "${BACKUP_FILE}"

# Restore (requires clean database)
PGPASSWORD="${DB_PASSWORD}" pg_restore \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  --verbose \
  --jobs=4 \
  "${BACKUP_FILE}"

echo "Restore completed from: ${BACKUP_FILE}"
```

### 3.3 Point-in-Time Recovery (PITR)

```bash
#!/bin/bash

# For AWS RDS, use AWS Console or CLI to restore to a point in time

# Example: Restore to 1 hour ago
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier newkarnataka-prod-db-restored \
  --db-snapshot-identifier newkarnataka-prod-db-snapshot-20260901 \
  --restore-time 2026-09-01T15:00:00Z

# Or restore from automatic backup
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier newkarnataka-prod-db \
  --target-db-instance-identifier newkarnataka-prod-db-restored \
  --restore-time 2026-09-01T15:00:00Z

echo "Point-in-Time Restore initiated!"
```

---

## SECTION 4: PERFORMANCE MONITORING & OPTIMIZATION

### 4.1 Monitor Query Performance

```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 20 Slowest Queries
SELECT query, mean_exec_time, stddev_exec_time, calls, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Most Called Queries
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 20;

-- Queries with Most I/O
SELECT query, blk_read_time, blk_write_time
FROM pg_stat_statements
WHERE blk_read_time + blk_write_time > 0
ORDER BY (blk_read_time + blk_write_time) DESC
LIMIT 20;

-- Reset statistics
SELECT pg_stat_statements_reset();
```

### 4.2 Check Table & Index Sizes

```sql
-- Top 20 Largest Tables
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- Top Indexes by Size
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
```

### 4.3 Check Missing Indexes

```sql
-- Unused Indexes (can be candidates for deletion)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Tables with Potential Missing Indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 100
  AND correlation < 0.1
ORDER BY n_distinct DESC
LIMIT 20;
```

### 4.4 Analyze Query Plans

```sql
-- EXPLAIN ANALYZE: Identify bottlenecks
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT a.id, a.title, a.view_count, u.display_name
FROM articles a
JOIN users u ON a.author_id = u.id
WHERE a.status = 'published'
  AND a.category_id = 5
ORDER BY a.published_at DESC
LIMIT 10;

-- Look for:
-- - Sequential Scans (might indicate missing index)
-- - High actual rows vs estimate
-- - Sorts or aggregates on large datasets
```

---

## SECTION 5: MAINTENANCE OPERATIONS

### 5.1 VACUUM & ANALYZE Schedule

```bash
#!/bin/bash

# Daily VACUUM (clean dead tuples)
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF
VACUUM articles;
VACUUM users;
VACUUM comments;
VACUUM likes;
VACUUM activity_logs;
ANALYZE;
EOF

# Weekly REINDEX (rebuild fragmented indexes)
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF
REINDEX TABLE CONCURRENTLY articles;
REINDEX TABLE CONCURRENTLY users;
REINDEX TABLE CONCURRENTLY comments;
EOF

echo "Maintenance completed!"
```

### 5.2 Auto-Vacuum Configuration

```sql
-- Adjust auto-vacuum settings for high-traffic tables
ALTER TABLE articles SET (
  autovacuum_vacuum_scale_factor = 0.01,  -- Vacuum at 1% of table size
  autovacuum_analyze_scale_factor = 0.005, -- Analyze at 0.5%
  autovacuum_vacuum_cost_delay = 10,
  autovacuum_vacuum_cost_limit = 1000
);

ALTER TABLE comments SET (
  autovacuum_vacuum_scale_factor = 0.02,
  autovacuum_analyze_scale_factor = 0.01
);

ALTER TABLE activity_logs SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02
);
```

### 5.3 Archive Old Data

```bash
#!/bin/bash

# Archive activity logs older than 1 year to separate table
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF

-- Create archive table
CREATE TABLE activity_logs_archive AS 
SELECT * FROM activity_logs 
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';

-- Verify count
SELECT COUNT(*) as archived_records FROM activity_logs_archive;

-- Delete archived records from main table
DELETE FROM activity_logs 
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';

-- Verify deletion
SELECT COUNT(*) as remaining_records FROM activity_logs;

VACUUM FULL activity_logs;

EOF

echo "Data archival completed!"
```

---

## SECTION 6: MONITORING & ALERTING SETUP

### 6.1 CloudWatch Monitoring

```bash
#!/bin/bash

# Enable Enhanced Monitoring (already enabled during RDS creation)
# This provides OS-level metrics every 1 second

# Create CloudWatch Alarms

# 1. High CPU Utilization
aws cloudwatch put-metric-alarm \
  --alarm-name newkarnataka-db-high-cpu \
  --alarm-description "Alert when database CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:xxxxx:newkarnataka-alerts

# 2. High Connections
aws cloudwatch put-metric-alarm \
  --alarm-name newkarnataka-db-high-connections \
  --alarm-description "Alert when database connections > 80" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:xxxxx:newkarnataka-alerts

# 3. High Disk Space
aws cloudwatch put-metric-alarm \
  --alarm-name newkarnataka-db-high-storage \
  --alarm-description "Alert when free storage < 50 GB" \
  --metric-name FreeStorageSpace \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 53687091200 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:xxxxx:newkarnataka-alerts

# 4. Database Replication Lag (for read replicas)
aws cloudwatch put-metric-alarm \
  --alarm-name newkarnataka-db-replication-lag \
  --alarm-description "Alert when replication lag > 5 seconds" \
  --metric-name ReplicationLatency \
  --namespace AWS/RDS \
  --statistic Maximum \
  --period 60 \
  --threshold 5000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:xxxxx:newkarnataka-alerts

echo "CloudWatch Alarms Created!"
```

### 6.2 Query Logging

```sql
-- Enable query logging for slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1 second
ALTER SYSTEM SET log_statement = 'all'; -- Log all statements (comment out in production for performance)
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_lock_waits = on;

-- Reload configuration
SELECT pg_reload_conf();

-- View logs
SELECT * FROM pg_log;
```

---

## SECTION 7: MIGRATION FROM WORDPRESS

### 7.1 Data Migration Strategy

```bash
#!/bin/bash

# Step 1: Export WordPress data
wp db export wordpress_export.sql --allow-root

# Step 2: Transform WordPress data to PostgreSQL format
python3 transform_wordpress_data.py wordpress_export.sql > postgresql_import.sql

# Step 3: Import to PostgreSQL
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  -f postgresql_import.sql

echo "Migration completed!"
```

### 7.2 Data Validation Post-Migration

```sql
-- Verify migration integrity

-- 1. Count Records
SELECT 'articles' as entity, COUNT(*) as count FROM articles
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'comments', COUNT(*) FROM comments;

-- 2. Check for orphaned records
SELECT COUNT(*) FROM articles WHERE author_id IS NULL;
SELECT COUNT(*) FROM articles WHERE category_id IS NULL;
SELECT COUNT(*) FROM comments WHERE article_id IS NULL;

-- 3. Verify foreign keys
SELECT constraint_name, table_name
FROM information_schema.referential_constraints
WHERE constraint_schema = 'public';

-- 4. Check for duplicate slugs
SELECT slug, COUNT(*) as count
FROM articles
GROUP BY slug
HAVING COUNT(*) > 1;

-- 5. Verify encodings (UTF-8)
SELECT datctype FROM pg_database WHERE datname = 'newkarnataka_prod';
```

---

## SECTION 8: HIGH AVAILABILITY SETUP

### 8.1 Read Replicas Creation

```bash
#!/bin/bash

# Create read replica 1 (same AZ as backup)
aws rds create-db-instance-read-replica \
  --db-instance-identifier newkarnataka-prod-db-replica-1 \
  --source-db-instance-identifier newkarnataka-prod-db \
  --db-instance-class db.t4g.large \
  --publicly-accessible false \
  --auto-minor-version-upgrade \
  --storage-encrypted

# Create read replica 2 (different AZ)
aws rds create-db-instance-read-replica \
  --db-instance-identifier newkarnataka-prod-db-replica-2 \
  --source-db-instance-identifier newkarnataka-prod-db \
  --db-instance-class db.t4g.large \
  --availability-zone us-east-1c \
  --publicly-accessible false

echo "Read Replicas Created!"
```

### 8.2 Promote Read Replica on Failure

```bash
#!/bin/bash

# Promote read replica to standalone instance
aws rds promote-read-replica \
  --db-instance-identifier newkarnataka-prod-db-replica-1 \
  --backup-retention-period 30

# Update application to point to new primary
echo "Read Replica Promoted to Primary!"
```

---

## SECTION 9: DISASTER RECOVERY TESTING

### 9.1 Monthly DR Drill

```bash
#!/bin/bash

echo "=== Starting Monthly Disaster Recovery Drill ==="

# Step 1: Create snapshot
SNAPSHOT_ID="newkarnataka-dr-drill-$(date +%Y%m%d-%H%M%S)"
aws rds create-db-snapshot \
  --db-instance-identifier newkarnataka-prod-db \
  --db-snapshot-identifier "${SNAPSHOT_ID}"

# Wait for snapshot
aws rds wait db-snapshot-available \
  --db-snapshot-identifier "${SNAPSHOT_ID}"

echo "Snapshot created: ${SNAPSHOT_ID}"

# Step 2: Restore from snapshot to DR environment
DR_INSTANCE="newkarnataka-dr-test-instance"
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier "${DR_INSTANCE}" \
  --db-snapshot-identifier "${SNAPSHOT_ID}"

# Wait for restore
aws rds wait db-instance-available \
  --db-instance-identifier "${DR_INSTANCE}"

echo "DR Instance restored: ${DR_INSTANCE}"

# Step 3: Connect and verify
PGPASSWORD="${DB_PASSWORD}" psql \
  -h "${DR_INSTANCE}.xxxxx.us-east-1.rds.amazonaws.com" \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF
SELECT COUNT(*) as article_count FROM articles;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as comment_count FROM comments;
EOF

echo "DR Verification: Data counts retrieved successfully"

# Step 4: Cleanup DR instance (keep for 24 hours for validation)
# aws rds delete-db-instance \
#   --db-instance-identifier "${DR_INSTANCE}" \
#   --skip-final-snapshot

# Step 5: Delete old snapshots (keep last 7)
echo "=== DR Drill Complete ==="
```

---

## SECTION 10: PERFORMANCE TUNING

### 10.1 Parameter Group Optimization

```sql
-- Optimize for NewsKarnataka workload (read-heavy, 55K articles)

-- Memory Settings
shared_buffers = 2097152  -- 16 GB (25% of instance memory)
effective_cache_size = 6291456  -- 48 GB (75% of instance memory)
work_mem = 262144  -- 256 MB per query operation
maintenance_work_mem = 2097152  -- 2 GB for index operations

-- WAL Settings
wal_level = replica
wal_buffers = 16384  -- 16 MB

-- Checkpoint Settings
checkpoint_timeout = 1800  -- 30 minutes
checkpoint_completion_target = 0.9

-- Query Planning
random_page_cost = 1.1  -- SSD-optimized (lower = prefer index scan)
effective_io_concurrency = 200  -- SSD can handle concurrent I/O
default_statistics_target = 100  -- Detailed query statistics

-- Connection Management
max_connections = 500
idle_in_transaction_session_timeout = 300000  -- 5 minutes

-- Logging
log_min_duration_statement = 1000  -- Log queries > 1 second
log_lock_waits = on
log_temp_files = 0  -- Log all temp files
log_statement = 'ddl'  -- Log DDL (CREATE, ALTER, DROP)
```

### 10.2 Application Connection Settings

```python
# Django/Python example
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com',
        'PORT': 5432,
        'NAME': 'newkarnataka_prod',
        'USER': 'strapi_app',
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'ATOMIC_REQUESTS': False,
        'CONN_MAX_AGE': 600,  # Connection pooling
        'OPTIONS': {
            'connect_timeout': 10,
            'sslmode': 'require',
            'application_name': 'strapi_app',
        },
        'CONN_HEALTH_CHECKS': True,  # Django 4.1+
    }
}

# Connection pooling with PgBouncer
DATABASES['default']['OPTIONS']['connect_timeout'] = 10
# Use pgbouncer_proxy:5432 instead of direct RDS endpoint
```

---

## SECTION 11: RUNBOOKS

### 11.1 High CPU Usage Response

```bash
#!/bin/bash

# 1. Identify Slow Queries
PGPASSWORD="${DB_PASSWORD}" psql \
  -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  <<EOF
SELECT pid, usename, query, query_start
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY query_start;
EOF

# 2. Kill problematic query if necessary
# SELECT pg_terminate_backend(pid) WHERE pid = XXXXX;

# 3. Check for missing indexes
# See query optimization section

# 4. Increase instance size if sustained high CPU
```

### 11.2 Replication Lag Response

```bash
#!/bin/bash

# Check replication lag
aws rds describe-db-instances \
  --db-instance-identifier newkarnataka-prod-db-replica-1 \
  --query 'DBInstances[0].ReplicationLag'

# If lag > 5 seconds:
# 1. Check network connectivity
# 2. Check primary instance performance
# 3. Increase replica instance size if needed
# 4. Consider promoting replica if primary is failing
```

---

**Database Operations Guide Status:** COMPLETE ✓  
**Ready for:** Production Operations & Team Training


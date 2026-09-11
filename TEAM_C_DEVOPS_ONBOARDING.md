# Team C: DevOps Onboarding Guide
## Docker, AWS Infrastructure & Deployment Pipeline

**Team:** 3 DevOps Engineers  
**Tech Stack:** Docker, Docker Compose, AWS (RDS, EC2, ALB, S3, CloudFront)  
**Database:** PostgreSQL 14+ (103.191.208.235)  
**Duration:** Ongoing reference during Sprint 1 & beyond

---

## YOUR MISSION

Build and maintain the **infrastructure backbone** with:
- **Docker Compose** (dev/staging: Strapi, PostgreSQL, Redis, pgAdmin)
- **AWS Infrastructure** (RDS, EC2, ALB, CloudFront, Route53)
- **CI/CD Pipeline** (GitHub Actions for automated testing & deployment)
- **Monitoring & Observability** (CloudWatch, alarms, dashboards)
- **Backup & Disaster Recovery** (automated daily backups, point-in-time recovery)

**Success = 99.9% uptime + <200ms response time + zero data loss**

---

## SPRINT 1 GOALS (Week 1)

### Monday EOD
- ✅ Docker images built & running
- ✅ All services operational (Strapi, PostgreSQL, Redis, pgAdmin)
- ✅ Team connectivity verified
- ✅ Monitoring dashboards active
- ✅ Code pushed to GitHub

### Tuesday EOD (CRITICAL GATING)
- ✅ All 3 DevOps engineers connected to database
- ✅ Connection pooling configured
- ✅ Performance baseline established
- ✅ Monitoring alerts active
- ✅ **GATE #1 PASSED: Database Operational**

### Wednesday EOD
- ✅ AWS environment prepared (if applicable)
- ✅ Staging infrastructure ready
- ✅ Backup automation tested
- ✅ Disaster recovery plan validated

### Thursday EOD
- ✅ CI/CD pipeline configured
- ✅ GitHub Actions workflows active
- ✅ Automated testing on commits
- ✅ Deployment automation working

### Friday EOD
- ✅ Full infrastructure operational
- ✅ Documentation complete
- ✅ Team trained on deployment process
- ✅ Ready for Sprint 2

---

## SETUP: MONDAY MORNING (BEFORE BREAKOUT)

### 1. Verify Prerequisites (10 min)

```bash
# Check Docker installation
docker --version
# Expected: Docker version 20.10+

# Check Docker Compose
docker-compose --version
# Expected: Docker Compose version 1.29+ or 2.0+

# Check PostgreSQL client
psql --version
# Expected: PostgreSQL 12+

# Check AWS CLI (if using AWS)
aws --version
# Expected: AWS CLI 2.x

# Check Git
git --version
# Expected: 2.x

# Verify Docker daemon is running
docker ps

# Expected: Column headers showing containers (if none running, that's OK)
```

### 2. Test Database Connection (5 min)

```bash
# Test connectivity to production database
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Expected: (1 row) 1

# If fails, check:
ping 103.191.208.235
nc -zv 103.191.208.235 5432
# Ask Team Lead if VPN is needed
```

### 3. Configure Git (5 min)

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@newskarnataka.com"

# Helpful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

### 4. Prepare Docker Workspace (5 min)

```bash
# Create development folder
mkdir -p ~/newskarnataka-infra
cd ~/newskarnataka-infra

# You'll clone the infrastructure repo here
```

---

## MONDAY BREAKOUT SESSION (10:30 AM - 12:00 PM)

### Step 1: Copy docker-compose.yml (5 min)

From workspace: `d:\Personal\Kiro\KeralaNews\docker-compose.yml`

Copy to your local development folder:

```bash
cd ~/newskarnataka-infra
cp [path-to]/docker-compose.yml .

# Verify it exists
ls -la docker-compose.yml
```

### Step 2: Create .env File (10 min)

```bash
# Create .env file with credentials
cat > .env << 'EOF'
# PostgreSQL
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true

# Strapi
NODE_ENV=production
STRAPI_PORT=1337
STRAPI_HOST=0.0.0.0

# Redis
REDIS_PASSWORD=redis123
REDIS_PORT=6379

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@newskarnataka.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Docker
DOCKER_NETWORK=newskarnataka-network
EOF

# Verify
cat .env
```

### Step 3: Create Required Directories (5 min)

```bash
# Create volumes for persistent data
mkdir -p volumes/{postgres,redis,pgadmin,strapi}

# Set permissions (Linux/macOS)
chmod 755 volumes/*

# On Windows (skip chmod, PowerShell handles it)
```

### Step 4: Build Docker Images (15 min)

```bash
# Build all images
docker-compose build

# Expected output:
# Building strapi ... done
# Building postgres ... done
# Building redis ... done
# Building pgadmin ... done

# Verify images built
docker images | grep newskarnataka

# Should show images with tags
```

### Step 5: Start Services (15 min)

```bash
# Start all services
docker-compose up -d

# Expected: "done"

# Verify services are running
docker-compose ps

# Expected output:
# NAME                COMMAND             STATUS      PORTS
# newskarnataka-strapi    "npm start"        Up 2 min    0.0.0.0:1337->1337/tcp
# newskarnataka-postgres  "docker-entrypoint" Up 2 min   5432/tcp
# newskarnataka-redis     "redis-server"     Up 2 min   6379/tcp
# newskarnataka-pgadmin   "/bin/sh -c ..."   Up 2 min   0.0.0.0:5050->80/tcp
```

### Step 6: Verify Connectivity (15 min)

```bash
# 1. Test Strapi
curl http://localhost:1337/admin
# Expected: HTML response (Strapi admin page)

# 2. Test PostgreSQL from container
docker-compose exec postgres psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"
# Expected: (1 row) 1

# 3. Test Redis
docker-compose exec redis redis-cli ping
# Expected: PONG

# 4. Test pgAdmin
# Open browser: http://localhost:5050
# Login: admin@newskarnataka.com / admin123

# 5. Each developer connects
# All 3 team members run:
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Screenshot showing all services running and team connected
```

### Step 7: Initialize Git & Push (5 min)

```bash
# Create .gitignore
cat > .gitignore << 'EOF'
.env
.env.local
volumes/
docker-compose.override.yml
EOF

# Initialize Git
git init

# Create initial commit
git add .
git commit -m "feat: Add Docker Compose stack for development"

# Add remote
git remote add origin https://github.com/newskarnataka/newskarnataka-infra.git

# Create feature branch
git checkout -b feature/docker-infrastructure

# Push to GitHub
git push -u origin feature/docker-infrastructure
```

### Step 8: Screenshot & Report (5 min)

```bash
# Screenshots needed:
# 1. docker-compose ps output
# 2. Browser showing Strapi admin (localhost:1337/admin)
# 3. Browser showing pgAdmin (localhost:5050)
# 4. Terminal showing database connectivity test
# 5. All 3 team members' successful connections

# Post in #team-devops Slack:
"""
✅ Docker infrastructure operational!

Services running:
- Strapi (localhost:1337)
- PostgreSQL (103.191.208.235:5432)
- Redis (localhost:6379)
- pgAdmin (localhost:5050)

Team connectivity:
✅ [Name 1]
✅ [Name 2]
✅ [Name 3]

Ready for next phase!
"""
```

---

## MONDAY AFTERNOON: MONITORING & DASHBOARDS (1:00 PM - 5:00 PM)

### Set Up Monitoring Stack

```bash
# Add monitoring services to docker-compose.yml
cat >> docker-compose.yml << 'EOF'

# Optional: Add Prometheus for metrics
prometheus:
  image: prom/prometheus:latest
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'

# Optional: Add Grafana for dashboards
grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - grafana_data:/var/lib/grafana
  depends_on:
    - prometheus

volumes:
  prometheus_data:
  grafana_data:
EOF

# Rebuild and start
docker-compose build
docker-compose up -d

# Verify
docker-compose ps | grep -E "prometheus|grafana"
```

### Create Prometheus Configuration

```bash
# Create prometheus.yml
cat > prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'docker'
    static_configs:
      - targets: ['localhost:8080']
  
  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
EOF
```

### Access Dashboards

```bash
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)

# In Grafana:
# 1. Add Prometheus data source
# 2. Create dashboards for:
#    - Database connections
#    - CPU & Memory usage
#    - API response times
#    - Error rates
```

---

## TUESDAY: DATABASE CONNECTIVITY GATING (CRITICAL)

### Gate #1: Full Team Verification

**Each DevOps engineer must verify:**

```bash
# 1. Test database connection
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT version();"

# Expected: PostgreSQL version info

# 2. Check connection pooling configuration
# Edit docker-compose.yml or application config:
# Pool settings:
#   - Min connections: 5
#   - Max connections: 20
#   - Idle timeout: 300s
#   - Query timeout: 30s

# 3. Monitor active connections
psql -h 103.191.208.235 -U news -d newskarnataka << 'EOF'
SELECT 
  datname,
  usename,
  application_name,
  state,
  query
FROM pg_stat_activity
WHERE datname = 'newskarnataka'
ORDER BY query_start DESC;
EOF

# 4. Test performance baseline
time psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT COUNT(*) FROM pg_catalog.pg_tables;"

# 5. Each team member reports in #team-devops:
# "✅ [Your Name] - Database connected, pooling verified, response time: XXms"
```

### Performance Baseline Metrics

```bash
# Collect baseline metrics
psql -h 103.191.208.235 -U news -d newskarnataka << 'EOF'

-- Database size
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) 
FROM pg_database 
WHERE datname = 'newskarnataka';

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index sizes
SELECT indexname, pg_size_pretty(pg_relation_size(indexrelid)) 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY pg_relation_size(indexrelid) DESC;

-- Current connections
SELECT count(*) as connection_count FROM pg_stat_activity;

-- Query performance
SELECT mean_exec_time, calls, query FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;

EOF
```

### Gate #1 Success Criteria
- [ ] All 3 DevOps engineers connected
- [ ] Connection pooling verified
- [ ] Performance baseline established
- [ ] Monitoring dashboards active
- [ ] Zero connection errors

**If fails:** Escalate to Tech Lead

---

## WEDNESDAY: AWS INFRASTRUCTURE SETUP (If Using AWS)

### Prepare AWS Environment

```bash
# Login to AWS Console
# 1. Go to https://console.aws.amazon.com
# 2. Login with credentials from Tech Lead
# 3. Select appropriate region (us-east-1 or ap-south-1)

# Create RDS Instance (if not already created)
# - Database: PostgreSQL 14
# - Multi-AZ: Yes
# - Storage: 100GB initial, auto-scaling to 500GB
# - Backup retention: 30 days
# - Encryption: Yes (AWS KMS)
# - Monitoring: Enhanced monitoring enabled

# Create EC2 Security Groups
# - Inbound: Port 5432 (PostgreSQL) from app servers
# - Inbound: Port 443 (HTTPS) from internet
# - Inbound: Port 80 (HTTP) from internet
# - Egress: All traffic allowed

# Create S3 Bucket for backups
# - Bucket name: newskarnataka-backups
# - Versioning: Enabled
# - Encryption: S3-managed (default)
# - Lifecycle: Archive to Glacier after 90 days
```

### Configure Backup Automation

```bash
# Create backup script
cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/backups"
DB_NAME="newskarnataka"
DB_USER="news"
DB_HOST="103.191.208.235"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/newskarnataka_$TIMESTAMP.sql.gz"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
  echo "✓ Backup created: $BACKUP_FILE"
  
  # Upload to S3 (if configured)
  aws s3 cp $BACKUP_FILE s3://newskarnataka-backups/
  
  # Keep only last 7 days of local backups
  find $BACKUP_DIR -name "newskarnataka_*.sql.gz" -mtime +7 -delete
else
  echo "✗ Backup failed!"
  exit 1
fi
EOF

chmod +x scripts/backup-database.sh

# Schedule with cron (run daily at 2 AM)
# Add to crontab:
# 0 2 * * * /path/to/scripts/backup-database.sh
```

### Test Disaster Recovery

```bash
# Simulate database restore from backup
# 1. Create test database
createdb -h 103.191.208.235 -U news newskarnataka_test

# 2. Restore from latest backup
gunzip < /backups/newskarnataka_latest.sql.gz | psql -h 103.191.208.235 -U news newskarnataka_test

# 3. Verify data integrity
psql -h 103.191.208.235 -U news newskarnataka_test -c "SELECT COUNT(*) FROM articles;"

# 4. Drop test database
dropdb -h 103.191.208.235 -U news newskarnataka_test

# Document recovery time objective (RTO): < 30 minutes
# Document recovery point objective (RPO): < 1 hour
```

---

## THURSDAY: CI/CD PIPELINE

### Create GitHub Actions Workflow

```bash
# Create workflow directory
mkdir -p .github/workflows

# Create deployment workflow
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - develop

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: news
          POSTGRES_PASSWORD: news321
          POSTGRES_DB: newskarnataka
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --run --coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          # Deploy script here
          echo "Deploying to production..."
EOF

git add .github/workflows/
git commit -m "feat: Add GitHub Actions CI/CD workflow"
```

### Configure Deployment Strategy

```bash
# Create deployment script
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

ENVIRONMENT=$1
REGION=${AWS_REGION:-us-east-1}

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "Usage: ./deploy.sh [staging|production]"
  exit 1
fi

echo "Deploying to $ENVIRONMENT..."

# Build Docker image
docker build -t newskarnataka:latest .

# Push to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin [ECR_REPO_URL]
docker tag newskarnataka:latest [ECR_REPO_URL]/newskarnataka:latest
docker push [ECR_REPO_URL]/newskarnataka:latest

# Update ECS service
aws ecs update-service \
  --cluster newskarnataka-$ENVIRONMENT \
  --service strapi \
  --force-new-deployment \
  --region $REGION

# Wait for deployment
aws ecs wait services-stable \
  --cluster newskarnataka-$ENVIRONMENT \
  --services strapi \
  --region $REGION

echo "✓ Deployment complete!"
EOF

chmod +x scripts/deploy.sh
```

---

## FRIDAY: DOCUMENTATION & TEAM TRAINING

### Create Runbook Documentation

```bash
# Create operations runbook
cat > docs/RUNBOOK.md << 'EOF'
# Operations Runbook

## Starting Services

### Docker Compose (Development)
```bash
cd ~/newskarnataka-infra
docker-compose up -d
```

## Stopping Services
```bash
docker-compose down
```

## Viewing Logs
```bash
docker-compose logs -f strapi
docker-compose logs -f postgres
```

## Backup & Recovery

### Manual Backup
```bash
./scripts/backup-database.sh
```

### Restore from Backup
```bash
gunzip < backups/newskarnataka_20240101_020000.sql.gz | psql -h 103.191.208.235 -U news newskarnataka
```

## Monitoring

### Check Service Health
```bash
docker-compose ps
```

### View Database Metrics
```bash
# Open Prometheus: http://localhost:9090
# Open Grafana: http://localhost:3000
```

## Troubleshooting

### Database Connection Issues
1. Check VPN connection
2. Verify .env credentials
3. Test connectivity: `psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"`
4. Check firewall: `nc -zv 103.191.208.235 5432`

### Strapi Won't Start
1. Check logs: `docker-compose logs strapi`
2. Verify database is running: `docker-compose ps postgres`
3. Check .env file: `cat .env | grep DATABASE`
4. Restart: `docker-compose restart strapi`

### High Memory Usage
1. Check resource usage: `docker stats`
2. Review logs for memory leaks
3. Restart affected service
4. Increase container limits in docker-compose.yml
EOF

git add docs/
git commit -m "docs: Add operations runbook"
```

### Create Troubleshooting Guide

```bash
cat > docs/TROUBLESHOOTING.md << 'EOF'
# Troubleshooting Guide

## Common Issues

### Issue: "Connection refused" when connecting to database

**Cause:** Database server not reachable

**Solution:**
1. Check VPN connection: `ping 103.191.208.235`
2. Check firewall: `nc -zv 103.191.208.235 5432`
3. Verify credentials in .env
4. Ask Team Lead for network access

### Issue: Strapi container keeps restarting

**Cause:** Database connection failure

**Solution:**
1. Check Strapi logs: `docker-compose logs strapi`
2. Verify .env DATABASE_URL
3. Wait 30 seconds and check if database is ready
4. Restart: `docker-compose restart strapi`

### Issue: Out of disk space

**Cause:** Volumes growing too large

**Solution:**
1. Check disk usage: `df -h`
2. Clean Docker: `docker system prune`
3. Review volume sizes: `docker inspect`
4. Archive old data if needed

### Issue: High CPU usage

**Cause:** Queries running slowly or too many connections

**Solution:**
1. Check active queries: `docker-compose exec postgres psql -U news -d newskarnataka -c "SELECT * FROM pg_stat_activity;"`
2. Check slow query log
3. Review database indexes
4. Kill long-running queries if needed

### Issue: Redis connection issues

**Cause:** Redis server not responding

**Solution:**
1. Restart Redis: `docker-compose restart redis`
2. Check Redis logs: `docker-compose logs redis`
3. Verify port 6379 is available
4. Check firewall rules
EOF

git add docs/
git commit -m "docs: Add troubleshooting guide"
```

### Team Training Session

```bash
# Friday 2:00 PM - 5:00 PM: Team Training

# Topics to cover:
# 1. Docker Compose basics
#    - Starting/stopping services
#    - Viewing logs
#    - Scaling containers

# 2. Database management
#    - Connecting to database
#    - Backup/restore procedures
#    - Performance monitoring

# 3. Monitoring & alerting
#    - Prometheus dashboards
#    - Grafana setup
#    - Alert configuration

# 4. Deployment process
#    - GitHub Actions workflow
#    - Manual deployment script
#    - Rollback procedures

# 5. Troubleshooting
#    - Common issues & solutions
#    - Escalation path
#    - Emergency contacts

# 6. On-call rotation
#    - Schedule for next 2 weeks
#    - Emergency procedures
#    - Communication protocols
```

---

## EOD FRIDAY: VERIFICATION & COMMIT

```bash
# 1. Verify all systems operational
docker-compose ps

# Expected: All services "Up"

# 2. Test database
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# 3. Test backup
./scripts/backup-database.sh

# 4. Verify monitoring
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000

# 5. Commit & push
git add .
git commit -m "feat: Add monitoring, backup, and CI/CD setup"
git push origin feature/docker-infrastructure

# 6. Create Pull Request

# 7. Post in #team-devops
"""
✅ Sprint 1 DevOps Complete!

Deliverables:
✅ Docker Compose stack operational
✅ All services running (Strapi, PostgreSQL, Redis, pgAdmin)
✅ Team connectivity verified (all 3 engineers)
✅ Database gating passed
✅ Monitoring & dashboards active
✅ Backup automation configured
✅ CI/CD pipeline ready
✅ Documentation & runbooks created

Infrastructure ready for production deployment!
"""
```

---

## DAILY STANDUP TEMPLATE

**When:** 9:00 AM - 9:15 AM  
**Where:** Zoom link in Slack  
**Report In:** #daily-standup channel

```
🟢 Team C - DevOps Status

Yesterday (Mon):
✅ Docker images built
✅ All services running
✅ Team members connected to database
✅ Monitoring configured

Today (Tue):
🎯 Verify all team members connected to database
🎯 Configure connection pooling
🎯 Establish performance baseline

Blockers:
❌ None currently

Wins:
🎉 All Docker services running without issues!
```

---

## IMPORTANT COMMANDS

```bash
# Docker
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose ps                 # List running containers
docker-compose logs -f strapi     # View Strapi logs
docker exec -it [container] bash  # Access container shell

# Database
psql -h 103.191.208.235 -U news -d newskarnataka  # Connect to DB
\dt                               # List tables (in psql)
\di                               # List indexes (in psql)

# Backup
./scripts/backup-database.sh      # Create backup
gunzip < backup.sql.gz | psql     # Restore backup

# AWS (if using)
aws ec2 describe-instances        # List EC2 instances
aws rds describe-db-instances     # List RDS databases
aws s3 ls s3://bucket-name        # List S3 files
```

---

## FREQUENTLY ASKED QUESTIONS

**Q: How do I start the development environment?**
A:
```bash
cd ~/newskarnataka-infra
docker-compose up -d
```

**Q: How do I check if all services are running?**
A:
```bash
docker-compose ps
```

**Q: How do I view logs for a specific service?**
A:
```bash
docker-compose logs -f [service-name]  # e.g., strapi, postgres, redis
```

**Q: How do I connect to the production database?**
A:
```bash
psql -h 103.191.208.235 -U news -d newskarnataka -W
# Enter password: news321
```

**Q: How do I create a backup?**
A:
```bash
./scripts/backup-database.sh
```

**Q: How do I restore from a backup?**
A:
```bash
gunzip < /backups/newskarnataka_20240101_020000.sql.gz | psql -h 103.191.208.235 -U news newskarnataka
```

**Q: How do I deploy changes to production?**
A:
```bash
./scripts/deploy.sh production
```

**Q: What if Docker won't start?**
A:
- On Windows: Restart Docker Desktop app
- On macOS/Linux: `sudo systemctl restart docker`

---

## SUCCESS CHECKLIST

By Friday EOD, you should have:

- [ ] Docker Compose stack fully operational
- [ ] All services running (Strapi, PostgreSQL, Redis, pgAdmin)
- [ ] All 3 team members connected to database
- [ ] Connection pooling configured
- [ ] Monitoring & dashboards active
- [ ] Backup automation tested
- [ ] Disaster recovery plan validated
- [ ] CI/CD pipeline configured
- [ ] GitHub Actions workflows active
- [ ] Deployment scripts functional
- [ ] Runbook & troubleshooting guide created
- [ ] Team trained on operations
- [ ] All PRs reviewed and merged

---

## NEXT STEPS (AFTER SPRINT 1)

- Sprint 2: Deploy to AWS staging environment
- Sprint 2: Configure load balancing & auto-scaling
- Sprint 3: Implement monitoring alerts & escalation
- Sprint 4: Conduct load testing (100K concurrent users)
- Sprint 5: Production hardening & security audit

---

**Questions?** Ask in #team-devops Slack channel.

**Let's build something great!** 🚀


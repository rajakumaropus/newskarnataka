# 🚀 TEAM C: IMMEDIATE EXECUTION GUIDE
## DevOps - Docker Infrastructure & Operations

**Timeline:** Monday Afternoon - Friday EOD (Sprint 1)  
**Mission:** Build Docker stack, verify infrastructure, enable all teams  
**Target:** Operational containerized infrastructure with monitoring

---

## 🎯 MONDAY AFTERNOON EXECUTION (1:30 PM - 5:00 PM)

### PHASE 1: Docker Stack Build (1:30 PM - 3:00 PM)

**Step 1: Copy Docker Compose Configuration**
```bash
# Get docker-compose.yml from:
# File: d:\Personal\Kiro\KeralaNews\docker-compose.yml

# Place it in your workspace
cp [path]/docker-compose.yml ~/newskarnataka-infra/

# Verify
ls -la docker-compose.yml
```

**Step 2: Create .env File**
```bash
# Create environment configuration
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
```

**Step 3: Create Volume Directories**
```bash
# Create volumes for persistent data
mkdir -p volumes/{postgres,redis,pgadmin,strapi}

# Set permissions (Windows just creates them)
chmod 755 volumes/*
```

**Step 4: Build Docker Images**
```bash
# Build all images from docker-compose.yml
docker-compose build

# Expected output:
# Building strapi ... done
# Building postgres ... done
# Building redis ... done
# Building pgadmin ... done

# Verify images built
docker images | grep newskarnataka
```

**Expected by 3:00 PM:**
- ✅ docker-compose.yml in place
- ✅ .env configured
- ✅ Volume directories created
- ✅ All images built successfully

---

### PHASE 2: Services Startup & Verification (3:00 PM - 4:00 PM)

**Step 1: Start All Services**
```bash
# Start all services
docker-compose up -d

# Expected: "done"

# Verify services running
docker-compose ps

# Expected output:
# NAME                 STATUS      PORTS
# newskarnataka-strapi    Up          0.0.0.0:1337->1337/tcp
# newskarnataka-postgres  Up          5432/tcp
# newskarnataka-redis     Up          6379/tcp
# newskarnataka-pgadmin   Up          0.0.0.0:5050->80/tcp
```

**Step 2: Verify Each Service**

**PostgreSQL:**
```bash
# Test database connectivity
docker-compose exec postgres psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Expected: (1 row) 1
```

**Strapi:**
```bash
# Test Strapi API
curl http://localhost:1337/admin

# Expected: HTML response (Strapi admin page)
```

**Redis:**
```bash
# Test Redis
docker-compose exec redis redis-cli ping

# Expected: PONG
```

**pgAdmin:**
```bash
# Open browser to: http://localhost:5050
# Login: admin@newskarnataka.com / admin123
# You should see pgAdmin interface
```

**Expected by 4:00 PM:**
- ✅ All services running
- ✅ PostgreSQL responding
- ✅ Strapi accessible
- ✅ Redis operational
- ✅ pgAdmin connected

---

### PHASE 3: Team Connectivity Verification & EOD (4:00 PM - 5:00 PM)

**Step 1: Test Team Connectivity**

Each team member should verify:
```bash
# Test database from own machine
$env:PGPASSWORD="news321"
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Expected: (1 row) 1

# Each person posts in Slack:
# "✅ [Your Name] - Connected to database"
```

**Step 2: Document Infrastructure Status**
```bash
# Create status file
docker-compose ps > infrastructure-status.txt

# Capture output
cat infrastructure-status.txt

# Screenshot showing all services running
```

**Step 3: Initialize Git**
```bash
# Initialize Git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
.env
.env.local
volumes/
docker-compose.override.yml
EOF

# Initial commit
git add .
git commit -m "feat: Add Docker Compose infrastructure stack"

# Add remote
git remote add origin https://github.com/newskarnataka/newskarnataka-infra.git

# Create feature branch
git checkout -b feature/docker-infrastructure

# Push to GitHub
git push -u origin feature/docker-infrastructure
```

**Step 4: Post EOD Status**
```
Post in #team-devops and #daily-standup:

✅ Team C - Monday EOD Report

Infrastructure Status:
✅ Docker images built
✅ All services running:
   - Strapi (localhost:1337)
   - PostgreSQL (103.191.208.235:5432)
   - Redis (localhost:6379)
   - pgAdmin (localhost:5050)

Team Connectivity:
✅ Dev 1: Connected
✅ Dev 2: Connected
✅ Dev 3: Connected
✅ All teams: Verified

Network:
✅ Database accessible
✅ Services responsive
✅ All systems healthy

Next (Tuesday):
🎯 Gate #1: All 10 developers connected
🎯 Connection pooling optimization
🎯 Performance baseline

Blockers: NONE ✅
```

---

## 📋 TUESDAY - GATE #1 EXECUTION

### Monitor & Support All Teams Connecting

**Your Role:**
```bash
# Monitor all connections
psql -h 103.191.208.235 -U news -d newskarnataka << 'EOF'
SELECT 
  datname,
  usename,
  count(*) as connections
FROM pg_stat_activity
GROUP BY datname, usename
ORDER BY connections DESC;
EOF

# Expected: Should see connections from all team members

# Verify connection pooling
psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT count(*) as active_connections FROM pg_stat_activity 
WHERE datname='newskarnataka';
"

# Expected: 5-20 connections active
```

**Provide Support:**
- Troubleshoot any connection issues
- Verify firewall/network access
- Help with .env configuration
- Monitor performance baseline

**Gate #1 Success Criteria (All MUST verify):**
- [ ] All 10 developers connected
- [ ] Connection pooling: 5-20 connections
- [ ] Performance baseline: <100ms
- [ ] Zero connection errors
- [ ] Docker stack stable

**Post in #database-sync:**
```
✅ GATE #1 PASSED - Infrastructure Connectivity

Docker Services: Running ✅
Connected Developers: 10/10 ✅
Connection Pool: 5-20 ✅
Response Time: <100ms ✅
Errors: 0 ✅

Infrastructure ready for Sprint 1
```

---

## 📋 WEDNESDAY-FRIDAY OPERATIONS

### Wednesday: Database Performance Monitoring

```bash
# Establish baseline metrics
psql -h 103.191.208.235 -U news -d newskarnataka << 'EOF'
SELECT version();
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) 
FROM pg_database 
WHERE datname = 'newskarnataka';
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema='public';
EOF

# Document results for comparison
```

### Thursday: Backup & Disaster Recovery Testing

```bash
# Create backup script (if not exists)
cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DB_NAME="newskarnataka"
DB_USER="news"
DB_HOST="103.191.208.235"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/newskarnataka_$TIMESTAMP.sql.gz"

pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

if [ -f "$BACKUP_FILE" ]; then
  echo "✓ Backup created: $BACKUP_FILE"
else
  echo "✗ Backup failed!"
  exit 1
fi
EOF

chmod +x scripts/backup-database.sh

# Test backup
./scripts/backup-database.sh

# Verify backup created
ls -lah backups/
```

### Friday: Infrastructure Verification & Documentation

```bash
# Final verification
docker-compose ps
docker-compose logs --tail=20

# Document operational status
cat > OPERATIONS_STATUS.md << 'EOF'
# Sprint 1 Operations Status

## Services Running
- ✅ Strapi (localhost:1337)
- ✅ PostgreSQL (103.191.208.235:5432)
- ✅ Redis (localhost:6379)
- ✅ pgAdmin (localhost:5050)

## Performance
- Database: <100ms queries
- API: <200ms response
- Uptime: 99.9%

## Backup
- Automated backups: Configured
- Recovery tested: Yes
- RTO: <30 minutes
- RPO: <1 hour

## Team Status
- All developers: Connected
- All teams: Productive
- Zero issues: 0

## Next (Sprint 2)
- AWS environment setup
- Production deployment planning
- Load testing preparation
EOF

# Commit final status
git add .
git commit -m "docs: Add sprint 1 operations status"
git push origin feature/docker-infrastructure
```

---

## 🎯 SPRINT 1 DELIVERABLES CHECKLIST

### By Friday 5:00 PM (All MUST be complete)

- [ ] **Docker Infrastructure**
  - [ ] docker-compose.yml configured
  - [ ] All images built
  - [ ] All services running

- [ ] **Services Operational**
  - [ ] Strapi running
  - [ ] PostgreSQL connected
  - [ ] Redis operational
  - [ ] pgAdmin accessible

- [ ] **Team Support**
  - [ ] All 10 developers connected
  - [ ] Connection pooling verified
  - [ ] Performance baseline established
  - [ ] Zero connection issues

- [ ] **Operations**
  - [ ] Monitoring active
  - [ ] Backup scripts created
  - [ ] Disaster recovery tested
  - [ ] Documentation complete

- [ ] **Version Control**
  - [ ] GitHub repository ready
  - [ ] Infrastructure code versioned
  - [ ] PRs submitted & reviewed

---

## 📞 CRITICAL OPERATIONS

### If Services Go Down

```bash
# Restart all services
docker-compose restart

# Or complete restart
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs strapi
docker-compose logs postgres
```

### If Database Connection Fails

```bash
# Verify database accessibility
ping 103.191.208.235
Test-NetConnection -ComputerName 103.191.208.235 -Port 5432

# Check credentials
psql -h 103.191.208.235 -U news -d newskarnataka -W

# Verify firewall
# Check Windows Firewall or VPN requirements
```

### If Team Can't Connect

```bash
# Provide support:
# 1. Verify their .env file
# 2. Check their network connection
# 3. Test from their machine
# 4. Escalate to tech lead if needed
```

---

## 🎯 SUCCESS DEFINITION

**Sprint 1 is successful when:**
- ✅ Docker stack fully operational
- ✅ All 10 developers connected
- ✅ Infrastructure stable
- ✅ Zero critical issues
- ✅ Team trained on operations
- ✅ Documentation complete
- ✅ Ready for Sprint 2

---

## 🚀 YOU'VE GOT THIS!

**Infrastructure = Foundation for everything**

**Monday afternoon → Friday EOD = Production-ready Docker infrastructure**

**Let's build!** 💪

---

*Team C Execution Guide*  
*Sprint 1 DevOps Implementation*  
*Docker + Infrastructure Operations*


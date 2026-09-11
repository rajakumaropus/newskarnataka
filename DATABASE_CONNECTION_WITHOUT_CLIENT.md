# 🐳 PostgreSQL Connection via Docker
## Temporary Workaround Until PostgreSQL Client is Installed

**Status:** Alternative method while PostgreSQL client installation is in progress  
**Platform:** Windows with Docker installed ✅  
**Timeline:** Works immediately (no additional installation)

---

## QUICK START: Connect to Database via Docker

### Method 1: Simple Docker Connection (Fastest)

```powershell
# Set password as environment variable (for use in command)
$env:PGPASSWORD="news321"

# Connect to production database
docker run --rm -it postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka

# Expected: PostgreSQL prompt (newskarnataka=#)
```

### Method 2: Test Connection with Single Query

```powershell
# Test if database is accessible
docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1 as connection_test;"

# Expected output:
# connection_test
# ----------------
#              1
# (1 row)
```

### Method 3: Get Database Version

```powershell
docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT version();"
```

### Method 4: List All Tables (Schema Verification)

```powershell
docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "\dt"
```

---

## DETAILED CONNECTION TESTS

### Test 1: Network Connectivity

```powershell
# Ping the database server
ping 103.191.208.235

# Expected: Receiving packets from 103.191.208.235
```

**If ping fails:**
- Check VPN connection
- Check firewall settings
- Ask Team Lead for network access

---

### Test 2: Port Accessibility (Port 5432)

```powershell
# Test if port 5432 is accessible
Test-NetConnection -ComputerName 103.191.208.235 -Port 5432

# Expected: 
# TcpTestSucceeded : True
# PingSucceeded    : True
```

**If port test fails:**
- Firewall may be blocking port 5432
- Ask Team C for firewall rules
- May need VPN configuration

---

### Test 3: Database Connection via Docker

```powershell
# Set password
$env:PGPASSWORD="news321"

# Try to connect
docker run --rm postgres:14 psql `
  -h 103.191.208.235 `
  -U news `
  -d newskarnataka `
  -c "SELECT 1;"

# Expected: (1 row) with value 1
```

**If connection fails:**
- Check credentials (user: news, password: news321, database: newskarnataka)
- Verify host is accessible: ping 103.191.208.235
- Check firewall for port 5432
- Ask Team B for database access

---

### Test 4: Get Connection Information

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT 
  current_database() as database_name,
  current_user as connected_user,
  inet_server_addr() as server_address,
  version() as postgresql_version;
"
```

**Expected output:**
```
 database_name | connected_user |   server_address    | postgresql_version
---------------+----------------+---------------------+--------------------
 newskarnataka | news           | 103.191.208.235     | PostgreSQL 14.x ...
(1 row)
```

---

### Test 5: Count Existing Tables

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema='public';
"
```

**Expected output:**
- If database is empty: table_count = 0
- If Strapi initialized: table_count = 40+
- If schema created: table_count = 30+

---

### Test 6: Verify Connection Pool

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT count(*) as active_connections FROM pg_stat_activity 
WHERE datname='newskarnataka';
"
```

---

### Test 7: Check Database Size

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "
SELECT pg_size_pretty(pg_database_size(current_database())) as database_size;
"
```

---

### Test 8: List All Schemas

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "\dn"
```

---

## COMPREHENSIVE TEST SCRIPT

Create this PowerShell script and save as `test-db-connection.ps1`:

```powershell
# Database Connection Test Script via Docker
# Usage: .\test-db-connection.ps1

$ErrorActionPreference = "Stop"
$dbHost = "103.191.208.235"
$dbPort = "5432"
$dbUser = "news"
$dbPassword = "news321"
$dbName = "newskarnataka"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Connection Test via Docker" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Docker available
Write-Host "Test 1: Checking Docker availability..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not available" -ForegroundColor Red
    exit 1
}

# Test 2: Network connectivity
Write-Host "Test 2: Testing network connectivity to $dbHost..." -ForegroundColor Yellow
$ping = Test-NetConnection -ComputerName $dbHost -ErrorAction SilentlyContinue
if ($ping.PingSucceeded) {
    Write-Host "✅ Server is reachable" -ForegroundColor Green
} else {
    Write-Host "❌ Server is not reachable" -ForegroundColor Red
    Write-Host "   (This may be normal if VPN is required)" -ForegroundColor Yellow
}

# Test 3: Port accessibility
Write-Host "Test 3: Testing port $dbPort accessibility..." -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName $dbHost -Port $dbPort -ErrorAction SilentlyContinue
if ($portTest.TcpTestSucceeded) {
    Write-Host "✅ Port $dbPort is accessible" -ForegroundColor Green
} else {
    Write-Host "⚠️  Port $dbPort may be blocked (check firewall)" -ForegroundColor Yellow
}

# Test 4: Database connection
Write-Host "Test 4: Testing database connection..." -ForegroundColor Yellow
$env:PGPASSWORD = $dbPassword
try {
    $result = docker run --rm postgres:14 psql `
        -h $dbHost `
        -U $dbUser `
        -d $dbName `
        -c "SELECT 1 as connection_test;" 2>&1
    
    if ($result -match "1") {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
        Write-Host "   Output: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Database connection error: $_" -ForegroundColor Red
}

# Test 5: Get database version
Write-Host "Test 5: Retrieving database version..." -ForegroundColor Yellow
try {
    $version = docker run --rm postgres:14 psql `
        -h $dbHost `
        -U $dbUser `
        -d $dbName `
        -t -c "SELECT version();" 2>&1
    
    if ($version -match "PostgreSQL") {
        Write-Host "✅ PostgreSQL version: $($version.Trim())" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not retrieve version" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error retrieving version: $_" -ForegroundColor Red
}

# Test 6: Count tables
Write-Host "Test 6: Counting tables in database..." -ForegroundColor Yellow
try {
    $tableCount = docker run --rm postgres:14 psql `
        -h $dbHost `
        -U $dbUser `
        -d $dbName `
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>&1
    
    $count = [int]$tableCount.Trim()
    if ($count -eq 0) {
        Write-Host "⚠️  Database has no tables (normal for fresh database)" -ForegroundColor Yellow
    } elseif ($count -gt 30) {
        Write-Host "✅ Database initialized with $count tables (schema created)" -ForegroundColor Green
    } else {
        Write-Host "✅ Database has $count tables" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error counting tables: $_" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Connection Test Complete" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If all tests passed → ready for development" -ForegroundColor Green
Write-Host "2. If port test failed → check firewall/VPN" -ForegroundColor Yellow
Write-Host "3. If connection failed → verify credentials" -ForegroundColor Yellow
Write-Host "4. Install PostgreSQL Client for direct access" -ForegroundColor Cyan
```

**Run the script:**
```powershell
.\test-db-connection.ps1
```

---

## RUNNING SQL QUERIES VIA DOCKER

### Execute Single Query

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "
  SELECT COUNT(*) as row_count FROM information_schema.tables;
"
```

### Execute Multiple Queries

```powershell
$env:PGPASSWORD="news321"

docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka << 'SQL'
SELECT version();
SELECT COUNT(*) FROM information_schema.tables;
SELECT COUNT(*) FROM pg_stat_activity;
SQL
```

### Execute Query from File

```powershell
# Create a SQL file
@"
SELECT 
  current_database() as db,
  current_user as user,
  version() as version;
"@ | Out-File -FilePath "query.sql" -Encoding UTF8

# Execute it
$env:PGPASSWORD="news321"
docker run --rm -v ${PWD}:/tmp postgres:14 psql `
  -h 103.191.208.235 `
  -U news `
  -d newskarnataka `
  -f /tmp/query.sql
```

---

## INTERACTIVE DATABASE SHELL VIA DOCKER

### Connect Interactively

```powershell
$env:PGPASSWORD="news321"

docker run --rm -it postgres:14 psql `
  -h 103.191.208.235 `
  -U news `
  -d newskarnataka
```

**You'll get the PostgreSQL prompt:**
```
newskarnataka=#
```

**Now you can run SQL commands:**
```sql
-- List all tables
\dt

-- List all schemas
\dn

-- Show table structure
\d tablename

-- Execute queries
SELECT * FROM information_schema.tables LIMIT 5;

-- Exit
\q
```

---

## WHEN TO USE THIS METHOD

### Use Docker Connection When:
- ✅ PostgreSQL Client not yet installed
- ✅ Quick testing needed
- ✅ Ad-hoc query execution
- ✅ Pre-Sprint 1 connectivity verification
- ✅ Testing before installing client

### Use Native PostgreSQL Client When:
- ✅ PostgreSQL Client installed (preferred)
- ✅ Frequent queries
- ✅ Better performance needed
- ✅ Development workflow
- ✅ Sprint 1 active

---

## SETUP DOCKER CONNECTION PERMANENTLY

### Create PowerShell Alias for Quick Access

```powershell
# Add this to your PowerShell profile ($PROFILE)
# To find profile location: $PROFILE
# To edit: code $PROFILE

function psql-docker {
    param(
        [string]$Query = "",
        [switch]$Interactive
    )
    
    $env:PGPASSWORD = "news321"
    
    if ($Interactive) {
        docker run --rm -it postgres:14 psql `
            -h 103.191.208.235 `
            -U news `
            -d newskarnataka
    } else {
        docker run --rm postgres:14 psql `
            -h 103.191.208.235 `
            -U news `
            -d newskarnataka `
            -c $Query
    }
}

# Usage:
# psql-docker "SELECT version();"        # Run query
# psql-docker -Interactive               # Interactive mode
```

---

## TROUBLESHOOTING DOCKER CONNECTION

### Issue: "docker: command not found"
**Solution:** Docker not installed or not in PATH
```powershell
docker --version  # Verify Docker is installed
```

### Issue: "authentication failed"
**Solution:** Wrong password
```powershell
# Verify credentials
# Host:     103.191.208.235
# User:     news
# Password: news321
# Database: newskarnataka
```

### Issue: "server is not accessible"
**Solution:** Network issues
```powershell
ping 103.191.208.235
Test-NetConnection -ComputerName 103.191.208.235 -Port 5432
```

### Issue: "docker: dial tcp: i/o timeout"
**Solution:** Connection timeout
- Check if VPN is required
- Check firewall settings
- Wait a moment and retry

---

## COMPARISON: Docker vs Native Client

| Aspect | Docker Method | Native PostgreSQL Client |
|--------|---------------|--------------------------|
| Installation | Already have Docker ✅ | Need to install (~5 min) |
| Performance | Slower (Docker overhead) | Fast (direct) |
| Interactive Use | Works but slower | Better experience |
| Queries | Works fine | Works fine |
| Connection | Via Docker container | Direct connection |
| Recommended | Temporary/testing | Development/daily use |

---

## NEXT STEPS

### Immediate (Today):
1. Use Docker method to test connectivity
2. Run the test script above
3. Verify you can connect

### Before Monday 9 AM:
1. Install PostgreSQL Client (5 min)
2. Test with native client
3. Ready for Sprint 1

---

## SUMMARY

**You can connect to PostgreSQL RIGHT NOW using Docker without any additional installation.**

```powershell
# Test connectivity immediately:
$env:PGPASSWORD="news321"
docker run --rm postgres:14 psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"
```

**But for best experience during Sprint 1, install PostgreSQL Client before Monday.**

---

**Ready to test? Run the command above now!** 🚀


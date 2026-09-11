# 💻 DEVELOPMENT SETUP - PRIVATE WINDOWS SERVERS
## NewsKarnataka.com Development Environment

**Purpose:** Local development for teams before AWS production  
**Infrastructure:** Private Windows servers (not public cloud)  
**Benefits:** Cost-effective, full control, no internet egress charges  
**Timeline:** Setup in 1-2 days  

---

## 🎯 ADVANTAGES OF PRIVATE WINDOWS SERVERS (For Development)

### Cost Benefits
✅ **No cloud egress charges** - Data stays on local network  
✅ **No per-instance fees** - One-time server purchase  
✅ **No data transfer costs** - Between services is free  
✅ **Estimated savings:** ₹2-3L over 3 months vs AWS

### Performance Benefits
✅ **Lower latency** - Local network (1-5ms vs 10-50ms)  
✅ **Faster deployments** - No internet dependency  
✅ **Unlimited bandwidth** - LAN speeds (1Gbps+)  
✅ **Full control** - Direct access to OS

### Control & Security Benefits
✅ **No external access needed** - Secure by default  
✅ **Full admin access** - Can install anything  
✅ **Network isolation** - Complete privacy  
✅ **No subscription dependency** - Own the hardware  

---

## 📊 RECOMMENDED PRIVATE WINDOWS SERVER SETUP

### Server Specifications (For Team of 10)

#### **Server 1: Database & Cache Server**
```
OS: Windows Server 2022
CPU: 8-core (Intel Xeon / AMD EPYC)
RAM: 64GB
Storage: 2TB SSD (for PostgreSQL + backups)
Network: 1Gbps Ethernet
```

**Services:**
- PostgreSQL 15 (database)
- Redis 7 (cache)
- pgAdmin 4 (admin UI)

#### **Server 2: Backend/API Server**
```
OS: Windows Server 2022
CPU: 8-core
RAM: 32GB
Storage: 500GB SSD
Network: 1Gbps Ethernet
```

**Services:**
- Docker Desktop (for Strapi container)
- Node.js v20+
- npm registry cache (Verdaccio)

#### **Server 3: Frontend/CDN Server**
```
OS: Windows Server 2022
CPU: 4-core
RAM: 16GB
Storage: 500GB SSD
Network: 1Gbps Ethernet
```

**Services:**
- IIS (local web server)
- Node.js v20+
- Nginx (reverse proxy)

#### **Workstations: Developer Machines** (10x)
```
OS: Windows 10/11 Pro
CPU: 6-core minimum
RAM: 16GB minimum
Storage: 512GB SSD
Tools: VS Code, Git, Docker Desktop
```

---

## 🔧 INSTALLATION & SETUP GUIDE

### Step 1: Prepare Private Network

```
Network Setup:
├── Private IP Range: 192.168.1.0/24
├── Gateway: 192.168.1.1 (Router/Switch)
├── DHCP Range: 192.168.1.100-200
│
├── Server 1 (Database): 192.168.1.10
├── Server 2 (Backend): 192.168.1.11
├── Server 3 (Frontend): 192.168.1.12
│
└── Workstations: 192.168.1.101-110
```

**Configuration:**
1. [ ] Connect all servers to same network switch
2. [ ] Assign static IPs to servers
3. [ ] Configure firewall (allow internal traffic only)
4. [ ] Test connectivity: `ping 192.168.1.10`

---

### Step 2: Server 1 Setup (Database & Cache)

#### 2.1 Install Windows Server 2022

```powershell
# Download from Microsoft evaluation center (180-day trial)
# Or use existing Windows Server license

# Post-installation
# 1. Enable Remote Desktop
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -name "fDenyTSConnections" -Value 0

# 2. Configure static IP
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.10 -PrefixLength 24 -DefaultGateway 192.168.1.1

# 3. Configure DNS
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("8.8.8.8", "8.8.4.4")
```

#### 2.2 Install PostgreSQL 15

```powershell
# Download PostgreSQL Windows installer
# https://www.postgresql.org/download/windows/

# Or use Chocolatey
choco install postgresql15 --params '/Password:StrongPassword123!'

# Start service
Start-Service -Name postgresql-x64-15

# Verify
psql --version
```

**PostgreSQL Configuration:**

```bash
# Connect as postgres user
psql -U postgres

# Create database & user
CREATE DATABASE newskarnataka;
CREATE USER news WITH PASSWORD 'news321';
ALTER ROLE news SET client_encoding TO 'utf8';
ALTER ROLE news SET default_transaction_isolation TO 'read committed';
ALTER ROLE news SET default_transaction_deferrable TO on;
ALTER ROLE news SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE newskarnataka TO news;

# Verify
\l  # List databases
\du # List users
```

**Connection String:**
```
postgresql://news:news321@192.168.1.10:5432/newskarnataka
```

#### 2.3 Install Redis 7

```powershell
# Install via Chocolatey
choco install redis-64

# Or download from:
# https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server.exe

# Test connection (in another PowerShell)
redis-cli.exe
> PING
PONG
```

**Redis Configuration:**

```bash
# File: C:\Program Files\Redis\redis.windows.conf

# Set password
requirepass redis_password_123

# Bind to network interface
bind 192.168.1.10
port 6379

# Save and restart
redis-server --service-restart
```

**Connection String:**
```
redis://192.168.1.10:6379?password=redis_password_123
```

#### 2.4 Install pgAdmin 4

```powershell
# Download pgAdmin from https://www.pgadmin.org/download/pgadmin-4-windows/

# Run installer and complete setup

# Access via browser:
# http://192.168.1.10:80/pgadmin4
```

---

### Step 3: Server 2 Setup (Backend/API)

#### 3.1 Install Docker Desktop for Windows

```powershell
# Download Docker Desktop for Windows
# https://www.docker.com/products/docker-desktop

# Or use Chocolatey
choco install docker-desktop

# Enable Hyper-V (if needed)
Enable-WindowsOptionalFeature -Online -FeatureName Hyper-V

# Verify installation
docker --version
docker ps
```

#### 3.2 Configure Docker for Private Network

```powershell
# Create custom Docker network
docker network create newskarnataka-network --driver bridge

# Verify
docker network ls
```

#### 3.3 Deploy Strapi Container

```powershell
# Build Strapi image (from newskarnataka-cms directory)
cd C:\path\to\newskarnataka-cms
docker build -t newskarnataka-cms:latest .

# Create .env file for development
$env_content = @"
DATABASE_CLIENT=postgres
DATABASE_HOST=192.168.1.10
DATABASE_PORT=5432
DATABASE_NAME=newskarnataka
DATABASE_USERNAME=news
DATABASE_PASSWORD=news321
DATABASE_SSL=false

REDIS_HOST=192.168.1.10
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123

JWT_SECRET=dev-secret-key-12345-change-in-prod
ADMIN_JWT_SECRET=dev-admin-secret-12345-change-in-prod
NODE_ENV=development

URL=http://192.168.1.11:1337
ADMIN_PATH=/admin

LOG_LEVEL=debug
"@

# Write to file
$env_content | Out-File -FilePath C:\strapi\.env -Encoding UTF8

# Run Strapi container
docker run -d `
  --name newskarnataka-cms `
  --network newskarnataka-network `
  -p 1337:1337 `
  --env-file C:\strapi\.env `
  -v C:\strapi\src:/app/src `
  -v C:\strapi\config:/app/config `
  newskarnataka-cms:latest

# Verify
docker ps
docker logs newskarnataka-cms

# Access Strapi
# http://192.168.1.11:1337
# http://192.168.1.11:1337/admin
```

#### 3.4 Install Node.js & npm

```powershell
# Download from https://nodejs.org/ (LTS version)
# Or use Chocolatey
choco install nodejs

# Verify
node --version
npm --version

# Create npm cache directory for faster installs
npm config set registry https://registry.npmjs.org/
npm config set cache C:\npm-cache
```

---

### Step 4: Server 3 Setup (Frontend/CDN)

#### 4.1 Install Node.js

```powershell
choco install nodejs

# Verify
node --version
npm --version
```

#### 4.2 Install IIS (Internet Information Services)

```powershell
# Enable IIS feature
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer

# Enable additional modules for Node.js hosting
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebSockets
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpCompressionGzip
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpCompressionDynamic

# Start IIS
Start-Service -Name W3SVC
Start-Service -Name WAS
```

#### 4.3 Setup Reverse Proxy with IIS

```powershell
# Install URL Rewrite and Application Request Routing (ARR)
# Download from: https://www.iis.net/downloads/microsoft/url-rewrite

# Create IIS site
New-WebSite -Name "NewsKarnataka" `
  -Port 80 `
  -IPAddress 192.168.1.12 `
  -HostHeader "newskarnataka.local" `
  -PhysicalPath "C:\inetpub\newskarnataka" `
  -ApplicationPool "DefaultAppPool"

# Configure reverse proxy (web.config)
@"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="ReverseProxy" stopProcessing="true">
                    <match url="(.*)" />
                    <action type="Rewrite" url="http://192.168.1.11:1337/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
"@ | Out-File -FilePath "C:\inetpub\newskarnataka\web.config" -Encoding UTF8
```

#### 4.4 Deploy Frontend

```powershell
# Build frontend
cd C:\path\to\newskarnataka-frontend
npm run build

# Copy build to IIS
Copy-Item -Path "out\*" -Destination "C:\inetpub\newskarnataka" -Recurse -Force

# Configure Next.js static export
# Add to next.config.js:
# module.exports = {
#   output: 'export',
#   images: {
#     unoptimized: true
#   }
# }

# Build again
npm run build

# Access
# http://192.168.1.12
# http://newskarnataka.local (if DNS configured)
```

---

### Step 5: Developer Workstation Setup

#### 5.1 Install Development Tools

```powershell
# Install VS Code
choco install vscode

# Install Git
choco install git

# Install Node.js
choco install nodejs

# Install Docker Desktop
choco install docker-desktop

# Install PostgreSQL client tools
choco install postgresql-client

# Verify installations
code --version
git --version
node --version
npm --version
psql --version
```

#### 5.2 Configure Local Hosts File

```powershell
# Edit C:\Windows\System32\drivers\etc\hosts
# Add these lines:

192.168.1.12 newskarnataka.local
192.168.1.11 api.newskarnataka.local
192.168.1.10 db.newskarnataka.local
```

#### 5.3 Clone Repositories

```powershell
# Create development directory
mkdir C:\Dev\NewsKarnataka
cd C:\Dev\NewsKarnataka

# Clone frontend
git clone https://github.com/yourrepo/newskarnataka-frontend.git
cd newskarnataka-frontend
npm install

# Clone backend
git clone https://github.com/yourrepo/newskarnataka-cms.git
cd ../newskarnataka-cms
npm install

# Configure environment
@"
DATABASE_HOST=192.168.1.10
DATABASE_PORT=5432
DATABASE_NAME=newskarnataka
DATABASE_USERNAME=news
DATABASE_PASSWORD=news321
DATABASE_SSL=false

REDIS_HOST=192.168.1.10
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123

JWT_SECRET=dev-secret-key
URL=http://192.168.1.11:1337
CORS_ORIGIN=http://192.168.1.12

LOG_LEVEL=debug
NODE_ENV=development
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
```

#### 5.4 Start Development Servers

```powershell
# Terminal 1: Backend (Strapi)
cd C:\Dev\NewsKarnataka\newskarnataka-cms
npm run develop
# Strapi runs on http://localhost:1337

# Terminal 2: Frontend (Next.js)
cd C:\Dev\NewsKarnataka\newskarnataka-frontend
npm run dev
# Frontend runs on http://localhost:3000

# Terminal 3: Monitor logs
docker logs -f newskarnataka-cms
```

---

## 🌐 NETWORK CONFIGURATION

### Local Network Map

```
Internet (Optional - for npm registry)
    ↓
Private Network (192.168.1.0/24)
    ├── Router/Switch (192.168.1.1)
    │
    ├── Server 1: Database & Cache (192.168.1.10)
    │   ├── PostgreSQL 5432
    │   └── Redis 6379
    │
    ├── Server 2: Backend (192.168.1.11)
    │   ├── Strapi 1337
    │   └── Docker
    │
    ├── Server 3: Frontend (192.168.1.12)
    │   ├── IIS 80
    │   └── Nginx (reverse proxy)
    │
    └── Workstations 1-10 (192.168.1.101-110)
        └── VS Code, Docker, Git
```

### Firewall Configuration

```powershell
# Allow PostgreSQL (Server 1)
New-NetFirewallRule -DisplayName "PostgreSQL" `
  -Direction Inbound -Action Allow `
  -Protocol tcp -LocalPort 5432

# Allow Redis (Server 1)
New-NetFirewallRule -DisplayName "Redis" `
  -Direction Inbound -Action Allow `
  -Protocol tcp -LocalPort 6379

# Allow Strapi (Server 2)
New-NetFirewallRule -DisplayName "Strapi" `
  -Direction Inbound -Action Allow `
  -Protocol tcp -LocalPort 1337

# Allow IIS (Server 3)
New-NetFirewallRule -DisplayName "IIS" `
  -Direction Inbound -Action Allow `
  -Protocol tcp -LocalPort 80,443

# Allow RDP (Remote Desktop)
New-NetFirewallRule -DisplayName "RDP" `
  -Direction Inbound -Action Allow `
  -Protocol tcp -LocalPort 3389
```

---

## 📊 DEVELOPMENT WORKFLOWS

### Workflow 1: Local Development (Individual Developer)

```
Developer Workstation
├── VS Code (code editing)
├── Git (version control)
├── Local Frontend (npm run dev)
├── Docker (run Strapi locally)
└── Database connection (direct to Server 1)
```

**Steps:**
```bash
1. Start Strapi locally or connect to Server 2
2. Start Next.js dev server
3. Make code changes
4. Test locally at http://localhost:3000
5. Commit & push to Git
```

### Workflow 2: Integration Testing

```
Workstations → All connect to:
├── Server 1: Shared Database
├── Server 2: Shared Strapi Backend
└── Server 3: Shared Frontend
```

**Steps:**
```bash
1. Deploy latest code to servers
2. All developers connect to shared environment
3. Run integration tests
4. Verify all features working
5. Sign off for staging/production
```

### Workflow 3: Code Review & Testing

```
Developer A: Makes changes
    ↓
Push to Git branch
    ↓
Developer B: Reviews code
    ↓
Reviewer approves
    ↓
Merge to main
    ↓
Auto-deploy to Server 2
    ↓
QA team tests on Server 3
    ↓
Ready for production
```

---

## 🎯 TESTING SETUP

### Unit Testing (Local)

```powershell
# Frontend unit tests
cd newskarnataka-frontend
npm test

# Backend unit tests
cd ../newskarnataka-cms
npm test
```

### Integration Testing (Against Servers)

```bash
# From any workstation
# Test database connection
psql -h 192.168.1.10 -U news -d newskarnataka -c "SELECT 1;"

# Test API endpoint
curl http://192.168.1.11:1337/api/articles

# Test frontend
curl http://192.168.1.12/
```

### Performance Testing

```powershell
# Load test backend
# Download Apache JMeter or similar

# Test frontend performance
npm run lighthouse

# Database query performance
# Connect to pgAdmin and check query execution time
```

---

## 💾 BACKUP & DISASTER RECOVERY

### Database Backups

```powershell
# Automated daily backup
# Create scheduled task in Windows Task Scheduler

# Backup script (C:\backups\backup-postgres.bat)
@echo off
cd "C:\Program Files\PostgreSQL\15\bin"
pg_dump.exe -U news -d newskarnataka > C:\backups\newskarnataka-backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql
```

### Server Snapshots

```powershell
# For VM-based servers: Take snapshots
# If using Hyper-V:
Checkpoint-VM -Name "Database-Server" -SnapshotName "Daily-$(Get-Date -Format 'yyyy-MM-dd')"

# List snapshots
Get-VMSnapshot -VMName "Database-Server"

# Restore from snapshot
Restore-VMSnapshot -VMSnapshot <snapshot>
```

---

## 🔐 SECURITY CONSIDERATIONS

### For Development (Less Strict)

✅ **Local network only** - No internet exposure  
✅ **Shared credentials** - OK for dev  
✅ **No encryption** - Local traffic is safe  
✅ **Open firewall** - Only between servers  

### Before Moving to Production

❌ **DO NOT use development credentials in production**  
❌ **DO NOT expose servers to internet**  
❌ **DO NOT use HTTP (use HTTPS)**  
❌ **DO NOT keep backups on same server**  

```powershell
# Change passwords before production
ALTER USER news WITH PASSWORD 'NewStrongPassword123!';

# Enable SSL for PostgreSQL
# Edit postgresql.conf:
# ssl = on
# ssl_cert_file = 'C:\certs\server.crt'
# ssl_key_file = 'C:\certs\server.key'

# Generate SSL certificates for HTTPS
# Use Let's Encrypt or self-signed certs
```

---

## 📈 SCALING FROM DEVELOPMENT TO PRODUCTION

### Development (Current Setup)
- Private Windows servers
- 3 servers for DB/Backend/Frontend
- Local network only
- Development credentials

### Staging (Intermediate)
- AWS servers (t3.medium instances)
- Same architecture as prod
- Production data samples
- Production credentials (separate)

### Production (Final)
- AWS EC2 + RDS + ElastiCache
- Auto-scaling groups
- Multi-AZ for HA
- Encrypted credentials in Secrets Manager

**Migration Path:**
```
Private Servers (Dev)
    ↓ (Code is same)
AWS Staging (Same containers)
    ↓ (Load test, verify)
AWS Production (Scaled version)
```

---

## ✅ CHECKLIST FOR PRIVATE SERVER SETUP

### Pre-Setup
- [ ] 3 Windows Server 2022 machines available
- [ ] Network switch connecting all servers
- [ ] Static IPs planned (192.168.1.10-12)
- [ ] 10 developer workstations ready

### Server 1 (Database)
- [ ] Windows Server 2022 installed
- [ ] PostgreSQL 15 installed & running
- [ ] Redis 7 installed & running
- [ ] pgAdmin 4 accessible
- [ ] Backup scripts configured
- [ ] Firewall rules set

### Server 2 (Backend)
- [ ] Windows Server 2022 installed
- [ ] Docker Desktop installed
- [ ] Strapi container running
- [ ] Node.js v20+ installed
- [ ] Environment configured
- [ ] Health check passing

### Server 3 (Frontend)
- [ ] Windows Server 2022 installed
- [ ] Node.js v20+ installed
- [ ] IIS installed & configured
- [ ] Reverse proxy working
- [ ] Frontend deployed
- [ ] Static files serving

### Workstations (All 10)
- [ ] Windows 10/11 Pro
- [ ] VS Code installed
- [ ] Git installed
- [ ] Node.js v20+ installed
- [ ] Docker Desktop installed
- [ ] Repositories cloned
- [ ] Development environment ready

### Network
- [ ] All servers on same subnet
- [ ] Connectivity verified (ping tests)
- [ ] Firewall rules configured
- [ ] Hosts file updated
- [ ] DNS resolution working

---

## 📞 TROUBLESHOOTING

### PostgreSQL Connection Issues

```powershell
# Test connection
psql -h 192.168.1.10 -U news -d newskarnataka

# Check if running
Get-Service -Name postgresql-x64-15

# View logs
# C:\Program Files\PostgreSQL\15\data\pg_log\

# Restart
Restart-Service -Name postgresql-x64-15
```

### Docker Issues

```powershell
# Check container status
docker ps -a

# View container logs
docker logs newskarnataka-cms

# Restart container
docker restart newskarnataka-cms

# Rebuild image
docker build -t newskarnataka-cms:latest .
```

### Network Connectivity

```powershell
# Test ping
ping 192.168.1.10
ping 192.168.1.11
ping 192.168.1.12

# Test ports
Test-NetConnection -ComputerName 192.168.1.10 -Port 5432
Test-NetConnection -ComputerName 192.168.1.11 -Port 1337
Test-NetConnection -ComputerName 192.168.1.12 -Port 80
```

---

## 🎊 SUMMARY

**Private Windows Servers for Development:**
✅ **Cost:** 40-50% cheaper than AWS (for dev)  
✅ **Speed:** 5-10x faster deployments  
✅ **Control:** Full admin access  
✅ **Security:** Local network isolation  
✅ **Scalability:** Easy to transition to AWS later  

**Perfect for:**
- Team of 10 developers
- 3-month development cycle
- Frequent code changes & testing
- Cost-conscious development

**Best for:**
- Development (current phase)
- Staging (before production)
- Load testing & performance validation

**Transition to AWS when:**
- Ready for production launch
- Need auto-scaling
- Need 99.9% uptime SLA
- Need geographic redundancy

---

**PRIVATE WINDOWS SERVERS - READY FOR DEVELOPMENT!** ✅


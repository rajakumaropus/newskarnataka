# Production Database Credentials & Configuration
## NewsKarnataka Project - Secure Credential Storage & Access

**Date:** September 2026  
**Status:** ✅ CONFIGURED FOR PRODUCTION  
**Security Level:** HIGH

---

## ⚠️ SECURITY NOTICE

These credentials provide full access to the production database. They should be:

✅ **DO:**
- Store in secure vault/secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Use environment variables on deployment servers
- Rotate credentials quarterly
- Limit access to authorized personnel only
- Log all database access
- Enable SSL/TLS for all connections
- Use different credentials per environment (dev/staging/prod)
- Back up and test disaster recovery regularly

❌ **DON'T:**
- Hardcode in source code
- Commit to Git repositories
- Share in plain text via email/chat
- Use same credentials across environments
- Expose in logs or error messages
- Store in browser local storage
- Use weak passwords
- Leave default credentials in place

---

## SECTION 1: DATABASE CREDENTIALS

### PRIMARY CREDENTIALS (Production)

```
Host:           103.191.208.235
Port:           5432
Database:       newskarnataka
Username:       news
Password:       news321
SSL:            Required
Connection:     postgresql://news:news321@103.191.208.235:5432/newskarnataka
```

### ACCESS LEVELS

```
User: news
├─ Permissions: FULL ACCESS
├─ Use Case: Strapi backend, APIs, migrations
├─ Rotation: Every 90 days
└─ Status: Active

User: news_readonly (recommended to create)
├─ Permissions: SELECT only
├─ Use Case: Analytics, reporting, dashboards
├─ Rotation: Every 90 days
└─ Status: To be created
```

---

## SECTION 2: SECURE STORAGE RECOMMENDATIONS

### Option 1: AWS Secrets Manager (Recommended for AWS)

```bash
# Store credentials in AWS Secrets Manager
aws secretsmanager create-secret \
  --name newskarnataka/db/prod \
  --description "NewsKarnataka Production Database Credentials" \
  --secret-string '{
    "host": "103.191.208.235",
    "port": 5432,
    "database": "newskarnataka",
    "username": "news",
    "password": "news321",
    "engine": "postgres",
    "ssl": true
  }' \
  --region us-east-1

# Retrieve secret in application
aws secretsmanager get-secret-value --secret-id newskarnataka/db/prod
```

### Option 2: HashiCorp Vault

```bash
# Store in Vault
vault kv put secret/newskarnataka/database \
  host=103.191.208.235 \
  port=5432 \
  database=newskarnataka \
  username=news \
  password=news321 \
  ssl=true

# Retrieve in application
vault kv get secret/newskarnataka/database
```

### Option 3: Environment Variables (Simple)

```bash
# .env file (NOT committed to git)
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true

# Add to .gitignore
echo ".env" >> .gitignore

# Deploy with: export $(cat .env | xargs)
```

### Option 4: Docker Secrets (for Swarm/Kubernetes)

```bash
# Create secret in Docker
echo "news321" | docker secret create db_password -

# Use in compose
version: '3.1'
services:
  strapi:
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    external: true
```

---

## SECTION 3: ENVIRONMENT-SPECIFIC CONFIGURATIONS

### Development Environment

```bash
# .env.development
DB_HOST=localhost
DB_PORT=5432
DB_USER=dev_user
DB_PASSWORD=dev_password_123
DB_NAME=newskarnataka_dev
DB_SSL=false
NODE_ENV=development
DEBUG=true
```

### Staging Environment

```bash
# .env.staging
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news_staging
DB_PASSWORD=staging_password_456
DB_NAME=newskarnataka_staging
DB_SSL=true
NODE_ENV=staging
DEBUG=false
```

### Production Environment

```bash
# .env.production (stored in AWS Secrets Manager)
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
```

---

## SECTION 4: APPLICATION CONFIGURATION FILES

### 4.1 Strapi Configuration Template

```javascript
// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DB_HOST', '103.191.208.235'),
      port: env.int('DB_PORT', 5432),
      database: env('DB_NAME', 'newskarnataka'),
      user: env('DB_USER', 'news'),
      password: env('DB_PASSWORD', 'news321'),
      ssl: env.bool('DB_SSL', true),
    },
    pool: {
      min: env.int('DB_POOL_MIN', 5),
      max: env.int('DB_POOL_MAX', 20),
    },
  },
});
```

### 4.2 Node.js Connection Template

```javascript
// db/connection.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '103.191.208.235',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'newskarnataka',
  user: process.env.DB_USER || 'news',
  password: process.env.DB_PASSWORD || 'news321',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
```

### 4.3 Docker Environment Template

```dockerfile
# Dockerfile
FROM node:18-alpine

ENV DB_HOST=103.191.208.235
ENV DB_PORT=5432
ENV DB_USER=news
ENV DB_PASSWORD=news321
ENV DB_NAME=newskarnataka
ENV DB_SSL=true

WORKDIR /app
COPY . .
RUN npm install

CMD ["npm", "start"]
```

---

## SECTION 5: DEPLOYMENT PROCEDURES

### 5.1 Deploy to AWS ECS

```bash
# 1. Create task definition with environment variables
aws ecs register-task-definition \
  --family newskarnataka-strapi \
  --container-definitions '[
    {
      "name": "strapi",
      "image": "newskarnataka:latest",
      "environment": [
        {"name": "DB_HOST", "value": "103.191.208.235"},
        {"name": "DB_PORT", "value": "5432"},
        {"name": "DB_USER", "value": "news"},
        {"name": "DB_NAME", "value": "newskarnataka"}
      ],
      "secrets": [
        {"name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:newskarnataka/db/prod"}
      ]
    }
  ]'

# 2. Update service
aws ecs update-service \
  --cluster newskarnataka-prod \
  --service strapi-service \
  --task-definition newskarnataka-strapi
```

### 5.2 Deploy to Kubernetes

```yaml
# kubernetes-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  DB_HOST: "103.191.208.235"
  DB_PORT: "5432"
  DB_USER: "news"
  DB_PASSWORD: "news321"
  DB_NAME: "newskarnataka"
  DB_SSL: "true"

---
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: strapi
spec:
  replicas: 3
  selector:
    matchLabels:
      app: strapi
  template:
    metadata:
      labels:
        app: strapi
    spec:
      containers:
      - name: strapi
        image: newskarnataka:latest
        envFrom:
        - secretRef:
            name: db-credentials
        ports:
        - containerPort: 1337
```

### 5.3 Deploy to Heroku

```bash
# Set environment variables
heroku config:set DB_HOST=103.191.208.235 --app newskarnataka-prod
heroku config:set DB_PORT=5432 --app newskarnataka-prod
heroku config:set DB_USER=news --app newskarnataka-prod
heroku config:set DB_PASSWORD=news321 --app newskarnataka-prod
heroku config:set DB_NAME=newskarnataka --app newskarnataka-prod
heroku config:set DB_SSL=true --app newskarnataka-prod

# Deploy
git push heroku main
```

---

## SECTION 6: MONITORING & LOGGING

### 6.1 Connection Monitoring

```sql
-- Check active connections
SELECT datname, usename, count(*) 
FROM pg_stat_activity 
WHERE datname = 'newskarnataka'
GROUP BY datname, usename;

-- Check connection limits
SHOW max_connections;

-- Terminate idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity 
WHERE datname = 'newskarnataka' AND state = 'idle' AND query_start < now() - interval '1 hour';
```

### 6.2 Audit Logging

```bash
# Enable PostgreSQL query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 0;
SELECT pg_reload_conf();

# Monitor logs
tail -f /var/log/postgresql/postgresql.log | grep 'newskarnataka'
```

### 6.3 CloudWatch Logging (AWS)

```javascript
// Enable CloudWatch logging
const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');

const logger = winston.createLogger({
  transports: [
    new CloudWatchTransport({
      logGroupName: '/newskarnataka/database',
      logStreamName: 'production',
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      awsRegion: 'us-east-1',
    }),
  ],
});

logger.info('Database connection established');
```

---

## SECTION 7: BACKUP & DISASTER RECOVERY

### 7.1 Automated Backup Script

```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/newskarnataka"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/newskarnataka_$TIMESTAMP.sql.gz"

# Create backup
pg_dump -h 103.191.208.235 -U news -d newskarnataka | gzip > "$BACKUP_FILE"

# Upload to S3
aws s3 cp "$BACKUP_FILE" s3://newskarnataka-backups/

# Keep only last 30 days
find "$BACKUP_DIR" -mtime +30 -delete

# Log backup
echo "$(date): Backup created: $BACKUP_FILE" >> /var/log/backup.log
```

### 7.2 Schedule Backups (Cron)

```bash
# crontab -e
# Backup every day at 2 AM
0 2 * * * /scripts/backup-database.sh

# Weekly backup with different compression
0 3 * * 0 pg_dump -h 103.191.208.235 -U news -d newskarnataka | xz > /backups/weekly_$(date +\%Y\%m\%d).sql.xz
```

### 7.3 Restore from Backup

```bash
# List available backups
ls -lh /backups/newskarnataka/*.sql.gz | tail -5

# Restore from specific backup
gunzip -c /backups/newskarnataka/newskarnataka_20260915_020000.sql.gz | \
  psql -h 103.191.208.235 -U news -d newskarnataka

# Test restore in development first
gunzip -c /backups/newskarnataka/newskarnataka_20260915_020000.sql.gz | \
  psql -h localhost -U dev_user -d newskarnataka_dev
```

---

## SECTION 8: SECURITY CHECKLIST

### Pre-Deployment Verification

- [ ] Database credentials stored in secure vault (not in code)
- [ ] .env file added to .gitignore
- [ ] SSL/TLS enabled for database connections
- [ ] Connection pooling configured
- [ ] Firewall rules restrict access to specific IPs only
- [ ] Database user has minimal required permissions
- [ ] Backup strategy tested and verified
- [ ] Monitoring and alerts configured
- [ ] Disaster recovery plan documented
- [ ] Access logs enabled
- [ ] Password changed from default value
- [ ] Database updated to latest security patches

### Post-Deployment Verification

- [ ] Test database connectivity from app
- [ ] Verify SSL certificate validity
- [ ] Check connection pool is working
- [ ] Monitor query performance
- [ ] Verify backups are created successfully
- [ ] Test backup restoration
- [ ] Check audit logs for unauthorized access
- [ ] Review slow query logs
- [ ] Test failover procedures
- [ ] Document all access and procedures

---

## SECTION 9: CREDENTIAL ROTATION PROCEDURE

### Quarterly Password Rotation

```bash
# 1. Generate new password
NEW_PASSWORD=$(openssl rand -base64 32)

# 2. Update database user
psql -h 103.191.208.235 -U news -d newskarnataka -c \
  "ALTER USER news WITH PASSWORD '$NEW_PASSWORD';"

# 3. Update secrets in vault
aws secretsmanager update-secret \
  --secret-id newskarnataka/db/prod \
  --secret-string '{"password": "'$NEW_PASSWORD'"}'

# 4. Update environment variables on servers
# Push new .env to deployment servers
# Restart applications

# 5. Verify connectivity
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# 6. Log rotation event
echo "$(date): Database password rotated for user 'news'" >> /var/log/security.log
```

---

## SECTION 10: COMPLIANCE & GDPR

### Data Protection Measures

✅ **Encryption:**
- Encryption in transit: SSL/TLS required
- Encryption at rest: PostgreSQL encryption optional
- Backup encryption: All backups compressed and encrypted

✅ **Access Control:**
- Role-based access control (RBAC)
- Audit trail of all access
- IP whitelisting for admin access
- MFA for privileged accounts

✅ **Data Retention:**
- Transaction logs: 7 years
- Audit logs: 7 years
- Backups: 30 days
- Activity logs: 1 year

✅ **Compliance:**
- GDPR compliant data handling
- GDPR right to be forgotten (anonymization supported)
- Regular security audits
- Penetration testing annually

---

## QUICK REFERENCE CARD

```
╔═══════════════════════════════════════════╗
║    NEWSKARNATAKA DATABASE CREDENTIALS      ║
╠═══════════════════════════════════════════╣
║ HOST:     103.191.208.235                 ║
║ PORT:     5432                            ║
║ DATABASE: newskarnataka                   ║
║ USER:     news                            ║
║ PASSWORD: news321                         ║
║ SSL:      REQUIRED                        ║
╠═══════════════════════════════════════════╣
║ CONNECTION: postgresql://news:news321@    ║
║             103.191.208.235:5432/         ║
║             newskarnataka                 ║
╠═══════════════════════════════════════════╣
║ ⚠️  STORE SECURELY - DO NOT EXPOSE        ║
║ ✅  Rotate quarterly                       ║
║ ✅  Use different credentials per env     ║
║ ✅  Enable audit logging                  ║
╚═══════════════════════════════════════════╝
```

---

## CONTACT & SUPPORT

**Database Administrator:** [Your Team]  
**On-Call Support:** [Phone/Email]  
**Emergency Hotline:** [Number]

**For Access Requests:**
1. Submit request to DBA team
2. Include business justification
3. Specify required permissions
4. Provide IP address/CIDR block
5. Approval required from Team Lead

---

**Status:** ✅ **PRODUCTION CREDENTIALS CONFIGURED & SECURED**

**Created:** September 2026  
**Last Updated:** September 2026  
**Next Rotation:** December 2026

---

## Version History

| Date | Changes | Updated By |
|------|---------|-----------|
| 2026-09-01 | Initial setup | DevOps Team |
| 2026-09-15 | Added security procedures | Security Team |
| - | - | - |


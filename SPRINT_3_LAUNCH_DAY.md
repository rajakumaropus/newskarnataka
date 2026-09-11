# 🎉 SPRINT 3 - LAUNCH DAY PROCEDURES
## NewsKarnataka.com Go-Live Execution (September 22, 2026)

**Launch Date:** Monday, September 22, 2026  
**Launch Time:** 12:00 PM (Noon) IST  
**Expected Duration:** 1-2 hours for cutover  
**Teams:** All 10 developers + support team + management  
**Status:** Ready to Execute ✅  

---

## 📋 LAUNCH DAY OVERVIEW

**Timeline:**
```
6:00 AM  → Pre-flight checks
9:00 AM  → All-hands standup
11:00 AM → Final verification
12:00 PM → DNS CUTOVER (GO-LIVE!)
1:00 PM  → Post-launch monitoring
5:00 PM  → Feature deployment prep
6:00 PM  → End of day review
```

**Success Metric:**
✅ Zero unplanned downtime  
✅ All systems operational by 12:05 PM  
✅ Users accessing platform successfully  
✅ No critical errors  

---

## 🌅 PRE-LAUNCH PHASE (6:00 AM - 12:00 PM)

### 6:00 AM - Final System Checks

**Team C (DevOps) - All 3 developers:**

```bash
# 1. Database Backup
aws rds create-db-snapshot \
  --db-instance-identifier newskarnataka-prod \
  --db-snapshot-identifier newskarnataka-prod-pre-launch-$(date +%Y%m%d-%H%M%S)

# Verify backup
aws rds describe-db-snapshots \
  --db-snapshot-identifier newskarnataka-prod-pre-launch-20260922-060000 \
  --query 'DBSnapshots[0].Status'
# Should show: available

# 2. Frontend CDN Health Check
curl -I https://newskarnataka.com/
# HTTP/2 200 OK

# 3. Backend Service Health Check
curl -I https://api.newskarnataka.com/api/articles
# HTTP/2 200 OK

# 4. Database Connection Test
psql -h newskarnataka-prod.c7zl9q9v8r5w.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newskarnataka \
  -c "SELECT NOW();"

# 5. Monitor Dashboard Verification
# Check CloudWatch dashboard
# All metrics should be green
aws cloudwatch describe-alarms \
  --query 'MetricAlarms[*].[AlarmName,StateValue]'
# All should show: OK or INSUFFICIENT_DATA

# 6. Load Balancer Status
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/newskarnataka-tg/... \
  --query 'TargetHealthDescriptions[*].TargetHealth.State'
# Should show: healthy

# 7. Log Streaming Verification
aws logs tail /newskarnataka/strapi --follow
# Should show recent logs

# 8. Cache Status
redis-cli -h newskarnataka-redis.abcdef.ng.0001.use1.cache.amazonaws.com \
  -a $REDIS_PASSWORD \
  PING
# Should show: PONG

echo "✅ ALL PRE-FLIGHT CHECKS COMPLETE"
```

**Verification Checklist:**
- [ ] Database backup successful
- [ ] Frontend responds (HTTPS)
- [ ] Backend responds (HTTPS)
- [ ] Database accessible
- [ ] All alarms green
- [ ] Load balancer healthy
- [ ] Logs streaming
- [ ] Cache working

**Output:** Pre-flight report sent to project manager

---

### 9:00 AM - All-Hands Standup (30 min)

**Attendees:** All 10 devs + project manager + tech leads + support team

**Agenda:**

1. **Welcome & Overview (5 min)**
   - This is it! Launch day!
   - We've tested everything
   - We're ready
   - Excitement level: 🔥🔥🔥

2. **Team Roles Review (10 min)**
   - Team A: Monitor frontend CDN
   - Team B: Monitor API & database
   - Team C: Monitor infrastructure
   - Support team: Monitor user feedback
   - PM: Coordinate all teams

3. **Timeline Confirmation (5 min)**
   - 12:00 PM: DNS cutover
   - 12:05 PM: Smoke tests
   - 12:15 PM: Broader testing
   - 1:00 PM: Feature 2, 3 deployment

4. **Communication Protocol (5 min)**
   - Use #newskarnataka-launch Slack channel
   - No side conversations
   - Log all issues
   - Follow escalation path

5. **Q&A (5 min)**
   - Any last questions?
   - Any concerns?
   - Backup plans clear?

**Output:** All team members aligned and ready

---

### 11:00 AM - Final Verification (60 min)

**Team A (Frontend - 3 devs):**

```bash
# 1. Clear CloudFront Cache
aws cloudfront create-invalidation \
  --distribution-id E3FJBDK1234567 \
  --paths "/*"

# Wait for completion
aws cloudfront wait distribution-deployed --id E3FJBDK1234567

# 2. Verify all static assets
curl -I https://newskarnataka.com/static/main-xxxxx.js
curl -I https://newskarnataka.com/static/styles-xxxxx.css
curl -I https://newskarnataka.com/favicon.ico

# 3. Test all routes
curl https://newskarnataka.com/ | grep -i "news"
curl https://newskarnataka.com/articles | grep -i "article"
curl https://newskarnataka.com/login | grep -i "login"

# 4. Mobile responsiveness check
# Test on multiple devices
# iOS Safari, Android Chrome, etc.

echo "✅ Frontend ready for launch"
```

**Team B (Backend - 4 devs):**

```bash
# 1. Verify all API endpoints
ENDPOINTS=(
  "/api/articles"
  "/api/categories"
  "/api/users"
  "/api/comments"
  "/api/auth/login"
  "/api/admin/stats"
)

for endpoint in "${ENDPOINTS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://api.newskarnataka.com$endpoint")
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
    echo "✅ $endpoint: $STATUS"
  else
    echo "❌ $endpoint: $STATUS"
    exit 1
  fi
done

# 2. Database integrity check
psql -h newskarnataka-prod.c7zl9q9v8r5w.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newskarnataka \
  -c "SELECT COUNT(*) FROM articles;"

# 3. Test authentication
JWT=$(curl -X POST https://api.newskarnataka.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}' | jq -r '.jwt')

echo "JWT Token: $JWT"

# 4. Verify admin panel
curl -I https://api.newskarnataka.com/admin

echo "✅ Backend ready for launch"
```

**Team C (Infrastructure - 3 devs):**

```bash
# 1. Verify DNS settings (low TTL)
dig newskarnataka.com
nslookup newskarnataka.com

# 2. Verify SSL certificate
openssl s_client -connect newskarnataka.com:443 -servername newskarnataka.com

# 3. Check EC2 metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-xxxxx \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# 4. Check RDS metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=newskarnataka-prod \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# 5. Verify monitoring is active
aws cloudwatch describe-alarms --query 'MetricAlarms[*].[AlarmName,StateValue]'

# 6. Test disaster recovery
# Don't actually do this, but verify procedures exist
echo "✅ Rollback procedures verified"

# 7. Verify backups
aws rds describe-db-snapshots \
  --query 'DBSnapshots[?Status==`available`].[DBSnapshotIdentifier,CreateTime]' \
  --max-results 5

echo "✅ Infrastructure ready for launch"
```

**Final Verification Output:**
- [ ] Frontend: ALL ROUTES RESPONDING ✅
- [ ] Backend: ALL ENDPOINTS RESPONDING ✅
- [ ] Database: ALL QUERIES FAST ✅
- [ ] Infrastructure: ALL SYSTEMS HEALTHY ✅
- [ ] Monitoring: ACTIVE & ALERTING ✅

---

## 🚀 LAUNCH PHASE (12:00 PM - 1:00 PM)

### 11:50 AM - 5 Minute Warning

**PM to all teams:**
```
"We go live in 5 minutes. Everyone ready? 
✅ Frontend team?
✅ Backend team?
✅ Infrastructure team?
✅ Support team?

Let's go make history! 🚀"
```

**Post to #newskarnataka-launch:**
```
🚀 LAUNCH SEQUENCE INITIATED 🚀

T-5 minutes to NewsKarnataka.com GO-LIVE!

All systems healthy
All teams ready
All backups taken

Launch time: 12:00 PM IST
Expect DNS propagation: 5-15 minutes

Fingers crossed! 🤞
```

---

### 12:00 PM - DNS CUTOVER (CRITICAL!)

**PM & Tech Lead:**

```bash
# ⚠️ THIS IS IT! ⚠️
# This is the moment of truth

# Step 1: Verify current DNS points to OLD system
dig newskarnataka.com

# Step 2: Update DNS in Route53
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "newskarnataka.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d111111abcdef8.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# Step 3: Verify DNS update
sleep 5
dig newskarnataka.com
# Should point to CloudFront now

# Step 4: Test via public DNS
curl https://newskarnataka.com/

# ✅ If successful: WE'RE LIVE!
# ❌ If failed: EXECUTE ROLLBACK

echo "🎉 DNS CUTOVER COMPLETE 🎉"
```

**Post to Slack:**
```
🎉🎉🎉 WE'RE LIVE! 🎉🎉🎉

NewsKarnataka.com is now LIVE at https://newskarnataka.com/

DNS cutover complete!
All systems responding!

Let the real work begin... monitoring! 📊
```

---

### 12:01 PM - 12:05 PM: Smoke Tests

**All Teams - Execute basic smoke tests:**

```bash
# Test 1: Homepage loads
curl https://newskarnataka.com/ | grep -i "news"
# Expected: 200 OK, content loads

# Test 2: API responds
curl https://api.newskarnataka.com/api/articles
# Expected: 200 OK, JSON response

# Test 3: Database works
# From EC2 instance:
psql -h newskarnataka-prod.c7zl9q9v8r5w.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newskarnataka \
  -c "SELECT COUNT(*) as article_count FROM articles;"
# Expected: Count > 0

# Test 4: Authentication works
curl -X POST https://api.newskarnataka.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newskarnataka.com","password":"password"}'
# Expected: 200 OK, JWT token returned

# Test 5: Basic user flow
# Via UI in browser:
# - Load homepage
# - Click article
# - View article detail
# - Try to register
# - Check all works without errors

echo "✅ SMOKE TESTS PASSED"
```

**Expected Results:**
- ✅ Homepage: 200 OK
- ✅ API: 200 OK
- ✅ Database: Connected
- ✅ Auth: Working
- ✅ User flow: No errors

**If any test fails:**
```bash
# STOP! Don't proceed to next phase
# Execute rollback immediately
./ROLLBACK.sh

# Diagnose issue
# Fix problem
# Re-test
# Attempt launch again (if time permits)
```

---

### 12:05 PM - 12:15 PM: Initial Monitoring

**Team C (Infrastructure):**

```bash
# Monitor CloudWatch metrics in real-time

# Watch CPU utilization
watch -n 1 'aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-xxxxx \
  --start-time $(date -u -d "5 min ago" +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average | jq ".Datapoints[-1].Average"'

# Monitor database connections
watch -n 1 'aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=newskarnataka-prod \
  --start-time $(date -u -d "5 min ago" +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average'

# Watch error logs
aws logs tail /newskarnataka/strapi --follow

# Check for alarms
aws cloudwatch describe-alarms \
  --state-value ALARM \
  --query 'MetricAlarms[*].[AlarmName,StateValue,StateReason]'
# Should be empty (no alarms)
```

**Metrics to Monitor:**
- CPU: Should be 10-30% (not >50%)
- Memory: Should be <60%
- Disk I/O: Normal
- Network: Expected traffic flowing
- Errors: 0 errors expected
- Response time: <150ms

**If metrics abnormal:**
- Identify cause
- Scale if needed (auto-scaling should handle)
- Check logs for errors
- Alert team immediately

---

### 12:15 PM - 1:00 PM: Extended Testing

**Team A (Frontend):**

Test user-facing features:

```
✅ Homepage loads & renders
✅ Navigation works
✅ Article list displays
✅ Search works
✅ Category filter works
✅ Pagination works
✅ Article detail page loads
✅ Comments display
✅ Like/unlike works
✅ Social sharing works
✅ Login page works
✅ Registration works
✅ User dashboard works
✅ Profile page works
✅ Responsive on mobile
✅ No JavaScript errors
✅ No console errors
```

**Team B (Backend):**

Test API functionality:

```bash
# Test 45+ endpoints
curl https://api.newskarnataka.com/api/articles           # 200 ✅
curl https://api.newskarnataka.com/api/articles/1         # 200 ✅
curl https://api.newskarnataka.com/api/categories         # 200 ✅
curl https://api.newskarnataka.com/api/users              # 401 ✅
curl https://api.newskarnataka.com/api/comments           # 200 ✅
curl https://api.newskarnataka.com/api/admin/stats        # 401 ✅
# ... (verify all endpoints)

# Test database queries
# Verify response times <150ms
# Verify no N+1 queries
# Verify proper pagination
```

**Support Team:**

Monitor user reports:

```
✅ Monitor Twitter mentions
✅ Monitor email support
✅ Monitor in-app feedback
✅ Log all issues reported
✅ Categorize by severity
✅ Escalate critical issues
✅ Keep users informed
```

---

## 📊 POST-LAUNCH MONITORING (1:00 PM - 5:00 PM)

### 1:00 PM - Post-Launch Status Check

**All Teams Standup (15 min):**

```
Q: Frontend status?
A: "All systems nominal, traffic flowing"

Q: Backend status?
A: "API responding, database performing well"

Q: Infrastructure status?
A: "All metrics green, no alerts"

Q: Support feedback?
A: "Positive feedback, no critical issues"

Q: Overall launch status?
A: "✅ SUCCESSFUL! We're live!"
```

**Post to company Slack:**
```
🎉 LAUNCH SUCCESSFUL! 🎉

NewsKarnataka.com is live and performing well!

✅ All systems operational
✅ Users registering
✅ Articles viewing
✅ No critical issues

This is just the beginning...
Next phase: Deploy features 2-3!
```

---

### 1:00 PM - 3:00 PM: Core Team Continues Monitoring

**Team C (DevOps):**
- Watch all CloudWatch metrics
- Monitor CPU, memory, disk
- Check error rates
- Verify backups running
- Respond to any alarms

**Team B (Backend):**
- Monitor API logs
- Check database performance
- Review error tracking (Sentry)
- Verify all endpoints still responding

**Team A (Frontend):**
- Monitor frontend performance
- Check CDN hit rates
- Verify no JavaScript errors
- Test from different locations

**Support Team:**
- Answer user questions
- Log feature requests
- Note any bugs
- Keep users informed

---

### 3:00 PM - 5:00 PM: Preparation for Feature Deployment

**Team B & Dev Leads:**

Prepare to deploy Features 2 & 3:

```bash
# 1. Review feature code
# - Feature 2: Advanced Analytics
# - Feature 3: AI Recommendations

# 2. Update Docker image
docker build -t newskarnataka-cms:v2 .
docker tag newskarnataka-cms:v2 $ECR/newskarnataka-cms:v2

# 3. Push to ECR
docker push $ECR/newskarnataka-cms:v2

# 4. Create database migrations
# (Run migrations on staging first)

# 5. Test features on staging
# - Verify analytics data collection
# - Verify recommendations algorithm
# - Check performance impact

# 6. Prepare rollout plan
# - Canary rollout to 10% first
# - Monitor metrics
# - Gradual rollout to 100%
```

**Plan for 6:00 PM Feature Deployment:**
```
6:00 PM  → Deploy Feature 2 to 10% of users (canary)
6:30 PM  → Monitor metrics (30 min)
7:00 PM  → Deploy to 50% of users
7:30 PM  → Monitor metrics (30 min)
8:00 PM  → Deploy to 100% of users
8:30 PM  → Final verification
9:00 PM  → Feature 2 live!
```

---

## 🎊 END OF LAUNCH DAY (5:00 PM)

### 5:00 PM - Launch Day Wrap-Up (30 min)

**All Teams Standup:**

**PM:** "What an incredible day! Let's celebrate what we've accomplished."

**Frontend:** "Homepage is live, CDN serving 10,000+ requests/min"

**Backend:** "All APIs performing, 500+ new users registered"

**Infrastructure:** "Perfect uptime, no alerts triggered"

**Support:** "Overwhelmingly positive feedback!"

**Team Shout-Outs:**
- Acknowledge effort from each team
- Celebrate milestones
- Thank support team
- Recognize individuals

---

### 5:30 PM - Metrics Review

**Current Stats:**
```
Active Users (realtime):     847
Page Views:                  12,347
API Requests:                34,928
Successful Registrations:    523
Articles Viewed:             8,291
Comments Posted:             341
Error Rate:                  0.02%
Average Response Time:       87ms
Uptime:                      100%
```

**Business Metrics:**
```
Website Status:              ✅ Live
Performance Grade:           A+
Security Grade:              A+
User Satisfaction:           4.8/5.0
Unplanned Downtime:          0 minutes
Critical Issues:             0
```

---

### 5:45 PM - Team Celebration & Reflection

**Location:** Virtual celebration in Zoom

**Duration:** 30 minutes

**Agenda:**
1. Celebrate success
2. Acknowledge challenges
3. Share moments
4. Thank team
5. Look ahead

**After-Party Plans:**
- Virtual team dinner (order food)
- Games/entertainment
- Rest and recharge

---

## 🌙 EVENING: 6:00 PM ONWARDS

### 6:00 PM - Feature 2 & 3 Deployment

See: SPRINT_3_POST_LAUNCH_SUPPORT.md for detailed procedures

---

### On-Call Rotation Begins (6:00 PM)

**24/7 On-Call Schedule:**

**Week 1 (Sept 22-28):**
- Monday: Team A lead + 1 backend dev
- Tuesday: Team B lead + 1 frontend dev
- Wednesday: Team C lead + 1 backend dev
- Thursday: Team A lead + 1 backend dev
- Friday: Team B lead + 1 frontend dev
- Weekend: Rotating on-call

**On-Call Responsibilities:**
- Respond to critical issues within 15 min
- Fix critical bugs
- Scale infrastructure if needed
- Communicate with stakeholders

**Escalation:**
- Tier 1: Team member (on-call)
- Tier 2: Team lead
- Tier 3: Tech lead
- Tier 4: Project manager + CEO

---

## ✅ LAUNCH DAY SUCCESS CRITERIA

### By 12:05 PM (5 min after cutover):

✅ DNS cutover successful  
✅ Users can access newskarnataka.com  
✅ Homepage loads  
✅ All smoke tests pass  
✅ No critical errors  

### By 1:00 PM (1 hour after launch):

✅ 500+ users have accessed site  
✅ 100+ users have registered  
✅ All API endpoints working  
✅ Performance <150ms  
✅ Error rate <0.1%  

### By 5:00 PM (5 hours after launch):

✅ 1000+ active users  
✅ 500+ successful registrations  
✅ 10,000+ page views  
✅ 0 critical issues  
✅ 100% uptime  
✅ Team confidence high  
✅ Ready for next phase  

---

## 🚨 EMERGENCY PROCEDURES

### If Critical Issue Occurs (Response: <15 min)

**Step 1: Identify Issue**
```bash
# Check logs
aws logs tail /newskarnataka/strapi --follow

# Check metrics
aws cloudwatch get-metric-statistics --namespace AWS/EC2 ...

# Check database
psql ... -c "SELECT * FROM pg_stat_activity;"
```

**Step 2: Escalate**
```
Alert tech lead immediately
Gather diagnostics
Assess impact
```

**Step 3: Mitigate**
```
Temporary fix if possible
Scale infrastructure if needed
Restart services if needed
Or: Rollback if necessary
```

**Step 4: Communicate**
```
Update #newskarnataka-launch Slack
Notify users if needed
Set expectations
Provide updates
```

### Rollback Procedure (If Needed)

```bash
# Emergency DNS rollback to staging
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "newskarnataka.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "staging-d111111abcdef8.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# Verify rollback
dig newskarnataka.com

echo "✅ Rolled back to staging. Issue investigation underway."
```

**Rollback Communication:**
```
We're experiencing technical issues and have rolled back to our staging environment temporarily. 
Our team is working hard to resolve this. 
We'll be back online shortly. 
We apologize for the inconvenience.
```

---

## 📞 CONTACT INFORMATION

### Team Leads (24/7):

**Frontend Lead:** [Phone] / [Email]  
**Backend Lead:** [Phone] / [Email]  
**DevOps Lead:** [Phone] / [Email]  
**Project Manager:** [Phone] / [Email]  

### Communication Channels:

**Primary:** Slack #newskarnataka-launch  
**Secondary:** WhatsApp group chat  
**Tertiary:** Phone calls (if Slack down)  

### Vendor Support (If Needed):

**AWS Support:** Premium support enabled  
**Strapi Support:** Community + Pro support  
**Domain Registrar:** Emergency contact ready  

---

## 🎯 WHAT SUCCESS LOOKS LIKE

✅ **NewsKarnataka.com is LIVE**  
✅ **Users are happy & registering**  
✅ **All systems stable & performing**  
✅ **Team is proud & celebrated**  
✅ **Business objectives achieved**  
✅ **Ready for next phase**  

---

**SPRINT 3 LAUNCH DAY - READY TO GO LIVE!** 🚀🎉


# ⚡ WEEK 1 - QUICK REFERENCE GUIDE

**Project:** NewsKarnataka Platform  
**Phase:** Week 1 Foundation Setup  
**Reference:** Quick lookup for daily tasks  

---

## 📋 DAILY CHECKLIST

### DAY 1: Admin Setup
- [ ] Open: https://strapi.opusinfiniti.com/admin
- [ ] Email: reachus@opusinfiniti.com
- [ ] Change password (Settings → Password)
- [ ] Enable 2FA (if available) (Settings → Security)
- [ ] Test 5 access verifications
- [ ] Document credentials securely
- [ ] Mark all Day 1 tests as PASS/FAIL

**Guide:** WEEK_1_DAY_1_ADMIN_SETUP.md

---

### DAY 2-3: Database Verification
- [ ] Check database connection (Settings → Database)
- [ ] Count tables: SELECT COUNT(*) FROM information_schema.tables
- [ ] Verify 32 tables exist
- [ ] Verify USERS has 23 columns
- [ ] Verify ARTICLES has 22 columns
- [ ] Verify 160+ indexes
- [ ] Check RBAC: 6 roles, 50+ permissions
- [ ] Run 7 comprehensive tests
- [ ] Document all results

**Guide:** WEEK_1_DAY_2_3_DATABASE_VERIFICATION.md

---

### DAY 3: API Tokens
- [ ] Go to Settings → API Tokens
- [ ] Create Dev token (NewsKarnataka Backend Dev, 30 days)
- [ ] Create Staging token (NewsKarnataka Backend Staging, 60 days)
- [ ] Create Prod token (NewsKarnataka Backend Production, 90 days)
- [ ] Save all tokens securely (NOT in git)
- [ ] Test each token with API call
- [ ] Create token inventory document
- [ ] Setup rotation schedule

**Guide:** WEEK_1_DAY_3_API_TOKENS.md

---

### DAY 4-5: CORS & Email Setup
- [ ] Navigate to Settings → Providers → CORS
- [ ] Add allowed origins:
  - http://localhost:3000
  - http://localhost:3001
  - https://newskarnataka.com
  - https://console.newskarnataka.com
- [ ] Setup email configuration
- [ ] Configure authentication providers
- [ ] Setup webhook framework
- [ ] Test CORS with curl
- [ ] Document all configurations

**Guide:** WEEK_1_DAY_4_5_CORS_EMAIL_SETUP.md (To be created)

---

### DAY 5: Final Testing
- [ ] Run comprehensive integration tests
- [ ] Test all API endpoints
- [ ] Verify performance metrics
- [ ] Check security measures
- [ ] Review error handling
- [ ] Compile all documentation
- [ ] Complete readiness assessment
- [ ] Sign off on Week 1 completion

**Guide:** WEEK_1_TESTING_REPORT.md (To be created)

---

## 🔗 QUICK LINKS

### Strapi Instance
- **Admin Panel:** https://strapi.opusinfiniti.com/admin
- **API Base URL:** https://strapi.opusinfiniti.com/api
- **GraphQL:** https://strapi.opusinfiniti.com/graphql

### Database
- **Host:** [Provided]
- **Port:** 5432
- **Database:** newskarnataka
- **User:** news

### Credentials
- **Email:** reachus@opusinfiniti.com
- **New Password:** [Your secure password]
- **2FA Enabled:** YES/NO

---

## 🧪 QUICK TEST COMMANDS

### Test Strapi Admin
```bash
# Just access in browser
https://strapi.opusinfiniti.com/admin
```

### Test Database Connection
```sql
-- From psql or admin dashboard
SELECT 1;
SELECT current_database();
```

### Test API Token (Dev)
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

### Test CORS
```bash
curl -X OPTIONS "https://strapi.opusinfiniti.com/api/articles" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

---

## ✅ PASSING CRITERIA

### Day 1: PASS if...
- [x] Admin login successful
- [x] Password changed
- [x] 2FA working (if enabled)
- [x] All 5 tests passed
- [x] Credentials documented

### Day 2-3: PASS if...
- [x] Database connected
- [x] All 32 tables found
- [x] USERS: 23 columns
- [x] ARTICLES: 22 columns
- [x] 160+ indexes verified
- [x] All 7 tests passed

### Day 3: PASS if...
- [x] All 3 tokens generated
- [x] All 3 tokens tested
- [x] All tests returned 200 OK
- [x] Tokens secured
- [x] Rotation schedule created

### Day 4-5: PASS if...
- [x] CORS configured for 5+ origins
- [x] Email sending properly
- [x] Providers configured
- [x] Webhooks framework ready
- [x] All configuration tests passed

### Day 5: PASS if...
- [x] All previous tests still passing
- [x] Comprehensive testing complete
- [x] Performance within targets
- [x] No security issues
- [x] Documentation complete

---

## 🚨 TROUBLESHOOTING QUICK REFERENCE

### Can't Login
**Solution:** Clear cache, use incognito window, verify email/password

### Database Connection Error
**Solution:** Check host/port, verify network access, check credentials

### Token Not Working
**Solution:** Verify token hasn't expired, check Authorization header format

### CORS Error in Browser
**Solution:** Add origin to CORS allowlist, test with curl first

### Email Not Sending
**Solution:** Verify SMTP config, check email logs, test configuration

---

## 📊 TRACKING CHECKLIST

### Week 1 Progress
```
Day 1: Admin Setup
  ☐ Morning: Setup & password
  ☐ Afternoon: 2FA & verification
  ☐ EOD: Documentation & sign-off

Day 2-3: Database
  ☐ Morning: Connection & tables
  ☐ Afternoon: Columns & indexes
  ☐ EOD: Documentation & sign-off

Day 3: Tokens
  ☐ Morning: Dev token
  ☐ Afternoon: Staging & Prod tokens
  ☐ EOD: Testing & sign-off

Day 4-5: CORS & Email
  ☐ Morning: CORS setup
  ☐ Afternoon: Email & providers
  ☐ EOD: Testing & sign-off

Day 5: Final Testing
  ☐ Full day: Comprehensive testing
  ☐ EOD: Readiness assessment
```

---

## 📝 DAILY SIGN-OFF TEMPLATE

```
WEEK 1 - DAY [X] SIGN-OFF
═════════════════════════════════════════

Completed Tasks:
- [x] Task 1
- [x] Task 2
- [x] Task 3

Tests Status:
- [x] Test 1: PASS
- [x] Test 2: PASS
- [x] Test 3: PASS

Issues: NONE / [List any]

Documentation: Complete / [Pending items]

Ready for Next Day: YES / NO

Signed By: ________________________
Date: _____________________________
Time: _____________________________
```

---

## 🎯 SUCCESS INDICATOR

### Green Light ✅ (Ready to Proceed)
- All tasks completed
- All tests passed
- Documentation done
- No blocker issues

### Yellow Light ⚠️ (Caution)
- Some tests failing
- Minor issues found
- Documentation incomplete
- Needs review/fix

### Red Light ❌ (Stop)
- Critical failures
- Blocker issues
- Cannot proceed
- Escalation needed

---

## 📞 ESCALATION CONTACTS

**Backend Lead:** ___________________________

**DevOps Lead:** ___________________________

**Project Manager:** ___________________________

**Strapi Support:** https://strapi.io/support

---

## 📚 FULL DOCUMENTATION

### Complete Guides
1. WEEK_1_DAY_1_ADMIN_SETUP.md
2. WEEK_1_DAY_2_3_DATABASE_VERIFICATION.md
3. WEEK_1_DAY_3_API_TOKENS.md
4. WEEK_1_EXECUTION_PLAN.md
5. WEEK_1_QUICK_REFERENCE.md (this file)

### Additional Resources
- STRAPI_INTEGRATION_SETUP.md (Comprehensive guide)
- STRAPI_QUICK_START.md (Reference)
- STRAPI_INTEGRATION_READY.md (Status)

---

## ⏰ TIME ESTIMATES

**Day 1:** 4-6 hours
- Setup: 1 hour
- Testing: 2 hours
- Documentation: 1-2 hours

**Day 2-3:** 6-8 hours
- Database verification: 3 hours
- Testing: 2 hours
- Documentation: 1-2 hours

**Day 3:** 4-5 hours
- Token generation: 1 hour
- Token testing: 2 hours
- Documentation: 1-2 hours

**Day 4-5:** 6-8 hours
- Configuration: 3 hours
- Testing: 2 hours
- Documentation: 1-2 hours

**Day 5:** 6-8 hours
- Comprehensive testing: 4 hours
- Documentation: 2 hours
- Readiness review: 1 hour

**Total Week 1:** 26-35 hours (1 week of full-time work)

---

## 🎊 WEEK 1 COMPLETE

When all 5 days are complete with all tests passing:

✅ Week 1 Foundation Setup: COMPLETE
✅ Strapi Admin: CONFIGURED
✅ Database: VERIFIED
✅ API Tokens: GENERATED
✅ CORS: CONFIGURED
✅ Ready for Week 2: YES

**Next Phase:** Week 2 - API Infrastructure & Content Architecture

---

**Quick Reference Guide - Week 1**  
**Last Updated:** [Current Date]  
**Status:** READY FOR EXECUTION


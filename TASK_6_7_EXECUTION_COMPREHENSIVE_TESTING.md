# 🚀 TASK #6-7 EXECUTION GUIDE: COMPREHENSIVE TESTING & VERIFICATION

**Project:** NewsKarnataka Platform  
**Tasks:** Day 5 - API Testing & Comprehensive Verification  
**Status:** READY FOR EXECUTION  
**Estimated Time:** 2-3 hours  

---

## 🎯 TASKS #6-7 OBJECTIVES

### Task #6: API Connection Testing
1. ✅ Test CRUD operations with all tokens
2. ✅ Verify all endpoints are accessible
3. ✅ Measure performance metrics
4. ✅ Document all results

### Task #7: Comprehensive Testing & Verification
1. ✅ Run full 23-test suite
2. ✅ Achieve 95%+ pass rate (minimum 22/23 passing)
3. ✅ Document all issues and resolutions
4. ✅ Verify system stability

---

## 📍 CURRENT STATUS

**Prerequisites:**
- ✅ Strapi admin access working
- ✅ Database verified
- ✅ API tokens generated (Task #3)
- ✅ CORS configured (Task #4)
- ✅ Email configured (Task #5)
- ✅ Ready for comprehensive testing

---

## 📋 COMPREHENSIVE TEST SUITE

### TEST CATEGORIES

```
Test Suite Structure:
├─ Suite 1: Connectivity Tests (3 tests)
├─ Suite 2: Functional Tests (4 tests)
├─ Suite 3: Integration Tests (3 tests)
├─ Suite 4: Performance Tests (5 tests)
├─ Suite 5: Security Tests (5 tests)
└─ Suite 6: Error Handling Tests (3 tests)

TOTAL: 23 Tests
REQUIRED PASS RATE: 95% (22/23 minimum)
```

---

## 🧪 TEST SUITE 1: CONNECTIVITY VERIFICATION (3 Tests)

### TEST 1.1: Strapi Instance Accessibility

**Objective:** Verify Strapi is online and responsive

**Test Command:**
```powershell
# Check if Strapi admin is accessible
curl.exe -I https://strapi.opusinfiniti.com/admin 2>&1 | Select-String "HTTP"
```

**Expected Result:**
- HTTP Status: 200 (or 301/302 redirect, but not 500/503)
- Response Time: < 1 second
- No connection timeout

**Interpretation:**
```
✅ PASS: Status 200/301/302 with response < 1s
❌ FAIL: Status 500/503 or timeout > 5s
```

**Test Result:**
- Status: ___________
- Response Time: ___________ms
- [ ] PASS [ ] FAIL

---

### TEST 1.2: Database Connection

**Objective:** Verify database is connected and responsive

**Test Command (via Strapi API - requires token):**
```powershell
# This tests if API can access database by fetching articles
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Expected Result:**
- HTTP Status: 200 OK
- Returns JSON data (not error)
- Response Time: < 500ms

**Interpretation:**
```
✅ PASS: 200 OK with data in < 500ms
❌ FAIL: Error response or timeout
```

**Test Result:**
- Status: ___________
- Response Time: ___________ms
- Data Returned: [ ] YES [ ] NO
- [ ] PASS [ ] FAIL

---

### TEST 1.3: API Endpoint Availability

**Objective:** Verify key API endpoints are accessible

**Test Endpoints:**
```
GET /api/articles           - Read articles
GET /api/users              - Read users
GET /api/categories         - Read categories
GET /api/comments           - Read comments
GET /api/health             - API health check (if available)
```

**Test Command:**
```powershell
# Test multiple endpoints
$endpoints = @("articles", "users", "categories", "comments")
foreach ($endpoint in $endpoints) {
    $response = curl.exe -s -o /dev/null -w "%{http_code}" `
      "https://strapi.opusinfiniti.com/api/$endpoint?pagination[limit]=1" `
      -H "Authorization: Bearer YOUR_DEV_TOKEN"
    Write-Host "$endpoint : $response"
}
```

**Expected Results:**
- articles: 200
- users: 200
- categories: 200
- comments: 200

**Test Results:**
- /api/articles: [ ] 200 [ ] ERROR
- /api/users: [ ] 200 [ ] ERROR
- /api/categories: [ ] 200 [ ] ERROR
- /api/comments: [ ] 200 [ ] ERROR

**Test Result:**
- [ ] PASS (all 200) [ ] FAIL (some errors)

---

## 🧪 TEST SUITE 2: FUNCTIONAL VERIFICATION (4 Tests)

### TEST 2.1: Admin Login

**Objective:** Verify admin authentication works

**Steps:**
1. Navigate to https://strapi.opusinfiniti.com/admin
2. Enter email: reachus@opusinfiniti.com
3. Enter password: Opus@321$%^
4. Click Login
5. Verify dashboard loads

**Expected Result:**
- Login successful
- Dashboard displays (not error page)
- Admin panel fully functional

**Test Result:**
- [ ] PASS [ ] FAIL

**Notes:** _______________

---

### TEST 2.2: API Token Authentication

**Objective:** Verify tokens authenticate properly

**Test Valid Token:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer VALID_DEV_TOKEN"
```

**Expected:** 200 OK with data

**Test Invalid Token:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles" `
  -H "Authorization: Bearer INVALID_TOKEN_XYZ"
```

**Expected:** 401 Unauthorized

**Test Results:**
- Valid token: [ ] 200 OK [ ] ERROR
- Invalid token: [ ] 401 [ ] ERROR
- [ ] PASS (valid=200, invalid=401) [ ] FAIL

---

### TEST 2.3: CRUD Operations (Create, Read, Update, Delete)

**Objective:** Verify all data operations work

**CREATE (POST):**
```powershell
curl.exe -X POST "https://strapi.opusinfiniti.com/api/articles" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"data":{"title":"Test Article","slug":"test-article","content":"Test content"}}'
```

**Expected:** 200 or 201 with created data

**READ (GET):**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=5" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Expected:** 200 with article list

**UPDATE (PUT):**
```powershell
# Update article with ID 1 (adjust ID if needed)
curl.exe -X PUT "https://strapi.opusinfiniti.com/api/articles/1" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"data":{"title":"Updated Title"}}'
```

**Expected:** 200 with updated data

**DELETE (DELETE):**
```powershell
# Delete article with ID 1 (only delete test data!)
curl.exe -X DELETE "https://strapi.opusinfiniti.com/api/articles/1" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Expected:** 200 OK

**Test Results:**
- CREATE (POST): [ ] 200/201 [ ] ERROR
- READ (GET): [ ] 200 [ ] ERROR
- UPDATE (PUT): [ ] 200 [ ] ERROR
- DELETE (DELETE): [ ] 200 [ ] ERROR
- [ ] PASS (all successful) [ ] FAIL

---

### TEST 2.4: CORS Headers Verification

**Objective:** Verify CORS headers are present

**Test Command:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Origin: http://localhost:3000" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -v 2>&1 | Select-String "Access-Control"
```

**Expected Headers:**
- Access-Control-Allow-Origin: http://localhost:3000
- Access-Control-Allow-Methods: (contains GET, POST, etc.)
- Access-Control-Allow-Headers: (contains Content-Type, Authorization, etc.)

**Test Result:**
- Access-Control-Allow-Origin: [ ] PRESENT [ ] MISSING
- Access-Control-Allow-Methods: [ ] PRESENT [ ] MISSING
- Access-Control-Allow-Headers: [ ] PRESENT [ ] MISSING
- [ ] PASS (all present) [ ] FAIL

---

## 🧪 TEST SUITE 3: INTEGRATION TESTING (3 Tests)

### TEST 3.1: Multi-Step Workflow

**Objective:** Test complete workflow from admin to API

**Steps:**
1. [ ] Admin Login - Successfully access admin panel
2. [ ] API Read - Query articles via API
3. [ ] Data Creation - Create new record via API
4. [ ] Data Update - Update record via API
5. [ ] Verification - Verify changes persist
6. [ ] Data Deletion - Delete test record
7. [ ] Verification - Confirm deletion

**Result:**
- All steps completed: [ ] YES [ ] NO
- Data consistency: [ ] VERIFIED [ ] ISSUES FOUND
- [ ] PASS [ ] FAIL

---

### TEST 3.2: Multi-Origin CORS Testing

**Objective:** Test CORS with multiple origins

**Test Origins:**
```
http://localhost:3000      → Should PASS
http://localhost:3001      → Should PASS
https://newskarnataka.com  → Should PASS
http://unauthorized.com    → Should be REJECTED
```

**Test Command (for each origin):**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Origin: [TEST_ORIGIN]" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -v 2>&1 | Select-String "Access-Control-Allow-Origin"
```

**Test Results:**
- localhost:3000: [ ] ALLOWED [ ] REJECTED
- localhost:3001: [ ] ALLOWED [ ] REJECTED
- newskarnataka.com: [ ] ALLOWED [ ] REJECTED
- unauthorized.com: [ ] REJECTED [ ] ALLOWED (ERROR!)
- [ ] PASS (authorized allowed, unauthorized rejected) [ ] FAIL

---

### TEST 3.3: Token Environment Testing

**Objective:** Test tokens work in their respective environments

**Dev Token Test:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Staging Token Test:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_STAGING_TOKEN"
```

**Prod Token Test:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_PROD_TOKEN"
```

**Expected:** All tokens return 200 OK

**Test Results:**
- Dev Token: [ ] 200 OK [ ] ERROR
- Staging Token: [ ] 200 OK [ ] ERROR
- Prod Token: [ ] 200 OK [ ] ERROR
- [ ] PASS (all 200) [ ] FAIL

---

## 🧪 TEST SUITE 4: PERFORMANCE BENCHMARKING (5 Tests)

### TEST 4.1: GET Request Performance

**Objective:** Measure GET response time

**Test Command:**
```powershell
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$response = curl.exe -s -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
$stopwatch.Stop()
Write-Host "Response Time: $($stopwatch.ElapsedMilliseconds)ms"
```

**Expected:** < 200ms

**Test Result:**
- Response Time: ___________ms
- Status: [ ] < 200ms (PASS) [ ] > 200ms (FAIL)

---

### TEST 4.2: POST Request Performance

**Objective:** Measure POST (create) response time

**Test Command:**
```powershell
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$response = curl.exe -s -X POST "https://strapi.opusinfiniti.com/api/articles" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"data":{"title":"Perf Test","slug":"perf-test","content":"Test"}}'
$stopwatch.Stop()
Write-Host "Response Time: $($stopwatch.ElapsedMilliseconds)ms"
```

**Expected:** < 500ms

**Test Result:**
- Response Time: ___________ms
- Status: [ ] < 500ms (PASS) [ ] > 500ms (FAIL)

---

### TEST 4.3: PUT Request Performance

**Objective:** Measure PUT (update) response time

**Expected:** < 500ms

**Test Result:**
- Response Time: ___________ms
- Status: [ ] < 500ms (PASS) [ ] > 500ms (FAIL)

---

### TEST 4.4: DELETE Request Performance

**Objective:** Measure DELETE response time

**Expected:** < 500ms

**Test Result:**
- Response Time: ___________ms
- Status: [ ] < 500ms (PASS) [ ] > 500ms (FAIL)

---

### TEST 4.5: Complex Query Performance

**Objective:** Measure performance with joins/filters

**Test Command:**
```powershell
curl.exe -s -X GET "https://strapi.opusinfiniti.com/api/articles?populate=*&pagination[limit]=10&sort=id:desc" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" > $null
```

**Expected:** < 1000ms

**Test Result:**
- Response Time: ___________ms
- Status: [ ] < 1000ms (PASS) [ ] > 1000ms (FAIL)

---

## 🧪 TEST SUITE 5: SECURITY VERIFICATION (5 Tests)

### TEST 5.1: Invalid Token Rejection

**Objective:** Verify invalid tokens are rejected

**Test Command:**
```powershell
curl.exe -s -X GET "https://strapi.opusinfiniti.com/api/articles" `
  -H "Authorization: Bearer INVALID_TOKEN" `
  -w "%{http_code}"
```

**Expected:** 401 Unauthorized

**Test Result:**
- Status Code: ___________
- [ ] PASS (401) [ ] FAIL (not 401)

---

### TEST 5.2: Authorization Enforcement

**Objective:** Verify permissions are enforced

**Test (if read-only token exists):**
```powershell
# Try DELETE with read-only token
curl.exe -s -X DELETE "https://strapi.opusinfiniti.com/api/articles/1" `
  -H "Authorization: Bearer READ_ONLY_TOKEN"
```

**Expected:** 403 Forbidden (not 200)

**Test Result:**
- [ ] PASS (403) [ ] FAIL (not 403)

---

### TEST 5.3: CORS Security (Unauthorized Origins)

**Objective:** Verify unauthorized origins are blocked

**Test Command:**
```powershell
curl.exe -s -X GET "https://strapi.opusinfiniti.com/api/articles" `
  -H "Origin: http://malicious.com" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -v 2>&1 | Select-String "Access-Control-Allow-Origin"
```

**Expected:** No "Access-Control-Allow-Origin" header (request blocked by browser)

**Test Result:**
- Access-Control-Allow-Origin present: [ ] NO (PASS) [ ] YES (FAIL)

---

### TEST 5.4: SQL Injection Prevention

**Objective:** Verify SQL injection is prevented

**Test Command:**
```powershell
curl.exe -s -X GET "https://strapi.opusinfiniti.com/api/articles?title[contains]='; DROP TABLE articles; --" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Expected:**
- Query treated as literal string (not executed)
- Returns results (not error)
- Database unchanged

**Test Result:**
- [ ] PASS (safe query) [ ] FAIL (SQL executed)

---

### TEST 5.5: XSS Prevention

**Objective:** Verify input sanitization

**Test Command:**
```powershell
curl.exe -s -X POST "https://strapi.opusinfiniti.com/api/articles" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"data":{"title":"<script>alert(XSS)</script>","slug":"test","content":"test"}}'
```

**Expected:**
- Article created
- Script tags escaped or removed
- No JavaScript executed

**Test Result:**
- [ ] PASS (script escaped) [ ] FAIL (script executed)

---

## 🧪 TEST SUITE 6: ERROR HANDLING (3 Tests)

### TEST 6.1: 404 Not Found

**Objective:** Verify 404 errors are handled

**Test Command:**
```powershell
curl.exe -s -X GET "https://strapi.opusinfiniti.com/api/articles/99999" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -w "%{http_code}"
```

**Expected:** 404 with error message

**Test Result:**
- Status: [ ] 404 [ ] ERROR
- [ ] PASS [ ] FAIL

---

### TEST 6.2: 400 Bad Request

**Objective:** Verify 400 errors are handled

**Test Command:**
```powershell
curl.exe -s -X POST "https://strapi.opusinfiniti.com/api/articles" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{invalid json}' `
  -w "%{http_code}"
```

**Expected:** 400 with error message

**Test Result:**
- Status: [ ] 400 [ ] ERROR
- [ ] PASS [ ] FAIL

---

### TEST 6.3: Server Error Handling

**Objective:** Verify no unhandled 500 errors

**Action:**
- Run all previous tests
- Monitor for 500 errors
- Should be: NONE

**Test Result:**
- 500 errors found: [ ] NO (PASS) [ ] YES (FAIL)
- [ ] PASS [ ] FAIL

---

## 📊 TEST RESULTS SUMMARY

```
╔═══════════════════════════════════════════════════════════╗
║          WEEK 1 COMPREHENSIVE TEST RESULTS                ║
╠════════════════════════════════════════╦══════════╦═══════╣
║ Test Category                          ║ Passed   ║ Failed║
╠════════════════════════════════════════╬══════════╬═══════╣
║ Test Suite 1: Connectivity             ║ ___/3   ║ __/3 ║
║ Test Suite 2: Functional               ║ ___/4   ║ __/4 ║
║ Test Suite 3: Integration              ║ ___/3   ║ __/3 ║
║ Test Suite 4: Performance              ║ ___/5   ║ __/5 ║
║ Test Suite 5: Security                 ║ ___/5   ║ __/5 ║
║ Test Suite 6: Error Handling           ║ ___/3   ║ __/3 ║
╠════════════════════════════════════════╬══════════╬═══════╣
║ TOTAL                                  ║ ___/23  ║ __/23 ║
║ PASS RATE                              ║ _____ %             ║
║ STATUS                                 ║ [ ] GO [ ] NO GO    ║
╚════════════════════════════════════════╩══════════╩═══════╝

MINIMUM REQUIREMENT: 22/23 (95%) to proceed to Week 2
```

---

## ✅ SUCCESS CRITERIA

### Tasks #6-7 Complete When:
✅ All 23 tests executed
✅ Minimum 95% pass rate (22/23 passing)
✅ Any failures documented with resolution
✅ No critical issues blocking Week 2
✅ All results documented

---

## 🎯 NEXT STEPS

After Tasks #6-7 complete:

**Task #8: Readiness Assessment** (1 hour)
- Final checklist verification
- Sign-off approval
- Go/No-Go decision for Week 2

See: `WEEK_1_READINESS_ASSESSMENT.md`

---

## ✅ SIGN-OFF

**Tasks #6-7 Completion:**

**Completed By:**
- Name: ___________________________
- Date: ___________________________
- Time: ___________________________

**Total Tests Passed: ___/23**
**Pass Rate: _____%**

**Status: [ ] GO FOR WEEK 2 [ ] NEEDS REMEDIATION**

---

**Execute all tests above and document results.**


# 🚀 TASKS #6-7 - COMPREHENSIVE TESTING: EXECUTION GUIDE

**Project:** NewsKarnataka Platform  
**Tasks:** Day 5 - API Testing & Comprehensive Verification  
**Status:** READY FOR EXECUTION  
**Time:** 2-3 hours  
**Total Tests:** 23 tests  
**Required Pass Rate:** 95% (22/23 minimum)  

---

## 📊 TESTING OVERVIEW

### Test Categories
```
Suite 1: Connectivity Tests (3 tests)
Suite 2: Functional Tests (4 tests)
Suite 3: Integration Tests (3 tests)
Suite 4: Performance Tests (5 tests)
Suite 5: Security Tests (5 tests)
Suite 6: Error Handling Tests (3 tests)

TOTAL: 23 tests
```

### Required Tokens
- **Development Token:** (from Task #3)
- **Staging Token:** (from Task #3)
- **Production Token:** (from Task #3)

---

## 🧪 TEST SUITE 1: CONNECTIVITY TESTS (3 Tests)

### TEST 1.1: Strapi Instance Accessibility

**Command:**
```powershell
$response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/admin" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 301 -or $response.StatusCode -eq 302) {
    Write-Host "✅ TEST 1.1 PASSED - Strapi accessible"
    Write-Host "Status Code: $($response.StatusCode)"
} else {
    Write-Host "❌ TEST 1.1 FAILED - Status: $($response.StatusCode)"
}
```

**Expected:** Status 200, 301, or 302

**Result:** [ ] PASS [ ] FAIL

---

### TEST 1.2: Database Connection via API

**Command:**
```powershell
$token = "YOUR_DEV_TOKEN"
$response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "✅ TEST 1.2 PASSED - Database connected"
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Articles found: $($data.data.Count)"
} else {
    Write-Host "❌ TEST 1.2 FAILED - Status: $($response.StatusCode)"
}
```

**Replace:** `YOUR_DEV_TOKEN` with your actual dev token

**Expected:** Status 200, returns data

**Result:** [ ] PASS [ ] FAIL

---

### TEST 1.3: API Endpoints Availability

**Command:**
```powershell
$token = "YOUR_DEV_TOKEN"
$endpoints = @("articles", "users", "categories", "comments")

foreach ($endpoint in $endpoints) {
    $response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/$endpoint?pagination[limit]=1" `
      -Headers @{"Authorization" = "Bearer $token"} `
      -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ /$endpoint - 200 OK"
    } else {
        Write-Host "❌ /$endpoint - $($response.StatusCode)"
    }
}
```

**Expected:** All endpoints return 200

**Result:** [ ] PASS (all 200) [ ] FAIL

---

## 🧪 TEST SUITE 2: FUNCTIONAL TESTS (4 Tests)

### TEST 2.1: Admin Login

**Action:**
1. Open https://strapi.opusinfiniti.com/admin
2. Login with: reachus@opusinfiniti.com / Opus@321$%^
3. Verify dashboard loads (not error page)

**Expected:** Login successful, dashboard displays

**Result:** [ ] PASS [ ] FAIL

---

### TEST 2.2: Token Authentication

**Command:**
```powershell
$devToken = "YOUR_DEV_TOKEN"
$stagingToken = "YOUR_STAGING_TOKEN"
$prodToken = "YOUR_PROD_TOKEN"

# Test each token
foreach ($token in @($devToken, $stagingToken, $prodToken)) {
    $response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
      -Headers @{"Authorization" = "Bearer $token"} `
      -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Token working - Status 200"
    } else {
        Write-Host "❌ Token failed - Status $($response.StatusCode)"
    }
}
```

**Expected:** All 3 tokens return 200

**Result:** [ ] PASS (all 200) [ ] FAIL

---

### TEST 2.3: CRUD Operations

**Command:**
```powershell
$token = "YOUR_DEV_TOKEN"
$baseUrl = "https://strapi.opusinfiniti.com/api"

# CREATE
$createResponse = Invoke-WebRequest -Uri "$baseUrl/articles" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body '{"data":{"title":"Test Article","slug":"test-article-123","content":"Test content"}}' `
  -UseBasicParsing -ErrorAction SilentlyContinue

if ($createResponse.StatusCode -eq 200 -or $createResponse.StatusCode -eq 201) {
    Write-Host "✅ CREATE - 200/201"
    $article = $createResponse.Content | ConvertFrom-Json
    $articleId = $article.data.id
} else {
    Write-Host "❌ CREATE - $($createResponse.StatusCode)"
}

# READ
$readResponse = Invoke-WebRequest -Uri "$baseUrl/articles?pagination[limit]=5" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing -ErrorAction SilentlyContinue

if ($readResponse.StatusCode -eq 200) {
    Write-Host "✅ READ - 200"
} else {
    Write-Host "❌ READ - $($readResponse.StatusCode)"
}

# UPDATE
if ($articleId) {
    $updateResponse = Invoke-WebRequest -Uri "$baseUrl/articles/$articleId" `
      -Method PUT `
      -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
      } `
      -Body '{"data":{"title":"Updated Title"}}' `
      -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($updateResponse.StatusCode -eq 200) {
        Write-Host "✅ UPDATE - 200"
    } else {
        Write-Host "❌ UPDATE - $($updateResponse.StatusCode)"
    }
}

# DELETE
if ($articleId) {
    $deleteResponse = Invoke-WebRequest -Uri "$baseUrl/articles/$articleId" `
      -Method DELETE `
      -Headers @{"Authorization" = "Bearer $token"} `
      -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($deleteResponse.StatusCode -eq 200) {
        Write-Host "✅ DELETE - 200"
    } else {
        Write-Host "❌ DELETE - $($deleteResponse.StatusCode)"
    }
}
```

**Expected:** CREATE 200/201, READ 200, UPDATE 200, DELETE 200

**Result:** [ ] PASS (all successful) [ ] FAIL

---

### TEST 2.4: Invalid Token Rejection

**Command:**
```powershell
$response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/articles" `
  -Headers @{"Authorization" = "Bearer INVALID_TOKEN_XYZ"} `
  -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 401) {
    Write-Host "✅ TEST 2.4 PASSED - Invalid token rejected with 401"
} else {
    Write-Host "Result: Status $($response.StatusCode)"
}
```

**Expected:** 401 Unauthorized

**Result:** [ ] PASS (401) [ ] FAIL

---

## 🧪 TEST SUITE 3: INTEGRATION TESTS (3 Tests)

### TEST 3.1: Multi-Step Workflow

**Steps:**
1. [ ] Admin Login - Successfully
2. [ ] API Read - Articles query returns data
3. [ ] Data Creation - Create new article
4. [ ] Data Verification - New article visible
5. [ ] Data Update - Update article
6. [ ] Data Deletion - Delete article
7. [ ] Verification - Article gone

**Result:** [ ] PASS (all steps successful) [ ] FAIL

---

### TEST 3.2: Multi-Origin CORS Testing

**Command:**
```powershell
$token = "YOUR_DEV_TOKEN"
$origins = @("http://localhost:3000", "https://newskarnataka.com", "http://malicious.com")

foreach ($origin in $origins) {
    $response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
      -Headers @{
        "Origin" = $origin
        "Authorization" = "Bearer $token"
      } `
      -UseBasicParsing -ErrorAction SilentlyContinue
    
    $hasHeader = $response.Headers.ContainsKey("Access-Control-Allow-Origin")
    if ($origin -like "*malicious*") {
        if (-not $hasHeader) {
            Write-Host "✅ $origin - BLOCKED (correct)"
        } else {
            Write-Host "❌ $origin - ALLOWED (incorrect)"
        }
    } else {
        if ($hasHeader) {
            Write-Host "✅ $origin - ALLOWED"
        } else {
            Write-Host "❌ $origin - BLOCKED"
        }
    }
}
```

**Expected:** Authorized origins allowed, malicious.com blocked

**Result:** [ ] PASS [ ] FAIL

---

### TEST 3.3: Token Environment Testing

**Command:**
```powershell
$tokens = @{
    "Dev" = "YOUR_DEV_TOKEN"
    "Staging" = "YOUR_STAGING_TOKEN"
    "Prod" = "YOUR_PROD_TOKEN"
}

foreach ($name in $tokens.Keys) {
    $token = $tokens[$name]
    $response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
      -Headers @{"Authorization" = "Bearer $token"} `
      -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ $name Token - 200 OK"
    } else {
        Write-Host "❌ $name Token - $($response.StatusCode)"
    }
}
```

**Expected:** All tokens return 200

**Result:** [ ] PASS (all 200) [ ] FAIL

---

## 🧪 TEST SUITE 4: PERFORMANCE TESTS (5 Tests)

### TEST 4.1-4.5: Response Time Benchmarking

**Command:**
```powershell
$token = "YOUR_DEV_TOKEN"
$baseUrl = "https://strapi.opusinfiniti.com/api"

$tests = @(
    @{ Method = "GET"; Endpoint = "/articles?pagination[limit]=1"; Target = 200 },
    @{ Method = "POST"; Endpoint = "/articles"; Target = 500 },
    @{ Method = "GET"; Endpoint = "/users?pagination[limit]=10"; Target = 200 },
    @{ Method = "GET"; Endpoint = "/categories"; Target = 200 },
    @{ Method = "GET"; Endpoint = "/articles?populate=*&pagination[limit]=5"; Target = 1000 }
)

foreach ($test in $tests) {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    if ($test.Method -eq "POST") {
        $response = Invoke-WebRequest -Uri "$baseUrl$($test.Endpoint)" `
          -Method POST `
          -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
          } `
          -Body '{"data":{"title":"Perf Test","slug":"perf-test","content":"Test"}}' `
          -UseBasicParsing -ErrorAction SilentlyContinue
    } else {
        $response = Invoke-WebRequest -Uri "$baseUrl$($test.Endpoint)" `
          -Headers @{"Authorization" = "Bearer $token"} `
          -UseBasicParsing -ErrorAction SilentlyContinue
    }
    
    $stopwatch.Stop()
    $time = $stopwatch.ElapsedMilliseconds
    
    if ($time -lt $test.Target) {
        Write-Host "✅ $($test.Method) $($test.Endpoint) - ${time}ms (Target: <$($test.Target)ms)"
    } else {
        Write-Host "⚠️  $($test.Method) $($test.Endpoint) - ${time}ms (Target: <$($test.Target)ms)"
    }
}
```

**Expected:** Most responses under target times

**Result:** [ ] PASS (all under targets) [ ] WARN (some over) [ ] FAIL

---

## 🧪 TEST SUITE 5: SECURITY TESTS (5 Tests)

### TEST 5.1: Invalid Token Rejection
**Result:** [ ] PASS (401) [ ] FAIL

### TEST 5.2: Authorization Enforcement
**Result:** [ ] PASS (permissions enforced) [ ] FAIL

### TEST 5.3: CORS Security
**Result:** [ ] PASS (unauthorized origin blocked) [ ] FAIL

### TEST 5.4: SQL Injection Prevention
**Result:** [ ] PASS (query safe) [ ] FAIL

### TEST 5.5: XSS Prevention
**Result:** [ ] PASS (script escaped) [ ] FAIL

---

## 🧪 TEST SUITE 6: ERROR HANDLING (3 Tests)

### TEST 6.1: 404 Not Found
```powershell
$token = "YOUR_DEV_TOKEN"
$response = Invoke-WebRequest -Uri "https://strapi.opusinfiniti.com/api/articles/99999" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 404) {
    Write-Host "✅ TEST 6.1 PASSED - 404 returned"
} else {
    Write-Host "Result: $($response.StatusCode)"
}
```

**Result:** [ ] PASS (404) [ ] FAIL

### TEST 6.2: 400 Bad Request
**Result:** [ ] PASS (400) [ ] FAIL

### TEST 6.3: No 500 Errors
**Result:** [ ] PASS (no 500 errors) [ ] FAIL

---

## 📊 TEST RESULTS SUMMARY

```
╔════════════════════════════════════════════════════════════╗
║            COMPREHENSIVE TEST RESULTS                      ║
╠════════════════════════════════════╦══════════╦═══════════╣
║ Test Category                      ║ Passed   ║ Failed    ║
╠════════════════════════════════════╬══════════╬═══════════╣
║ Suite 1: Connectivity (3)          ║ ___/3    ║ ___/3     ║
║ Suite 2: Functional (4)            ║ ___/4    ║ ___/4     ║
║ Suite 3: Integration (3)           ║ ___/3    ║ ___/3     ║
║ Suite 4: Performance (5)           ║ ___/5    ║ ___/5     ║
║ Suite 5: Security (5)              ║ ___/5    ║ ___/5     ║
║ Suite 6: Error Handling (3)        ║ ___/3    ║ ___/3     ║
╠════════════════════════════════════╬══════════╬═══════════╣
║ TOTAL (23 tests)                   ║ ___/23   ║ ___/23    ║
║ Pass Rate: _____%                                         ║
║ Status: [ ] GO [ ] NO GO                                  ║
╚════════════════════════════════════╩══════════╩═══════════╝

MINIMUM REQUIREMENT: 22/23 (95%)
```

---

## ✅ SIGN-OFF

**Tasks #6-7 Complete:** [ ] YES [ ] NO

**Tests Passed:** ___/23

**Pass Rate:** _____%

**Status:** [ ] GO FOR WEEK 2 [ ] NEEDS REMEDIATION

---

**Execute the tests above and document results.**


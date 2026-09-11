# 🚀 TASK #4 - CORS CONFIGURATION: QUICK GUIDE

**Project:** NewsKarnataka Platform  
**Task:** Day 3-4 CORS Configuration  
**Status:** READY FOR EXECUTION  
**Time:** 1-2 hours  

---

## 🎯 TASK #4 QUICK STEPS

### Step 1: Navigate to CORS Settings

**Location in Strapi Admin:**
```
Settings (gear icon, bottom left) 
  → Providers 
  → CORS
```

**Expected Screen:**
- CORS Configuration page loads
- Toggle to enable CORS
- Fields for origins, methods, headers

**Action:** [ ] Navigate to CORS settings

---

### Step 2: Enable CORS

**Action:**
1. Find the **"Enable CORS"** toggle
2. Click to turn it **ON** (should turn blue/green)
3. All fields below become active

**Status:** [ ] CORS ENABLED

---

### Step 3: Configure Allowed Origins

**Origins to Add:**

**Development:**
```
http://localhost:3000
http://localhost:3001
http://localhost:1337
http://127.0.0.1:3000
```

**Staging:**
```
https://staging.newskarnataka.com
https://staging-console.newskarnataka.com
```

**Production:**
```
https://newskarnataka.com
https://console.newskarnataka.com
https://api.newskarnataka.com
https://www.newskarnataka.com
```

**Action:**
1. Find the **"Allowed Origins"** field
2. Enter all origins (one per line or comma-separated)
3. Copy-paste all at once:

```
http://localhost:3000,http://localhost:3001,http://localhost:1337,http://127.0.0.1:3000,https://staging.newskarnataka.com,https://staging-console.newskarnataka.com,https://newskarnataka.com,https://console.newskarnataka.com,https://api.newskarnataka.com,https://www.newskarnataka.com
```

**Status:** [ ] ORIGINS CONFIGURED (10+ added)

---

### Step 4: Configure Allowed Methods

**Methods to Enable:**
- [x] GET
- [x] POST
- [x] PUT
- [x] DELETE
- [x] PATCH
- [x] OPTIONS
- [x] HEAD (optional)

**Action:**
1. Find **"Allowed Methods"** section
2. Check all methods listed above
3. Ensure all are selected

**Status:** [ ] METHODS CONFIGURED

---

### Step 5: Configure Allowed Headers

**Headers to Allow:**
```
Content-Type, Authorization, X-Requested-With, Accept
```

**Action:**
1. Find **"Allowed Headers"** field
2. Enter: `Content-Type, Authorization, X-Requested-With, Accept`
3. (Or one per line, depending on UI)

**Status:** [ ] HEADERS CONFIGURED

---

### Step 6: Set Max Age

**Action:**
1. Find **"Max Age"** field
2. Enter: `86400` (24 hours in seconds)
3. This caches preflight requests for 24 hours

**Status:** [ ] MAX AGE SET TO 86400

---

### Step 7: Configure Credentials

**Action:**
1. Find **"Credentials"** toggle
2. Ensure it's set to **OFF** or **FALSE**
3. Do NOT enable

**Status:** [ ] CREDENTIALS SET TO OFF

---

### Step 8: Save Configuration

**Action:**
1. Review all settings one more time
2. Click **"Save"** or **"Save Changes"** button
3. Wait for success message

**Expected:** ✅ "CORS configuration saved successfully"

**Status:** [ ] CONFIGURATION SAVED

---

## 🧪 CORS TESTING

### Test 1: Verify CORS Headers

**Command:**
```powershell
curl.exe -X OPTIONS "https://strapi.opusinfiniti.com/api/articles" `
  -H "Origin: http://localhost:3000" `
  -H "Access-Control-Request-Method: GET" `
  -v 2>&1 | Select-String "Access-Control"
```

**Expected Output Should Show:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept
Access-Control-Max-Age: 86400
```

**Status:** [ ] TEST PASSED

---

### Test 2: GET Request with CORS

**Command:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Origin: http://localhost:3000" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -v 2>&1 | Select-String "HTTP\|200\|Access-Control"
```

**Expected:** HTTP 200 with CORS headers

**Status:** [ ] TEST PASSED

---

### Test 3: Unauthorized Origin (Should Fail)

**Command:**
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles" `
  -H "Origin: http://malicious.com" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -v 2>&1 | Select-String "Access-Control-Allow-Origin"
```

**Expected:** No "Access-Control-Allow-Origin" header (request blocked)

**Status:** [ ] TEST PASSED (security verified)

---

## ✅ TASK #4 COMPLETION CHECKLIST

- [ ] CORS enabled
- [ ] 10+ origins configured
- [ ] All HTTP methods enabled
- [ ] Required headers configured
- [ ] Max Age set to 86400
- [ ] Credentials set to OFF
- [ ] Configuration saved
- [ ] All 3 tests passed
- [ ] Security verified (unauthorized origin rejected)

---

## 📝 CONFIGURATION SUMMARY

**Document your settings:**

```
CORS Configuration Summary
══════════════════════════════════════════

Status:              [ ] ENABLED
Origins Added:       [ ] 10+
Methods Configured:  [ ] GET, POST, PUT, DELETE, PATCH, OPTIONS
Headers:             [ ] Content-Type, Authorization, X-Requested-With, Accept
Max Age:             [ ] 86400
Credentials:         [ ] OFF
Tests Passed:        [ ] 3/3

Configuration Date:  _______________
Configured By:       _______________
Sign-off:            [ ] APPROVED [ ] NEEDS REVISION
```

---

## ✅ SIGN-OFF

**Task #4 Complete:** [ ] YES [ ] NO

**Ready for Task #5 (Email Configuration):** [ ] YES [ ] NO

---

**Follow the 8 steps above and confirm when complete!**


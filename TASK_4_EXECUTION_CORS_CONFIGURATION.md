# 🚀 TASK #4 EXECUTION GUIDE: CORS CONFIGURATION

**Project:** NewsKarnataka Platform  
**Task:** Day 3-4 CORS Configuration Setup  
**Status:** READY FOR EXECUTION  
**Estimated Time:** 1-2 hours  

---

## 🎯 TASK #4 OBJECTIVES

### Goals
1. ✅ Enable CORS in Strapi
2. ✅ Configure allowed origins (10+ environments)
3. ✅ Configure HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
4. ✅ Configure headers (Content-Type, Authorization, etc.)
5. ✅ Set Max Age (86400 seconds = 24 hours)
6. ✅ Test CORS with all origins
7. ✅ Verify cross-origin requests work

---

## 📍 CURRENT STATUS

**Prerequisites:**
- ✅ Strapi admin access working
- ✅ Database verified
- ✅ API tokens generated (Task #3)
- ✅ Ready for CORS configuration

---

## 📋 STEP-BY-STEP EXECUTION

### STEP 1: Login to Strapi Admin

**Action:**
1. Open browser
2. Navigate to: https://strapi.opusinfiniti.com/admin
3. Login with credentials:
   - Email: reachus@opusinfiniti.com
   - Password: Opus@321$%^

**Expected:** Dashboard displays

**Verification:** [ ] LOGGED IN

---

### STEP 2: Navigate to CORS Settings

**Action:**
1. Click **Settings** (gear icon, bottom left)
2. Look for **Providers** in left menu
3. Click on **Providers**
4. Find **CORS** in the providers list
5. Click on **CORS**

**Expected Screen:**
```
CORS Configuration
├─ Enable CORS toggle (currently OFF)
├─ Allowed Origins field
├─ Allowed Methods checkboxes
├─ Allowed Headers field
├─ Max Age field
├─ Credentials toggle
└─ Save Changes button
```

**Alternative Path (if above doesn't work):**
- Settings → Settings (or Advanced Settings)
- Look for "CORS" or "Security"
- Or search for "CORS" in settings

**Verification:** [ ] CORS SETTINGS PAGE ACCESSIBLE

---

### STEP 3: Enable CORS

**Action:**
1. Find the toggle for **"Enable CORS"** or **"CORS Enabled"**
2. The toggle is currently OFF (greyed out)
3. Click on the toggle to turn it ON
4. The toggle should turn blue/green
5. Configuration fields become editable

**Expected:**
```
CORS is now ENABLED
All fields below are now active and editable
```

**Verification:** [ ] CORS ENABLED

---

### STEP 4: Configure Allowed Origins

**What are Origins?**
- Origins are where requests come from
- Format: `protocol://domain:port`
- Examples: `http://localhost:3000`, `https://newskarnataka.com`

**Origins to Add:**

**Development Origins:**
```
http://localhost:3000
http://localhost:3001
http://localhost:1337
http://127.0.0.1:3000
```

**Staging Origins:**
```
https://staging.newskarnataka.com
https://staging-console.newskarnataka.com
```

**Production Origins:**
```
https://newskarnataka.com
https://console.newskarnataka.com
https://api.newskarnataka.com
https://www.newskarnataka.com
```

**Action:**

1. Find the **"Allowed Origins"** field
2. This is usually a text area or list interface
3. Enter all origins (one per line)
4. Format: Copy-paste all origins below

```
http://localhost:3000
http://localhost:3001
http://localhost:1337
http://127.0.0.1:3000
https://staging.newskarnataka.com
https://staging-console.newskarnataka.com
https://newskarnataka.com
https://console.newskarnataka.com
https://api.newskarnataka.com
https://www.newskarnataka.com
```

**Visual Example:**
```
┌─────────────────────────────────────┐
│ Allowed Origins                      │
├─────────────────────────────────────┤
│ http://localhost:3000               │
│ http://localhost:3001               │
│ http://localhost:1337               │
│ http://127.0.0.1:3000               │
│ https://staging.newskarnataka.com   │
│ https://staging-console...          │
│ https://newskarnataka.com           │
│ https://console.newskarnataka.com   │
│ https://api.newskarnataka.com       │
│ https://www.newskarnataka.com       │
└─────────────────────────────────────┘
```

**Verification:** [ ] ALL ORIGINS ADDED

---

### STEP 5: Configure Allowed Methods

**What are Methods?**
- HTTP methods are actions like GET, POST, PUT, DELETE
- Need to enable all methods that your API uses

**Methods to Enable:**
```
☑ GET      (Read data)
☑ POST     (Create data)
☑ PUT      (Update data)
☑ DELETE   (Delete data)
☑ PATCH    (Partial update)
☑ OPTIONS  (CORS preflight)
☑ HEAD     (Optional, for metadata)
```

**Action:**
1. Find the **"Allowed Methods"** section
2. Usually shows as checkboxes or a multi-select
3. Check/select all methods listed above
4. Ensure all are checked (blue checkmarks)

**Visual Example:**
```
☑ GET
☑ POST
☑ PUT
☑ DELETE
☑ PATCH
☑ OPTIONS
☑ HEAD
```

**Verification:** [ ] ALL METHODS SELECTED

---

### STEP 6: Configure Allowed Headers

**What are Headers?**
- Headers provide metadata about the request
- Essential for authentication and content type

**Headers to Allow:**
```
Content-Type
Authorization
X-Requested-With
Accept
```

**Action:**
1. Find the **"Allowed Headers"** field
2. This is usually a text field or list
3. Enter headers comma-separated or one per line
4. Format:

```
Content-Type, Authorization, X-Requested-With, Accept
```

**Or (one per line):**
```
Content-Type
Authorization
X-Requested-With
Accept
```

**Visual Example:**
```
┌──────────────────────────────────────┐
│ Allowed Headers                      │
├──────────────────────────────────────┤
│ Content-Type, Authorization,         │
│ X-Requested-With, Accept             │
└──────────────────────────────────────┘
```

**Verification:** [ ] REQUIRED HEADERS CONFIGURED

---

### STEP 7: Configure Max Age

**What is Max Age?**
- Time (in seconds) that preflight response can be cached
- Reduces repeated preflight requests
- Standard value: 86400 (24 hours)

**Action:**
1. Find the **"Max Age"** field
2. It usually contains a number
3. Clear existing value
4. Enter: **86400**

**Visual Example:**
```
Max Age (seconds): [86400]
```

**Explanation:**
```
86400 seconds = 24 hours
This means:
- Browser caches preflight response for 24 hours
- After 24 hours, browser sends new preflight request
- Reduces overhead and improves performance
```

**Verification:** [ ] MAX AGE SET TO 86400

---

### STEP 8: Configure Credentials

**What are Credentials?**
- Cookies and authentication credentials
- For most APIs: Keep OFF (false)
- Reasons:
  - Added security
  - Prevents accidental credential leaks
  - Can be changed later if needed

**Action:**
1. Find the **"Credentials"** toggle
2. Ensure it's set to **OFF** or **FALSE**
3. Do NOT enable (leave unchecked)

**Visual Example:**
```
Send Credentials: [OFF/FALSE] ☐
```

**Note:**
- If you need credentials later, this can be changed
- For Week 1, keep it OFF for maximum security

**Verification:** [ ] CREDENTIALS SET TO OFF

---

### STEP 9: Save CORS Configuration

**Action:**
1. Review all settings one more time:
   - [ ] CORS: ENABLED
   - [ ] Origins: 10+ configured
   - [ ] Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   - [ ] Headers: Content-Type, Authorization, X-Requested-With, Accept
   - [ ] Max Age: 86400
   - [ ] Credentials: OFF/FALSE

2. Look for **"Save Changes"** or **"Save"** button
3. Usually blue button at bottom right
4. Click the button
5. Wait for confirmation (2-5 seconds)

**Expected Result:**
```
✅ "CORS configuration saved successfully"
Or similar success message appears
```

**Visual Confirmation:**
```
┌─────────────────────────────────────┐
│ ✅ Changes saved successfully       │
│ Your CORS configuration is active   │
└─────────────────────────────────────┘
```

**Verification:** [ ] CORS CONFIGURATION SAVED

---

### STEP 10: Test CORS Configuration

**Test 1: Preflight Request (OPTIONS)**

**Action:**
1. Open PowerShell or Command Prompt
2. Run this command:

```powershell
curl.exe -X OPTIONS "https://strapi.opusinfiniti.com/api/articles" `
  -H "Origin: http://localhost:3000" `
  -H "Access-Control-Request-Method: GET" `
  -H "Access-Control-Request-Headers: Content-Type" `
  -v
```

**Expected Response (in headers section):**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept
Access-Control-Max-Age: 86400
```

**If successful:**
```
✅ TEST PASSED
Browser will allow the actual request
```

**Verification:** [ ] PREFLIGHT TEST PASSED

---

**Test 2: Actual GET Request with CORS**

**Action:**
1. Run this command (use your dev token from Task #3):

```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Origin: http://localhost:3000" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -v
```

**Replace:** `YOUR_DEV_TOKEN` with your actual development token

**Expected Response:**
```
Status: 200 OK
CORS Headers: Present
Response: JSON article data
```

**If successful:**
```
✅ TEST PASSED
CORS is working with authentication
```

**Verification:** [ ] GET REQUEST TEST PASSED

---

**Test 3: POST Request with CORS**

**Action:**
1. Run this command:

```powershell
curl.exe -X POST "https://strapi.opusinfiniti.com/api/articles" `
  -H "Origin: http://localhost:3000" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"data":{"title":"Test","slug":"test","content":"Test content"}}'
```

**Expected Response:**
```
Status: 200 or 201
Response: Created article data
```

**Verification:** [ ] POST REQUEST TEST PASSED

---

**Test 4: Unauthorized Origin (Should Fail)**

**Action:**
1. Run this command (intentionally wrong origin):

```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles" `
  -H "Origin: http://malicious.com" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -v
```

**Expected:**
```
Status: 200 (response still sent to server)
But: Access-Control-Allow-Origin header NOT in response
Browser: Will block response (CORS error in console)
```

**This means:**
```
✅ CORS Security Working
Unauthorized origin is correctly rejected
```

**Verification:** [ ] SECURITY TEST PASSED

---

## 📊 TASK #4 COMPLETION CHECKLIST

### CORS Configuration
- [ ] CORS enabled in Strapi
- [ ] 10+ origins configured
- [ ] All HTTP methods enabled
- [ ] Required headers configured
- [ ] Max Age set to 86400
- [ ] Credentials set to OFF
- [ ] Configuration saved

### Testing
- [ ] Preflight (OPTIONS) test passed
- [ ] GET request test passed
- [ ] POST request test passed
- [ ] Security test passed (unauthorized origin rejected)
- [ ] All tests successful

### Documentation
- [ ] CORS settings documented
- [ ] Test results documented
- [ ] Configuration verified

---

## ✅ SUCCESS CRITERIA

### Task #4 Complete When:
✅ CORS enabled and configured
✅ 10+ origins added
✅ All methods configured (GET, POST, PUT, DELETE, PATCH, OPTIONS)
✅ Required headers configured
✅ Max Age set
✅ All 4 tests passed
✅ Configuration saved in Strapi

---

## 🎯 NEXT STEPS

After Task #4 complete:

**Task #5: Email & Provider Configuration** (1-2 hours)
- Configure SMTP email settings
- Setup email provider
- Send test email

See: `TASK_5_EXECUTION_EMAIL_CONFIGURATION.md`

---

## 📝 DOCUMENTATION

**Reference Files:**
- `WEEK_1_DAY_4_5_CORS_EMAIL_SETUP.md` (detailed technical guide)
- `TASK_4_EXECUTION_CORS_CONFIGURATION.md` (this file - execution guide)

---

## ✅ SIGN-OFF

**Task #4 Completion:**

**Completed By:**
- Name: ___________________________
- Date: ___________________________
- Time: ___________________________

**CORS Configuration Complete: [ ] YES [ ] NO**
**All Tests Passed: [ ] YES [ ] NO**
**Ready for Task #5: [ ] YES [ ] NO**

---

**Execute the steps above and confirm when complete.**


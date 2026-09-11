# 📅 WEEK 1 - DAY 4-5: CORS CONFIGURATION & EMAIL SETUP

**Project:** NewsKarnataka Platform  
**Phase:** Week 1 - Foundation Setup  
**Date:** Week 1, Day 4-5  
**Task:** CORS Configuration, Email Setup, Provider Configuration  
**Status:** READY FOR EXECUTION  

---

## 🎯 DAY 4-5 OBJECTIVES

### Primary Goals
1. ✅ Configure CORS for all environments
2. ✅ Setup email notifications
3. ✅ Configure authentication providers
4. ✅ Setup webhook framework
5. ✅ Test all configurations
6. ✅ Verify cross-origin requests
7. ✅ Document all settings

---

## 📋 CORS CONFIGURATION GUIDE

### Part 1: Understanding CORS

**What is CORS?**
- Cross-Origin Resource Sharing
- Allows requests from different origins
- Security mechanism to prevent unauthorized access
- Requires explicit configuration

**Why we need CORS:**
- Frontend (localhost:3000) calls API (strapi.opusinfiniti.com)
- Admin console (localhost:3001) calls API
- Production apps call production API
- Mobile apps call API endpoints

---

### Part 2: CORS Setup in Strapi

#### Step 1: Navigate to CORS Settings

**Location in Strapi Admin:**
```
Settings (bottom left) → Providers → CORS
```

**Detailed Path:**
1. Login to Strapi admin panel
2. Click Settings (gear icon, bottom left)
3. Find "Providers" in left menu
4. Click "Providers"
5. Find "CORS" in providers list
6. Click on CORS

**Expected Screen:**
```
CORS Configuration
├─ [Enable CORS] Toggle
├─ Allowed Origins: [Text area or list]
├─ Allowed Methods: [Checkboxes]
├─ Allowed Headers: [Checkboxes or text]
├─ Max Age: [Input field]
├─ Credentials: [Toggle]
└─ [Save Changes Button]
```

**Verification:** [ ] CORS settings page accessible

---

#### Step 2: Enable CORS

**Toggle CORS:**
1. Find "Enable CORS" toggle at top
2. Click toggle to enable
3. CORS configuration fields become active

**Verification:** [ ] CORS is enabled

---

#### Step 3: Configure Allowed Origins

**Origins to Add:**

```
Development Environment:
├─ http://localhost:3000
├─ http://localhost:3001
├─ http://localhost:1337
└─ http://127.0.0.1:3000

Staging Environment:
├─ https://staging.newskarnataka.com
└─ https://staging-console.newskarnataka.com

Production Environment:
├─ https://newskarnataka.com
├─ https://console.newskarnataka.com
├─ https://api.newskarnataka.com
└─ https://www.newskarnataka.com
```

**Input Format:**
- One origin per line (if text area)
- Or use list interface to add origins
- Include protocol (http:// or https://)
- Include port if not standard (80/443)

**Example Format:**
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

**Adding Origins:**
1. Find "Allowed Origins" field
2. Enter origins (one per line or via UI)
3. Verify all origins are listed
4. Click Save

**Verification:** [ ] All origins added correctly

---

#### Step 4: Configure Allowed Methods

**Methods to Allow:**
```
Required Methods:
├─ GET      (Read data)
├─ POST     (Create data)
├─ PUT      (Update data)
├─ DELETE   (Delete data)
├─ PATCH    (Partial update)
└─ OPTIONS  (CORS preflight)
```

**Setup Instructions:**
1. Find "Allowed Methods" section
2. Check/select all above methods:
   - [x] GET
   - [x] POST
   - [x] PUT
   - [x] DELETE
   - [x] PATCH
   - [x] OPTIONS
3. Verify all are selected
4. Click Save

**Verification:** [ ] All methods configured

---

#### Step 5: Configure Allowed Headers

**Headers to Allow:**
```
Essential Headers:
├─ Content-Type          (Request body format)
├─ Authorization         (Authentication token)
├─ X-Requested-With      (AJAX identification)
└─ Accept                (Response format)

Optional Headers:
├─ X-Custom-Header
└─ X-API-Key
```

**Setup Instructions:**
1. Find "Allowed Headers" section
2. Enter headers (comma-separated or via UI)
3. Minimum required:
   - Content-Type
   - Authorization
   - X-Requested-With
   - Accept
4. Click Save

**Format Example:**
```
Content-Type, Authorization, X-Requested-With, Accept
```

**Verification:** [ ] Required headers configured

---

#### Step 6: Configure Max Age

**Max Age Setting:**
- Controls how long preflight request is cached
- Recommended: 86400 (24 hours)
- Reduces overhead from repeated preflight requests

**Setup:**
1. Find "Max Age" field
2. Enter value: 86400
3. Click Save

**Verification:** [ ] Max Age set to 86400

---

#### Step 7: Configure Credentials

**Credentials Toggle:**
- Allow/disallow cookies and credentials in requests
- Set to: **false** (initially)
- Can be changed if needed for authentication

**Setup:**
1. Find "Credentials" toggle
2. Set to **false** (unchecked)
3. Note: Can be changed later if needed
4. Click Save

**Verification:** [ ] Credentials configured

---

#### Step 8: Save CORS Configuration

**Final Save:**
1. Review all settings:
   - [x] CORS enabled
   - [x] Origins configured
   - [x] Methods configured
   - [x] Headers configured
   - [x] Max Age set
   - [x] Credentials configured
2. Click "Save Changes" button
3. Wait for confirmation message

**Expected Result:**
```
✅ "CORS configuration saved successfully"
```

**Verification:** [ ] Settings saved

---

### Part 3: CORS Testing

#### Test 1: Preflight Request (OPTIONS)

**Command:**
```bash
curl -X OPTIONS "https://strapi.opusinfiniti.com/api/articles" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Headers in Response:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept
Access-Control-Max-Age: 86400
```

**Test Status:** [ ] PASS [ ] FAIL

---

#### Test 2: GET Request with CORS

**Command:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v
```

**Expected Response:**
- Status: 200 OK
- Access-Control-Allow-Origin header present
- Data returned

**Test Status:** [ ] PASS [ ] FAIL

---

#### Test 3: POST Request with CORS

**Command:**
```bash
curl -X POST "https://strapi.opusinfiniti.com/api/articles" \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"data":{"title":"Test","slug":"test","content":"Test"}}'
```

**Expected Response:**
- Status: 200 or 201
- CORS headers present
- Data created

**Test Status:** [ ] PASS [ ] FAIL

---

#### Test 4: Invalid Origin Test

**Command:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles" \
  -H "Origin: http://malicious.com" \
  -v
```

**Expected Response:**
- Status: 200 (but no CORS headers)
- Access-Control-Allow-Origin header: NOT present
- Browser will block response

**Test Status:** [ ] PASS [ ] FAIL

---

## 📨 EMAIL CONFIGURATION GUIDE

### Part 1: Email Setup Location

**Location in Strapi Admin:**
```
Settings (bottom left) → Email Configuration
```

**Or sometimes:**
```
Settings → Providers → Email
```

**Expected Screen:**
```
Email Configuration
├─ Provider: [Dropdown - SendGrid, Mailgun, SMTP, etc.]
├─ From Email: [email address]
├─ From Name: [display name]
├─ SMTP Host: [hostname]
├─ SMTP Port: [port number]
├─ SMTP Username: [username]
├─ SMTP Password: [password]
└─ [Save Changes Button]
```

---

### Part 2: SMTP Configuration

**Choose Provider:**
1. Navigate to Email Configuration
2. Select "SMTP" from Provider dropdown
3. Enter SMTP details:

**SMTP Settings:**
```
Provider:              SMTP
From Email:            noreply@newskarnataka.com
From Name:             NewsKarnataka Platform
SMTP Host:             [Your SMTP server]
SMTP Port:             587 (TLS) or 465 (SSL)
SMTP Username:         [Your username]
SMTP Password:         [Your password]
Secure (SSL/TLS):      true
Require TLS/SSL:       true
```

**Common SMTP Providers:**
- Gmail: smtp.gmail.com (587 with app password)
- SendGrid: smtp.sendgrid.net (587)
- Mailgun: smtp.mailgun.org (587)
- AWS SES: email-smtp.[region].amazonaws.com (587)

**Setup Instructions:**
1. Enter provider details
2. Set "From Email" to notification address
3. Set "From Name" to display name
4. Click "Save Changes"

**Verification:** [ ] SMTP configured

---

### Part 3: Email Testing

**Send Test Email:**
1. After saving SMTP config
2. Look for "Send Test Email" button
3. Enter test email address
4. Click "Send Test"
5. Check email inbox for test message

**Expected Result:**
```
✅ Test email received in inbox
✅ Email from: NewsKarnataka Platform
✅ Subject contains: "Test" or "Configuration"
```

**Test Status:** [ ] PASS [ ] FAIL

---

## 🔐 AUTHENTICATION PROVIDER CONFIGURATION

### Part 1: Available Providers

**Authentication Methods:**
```
├─ Email & Password   (Default)
├─ Google OAuth       (Optional)
├─ GitHub OAuth       (Optional)
├─ Twitter OAuth      (Optional)
├─ Discord OAuth      (Optional)
└─ Custom JWT         (Optional)
```

### Part 2: Basic Provider Setup

**For Development:**
- Email & Password only (already default)
- No external providers needed

**For Future Production:**
- Google OAuth (for easier login)
- GitHub OAuth (for developer accounts)

**Current Setup (Week 1):**
- Focus on Email & Password
- OAuth setup: Week 8+ (future)

**Verification:** [ ] Basic auth ready

---

## 🪝 WEBHOOK FRAMEWORK SETUP

### Part 1: Webhook Configuration

**Location in Strapi Admin:**
```
Settings (bottom left) → Webhooks
```

**Initial Framework Setup:**
1. Navigate to Webhooks
2. Do NOT create webhooks yet
3. Verify section exists and is accessible
4. Note available webhook events

**Available Events:**
```
Webhooks can trigger on:
├─ entry.create
├─ entry.update
├─ entry.delete
├─ entry.publish
├─ entry.unpublish
└─ And more...
```

**Verification:** [ ] Webhooks section accessible

---

### Part 2: Webhook Documentation

**Create Webhook Documentation:**
```
Future Webhook Triggers:
├─ Article Created
│  └─ Event: articles.create
│     URL: https://newskarnataka.com/api/webhooks/article-created
│
├─ Article Published
│  └─ Event: articles.publish
│     URL: https://newskarnataka.com/api/webhooks/article-published
│
├─ User Registered
│  └─ Event: users.create
│     URL: https://newskarnataka.com/api/webhooks/user-registered
│
└─ Comment Posted
   └─ Event: comments.create
      URL: https://newskarnataka.com/api/webhooks/comment-posted
```

**Setup Status:** Framework ready for Week 8+

---

## 🧪 COMPREHENSIVE CONFIGURATION TESTING

### Test 1: CORS Origin Verification

**All Origins Test:**
```
Origins to test:
├─ http://localhost:3000 → [ ] PASS
├─ http://localhost:3001 → [ ] PASS
├─ http://localhost:1337 → [ ] PASS
├─ https://staging.newskarnataka.com → [ ] PASS
├─ https://newskarnataka.com → [ ] PASS
└─ http://unauthorized.com → [ ] REJECTED
```

---

### Test 2: Email Configuration

**Test Email Delivery:**
```
Recipient: [test@example.com]
Subject: Test Configuration
Expected: Email arrives within 1 minute

Test Status: [ ] PASS [ ] FAIL

Time to delivery: _____ seconds
Email content: ___________________________
```

---

### Test 3: CORS with Authentication

**Test Authenticated Request:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles" \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer YOUR_DEV_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
- Status: 200
- CORS headers present
- Data returned
- Authorization working

**Test Status:** [ ] PASS [ ] FAIL

---

### Test 4: Cross-Origin Error Handling

**Test Invalid Origin:**
```
Send request from: http://unauthorized.com
Expected: Browser blocks response (CORS error in console)
Strapi Response: 200 OK (but browser enforces CORS)
```

**Test Status:** [ ] PASS [ ] FAIL

---

## 📊 CONFIGURATION SUMMARY

### Day 4-5 Checklist

**Morning (Day 4):**
- [ ] CORS configuration completed
- [ ] All origins added (10+)
- [ ] Methods configured (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- [ ] Headers configured (Content-Type, Authorization, etc.)
- [ ] Max Age set to 86400

**Afternoon (Day 4):**
- [ ] CORS testing completed (4 tests)
- [ ] All tests passing
- [ ] Email setup initiated

**Day 5 (Final):**
- [ ] Email configuration complete
- [ ] Test email sent successfully
- [ ] Provider configuration documented
- [ ] Webhook framework verified
- [ ] All configurations tested

---

## ✅ SUCCESS CRITERIA

### CORS Configuration
- [x] CORS enabled in Strapi
- [x] All environments added (Dev, Staging, Prod)
- [x] All HTTP methods configured
- [x] Required headers configured
- [x] Max Age set
- [x] All tests passing

### Email Configuration
- [x] SMTP configured
- [x] From email set
- [x] Test email sends successfully
- [x] Email arrives promptly

### Provider Configuration
- [x] Authentication providers reviewed
- [x] Basic auth verified
- [x] OAuth documented for future use

### Webhook Framework
- [x] Webhooks section verified
- [x] Future events documented
- [x] Framework ready for Week 8+

---

## 📝 DOCUMENTATION & NOTES

### CORS Configuration Documented:
- Allowed Origins: _____ (number)
- Allowed Methods: _____ (methods)
- Max Age: 86400
- Credentials: false

### Email Configuration Documented:
- Provider: SMTP
- From Email: _____________________
- From Name: _____________________
- SMTP Host: _____________________

### Testing Results:
_________________________________________________________

_________________________________________________________

---

## ✅ SIGN-OFF

### Completed By:
- Name: ___________________________
- Date: ___________________________
- Time: ___________________________

### All Configurations Complete: [ ] YES [ ] NO

### All Tests Passed: [ ] YES [ ] NO

### Ready for Day 5 (Final Testing): [ ] YES [ ] NO

---

## 🎯 NEXT STEPS (Day 5)

After CORS & Email setup completion, proceed to:

**Day 5: Comprehensive Testing & Verification**

Objectives:
1. Run all previous tests again
2. Integration testing (all systems)
3. Performance benchmarking
4. Security verification
5. Final readiness assessment

---

**Note:** All configurations must be tested and documented before moving to Day 5.


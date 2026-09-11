# 📅 WEEK 1 - DAY 3: API TOKEN GENERATION & MANAGEMENT

**Project:** NewsKarnataka Platform  
**Phase:** Week 1 - Foundation Setup  
**Date:** Week 1, Day 3  
**Task:** API Token Generation & Management  
**Status:** READY FOR EXECUTION  

---

## 🎯 DAY 3 OBJECTIVES

### Primary Goals
1. ✅ Generate development API token
2. ✅ Generate staging API token  
3. ✅ Generate production API token
4. ✅ Document all tokens securely
5. ✅ Test each token for validity
6. ✅ Configure token expiration policies
7. ✅ Setup token rotation schedule

---

## 📋 API TOKEN GENERATION GUIDE

### Part 1: Accessing API Token Management

#### Step 1: Navigate to API Tokens Section

**Location in Strapi Admin:**
```
Settings (bottom left) → API Tokens → [Manage Tokens]
```

**Detailed Path:**
1. Login to Strapi admin panel
2. Look for Settings icon (gear icon, bottom left)
3. Click Settings
4. Find "API Tokens" in the left menu
5. Click on "API Tokens"

**Expected Screen:**
```
API Tokens
├─ [Create new API token] Button
├─ [Existing tokens table]
│  ├─ Token Name
│  ├─ Type (Full access, Limited, Custom)
│  ├─ Duration
│  ├─ Created
│  ├─ Actions (Edit, Revoke, Copy)
```

**Verification:** [ ] API Tokens page accessible

---

### Part 2: Generate Development API Token

#### Step 1: Create New Token

**Click:** "Create new API token" button

**Token Creation Form:**
```
Create API Token
├─ Name:        [Text field]
├─ Description: [Text field]
├─ Type:        [Dropdown - Select "Full access" or "Limited"]
├─ Duration:    [Dropdown - Select expiration]
└─ [Create Button]
```

#### Step 2: Fill in Development Token Details

**Token Configuration:**
```
Name:           NewsKarnataka Backend Dev
Description:    Development API token for local development
Type:           Full access (for development flexibility)
Duration:       30 days (or until next token rotation)
```

**Rationale:**
- Name: Clear identification
- Full access: Allows testing all endpoints
- 30 days: Frequent rotation for security

#### Step 3: Create Token

1. Click "Create" or "Save" button
2. System generates token
3. Token displayed on screen (usually once)

**⚠️ IMPORTANT:** Copy token immediately - it won't be shown again!

#### Step 4: Save Development Token

**Create File:** `WEEK_1_API_TOKENS_DEV.txt`

**File Location:** Secure location (NOT in public repo)

**Content:**
```
═══════════════════════════════════════════════════════════
DEVELOPMENT API TOKEN - STRAPI
═══════════════════════════════════════════════════════════

Token Name:              NewsKarnataka Backend Dev
Environment:             Development (Local)
Created Date:            [Date]
Created Time:            [Time]
Expiration Date:         [+30 days from now]

Token Value:
[PASTE TOKEN HERE]

Base URL:                https://strapi.opusinfiniti.com/api
Auth Header:             Authorization: Bearer [TOKEN]

Usage:
- Local development
- Testing endpoints
- Frontend development
- Backend testing

Rotation Schedule:       Every 30 days
Last Rotated:            [Today's date]
Next Rotation Due:       [Date 30 days from now]

SECURITY NOTES:
- Keep this file encrypted
- Never commit to git
- Never share via email
- Only share with local team
- Delete after rotation

═══════════════════════════════════════════════════════════
```

**Storage:** Secure encrypted location

**Access:** Only local development team

---

### Part 3: Generate Staging API Token

#### Step 1: Create Staging Token

**Return to:** Settings → API Tokens

**Click:** "Create new API token" button

#### Step 2: Fill in Staging Token Details

**Token Configuration:**
```
Name:           NewsKarnataka Backend Staging
Description:    Staging environment API token
Type:           Limited (for staging security)
Duration:       60 days (staging is longer-lived)
```

**Permissions Configuration (if available):**
```
Permissions:
├─ Read access:    YES (all endpoints)
├─ Write access:   YES (limited)
├─ Delete access:  NO (prevent accidental deletion)
├─ Admin access:   NO (staging doesn't need admin)
```

#### Step 3: Save Staging Token

**Create File:** `WEEK_1_API_TOKENS_STAGING.txt`

**Content:**
```
═══════════════════════════════════════════════════════════
STAGING API TOKEN - STRAPI
═══════════════════════════════════════════════════════════

Token Name:              NewsKarnataka Backend Staging
Environment:             Staging (Testing environment)
Created Date:            [Date]
Created Time:            [Time]
Expiration Date:         [+60 days from now]

Token Value:
[PASTE TOKEN HERE]

Base URL:                https://strapi.opusinfiniti.com/api
Auth Header:             Authorization: Bearer [TOKEN]

Usage:
- Staging environment
- Pre-production testing
- Client UAT preparation
- Integration testing

Rotation Schedule:       Every 60 days
Last Rotated:            [Today's date]
Next Rotation Due:       [Date 60 days from now]

Permissions:             Limited (read-heavy)
  ├─ Create:    YES
  ├─ Read:      YES
  ├─ Update:    YES
  ├─ Delete:    NO
  └─ Admin:     NO

SECURITY NOTES:
- Keep this file encrypted
- Restrict to staging team
- Don't use in production
- Monitor for unauthorized access
- Rotate every 60 days

═══════════════════════════════════════════════════════════
```

**Storage:** Secure encrypted location (staging server)

**Access:** Staging team only

---

### Part 4: Generate Production API Token

#### Step 1: Create Production Token

**Return to:** Settings → API Tokens

**Click:** "Create new API token" button

#### Step 2: Fill in Production Token Details

**Token Configuration:**
```
Name:           NewsKarnataka Backend Production
Description:    Production environment API token
Type:           Limited (maximum production security)
Duration:       90 days (rotation required quarterly)
```

**Permissions Configuration (if available):**
```
Permissions:
├─ Read access:    YES (all endpoints needed)
├─ Write access:   LIMITED (only critical operations)
├─ Delete access:  NO (prevent data loss)
├─ Admin access:   NO (production safety)
```

#### Step 3: Save Production Token

**Create File:** `WEEK_1_API_TOKENS_PRODUCTION.txt`

**Content:**
```
═══════════════════════════════════════════════════════════
PRODUCTION API TOKEN - STRAPI
═══════════════════════════════════════════════════════════

Token Name:              NewsKarnataka Backend Production
Environment:             Production (Live)
Created Date:            [Date]
Created Time:            [Time]
Expiration Date:         [+90 days from now]

Token Value:
[PASTE TOKEN HERE]

Base URL:                https://strapi.opusinfiniti.com/api
Auth Header:             Authorization: Bearer [TOKEN]

Usage:
- Production environment
- Live application
- Customer-facing content
- Critical operations

Rotation Schedule:       Every 90 days (MANDATORY)
Last Rotated:            [Today's date]
Next Rotation Due:       [Date 90 days from now]

Permissions:             Limited (strict read-only for most)
  ├─ Create:    NO
  ├─ Read:      YES
  ├─ Update:    LIMITED (scheduled content only)
  ├─ Delete:    NO
  └─ Admin:     NO

SECURITY MEASURES:
- Encrypted storage ONLY
- Access via vault/secrets manager
- Restricted to production servers
- Never in code or logs
- Monthly access audit
- Immediate revocation if leaked
- Never share via any channel

EMERGENCY PROCEDURES:
If token is compromised:
1. Immediately revoke this token
2. Generate new production token
3. Update all production systems
4. Review access logs
5. Escalate to security team

═══════════════════════════════════════════════════════════
```

**Storage:** Vault/Secrets Manager (highest security)

**Access:** Production team + DevOps only

---

## 🧪 API TOKEN TESTING

### Test 1: Development Token Validation

**Objective:** Verify development token works

**Test Command (REST API):**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Article Title",
        "slug": "article-slug",
        ...
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 1,
      "total": X,
      "pageCount": Y
    }
  }
}
```

**Test Status:** [ ] PASS [ ] FAIL

**Response Time:** ___________ms

**Notes:** _________________

---

### Test 2: Staging Token Validation

**Objective:** Verify staging token works

**Test Command:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_STAGING_TOKEN"
```

**Expected Response:** Same as Dev token

**Test Status:** [ ] PASS [ ] FAIL

**Response Time:** ___________ms

---

### Test 3: Production Token Validation

**Objective:** Verify production token works

**Test Command:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_PROD_TOKEN"
```

**Expected Response:** Same as Dev token

**Test Status:** [ ] PASS [ ] FAIL

**Response Time:** ___________ms

---

### Test 4: Invalid Token Test

**Objective:** Verify invalid token is rejected

**Test Command:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles" \
  -H "Authorization: Bearer invalid_token_xyz"
```

**Expected Response (Error):**
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Invalid token"
  }
}
```

**Test Status:** [ ] PASS [ ] FAIL

---

### Test 5: Token Expiration Test

**Objective:** Verify expired token is rejected

**Test Command:**
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles" \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

**Expected Response (Error):**
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Token expired"
  }
}
```

**Test Status:** [ ] PASS [ ] FAIL [ ] N/A

---

### Test 6: Token Revocation Test

**Objective:** Verify revoked token is rejected

**Steps:**
1. Note current token value
2. Navigate to API Tokens in admin
3. Find the token in list
4. Click "Revoke" or similar
5. Try using the token

**Expected Response:** 401 Unauthorized

**Test Status:** [ ] PASS [ ] FAIL

---

## 📊 TOKEN INVENTORY

### Development Tokens
```
Token:              NewsKarnataka Backend Dev
Created:            [Date]
Expires:            [Date + 30 days]
Status:             [ ] ACTIVE [ ] EXPIRED [ ] REVOKED
Last Used:          [Date/Time]
Test Status:        [ ] PASS [ ] FAIL
```

### Staging Tokens
```
Token:              NewsKarnataka Backend Staging
Created:            [Date]
Expires:            [Date + 60 days]
Status:             [ ] ACTIVE [ ] EXPIRED [ ] REVOKED
Last Used:          [Date/Time]
Test Status:        [ ] PASS [ ] FAIL
```

### Production Tokens
```
Token:              NewsKarnataka Backend Production
Created:            [Date]
Expires:            [Date + 90 days]
Status:             [ ] ACTIVE [ ] EXPIRED [ ] REVOKED
Last Used:          [Date/Time]
Test Status:        [ ] PASS [ ] FAIL
```

---

## 🔄 TOKEN ROTATION SCHEDULE

### Development Tokens
- Rotation Frequency: Every 30 days
- Next Rotation: [Date]
- Responsible Person: ___________________________

### Staging Tokens
- Rotation Frequency: Every 60 days
- Next Rotation: [Date]
- Responsible Person: ___________________________

### Production Tokens
- Rotation Frequency: Every 90 days (MANDATORY)
- Next Rotation: [Date]
- Responsible Person: ___________________________

---

## ✅ SECURITY CHECKLIST

- [ ] All 3 tokens generated successfully
- [ ] Dev token stored in secure location
- [ ] Staging token stored in secure location
- [ ] Production token stored in vault
- [ ] All tokens tested and working
- [ ] Token rotation schedule created
- [ ] No tokens committed to git
- [ ] No tokens in environment files (git)
- [ ] Secure .env files created for each environment
- [ ] Team notified of token locations
- [ ] Access restrictions enforced

---

## 📝 DOCUMENTATION & NOTES

### What Was Accomplished:
_________________________________________________________

_________________________________________________________

### Any Issues Encountered:
_________________________________________________________

_________________________________________________________

### Actions Taken to Resolve:
_________________________________________________________

_________________________________________________________

### Token Test Results Summary:
_________________________________________________________

---

## ✅ SIGN-OFF

### Completed By:
- Name: ___________________________
- Date: ___________________________
- Time: ___________________________

### All Tokens Generated: [ ] YES [ ] NO

### All Tokens Tested: [ ] YES [ ] NO

### Ready for Day 4 (CORS Configuration): [ ] YES [ ] NO

---

## 🎯 NEXT STEPS (Day 4)

After API token generation completion, proceed to:

**Day 3-4: CORS Configuration Setup**

Objectives:
1. Configure allowed origins
2. Setup allowed methods
3. Setup allowed headers
4. Test CORS with all tokens
5. Document CORS settings

---

**Note:** All tokens must be tested and functional before proceeding to CORS configuration.


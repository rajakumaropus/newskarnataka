# 🚀 TASK #3 EXECUTION GUIDE: API TOKEN GENERATION & MANAGEMENT

**Project:** NewsKarnataka Platform  
**Task:** Day 2-3 API Token Generation & Management  
**Status:** EXECUTION IN PROGRESS  

---

## ✅ TASK COMPLETION CHECKLIST

### Pre-Execution Verification
- [x] Strapi admin panel accessible (from Task #1)
- [x] Database verified (from Task #2)
- [x] Admin credentials working
- [x] WEEK_1_DAY_3_API_TOKENS.md guide available
- [ ] Ready to generate tokens

---

## 🎯 EXECUTION STEPS

### Step 1: Access Strapi Admin Panel

**Action:**
1. Open browser
2. Navigate to: https://strapi.opusinfiniti.com/admin
3. Login with credentials:
   - Email: reachus@opusinfiniti.com
   - Password: Opus@321$%^

**Expected:** Admin dashboard displays

**Verification:** [ ] Admin panel accessible

---

### Step 2: Navigate to API Tokens Section

**Location Path:**
```
Strapi Admin Dashboard
└─ Settings (gear icon, bottom left)
   └─ API Tokens (in left menu)
```

**Action:**
1. Look for Settings (gear icon) in bottom left corner
2. Click on Settings
3. Find "API Tokens" in left navigation menu
4. Click on "API Tokens"

**Expected Screen Shows:**
- "Create new API token" button (or similar)
- List of existing tokens (if any)
- Table with columns: Name, Type, Duration, Created, Actions

**Verification:** [ ] API Tokens page accessible

---

### Step 3: Create Development Token

#### Click "Create new API token" Button

**Token Creation Dialog appears with fields:**
- Name
- Description
- Type (dropdown)
- Duration (dropdown)

#### Fill in Development Token Details

**Input Values:**
```
Name:           NewsKarnataka Backend Dev
Description:    Development API token for local development
Type:           Full access (select from dropdown)
Duration:       30 days (select from dropdown)
```

**Action:**
1. Click "Name" field
2. Clear any existing text
3. Type: "NewsKarnataka Backend Dev"
4. Click "Description" field
5. Type: "Development API token for local development"
6. Click "Type" dropdown
7. Select: "Full access"
8. Click "Duration" dropdown
9. Select: "30 days"

**Verification:** [ ] All fields filled correctly

---

#### Click "Create" or "Save" Button

**Action:**
1. Find the create/save button (usually blue)
2. Click button
3. Wait for token to generate (usually 2-5 seconds)

**Expected Result:**
- Token appears on screen (usually only shown once)
- Screen shows: "Token Created Successfully" or similar message
- Token value displayed in field (possibly masked)

**Verification:** [ ] Token generated

---

#### ⚠️ CRITICAL: COPY DEVELOPMENT TOKEN IMMEDIATELY

**Action:**
1. Locate the token value on screen
2. Click "Copy" button (if available) OR
3. Triple-click to select entire token
4. Press Ctrl+C to copy
5. Paste into temporary location (Notepad)

**Storage Location:**
```
File: STRAPI_DEV_TOKEN.txt (LOCAL MACHINE, NOT IN GIT)
Content: [PASTE TOKEN HERE]
```

**Example Token Format:**
```
3a9f8c7e6d5b4a2f1e9c8d7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f
```

**Verification:** [ ] Token copied and saved

---

### Step 4: Test Development Token

**Action:**
1. Open terminal/command prompt
2. Run test command:

```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_DEV_TOKEN"
```

**Replace:** YOUR_DEV_TOKEN with actual token value

**Expected Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Article Title",
        ...
      }
    }
  ],
  "meta": {
    "pagination": { ... }
  }
}
```

**If Error (401 Unauthorized):**
- Token not copied correctly
- Token format wrong
- Token already revoked
- Action: Re-copy token and retry

**Verification:** [ ] Dev token working

---

### Step 5: Create Staging Token

**Action:**
1. Return to Strapi admin: Settings → API Tokens
2. Click "Create new API token" again

**Input Values:**
```
Name:           NewsKarnataka Backend Staging
Description:    Staging environment API token
Type:           Read-only (select from dropdown) - restricts to read operations only
Duration:       60 days (select from dropdown)
```

**Action:**
1. Fill in all fields as above
2. Click "Create"
3. Wait for token generation
4. Copy token immediately

**Storage Location:**
```
File: STRAPI_STAGING_TOKEN.txt (STAGING SERVER, SECURE)
Content: [PASTE TOKEN HERE]
```

**Verification:** [ ] Staging token created and saved

---

### Step 6: Test Staging Token

**Action:**
1. Open terminal
2. Run test command with staging token:

```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_STAGING_TOKEN"
```

**Expected Response:** Same JSON as dev token test

**Verification:** [ ] Staging token working

---

### Step 7: Create Production Token

**Action:**
1. Return to Strapi admin: Settings → API Tokens
2. Click "Create new API token"

**Input Values:**
```
Name:           NewsKarnataka Backend Production
Description:    Production environment API token
Type:           Read-only (select from dropdown) - restricts to read operations only
Duration:       90 days (select from dropdown)
```

**Action:**
1. Fill in all fields
2. Click "Create"
3. Wait for token generation
4. Copy token immediately

**Storage Location:**
```
File: STRAPI_PROD_TOKEN.txt (VAULT/SECRETS MANAGER, MAXIMUM SECURITY)
Content: [PASTE TOKEN HERE]

IMPORTANT: This token should be:
- Stored in a secure vault (not in git)
- Accessed via secrets manager
- Never shared via email or chat
- Only used by authorized production servers
```

**Verification:** [ ] Production token created and saved

---

### Step 8: Test Production Token

**Action:**
1. Open terminal
2. Run test command with production token:

```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" \
  -H "Authorization: Bearer YOUR_PROD_TOKEN"
```

**Expected Response:** Same JSON as other tokens

**Verification:** [ ] Production token working

---

### Step 9: Verify All Tokens in Admin Panel

**Action:**
1. Navigate to Settings → API Tokens in Strapi admin
2. Look for the 3 tokens you created:
   - NewsKarnataka Backend Dev
   - NewsKarnataka Backend Staging
   - NewsKarnataka Backend Production

3. Verify each token:
   - [ ] Name is correct
   - [ ] Type is correct
   - [ ] Duration shows correct expiration
   - [ ] Status is ACTIVE

**Expected Screen:**
```
API Tokens List:
┌────────────────────────────────────────────────────────┐
│ Name                              │ Type    │ Expires  │
├─────────────────────────────────────────────────────────┤
│ NewsKarnataka Backend Dev         │ Full    │ 30 days  │
│ NewsKarnataka Backend Staging     │ Limited │ 60 days  │
│ NewsKarnataka Backend Production  │ Limited │ 90 days  │
└────────────────────────────────────────────────────────┘
```

**Verification:** [ ] All 3 tokens visible and active

---

## 📊 TOKEN STATUS SUMMARY

### Development Token
```
Name:           NewsKarnataka Backend Dev
Created:        [Today's date]
Expires:        [30 days from today]
Status:         [ ] CREATED [ ] TESTED [ ] WORKING
Test Result:    [ ] PASS [ ] FAIL
Storage:        Local development machine (encrypted)
```

### Staging Token
```
Name:           NewsKarnataka Backend Staging
Created:        [Today's date]
Expires:        [60 days from today]
Status:         [ ] CREATED [ ] TESTED [ ] WORKING
Test Result:    [ ] PASS [ ] FAIL
Storage:        Staging server (secure)
```

### Production Token
```
Name:           NewsKarnataka Backend Production
Created:        [Today's date]
Expires:        [90 days from today]
Status:         [ ] CREATED [ ] TESTED [ ] WORKING
Test Result:    [ ] PASS [ ] FAIL
Storage:        Vault/Secrets manager (maximum security)
```

---

## ✅ SECURITY BEST PRACTICES CHECKLIST

- [ ] All tokens copied immediately after generation
- [ ] Dev token stored locally (not in git)
- [ ] Staging token stored on staging server (not in git)
- [ ] Production token stored in vault (not in git)
- [ ] All tokens tested and verified working
- [ ] No tokens committed to version control
- [ ] No tokens in environment files (git-tracked)
- [ ] Token rotation schedule noted (30/60/90 days)
- [ ] Team notified of token locations
- [ ] Access restrictions enforced per environment

---

## 📋 TROUBLESHOOTING

### Issue: Token not working (401 Unauthorized)

**Possible Causes:**
1. Token not copied correctly
2. Extra spaces in token value
3. Token expired
4. Token revoked

**Solution:**
1. Return to admin panel
2. Regenerate token (old one may be lost)
3. Copy carefully (no extra spaces)
4. Test immediately after copying

---

### Issue: Can't find API Tokens section

**Possible Causes:**
1. Not in Settings menu
2. Different Strapi version layout
3. Permissions issue

**Solution:**
1. Click Settings (gear icon) again
2. Look for "Tokens" or "API" in menu
3. Try "Settings" → "Administration" (if available)
4. Contact Strapi admin if still not found

---

### Issue: Create button not working

**Possible Causes:**
1. Form not complete
2. Page not fully loaded
3. Session timeout

**Solution:**
1. Verify all form fields filled
2. Refresh page (F5)
3. Try again
4. If still failing, logout and login again

---

## 🎯 NEXT STEPS

After completing Task #3:
1. ✅ Mark Task #3 complete
2. ✅ Update task list (3/8 complete)
3. ✅ Move to Task #4: Day 3-4 CORS Configuration Setup

---

## ✅ SIGN-OFF

### Task #3 Completion Checklist

- [ ] Development token generated
- [ ] Development token tested
- [ ] Staging token generated
- [ ] Staging token tested
- [ ] Production token generated
- [ ] Production token tested
- [ ] All tokens visible in admin panel
- [ ] All tokens secured in appropriate locations
- [ ] Security best practices followed
- [ ] Documentation updated

### Task #3 Status: [ ] COMPLETE [ ] INCOMPLETE

### Ready for Task #4: [ ] YES [ ] NO

---

**Document:** Task #3 Execution Guide  
**Status:** EXECUTION READY  


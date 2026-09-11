# 🚀 TASK #3 - GUIDED EXECUTION WALKTHROUGH

**Project:** NewsKarnataka Platform  
**Task:** Day 2-3 API Token Generation & Management  
**Status:** READY FOR EXECUTION  
**Time Estimate:** 30-45 minutes  

---

## 📍 CURRENT STATUS

**API Connectivity:** ✅ VERIFIED
- Strapi instance: https://strapi.opusinfiniti.com
- Status: ONLINE & OPERATIONAL
- Next: Generate 3 API tokens

---

## 🎯 WHAT YOU NEED TO DO

You will generate **3 API tokens** for different environments:
1. **Development Token** (30 days) - For local development
2. **Staging Token** (60 days) - For staging environment
3. **Production Token** (90 days) - For live environment

Each token will be tested and stored securely.

---

## 📋 STEP-BY-STEP EXECUTION

### STEP 1: Login to Strapi Admin

**Action:**
1. Open your web browser
2. Navigate to: **https://strapi.opusinfiniti.com/admin**
3. You should see the Strapi login page

**Enter Credentials:**
- **Email:** reachus@opusinfiniti.com
- **Password:** Opus@321$%^

4. Click **Login** button
5. Wait for dashboard to load (5-10 seconds)

**Expected Result:**
```
✅ Dashboard displays
✅ You see "Welcome to Strapi" or similar message
✅ Left sidebar with menu items visible
```

**Verification:** [ ] LOGIN SUCCESSFUL

---

### STEP 2: Navigate to API Tokens Section

**Action:**
1. Look at the **bottom left corner** of the screen
2. Find the **Settings icon** (looks like a gear ⚙️)
3. Click on Settings

**Expected Result:**
```
Settings menu opens
Left sidebar shows additional menu items
You should see options like:
- Global settings
- Users
- Roles
- API Tokens
- Webhooks
- etc.
```

**Next Action:**
1. Look for **API Tokens** in the left menu
2. Click on **API Tokens**

**Expected Result:**
```
API Tokens page loads
You see:
├─ "Create new API token" button (or "+ Create")
├─ List of existing tokens (if any)
└─ Table with columns: Name, Type, Duration, Actions
```

**Verification:** [ ] API TOKENS PAGE ACCESSIBLE

---

### STEP 3: Create Development Token

**Action:**
1. Click on **"Create new API token"** button (usually blue)
2. A form or dialog appears with fields:
   - Name
   - Description
   - Type (dropdown)
   - Duration (dropdown)

**Fill in the form:**

```
Field 1: Name
├─ Enter: NewsKarnataka Backend Dev
└─ This identifies your development token

Field 2: Description
├─ Enter: Development API token for local development
└─ Optional but helpful for documentation

Field 3: Type
├─ Click dropdown
├─ Select: Full access
└─ Why? Development needs all endpoints

Field 4: Duration
├─ Click dropdown
├─ Select: 30 days
└─ Shorter expiration = more secure
```

**Visual Example:**
```
┌─────────────────────────────────────┐
│ Create API Token                     │
├─────────────────────────────────────┤
│ Name: NewsKarnataka Backend Dev      │
│ Description: Development API token...│
│ Type: Full access                    │
│ Duration: 30 days                    │
│                                      │
│ [Cancel]  [Create]                   │
└─────────────────────────────────────┘
```

**Action:**
1. Verify all fields are filled correctly
2. Click the **"Create"** or **"Save"** button
3. Wait for token to be generated (2-5 seconds)

**Expected Result:**
```
✅ Token created successfully message appears
✅ Token value appears on screen (usually in a field or modal)
✅ May have a "Copy" button or similar
```

**⚠️ CRITICAL STEP - COPY TOKEN IMMEDIATELY:**

1. **Look for the token value** on the screen
2. It will be a long string of characters, like:
   ```
   3a9f8c7e6d5b4a2f1e9c8d7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f
   ```
3. **If there's a "Copy" button:**
   - Click it
   - Confirmation message "Copied to clipboard"

4. **If there's no "Copy" button:**
   - Triple-click the token field
   - Entire token is highlighted
   - Press **Ctrl+C** to copy

5. **Paste into Notepad temporarily** to verify it's copied:
   - Open Notepad
   - Press **Ctrl+V** to paste
   - You should see the long token string
   - Keep this window open for now

**Verification:** [ ] DEVELOPMENT TOKEN COPIED

---

### STEP 4: Test Development Token

**Action:**
1. Open **PowerShell** or **Command Prompt**
2. Run this command (replace TOKEN with your actual token):

```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_DEV_TOKEN" `
  -H "Content-Type: application/json"
```

**Replace:** `YOUR_DEV_TOKEN` with the token you just copied

**Expected Result:**
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
    "pagination": { ... }
  }
}
```

**If you get an error:**
- **401 Unauthorized:** Token not copied correctly or format wrong
- **404 Not Found:** API endpoint issue
- **Connection refused:** Network issue

**Solution:** Go back to admin panel and re-copy the token carefully

**Verification:** [ ] DEVELOPMENT TOKEN TESTED & WORKING

---

### STEP 5: Save Development Token Securely

**Action:**
1. Create a file: **STRAPI_DEV_TOKEN.txt**
2. Location: **Local development machine** (NOT in git repo)
3. Content:

```
═══════════════════════════════════════════════════════════
DEVELOPMENT API TOKEN - STRAPI
═══════════════════════════════════════════════════════════

Token Name:              NewsKarnataka Backend Dev
Environment:             Development (Local)
Created Date:            [TODAY'S DATE]
Expiration Date:         [30 DAYS FROM TODAY]

Token Value:
[PASTE YOUR TOKEN HERE]

Base URL:                https://strapi.opusinfiniti.com/api
Auth Header:             Authorization: Bearer [TOKEN]

Usage:
- Local development
- Testing endpoints
- Frontend development

Rotation Schedule:       Every 30 days
Next Rotation Due:       [DATE 30 DAYS FROM TODAY]

SECURITY:
- Keep this file encrypted
- Never commit to git
- Never share via email
- Local team access only

═══════════════════════════════════════════════════════════
```

**Storage Options:**
- [ ] Encrypted folder on local machine
- [ ] Password manager (1Password, Bitwarden, etc.)
- [ ] Secure note in team wiki (NOT public)
- [ ] .env file (but NEVER commit to git)

**Verification:** [ ] DEVELOPMENT TOKEN SAVED SECURELY

---

### STEP 6: Create Staging Token

**Action:**
1. Return to Strapi admin: https://strapi.opusinfiniti.com/admin
2. Navigate to: **Settings → API Tokens**
3. Click **"Create new API token"** button again

**Fill in the form:**
```
Name:        NewsKarnataka Backend Staging
Description: Staging environment API token
Type:        Limited (more restrictive than dev)
Duration:    60 days (longer than dev for stability)
```

**Create the token:**
1. Click **"Create"** button
2. Wait for generation
3. Copy token immediately (same process as Step 3)
4. Paste into **STRAPI_STAGING_TOKEN.txt** file

**Test Staging Token:**
1. Run curl command with staging token:
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_STAGING_TOKEN"
```

**Expected Result:**
- Status: 200 OK
- JSON data returned

**Verification:** [ ] STAGING TOKEN CREATED & TESTED

---

### STEP 7: Create Production Token

**Action:**
1. Return to Strapi admin: https://strapi.opusinfiniti.com/admin
2. Navigate to: **Settings → API Tokens**
3. Click **"Create new API token"** button third time

**Fill in the form:**
```
Name:        NewsKarnataka Backend Production
Description: Production environment API token
Type:        Limited (maximum security)
Duration:    90 days (quarterly rotation required)
```

**Create the token:**
1. Click **"Create"** button
2. Wait for generation
3. Copy token immediately
4. Paste into **STRAPI_PROD_TOKEN.txt** file

**⚠️ PRODUCTION TOKEN SECURITY:**
- Store in **vault/secrets manager** (NOT in files)
- Options:
  - AWS Secrets Manager
  - HashiCorp Vault
  - Azure Key Vault
  - GitHub Secrets (if using GitHub Actions)
  - Encrypted environment variable

**Test Production Token:**
1. Run curl command:
```powershell
curl.exe -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=1" `
  -H "Authorization: Bearer YOUR_PROD_TOKEN"
```

**Expected Result:**
- Status: 200 OK
- JSON data returned

**Verification:** [ ] PRODUCTION TOKEN CREATED & TESTED

---

### STEP 8: Verify All Tokens in Admin Panel

**Action:**
1. Go back to Strapi admin: https://strapi.opusinfiniti.com/admin
2. Navigate to: **Settings → API Tokens**
3. Look for all 3 tokens in the list

**Expected to see:**
```
┌──────────────────────────────────────────────────┐
│ API Tokens List                                  │
├────────────────────────┬──────────┬──────────────┤
│ Name                   │ Type     │ Expires      │
├────────────────────────┼──────────┼──────────────┤
│ NewsKarnataka Backend  │ Full     │ 30 days      │
│ Dev                    │ access   │ remaining    │
├────────────────────────┼──────────┼──────────────┤
│ NewsKarnataka Backend  │ Limited  │ 60 days      │
│ Staging                │          │ remaining    │
├────────────────────────┼──────────┼──────────────┤
│ NewsKarnataka Backend  │ Limited  │ 90 days      │
│ Production             │          │ remaining    │
└────────────────────────┴──────────┴──────────────┘
```

**Verification:** [ ] ALL 3 TOKENS VISIBLE IN ADMIN PANEL

---

## 📊 TASK #3 COMPLETION CHECKLIST

### Token Generation
- [ ] Development token created
- [ ] Development token tested (API responds)
- [ ] Staging token created
- [ ] Staging token tested (API responds)
- [ ] Production token created
- [ ] Production token tested (API responds)

### Security
- [ ] Dev token stored locally (not in git)
- [ ] Staging token stored on staging server (not in git)
- [ ] Prod token stored in vault (not in git)
- [ ] No tokens committed to version control
- [ ] No tokens in public documentation

### Documentation
- [ ] All 3 tokens saved in separate files
- [ ] Token files secured appropriately
- [ ] Rotation schedule noted (30/60/90 days)
- [ ] Team notified of token locations

### Verification
- [ ] All 3 tokens visible in admin panel
- [ ] All 3 tokens passed API tests
- [ ] Token format correct (long character string)
- [ ] No errors when testing

---

## ✅ SUCCESS CRITERIA

### Task #3 Complete When:
✅ 3 tokens generated (dev/staging/prod)
✅ All 3 tokens tested with API call
✅ All 3 tokens stored securely
✅ All 3 tokens visible in admin panel
✅ No errors or issues

---

## 🎯 NEXT STEPS AFTER COMPLETION

Once Task #3 is complete:

1. **Mark Task #3 as COMPLETE**
2. **Move to Task #4: CORS Configuration** (estimated 1-2 hours)
   - Reference: WEEK_1_DAY_4_5_CORS_EMAIL_SETUP.md
   - Navigate: Settings → CORS
   - Configure 10+ origins, methods, headers

3. **Then Task #5: Email Configuration** (estimated 1-2 hours)
   - Configure SMTP email
   - Setup providers
   - Send test email

4. **Then Tasks #6-8: Testing & Readiness** (estimated 3-4 hours)
   - Run 23 comprehensive tests
   - Complete readiness assessment
   - Final sign-off for Week 2

---

## 📞 TROUBLESHOOTING

### Problem: Can't find Settings icon
**Solution:**
- Settings should be in bottom left corner (gear icon ⚙️)
- If not visible, logout and login again
- Refresh the page (F5)

### Problem: API Tokens section not found
**Solution:**
- In Settings menu, look for "Tokens"
- May be under "Administration" → "API Tokens"
- Try searching in the menu

### Problem: Can't copy token
**Solution:**
- Try right-clicking on token field
- Select "Copy" from context menu
- Or triple-click to select all, then Ctrl+C

### Problem: Token test fails (401 Unauthorized)
**Solution:**
1. Go back to admin panel
2. Delete the token and create new one
3. Copy immediately and test again
4. Ensure no extra spaces in token

---

## 📝 DOCUMENTATION TRACKING

**Files to Update After Completion:**
```
├─ STRAPI_DEV_TOKEN.txt         (Your dev token - local)
├─ STRAPI_STAGING_TOKEN.txt     (Your staging token - staging server)
├─ STRAPI_PROD_TOKEN.txt        (Your prod token - vault)
└─ TASK_3_EXECUTION_COMPLETION.md (Track completion)
```

---

## ✅ SIGN-OFF

After completing all steps above:

**Completed By:**
- Name: ___________________________
- Date: ___________________________
- Time: ___________________________

**All 3 tokens created: [ ] YES [ ] NO**
**All 3 tokens tested: [ ] YES [ ] NO**
**All 3 tokens saved securely: [ ] YES [ ] NO**

**Task #3 Status: [ ] COMPLETE [ ] INCOMPLETE**

---

**Ready to proceed? Follow the steps above and confirm when complete.**


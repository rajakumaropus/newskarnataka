# Step 3: Verify GitHub Secrets Configuration

**Task:** Verify all 5 required GitHub Secrets are configured  
**URL:** https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions  
**Estimated Time:** 5 minutes  
**Status:** IN PROGRESS

---

## REQUIRED SECRETS (5 Total)

These secrets are used by the GitHub Actions workflow to deploy to Vercel:

### 1. VERCEL_TOKEN
- **Purpose:** Authentication token for Vercel CLI
- **Value:** `vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm`
- **Where to Find:** Already provided in documentation
- **Status to Check:** ✓ Must exist in secrets

### 2. VERCEL_WEBSITE_PROJECT_ID
- **Purpose:** Project ID for Website (Next.js) app in Vercel
- **Value:** `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1`
- **Where to Find:** From Vercel project URL or settings
- **Status to Check:** ✓ Must exist in secrets

### 3. VERCEL_CONSOLE_PROJECT_ID
- **Purpose:** Project ID for Console (Vite React) app in Vercel
- **Value:** `prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw`
- **Where to Find:** From Vercel project URL or settings
- **Status to Check:** ✓ Must exist in secrets

### 4. STRAPI_URL
- **Purpose:** URL to the Strapi backend (used by both apps)
- **Value:** `http://103.191.208.235:1337`
- **Where to Find:** Backend server address
- **Status to Check:** ✓ Must exist in secrets

### 5. STRAPI_API_TOKEN
- **Purpose:** API token for Strapi authentication
- **Value:** Long token (check in `.env` file locally)
- **Where to Find:** In your `.env` file as `STRAPI_API_TOKEN`
- **Status to Check:** ✓ Must exist in secrets

---

## HOW TO VERIFY SECRETS

### Step 1: Go to GitHub Secrets Page

1. Open: https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions
2. Log in if needed
3. You should see a list of "Repository secrets"

### Step 2: Check Each Secret Exists

Look for these 5 secrets in the list (values are hidden for security):

```
✓ STRAPI_API_TOKEN          (Last updated: date)
✓ STRAPI_URL                (Last updated: date)
✓ VERCEL_CONSOLE_PROJECT_ID (Last updated: date)
✓ VERCEL_TOKEN              (Last updated: date)
✓ VERCEL_WEBSITE_PROJECT_ID (Last updated: date)
```

### Step 3: Verify All 5 Are Present

Check off each one:
- [ ] VERCEL_TOKEN
- [ ] VERCEL_WEBSITE_PROJECT_ID
- [ ] VERCEL_CONSOLE_PROJECT_ID
- [ ] STRAPI_URL
- [ ] STRAPI_API_TOKEN

---

## IF A SECRET IS MISSING

If any secret is missing, you need to add it:

### To Add a Missing Secret:

1. Click **"New repository secret"** button (top right)
2. In "Name" field: Enter the secret name (e.g., `VERCEL_TOKEN`)
3. In "Secret" field: Enter the secret value
4. Click **"Add secret"**

### Secret Values to Add:

**If VERCEL_TOKEN is missing:**
```
Name:  VERCEL_TOKEN
Value: vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm
```

**If VERCEL_WEBSITE_PROJECT_ID is missing:**
```
Name:  VERCEL_WEBSITE_PROJECT_ID
Value: prj_bkVUspAEPRO7h9Zc9cq48k2FkND1
```

**If VERCEL_CONSOLE_PROJECT_ID is missing:**
```
Name:  VERCEL_CONSOLE_PROJECT_ID
Value: prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw
```

**If STRAPI_URL is missing:**
```
Name:  STRAPI_URL
Value: http://103.191.208.235:1337
```

**If STRAPI_API_TOKEN is missing:**
```
Name:  STRAPI_API_TOKEN
Value: (Check your .env file for the value)
```

---

## QUICK REFERENCE

| Secret Name | Value | Visible | Status |
|-------------|-------|---------|--------|
| VERCEL_TOKEN | `vcp_...` | Hidden | ✓ Required |
| VERCEL_WEBSITE_PROJECT_ID | `prj_bkVU...` | Hidden | ✓ Required |
| VERCEL_CONSOLE_PROJECT_ID | `prj_Nx3x...` | Hidden | ✓ Required |
| STRAPI_URL | `http://103.191...` | Hidden | ✓ Required |
| STRAPI_API_TOKEN | `(long token)` | Hidden | ✓ Required |

---

## VERIFICATION CHECKLIST

After reviewing GitHub Secrets:

- [ ] All 5 secrets are listed on the page
- [ ] No error messages displayed
- [ ] Secrets are marked as "Active"
- [ ] Ready to proceed to Step 4

---

## NEXT AFTER COMPLETING THIS STEP

Once you've verified all 5 secrets exist (or added any missing ones):

1. Reply: **"✅ Step 3 Done"**
2. Will proceed to Step 4: Trigger test deployment

---

## HELP

**Can't access GitHub Secrets page?**
- Make sure you have "Admin" access to the repository
- Check the URL: https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions
- Try logging out and back in

**Don't know what values to use?**
- VERCEL tokens are provided in documentation
- STRAPI_API_TOKEN is in your `.env` file
- Project IDs are from Vercel project settings

**Not sure if a secret was added?**
- Refresh the page
- The new secret should appear in the list
- It may take a few seconds to appear

---

**Status: AWAITING VERIFICATION**

Please verify all 5 secrets are present and reply when complete.

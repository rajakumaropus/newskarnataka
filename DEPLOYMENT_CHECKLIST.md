# ✅ DEPLOYMENT CHECKLIST - FOLLOW THIS EXACTLY

Print this or keep it on screen while deploying.

---

## 📋 BEFORE YOU START

Make sure you have these ready:

- [ ] Your `.env` file open in editor
- [ ] Vercel dashboard open: https://vercel.com/dashboard
- [ ] GitHub secrets page open: https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions
- [ ] Browser with multiple tabs

---

## 🔧 STEP 1: CREATE WEBSITE PROJECT (5-10 min)

**Task: Deploy newskarnataka-website to Vercel**

### 1.1: Vercel Dashboard
- [ ] Opened: https://vercel.com/dashboard
- [ ] Logged in with your account

### 1.2: Create Project
- [ ] Clicked "Add New"
- [ ] Selected "Project"

### 1.3: Import Repository
- [ ] Clicked "Import Git Repository"
- [ ] Searched for: `rajakumaropus/newskarnataka`
- [ ] Selected the repository

### 1.4: Configure Project
- [ ] Project Name: `newskarnataka-website` ✓
- [ ] Root Directory: `newskarnataka-website` ✓
- [ ] Framework: Next.js ✓
- [ ] Build Command: `npm run build` ✓
- [ ] Output Directory: `.next` ✓

### 1.5: Environment Variables
- [ ] Added: `NEXT_PUBLIC_STRAPI_URL=http://103.191.208.235:1337`
- [ ] Added: `STRAPI_API_TOKEN_FULL_ACCESS=(from .env)`

### 1.6: Deploy
- [ ] Clicked "Deploy"
- [ ] Waiting for build... (5-10 min)
- [ ] Build completed ✓

### 1.7: Get Project ID
- [ ] Went to Settings → General
- [ ] Copied Project ID
- [ ] **Updated `.env`:** `VERCEL_PROJECT_ID_WEBSITE=(copied ID)`

### 1.8: Verify Live
- [ ] Opened: https://newskarnataka-website.vercel.app
- [ ] Website loaded successfully ✓
- [ ] Articles displaying ✓

**Status:** ✅ STEP 1 COMPLETE

---

## 🔧 STEP 2: CREATE CONSOLE PROJECT (5-10 min)

**Task: Deploy newskarnataka-console to Vercel**

### 2.1: Vercel Dashboard
- [ ] Opened: https://vercel.com/dashboard
- [ ] Clicked "Add New" → "Project"

### 2.2: Import Repository
- [ ] Clicked "Import Git Repository"
- [ ] Selected: `rajakumaropus/newskarnataka`

### 2.3: Configure Project
- [ ] Project Name: `newskarnataka-console` ✓
- [ ] Root Directory: `newskarnataka-console` ✓
- [ ] Framework: Other ✓
- [ ] Build Command: `npm run build` ✓
- [ ] Output Directory: `dist` ✓

### 2.4: Environment Variables
- [ ] Added: `VITE_STRAPI_URL=http://103.191.208.235:1337`
- [ ] Added: `VITE_STRAPI_API_TOKEN=(from .env)`

### 2.5: Deploy
- [ ] Clicked "Deploy"
- [ ] Waiting for build... (5-10 min)
- [ ] Build completed ✓

### 2.6: Get Project ID
- [ ] Went to Settings → General
- [ ] Copied Project ID
- [ ] **Updated `.env`:** `VERCEL_PROJECT_ID_CONSOLE=(copied ID)`

### 2.7: Verify Live
- [ ] Opened: https://newskarnataka-console.vercel.app
- [ ] Console loaded successfully ✓
- [ ] Login page displayed ✓

**Status:** ✅ STEP 2 COMPLETE

---

## 🔐 STEP 3: ADD GITHUB SECRETS (5 min)

**Task: Enable CI/CD automation**

### 3.1: GitHub Secrets Page
- [ ] Opened: https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions

### 3.2: Add Secret #1 - VERCEL_TOKEN
- [ ] Clicked "New repository secret"
- [ ] Name: `VERCEL_TOKEN`
- [ ] Value: (from `.env` file)
- [ ] Clicked "Add secret"

### 3.3: Add Secret #2 - VERCEL_ORG_ID
- [ ] Clicked "New repository secret"
- [ ] Name: `VERCEL_ORG_ID`
- [ ] Value: `rajkumaropus-7015`
- [ ] Clicked "Add secret"

### 3.4: Add Secret #3 - VERCEL_PROJECT_ID_WEBSITE
- [ ] Clicked "New repository secret"
- [ ] Name: `VERCEL_PROJECT_ID_WEBSITE`
- [ ] Value: (from Step 1.7)
- [ ] Clicked "Add secret"

### 3.5: Add Secret #4 - VERCEL_PROJECT_ID_CONSOLE
- [ ] Clicked "New repository secret"
- [ ] Name: `VERCEL_PROJECT_ID_CONSOLE`
- [ ] Value: (from Step 2.6)
- [ ] Clicked "Add secret"

### 3.6: Add Secret #5 - STRAPI_URL
- [ ] Clicked "New repository secret"
- [ ] Name: `STRAPI_URL`
- [ ] Value: `http://103.191.208.235:1337`
- [ ] Clicked "Add secret"

### 3.7: Add Secret #6 - STRAPI_API_TOKEN
- [ ] Clicked "New repository secret"
- [ ] Name: `STRAPI_API_TOKEN`
- [ ] Value: (from `.env` file)
- [ ] Clicked "Add secret"

### 3.8: Verify Secrets
- [ ] All 6 secrets visible in GitHub Secrets page ✓

**Status:** ✅ STEP 3 COMPLETE

---

## ✅ STEP 4: VERIFY DEPLOYMENTS (2 min)

### 4.1: Website Verification
- [ ] Website URL: https://newskarnataka-website.vercel.app
- [ ] Articles loading on homepage
- [ ] No 404 or error messages

### 4.2: Console Verification
- [ ] Console URL: https://newskarnataka-console.vercel.app
- [ ] Login page displays correctly
- [ ] Can see login form

**Status:** ✅ STEP 4 COMPLETE

---

## 🧪 STEP 5: TEST WEBSITE (5 min)

### 5.1: Homepage Test
- [ ] Go to: https://newskarnataka-website.vercel.app
- [ ] Articles visible on page
- [ ] Article cards showing title, image, description
- [ ] Open DevTools (F12) - no red errors

### 5.2: Search Test
- [ ] Click search bar
- [ ] Type: "Karnataka"
- [ ] Search results appear

### 5.3: Category Filter Test
- [ ] Look for category links/buttons
- [ ] Click on a category
- [ ] Articles filtered correctly

### 5.4: Article Detail Test
- [ ] Click on any article card
- [ ] Article detail page loads
- [ ] Full content visible

**Status:** ✅ STEP 5 COMPLETE

---

## 🧪 STEP 6: TEST CONSOLE (5 min)

### 6.1: Login Test
- [ ] Go to: https://newskarnataka-console.vercel.app
- [ ] Login with:
  - Email: `editor@newskarnataka.com`
  - Password: `password123`
- [ ] Login successful, redirected to Dashboard

### 6.2: Dashboard Test
- [ ] Dashboard displays
- [ ] Stats cards visible (Total, Submitted, Drafts)
- [ ] Activity feed shows articles

### 6.3: Submit Article Test
- [ ] Click "Submit Article" in sidebar
- [ ] Fill out form:
  - Title: "Test Article"
  - Category: Select one
  - Description: "Test"
- [ ] Click "Submit"
- [ ] Success message appears

### 6.4: Content Queue Test
- [ ] Click "Content Queue"
- [ ] New article visible in table
- [ ] "Publish" and "Delete" buttons visible

### 6.5: Publish Test
- [ ] Click "Publish" on test article
- [ ] Status changes to "Published"
- [ ] Article visible on website homepage

**Status:** ✅ STEP 6 COMPLETE

---

## 🎉 DEPLOYMENT COMPLETE!

### Summary

| Component | Status |
|-----------|--------|
| Website Project | ✅ Created |
| Console Project | ✅ Created |
| GitHub Secrets | ✅ Added (6/6) |
| Website Live | ✅ https://newskarnataka-website.vercel.app |
| Console Live | ✅ https://newskarnataka-console.vercel.app |
| CI/CD Enabled | ✅ GitHub Actions ready |
| Website Tests | ✅ Passed |
| Console Tests | ✅ Passed |

### Live URLs

```
Website:  https://newskarnataka-website.vercel.app
Console:  https://newskarnataka-console.vercel.app
GitHub:   https://github.com/rajakumaropus/newskarnataka
```

### Next Push Workflow

Every time you push to GitHub:
1. ✅ GitHub Actions triggers
2. ✅ Code linted & built
3. ✅ Auto-deployed to Vercel
4. ✅ Live in 5-10 minutes

---

## 📞 HELP

**Stuck?** Check these guides:
- `VERCEL_MANUAL_STEPS.md` - Detailed step-by-step
- `START_HERE_DEPLOYMENT.md` - Quick reference
- `DEPLOYMENT_READY.md` - Full technical guide

**Error?** Check:
1. Vercel deployment logs
2. GitHub Actions logs
3. Browser console (F12)

---

**✅ YOU'RE LIVE! 🚀**


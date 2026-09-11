# 📋 VERCEL DEPLOYMENT - MANUAL STEPS

Since Vercel API requires additional setup, here are the exact manual steps to deploy both projects.

---

## 🎯 STEP 1: Create Website Project

**Expected Time:** 5 minutes

### 1.1: Go to Vercel Dashboard

Open in browser: **https://vercel.com/dashboard**

### 1.2: Add New Project

- Click **"Add New"** (top left)
- Select **"Project"**

### 1.3: Import Git Repository

- Click **"Import Git Repository"**
- Search for: `rajakumaropus/newskarnataka`
- Click on it to select

### 1.4: Configure Project

You'll see a form. Fill in:

| Field | Value |
|-------|-------|
| **Project Name** | `newskarnataka-website` |
| **Root Directory** | Select `newskarnataka-website` (use the folder dropdown) |
| **Framework Preset** | `Next.js` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 1.5: Add Environment Variables

Under "Environment Variables", add:

```
NEXT_PUBLIC_STRAPI_URL=http://103.191.208.235:1337
STRAPI_API_TOKEN_FULL_ACCESS=(copy from your .env file)
```

### 1.6: Deploy

- Click **"Deploy"**
- Wait 5-10 minutes for build to complete
- You'll see: ✅ **Successfully deployed**

### 1.7: Get Project ID

After deployment:
1. Go to **Settings** (top navigation)
2. Scroll down to **"General"** section
3. Find **"Project ID"** 
4. **Copy it**

**Save this:** Open your `.env` file and add:
```
VERCEL_PROJECT_ID_WEBSITE=(paste Project ID here)
```

### 1.8: Verify Website is Live

Go to: `https://newskarnataka-website.vercel.app`

Should show articles loading!

---

## 🎯 STEP 2: Create Console Project

**Expected Time:** 5 minutes

### 2.1: Go to Vercel Dashboard

Open: **https://vercel.com/dashboard**

### 2.2: Add New Project

- Click **"Add New"**
- Select **"Project"**
- Click **"Import Git Repository"**
- Search for: `rajakumaropus/newskarnataka`
- Click to select

### 2.3: Configure Project

| Field | Value |
|-------|-------|
| **Project Name** | `newskarnataka-console` |
| **Root Directory** | Select `newskarnataka-console` |
| **Framework Preset** | `Other` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 2.4: Add Environment Variables

```
VITE_STRAPI_URL=http://103.191.208.235:1337
VITE_STRAPI_API_TOKEN=(copy from your .env file)
```

### 2.5: Deploy

- Click **"Deploy"**
- Wait 5-10 minutes for build to complete

### 2.6: Get Project ID

After deployment:
1. Go to **Settings**
2. Scroll to **"General"**
3. Copy **"Project ID"**

**Save this:** Update your `.env` file:
```
VERCEL_PROJECT_ID_CONSOLE=(paste Project ID here)
```

### 2.7: Verify Console is Live

Go to: `https://newskarnataka-console.vercel.app`

---

## 🔐 STEP 3: Add GitHub Secrets

**Expected Time:** 5 minutes

These secrets enable automatic deployment on every push!

### 3.1: Go to GitHub Secrets

Open: **https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions**

### 3.2: Add Secret 1: VERCEL_TOKEN

1. Click **"New repository secret"**
2. **Name:** `VERCEL_TOKEN`
3. **Value:** (copy from your `.env` file)
4. Click **"Add secret"**

### 3.3: Add Secret 2: VERCEL_ORG_ID

1. Click **"New repository secret"**
2. **Name:** `VERCEL_ORG_ID`
3. **Value:** `rajkumaropus-7015`
4. Click **"Add secret"**

### 3.4: Add Secret 3: VERCEL_PROJECT_ID_WEBSITE

1. Click **"New repository secret"**
2. **Name:** `VERCEL_PROJECT_ID_WEBSITE`
3. **Value:** (from Step 1.7)
4. Click **"Add secret"**

### 3.5: Add Secret 4: VERCEL_PROJECT_ID_CONSOLE

1. Click **"New repository secret"**
2. **Name:** `VERCEL_PROJECT_ID_CONSOLE`
3. **Value:** (from Step 2.6)
4. Click **"Add secret"**

### 3.6: Add Secret 5: STRAPI_URL

1. Click **"New repository secret"**
2. **Name:** `STRAPI_URL`
3. **Value:** `http://103.191.208.235:1337`
4. Click **"Add secret"**

### 3.7: Add Secret 6: STRAPI_API_TOKEN

1. Click **"New repository secret"**
2. **Name:** `STRAPI_API_TOKEN`
3. **Value:** (copy from your `.env` file)
4. Click **"Add secret"**

**Result:** You should see 6 secrets in the list ✅

---

## ✅ STEP 4: Verify Deployments

### 4.1: Check Website

Open: **https://newskarnataka-website.vercel.app**

**Should see:**
- ✅ Articles displayed on homepage
- ✅ "Latest Articles" section
- ✅ Search bar at top
- ✅ Category links

### 4.2: Check Console

Open: **https://newskarnataka-console.vercel.app**

**Should see:**
- ✅ Login page
- ✅ Login with: `editor@newskarnataka.com` / `password123`
- ✅ Dashboard page after login

---

## 🧪 STEP 5: Test Website Functionality

### 5.1: Test Homepage

1. Go to: `https://newskarnataka-website.vercel.app`
2. **Check:**
   - [ ] Articles are displaying
   - [ ] Each article has title, image, description
   - [ ] No red errors in console (press F12)

### 5.2: Test Search

1. Click search bar
2. Type: `Karnataka`
3. **Check:**
   - [ ] Search results appear
   - [ ] Results match your query

### 5.3: Test Categories

1. Look for category links
2. Click on a category (e.g., "Bangalore")
3. **Check:**
   - [ ] Only articles from that category display
   - [ ] URL changes to `/categories/bangalore`

### 5.4: Test Article Detail

1. Click on any article
2. **Check:**
   - [ ] Full article content displays
   - [ ] URL shows: `/articles/article-slug`
   - [ ] Article title, content, metadata visible

---

## 🧪 STEP 6: Test Console Functionality

### 6.1: Test Login

1. Go to: `https://newskarnataka-console.vercel.app`
2. Login with:
   - **Email:** `editor@newskarnataka.com`
   - **Password:** `password123`
3. **Check:**
   - [ ] Login successful
   - [ ] Redirected to Dashboard

### 6.2: Test Dashboard

1. After login, you're on Dashboard
2. **Check:**
   - [ ] Stats cards display (Total Articles, Submitted, Drafts)
   - [ ] Activity feed shows recent articles
   - [ ] Navigation sidebar is visible

### 6.3: Test Submit Article

1. Click **"Submit Article"** in sidebar
2. Fill form:
   - Title: "Test Article"
   - Description: "This is a test"
   - Category: Select any
3. Click **"Submit"**
4. **Check:**
   - [ ] Article submitted successfully
   - [ ] Success message appears

### 6.4: Test Content Queue

1. Click **"Content Queue"** in sidebar
2. **Check:**
   - [ ] Article you submitted is listed
   - [ ] "Publish" button visible
   - [ ] "Delete" button visible

### 6.5: Test Publish/Delete

1. Find your test article
2. Click **"Publish"**
3. **Check:**
   - [ ] Status changes to "Published"
   - [ ] Article now on website homepage

---

## 🎉 SUCCESS CRITERIA

After all steps, you should have:

✅ Website at: `https://newskarnataka-website.vercel.app`  
✅ Console at: `https://newskarnataka-console.vercel.app`  
✅ Both apps loading articles from Strapi  
✅ CI/CD enabled (GitHub Actions ready)  
✅ Can submit and manage articles  
✅ Website shows submitted articles  

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] Step 1: Website project created on Vercel
- [ ] Step 1: Website Project ID saved in `.env`
- [ ] Step 1: Website is live and showing articles
- [ ] Step 2: Console project created on Vercel
- [ ] Step 2: Console Project ID saved in `.env`
- [ ] Step 2: Console is live and accessible
- [ ] Step 3: All 6 GitHub Secrets added
- [ ] Step 4: Website verified live
- [ ] Step 5: Website functionality tested
- [ ] Step 6: Console login works
- [ ] Step 6: Console functionality tested
- [ ] ✅ DEPLOYMENT COMPLETE!

---

## ⏱️ TOTAL TIME

| Step | Time |
|------|------|
| Step 1 (Website) | 5-10 min |
| Step 2 (Console) | 5-10 min |
| Step 3 (Secrets) | 5 min |
| Step 4 (Verify) | 2 min |
| Step 5 (Test) | 5 min |
| Step 6 (Test) | 5 min |
| **TOTAL** | **~30-40 minutes** |

---

## 🆘 TROUBLESHOOTING

### Website won't load articles

**Check:**
1. Is Strapi running? Go to: `http://103.191.208.235:1337`
2. Check browser console (F12) for errors
3. Verify env var in Vercel: Settings → Environment Variables
4. Check Vercel deployment logs: Click "Latest Deployment"

### Console login fails

**Check:**
1. Try credentials: `editor@newskarnataka.com` / `password123`
2. Check browser console (F12)
3. Verify Strapi is running
4. Verify `VITE_STRAPI_API_TOKEN` in Vercel

### Build failed on Vercel

**Check:**
1. Go to project → Deployments
2. Click failed deployment
3. Check Build Logs
4. Common issues:
   - Missing env var
   - Wrong root directory
   - Missing dependencies

---

**Ready to deploy? Follow the steps above! 🚀**


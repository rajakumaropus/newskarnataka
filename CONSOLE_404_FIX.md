# Console 404 Error - Debugging & Fix

**Error:** `404 NOT_FOUND` on https://newskarnataka-console.vercel.app  
**Status:** Root cause identified - Vercel configuration issue

---

## 🔍 Root Cause

Vercel is not building/deploying the console project correctly. This is likely because:

1. **Root Directory not set to `newskarnataka-console`**
2. **Build command incorrect**
3. **Output directory wrong**
4. **Environment variables not configured**

---

## ✅ FIX - Manual Configuration (Recommended)

### Step 1: Access Vercel Dashboard
Go to: https://vercel.com/rajkumaropus-7015

### Step 2: Select Console Project
Click on **newskarnataka-console** project

### Step 3: Go to Settings
Click **Settings** → **General**

### Step 4: Set Root Directory
Under **Root Directory**, set to:
```
newskarnataka-console
```

### Step 5: Configure Build Settings
Under **Build & Development Settings**:

| Field | Value |
|-------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci --legacy-peer-deps` |
| **Node.js Version** | `20.x` |

### Step 6: Save Changes
Click **Save**

### Step 7: Redeploy
Go to **Deployments** tab and click **Redeploy** on the latest deployment

### Step 8: Wait for Rebuild
Wait 2-3 minutes for Vercel to rebuild and deploy

### Step 9: Test
Visit: https://newskarnataka-console.vercel.app

---

## 🔧 Environment Variables (Already Set)

These should already be configured in Vercel, but verify:

**Settings → Environment Variables**

| Variable | Value |
|----------|-------|
| `VITE_STRAPI_URL` | `http://103.191.208.235:1337` |
| `VITE_STRAPI_API_TOKEN` | `c47da022dfd6b7d5ecf75684672004d91db115923a8bb480e9f8f376dcd61192e88f88a086957d0402810135d8e00156339b474563987ad8087c0143338b4853508655f066dbcecdf98e8f609b73c1dd181fdd0ecb46ffdb92f152cbe4de4cd87e0883a67eceda20a33cc9f186df9134e502ce839d5cc57e3f060de7866573d2` |

Ensure these are set for **Production, Preview, Development**

---

## 🚀 Alternative: Deploy via Vercel CLI

If the above doesn't work, use the Vercel CLI:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel (if not linked)
vercel link

# Deploy to production
vercel deploy --prod
```

---

## ✅ Verification

After fixing, the console should:

1. Load without 404 error
2. Show login page with "Demo mode" toggle
3. Allow login (demo mode = instant access)
4. Display dashboard with article statistics
5. Connect to Strapi API for data

### Test Access
```
URL: https://newskarnataka-console.vercel.app
Expected: Login page with demo mode toggle
```

### Test Data Fetch
After login:
```
Dashboard should show:
- Total Articles: 1
- Categories: 10
- Authors: 5
- Tags: 8
```

---

## 🐛 If Still Getting 404

### Debug Steps:

1. **Check Vercel Deployment Status**
   - Go to Deployments tab
   - Click on latest deployment
   - Check build logs for errors
   - Look for npm/build errors

2. **Verify Files Exist**
   - Make sure `newskarnataka-console/dist/index.html` exists
   - Check that Vite built successfully

3. **Check Root Directory Setting**
   - Confirm it's set to `newskarnataka-console`
   - NOT empty, NOT root

4. **Rebuild from Scratch**
   - Vercel Dashboard
   - Deployments
   - Click "..." → "Redeploy"
   - Or push new commit to trigger rebuild

5. **Check Build Logs**
   - Vercel Dashboard
   - Deployments
   - Click failed deployment
   - View "Build Logs" tab for error details

---

## 📊 Expected Result

After fix:

```
URL: https://newskarnataka-console.vercel.app/
Status: 200 OK (not 404)
Content: HTML with React app (not error page)
```

---

## 🎯 Summary

**Issue:** Console deployment returns 404  
**Cause:** Vercel build/deployment configuration  
**Solution:** Manual configuration in Vercel dashboard  
**Time:** 5-10 minutes  
**Expected Result:** Console loads and connects to Strapi

---

**After fixing, reply with results or screenshots if you need further help!**

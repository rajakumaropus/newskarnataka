# 🚀 VERCEL DEPLOYMENT - STEP BY STEP GUIDE

**Status:** Ready to Deploy  
**Time Required:** 15-20 minutes  
**Difficulty:** Easy (all automated)

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before you start, make sure you have:
- [x] GitHub account (sign up at https://github.com if needed)
- [x] Vercel account (sign up at https://vercel.com if needed)
- [x] Vercel API token (generate at https://vercel.com/account/tokens)
- [x] Strapi API token (already generated: saved in .env)
- [ ] 15-20 minutes of time

---

## 🔑 STEP 1: GENERATE VERCEL API TOKEN

**Do this once, use for both projects:**

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it name: `GitHub Actions Deploy`
4. Keep default settings
5. Click "Create"
6. **Copy the token and save it somewhere safe**

---

## 📦 STEP 2: GET YOUR VERCEL ORGANIZATION ID

1. Go to: https://vercel.com
2. Click on your avatar (top right)
3. Select "Teams" or "Account Settings"
4. Look for your team/org name in URL
5. URL will look like: `https://vercel.com/YOUR_ORG_ID/`
6. **Copy the ORG ID**

---

## 📝 STEP 3: CREATE GITHUB REPOSITORY

**Option A: Via GitHub Website (Recommended)**

1. Go to: https://github.com/new
2. Fill in:
   - Repository name: `newskarnataka`
   - Description: `NewsKarnataka - AI-powered news platform`
   - Visibility: **Public** (required for free tier)
3. Click "Create repository"
4. GitHub will show you push instructions

**Option B: Via Command Line**

```bash
# (Skip this if using Option A)
cd d:\Personal\Kiro\newsKarnataka

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/newskarnataka.git

# Create main branch and push
git branch -M main
git push -u origin main
```

---

## 📤 STEP 4: PUSH CODE TO GITHUB

If you used Option A above:

```bash
cd d:\Personal\Kiro\newsKarnataka

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/newskarnataka.git

# Rename branch to main and push
git branch -M main
git push -u origin main
```

Wait for push to complete. You should see:
```
✓ Everything up to date with 'origin/main'
```

---

## 🎯 STEP 5: CREATE FIRST VERCEL PROJECT (Website)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your repo URL: `https://github.com/YOUR_USERNAME/newskarnataka`
4. Click "Import"
5. **Configure Project:**
   - Project Name: `newskarnataka-website`
   - Root Directory: Select `newskarnataka-website` (use dropdown)
   - Framework: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_STRAPI_URL = http://103.191.208.235:1337
   STRAPI_API_TOKEN_FULL_ACCESS = a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
   ```

7. Click "Deploy"
8. Wait for deployment to complete (~3-5 minutes)
9. Go to project Settings → General
10. **Copy and save:**
    - Project ID
    - Team ID

---

## 🎛️ STEP 6: CREATE SECOND VERCEL PROJECT (Console)

1. Go to: https://vercel.com/new (again)
2. Click "Import Git Repository"
3. Paste your repo URL: `https://github.com/YOUR_USERNAME/newskarnataka`
4. Click "Import"
5. **Configure Project:**
   - Project Name: `newskarnataka-console`
   - Root Directory: Select `newskarnataka-console` (use dropdown)
   - Framework: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variables:**
   ```
   VITE_STRAPI_URL = http://103.191.208.235:1337
   VITE_STRAPI_API_TOKEN = a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
   ```

7. Click "Deploy"
8. Wait for deployment to complete (~3-5 minutes)
9. Go to project Settings → General
10. **Copy and save:**
    - Project ID
    - Team ID

---

## 🔐 STEP 7: ADD GITHUB SECRETS

These enable GitHub Actions to deploy automatically.

1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/newskarnataka`
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add these secrets one by one:

| Secret Name | Value |
|---|---|
| `VERCEL_TOKEN` | (Your Vercel API token from Step 1) |
| `VERCEL_ORG_ID` | (Your Vercel Org ID from Step 2) |
| `VERCEL_PROJECT_ID_WEBSITE` | (From website project settings) |
| `VERCEL_PROJECT_ID_CONSOLE` | (From console project settings) |
| `STRAPI_URL` | `http://103.191.208.235:1337` |
| `STRAPI_API_TOKEN` | (Your Strapi token) |

**How to add each secret:**
- Click "New repository secret"
- Name: (copy from table)
- Secret: (paste value)
- Click "Add secret"
- Repeat for all 6 secrets

---

## ✅ STEP 8: VERIFY GITHUB ACTIONS

1. Go to your repo: `https://github.com/YOUR_USERNAME/newskarnataka`
2. Click "Actions" tab
3. You should see a workflow: "Deploy to Production"
4. It should show status: ✓ All jobs passed (or in progress)

If not, don't worry - it will run on next push.

---

## 🚀 STEP 9: TRIGGER DEPLOYMENT

Make a small change and push to trigger deployment:

```bash
cd d:\Personal\Kiro\newsKarnataka

# Create a small change
echo "# Deployed!" >> README.md

# Commit and push
git add README.md
git commit -m "Trigger deployment"
git push origin main
```

Watch the magic happen:
1. Go to https://github.com/YOUR_USERNAME/newskarnataka/actions
2. Should see "Deploy to Production" workflow running
3. It will:
   - ✓ Lint code
   - ✓ Build both apps
   - ✓ Deploy to Vercel
   - ✓ Notify completion

Takes about 3-5 minutes total.

---

## 🎉 STEP 10: VERIFY DEPLOYMENT

Once GitHub Actions completes:

### Website (Next.js)
```
✓ Visit: https://newskarnataka-website.vercel.app
✓ Should display articles
✓ Search should work
✓ Categories should filter
```

### Console (React)
```
✓ Visit: https://newskarnataka-console.vercel.app
✓ Login with: editor@newskarnataka.com / password123
✓ Dashboard should show stats
✓ Can submit articles
```

### Check Vercel Deployment Logs
1. Go to project in Vercel
2. Click "Deployments"
3. Click latest deployment
4. Check "Build Logs" and "Runtime Logs"

---

## 📊 USEFUL LINKS

### Your Project URLs (Update these after deployment)
```
Website:     https://newskarnataka-website.vercel.app
Console:     https://newskarnataka-console.vercel.app
GitHub Repo: https://github.com/YOUR_USERNAME/newskarnataka
GitHub Actions: https://github.com/YOUR_USERNAME/newskarnataka/actions
```

### Management Dashboards
```
Vercel Website:   https://vercel.com/dashboard/newskarnataka-website
Vercel Console:   https://vercel.com/dashboard/newskarnataka-console
GitHub Secrets:   https://github.com/YOUR_USERNAME/newskarnataka/settings/secrets/actions
Strapi Admin:     http://103.191.208.235:1337/admin
```

---

## ❌ TROUBLESHOOTING

### Issue: GitHub Actions failed
**Solution:**
1. Go to Actions tab
2. Click failed workflow
3. Check logs for error
4. Common issues:
   - Missing GitHub Secret → Add it in Settings
   - Wrong Project ID → Copy from Vercel settings again
   - Build failed locally first? → Check `npm run build` works

### Issue: Vercel deployment failed
**Solution:**
1. Go to project in Vercel
2. Click Deployments
3. Click failed deployment
4. Check Build Logs
5. Common issues:
   - Env var missing → Add in project Settings
   - Wrong env var name → Check .env.local file names
   - Module not found → Run `npm install` locally and commit

### Issue: Website shows "404 Not Found"
**Solution:**
1. Check Vercel deployment logs
2. Ensure `vercel.json` is correct
3. Check environment variables in Vercel project settings

### Issue: Console won't load articles
**Solution:**
1. Check browser console (F12)
2. Verify VITE_STRAPI_URL is correct
3. Check Strapi server is running: `curl http://103.191.208.235:1337/api/articles`

---

## 🔄 AUTOMATIC DEPLOYMENTS

After setup, every push to `main` will:

1. ✓ Run ESLint
2. ✓ TypeScript type check
3. ✓ Build both apps
4. ✓ Deploy to Vercel
5. ✓ Update production URLs

**Example workflow:**
```bash
# Make changes locally
# Test locally: npm run dev

# Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# GitHub Actions automatically:
# - Builds your app
# - Runs tests
# - Deploys to Vercel
# - Updates live URL

# Your site is updated in 3-5 minutes!
```

---

## 📈 AFTER DEPLOYMENT

### Monitor Your Apps
- Check daily for errors in Vercel dashboard
- Monitor GitHub Actions for failed builds
- Set up email alerts in Vercel

### Add Custom Domain (Optional)
1. In Vercel project Settings
2. Click "Domains"
3. Add your domain (e.g., newskarnataka.com)
4. Follow DNS instructions

### Enable Analytics (Optional)
1. In Vercel project Settings
2. Enable "Analytics"
3. View performance metrics

---

## ✅ DEPLOYMENT COMPLETE

Once both apps are live:

✅ **Website:** https://newskarnataka-website.vercel.app  
✅ **Console:** https://newskarnataka-console.vercel.app  
✅ **CI/CD:** Automatic on every push  
✅ **Monitoring:** Vercel dashboard  

**You're done! 🚀**

---

**Status:** Ready for Launch  
**Next:** Share URLs with users and gather feedback!


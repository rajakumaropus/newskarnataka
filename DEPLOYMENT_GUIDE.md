# 🚀 DEPLOYMENT GUIDE - Week 2 Complete

**Status:** Ready for Production  
**Target:** Deploy both apps to Vercel + Railway  
**Estimated Time:** 15-20 minutes  

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Local Verification
- [x] Next.js builds successfully
- [x] Console builds successfully
- [x] No TypeScript errors
- [x] ESLint passes
- [x] All API integrations working
- [x] Strapi backend verified
- [x] Sample data present (8 articles, 5 categories)

### GitHub Setup
- [ ] Create GitHub repository
- [ ] Push code to main branch
- [ ] Enable GitHub Actions
- [ ] Configure secrets

---

## 🔑 REQUIRED GITHUB SECRETS

Add these to your GitHub repository (Settings → Secrets and variables → Actions):

```
VERCEL_TOKEN              = <Your Vercel API token>
VERCEL_ORG_ID             = <Your Vercel organization ID>
VERCEL_PROJECT_ID_WEBSITE = <Website project ID from Vercel>
VERCEL_PROJECT_ID_CONSOLE = <Console project ID from Vercel>
STRAPI_URL                = http://103.191.208.235:1337
STRAPI_API_TOKEN          = <Your Strapi API token>
```

### How to Get These:

**Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Click "Create" → Create Token
3. Copy and paste into GitHub Secret

**Vercel Organization ID:**
1. Go to https://vercel.com/teams
2. Select your team/org
3. Copy `teamId` from URL: `https://vercel.com/teams/{teamId}/...`

**Vercel Project IDs:**
1. After creating projects on Vercel
2. Go to project settings
3. Copy projectId

---

## 📝 STEP 1: CREATE GITHUB REPOSITORY

```bash
cd d:\Personal\Kiro\newsKarnataka

# Initialize git
git init
git add .
git commit -m "Initial commit: Week 2 complete - 16/20 tasks"

# Create repo on GitHub manually
# Then:
git remote add origin https://github.com/YOUR_USERNAME/newskarnataka.git
git branch -M main
git push -u origin main
```

---

## ✨ STEP 2: SET UP VERCEL PROJECTS

### Website Project Setup

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Create New Project:**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose "newskarnataka" repo
   - Select "newskarnataka-website" as root directory

3. **Configure Environment:**
   ```
   NEXT_PUBLIC_STRAPI_URL = http://103.191.208.235:1337
   STRAPI_API_TOKEN_FULL_ACCESS = <your-token>
   ```

4. **Deploy:**
   - Click "Deploy"
   - Copy Project ID for GitHub secrets

### Console Project Setup

1. **Create Another Project:**
   - Click "New Project"
   - Select "newskarnataka" repo
   - Select "newskarnataka-console" as root directory

2. **Configure Environment:**
   ```
   VITE_STRAPI_URL = http://103.191.208.235:1337
   VITE_STRAPI_API_TOKEN = <your-token>
   ```

3. **Deploy:**
   - Click "Deploy"
   - Copy Project ID for GitHub secrets

---

## 🔐 STEP 3: CONFIGURE GITHUB SECRETS

1. **Go to Repository Settings:**
   - https://github.com/YOUR_USERNAME/newskarnataka/settings/secrets/actions

2. **Add These Secrets:**
   ```
   VERCEL_TOKEN = (from https://vercel.com/account/tokens)
   VERCEL_ORG_ID = (your team/org ID)
   VERCEL_PROJECT_ID_WEBSITE = (from Website project settings)
   VERCEL_PROJECT_ID_CONSOLE = (from Console project settings)
   STRAPI_URL = http://103.191.208.235:1337
   STRAPI_API_TOKEN = a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
   ```

---

## 🚀 STEP 4: AUTOMATIC DEPLOYMENT

Now every push to `main` will:
1. ✅ Lint code (ESLint)
2. ✅ Build both apps
3. ✅ Run type checks
4. ✅ Deploy to Vercel automatically
5. ✅ Update production URLs

**GitHub Actions Workflow:**
- File: `.github/workflows/deploy.yml`
- Triggers on: Push to main branch
- Status: Check at https://github.com/YOUR_USERNAME/newskarnataka/actions

---

## 📊 DEPLOYMENT VERIFICATION

### Check Website Deployment
```bash
# Visit your Vercel project
https://newskarnataka-prod.vercel.app

# Test endpoints:
# - Homepage: https://newskarnataka-prod.vercel.app/
# - Article search: https://newskarnataka-prod.vercel.app/search?q=bengaluru
# - Category: https://newskarnataka-prod.vercel.app/categories/bengaluru
# - Article detail: https://newskarnataka-prod.vercel.app/articles/bengaluru-tech-hub-attracts-global-investment
```

### Check Console Deployment
```bash
# Visit your Vercel project
https://newskarnataka-console-prod.vercel.app

# Test flows:
# - Login with demo credentials
# - Submit an article
# - View content queue
# - Publish/delete operations
```

### Verify API Integration
```bash
# Check Strapi connection
curl -H "Authorization: Bearer $TOKEN" \
  http://103.191.208.235:1337/api/articles | head -20

# Should return article list with 8+ items
```

---

## 🔗 PRODUCTION URLS

After deployment:

```
📱 Homepage:
   https://newskarnataka-prod.vercel.app

🎛️ Admin Console:
   https://newskarnataka-console-prod.vercel.app

📚 Strapi CMS:
   http://103.191.208.235:1337/admin

📊 Dashboard:
   http://103.191.208.235:1337/admin
```

---

## 🔍 MONITORING & LOGS

### Vercel Logs
- Website: https://vercel.com/dashboard/newskarnataka-website/logs
- Console: https://vercel.com/dashboard/newskarnataka-console/logs

### GitHub Actions Logs
- https://github.com/YOUR_USERNAME/newskarnataka/actions

### Check Deployment Status
```bash
# List recent deployments
vercel list

# Check logs
vercel logs
```

---

## ⚠️ TROUBLESHOOTING

### Issue: Build fails with "Cannot find module"
**Solution:**
```bash
# Rebuild locally first
npm install
npm run build

# Check console output for specific error
# Fix error locally, then push
```

### Issue: Environment variables not working
**Solution:**
1. Check GitHub Secrets are set correctly
2. Verify secret names match `.env.local`
3. Redeploy: Go to Vercel → Project → Settings → Redeploy

### Issue: Strapi API 401 Unauthorized
**Solution:**
1. Verify token in GitHub Secrets is correct
2. Check token hasn't expired
3. Create new token if needed: Strapi Admin → Settings → API Tokens

### Issue: Console can't connect to Strapi
**Solution:**
1. Check VITE_STRAPI_URL in environment variables
2. Ensure Strapi server is running at `103.191.208.235:1337`
3. Test manually: `curl http://103.191.208.235:1337/api/articles`

---

## 📈 POST-DEPLOYMENT CHECKLIST

After both apps are live:

- [ ] Homepage loads and displays articles
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Pagination works
- [ ] Article detail pages work
- [ ] Console login works
- [ ] Dashboard loads stats
- [ ] Article submission works
- [ ] Content queue displays articles
- [ ] Publish/delete actions work
- [ ] Mobile responsive on both
- [ ] No 404 errors
- [ ] No console errors (F12)
- [ ] API calls are fast (<500ms)

---

## 🎯 MONITORING CHECKLIST

Set up monitoring for production:

### Errors
- [ ] Set up Sentry for error tracking
- [ ] Configure email alerts for crashes
- [ ] Monitor 5xx errors in Vercel

### Performance
- [ ] Set up Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Track page load times
- [ ] Alert if response time > 2s

### Uptime
- [ ] Set up uptime monitoring
- [ ] Configure health check endpoints
- [ ] Alert on downtime

---

## 📞 QUICK REFERENCE

### Deploy Commands (Local)
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel manually
vercel deploy --prod
```

### Useful Links
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Actions: https://github.com/YOUR_USERNAME/newskarnataka/actions
- Strapi Admin: http://103.191.208.235:1337/admin

### Emergency Rollback
```bash
# On Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "Promote to Production"
```

---

## ✅ DEPLOYMENT COMPLETE

Once all verifications pass:

✅ **Week 2 is 100% Complete!**

- ✓ 20/20 Tasks done
- ✓ 2 production apps live
- ✓ CI/CD automated
- ✓ Strapi integrated
- ✓ JWT authentication
- ✓ RBAC working
- ✓ Rate limiting active

**Ready for user testing and feedback!**

---

**Last Updated:** September 11, 2026  
**Status:** Ready for Production 🚀


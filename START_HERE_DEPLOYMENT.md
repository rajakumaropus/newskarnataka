# 🎯 START HERE - VERCEL DEPLOYMENT

**Welcome!** You're 5 steps away from going live! 🚀

---

## 📍 WHERE WE ARE

✅ **Week 2: 100% Complete (20/20 tasks)**
- Next.js website built and optimized
- React console built with full admin features
- JWT authentication implemented
- Role-based access control configured
- Rate limiting enabled
- CI/CD pipeline ready
- Code pushed to GitHub

**Now:** Deploy to Vercel (production) in 30 minutes!

---

## 🔑 YOUR CREDENTIALS (Saved Locally)

Check your `.env` file - it contains:
- `GITHUB_TOKEN` - For GitHub authentication
- `VERCEL_TOKEN` - For Vercel deployment
- `VERCEL_ORG_ID` - Your Vercel organization
- `STRAPI_URL` & `STRAPI_API_TOKEN` - Backend API access

⚠️ **Important:** This `.env` file is NOT in git (security!)

---

## 🚀 5 SIMPLE STEPS TO PRODUCTION

### Step 1️⃣: Deploy Website to Vercel (5 min)

1. Open: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select: `rajakumaropus/newskarnataka`
4. Settings:
   - **Name:** `newskarnataka-website`
   - **Root:** `newskarnataka-website`
   - **Framework:** Next.js
5. **Environment Variables:**
   - Copy `NEXT_PUBLIC_STRAPI_URL` from your `.env`
   - Copy `STRAPI_API_TOKEN_FULL_ACCESS` from your `.env`
6. Click **"Deploy"**
7. After deployment, go to **Settings** → **General** → **Copy Project ID**
8. **Update `.env`:** Set `VERCEL_PROJECT_ID_WEBSITE=(ID from step 7)`

✅ Live at: `https://newskarnataka-website.vercel.app`

---

### Step 2️⃣: Deploy Console to Vercel (5 min)

Repeat Step 1, but:
- **Name:** `newskarnataka-console`
- **Root:** `newskarnataka-console`
- **Framework:** Other
- **Output:** `dist`
- **Environment Variables:**
  - `VITE_STRAPI_URL` (from `.env`)
  - `VITE_STRAPI_API_TOKEN` (from `.env`)

✅ Live at: `https://newskarnataka-console.vercel.app`

---

### Step 3️⃣: Add GitHub Secrets (5 min)

1. Open: https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions
2. Click **"New repository secret"** and add these 6 secrets:

| Name | Value (from `.env`) |
|------|---|
| `VERCEL_TOKEN` | (copy from `.env`) |
| `VERCEL_ORG_ID` | `rajkumaropus-7015` |
| `VERCEL_PROJECT_ID_WEBSITE` | (from Step 1) |
| `VERCEL_PROJECT_ID_CONSOLE` | (from Step 2) |
| `STRAPI_URL` | (copy from `.env`) |
| `STRAPI_API_TOKEN` | (copy from `.env`) |

✅ CI/CD enabled - Will auto-deploy on next push!

---

### Step 4️⃣: Verify Deployments (10 min)

Wait 5-10 minutes, then check:

**Website:**
```
https://newskarnataka-website.vercel.app
```
Should show articles from your Strapi backend

**Console:**
```
https://newskarnataka-console.vercel.app
```
Login with: `editor@newskarnataka.com` / `password123`

---

### Step 5️⃣: Test Everything (5 min)

**Website - Test these:**
- [ ] Homepage displays articles
- [ ] Search works (try "Karnataka")
- [ ] Category filtering works
- [ ] Click an article to see detail page
- [ ] Open DevTools (F12) - no errors

**Console - Test these:**
- [ ] Login page works
- [ ] Login with credentials above
- [ ] See dashboard with stats
- [ ] Click "Submit Article"
- [ ] Try submitting an article
- [ ] Check "Content Queue" tab
- [ ] Try publish/delete buttons

---

## 📊 WHAT YOU GET AFTER DEPLOYMENT

### Live Applications

| App | URL |
|-----|-----|
| **Public Website** | https://newskarnataka-website.vercel.app |
| **Admin Console** | https://newskarnataka-console.vercel.app |
| **Strapi Admin** | http://103.191.208.235:1337/admin |
| **GitHub Repo** | https://github.com/rajakumaropus/newskarnataka |

### Automatic CI/CD

Every time you push to `main`:
1. ✅ Code linted
2. ✅ TypeScript checked
3. ✅ Apps built
4. ✅ Auto-deployed to Vercel
5. ✅ Live in 5-10 minutes!

---

## 📚 MORE INFO

**Need detailed steps?** Read: `DEPLOYMENT_READY.md`

**Need Vercel setup help?** Read: `VERCEL_SETUP_INSTRUCTIONS.md`

**Deploy with GitHub Actions?** Check: `.github/workflows/deploy.yml`

---

## 🎯 SUCCESS CRITERIA

After all 5 steps, you should have:

✅ Website displaying articles  
✅ Search functionality working  
✅ Admin console accessible  
✅ Login working  
✅ Can submit articles  
✅ Can manage content queue  
✅ CI/CD ready for future updates  

---

## ⏱️ TOTAL TIME

| Step | Time |
|------|------|
| 1️⃣ Website | 5 min |
| 2️⃣ Console | 5 min |
| 3️⃣ Secrets | 5 min |
| 4️⃣ Wait & Verify | 10 min |
| 5️⃣ Test | 5 min |
| **TOTAL** | **~30 minutes** |

---

## 🆘 ISSUES?

**Push failed to GitHub?**
- Check GitHub Secrets are set correctly
- Ensure `.env` is not committed (it's in `.gitignore`)

**Vercel build failed?**
- Check environment variables in Vercel
- Check build logs in Vercel dashboard
- Ensure correct Root Directory

**Website not loading articles?**
- Check Strapi server is running: http://103.191.208.235:1337
- Verify `STRAPI_URL` env var in Vercel
- Check browser console (F12) for errors

**Console login not working?**
- Ensure Strapi has JWT collection
- Check `VITE_STRAPI_API_TOKEN` in Vercel
- Try login with: `editor@newskarnataka.com` / `password123`

---

## 🎉 YOU'RE READY!

Everything is built, tested, and ready to deploy.

**Follow the 5 steps above and you'll be live in 30 minutes! 🚀**

---

**Questions?** Check these files:
- `DEPLOYMENT_READY.md` - Full technical guide
- `VERCEL_SETUP_INSTRUCTIONS.md` - Step-by-step setup
- `.github/workflows/deploy.yml` - CI/CD configuration

**Ready?** Open Vercel and deploy! 🚀


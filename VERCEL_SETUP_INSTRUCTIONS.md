# ✅ VERCEL SETUP - AUTOMATED DEPLOYMENT READY

**Status:** Repository pushed to GitHub  
**Next:** Create 2 Vercel projects and add GitHub Secrets

---

## 📊 Current Status

✅ GitHub Repository: https://github.com/rajakumaropus/newskarnataka (pushed)  
✅ Vercel Account: https://vercel.com/rajakumaropus-7015  
✅ Code committed: 2 commits (Initial + Deployment guide)  
✅ Tokens saved in: `.env`

---

## 🔑 Your Credentials (Saved in .env)

✅ All tokens are saved in `.env` (not committed for security)  
✅ GitHub token is stored securely  
✅ Vercel token is stored securely  
✅ Strapi token is stored securely  

**Note:** Never commit tokens to git. GitHub Push Protection will block them!

---

## 🚀 STEP 1: CREATE VERCEL PROJECT (Website)

### Via Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select: **github.com/rajakumaropus/newskarnataka**
5. Click **"Import"**

### Configure Project

| Setting | Value |
|---------|-------|
| Project Name | `newskarnataka-website` |
| Root Directory | `newskarnataka-website` |
| Framework Preset | `Next.js` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### Add Environment Variables

In Vercel project settings, go to **Environment Variables** and add:

```
NEXT_PUBLIC_STRAPI_URL=http://103.191.208.235:1337
STRAPI_API_TOKEN_FULL_ACCESS=a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
```

### Copy Project ID

After deployment:
1. Go to project **Settings** → **General**
2. Copy the **Project ID**
3. Save it: Update `.env` file with `VERCEL_PROJECT_ID_WEBSITE=<ID>`

---

## 🚀 STEP 2: CREATE VERCEL PROJECT (Console)

Repeat the above steps with:

| Setting | Value |
|---------|-------|
| Project Name | `newskarnataka-console` |
| Root Directory | `newskarnataka-console` |
| Framework Preset | `Other` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Environment Variables for Console

```
VITE_STRAPI_URL=http://103.191.208.235:1337
VITE_STRAPI_API_TOKEN=a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
```

### Copy Project ID

After deployment, copy the **Project ID** and save it in `.env` as `VERCEL_PROJECT_ID_CONSOLE=<ID>`

---

## 🔐 STEP 3: ADD GITHUB SECRETS

These enable GitHub Actions CI/CD.

1. Go to: https://github.com/rajakumaropus/newskarnataka
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these 6 secrets:

| Secret Name | Value |
|---|---|
| `VERCEL_TOKEN` | (From your `.env` file) |
| `VERCEL_ORG_ID` | `rajkumaropus-7015` |
| `VERCEL_PROJECT_ID_WEBSITE` | (From website project) |
| `VERCEL_PROJECT_ID_CONSOLE` | (From console project) |
| `STRAPI_URL` | `http://103.191.208.235:1337` |
| `STRAPI_API_TOKEN` | (From your `.env` file) |

**How to add each:**
- Click "New repository secret"
- Name: (copy from table)
- Secret: (paste value)
- Click "Add secret"

---

## ✅ STEP 4: VERIFY GITHUB ACTIONS

1. Go to: https://github.com/rajakumaropus/newskarnataka/actions
2. Should see workflow: **"Deploy to Production"**
3. It will auto-run on next push

---

## 🎯 STEP 5: TRIGGER DEPLOYMENT (Optional)

If you want to deploy immediately:

```powershell
cd d:\Personal\Kiro\newsKarnataka
echo "# Deployed!" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push origin main
```

Then monitor: https://github.com/rajakumaropus/newskarnataka/actions

---

## 🎉 AFTER DEPLOYMENT

### Access Your Live Apps

- **Website:** https://newskarnataka-website.vercel.app
- **Console:** https://newskarnataka-console.vercel.app
- **Admin:** http://103.191.208.235:1337/admin

### Test the Applications

**Website:**
```
✓ Should display articles from Strapi
✓ Search functionality works
✓ Category filtering works
✓ Article detail pages load
```

**Console:**
```
✓ Login with: editor@newskarnataka.com / password123
✓ Dashboard shows stats
✓ Can submit articles
✓ Content queue displays articles
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] GitHub repo pushed: https://github.com/rajakumaropus/newskarnataka
- [ ] Vercel website project created
- [ ] Vercel website Project ID saved
- [ ] Vercel console project created
- [ ] Vercel console Project ID saved
- [ ] GitHub Secrets added (6 total)
- [ ] GitHub Actions workflow visible
- [ ] First deployment triggered
- [ ] Website live at vercel app URL
- [ ] Console live at vercel app URL
- [ ] Articles displaying on website
- [ ] Login works on console

---

## 🔗 Important Links

```
GitHub Repository:        https://github.com/rajakumaropus/newskarnataka
GitHub Actions:           https://github.com/rajakumaropus/newskarnataka/actions
GitHub Secrets:           https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions

Vercel Dashboard:         https://vercel.com/dashboard
Vercel Website Project:   https://vercel.com/rajakumaropus-7015/newskarnataka-website
Vercel Console Project:   https://vercel.com/rajakumaropus-7015/newskarnataka-console

Live URLs (After Deploy):
  Website:    https://newskarnataka-website.vercel.app
  Console:    https://newskarnataka-console.vercel.app
  Admin:      http://103.191.208.235:1337/admin
```

---

**Next:** Complete the 5 steps above, then verify deployment! 🚀


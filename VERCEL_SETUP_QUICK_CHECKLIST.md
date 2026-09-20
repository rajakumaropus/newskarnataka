# Vercel Git Integration - Quick Setup Checklist

## 🎯 5-MINUTE SETUP

### What Was Done Automatically ✅
- [x] GitHub Actions workflow deleted (`.github/workflows/deploy.yml`)
- [x] Verified no vercel.json files exist
- [x] Project structure confirmed

### What You Need To Do Now 🔧

#### For Both Projects in Vercel Dashboard:

**1. Website Project Settings** (newskarnataka-website)
```
Settings → Build & Development
├─ Root Directory: [EMPTY]
├─ Build Command: [EMPTY] 
├─ Output Directory: [EMPTY]
└─ Framework: Auto-detected as Next.js

Environment Variables:
├─ NEXT_PUBLIC_STRAPI_URL: https://your-strapi.com
└─ NEXT_PUBLIC_STRAPI_API_TOKEN: <token>

Git Settings:
├─ GitHub connected: ✓
├─ Production branch: main
└─ Auto-deploy on push: Enabled
```

**2. Console Project Settings** (newskarnataka-console)
```
Settings → Build & Development
├─ Root Directory: [EMPTY]
├─ Build Command: [EMPTY]
├─ Output Directory: [EMPTY]
└─ Framework: Auto-detected as Vite

Environment Variables:
├─ VITE_STRAPI_URL: https://your-strapi.com
└─ VITE_STRAPI_API_TOKEN: <token>

Git Settings:
├─ GitHub connected: ✓
├─ Production branch: main
└─ Auto-deploy on push: Enabled
```

### Key Points
- ⚠️ Leave Root Directory, Build Command, Output Directory **EMPTY** for auto-detection
- 🔑 Environment variables are **CRITICAL** - must match your actual values
- 🚀 Once configured, every push to main auto-deploys automatically
- 📊 No more GitHub Actions = simpler, more reliable

### Test It
```bash
git add .
git commit -m "fix: remove github actions, use vercel git integration"
git push origin main
```

Then watch Vercel Dashboard - deployment should start automatically!

### Status Check
Visit your Vercel Dashboard → Each project should show:
- "Building..." when you push
- "Ready" when complete
- No GitHub Actions badge

---

**That's it!** Vercel will now handle all deployments automatically. 🎉

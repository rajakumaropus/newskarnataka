# Vercel Dashboard Manual Setup Guide

## 🎯 Overview
The GitHub Actions workflow has been removed. Now you need to configure Vercel to automatically deploy from GitHub on every push to `main`.

## ✅ Status So Far
- [x] GitHub Actions workflow deleted from `.github/workflows/deploy.yml`
- [x] Changes committed and pushed to main
- [x] Repository is clean and ready
- [ ] Vercel projects need dashboard configuration

## 🔧 Setup Instructions

### Website Project (newskarnataka-website)

#### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on the **"newskarnataka-website"** project

#### Step 2: Configure Git Settings
1. Click **Settings** in the top navigation
2. Go to **Git** section
3. Verify:
   - GitHub account is connected ✓
   - Repository shows: `rajakumaropus/newskarnataka` ✓
   - Production branch: `main` ✓
   - Deploy on every push: Enabled ✓

#### Step 3: Configure Build Settings
1. In **Settings**, go to **Build & Development**
2. Set the following:
   ```
   Framework Preset: Next.js (should auto-detect)
   Root Directory: [LEAVE EMPTY - don't specify newskarnataka-website]
   Build Command: [LEAVE EMPTY - uses default "next build"]
   Output Directory: [LEAVE EMPTY - uses default ".next"]
   Development Command: [LEAVE EMPTY]
   Install Command: [LEAVE EMPTY]
   ```
   
   ⚠️ **IMPORTANT**: Leaving Root Directory empty tells Vercel to auto-detect from package.json location

#### Step 4: Add Environment Variables
1. In **Settings**, go to **Environment Variables**
2. Add the following (get values from `.env.example`):
   
   | Variable Name | Value | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_STRAPI_URL` | `https://your-strapi-url.com` | Production, Preview, Development |
   | `NEXT_PUBLIC_STRAPI_API_TOKEN` | `your-api-token-here` | Production, Preview, Development |

3. Click **Save** after adding each variable

#### Step 5: Verify Settings
Click **Deployments** and look for recent deployment attempts. You should see:
- The deployment we just pushed is now visible
- Status shows either "Building", "Ready", or "Error"

---

### Console Project (newskarnataka-console)

#### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on the **"newskarnataka-console"** project

#### Step 2: Configure Git Settings
1. Click **Settings** in the top navigation
2. Go to **Git** section
3. Verify:
   - GitHub account is connected ✓
   - Repository shows: `rajakumaropus/newskarnataka` ✓
   - Production branch: `main` ✓
   - Deploy on every push: Enabled ✓

#### Step 3: Configure Build Settings
1. In **Settings**, go to **Build & Development**
2. Set the following:
   ```
   Framework Preset: Vite (should auto-detect)
   Root Directory: [LEAVE EMPTY - don't specify newskarnataka-console]
   Build Command: [LEAVE EMPTY - uses default "vite build"]
   Output Directory: [LEAVE EMPTY - uses default "dist"]
   Development Command: [LEAVE EMPTY]
   Install Command: [LEAVE EMPTY]
   ```
   
   ⚠️ **IMPORTANT**: Leaving Root Directory empty tells Vercel to auto-detect from package.json location

#### Step 4: Add Environment Variables
1. In **Settings**, go to **Environment Variables**
2. Add the following (get values from `.env.local`):
   
   | Variable Name | Value | Environments |
   |---|---|---|
   | `VITE_STRAPI_URL` | `https://your-strapi-url.com` | Production, Preview, Development |
   | `VITE_STRAPI_API_TOKEN` | `your-api-token-here` | Production, Preview, Development |

3. Click **Save** after adding each variable

#### Step 5: Verify Settings
Click **Deployments** and look for recent deployment attempts. You should see:
- The deployment we just pushed is now visible
- Status shows either "Building", "Ready", or "Error"

---

## 🚀 Test the Setup

### Testing Website Deployment
1. Make a small change to a file in `newskarnataka-website/`:
   ```bash
   # Example: Update a comment or add a console.log
   # Edit any file in the website directory
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify vercel git integration"
   git push origin main
   ```

3. Watch Vercel Dashboard:
   - Go to https://vercel.com/dashboard
   - Click "newskarnataka-website"
   - Click "Deployments"
   - You should see a new deployment starting automatically
   - Wait for it to complete (usually 1-2 minutes)

4. Verify the change:
   - Once deployment shows "Ready", click the deployment
   - Click the production URL
   - Your change should be visible

### Testing Console Deployment
1. Make a small change to a file in `newskarnataka-console/`:
   ```bash
   # Example: Update a comment in a component
   # Edit any file in the console directory
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify console git integration"
   git push origin main
   ```

3. Watch Vercel Dashboard:
   - Go to https://vercel.com/dashboard
   - Click "newskarnataka-console"
   - Click "Deployments"
   - You should see a new deployment starting automatically
   - Wait for it to complete

4. Verify the change:
   - Once deployment shows "Ready", click the deployment
   - Click the production URL
   - Your change should be visible

---

## ✨ How It Works Now

1. **You push to main** → GitHub sends webhook to Vercel
2. **Vercel detects the push** → Automatically starts build
3. **Vercel reads package.json** → Determines build command and output directory
4. **For Website**: Runs `npm run build` → Creates `.next` folder → Deploys
5. **For Console**: Runs `npm run build` (Vite) → Creates `dist` folder → Deploys
6. **Deployment completes** → Your changes are live

**No more manual deployments needed!** 🎉

---

## 🆘 Troubleshooting

### Deployment Not Starting
- Check that GitHub is connected in Vercel project settings
- Verify the production branch is set to `main`
- Ensure you pushed to GitHub (check GitHub repository)

### Deployment Failing
1. Click the failed deployment in Vercel
2. Click "View Build Log"
3. Look for error messages
4. Common issues:
   - Missing environment variables → Add them in Vercel Settings
   - Node version mismatch → Next.js needs Node 18+, but 20 is recommended
   - Build script error → Run `npm run build` locally to test

### Build Script Not Found
- Website: Check that `next.config.ts` exists and `npm run build` works locally
- Console: Check that `vite.config.ts` exists and `npm run build` works locally

### Environment Variables Not Being Used
- Verify variable names are correct (case-sensitive)
- For Website: Must start with `NEXT_PUBLIC_` to be public
- For Console: Must start with `VITE_` to be accessible
- Redeploy after adding variables (or use the "Redeploy" button)

---

## 📋 Verification Checklist

Before considering this complete:

- [ ] Website project has Git integration enabled
- [ ] Console project has Git integration enabled
- [ ] Website environment variables are set
- [ ] Console environment variables are set
- [ ] No Root Directory specified for either project
- [ ] No Build Command specified for either project
- [ ] No Output Directory specified for either project
- [ ] Test deployment pushed to main
- [ ] Website deployment completed successfully
- [ ] Console deployment completed successfully
- [ ] Changes visible on production URLs

---

## 🎯 Next Steps

1. Follow the setup instructions above for both projects
2. Test deployments with small commits
3. Verify changes are live
4. Delete any remaining deployment scripts or documentation
5. You're done! Vercel will now auto-deploy on every push to main

---

**Questions?** Check:
- Vercel docs: https://vercel.com/docs
- Next.js build: https://nextjs.org/docs/app/building-your-application/deploying
- Vite build: https://vitejs.dev/guide/build.html

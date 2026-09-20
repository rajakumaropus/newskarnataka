# Vercel Git Integration Setup - Permanent Solution

## ✅ COMPLETED STEPS

### Step 1: GitHub Actions Workflow Deleted
- **Status**: ✅ DONE
- **File deleted**: `.github/workflows/deploy.yml`
- **Reason**: Moving to Vercel-native Git integration for simpler, more reliable deployments

### Step 2: Verified No vercel.json Files Exist
- **Status**: ✅ DONE
- **Result**: No vercel.json files found in repository
- **Action**: None needed - we'll let Vercel auto-detect

## 🔧 MANUAL SETUP REQUIRED IN VERCEL DASHBOARD

### Website Project (Next.js - newskarnataka-website)

1. **Go to Vercel Dashboard** → Select "newskarnataka-website" project
2. **Settings → Git**:
   - Verify GitHub integration is connected
   - Repository: `your-username/newsKarnataka`
   - Production branch: `main`
   - Preview branches: Leave default
3. **Settings → Build & Development**:
   - **Root Directory**: Leave EMPTY (Vercel will auto-detect)
   - **Build Command**: Leave EMPTY (Next.js will use default `next build`)
   - **Output Directory**: Leave EMPTY (Next.js outputs to `.next`)
   - **Install Command**: Leave EMPTY (uses default npm install)
4. **Environment Variables**:
   - Add these variables (found in `.env.example`):
     - `NEXT_PUBLIC_STRAPI_URL` = `your_strapi_url`
     - `NEXT_PUBLIC_STRAPI_API_TOKEN` = `your_api_token`

### Console Project (Vite/React - newskarnataka-console)

1. **Go to Vercel Dashboard** → Select "newskarnataka-console" project
2. **Settings → Git**:
   - Verify GitHub integration is connected
   - Repository: `your-username/newsKarnataka`
   - Production branch: `main`
   - Preview branches: Leave default
3. **Settings → Build & Development**:
   - **Root Directory**: Leave EMPTY (Vercel will auto-detect from package.json location)
   - **Build Command**: Leave EMPTY (Vite will use `vite build`)
   - **Output Directory**: Leave EMPTY (Vite outputs to `dist/`)
   - **Install Command**: Leave EMPTY (uses default npm install)
4. **Environment Variables**:
   - Add these variables (found in `.env.local`):
     - `VITE_STRAPI_URL` = `your_strapi_url`
     - `VITE_STRAPI_API_TOKEN` = `your_api_token`

## ✨ HOW IT WORKS NOW (Vercel-Native)

1. **Push to main** → GitHub triggers webhook → Vercel auto-detects changes
2. **Vercel reads package.json** at project root → Builds automatically
3. **For Website**: Detects Next.js project, runs build, deploys `.next`
4. **For Console**: Detects Vite config, runs build, deploys `dist/`
5. **No manual intervention** → Auto-deployment on every main branch push
6. **Preview deployments** → Automatic for pull requests

## 🔑 ENVIRONMENT VARIABLES CHECKLIST

### Website (.env.example values → Vercel Console)
```
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
NEXT_PUBLIC_STRAPI_API_TOKEN=<your-api-token>
```

### Console (.env.local values → Vercel Console)
```
VITE_STRAPI_URL=https://your-strapi-instance.com
VITE_STRAPI_API_TOKEN=<your-api-token>
```

## 📋 VERIFICATION CHECKLIST

After setting up in Vercel Dashboard:

- [ ] Website project shows GitHub integration active
- [ ] Console project shows GitHub integration active
- [ ] Both projects have production branch set to `main`
- [ ] Website environment variables are configured
- [ ] Console environment variables are configured
- [ ] No build/output directories specified (auto-detect enabled)

## 🚀 TESTING DEPLOYMENT

Once configured:

1. **Make a small test change** to a file in `newskarnataka-website` or `newskarnataka-console`
2. **Commit and push** to main:
   ```bash
   git add <file>
   git commit -m "test: trigger vercel auto-deployment"
   git push origin main
   ```
3. **Watch Vercel Dashboard** → You should see deployment starting automatically
4. **Deployment should complete** in 1-2 minutes
5. **Visit your preview URL** to verify changes are live

## ✅ SUCCESS INDICATORS

- ✅ Vercel shows "Building..." when you push to main
- ✅ No GitHub Actions workflow runs (we deleted it)
- ✅ Deployment completes automatically
- ✅ Your site is updated at the production URL
- ✅ Pull requests get automatic preview deployments

## 🆘 TROUBLESHOOTING

If deployment fails:

1. **Check Vercel Build Logs**: Dashboard → Project → Deployments → Failed deployment → View logs
2. **Common issues**:
   - Missing environment variables → Add them in Vercel Console
   - Node version mismatch → Verify Node 20 is set in Vercel
   - Build script failure → Check if `npm run build` works locally
   - Wrong root directory → Should be EMPTY for auto-detect

## 📝 NEXT STEPS

1. Log into [Vercel Dashboard](https://vercel.com/dashboard)
2. For each project (Website & Console):
   - Navigate to Settings
   - Configure Git, Build settings, and Environment Variables
   - Leave Root Directory, Build Command, Output Directory EMPTY
3. Test with a small commit to main
4. Monitor the deployment in Vercel Dashboard
5. Verify the deployed changes are live

---

**This is a permanent, reliable solution.** Once configured, Vercel handles all deployments automatically whenever you push to main. No more GitHub Actions workflows needed!

# Complete Deployment Execution Guide

**Status:** Ready for Implementation  
**Total Steps:** 8  
**Estimated Total Time:** 45 minutes (including waiting for deployments)

---

## STEP 1: Update Vercel Website Project Settings ⏳ IN PROGRESS

**Location:** https://vercel.com/rajkumaropus-7015/newskarnataka-website/settings

**What to Update:**

| Setting | Current | New Value |
|---------|---------|-----------|
| Root Directory | (varies) | `newskarnataka-website` |
| Build Command | (varies) | `npm run build` |
| Output Directory | (varies) | `.next` |
| Install Command | (varies) | `npm ci --legacy-peer-deps` |
| Node.js Version | (varies) | `20.x` |
| Git Integration | (varies) | **DISABLED** |

**How:**
1. Open https://vercel.com/rajkumaropus-7015/newskarnataka-website/settings
2. Update each setting as shown above
3. Click "Save" after each change
4. Go to Settings → Git and click "Disconnect" to disable Git integration
5. Return here when complete

**Verification:**
- [ ] Root Directory set to `newskarnataka-website`
- [ ] Build Command set to `npm run build`
- [ ] Output Directory set to `.next`
- [ ] Install Command set to `npm ci --legacy-peer-deps`
- [ ] Node.js Version set to `20.x`
- [ ] Git Integration Disconnected

---

## STEP 2: Update Vercel Console Project Settings

**Location:** https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings

**What to Update:**

| Setting | Current | New Value |
|---------|---------|-----------|
| Root Directory | (varies) | `newskarnataka-console` |
| Build Command | (varies) | `npm run build` |
| Output Directory | (varies) | `dist` |
| Install Command | (varies) | `npm ci --legacy-peer-deps` |
| Node.js Version | (varies) | `20.x` |
| Git Integration | (varies) | **DISABLED** |

**How:**
1. Open https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings
2. Update each setting as shown above
3. Click "Save" after each change
4. Go to Settings → Git and click "Disconnect" to disable Git integration
5. Return here when complete

**Verification:**
- [ ] Root Directory set to `newskarnataka-console`
- [ ] Build Command set to `npm run build`
- [ ] Output Directory set to `dist`
- [ ] Install Command set to `npm ci --legacy-peer-deps`
- [ ] Node.js Version set to `20.x`
- [ ] Git Integration Disconnected

---

## STEP 3: Verify GitHub Secrets

**Location:** https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions

**Required Secrets (5 total):**

1. **VERCEL_TOKEN**
   - Value: `vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm`
   - Status: Check if exists

2. **VERCEL_WEBSITE_PROJECT_ID**
   - Value: `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1`
   - Status: Check if exists

3. **VERCEL_CONSOLE_PROJECT_ID**
   - Value: `prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw`
   - Status: Check if exists

4. **STRAPI_URL**
   - Value: `http://103.191.208.235:1337`
   - Status: Check if exists

5. **STRAPI_API_TOKEN**
   - Value: Long token (check in `.env` file)
   - Status: Check if exists

**How:**
1. Open https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions
2. You should see 5 secrets listed
3. Verify each one exists (values are hidden for security)
4. If any are missing, create them:
   - Click "New repository secret"
   - Enter Name (e.g., VERCEL_TOKEN)
   - Enter Value (from above)
   - Click "Add secret"

**Verification:**
- [ ] VERCEL_TOKEN exists
- [ ] VERCEL_WEBSITE_PROJECT_ID exists
- [ ] VERCEL_CONSOLE_PROJECT_ID exists
- [ ] STRAPI_URL exists
- [ ] STRAPI_API_TOKEN exists

---

## STEP 4: Trigger Test Deployment

**Location:** https://github.com/rajakumaropus/newskarnataka/actions

**How to Trigger:**

**Option A: Manual Workflow Trigger (Fastest)**
1. Go to https://github.com/rajakumaropus/newskarnataka/actions
2. Click "Deploy to Vercel" workflow on the left
3. Click "Run workflow" button (top right)
4. Click "Run workflow" in the dropdown
5. Workflow starts immediately

**Option B: Push a Test Commit**
1. Open any file (e.g., README.md)
2. Make a small change
3. Commit: `git add README.md && git commit -m "test: trigger deployment"`
4. Push: `git push origin main`
5. Workflow triggers automatically

**Expected:**
- Workflow appears in Actions tab
- Status: "Running" (yellow icon)
- Two jobs appear: `deploy-website` and `deploy-console`

---

## STEP 5: Monitor Workflow Execution

**Location:** https://github.com/rajakumaropus/newskarnataka/actions

**What to Watch:**

1. **Both Jobs Running Parallel**
   ```
   deploy-website  [████░░░░░] 50%
   deploy-console  [████░░░░░] 50%
   ```

2. **Expected Timeline:**
   - 0:00-1:00 - Checkout & Node setup
   - 1:00-2:00 - Install Vercel CLI
   - 2:00-3:00 - Pull Vercel environment
   - 3:00-5:00 - Install dependencies (npm ci)
   - 5:00-7:00 - Build locally (npm run build)
   - 7:00-8:00 - Deploy to Vercel
   - Total: ~8-14 minutes

3. **Success Indicators:**
   - Green checkmark next to each job
   - Status: "completed successfully"
   - No red error indicators

4. **Failure Indicators:**
   - Red X next to a job
   - Status: "failed"
   - Error message in logs

**Verification:**
- [ ] Both jobs started
- [ ] Both jobs completed
- [ ] Both jobs show green checkmark
- [ ] No error messages

**If Fails:**
- Click on failed job
- Read error message
- Common issues:
  - VERCEL_TOKEN invalid
  - VERCEL_PROJECT_ID wrong
  - Lockfile issue
  - Build failed

---

## STEP 6: Verify Website App Loads

**URL:** https://newskarnataka-website.vercel.app

**How to Verify:**
1. Open https://newskarnataka-website.vercel.app in browser
2. Wait for page to load (30 seconds max)
3. Check for:
   - ✅ No errors in page
   - ✅ Page content visible
   - ✅ Articles displayed
   - ✅ Strapi logo or backend indicator

**Expected Content:**
- Homepage showing articles
- Navigation menu
- Search functionality
- Categories

**If Error:**
- Check browser console (F12)
- Look for error messages
- Common issues:
  - STRAPI_URL not reachable
  - Environment variables not passed
  - Build failed

**Verification:**
- [ ] Page loads without 500 error
- [ ] Content visible
- [ ] No console errors
- [ ] Page responsive

---

## STEP 7: Verify Console App Loads

**URL:** https://newskarnataka-console.vercel.app

**How to Verify:**
1. Open https://newskarnataka-console.vercel.app in browser
2. Wait for page to load (30 seconds max)
3. Check for:
   - ✅ No errors in page
   - ✅ Admin interface visible
   - ✅ Strapi connection indicator

**Expected Content:**
- Admin dashboard
- Login interface or authenticated state
- Menu/navigation
- Database connection indicator

**If Error:**
- Check browser console (F12)
- Look for error messages
- Verify VITE_ environment variables passed

**Verification:**
- [ ] Page loads without 500 error
- [ ] Interface visible
- [ ] No console errors
- [ ] Strapi connection working

---

## STEP 8: Test Strapi API Integration

**Testing Both Apps:**

### Website API Integration

1. **Open Browser DevTools**
   - Press F12 on https://newskarnataka-website.vercel.app
   - Go to Network tab

2. **Reload Page**
   - Press Ctrl+R (Cmd+R on Mac)
   - Watch Network tab

3. **Look for GraphQL Requests**
   - Filter: type "graphql" in search
   - Or look for requests to `/graphql`
   - Should show requests to Strapi

4. **Verify Success**
   - Status: 200 (success)
   - Response contains articles data
   - No 401/403 (authentication errors)

5. **Expected:**
   - Requests to http://103.191.208.235:1337/graphql
   - Returns article data
   - No CORS errors

### Console API Integration

1. **Open Browser DevTools**
   - Press F12 on https://newskarnataka-console.vercel.app
   - Go to Network tab

2. **Reload Page**
   - Press Ctrl+R (Cmd+R on Mac)
   - Watch Network tab

3. **Look for API Requests**
   - Filter: API calls to Strapi
   - Should show requests to backend

4. **Verify Success**
   - Status: 200 (success)
   - Response contains expected data
   - No 401/403 (authentication errors)

5. **Expected:**
   - Requests to http://103.191.208.235:1337
   - Returns admin data
   - No CORS errors

**Verification:**
- [ ] Website makes GraphQL requests to Strapi
- [ ] Console makes API requests to Strapi
- [ ] Both receive 200 status responses
- [ ] No authentication errors
- [ ] No CORS errors

---

## FINAL CHECKLIST

All steps completed when:

- [ ] Step 1: Vercel Website settings updated and saved
- [ ] Step 2: Vercel Console settings updated and saved
- [ ] Step 3: All 5 GitHub secrets verified
- [ ] Step 4: Test deployment triggered
- [ ] Step 5: Both jobs completed successfully
- [ ] Step 6: Website app loads and displays content
- [ ] Step 7: Console app loads and shows interface
- [ ] Step 8: Strapi API integration verified in both apps

---

## SUCCESS OUTCOME

When all steps complete successfully:

✅ **Website**: https://newskarnataka-website.vercel.app (Live)  
✅ **Console**: https://newskarnataka-console.vercel.app (Live)  
✅ **API**: Strapi backend connected and responding  
✅ **Workflow**: GitHub Actions deploying on every push to main  
✅ **Duration**: 8-14 minutes per deployment  
✅ **Status**: Production Ready

---

## TROUBLESHOOTING QUICK REFERENCE

| Issue | Solution |
|-------|----------|
| Workflow fails immediately | Check all 5 GitHub secrets are set |
| "No project found" error | Verify VERCEL_PROJECT_ID is correct |
| Website shows 404 | Check Root Directory = `newskarnataka-website` |
| Build fails | Check lockfiles are committed |
| API not reachable | Verify STRAPI_URL is correct (http://103.191.208.235:1337) |
| Deploy succeeds but app blank | Check environment variables |

---

**Next Action:** Start with Step 1

Report status of each step after completion.

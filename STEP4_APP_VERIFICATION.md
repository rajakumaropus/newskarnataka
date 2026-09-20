# Step 4: App Deployment Verification

**Status:** Checking if both apps deployed successfully  
**Expected Time:** 8-14 minutes from workflow trigger  
**Action Required:** Open URLs in browser and verify functionality

---

## 📱 Live App URLs

### Website
- **URL:** https://newskarnataka-website.vercel.app
- **Framework:** Next.js 16
- **Expected Content:** News articles, categories, search functionality
- **Environment Variables:** `NEXT_PUBLIC_STRAPI_URL`

### Console (Admin Interface)
- **URL:** https://newskarnataka-console.vercel.app
- **Framework:** Vite React
- **Expected Content:** Admin dashboard, login interface
- **Environment Variables:** `VITE_STRAPI_URL`

---

## ✅ Verification Checklist

### For Website App
- [ ] **Load Test:** Page loads without errors
  - Open: https://newskarnataka-website.vercel.app
  - Expected: Home page with articles visible

- [ ] **Visual Inspection:**
  - [ ] Header visible with navigation
  - [ ] Article cards displayed
  - [ ] Categories listed
  - [ ] Search bar functional
  - [ ] Footer visible

- [ ] **Console Check (F12 → Console tab):**
  - [ ] No red errors
  - [ ] Look for environment: `NEXT_PUBLIC_STRAPI_URL`
  - [ ] Network tab: No 404 for API calls

- [ ] **API Integration:**
  - [ ] Articles loading from Strapi
  - [ ] Categories fetching correctly
  - [ ] Search functionality working

### For Console App
- [ ] **Load Test:** Page loads without errors
  - Open: https://newskarnataka-console.vercel.app
  - Expected: Admin interface visible

- [ ] **Visual Inspection:**
  - [ ] Dashboard/Home page visible
  - [ ] Navigation menu present
  - [ ] UI elements responsive
  - [ ] No layout broken

- [ ] **Console Check (F12 → Console tab):**
  - [ ] No red errors
  - [ ] Look for environment: `VITE_STRAPI_URL`
  - [ ] Network tab: No 404 for API calls

- [ ] **API Integration:**
  - [ ] Can communicate with Strapi
  - [ ] No CORS errors
  - [ ] Authentication tokens present

---

## 🔍 Troubleshooting

### Issue: Apps Not Loading (404 or Blank Page)

**Possible Cause 1: Still Deploying**
- **Check:** GitHub Actions workflow status
- **URL:** https://github.com/rajakumaropus/newskarnataka/actions
- **Fix:** Wait 5-15 minutes for deployment to complete

**Possible Cause 2: Build Failed**
- **Check:** GitHub Actions logs for errors
- **Common Errors:**
  - `npm ci` failures → Lockfile mismatch
  - `vercel build` failures → Missing environment variables
  - `vercel deploy` failures → Project configuration issue
- **Fix:** See error log and apply fix from troubleshooting guide

**Possible Cause 3: Environment Variables Not Set**
- **Check:** Open browser console (F12) for errors
- **Look For:** "STRAPI_URL is undefined"
- **Fix:** Verify GitHub secrets are set:
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_WEBSITE_PROJECT_ID
  - VERCEL_CONSOLE_PROJECT_ID
  - STRAPI_URL
  - STRAPI_API_TOKEN

### Issue: Apps Load but Show Errors

**Error: "Failed to fetch from Strapi"**
- **Cause:** Strapi API unreachable
- **Check:** Is Strapi running at http://103.191.208.235:1337?
- **Fix:** Verify STRAPI_URL is correct

**Error: "Invalid API Token"**
- **Cause:** STRAPI_API_TOKEN is wrong or expired
- **Fix:** Generate new token in Strapi dashboard

**Error: CORS errors**
- **Cause:** Strapi CORS not configured for Vercel domains
- **Fix:** Update Strapi CORS settings for:
  - https://newskarnataka-website.vercel.app
  - https://newskarnataka-console.vercel.app

---

## 🚀 Success Indicators

### All Green ✅
```
✅ Website loads immediately
✅ Console loads immediately
✅ No console errors (F12)
✅ Articles visible on website
✅ Admin interface visible on console
✅ No 404 errors
✅ API calls successful
✅ Both apps responsive
```

### Partial Success ⚠️
```
✅ Apps load
❌ Some API calls failing
❌ Console errors present
❌ CORS issues

Action: Check Strapi configuration and environment variables
```

### Failed ❌
```
❌ Apps won't load (404 or blank)
❌ Multiple errors in console
❌ No network connectivity

Action: Check GitHub Actions logs for build failures
```

---

## 📊 Performance Metrics to Check

In browser DevTools (F12 → Performance):

- **Website Load Time:** Target < 3 seconds
- **Console Load Time:** Target < 2 seconds
- **API Response Time:** Target < 500ms
- **Time to Interactive:** Target < 5 seconds

---

## 🔗 Links to Check

- Website: https://newskarnataka-website.vercel.app
- Console: https://newskarnataka-console.vercel.app
- Strapi: http://103.191.208.235:1337/admin
- GitHub Actions: https://github.com/rajakumaropus/newskarnataka/actions
- Vercel Dashboard: https://vercel.com/rajakumaropus

---

## ✍️ Verification Report

**Time Checked:** [Your Time]  
**Website Status:** [ ] ✅ Live [ ] ⏳ Loading [ ] ❌ Failed  
**Console Status:** [ ] ✅ Live [ ] ⏳ Loading [ ] ❌ Failed  
**Strapi Connection:** [ ] ✅ Working [ ] ⚠️ Partial [ ] ❌ Failed  
**Overall:** [ ] ✅ Ready [ ] ⚠️ Needs Fix [ ] ❌ Blocked  

**Notes:**
```
(Enter observations here)
```

---

## Next Steps

- [ ] **If both apps live:** Proceed to Step 5 (Test Strapi integration)
- [ ] **If partial success:** Fix the specific issue from troubleshooting
- [ ] **If failed:** Check GitHub Actions logs and apply fix

---

**Last Updated:** September 20, 2026  
**Deployment Version:** 9fdb0db (trigger commit)  
**Expected Status:** Both apps should be live within 10-14 minutes

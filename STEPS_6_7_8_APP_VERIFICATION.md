# Steps 6-8: App Verification & API Integration Testing

**Task:** Verify both apps load successfully and test Strapi API integration  
**Estimated Time:** 10 minutes  
**Status:** IN PROGRESS

---

## STEP 6: Verify Website App Loads

**URL:** https://newskarnataka-website.vercel.app

### How to Verify

1. **Open in Browser**
   - Go to: https://newskarnataka-website.vercel.app
   - Wait for page to load (may take 10-30 seconds on first load)

2. **Check for Success Indicators**
   - ✅ Page loads without error (no 404, 500, or blank page)
   - ✅ Homepage content visible
   - ✅ Articles/news items displayed
   - ✅ Navigation menu present
   - ✅ No red error messages

3. **If Successful**
   - Reply: "✅ Website loads successfully"
   - Proceed to Step 7

### If Error

**Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| Blank page | Build failed | Check GitHub Actions logs |
| 404 Not Found | App not deployed | Wait 1-2 min, refresh |
| 500 Server Error | Build/runtime error | Check Vercel deployment logs |
| Connection timeout | Vercel not responding | Try again in 1 minute |

---

## STEP 7: Verify Console App Loads

**URL:** https://newskarnataka-console.vercel.app

### How to Verify

1. **Open in Browser**
   - Go to: https://newskarnataka-console.vercel.app
   - Wait for page to load (may take 10-30 seconds on first load)

2. **Check for Success Indicators**
   - ✅ Page loads without error (no 404, 500, or blank page)
   - ✅ Admin interface visible
   - ✅ Dashboard/menu present
   - ✅ Strapi connection indicator (if any)
   - ✅ No red error messages

3. **If Successful**
   - Reply: "✅ Console loads successfully"
   - Proceed to Step 8

### If Error

**Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| Blank page | Build failed | Check GitHub Actions logs |
| 404 Not Found | App not deployed | Wait 1-2 min, refresh |
| 500 Server Error | Build/runtime error | Check Vercel deployment logs |
| Connection timeout | Vercel not responding | Try again in 1 minute |

---

## STEP 8: Test Strapi API Integration

**Purpose:** Verify both apps can communicate with Strapi backend

### Test Website API Integration

1. **Open Website** (from Step 6)
   - URL: https://newskarnataka-website.vercel.app

2. **Open Browser DevTools**
   - Press: F12 (or right-click → Inspect)
   - Go to: "Network" tab

3. **Reload Page**
   - Press: Ctrl+R (or Cmd+R)
   - Watch Network tab

4. **Look for GraphQL Requests**
   - In Network tab, look for requests to:
     - `/graphql`
     - `103.191.208.235:1337`
   - Should see requests to Strapi backend

5. **Verify Success**
   - Status code: 200 (success)
   - Response contains data (not error)
   - No CORS errors
   - No 401/403 authentication errors

6. **Expected Results**
   - ✅ GraphQL queries to Strapi succeeding
   - ✅ Article data received
   - ✅ No network errors

---

### Test Console API Integration

1. **Open Console** (from Step 7)
   - URL: https://newskarnataka-console.vercel.app

2. **Open Browser DevTools**
   - Press: F12 (or right-click → Inspect)
   - Go to: "Network" tab

3. **Reload Page**
   - Press: Ctrl+R (or Cmd+R)
   - Watch Network tab

4. **Look for API Requests**
   - In Network tab, look for requests to:
     - Strapi backend
     - `103.191.208.235:1337`
   - Should see requests to Strapi

5. **Verify Success**
   - Status code: 200 (success)
   - Response contains data (not error)
   - No CORS errors
   - No 401/403 authentication errors

6. **Expected Results**
   - ✅ API requests to Strapi succeeding
   - ✅ Admin data received
   - ✅ No network errors

---

## VERIFICATION CHECKLIST

### Website (Step 6)
- [ ] Page loads without error
- [ ] Content visible
- [ ] No console errors (F12 → Console tab)

### Console (Step 7)
- [ ] Page loads without error
- [ ] Interface visible
- [ ] No console errors (F12 → Console tab)

### API Integration (Step 8)
- [ ] Website: GraphQL requests succeeding
- [ ] Console: API requests succeeding
- [ ] No CORS errors
- [ ] No authentication errors
- [ ] Status 200 on API calls

---

## TROUBLESHOOTING

### Page doesn't load at all

1. Wait 2 minutes (Vercel may still be initializing)
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
3. Check Vercel deployment status:
   - Website: https://vercel.com/rajkumaropus-7015/newskarnataka-website/deployments
   - Console: https://vercel.com/rajkumaropus-7015/newskarnataka-console/deployments

### Page loads but shows errors

1. Open DevTools (F12)
2. Check Console tab for error messages
3. Report the error message

### API requests failing

1. Check if Strapi is running: http://103.191.208.235:1337
2. Check Network tab for exact error
3. Verify environment variables in Vercel:
   - Website: NEXT_PUBLIC_STRAPI_URL, NEXT_PUBLIC_STRAPI_API_TOKEN
   - Console: VITE_STRAPI_URL, VITE_STRAPI_API_TOKEN

---

## NEXT STEPS

After verifying all 3 steps:

1. Report all checks passed
2. Deployment is complete and verified
3. Apps are live and functioning
4. Ready for production use

---

## SUCCESS OUTCOME

When all steps complete successfully:

✅ **Website:** https://newskarnataka-website.vercel.app (Live)  
✅ **Console:** https://newskarnataka-console.vercel.app (Live)  
✅ **API:** Strapi backend connected and responding  
✅ **Status:** Production Ready

---

**Status: AWAITING VERIFICATION RESULTS**

Please perform Steps 6-8 and report the results.

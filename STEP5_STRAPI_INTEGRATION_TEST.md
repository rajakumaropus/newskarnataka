# Step 5: Strapi API Integration Testing

**Status:** Testing Strapi connectivity in deployed applications  
**Strapi URL:** http://103.191.208.235:1337  
**Action Required:** Verify API calls and data flow between apps and Strapi

---

## 🔍 Pre-Test Verification

### Check Strapi API Availability
```bash
# Test Strapi is running
curl http://103.191.208.235:1337/api/articles

# Expected Response:
{
  "data": [...articles],
  "meta": {...}
}
```

**If Strapi is not running:**
- Check server status: http://103.191.208.235:1337
- Verify network connectivity to 103.191.208.235:1337
- Restart Strapi service if needed

---

## 🌐 Website App Integration Test

### Test 1: Articles Loading
**URL:** https://newskarnataka-website.vercel.app

**Steps:**
1. Open the website
2. Check if articles are displayed on home page
3. Open browser console (F12)
4. Look for network calls to Strapi

**Expected Results:**
- ✅ Articles visible with titles, images, descriptions
- ✅ API calls to `http://103.191.208.235:1337/api/articles` showing 200 OK
- ✅ No CORS errors
- ✅ Load time < 3 seconds

**Verification Commands (in browser console):**
```javascript
// Check if STRAPI_URL is set
console.log(process.env.NEXT_PUBLIC_STRAPI_URL)

// Should output: http://103.191.208.235:1337
```

### Test 2: Categories Filter
**Steps:**
1. Look for categories dropdown/filter on website
2. Click on a category
3. Verify articles filter by category

**Expected Results:**
- ✅ Categories loading from Strapi
- ✅ Filtering works correctly
- ✅ API call: `/api/articles?filters[category][name]=$category`

### Test 3: Article Detail Page
**Steps:**
1. Click on an article
2. Verify full article content loads
3. Check browser network tab for API call

**Expected Results:**
- ✅ Article details load quickly
- ✅ API call returns full article data
- ✅ No missing fields

### Test 4: Search Functionality
**Steps:**
1. Use search bar on website
2. Search for a keyword
3. Verify results return

**Expected Results:**
- ✅ Search queries sent to Strapi
- ✅ Results display correctly
- ✅ API call: `/api/articles?filters[title][$contains]=$search`

---

## 🛠️ Console App Integration Test

### Test 1: Login & Authentication
**URL:** https://newskarnataka-console.vercel.app

**Steps:**
1. Open console app
2. Check if login interface appears
3. Attempt login with Strapi credentials

**Expected Results:**
- ✅ Login form functional
- ✅ API call to Strapi `/api/auth/local` returns token
- ✅ No CORS errors
- ✅ Authentication token stored in session

**Verification Commands (in browser console):**
```javascript
// Check if STRAPI_URL is set
console.log(process.env.VITE_STRAPI_URL)

// Should output: http://103.191.208.235:1337

// Check if API token is present
console.log(localStorage.getItem('jwt'))
// or
console.log(sessionStorage.getItem('jwt'))
```

### Test 2: Content Management
**Steps:**
1. Log in to console
2. Navigate to Articles section
3. View list of articles
4. Try to create/edit/delete an article

**Expected Results:**
- ✅ Articles list loads from Strapi
- ✅ CRUD operations work (Create, Read, Update, Delete)
- ✅ API calls return proper responses
- ✅ Changes reflected immediately

### Test 3: Media Upload
**Steps:**
1. Try to upload an image/media
2. Check if it's saved to Strapi media library
3. Verify it's available in website

**Expected Results:**
- ✅ File upload successful
- ✅ File stored in Strapi
- ✅ File URL accessible from website

### Test 4: API Token Verification
**Steps:**
1. Open DevTools Network tab
2. Perform any admin action
3. Check request headers for authorization token

**Expected Results:**
- ✅ Authorization header present: `Bearer <token>`
- ✅ Token is valid (not expired)
- ✅ API returns 200/201 responses, not 401

---

## 🔗 Network Tab Analysis

### In Browser DevTools (F12 → Network)

**Website App - Look for these API calls:**
```
GET http://103.191.208.235:1337/api/articles
GET http://103.191.208.235:1337/api/categories
GET http://103.191.208.235:1337/api/articles/:id
```

**Console App - Look for these API calls:**
```
POST http://103.191.208.235:1337/api/auth/local
GET http://103.191.208.235:1337/api/articles
POST http://103.191.208.235:1337/api/articles
PUT http://103.191.208.235:1337/api/articles/:id
DELETE http://103.191.208.235:1337/api/articles/:id
```

**Expected for all:**
- Status: 200 or 201 (success)
- NOT 403, 401, 404, 500
- Response time: < 1000ms typically

---

## ⚠️ Common Issues & Fixes

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://103.191.208.235:1337/api/articles' 
from origin 'https://newskarnataka-website.vercel.app' has been blocked by CORS policy
```

**Fix:**
1. Go to Strapi admin: http://103.191.208.235:1337/admin
2. Settings → CORS
3. Add origins:
   - https://newskarnataka-website.vercel.app
   - https://newskarnataka-console.vercel.app
4. Save and reload apps

### Issue: 401 Unauthorized
```
Error: 401 Unauthorized - Invalid API token
```

**Fix:**
1. Check STRAPI_API_TOKEN secret in GitHub is correct
2. Verify token hasn't expired in Strapi
3. Generate new token if needed:
   - Strapi Admin → Settings → API Tokens → Create new
4. Update GitHub secret with new token
5. Re-trigger deployment

### Issue: API Calls Timing Out
```
Error: Request timeout - Strapi API not responding
```

**Fix:**
1. Verify Strapi is running: http://103.191.208.235:1337/admin
2. Check network connectivity to server
3. Check if firewall blocking port 1337
4. Increase timeout in app config if needed

### Issue: Environment Variables Not Set
```
TypeError: Cannot read property 'NEXT_PUBLIC_STRAPI_URL' of undefined
```

**Fix:**
1. Verify environment variables in Vercel projects
2. Check GitHub secrets are all set
3. Force re-deploy from GitHub
4. Check build logs for env var injection errors

---

## 📊 Integration Test Checklist

### Website App (https://newskarnataka-website.vercel.app)
- [ ] Articles loading from Strapi
- [ ] Categories functioning
- [ ] Search working
- [ ] Article detail pages loading
- [ ] No CORS errors
- [ ] No 401/403 errors
- [ ] API response time < 1s
- [ ] Images displaying correctly
- [ ] Pagination working (if applicable)

### Console App (https://newskarnataka-console.vercel.app)
- [ ] Login form functional
- [ ] Authentication successful
- [ ] Articles list showing
- [ ] Create article working
- [ ] Edit article working
- [ ] Delete article working
- [ ] API token valid
- [ ] Authorization headers present
- [ ] Media upload functional

### Strapi Backend
- [ ] Strapi running and accessible
- [ ] CORS configured for Vercel domains
- [ ] API tokens valid and not expired
- [ ] Database queries executing
- [ ] No errors in Strapi logs

---

## 🧪 API Endpoint Testing

### Using curl (Command Line)

**Test Articles Endpoint:**
```bash
curl -X GET http://103.191.208.235:1337/api/articles \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Test Authentication:**
```bash
curl -X POST http://103.191.208.235:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "password": "password"
  }'
```

**Test Create Article:**
```bash
curl -X POST http://103.191.208.235:1337/api/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Test Article",
      "content": "Test content"
    }
  }'
```

---

## 📈 Performance Metrics

### Acceptable Response Times
- Articles list: < 500ms
- Article detail: < 500ms
- Authentication: < 1000ms
- Upload: < 5000ms
- Search: < 1000ms

### Overall Load Time Targets
- Website: < 3 seconds
- Console: < 2 seconds

---

## ✅ Success Criteria

### All Tests Pass ✅
```
✅ Website displaying articles from Strapi
✅ Console can login and manage content
✅ No API errors (401, 403, 500, etc.)
✅ CORS working correctly
✅ Authentication tokens valid
✅ Data synced between apps
✅ Performance metrics acceptable
```

### Integration Ready for Production 🚀
- All criteria met
- Deployment successful
- APIs functioning correctly
- No critical issues

---

## 📋 Integration Test Report

**Date:** September 20, 2026  
**Tester:** [Your Name]  
**Environment:** Production (Vercel)

### Results Summary
- Website Integration: [ ] ✅ Pass [ ] ⚠️ Partial [ ] ❌ Fail
- Console Integration: [ ] ✅ Pass [ ] ⚠️ Partial [ ] ❌ Fail
- Strapi Backend: [ ] ✅ Pass [ ] ⚠️ Partial [ ] ❌ Fail

### Issues Found
```
[List any issues discovered during testing]
```

### Recommendations
```
[List any improvements or fixes needed]
```

### Sign-Off
- Integration Test Status: [ ] Ready [ ] Needs Work [ ] Blocked
- Ready for Production: [ ] Yes [ ] No

---

## 🔗 Useful Links

- **Website:** https://newskarnataka-website.vercel.app
- **Console:** https://newskarnataka-console.vercel.app
- **Strapi Admin:** http://103.191.208.235:1337/admin
- **GitHub Actions:** https://github.com/rajakumaropus/newskarnataka/actions
- **Vercel Dashboard:** https://vercel.com/rajakumaropus

---

**Next Steps After Completion:**
1. ✅ If all tests pass → Deployment successful, ready for use
2. ⚠️ If partial issues → Fix specific problems, re-test
3. ❌ If critical failures → Check build logs, troubleshoot errors

---

**Deployment Test Complete!**  
**Last Updated:** September 20, 2026  
**Status:** Final Step - Integration Testing

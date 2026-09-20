# Phase 2: Content Migration - EXECUTION START

**Status:** ✅ All infrastructure ready - Ready to execute  
**Objective:** Populate Strapi with data and prepare for WordPress migration

---

## 🎯 CURRENT STATE

### ✅ Completed (Phase 1)
- Website deployed: https://newskarnataka-website.vercel.app
- Console deployed: https://newskarnataka-console.vercel.app
- Strapi running: http://103.191.208.235:1337/admin
- Vercel Git integration working

### ⏳ Ready to Execute (Phase 2)
- Strapi collections schema designed
- Automated setup script created (setup-strapi-collections.js)
- Documentation complete
- Ready to seed data and begin migration

---

## 🚀 EXECUTION: 3 SIMPLE STEPS

### STEP 1: Install Dependencies (1 minute)

Open PowerShell and run:

```powershell
cd d:\Personal\Kiro\newsKarnataka
npm install axios
```

**Expected output:**
```
added 20 packages in 45s
```

---

### STEP 2: Set API Token (1 minute)

In the same PowerShell window, set the environment variable:

```powershell
$env:STRAPI_API_TOKEN = "your-strapi-api-token-here"
```

**Where to get the token:**
1. Go to http://103.191.208.235:1337/admin
2. Settings → API Tokens → Create New API Token
3. Copy the token and paste it above

**If you already have a token**, just use that.

---

### STEP 3: Run Setup Script (5 minutes)

In the same PowerShell window, run:

```powershell
node setup-strapi-collections.js
```

**What happens:**
- Script creates 4 collections (Articles, Categories, Authors, Tags)
- Seeds 10 categories
- Seeds 5 authors
- Seeds 8 tags
- Creates 1 sample article
- Outputs success/error messages

**Expected output:**
```
====================================================================
🚀 STRAPI COLLECTIONS SETUP SCRIPT
====================================================================

Strapi URL: http://103.191.208.235:1337
API Token: vcp_xxxxx...

📐 COLLECTION SCHEMAS:
✅ Categories collection structure: {...}
✅ Authors collection structure: {...}
✅ Tags collection structure: {...}
✅ Articles collection structure: {...}

🌱 SEEDING DATA:
  ✅ Created: Bengaluru
  ✅ Created: Mangaluru
  ✅ Created: Udupi
  ✅ Created: Mysuru
  ✅ Created: Business
  ✅ Created: Technology
  ✅ Created: Entertainment
  ✅ Created: Sports
  ✅ Created: Politics
  ✅ Created: Health
  ✅ Created: News Karnataka Team
  ✅ Created: Bengaluru Correspondent
  ✅ Created: Tech Reporter
  ✅ Created: Business Editor
  ✅ Created: Sports Editor
  ✅ Created: Breaking News
  ✅ Created: Latest
  ✅ Created: Opinion
  ✅ Created: Analysis
  ✅ Created: Interview
  ✅ Created: Event Coverage
  ✅ Created: In-Depth
  ✅ Created: Spotlight
  ✅ Created sample article: "NewsKarnataka Launches New Platform"

====================================================================
✅ SETUP COMPLETE
====================================================================
```

---

## ✅ VERIFICATION (After Setup)

### Check 1: Verify in Strapi Admin (2 minutes)

1. Open http://103.191.208.235:1337/admin
2. Look for these in the left sidebar:
   - **Articles** → Should show 1 entry
   - **Categories** → Should show 10 entries
   - **Authors** → Should show 5 entries
   - **Tags** → Should show 8 entries

If all 4 show with correct counts → ✅ SUCCESS

### Check 2: Verify Website (2 minutes)

1. Open https://newskarnataka-website.vercel.app
2. Should display:
   - Categories visible (in header/sidebar)
   - Sample article in "Latest Articles"
   - All with proper formatting

If article displays → ✅ SUCCESS

### Check 3: Verify Console (2 minutes)

1. Open https://newskarnataka-console.vercel.app
2. Dashboard should show:
   - Total Articles: 1
   - Statistics panel
   - Content manager

If dashboard loads → ✅ SUCCESS

---

## 📋 TROUBLESHOOTING

### Error: "STRAPI_API_TOKEN not found"
**Solution:**
```powershell
$env:STRAPI_API_TOKEN = "your-token"
node setup-strapi-collections.js
```

### Error: "Connection refused"
**Solution:** Verify Strapi is running at http://103.191.208.235:1337

### Error: "Unique constraint violation"
**Reason:** Data already exists (script ran twice)  
**Solution:** This is OK - script handles duplicates gracefully. Continue.

### Collections don't exist
**Reason:** Collections weren't created via API  
**Solution:** Create manually in Strapi Admin, then run script again to seed data

### Still getting errors?
Check PHASE_2_SETUP_INSTRUCTIONS.md for detailed troubleshooting

---

## 🎯 AFTER SETUP SUCCESS

### Option 1: Create More Articles Manually (30 minutes)

1. Go to Console: https://newskarnataka-console.vercel.app
2. Create Articles → New Entry
3. Fill in:
   - Title (catchy headline)
   - Content (at least 200 words)
   - Category
   - Author
   - Publish
4. Repeat 5-10 times for good variety

### Option 2: Build WordPress Scraper (2-3 hours)

We'll build an automated scraper to migrate all WordPress articles at once. More efficient for large migrations.

### Option 3: Hybrid Approach (Recommended)

1. Create 5-10 articles manually now
2. Build scraper for full WordPress migration later
3. Enhance UI/UX simultaneously

---

## 📊 NEXT PHASE DECISIONS

**Choose your path:**

### Path A: Quick Start
- Manual content creation
- Timeline: 1-2 days
- Final content: 10-15 articles
- Good for: Testing and validation

### Path B: Complete Migration
- Build WordPress scraper
- Timeline: 1 week
- Final content: 200+ articles
- Good for: Full platform replacement

**Recommendation:** Path A now, Path B next week

---

## 📝 SUMMARY

**Total Time:**
- Install dependencies: 1 min
- Set API token: 1 min
- Run script: 5 min
- Verification: 5 min
- **Total: ~12 minutes**

**What You Get:**
- ✅ 4 Strapi collections
- ✅ 10 categories
- ✅ 5 authors
- ✅ 8 tags
- ✅ 1 sample article
- ✅ Working website + console integration

**Next:**
- Create more articles
- Or build scraper for full migration

---

## 🚀 READY?

### Execute Now:

```powershell
cd d:\Personal\Kiro\newsKarnataka
npm install axios
$env:STRAPI_API_TOKEN = "your-token"
node setup-strapi-collections.js
```

### Then Verify:
1. Strapi Admin: http://103.191.208.235:1337/admin
2. Website: https://newskarnataka-website.vercel.app
3. Console: https://newskarnataka-console.vercel.app

### When Done:
Reply with what you see or any errors, and we'll proceed to next steps!

---

**Let's go! Execute the 3 steps above and come back with results.** ✅

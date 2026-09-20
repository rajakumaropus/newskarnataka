# Phase 2: Setup Instructions - Content Migration

**Goal:** Create Strapi collections and seed initial data for content migration  
**Status:** Ready to Execute

---

## 🎯 Quick Start

### Option 1: Automated Setup (Recommended)
Run the setup script to create collections and seed data automatically:

```bash
# Install dependencies
npm install axios

# Set environment variables
$env:STRAPI_URL = "http://103.191.208.235:1337"
$env:STRAPI_API_TOKEN = "your-api-token-here"

# Run the setup script
node setup-strapi-collections.js
```

### Option 2: Manual Setup
Follow the detailed instructions in `STEP_1_CREATE_STRAPI_COLLECTIONS.md`

---

## 📋 What Gets Created

### Collections
- ✅ **Articles** (18 fields)
- ✅ **Categories** (6 fields)  
- ✅ **Authors** (6 fields)
- ✅ **Tags** (3 fields)

### Sample Data
- ✅ **10 Categories** (Bengaluru, Mangaluru, Udupi, Mysuru, Business, Tech, Entertainment, Sports, Politics, Health)
- ✅ **5 Authors** (News Team, Bengaluru Correspondent, Tech Reporter, Business Editor, Sports Editor)
- ✅ **8 Tags** (Breaking News, Latest, Opinion, Analysis, Interview, Event Coverage, In-Depth, Spotlight)
- ✅ **1 Sample Article** (Welcome article with all relations)

---

## 🚀 Execution Steps

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Set Environment Variables

**Windows PowerShell:**
```powershell
$env:STRAPI_URL = "http://103.191.208.235:1337"
$env:STRAPI_API_TOKEN = "vcp_xxxxx..." # Your API token
```

**Or create .env file:**
```
STRAPI_URL=http://103.191.208.235:1337
STRAPI_API_TOKEN=your-token-here
```

### 3. Run Setup Script
```bash
node setup-strapi-collections.js
```

### 4. Monitor Output
Script will show:
- ✅ Collections created (schemas)
- ✅ Categories seeded (10 items)
- ✅ Authors seeded (5 items)
- ✅ Tags seeded (8 items)
- ✅ Sample article created

---

## ✅ Verification

### Via Strapi Admin Console
1. Go to: http://103.191.208.235:1337/admin
2. Check Collections in sidebar:
   - Articles (1 item)
   - Categories (10 items)
   - Authors (5 items)
   - Tags (8 items)

### Via API
```bash
# Get articles count
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://103.191.208.235:1337/api/articles?pagination[limit]=1

# Get categories
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://103.191.208.235:1337/api/categories

# Get authors
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://103.191.208.235:1337/api/authors
```

### Via Website
1. Go to: https://newskarnataka-website.vercel.app
2. Should show categories and latest article

### Via Console
1. Go to: https://newskarnataka-console.vercel.app
2. Should show dashboard with article count

---

## 🔧 Troubleshooting

### Error: "STRAPI_API_TOKEN not found"
**Solution:** Set the environment variable
```powershell
$env:STRAPI_API_TOKEN = "your-token"
```

### Error: "Unique constraint violation"
**Reason:** Data already exists  
**Solution:** This is normal if running script twice. Script handles it gracefully.

### Error: "Connection refused"
**Reason:** Strapi not running  
**Solution:** Check Strapi is running at http://103.191.208.235:1337

### Collections don't exist
**Reason:** Script only seeds data, doesn't create collections via API  
**Solution:** Create collections manually in Strapi Admin, then run script

---

## 📊 Expected Output

```
====================================================================
🚀 STRAPI COLLECTIONS SETUP SCRIPT
====================================================================

Strapi URL: http://103.191.208.235:1337
API Token: vcp_xxxxx...

📐 COLLECTION SCHEMAS:
✅ Categories collection structure:
{...schema...}

✅ Authors collection structure:
{...schema...}

✅ Tags collection structure:
{...schema...}

✅ Articles collection structure:
{...schema...}

🌱 SEEDING DATA:
  ✅ Created: Bengaluru
  ✅ Created: Mangaluru
  ...
  ✅ Created: News Karnataka Team
  ...
  ✅ Created: Breaking News
  ...
  ✅ Created sample article: "NewsKarnataka Launches New Platform"

====================================================================
✅ SETUP COMPLETE
====================================================================

📋 Next Steps:
1. If collections weren't created automatically:
   - Go to Strapi Admin UI: http://103.191.208.235:1337/admin
   - Create collections manually using the schemas above
   - Then run this script again to seed data

2. If collections exist:
   - Sample data has been seeded
   - Visit Console: https://newskarnataka-console.vercel.app
   - View articles and content

3. Next:
   - Create more sample articles
   - Build data scraper for WordPress migration
   - Enhance UI/UX
```

---

## ⏱️ Time Estimate
- Installing dependencies: 1 min
- Setting environment variables: 1 min
- Running setup script: 1-2 min
- **Total: ~5 minutes**

---

## 📝 After Setup

### Create More Articles
1. Log into Strapi Console: https://newskarnataka-console.vercel.app
2. Create articles manually with rich content
3. Link to categories, authors, tags
4. Publish and view on website

### Next Phase
- Build WordPress scraper (automated migration)
- Enhance UI/UX with better components
- Add advanced features (search, analytics, etc.)

---

## 🎯 Success Criteria

- [ ] Collections exist in Strapi
- [ ] 10 categories seeded
- [ ] 5 authors seeded
- [ ] 8 tags seeded
- [ ] 1 sample article created
- [ ] Website displays categories
- [ ] Console shows article count
- [ ] All relations working

---

**Ready? Run the setup script now!** 🚀

```bash
node setup-strapi-collections.js
```

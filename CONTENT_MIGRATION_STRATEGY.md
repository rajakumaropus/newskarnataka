# Content Migration & Data Seeding Strategy

**Objective:** Migrate from WordPress to Strapi with enhanced functionality and UI/UX  
**Status:** Ready for Implementation  
**Target:** Surpass current WordPress capabilities

---

## 📋 MIGRATION PLAN

### Phase 1: Data Scraping & Collection
### Phase 2: Strapi Data Structure Setup
### Phase 3: Article Population
### Phase 4: UI/UX Enhancement
### Phase 5: Performance & SEO Optimization

---

## 🔍 CURRENT WORDPRESS STRUCTURE

From https://newskarnataka.com/:

**Identified Elements:**
- Site: News Karnataka
- Copyright: © 2012 - 2025 Spearhead Media Pvt Ltd
- Categories: Bengaluru, Mangaluru, Udupi, Mysuru, Recent News, Daily Highlights
- Framework: WordPress

**Content Types to Migrate:**
1. Articles/Posts
2. Categories
3. Authors
4. Tags
5. Featured Images
6. Article Descriptions
7. Publish Dates
8. Read Time

---

## 🛠️ TECHNICAL APPROACH

### Option A: Automated Web Scraping
- Use Node.js + Puppeteer/Cheerio
- Scrape live articles from WordPress
- Transform to Strapi format
- Bulk upload via Strapi API

### Option B: WordPress API Integration
- Use WordPress REST API (if available)
- Extract structured data
- Map to Strapi collections
- Automated migration script

### Option C: Manual Bulk Import
- CSV/JSON export from WordPress
- Transform data format
- Import via Strapi Admin UI
- Verify data integrity

### Option D: Hybrid Approach (Recommended)
- Initial bulk import of existing articles
- Scheduled scraping for new articles
- API integration for real-time sync
- Manual curation for quality

---

## 📊 STRAPI DATA COLLECTIONS TO CREATE

### 1. Articles Collection
```
Fields:
- title (String, required)
- slug (String, unique, auto-generated)
- description (Text, rich editor)
- content (RichText/Markdown)
- featured_image (Media)
- category (Relation → Categories)
- author (Relation → Authors)
- tags (Relation → Tags)
- excerpt (String, 160 chars for SEO)
- meta_description (String)
- keywords (String)
- read_time (Number, calculated)
- published_date (DateTime)
- updated_date (DateTime)
- is_featured (Boolean)
- is_breaking_news (Boolean)
- views_count (Number)
- status (Enum: draft, published, archived)
```

### 2. Categories Collection
```
Fields:
- name (String, required)
- slug (String, unique)
- description (Text)
- icon (Media)
- color (String, hex)
- articles (Relation → Articles)
```

### 3. Authors Collection
```
Fields:
- name (String, required)
- email (String)
- bio (Text)
- avatar (Media)
- social_links (JSON)
- articles (Relation → Articles)
```

### 4. Tags Collection
```
Fields:
- name (String, required)
- slug (String, unique)
- articles (Relation → Articles)
```

### 5. Media Collection
```
Fields:
- title (String)
- image (Media)
- caption (String)
- alt_text (String)
- source (String)
```

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Create Strapi Collections
1. Access Strapi Admin: http://103.191.208.235:1337/admin
2. Create each collection above
3. Set permissions (public read, admin write)
4. Save collection structures

### Step 2: Seed Initial Data
Create sample articles manually:
- 5-10 featured articles
- Multiple categories
- Various authors
- Rich content with images

### Step 3: Create Data Scraping Script
Build Node.js script to:
- Fetch articles from WordPress
- Extract and clean data
- Transform to Strapi format
- Bulk import via API

### Step 4: Populate Live Data
- Run scraper against WordPress site
- Verify data integrity
- Handle duplicates
- Store in Strapi

### Step 5: UI/UX Enhancements
Improve beyond WordPress:
- **Website:**
  - Better article cards
  - Advanced search/filtering
  - Reading time estimates
  - Social sharing
  - Related articles
  - Comments/Discussion
  
- **Console:**
  - Content calendar
  - Analytics dashboard
  - SEO preview
  - Article scheduling
  - Team collaboration
  - Content templates

---

## 📐 DATA SCRAPING SCRIPT TEMPLATE

```javascript
// newskarnataka-scraper.js

const axios = require('axios');
const cheerio = require('cheerio');
const strapiAPI = 'http://103.191.208.235:1337/api';
const strapiToken = process.env.STRAPI_API_TOKEN;

// 1. Fetch articles from WordPress
async function scrapeWordPress() {
  const response = await axios.get('https://newskarnataka.com/');
  const $ = cheerio.load(response.data);
  
  const articles = [];
  $('.article, .post').each((i, elem) => {
    articles.push({
      title: $(elem).find('.title').text(),
      description: $(elem).find('.excerpt').text(),
      category: $(elem).find('.category').text(),
      published_date: $(elem).find('.date').text(),
      image_url: $(elem).find('img').attr('src'),
      // ... other fields
    });
  });
  
  return articles;
}

// 2. Transform data to Strapi format
function transformToStrapi(wpArticle) {
  return {
    data: {
      title: wpArticle.title,
      description: wpArticle.description,
      content: wpArticle.content,
      published_date: new Date(wpArticle.published_date),
      // ... map other fields
    }
  };
}

// 3. Upload to Strapi
async function uploadToStrapi(article) {
  try {
    await axios.post(
      `${strapiAPI}/articles`,
      article,
      {
        headers: {
          Authorization: `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`✅ Uploaded: ${article.data.title}`);
  } catch (error) {
    console.error(`❌ Error uploading: ${error.message}`);
  }
}

// 4. Main migration
async function migrateArticles() {
  console.log('🔄 Starting migration...');
  
  const articles = await scrapeWordPress();
  console.log(`📦 Found ${articles.length} articles`);
  
  for (const article of articles) {
    const strapiArticle = transformToStrapi(article);
    await uploadToStrapi(strapiArticle);
  }
  
  console.log('✅ Migration complete!');
}

// Run it
migrateArticles().catch(console.error);
```

---

## 🎨 UI/UX IMPROVEMENTS ROADMAP

### Website Enhancements
- **Better Article Cards:**
  - Large featured image
  - Category badge with color
  - Author info with avatar
  - Reading time
  - Publication date (relative time: "2 hours ago")
  - Quick preview/tooltip

- **Advanced Filtering:**
  - Filter by category
  - Filter by date range
  - Filter by author
  - Search with autocomplete
  - Trending tags cloud

- **Article Page:**
  - Table of contents (auto-generated)
  - Related articles widget
  - Author bio sidebar
  - Share buttons (Twitter, Facebook, WhatsApp)
  - Newsletter signup
  - Comments section

- **Navigation:**
  - Sticky header with search
  - Mobile-friendly nav drawer
  - Category dropdown
  - Breadcrumbs
  - Back to top button

### Console Enhancements
- **Dashboard:**
  - Article stats (total, published, drafts)
  - View count analytics
  - Recent activity timeline
  - Content performance metrics

- **Content Editor:**
  - Rich text editor (Markdown)
  - SEO preview (title, description, slug)
  - Feature image with crop tool
  - Category multi-select
  - Tag autocomplete
  - Reading time preview

- **Bulk Operations:**
  - Bulk publish/unpublish
  - Bulk category assignment
  - Bulk tag addition
  - Batch scheduling

- **Analytics:**
  - Article performance charts
  - Most viewed articles
  - Reader engagement metrics
  - Traffic by category

---

## 📈 QUALITY METRICS

After migration, track:
- Article count: Target 100+
- Categories populated: All regions
- Authors: At least 5
- Images attached: 80%+ of articles
- Average read time: 3-5 minutes
- SEO metadata: 100% coverage

---

## ⏱️ TIMELINE

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Strapi collections setup | 1 hour |
| 2 | Seed sample data (5-10 articles) | 1 hour |
| 3 | Build scraper script | 2-3 hours |
| 4 | Test & debug scraper | 1 hour |
| 5 | Run full migration | 1-2 hours |
| 6 | Verify data integrity | 1 hour |
| 7 | UI/UX enhancements | 4-8 hours |

**Total: ~12-16 hours**

---

## 🔐 DATA INTEGRITY CHECKLIST

- [ ] No duplicate articles
- [ ] All required fields populated
- [ ] Images accessible and cached
- [ ] Categories properly linked
- [ ] Authors properly linked
- [ ] Dates correctly formatted
- [ ] SEO metadata complete
- [ ] Character limits respected
- [ ] HTML properly escaped
- [ ] Links functional

---

## 🎯 SUCCESS CRITERIA

✅ All WordPress articles migrated  
✅ Data integrity verified  
✅ Images properly attached  
✅ Categories organized  
✅ Authors assigned  
✅ Website displays articles  
✅ Console shows analytics  
✅ UI surpasses WordPress design  
✅ Performance optimized  
✅ SEO ready  

---

## 📋 NEXT STEPS

1. **Review this strategy**
2. **Choose implementation approach** (Automated vs Manual)
3. **Create Strapi collections** (Step 1)
4. **Seed sample data** (Step 2)
5. **Build/run scraper** (Step 3-5)
6. **Enhance UI/UX** (Step 7)
7. **Go live with migration**

---

**Ready to execute? Let's start with Step 1: Creating Strapi Collections!**

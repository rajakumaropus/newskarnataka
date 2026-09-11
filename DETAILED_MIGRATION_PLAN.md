# Detailed Migration Plan
## WordPress to Strapi Content Migration Strategy

**Project:** NewsKarnataka.com - Complete Migration  
**Source:** WordPress (55K-80K articles)  
**Destination:** Strapi 5.x  
**Timeline:** 10 weeks  
**Data Volume:** 55K+ articles, 100K+ images, metadata, SEO fields

---

## EXECUTIVE SUMMARY

This document provides the **operational playbook** for migrating all content from WordPress to Strapi with:
- Phased approach (extract → transform → load → validate)
- Dual-write architecture (parallel operation)
- Zero data loss strategy
- Rollback capabilities at each stage
- Detailed day-by-day procedures

---

## SECTION 1: PRE-MIGRATION PLANNING

### 1.1 Migration Objectives

**Primary Objectives:**
- ✅ Migrate 100% of WordPress articles (55K-80K)
- ✅ Migrate all metadata (categories, tags, authors, SEO)
- ✅ Migrate all images (100K+, with optimization)
- ✅ Zero downtime during migration
- ✅ Maintain content integrity & searchability
- ✅ Improve performance (2-3x faster)
- ✅ Enable AI-powered content management

**Success Criteria:**
- All articles accessible post-migration
- No broken links (301 redirects functional)
- SEO ranking maintained or improved
- Search performance < 100ms
- Page load time < 2.5s (LCP)
- 99.9% uptime during migration

### 1.2 Data Inventory

**Source System (WordPress):**
```
Articles:           55,000-80,000 (estimated)
Categories:         20-30
Tags:               500-1,000
Authors:            20-40
Comments:           50,000-500,000 (optional migration)
Featured Images:    55,000 (1 per article)
Inline Images:      50,000-100,000
Database Size:      ~200-300 GB
Age:                13 years (since 2012)
```

**Target System (Strapi):**
```
Collection Types:   Article, Category, Tag, Author
Attributes:
  ├─ Article
  │  ├─ title (string, required)
  │  ├─ slug (string, unique)
  │  ├─ content (rich text)
  │  ├─ excerpt (string, 300 chars)
  │  ├─ featured_image (media, single)
  │  ├─ category (relation)
  │  ├─ tags (relation, multiple)
  │  ├─ author (relation)
  │  ├─ language (enum: kannada, english, tulu)
  │  ├─ status (enum: draft, published, archived)
  │  ├─ published_at (datetime)
  │  ├─ seo_title (string, 60 chars)
  │  ├─ seo_description (string, 160 chars)
  │  ├─ og_image (media)
  │  ├─ view_count (integer)
  │  └─ ai_status (component)
  │
  ├─ Category
  │  ├─ name (string, required)
  │  ├─ slug (string, unique)
  │  ├─ description (string)
  │  └─ articles (relation, reverse)
  │
  ├─ Tag
  │  ├─ name (string, required)
  │  ├─ slug (string, unique)
  │  └─ articles (relation, reverse)
  │
  └─ Author
     ├─ name (string, required)
     ├─ email (string, unique)
     ├─ bio (string)
     ├─ photo (media)
     └─ articles (relation, reverse)
```

### 1.3 Migration Architecture

```
WordPress Database (MySQL)
            │
            ├─── REST API (/wp-json/)
            ├─── Direct DB Connection (read-only)
            └─── Export Dumps (if API fails)
                        │
                        ▼
            Migration Adapter Service
            (Node.js + BullMQ)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    Extractor       Transformer      Loader
    ├─ Extract     ├─ HTML→MD        ├─ Validate
    │  from WP     ├─ Resize IMG     ├─ Create in Strapi
    ├─ Batch       ├─ URL rewrite    ├─ Batch process
    │  (1000/req)  ├─ Multi-lang     └─ Error handling
    └─ Store raw   │  detect
       in S3       ├─ SEO parse
                   └─ Checksum
                        │
                        ▼
                Strapi PostgreSQL
                ├─ Articles (55K+)
                ├─ Categories
                ├─ Tags
                ├─ Authors
                └─ Media assets (linked)
                        │
                        ▼
                Elasticsearch Indexing
                (Real-time sync)
                        │
                        ▼
                S3 + CloudFront CDN
                (Images & static assets)
```

---

## SECTION 2: PHASE 1 - DATA EXTRACTION (WEEK 1)

### 2.1 Pre-Extraction Checklist

**Week 0 - End of Day**

- [ ] WordPress backup created & verified (S3 cross-region)
- [ ] WordPress REST API tested & responding (healthy)
- [ ] WordPress database read-only replica created (failover)
- [ ] Strapi staging environment deployed & healthy
- [ ] PostgreSQL staging database empty & ready
- [ ] S3 buckets created (raw-data, processed-data, backups)
- [ ] Migration service code reviewed & tested
- [ ] BullMQ workers tested (job processing)
- [ ] Extraction scripts tested on small subset (100 posts)
- [ ] Team trained & ready (extraction procedures)
- [ ] Logging configured (all operations logged)

### 2.2 Extraction Process (Days 1-3)

**Step 1: Article Extraction (1000 at a time)**

```
Process:
├─ Fetch from WordPress REST API: /wp-json/wp/v2/posts
├─ Pagination: ?page=1&per_page=1000
├─ For each post:
│  ├─ Extract post ID, title, content, excerpt
│  ├─ Extract publish_date, modified_date, author
│  ├─ Extract featured_image_id (media ID)
│  ├─ Extract categories & tags (taxonomy)
│  ├─ Extract postmeta (Yoast SEO, custom fields)
│  ├─ Extract comments (count, if enabled)
│  └─ Store in PostgreSQL staging: extract_batch table
├─ Repeat for all batches (55 batches × 1000)
└─ Store raw JSON in S3

Batches:
├─ Batch 1: Posts 1-1000 (Day 1, 8am)
├─ Batch 2: Posts 1001-2000 (Day 1, 12pm)
├─ Batch 3: Posts 2001-3000 (Day 1, 4pm)
├─ ...
└─ Batch 55: Posts 54001-55000 (Day 3, 4pm)

Timeline:
├─ Est. 200 posts/hour (API limited)
├─ 55K posts ÷ 200/hour = 275 hours
├─ Running 24/7 for ~11 days
├─ BUT with 4 parallel workers = 2.75 days ✓
└─ Day 1-3: 100% completion

Monitoring:
├─ Queue depth (should decrease over time)
├─ Error rate (< 1% acceptable)
├─ Failed posts logged & retried
├─ Hourly progress report
└─ Alert if > 100 consecutive failures
```

**Step 2: Category & Tag Extraction**

```
Process:
├─ Fetch categories: /wp-json/wp/v2/categories
├─ Store in PostgreSQL: categories table
├─ Fetch tags: /wp-json/wp/v2/tags
├─ Store in PostgreSQL: tags table
└─ Map relationships (article_category, article_tag)

Data Extracted:
├─ Categories: ~25 items (2 min)
├─ Tags: ~800 items (5 min)
└─ Total time: 10 minutes (sequential)
```

**Step 3: Author Extraction**

```
Process:
├─ Fetch users: /wp-json/wp/v2/users
├─ Extract: ID, name, email, bio, avatar
├─ Store in PostgreSQL: authors table
├─ Create mapping: WordPress user_id → Strapi author_id

Data:
├─ Authors: ~30 items
└─ Time: 5 minutes
```

**Step 4: Featured Images Download**

```
Process:
├─ Extract image URLs from WordPress
├─ Download each image to /tmp/images/
├─ Rename to consistent naming (article_id.jpg)
├─ Create image manifest (URL → local path)
├─ Verify download (file size > 0)
├─ Checksum validation (MD5 hash)
└─ Store in S3 backup

Data:
├─ Featured images: 55,000
├─ Estimated size: 50-100 GB (avg 1-2 MB per image)
├─ Download speed: ~100 images/sec (network permitting)
├─ Time estimate: 55000 ÷ 100 = 550 seconds = 9 minutes
└─ BUT: WordPress may limit bandwidth
   ├─ Realistic: 20 images/sec
   ├─ Time: 55000 ÷ 20 = 2750 seconds = ~46 minutes
   └─ Running overnight: 12-24 hours for 100K+ images

Backup:
├─ Store all images in S3 (backup bucket)
├─ Retain raw images (pre-optimization)
└─ Enable versioning (can restore if needed)
```

### 2.3 Extraction Validation

**Day 4: Validation & Sign-Off**

```
Validation Checks:
├─ Article count
│  ├─ Source (WordPress): 55,000
│  ├─ Extracted (PostgreSQL): ?
│  └─ Match? ✅ Must be 100%
│
├─ Featured images
│  ├─ Source (WordPress links): 55,000
│  ├─ Downloaded: ?
│  └─ Match? ✅ Must be 100%
│
├─ Categories
│  ├─ Source: ~25
│  ├─ Extracted: ?
│  └─ Match? ✅
│
├─ Tags
│  ├─ Source: ~800
│  ├─ Extracted: ?
│  └─ Match? ✅
│
├─ Authors
│  ├─ Source: ~30
│  ├─ Extracted: ?
│  └─ Match? ✅
│
└─ Spot-checks (random 50 articles)
   ├─ Content present? ✅
   ├─ Images downloadable? ✅
   ├─ Metadata correct? ✅
   └─ No corruption? ✅

Sign-Off:
├─ Data Migration Lead: ✅ Extraction complete
├─ QA Lead: ✅ Validation passed
└─ Tech Lead: ✅ Ready for Phase 2
```

---

## SECTION 3: PHASE 2 - DATA TRANSFORMATION (WEEKS 2-3)

### 3.1 Transformation Pipeline

**Overview:**
```
Raw Data (JSON) → Transform → Strapi Format

Transformation Steps:
1. HTML → Markdown conversion
2. Image resize & optimize
3. URL rewriting
4. Multi-language detection
5. SEO metadata extraction
6. Data validation & checksum
```

### 3.2 HTML to Markdown Conversion

**Task: Convert 55K articles from HTML/Gutenberg → Markdown**

```
Challenge:
├─ WordPress uses Gutenberg block editor
├─ Generates structured JSON blocks
├─ Each block type needs specific handling
└─ Cannot simply strip HTML

Solution:
├─ Use turndown.js library (HTML → Markdown)
├─ Custom handlers for WordPress blocks:
│  ├─ Image block → ![alt](url)
│  ├─ Heading block → # Heading text
│  ├─ Paragraph → Plain text
│  ├─ List block → - Item 1
│  ├─ Quote block → > Quote text
│  ├─ Embed block → [Embed](url)
│  ├─ Code block → ```code```
│  └─ Table block → Markdown table
└─ Store converted content in S3

Process:
├─ Batch 1: Articles 1-5000 (turndown processing)
├─ Batch 2: Articles 5001-10000
├─ ...
├─ Batch 11: Articles 50001-55000
└─ Parallel processing (4 workers)
   ├─ Time: 55K articles ÷ 4 workers = 13.75K per worker
   ├─ Speed: ~1000 per hour per worker
   ├─ Total time: ~14 hours ÷ 4 = 3.5 hours
   └─ Running 24/7: Overnight completion ✓

Validation:
├─ Sample 100 random articles
├─ Manual review (content readability)
├─ Spot-check formatting (bullets, quotes, etc.)
├─ Verify length (article not truncated)
└─ Checksum: Article length within 10% of original
```

### 3.3 Image Optimization & Resizing

**Task: Optimize 100K+ images for web**

```
Challenge:
├─ 100K+ images, varying sizes & formats
├─ Original size: 50-100 GB total
├─ Need to resize & optimize for web
├─ Create multiple versions (thumb, medium, large)
└─ Target: < 80 MB total (optimized)

Solution: ImageMagick batch processing

For each featured image:
├─ Original: Keep in S3 (backup)
├─ Resize & create 3 versions:
│  ├─ Thumbnail (400×300, WebP, 30-50 KB)
│  ├─ Medium (800×600, WebP, 50-80 KB)
│  └─ Large (1200×630, WebP, 80-150 KB)
└─ Total per image: ~200 KB (3 versions)
   ├─ 55K × 200 KB = ~11 GB total (optimized)
   └─ 50-60% reduction from original ✓

Commands:
```bash
# Resize to large (1200x630)
convert article_featured_image.jpg \
  -resize 1200x630 \
  -quality 85 \
  -strip \
  article_featured_large.webp

# Resize to medium (800x600)
convert article_featured_image.jpg \
  -resize 800x600 \
  -quality 80 \
  -strip \
  article_featured_medium.webp

# Resize to thumbnail (400x300)
convert article_featured_image.jpg \
  -resize 400x300 \
  -quality 75 \
  -strip \
  article_featured_thumb.webp
```

Processing:
├─ BullMQ worker pool (8 workers)
├─ Process 1000 images per worker
├─ Time per image: ~2 seconds
├─ Total time: 55K × 2sec = 110K sec = 30 hours
├─ Parallel (8 workers): 30 hours ÷ 8 = 3.75 hours
└─ Running overnight: Complete by morning ✓

Inline Images:
├─ Optional: Optimize inline article images
├─ Time-consuming (50K+ images)
├─ Alternative: Keep originals, optimize on-the-fly (Cloudinary, ImageOptim)
├─ Recommended: Skip for MVP, optimize later
└─ Decision: Only featured images for MVP
```

### 3.4 URL Rewriting

**Task: Update all image URLs in article content**

```
Problem:
├─ Original URLs: https://newskarnataka.com/wp-content/uploads/2023/01/image.jpg
├─ New URLs: https://cdn.newskarnataka.com/articles/article-id/image.webp
├─ 100K+ links to update across 55K articles
└─ Broken links = SEO penalty, user frustration

Solution:

1. Create URL mapping table:
```
URL_Mapping
├─ old_url: https://newskarnataka.com/wp-content/uploads/2023/01/image.jpg
├─ new_url: https://cdn.newskarnataka.com/articles/12345/image.webp
└─ article_id: 12345
```

2. For each article:
```
OLD: <img src="https://newskarnataka.com/wp-content/uploads/2023/01/image.jpg" />
NEW: ![Image](https://cdn.newskarnataka.com/articles/12345/image.webp)
```

3. Regex replacement:
```javascript
// Find all WordPress URLs
const wordpressUrls = /https:\/\/newskarnataka\.com\/wp-content\/uploads\/(.+?)\.(jpg|png|gif|webp)/g;

// Replace with CDN URLs
content = content.replace(wordpressUrls, (match, filename) => {
  return `https://cdn.newskarnataka.com/articles/${articleId}/${filename}.webp`;
});
```

Validation:
├─ Test on 100 sample articles
├─ Verify all links rewritten
├─ Check for broken links (404 errors)
└─ Spot-check CDN URLs responding (200 OK)
```

### 3.5 Multi-Language Detection

**Task: Detect language for each article & tag**

```
Challenge:
├─ Articles in Kannada, English, Tulu mix
├─ Need to categorize for i18n
├─ Determine from content language, not category
└─ Important for search, UI language

Solution:

Library: TextBlob or langdetect (Python)

Process:
├─ Extract first 500 characters of article
├─ Run language detection
├─ Result: { language_code, confidence_score }
├─ If confidence > 0.9: Use detected language
├─ If confidence 0.5-0.9: Manual review (flag)
├─ If confidence < 0.5: Mark as mixed/unclear
└─ Store in article.language field

Languages to Detect:
├─ kn (Kannada) - target ~45%
├─ en (English) - target ~45%
├─ tu (Tulu) - target ~10%
└─ Others (mixed, unclear) - flag for review

Validation:
├─ Manual review of 100 random
├─ Verify accuracy > 95%
├─ Spot-check Kannada detection (important!)
└─ Document any edge cases
```

### 3.6 SEO Metadata Extraction

**Task: Extract Yoast/Rank Math SEO data**

```
Data to Extract:
├─ Meta title (60 chars max)
├─ Meta description (160 chars max)
├─ Focus keywords
├─ Readability score
├─ SEO score
├─ Open Graph image
├─ Open Graph title
├─ Open Graph description
├─ Twitter Card data
└─ Canonical URL

Source:
├─ WordPress postmeta table (Yoast fields)
├─ Meta prefix: _yoast_wpseo_
├─ Fields: title, metadesc, focuskw, etc.

Process:
├─ Query postmeta for each article
├─ Extract SEO fields
├─ Map to Strapi SEO component
├─ Store in article.seo_title, article.seo_description
└─ Validate: Present & non-empty for all

Validation:
├─ Title < 60 chars? ✓
├─ Description < 160 chars? ✓
├─ No HTML in SEO fields? ✓
└─ Spot-check 50 articles
```

### 3.7 Data Validation & Checksum

**Week 3 - Day 1-2: Complete Validation**

```
Validation Checks:

1. Count Verification:
   ├─ Articles transformed: 55,000
   ├─ Articles in staging DB: 55,000
   └─ Match? ✅ 100%

2. Field-Level Checks:
   ├─ title: not null, < 500 chars
   ├─ slug: unique, no duplicates
   ├─ content: not null, Markdown format
   ├─ excerpt: < 300 chars or null
   ├─ featured_image: URL valid or null
   ├─ category: not null (1 primary)
   ├─ language: kn, en, or tu
   ├─ seo_title: < 60 chars or null
   ├─ seo_description: < 160 chars or null
   └─ published_at: valid datetime

3. Spot-Checks (Random 100):
   ├─ Content readable (Markdown)
   ├─ Images rewritten (CDN URLs)
   ├─ No HTML entities (&amp; → &)
   ├─ Kannada chars not corrupted
   ├─ Links functional
   └─ Metadata complete

4. Checksum Validation:
   ├─ Article length (within 10% of original)
   ├─ Image count per article (should match)
   ├─ Category mappings correct
   ├─ Tag mappings correct
   └─ Author mappings correct

5. Data Quality Metrics:
   ├─ % articles with featured image: > 90%
   ├─ % articles with SEO title: > 80%
   ├─ % articles with description: > 80%
   ├─ Avg article length: 1000-5000 words
   └─ % Kannada articles: 40-50%

Sign-Off:
├─ All validations PASS
├─ No critical issues
├─ Ready for Phase 3 (data loading)
└─ QA Lead approves
```

---

## SECTION 4: PHASE 3 - DATA LOADING (WEEK 4)

### 4.1 Strapi Bulk Import

**Week 4 - Days 1-3: Load into Staging Strapi**

```
Step 1: Import Categories & Tags
├─ Create API endpoint: POST /api/import/categories
├─ Batch: Load 30 categories (1 request, ~1 sec)
├─ Create API endpoint: POST /api/import/tags
├─ Batch: Load 800 tags (parallel requests)
├─ Verification:
│  ├─ All categories visible in Strapi admin
│  ├─ All tags visible
│  ├─ Slug uniqueness verified
│  └─ Count matches source
└─ Time: < 5 minutes

Step 2: Import Authors
├─ Create API endpoint: POST /api/import/authors
├─ Batch: Load 30 authors (1 request)
├─ Map WordPress user_id → Strapi author_id
├─ Verification:
│  ├─ All authors in Strapi
│  ├─ Email unique
│  └─ Photo/bio fields populated
└─ Time: < 2 minutes

Step 3: Import Featured Images
├─ Create API endpoint: POST /api/import/media
├─ Upload 55K images to Strapi media library:
│  ├─ Batch 1: Images 1-5000
│  ├─ Batch 2: Images 5001-10000
│  ├─ ...
│  └─ Parallel: 4 workers
├─ Strapi stores in S3 (configured)
├─ Each image gets Strapi ID (for linking)
├─ Time: 2-4 hours (parallel upload)
└─ Verification: All images in Strapi, accessible

Step 4: Import Articles (Main Data Load)
├─ Create API endpoint: POST /api/import/articles
├─ For each article:
│  ├─ Extract from staging DB
│  ├─ Prepare payload (title, content, etc.)
│  ├─ Call Strapi API (create Article)
│  ├─ Link featured image (media relation)
│  ├─ Link category (taxonomy relation)
│  ├─ Link tags (taxonomy relation)
│  ├─ Link author (user relation)
│  ├─ Set language & status
│  └─ Set SEO metadata
├─ Batch processing (1000 at a time):
│  ├─ Batch 1: Articles 1-1000
│  ├─ Batch 2: Articles 1001-2000
│  ├─ ...
│  ├─ Batch 55: Articles 54001-55000
│  └─ Parallel: 4 workers (25 batches each)
├─ Time estimate:
│  ├─ Speed: ~20 articles/sec per worker
│  ├─ 55K ÷ (4 workers × 20/sec) = ~344 seconds
│  ├─ ~6 minutes per 1000 articles
│  ├─ Total: 55 × 6 min = 330 minutes = 5.5 hours
│  └─ Running 24/7: Overnight completion ✓
└─ Error handling:
   ├─ Failed articles logged
   ├─ Retry logic (exponential backoff)
   ├─ Report failures (investigate later)
   └─ Continue even if some fail

Strapi API Example:
```javascript
POST /api/articles
{
  "data": {
    "title": "Article Title",
    "slug": "article-slug",
    "content": "# Markdown content...",
    "excerpt": "Brief summary",
    "featured_image": 12345,  // Strapi media ID
    "category": 5,            // Strapi category ID
    "tags": [10, 20, 30],     // Strapi tag IDs
    "author": 3,              // Strapi author ID
    "language": "kn",
    "status": "published",
    "seo_title": "SEO Title",
    "seo_description": "Meta description",
    "published_at": "2023-01-15T10:00:00Z"
  }
}
```

Monitoring:
├─ Track queue depth (should decrease over time)
├─ Alert if errors > 1%
├─ Log all failed records (for retry)
├─ Hourly progress report
└─ Stop & investigate if > 5% error rate
```

### 4.2 Elasticsearch Indexing

**Week 4 - Day 2-3: Index Articles in Elasticsearch**

```
Step 1: Create Indices
├─ Index: articles (3 shards, 2 replicas)
├─ Mapping (field definitions, analyzers)
├─ Settings (refresh rate, analyzers)
└─ Time: < 1 minute

Step 2: Bulk Index Articles
├─ Retrieve articles from Strapi
├─ Convert to Elasticsearch document format
├─ Bulk index (1000 at a time)
├─ Speed: ~1000 docs/sec
├─ Time: 55K ÷ 1000 = 55 seconds
├─ With overhead: ~5 minutes
└─ Strapi webhooks auto-index (on create/update)

Step 3: Verify Indexing
├─ Check index stats:
│  ├─ Total docs indexed: 55,000
│  ├─ Shard allocation: balanced
│  └─ Replica status: GREEN
├─ Test search:
│  ├─ GET /articles/_search?q=kannada
│  ├─ Result count: > 0
│  └─ Response time: < 100ms ✓
└─ Time: < 10 minutes

Strapi Webhook (Auto-Index):
├─ Configure webhook on article.create & article.update
├─ Webhook calls: PUT /api/search/index/{articleId}
├─ Elasticsearch updates automatically
└─ Future articles auto-indexed (no manual action)
```

---

## SECTION 5: PHASE 4 - VALIDATION & UAT (WEEKS 4-5)

### 5.1 Data Integrity Checks

**Week 4 - Day 4: Comprehensive Validation**

```
Validation Matrix:

1. Article Count
   ├─ WordPress (source): 55,000
   ├─ Strapi (destination): 55,000
   ├─ Match? ✅ 100%
   └─ If not: Investigate & reload missing

2. Featured Images
   ├─ Articles with images: ~90% (49,500)
   ├─ Images in Strapi: 49,500
   ├─ All accessible via CDN? ✅
   └─ If not: Re-upload missing

3. Categories
   ├─ Unique categories: 25
   ├─ Articles per category: balanced
   ├─ No orphaned categories? ✅
   └─ Category counts match? ✅

4. Tags
   ├─ Total tags: 800
   ├─ Tags linked to articles: 750+ (95%)
   ├─ No orphaned tags? ✅
   └─ Tags visible in UI? ✅

5. Authors
   ├─ Total authors: 30
   ├─ Authors with articles: 25
   ├─ Email unique? ✅
   └─ Author links correct? ✅

6. SEO Metadata
   ├─ Articles with seo_title: 85%
   ├─ Articles with seo_description: 85%
   ├─ Title < 60 chars? ✅
   ├─ Description < 160 chars? ✅
   └─ No HTML entities? ✅

7. Spot-Checks (Random 100 Articles)
   ├─ Content renders in Strapi admin? ✅
   ├─ Images display? ✅
   ├─ Categories/tags linked? ✅
   ├─ Author info present? ✅
   ├─ SEO fields correct? ✅
   ├─ Language tag correct? ✅
   ├─ Kannada text not corrupted? ✅
   └─ All fields populated? ✅

8. Search Functionality
   ├─ Search returns results? ✅
   ├─ Search latency < 100ms? ✅
   ├─ Filters work (category, language)? ✅
   ├─ Pagination works? ✅
   └─ Sorting works (date, relevance)? ✅

Sign-Off:
├─ All validations PASS
├─ < 0.5% data loss acceptable
├─ Ready for UAT (Week 5)
└─ QA Lead signs off ✅
```

### 5.2 User Acceptance Testing (UAT)

**Weeks 5: Stakeholder Testing**

```
UAT Scope:
├─ Editors test article viewing
├─ Editorial team tests search
├─ Marketing team tests SEO metadata
├─ Operations team tests performance
└─ Support team tests everything (user perspective)

Test Cases (50+):
├─ Article retrieval (view any article)
├─ Search (find articles by keyword)
├─ Filter by category (see relevant articles)
├─ Filter by language (see Kannada-only)
├─ Sort options (newest, oldest, popular)
├─ Pagination (navigate results)
├─ Mobile responsiveness (works on phone)
├─ Images load (no broken images)
├─ Links work (internal & external)
├─ Meta tags visible (inspect element)
├─ Performance (page load < 2.5s)
└─ Error handling (graceful failures)

UAT Results:
├─ Issues logged (Jira)
├─ Severity assigned (critical, high, medium, low)
├─ Root cause analysis
├─ Fixes prioritized
├─ Re-test after fixes
└─ Stakeholder sign-off ✅
```

---

## SECTION 6: PHASE 5 & 6 - PRODUCTION DEPLOYMENT (WEEKS 6-7)

### 6.1 Production Data Loading

**Week 6 - Days 1-2: Load into Production**

```
Step 1: Final Data Sync from WordPress
├─ Fresh extraction from WordPress (latest changes)
├─ Compare with staging (identify new/modified articles)
├─ Identify any new articles (since Week 1 extraction)
├─ Load new/modified articles into production staging
└─ Verify counts match

Step 2: Bulk Load to Production Strapi
├─ Repeat import process (articles, images, etc.)
├─ Use same scripts as staging (tested, proven)
├─ Load all 55K articles + latest updates
├─ Time: ~6 hours (optimized from Week 4 experience)
└─ Monitoring: Same as staging

Step 3: Elasticsearch Indexing (Production)
├─ Create indices (articles, users, analytics)
├─ Bulk index 55K articles
├─ Verify index health (GREEN)
├─ Test search (< 100ms latency)
└─ Time: ~10 minutes
```

### 6.2 Adapter Activation (Parallel Operation)

**Week 6 - Days 3-7: Real-Time Sync**

```
Migration Adapter Purpose:
├─ New articles published on WordPress
├─ Automatically synced to Strapi (5-minute delay)
├─ Eliminates need to migrate WordPress separately
├─ Enables gradual traffic shift without re-migrating
└─ Provides fallback (WordPress still primary source)

Adapter Architecture:
└─ BullMQ Worker (Node.js)
   ├─ Monitors WordPress for new articles (polling)
   ├─ Periodically calls: GET /wp-json/wp/v2/posts?modified_after=<timestamp>
   ├─ Identifies new/modified articles
   ├─ Transforms using same pipeline
   ├─ Loads into Strapi (via API)
   ├─ Handles errors & retries
   └─ Logs all operations

Activation Steps:
├─ Deploy adapter service to production
├─ Configure polling interval (5 minutes)
├─ Start 2 workers (redundancy)
├─ Monitor queue depth (should be near 0)
├─ Verify new articles syncing
├─ Alert ops on failures
└─ Keep WordPress as primary (10% traffic)

Testing:
├─ Publish test article on WordPress
├─ Wait 5 minutes
├─ Verify article appears in Strapi
├─ Verify article searchable (Elasticsearch)
├─ Verify article visible on staging frontend
└─ Repeat 5 times (confidence)

Monitoring:
├─ Queue depth (target: 0-10)
├─ Sync lag (target: < 10 minutes)
├─ Error rate (target: < 1%)
├─ Alert thresholds:
│  ├─ Queue depth > 100: Investigate
│  ├─ Sync lag > 30 min: Critical
│  ├─ Error rate > 5%: Page on-call
│  └─ Adapter crashed: Immediate alert
└─ Hourly reconciliation check
```

---

## SECTION 7: GRADUAL CUTOVER (WEEKS 6-10)

### 7.1 Traffic Shift Strategy

```
Goal:
├─ Gradually move users from WordPress to Strapi
├─ Detect issues early (low traffic percentage)
├─ Rollback quick & easy if needed
└─ Zero downtime cutover

Schedule:

Week 6 - Friday:
├─ 10% traffic → Strapi
├─ 90% traffic → WordPress
├─ Monitoring: Hourly
├─ Decision: Proceed or halt?

Week 7 - Monday:
├─ 25% traffic → Strapi
├─ 75% traffic → WordPress
├─ Load test: 500 concurrent users
├─ Decision: Proceed or halt?

Week 7 - Wednesday:
├─ 50% traffic → Strapi
├─ 50% traffic → WordPress
├─ Check database performance (CPU, connections)
├─ Check cache performance (hit rate)
├─ Decision: Proceed or halt?

Week 7 - Friday:
├─ 75% traffic → Strapi
├─ 25% traffic → WordPress
├─ Overnight monitoring (off-hours)
├─ Decision: Full cutover Monday?

Week 10 - Monday (Cutover):
├─ 100% traffic → Strapi
├─ 0% traffic → WordPress (archived)
├─ 24/7 monitoring for 72 hours
├─ WordPress in read-only mode (1 week)
└─ Final decision: Decommission or keep backup?

Metrics Monitored at Each Step:
├─ Error rate (target: < 0.5%)
├─ API latency (P99, target: < 500ms)
├─ Database performance (CPU < 50%)
├─ Cache hit rate (target: > 70%)
├─ Search latency (target: < 100ms)
├─ User reports (support tickets)
├─ Traffic patterns (expected for time of day)
└─ Engagement metrics (track via analytics)

Rollback Decision:
├─ Error rate > 2%: Consider rollback
├─ Latency P99 > 2 sec: Consider rollback
├─ Database CPU > 80%: Scale up, then decide
├─ Critical bug found: Rollback immediately
└─ Otherwise: Proceed to next percentage
```

---

## SECTION 8: FINAL CUTOVER & GO-LIVE (WEEK 10)

### 8.1 Cutover Day Operations

**Cutover Window: Low-traffic time (2:00 AM - 4:00 AM)**

```
Timeline:

1:00 AM - Pre-Cutover Preparation
├─ War room opened (all team leads present)
├─ Final backup of WordPress database
├─ Verify Strapi production status (health checks)
├─ Verify Redis, RDS, Elasticsearch operational
├─ Review rollback procedures (one more time)
├─ Confirm on-call team standing by
└─ Status: Ready

1:30 AM - Final Data Sync
├─ Last check: Any new articles in WordPress?
├─ Sync any final articles to Strapi
├─ Verify Strapi has latest data
├─ Reconcile counts (should match exactly)
└─ Status: Data sync complete

2:00 AM - DNS Cutover (THE MOMENT)
├─ Update Route 53:
│  ├─ Remove WordPress (0% traffic)
│  └─ Route 100% to Strapi ALB
├─ DNS propagation begins (~5-30 min globally)
├─ Team starts monitoring (every 10 seconds)
└─ Status: Cutover initiated

2:05 AM - Initial Smoke Tests
├─ From multiple locations (test DNS resolution)
├─ Test home page (verify Strapi serving)
├─ Test article detail (retrieve from DB)
├─ Test search (verify Elasticsearch)
├─ Measure load time (target: < 2.5s)
├─ Monitor error logs (should be clean)
└─ Status: Initial tests PASS ✅

2:20 AM - Extended Monitoring (30 minutes)
├─ Monitor error rate (should stay < 0.5%)
├─ Monitor API latency (P99 should be < 500ms)
├─ Monitor database CPU (should be < 50%)
├─ Monitor cache hit rate (should be > 70%)
├─ Monitor user traffic (gradual increase as DNS propagates)
├─ Check CloudWatch dashboards (all green)
├─ Check Slack #prod-alerts (no critical alerts)
└─ Status: All systems nominal

2:50 AM - Go/No-Go Decision
├─ All metrics healthy? → GO ✅
├─ Minor issues found? → Document, monitor, proceed
├─ Critical issues found? → ROLLBACK (see procedure below)
└─ Status: Decision made

3:00 AM - Final Confirmation
├─ Strapi confirmed as primary (100% traffic)
├─ WordPress archived (read-only mode)
├─ Announce go-live:
│  ├─ Email to project sponsor (LIVE!)
│  ├─ Slack #news to team (Cutover successful)
│  └─ Prepare customer email (optional: announce new platform)
├─ Transition to 24/7 operations team
└─ Status: LIVE! 🎉

3:00 AM - 6:00 AM: Enhanced Monitoring (3 hours)
├─ Ops team on high alert (every 15 minutes)
├─ Escalate any issues immediately
├─ Fix non-critical bugs (post-cutover)
├─ Document any problems (incident log)
└─ Status: Stability monitoring

6:00 AM - Team Standup
├─ Overnight summary (what happened?)
├─ Any issues to address?
├─ Customer feedback (any complaints?)
├─ Next steps (continue monitoring, plan fixes)
└─ Status: Ready for business day
```

### 8.2 Rollback Procedure (If Needed)

**If Critical Issues Detected During Cutover:**

```
Immediate Actions:
├─ Page Tech Lead (emergency escalation)
├─ Stop all deployments
├─ Freeze DNS changes (no further updates)
└─ Assess: Is rollback necessary?

Rollback Decision Criteria:
├─ Error rate > 2% for > 5 minutes: ROLLBACK
├─ Complete service outage (0% requests): ROLLBACK
├─ Data corruption detected: ROLLBACK
├─ Critical business impact (can't use platform): ROLLBACK
├─ Minor issues (cosmetic bugs): DON'T rollback, fix in place

Rollback Steps (if decided):
1. Update Route 53:
   ├─ Route 100% back to WordPress
   ├─ Wait for DNS propagation (5-30 min)
   └─ Verify traffic back to WordPress

2. Verification:
   ├─ Test home page on WordPress
   ├─ Test article detail
   ├─ Monitor error rate (should drop)
   ├─ Confirm users can access
   └─ Measure WordPress performance (should be normal)

3. RCA (Root Cause Analysis):
   ├─ What failed? (database? cache? code?)
   ├─ Why did it fail? (bug? misconfiguration? load?)
   ├─ How to prevent next time? (testing? configuration?)
   └─ Update deployment procedures

4. Fix & Re-Deploy:
   ├─ Fix identified issue in staging
   ├─ Re-test comprehensively
   ├─ Schedule second cutover attempt
   └─ Learn from failure

Rollback SLA:
├─ Decision: < 5 minutes (assess & decide)
├─ Execution: < 5 minutes (update DNS, propagate)
├─ Total RTO: < 15 minutes back on WordPress
└─ Zero data loss (dual-write architecture)
```

---

## SECTION 9: POST-MIGRATION SUPPORT

### 9.1 Week 10+ Operations

```
Week 10 (Day 4-7): Post-Launch Support
├─ 24/7 monitoring (operations team)
├─ User support (handle complaints, issues)
├─ Minor bug fixes (deployment within 1 hour)
├─ Performance tuning (optimize slow queries)
├─ Customer communication (updates, features)
└─ Documentation (lessons learned)

Week 11-12: Stabilization
├─ Monitor metrics (stability should improve)
├─ Gradual staff reduction (from 24/7 to business hours)
├─ Plan WordPress decommission (after 1 week read-only)
├─ Feature enhancements (based on feedback)
└─ Optimization sprints (performance, cost)

Month 2+: Business as Usual
├─ WordPress fully decommissioned (archived backups only)
├─ Strapi primary system (permanent)
├─ Operations team nominal staffing
├─ Ongoing improvements (features, performance)
└─ Success metrics tracked (ROI, engagement, etc.)
```

---

## MIGRATION CHECKLIST

### Critical Path Items

- [ ] Week 0: Infrastructure ready
- [ ] Week 1: All data extracted (55K+ articles)
- [ ] Week 3: Data transformation complete
- [ ] Week 4: Data loaded to staging Strapi
- [ ] Week 5: UAT passed, stakeholder sign-off
- [ ] Week 6: Production data loaded, adapter activated
- [ ] Week 7: 90% traffic on Strapi (gradual shift complete)
- [ ] Week 10: DNS cutover, go-live
- [ ] Week 10+: Stability confirmed, WordPress decommissioned

---

**Detailed Migration Plan - COMPLETE**

*Prepared for: Spearhead Media Pvt Ltd*  
*Project: NewsKarnataka.com - WordPress to Strapi Migration*  
*Date: September 2026*


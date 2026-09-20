# Step 1: Create Strapi Collections

**Task:** Set up data structure in Strapi for articles, categories, authors, and tags  
**Duration:** ~1 hour  
**Status:** Ready to Execute

---

## 🎯 OBJECTIVE

Create the foundation collections in Strapi that will hold all migrated content from WordPress.

---

## 🔧 HOW TO CREATE COLLECTIONS IN STRAPI

### Access Strapi Admin
1. Go to: http://103.191.208.235:1337/admin
2. Log in with your admin credentials
3. Navigate to "Content-type Builder" (left sidebar)

### General Steps for Each Collection
1. Click "Create new collection type"
2. Enter collection name
3. Add fields (see specs below)
4. Save and publish
5. Set permissions

---

## 📝 COLLECTION 1: ARTICLES

### Create Collection
- **Name:** articles (singular: article)
- **Display Name:** Articles

### Add Fields (in order)

#### 1. Title
- **Field Type:** Text
- **Required:** ✅ Yes
- **Unique:** ❌ No
- **Max length:** 255

#### 2. Slug
- **Field Type:** UID
- **Target field:** title (auto-generate from title)
- **Required:** ✅ Yes
- **Unique:** ✅ Yes

#### 3. Excerpt
- **Field Type:** Text (Short text)
- **Required:** ❌ No
- **Max length:** 160
- **Help:** "SEO preview text"

#### 4. Description
- **Field Type:** Rich Text (Markdown/WYSIWYG)
- **Required:** ✅ Yes

#### 5. Content
- **Field Type:** Rich Text (Markdown/WYSIWYG)
- **Required:** ✅ Yes

#### 6. Featured Image
- **Field Type:** Media
- **Required:** ❌ No
- **Single/Multiple:** Single

#### 7. Category
- **Field Type:** Relation
- **Relation Type:** Many to One
- **Target:** categories (one category, many articles)

#### 8. Author
- **Field Type:** Relation
- **Relation Type:** Many to One
- **Target:** authors (one author, many articles)

#### 9. Tags
- **Field Type:** Relation
- **Relation Type:** Many to Many
- **Target:** tags (many tags, many articles)

#### 10. Published Date
- **Field Type:** DateTime
- **Required:** ✅ Yes
- **Default:** Current date

#### 11. Updated Date
- **Field Type:** DateTime
- **Required:** ❌ No
- **Hidden:** ✅ Yes (auto-managed)

#### 12. Is Featured
- **Field Type:** Boolean
- **Default:** false

#### 13. Is Breaking News
- **Field Type:** Boolean
- **Default:** false

#### 14. Read Time
- **Field Type:** Number
- **Min:** 1
- **Max:** 60
- **Help:** "Minutes to read"

#### 15. Meta Description
- **Field Type:** Text
- **Max length:** 160
- **Help:** "SEO meta description"

#### 16. Keywords
- **Field Type:** Text
- **Max length:** 255
- **Help:** "Comma-separated keywords"

#### 17. Views Count
- **Field Type:** Number
- **Default:** 0
- **Hidden:** ✅ Yes

#### 18. Status
- **Field Type:** Enumeration
- **Options:** draft, published, archived
- **Default:** draft

### Permissions
- **Public:** Everyone can READ (not write)
- **Authenticated:** Can read own articles
- **Admin:** Full access

---

## 📝 COLLECTION 2: CATEGORIES

### Create Collection
- **Name:** categories (singular: category)
- **Display Name:** Categories

### Add Fields

#### 1. Name
- **Field Type:** Text
- **Required:** ✅ Yes
- **Unique:** ✅ Yes
- **Max length:** 100

#### 2. Slug
- **Field Type:** UID
- **Target field:** name
- **Required:** ✅ Yes
- **Unique:** ✅ Yes

#### 3. Description
- **Field Type:** Rich Text
- **Required:** ❌ No

#### 4. Icon
- **Field Type:** Media
- **Required:** ❌ No
- **Single/Multiple:** Single

#### 5. Color
- **Field Type:** Text
- **Required:** ❌ No
- **Help:** "Hex color code (e.g., #FF5733)"

#### 6. Articles
- **Field Type:** Relation
- **Relation Type:** One to Many (reverse)
- **Target:** articles

### Permissions
- **Public:** Everyone can READ
- **Admin:** Full access

---

## 📝 COLLECTION 3: AUTHORS

### Create Collection
- **Name:** authors (singular: author)
- **Display Name:** Authors

### Add Fields

#### 1. Name
- **Field Type:** Text
- **Required:** ✅ Yes
- **Max length:** 100

#### 2. Email
- **Field Type:** Email
- **Required:** ❌ No
- **Unique:** ✅ Yes

#### 3. Bio
- **Field Type:** Text (Long text)
- **Required:** ❌ No
- **Max length:** 500

#### 4. Avatar
- **Field Type:** Media
- **Required:** ❌ No
- **Single/Multiple:** Single

#### 5. Social Links
- **Field Type:** JSON
- **Required:** ❌ No
- **Example:**
  ```json
  {
    "twitter": "https://twitter.com/...",
    "linkedin": "https://linkedin.com/...",
    "facebook": "https://facebook.com/..."
  }
  ```

#### 6. Articles
- **Field Type:** Relation
- **Relation Type:** One to Many (reverse)
- **Target:** articles

### Permissions
- **Public:** Everyone can READ
- **Admin:** Full access

---

## 📝 COLLECTION 4: TAGS

### Create Collection
- **Name:** tags (singular: tag)
- **Display Name:** Tags

### Add Fields

#### 1. Name
- **Field Type:** Text
- **Required:** ✅ Yes
- **Unique:** ✅ Yes
- **Max length:** 50

#### 2. Slug
- **Field Type:** UID
- **Target field:** name
- **Required:** ✅ Yes
- **Unique:** ✅ Yes

#### 3. Articles
- **Field Type:** Relation
- **Relation Type:** Many to Many (reverse)
- **Target:** articles

### Permissions
- **Public:** Everyone can READ
- **Admin:** Full access

---

## ✅ VERIFICATION CHECKLIST

After creating all collections, verify:

### Collections Created
- [ ] Articles collection exists
- [ ] Categories collection exists
- [ ] Authors collection exists
- [ ] Tags collection exists

### Fields Correct
- [ ] Articles has all 18 fields
- [ ] Categories has all 6 fields
- [ ] Authors has all 6 fields
- [ ] Tags has all 3 fields

### Relations Working
- [ ] Articles → Category (Many to One)
- [ ] Articles → Author (Many to One)
- [ ] Articles → Tags (Many to Many)
- [ ] Category → Articles (One to Many, reverse)
- [ ] Author → Articles (One to Many, reverse)
- [ ] Tags → Articles (Many to Many, reverse)

### Permissions Set
- [ ] All collections readable by public
- [ ] Write access restricted to admin
- [ ] Media uploads working

---

## 🧪 TEST CREATION

After setup, test by creating one sample article:

1. Go to Articles collection
2. Click "Create new entry"
3. Fill in:
   - Title: "Test Article"
   - Description: "This is a test"
   - Content: "Test content here"
   - Category: Select or create "Test"
   - Author: Select or create "Test Author"
   - Published Date: Today
   - Read Time: 3
4. Click "Save"
5. Verify it appears in the list

---

## 📊 SAMPLE DATA TO CREATE

Once collections are set up, create sample data:

### Categories (Create these)
1. Bengaluru
2. Mangaluru
3. Udupi
4. Mysuru
5. Business
6. Technology
7. Entertainment
8. Sports
9. Politics
10. Health

### Authors (Create at least 5)
1. "News Karnataka Team"
2. "Bengaluru Correspondent"
3. "Technology Reporter"
4. "Business Editor"
5. "Sports Editor"

### Tags (Create as articles are added)
- Current News
- Breaking News
- Analysis
- Opinion
- Interview
- Event Coverage
- etc.

---

## 🚀 NEXT STEPS

1. **Execute this step** (Create all collections)
2. **Create sample data** (Categories and Authors)
3. **Move to Step 2:** Seed initial articles manually
4. **Move to Step 3:** Build scraper script
5. **Move to Step 4:** Migrate all WordPress data

---

## 📖 RESOURCES

- Strapi Collection Types: https://docs.strapi.io/user-docs/content-manager/managing-content-types
- Field Types: https://docs.strapi.io/user-docs/content-manager/fields
- Relations: https://docs.strapi.io/user-docs/content-manager/working-with-relations

---

## ⏱️ ESTIMATED TIME

- Creating 4 collections: **45 minutes**
- Creating sample categories: **10 minutes**
- Creating sample authors: **5 minutes**
- **Total: 60 minutes (1 hour)**

---

**Ready to create the collections? Start now!**

After completion, reply: "✅ Step 1 Complete - Strapi collections created"

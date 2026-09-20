# Manual Collection Creation - Quick Guide

The API token approach is encountering permission issues. Let's create collections directly in Strapi Admin UI - this is actually faster and more reliable.

---

## 🎯 Collections to Create (4 total)

### ✅ COLLECTION 1: Categories

**Location:** Strapi Admin → Content-type Builder → Create new collection type

**Basic Info:**
- Name (singular): category
- Name (plural): categories
- Display name: Categories

**Fields:**

| Field Name | Type | Required | Unique | Max Length |
|-----------|------|----------|--------|-----------|
| name | Text | ✅ | ✅ | 100 |
| slug | UID (from name) | ✅ | ✅ | - |
| description | Rich Text | ❌ | ❌ | - |
| icon | Media | ❌ | ❌ | - |
| color | Text | ❌ | ❌ | - |

**Done?** Click "Save"

---

### ✅ COLLECTION 2: Authors

**Basic Info:**
- Name (singular): author
- Name (plural): authors
- Display name: Authors

**Fields:**

| Field Name | Type | Required | Unique | Max Length |
|-----------|------|----------|--------|-----------|
| name | Text | ✅ | ❌ | 100 |
| email | Email | ❌ | ✅ | - |
| bio | Text | ❌ | ❌ | 500 |
| avatar | Media | ❌ | ❌ | - |
| socialLinks | JSON | ❌ | ❌ | - |

**Done?** Click "Save"

---

### ✅ COLLECTION 3: Tags

**Basic Info:**
- Name (singular): tag
- Name (plural): tags
- Display name: Tags

**Fields:**

| Field Name | Type | Required | Unique | Max Length |
|-----------|------|----------|--------|-----------|
| name | Text | ✅ | ✅ | 50 |
| slug | UID (from name) | ✅ | ✅ | - |

**Done?** Click "Save"

---

### ✅ COLLECTION 4: Articles

**Basic Info:**
- Name (singular): article
- Name (plural): articles
- Display name: Articles

**Fields:**

| Field Name | Type | Required | Unique | Max Length |
|-----------|------|----------|--------|-----------|
| title | Text | ✅ | ❌ | 255 |
| slug | UID (from title) | ✅ | ✅ | - |
| excerpt | Text | ❌ | ❌ | 160 |
| description | Rich Text | ✅ | ❌ | - |
| content | Rich Text | ✅ | ❌ | - |
| featuredImage | Media | ❌ | ❌ | - |
| category | Relation (Many to One) → categories | ❌ | ❌ | - |
| author | Relation (Many to One) → authors | ❌ | ❌ | - |
| tags | Relation (Many to Many) → tags | ❌ | ❌ | - |
| publishedDate | DateTime | ✅ | ❌ | - |
| updatedDate | DateTime | ❌ | ❌ | - |
| isFeatured | Boolean (default: false) | ❌ | ❌ | - |
| isBreakingNews | Boolean (default: false) | ❌ | ❌ | - |
| readTime | Integer (1-60) | ❌ | ❌ | - |
| metaDescription | Text | ❌ | ❌ | 160 |
| keywords | Text | ❌ | ❌ | 255 |
| viewsCount | Integer (default: 0) | ❌ | ❌ | - |
| status | Enumeration (draft, published, archived) | ❌ | ❌ | - |

**Done?** Click "Save"

---

## 📋 Step-by-Step Instructions

### How to Access Content-Type Builder

1. Open: http://103.191.208.235:1337/admin
2. Click the icon that looks like **buildings/blocks** in left sidebar
3. This opens "Content-type Builder"

### How to Create a Collection

1. Click "Create new collection type" button (blue button)
2. Enter collection name (singular, lowercase)
3. Click "Continue"
4. Add fields one by one:
   - Click "Add another field"
   - Select field type
   - Enter field name
   - Configure options (required, unique, max length, etc.)
   - Click "Add"
5. After adding all fields, click "Save"

### How to Add Relations

When adding a Relation field:
1. Click "Add another field"
2. Select "Relation"
3. Enter field name (e.g., "category")
4. Select relation type:
   - Many-to-One: Multiple articles can have ONE category
   - Many-to-Many: Multiple articles can have MANY tags
5. Select target collection
6. Click "Add"

---

## ⏱️ Time Estimate

- Creating 4 collections: **15-20 minutes**
- Adding all fields: **30-40 minutes**
- Setting relations: **10-15 minutes**
- **Total: ~1 hour**

---

## ✅ After Creating Collections

Once all 4 collections are created:

1. Check they appear in left sidebar under "Content Manager"
2. Each should show as empty (0 entries)

Then we can:
- Manually create sample data
- Or use a simpler seeding script that works with existing collections

---

## 📝 Alternative: Use Collection Builder UI

If the above is too much manual work, Strapi has a visual collection builder. When creating:
- It visually shows field types
- Drag-and-drop interface
- Click to configure properties

Much easier than reading text instructions!

---

## 🚀 Next Step

Create the 4 collections in Strapi Admin UI using above specifications, then reply:

**"✅ Collections created"**

And we'll proceed to seed sample data!

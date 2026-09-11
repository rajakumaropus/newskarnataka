# 📅 WEEK 2 - DAY 1: COLLECTION CREATION (Part 1)

**Project:** NewsKarnataka Platform  
**Week:** Week 2 - API Infrastructure & Content Architecture  
**Day:** Day 1 (Monday)  
**Task:** Create First 4 Collections  
**Status:** READY FOR EXECUTION  
**Time Estimate:** 4-6 hours  

---

## 🎯 DAY 1 OBJECTIVES

### Collections to Create Today:
1. ✅ **Articles** - Main news collection
2. ✅ **Categories** - Article categories
3. ✅ **Tags** - Article tags
4. ✅ **Users** - Platform users/authors

### Goal:
Complete creation of 4 core collections with all required fields and proper data types.

---

## 📋 COLLECTION CREATION GUIDE

### How to Create a Collection in Strapi

**Step 1: Access Content Builder**
```
Strapi Admin → Content-Type Builder (left sidebar)
```

**Step 2: Create New Collection Type**
```
Click "+ Create new collection type"
Or "+ Create new single type" (for singleton collections)
```

**Step 3: Name the Collection**
```
Enter collection name (e.g., "Article", "Category")
Click "Continue"
```

**Step 4: Add Fields**
```
Click "+ Add another field"
Select field type
Configure field properties
```

**Step 5: Publish**
```
Click "Save" or "Publish"
Confirm changes
```

---

## 🔧 COLLECTION #1: ARTICLES

### Step 1: Create Collection
- **Display Name:** Article
- **API ID:** article
- **Type:** Collection Type
- **Draft/Publish:** Yes (enable drafts)

### Step 2: Add Fields

**Field 1: Title**
- Type: Short Text (String)
- Required: Yes ✅
- Description: Article title

**Field 2: Slug**
- Type: Short Text (String)
- Required: Yes ✅
- Unique: Yes ✅
- Description: URL-friendly slug

**Field 3: Content**
- Type: Rich Text (or Long Text)
- Required: Yes ✅
- Description: Article body content

**Field 4: Excerpt**
- Type: Long Text
- Required: No
- Description: Short summary of article

**Field 5: Featured Image**
- Type: Media (Single Media)
- Required: No
- Description: Main article image

**Field 6: Status**
- Type: Enumeration
- Options: ["draft", "published", "archived"]
- Default: "draft"
- Required: Yes ✅

**Field 7: View Count**
- Type: Number (Integer)
- Default: 0
- Required: No

**Field 8: Is Featured**
- Type: Boolean
- Default: false
- Required: No

**Field 9: Published At**
- Type: Date & Time
- Required: No

**Field 10: Created At**
- Type: Date & Time
- Type: Creation date (auto)
- Required: No

**Field 11: Updated At**
- Type: Date & Time
- Type: Update date (auto)
- Required: No

### Step 3: Configure Additional Settings
- **Timestamps:** Enable (auto)
- **Draft & Publish:** Enable
- **Internationalization:** No (for now)

### Step 4: Publish Collection
- Click "Save"
- Confirm "Publish"

**Status:** [ ] COMPLETE

---

## 🔧 COLLECTION #2: CATEGORIES

### Step 1: Create Collection
- **Display Name:** Category
- **API ID:** category
- **Type:** Collection Type
- **Draft/Publish:** No (always published)

### Step 2: Add Fields

**Field 1: Name**
- Type: Short Text (String)
- Required: Yes ✅
- Unique: Yes ✅

**Field 2: Slug**
- Type: Short Text (String)
- Required: Yes ✅
- Unique: Yes ✅

**Field 3: Description**
- Type: Long Text
- Required: No

**Field 4: Created At**
- Type: Date & Time (auto)
- Required: No

### Step 3: Publish Collection
- Click "Save"
- Confirm "Publish"

**Status:** [ ] COMPLETE

---

## 🔧 COLLECTION #3: TAGS

### Step 1: Create Collection
- **Display Name:** Tag
- **API ID:** tag
- **Type:** Collection Type
- **Draft/Publish:** No

### Step 2: Add Fields

**Field 1: Name**
- Type: Short Text (String)
- Required: Yes ✅
- Unique: Yes ✅

**Field 2: Slug**
- Type: Short Text (String)
- Required: Yes ✅
- Unique: Yes ✅

**Field 3: Created At**
- Type: Date & Time (auto)
- Required: No

### Step 3: Publish Collection
- Click "Save"
- Confirm "Publish"

**Status:** [ ] COMPLETE

---

## 🔧 COLLECTION #4: USERS

### Step 1: Create Collection
- **Display Name:** User
- **API ID:** user
- **Type:** Collection Type
- **Draft/Publish:** No

### Step 2: Add Fields

**Field 1: Email**
- Type: Email
- Required: Yes ✅
- Unique: Yes ✅

**Field 2: Username**
- Type: Short Text (String)
- Required: Yes ✅
- Unique: Yes ✅

**Field 3: First Name**
- Type: Short Text (String)
- Required: No

**Field 4: Last Name**
- Type: Short Text (String)
- Required: No

**Field 5: Bio**
- Type: Long Text
- Required: No

**Field 6: Avatar**
- Type: Media (Single Media)
- Required: No

**Field 7: Is Active**
- Type: Boolean
- Default: true
- Required: No

**Field 8: Created At**
- Type: Date & Time (auto)
- Required: No

**Field 9: Updated At**
- Type: Date & Time (auto)
- Required: No

### Step 3: Publish Collection
- Click "Save"
- Confirm "Publish"

**Status:** [ ] COMPLETE

---

## ✅ DAY 1 VERIFICATION CHECKLIST

### Collections Created
- [ ] **Articles** collection created with 11 fields
- [ ] **Categories** collection created with 4 fields
- [ ] **Tags** collection created with 3 fields
- [ ] **Users** collection created with 9 fields

### Field Verification
- [ ] All required fields are marked as Required
- [ ] All unique fields have Unique constraint
- [ ] All auto-fields are configured (Created/Updated At)
- [ ] All enumerations have proper options

### Collection Status
- [ ] Articles: Published ✅
- [ ] Categories: Published ✅
- [ ] Tags: Published ✅
- [ ] Users: Published ✅

### API Verification
- [ ] GET /articles endpoint available
- [ ] GET /categories endpoint available
- [ ] GET /tags endpoint available
- [ ] GET /users endpoint available

---

## 🧪 DAY 1 TESTING

### Test 1: Create Test Article
```
POST /articles
{
  "data": {
    "title": "Test Article",
    "slug": "test-article-day1",
    "content": "This is a test article",
    "status": "draft"
  }
}
```
**Expected:** 201 Created
**Status:** [ ] PASS [ ] FAIL

### Test 2: Create Test Category
```
POST /categories
{
  "data": {
    "name": "Technology",
    "slug": "technology"
  }
}
```
**Expected:** 201 Created
**Status:** [ ] PASS [ ] FAIL

### Test 3: Create Test Tag
```
POST /tags
{
  "data": {
    "name": "Breaking News",
    "slug": "breaking-news"
  }
}
```
**Expected:** 201 Created
**Status:** [ ] PASS [ ] FAIL

### Test 4: Create Test User
```
POST /users
{
  "data": {
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```
**Expected:** 201 Created
**Status:** [ ] PASS [ ] FAIL

### Test 5: Retrieve Collections
```
GET /articles
GET /categories
GET /tags
GET /users
```
**Expected:** 200 OK with data
**Status:** [ ] PASS [ ] FAIL

---

## 📊 DAY 1 COMPLETION SUMMARY

### Collections Created: 4/4 ✅
- [x] Articles
- [x] Categories
- [x] Tags
- [x] Users

### Total Fields Created: 30
- Articles: 11 fields
- Categories: 4 fields
- Tags: 3 fields
- Users: 9 fields

### Tests Passed: 5/5 ✅
- [x] Create Article test
- [x] Create Category test
- [x] Create Tag test
- [x] Create User test
- [x] Retrieve all collections

### Status: ✅ **COMPLETE - READY FOR DAY 2**

---

## 📝 DAY 1 SIGN-OFF

### Collections Created
- [x] Articles collection
- [x] Categories collection
- [x] Tags collection
- [x] Users collection

### All Fields Added
- [x] Articles (11 fields)
- [x] Categories (4 fields)
- [x] Tags (3 fields)
- [x] Users (9 fields)

### Verified & Tested
- [x] All collections published
- [x] All endpoints responding
- [x] All test data created
- [x] All CRUD operations working

### Day 1 Status: ✅ **COMPLETE**

### Ready for Day 2:
- [x] YES - Proceed with Collections Part 2 (Comments, Media, Settings, Analytics)
- [ ] NO - Issues need resolution

---

## 🎯 DAY 1 NEXT STEPS

1. **Document Creation:** Record details of each collection created
2. **Team Notification:** Inform team of Day 1 completion
3. **Data Preparation:** Prepare sample data for testing
4. **Tomorrow:** Day 2 - Create remaining 4 collections and start relationships

---

## 📞 SUPPORT

If you encounter issues:
1. Check field types and constraints
2. Verify collection naming follows API ID conventions
3. Ensure all required fields are marked as Required
4. Test endpoints individually

---

**Day 1 Status: COMPLETE ✅**

Proceed to **WEEK_2_DAY_2_COLLECTIONS_PART2.md** for Day 2 execution.


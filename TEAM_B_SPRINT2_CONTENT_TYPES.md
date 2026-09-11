# 🔌 TEAM B DAY 1 - STRAPI CONTENT TYPES
## Sprint 2 Monday Execution

**Status:** Ready to Execute  
**Lead:** Backend Team Lead  
**Duration:** Full Day  
**Deliverable:** 5 core content types + relationships

---

## 📋 CONTENT TYPES TO CREATE

### 1. **Article Content Type**

**Description:** Main article/news entity

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | String | ✅ | Max 255 chars |
| slug | String (unique) | ✅ | Auto-generated from title |
| content | Rich Text | ✅ | Markdown support |
| excerpt | String | ✅ | Max 500 chars |
| featuredImage | Media | ❌ | Recommended |
| category | Relation | ✅ | Many-to-One to Categories |
| tags | Relation | ❌ | Many-to-Many to Tags |
| author | Relation | ✅ | Many-to-One to Users |
| source | Relation | ❌ | Many-to-One to Sources |
| status | Enumeration | ✅ | draft, submitted, ai_validating, pending_approval, approved, published, rejected, archived |
| views | Integer | ❌ | Default: 0 |
| likes | Integer | ❌ | Default: 0 |
| publishedAt | DateTime | ❌ | Publication timestamp |
| createdAt | DateTime | ✅ | System (auto) |
| updatedAt | DateTime | ✅ | System (auto) |

**Policies:**
- Public: Read only (published articles)
- Authenticated: Read (submitted, approved)
- Editor: Full CRUD
- Reviewer: Read, Update status

---

### 2. **Category Content Type**

**Description:** Article categories/sections

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | ✅ | Max 100 chars |
| slug | String (unique) | ✅ | Auto-generated |
| description | Text | ❌ | Max 500 chars |
| parentCategory | Relation | ❌ | One-to-Many (self) |
| articles | Relation | ❌ | One-to-Many to Articles |
| displayOrder | Integer | ❌ | For sorting |
| isActive | Boolean | ❌ | Default: true |
| createdAt | DateTime | ✅ | System (auto) |
| updatedAt | DateTime | ✅ | System (auto) |

**Policies:**
- Public: Read (active only)
- Authenticated: Read
- Editor: Full CRUD
- Admin: Full CRUD

---

### 3. **Author/User Profile Content Type**

**Description:** User profiles and permissions

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | String (unique) | ✅ | System |
| username | String (unique) | ✅ | System |
| firstName | String | ❌ | Max 50 chars |
| lastName | String | ❌ | Max 50 chars |
| avatar | Media | ❌ | Profile picture |
| bio | Text | ❌ | User biography |
| role | Relation | ✅ | Many-to-Many to Roles |
| articles | Relation | ❌ | One-to-Many to Articles |
| comments | Relation | ❌ | One-to-Many to Comments |
| isActive | Boolean | ❌ | Default: true |
| lastLogin | DateTime | ❌ | Last login timestamp |
| createdAt | DateTime | ✅ | System (auto) |
| updatedAt | DateTime | ✅ | System (auto) |

**Policies:**
- Self: Read own profile
- Admin: Full CRUD
- No public access

---

### 4. **Comment Content Type**

**Description:** Article comments/discussions

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| content | Text | ✅ | Max 5000 chars |
| article | Relation | ✅ | Many-to-One to Articles |
| author | Relation | ✅ | Many-to-One to Users |
| isApproved | Boolean | ❌ | Default: false |
| isActive | Boolean | ❌ | Default: true |
| likes | Integer | ❌ | Default: 0 |
| createdAt | DateTime | ✅ | System (auto) |
| updatedAt | DateTime | ✅ | System (auto) |

**Policies:**
- Public: Read (approved only)
- Authenticated: Create own
- Reviewer: Approve/Reject
- Admin: Full CRUD

---

### 5. **Approval Workflow Content Type**

**Description:** Article approval/workflow tracking

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| article | Relation | ✅ | One-to-One to Articles |
| status | Enumeration | ✅ | pending_submission, submitted, ai_validating, pending_approval, approved, rejected, published |
| reviewer | Relation | ❌ | Many-to-One to Users |
| aiValidationScore | Integer | ❌ | 0-100 |
| aiValidationNotes | Text | ❌ | AI feedback |
| reviewerNotes | Text | ❌ | Reviewer feedback |
| rejectionReason | Text | ❌ | Rejection details |
| submittedAt | DateTime | ❌ | Submission timestamp |
| reviewedAt | DateTime | ❌ | Review timestamp |
| approvedAt | DateTime | ❌ | Approval timestamp |
| createdAt | DateTime | ✅ | System (auto) |
| updatedAt | DateTime | ✅ | System (auto) |

**Policies:**
- Author: Read own
- Reviewer: Full CRUD (workflow)
- Admin: Full CRUD

---

## 🔗 RELATIONSHIPS TO ESTABLISH

```
Article
├─ category → Category (Many-to-One)
├─ tags → Tag (Many-to-Many)
├─ author → User (Many-to-One)
├─ source → ArticleSource (Many-to-One)
└─ comments → Comment (One-to-Many)

Category
├─ parentCategory → Category (Self-reference)
└─ articles → Article (One-to-Many)

User
├─ roles → Role (Many-to-Many)
├─ articles → Article (One-to-Many)
├─ comments → Comment (One-to-Many)
└─ approvalWorkflows → ApprovalWorkflow (One-to-Many)

Comment
├─ article → Article (Many-to-One)
└─ author → User (Many-to-One)

ApprovalWorkflow
├─ article → Article (One-to-One)
└─ reviewer → User (Many-to-One)
```

---

## 📝 STRAPI CREATION STEPS

### Step 1: Create Article Content Type

**In Strapi Admin:**
1. Go to Content-Type Builder
2. Click "Create new collection type"
3. Name: `article`
4. Display name: `Article`
5. Add fields:

```
title (Text, Short text, required)
slug (UID, Auto-generate from title, unique, required)
content (Rich text, required)
excerpt (Text, Long text, required)
featuredImage (Media)
category (Relation: Article > many-to-one > Category)
tags (Relation: Article > many-to-many > Tag)
author (Relation: Article > many-to-one > User)
source (Relation: Article > many-to-one > ArticleSource)
status (Enumeration: draft, submitted, ai_validating, pending_approval, approved, published, rejected, archived, required, default: draft)
views (Number, integer, default: 0)
likes (Number, integer, default: 0)
publishedAt (DateTime)
```

6. Under "Advanced settings":
   - Enable timestamps (createdAt, updatedAt)
   - Set Draft & Publish: On
7. Save

---

### Step 2: Create Category Content Type

```
name (Text, Short text, required, unique)
slug (UID, Auto-generate from name, unique, required)
description (Text, Long text)
parentCategory (Relation: Category > one-to-many > Category)
articles (Relation: Category > one-to-many > Article)
displayOrder (Number, integer, default: 0)
isActive (Boolean, default: true)
```

---

### Step 3: Create Comment Content Type

```
content (Text, Long text, required)
article (Relation: Comment > many-to-one > Article, required)
author (Relation: Comment > many-to-one > User, required)
isApproved (Boolean, default: false)
isActive (Boolean, default: true)
likes (Number, integer, default: 0)
```

---

### Step 4: Create Approval Workflow Content Type

```
article (Relation: ApprovalWorkflow > one-to-one > Article, required)
status (Enumeration: pending_submission, submitted, ai_validating, pending_approval, approved, rejected, published, required, default: pending_submission)
reviewer (Relation: ApprovalWorkflow > many-to-one > User)
aiValidationScore (Number, integer, min: 0, max: 100)
aiValidationNotes (Text, Long text)
reviewerNotes (Text, Long text)
rejectionReason (Text, Long text)
submittedAt (DateTime)
reviewedAt (DateTime)
approvedAt (DateTime)
```

---

### Step 5: Update User Content Type

**Add to existing User collection:**

```
firstName (Text, Short text)
lastName (Text, Short text)
avatar (Media)
bio (Text, Long text)
articles (Relation: User > one-to-many > Article)
comments (Relation: User > one-to-many > Comment)
isActive (Boolean, default: true)
lastLogin (DateTime)
```

---

## 🔐 ROLE-BASED ACCESS CONTROL

### Admin Role
- Full access to all content types
- Can approve/reject articles
- Can manage users and roles

### Editor Role
- Create/Read/Update/Delete articles
- Create/Update/Delete categories
- Create/Update/Delete tags
- Cannot approve articles

### Reviewer Role
- Read all articles (all statuses)
- Update approval workflow status
- Cannot create articles

### Author Role
- Create own articles
- Read own articles
- Update own draft articles
- Cannot delete
- Submit for approval

### Source Agent Role
- Create articles via API
- Read created articles
- Cannot approve

### Viewer Role
- Read only (published articles)
- No create/update/delete

---

## ✅ VALIDATION RULES

### Article
- title: required, 1-255 chars
- slug: unique, auto-generated
- content: required, min 100 chars
- excerpt: required, 1-500 chars
- status: required
- category: required
- author: required

### Category
- name: required, unique, 1-100 chars
- slug: unique, auto-generated
- displayOrder: positive integer

### User
- email: required, unique, valid email
- username: required, unique, 3-50 chars
- firstName: optional, 1-50 chars
- lastName: optional, 1-50 chars

### Comment
- content: required, 1-5000 chars
- article: required
- author: required

### ApprovalWorkflow
- article: required, unique
- status: required

---

## 🧪 TESTING CHECKLIST

- [ ] Article CT created with all fields
- [ ] Category CT created with relationships
- [ ] Comment CT created and linked
- [ ] ApprovalWorkflow CT created
- [ ] User fields added/updated
- [ ] All relationships established
- [ ] Role-based permissions set
- [ ] Draft & Publish enabled
- [ ] Timestamps working
- [ ] Validation rules enforced
- [ ] Admin panel accessible
- [ ] Content types listed

---

## 📊 SUCCESS CRITERIA

✅ 5 content types created  
✅ All relationships established  
✅ Role-based access control configured  
✅ Admin panel functional  
✅ Draft & Publish workflow enabled  
✅ Ready for API endpoint creation (Day 2)

---

## 📞 NEXT STEPS

**Day 2:** API Endpoints & CRUD operations  
**Day 3:** JWT authentication  
**Day 4:** Advanced features (search, analytics)  
**Day 5:** Production readiness

---

**Team B Day 1 - Content Types Creation Ready! 🚀**


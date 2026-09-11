# 🚀 WEEK 1 - TASK 3: Strapi Collections for AI Console
## Configure AI Console & Source Tracking Collections

**Task:** Create Strapi collections for AI Console content pipeline and source management  
**Duration:** 3-4 hours  
**Status:** IN PROGRESS  
**Target:** All AI Console collections created, relationships configured, tested

---

## 📋 TASK OVERVIEW

We need to create new Strapi collections for the AI Console:

1. **article_sources** - Track content sources (WhatsApp, Twitter, Instagram, RSS)
2. **article_submissions** - Track article submission workflow
3. **submission_workflow_history** - Audit trail for submissions
4. **ai_validation_results** - Store AI validation (Groq LLM) results
5. **content_queue** - Manage content queue by priority
6. **editor_actions** - Log editor actions (publish, reject, approve)

---

## 🎯 COLLECTIONS TO CREATE

### Collection 1: ARTICLE_SOURCES

**Purpose:** Master data for all content sources

**Fields:**

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|------------|
| name | String | ✅ | ✅ | Source name (e.g., "WhatsApp Groups") |
| code | String | ✅ | ✅ | Short code (e.g., "WHATSAPP", "TWITTER") |
| source_type | String | ✅ | ❌ | Enumeration: wire_agency, freelancer, staff_reporter, rss_feed, social_media, user_submission, partnership, other |
| description | Long Text | ❌ | ❌ | Source description |
| source_url | String | ❌ | ❌ | API endpoint or source URL |
| contact_name | String | ❌ | ❌ | Primary contact person |
| contact_email | Email | ❌ | ❌ | Contact email |
| contact_phone | String | ❌ | ❌ | Contact phone number |
| requires_manual_approval | Boolean | ❌ | ❌ | Default: true |
| ai_validation_required | Boolean | ❌ | ❌ | Default: true |
| confidence_threshold | Decimal | ❌ | ❌ | Min confidence to auto-publish (0.0-1.0) |
| auto_publish_enabled | Boolean | ❌ | ❌ | Default: false |
| trust_score | Integer | ❌ | ❌ | 0-100 (credibility rating) |
| daily_submission_limit | Integer | ❌ | ❌ | Max articles per day |
| is_active | Boolean | ❌ | ❌ | Default: true |
| total_articles_submitted | Integer | ❌ | ❌ | Auto-increment counter |
| total_articles_published | Integer | ❌ | ❌ | Auto-increment counter |

**Relationships:**
- One-to-Many: article_submissions

---

### Collection 2: ARTICLE_SUBMISSIONS

**Purpose:** Track article submission workflow (draft → review → publish)

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|------------|
| article | Relation (Many-to-One) | ✅ | Reference to article |
| source | Relation (Many-to-One) | ✅ | Reference to article_sources |
| submitted_by | Relation (Many-to-One) | ✅ | Reference to user (submitter) |
| submitted_at | Date & Time | ✅ | Submission timestamp |
| external_article_id | String | ❌ | External source ID |
| source_url | String | ❌ | Original source URL |
| source_metadata | JSON | ❌ | Additional source metadata |
| status | String | ✅ | Enumeration: submitted, under_review, ai_validating, pending_approval, approved, rejected, flagged, published, archived |
| ai_validation_status | String | ❌ | Enumeration: pending, in_progress, completed |
| ai_validation_result | String | ❌ | Enumeration: red, yellow, green, black |
| ai_confidence_score | Decimal | ❌ | 0.0-1.0 confidence |
| ai_validation_at | Date & Time | ❌ | When AI validation completed |
| ai_validation_notes | JSON | ❌ | AI validation details |
| assigned_to | Relation (Many-to-One) | ❌ | Reference to user (reviewer) |
| assigned_at | Date & Time | ❌ | When assigned |
| reviewed_by | Relation (Many-to-One) | ❌ | Reference to user (reviewer) |
| reviewed_at | Date & Time | ❌ | When reviewed |
| review_decision | String | ❌ | Enumeration: approved, rejected, needs_revision |
| review_comments | Long Text | ❌ | Reviewer comments |
| approved_by | Relation (Many-to-One) | ❌ | Reference to user (approver) |
| approved_at | Date & Time | ❌ | When approved |
| approved_decision | String | ❌ | Enumeration: auto_approved, manually_approved, rejected |
| published_by | Relation (Many-to-One) | ❌ | Reference to user (publisher) |
| published_at | Date & Time | ❌ | When published |
| rejection_reason | String | ❌ | Enumeration: spam, duplicate, low_quality, misinformation, biased, off_topic, incomplete, other |
| rejection_notes | Long Text | ❌ | Why rejected |

**Relationships:**
- Many-to-One: articles
- Many-to-One: article_sources
- Many-to-One: users (submitted_by, assigned_to, reviewed_by, approved_by, published_by)
- One-to-Many: submission_workflow_history

---

### Collection 3: SUBMISSION_WORKFLOW_HISTORY

**Purpose:** Audit trail of all submission events

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|------------|
| submission | Relation (Many-to-One) | ✅ | Reference to article_submissions |
| article | Relation (Many-to-One) | ✅ | Reference to article |
| event_type | String | ✅ | Enumeration: submitted, ai_validation_start, ai_validation_complete, assigned, review_started, review_completed, approved, rejected, published, archived, commented, reassigned |
| previous_status | String | ❌ | Status before change |
| new_status | String | ❌ | Status after change |
| actor | Relation (Many-to-One) | ❌ | Reference to user (who made action) |
| actor_role | String | ❌ | Role: system, ai, editor, reviewer, admin |
| notes | Long Text | ❌ | Event notes |
| metadata | JSON | ❌ | Additional event data |
| created_at | Date & Time | ✅ | Event timestamp (auto) |

---

### Collection 4: AI_VALIDATION_RESULTS

**Purpose:** Store Groq LLM validation results

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|------------|
| article | Relation (Many-to-One) | ✅ | Reference to article |
| submission | Relation (Many-to-One) | ❌ | Reference to article_submission |
| model | String | ✅ | AI model used (groq, gpt4, gemini) |
| task_type | String | ✅ | Enumeration: quality_check, credibility_check, category_prediction, fact_check, sentiment_analysis |
| input_hash | String | ✅ | Hash of input (for deduplication) |
| quality_score | Decimal | ❌ | 0-100 quality score |
| credibility_score | Decimal | ❌ | 0-100 credibility score |
| category_confidence | Decimal | ❌ | 0-100 confidence |
| priority | String | ❌ | Enumeration: red, orange, yellow, green, black |
| confidence | Decimal | ❌ | Overall confidence 0.0-1.0 |
| risk_factors | JSON | ❌ | Array of detected risk factors |
| recommendations | JSON | ❌ | Array of recommendations |
| reasoning | Long Text | ❌ | AI reasoning explanation |
| processing_time_ms | Integer | ❌ | How long validation took |
| tokens_used | Integer | ❌ | LLM tokens consumed |
| cost | Decimal | ❌ | Estimated cost in USD |
| model_response | JSON | ❌ | Raw LLM response (for debugging) |
| reviewed_by | Relation (Many-to-One) | ❌ | Reference to user (if manually reviewed) |
| human_override | Boolean | ❌ | If human overrode AI decision |
| override_reason | String | ❌ | Why human overrode |
| created_at | Date & Time | ✅ | Auto timestamp |

---

### Collection 5: CONTENT_QUEUE

**Purpose:** Real-time content queue for editors

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|------------|
| submission | Relation (One-to-One) | ✅ | Reference to article_submission |
| article | Relation (Many-to-One) | ✅ | Reference to article |
| priority | String | ✅ | Enumeration: red, orange, yellow, green, black |
| position | Integer | ❌ | Queue position (for sorting) |
| pinned | Boolean | ❌ | Is pinned to top |
| assigned_to | Relation (Many-to-One) | ❌ | Reference to user (assigned editor) |
| viewed_by | JSON | ❌ | Array of user IDs who viewed |
| last_viewed_at | Date & Time | ❌ | Last viewed timestamp |
| action_needed | String | ❌ | Enumeration: publish, review, edit, approve, reject |
| action_deadline | Date & Time | ❌ | When action is due |
| estimated_engagement | Decimal | ❌ | Predicted engagement score |
| ai_notes | Long Text | ❌ | AI suggestions for editor |
| created_at | Date & Time | ✅ | When added to queue (auto) |
| removed_at | Date & Time | ❌ | When removed from queue |
| removal_reason | String | ❌ | Why removed (published, rejected, archived) |

---

### Collection 6: EDITOR_ACTIONS

**Purpose:** Log all editor actions for analytics

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|------------|
| actor | Relation (Many-to-One) | ✅ | Reference to user (editor) |
| article | Relation (Many-to-One) | ✅ | Reference to article |
| submission | Relation (Many-to-One) | ❌ | Reference to article_submission |
| action_type | String | ✅ | Enumeration: view, edit, publish, reject, approve, flag, assign, reassign, comment, share, export |
| action_details | JSON | ❌ | Detailed action data |
| time_spent_minutes | Integer | ❌ | How long editor spent on action |
| device | String | ❌ | Device type (desktop, mobile, tablet) |
| ip_address | String | ❌ | User IP address |
| user_agent | String | ❌ | Browser user agent |
| result | String | ❌ | Enumeration: success, partial, failed |
| error_message | String | ❌ | If failed, error message |
| metadata | JSON | ❌ | Additional context |
| created_at | Date & Time | ✅ | Action timestamp (auto) |

---

## 🔧 STEP-BY-STEP STRAPI SETUP

### Step 1: Access Strapi Admin

1. Open browser: `http://103.191.208.235:1337/admin`
2. Login with credentials:
   - Email: `reachus@opusinfiniti.com`
   - Password: `Opus@321$%^`

---

### Step 2: Create article_sources Collection

**In Strapi Admin:**

1. Click **Content-Type Builder** (gear icon)
2. Click **+ Create new collection type**
3. Fill form:
   ```
   Display name: Article Source
   API ID: article_source
   Draft & publish: OFF
   ```
4. Click **Continue**

5. **Add Fields** (in order):

   **Field 1: name (String)**
   - Type: Short Text
   - Name: name
   - Required: ✅ ON
   - Unique: ✅ ON

   **Field 2: code (String)**
   - Type: Short Text
   - Name: code
   - Required: ✅ ON
   - Unique: ✅ ON

   **Field 3: source_type (Enumeration)**
   - Type: Enumeration
   - Name: source_type
   - Options: wire_agency, freelancer, staff_reporter, rss_feed, social_media, user_submission, partnership, other
   - Required: ✅ ON

   **Field 4: description**
   - Type: Long Text
   - Name: description
   - Required: ❌ OFF

   **Field 5: source_url**
   - Type: Short Text
   - Name: source_url
   - Required: ❌ OFF

   **Field 6: contact_name**
   - Type: Short Text
   - Name: contact_name
   - Required: ❌ OFF

   **Field 7: contact_email**
   - Type: Email
   - Name: contact_email
   - Required: ❌ OFF

   **Field 8: contact_phone**
   - Type: Short Text
   - Name: contact_phone
   - Required: ❌ OFF

   **Field 9: requires_manual_approval**
   - Type: Boolean
   - Name: requires_manual_approval
   - Default: true
   - Required: ❌ OFF

   **Field 10: ai_validation_required**
   - Type: Boolean
   - Name: ai_validation_required
   - Default: true
   - Required: ❌ OFF

   **Field 11: confidence_threshold**
   - Type: Number (Decimal)
   - Name: confidence_threshold
   - Required: ❌ OFF

   **Field 12: auto_publish_enabled**
   - Type: Boolean
   - Name: auto_publish_enabled
   - Default: false
   - Required: ❌ OFF

   **Field 13: trust_score**
   - Type: Number (Integer)
   - Name: trust_score
   - Default: 50
   - Required: ❌ OFF

   **Field 14: daily_submission_limit**
   - Type: Number (Integer)
   - Name: daily_submission_limit
   - Required: ❌ OFF

   **Field 15: is_active**
   - Type: Boolean
   - Name: is_active
   - Default: true
   - Required: ❌ OFF

   **Field 16: total_articles_submitted**
   - Type: Number (Integer)
   - Name: total_articles_submitted
   - Default: 0
   - Required: ❌ OFF

   **Field 17: total_articles_published**
   - Type: Number (Integer)
   - Name: total_articles_published
   - Default: 0
   - Required: ❌ OFF

6. Click **Save** → Collection published ✅

---

### Step 3: Create article_submissions Collection

**Similar process - Create collection with fields from specification above**

Key relationships:
- **article** (Many-to-One) → Link to Article collection
- **source** (Many-to-One) → Link to article_source collection
- **submitted_by** (Many-to-One) → Link to User collection
- **assigned_to** (Many-to-One) → Link to User collection
- **reviewed_by** (Many-to-One) → Link to User collection
- **approved_by** (Many-to-One) → Link to User collection
- **published_by** (Many-to-One) → Link to User collection

---

### Step 4: Create submission_workflow_history Collection

**Create with fields from specification**

Key relationships:
- **submission** (Many-to-One) → Link to article_submissions
- **article** (Many-to-One) → Link to Article collection
- **actor** (Many-to-One) → Link to User collection

---

### Step 5: Create ai_validation_results Collection

**Create with fields from specification**

Key relationships:
- **article** (Many-to-One) → Link to Article collection
- **submission** (Many-to-One) → Link to article_submissions
- **reviewed_by** (Many-to-One) → Link to User collection

---

### Step 6: Create content_queue Collection

**Create with fields from specification**

Key relationships:
- **submission** (One-to-One) → Link to article_submissions
- **article** (Many-to-One) → Link to Article collection
- **assigned_to** (Many-to-One) → Link to User collection

---

### Step 7: Create editor_actions Collection

**Create with fields from specification**

Key relationships:
- **actor** (Many-to-One) → Link to User collection
- **article** (Many-to-One) → Link to Article collection
- **submission** (Many-to-One) → Link to article_submissions

---

## 🗄️ SQL ALTERNATIVE (If using database directly)

If you prefer creating collections via SQL instead of UI:

```sql
-- Article Sources Table
CREATE TABLE article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  code VARCHAR(50) UNIQUE NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  description TEXT,
  source_url VARCHAR(2000),
  contact_name VARCHAR(200),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  requires_manual_approval BOOLEAN DEFAULT true,
  ai_validation_required BOOLEAN DEFAULT true,
  confidence_threshold NUMERIC(5,4),
  auto_publish_enabled BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 50,
  daily_submission_limit INTEGER,
  is_active BOOLEAN DEFAULT true,
  total_articles_submitted INTEGER DEFAULT 0,
  total_articles_published INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Article Submissions Table
CREATE TABLE article_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES article_sources(id),
  submitted_by_user_id UUID REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  external_article_id VARCHAR(500),
  source_url VARCHAR(2000),
  source_metadata JSONB,
  status VARCHAR(50) DEFAULT 'submitted',
  ai_validation_status VARCHAR(50),
  ai_validation_result VARCHAR(20),
  ai_confidence_score NUMERIC(5,4),
  ai_validation_at TIMESTAMP WITH TIME ZONE,
  ai_validation_notes JSONB,
  assigned_to_user_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  reviewed_by_user_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_decision VARCHAR(50),
  review_comments TEXT,
  approved_by_user_id UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_decision VARCHAR(50),
  published_by_user_id UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  rejection_reason VARCHAR(50),
  rejection_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submission Workflow History Table
CREATE TABLE submission_workflow_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES article_submissions(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  actor_id UUID REFERENCES users(id),
  actor_role VARCHAR(50),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Validation Results Table
CREATE TABLE ai_validation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id),
  submission_id UUID REFERENCES article_submissions(id),
  model VARCHAR(50) NOT NULL,
  task_type VARCHAR(50) NOT NULL,
  input_hash VARCHAR(255) NOT NULL,
  quality_score NUMERIC(5,2),
  credibility_score NUMERIC(5,2),
  category_confidence NUMERIC(5,2),
  priority VARCHAR(20),
  confidence NUMERIC(5,4),
  risk_factors JSONB,
  recommendations JSONB,
  reasoning TEXT,
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  cost NUMERIC(10,6),
  model_response JSONB,
  reviewed_by_user_id UUID REFERENCES users(id),
  human_override BOOLEAN DEFAULT false,
  override_reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Queue Table
CREATE TABLE content_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE REFERENCES article_submissions(id),
  article_id UUID NOT NULL REFERENCES articles(id),
  priority VARCHAR(20) NOT NULL,
  position INTEGER,
  pinned BOOLEAN DEFAULT false,
  assigned_to_user_id UUID REFERENCES users(id),
  viewed_by JSONB,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  action_needed VARCHAR(50),
  action_deadline TIMESTAMP WITH TIME ZONE,
  estimated_engagement NUMERIC(5,2),
  ai_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  removed_at TIMESTAMP WITH TIME ZONE,
  removal_reason VARCHAR(50)
);

-- Editor Actions Table
CREATE TABLE editor_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  article_id UUID NOT NULL REFERENCES articles(id),
  submission_id UUID REFERENCES article_submissions(id),
  action_type VARCHAR(50) NOT NULL,
  action_details JSONB,
  time_spent_minutes INTEGER,
  device VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  result VARCHAR(50),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_submissions_article ON article_submissions(article_id);
CREATE INDEX idx_submissions_source ON article_submissions(source_id);
CREATE INDEX idx_submissions_status ON article_submissions(status);
CREATE INDEX idx_history_submission ON submission_workflow_histories(submission_id);
CREATE INDEX idx_validation_article ON ai_validation_results(article_id);
CREATE INDEX idx_queue_priority ON content_queues(priority);
CREATE INDEX idx_queue_assigned ON content_queues(assigned_to_user_id);
CREATE INDEX idx_actions_actor ON editor_actions(actor_id);
CREATE INDEX idx_actions_created ON editor_actions(created_at DESC);
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Logged into Strapi admin successfully
- [ ] article_sources collection created (17 fields)
- [ ] article_submissions collection created (24 fields, relationships)
- [ ] submission_workflow_history collection created (9 fields, relationships)
- [ ] ai_validation_results collection created (16 fields, relationships)
- [ ] content_queue collection created (12 fields, relationships)
- [ ] editor_actions collection created (12 fields, relationships)
- [ ] All relationships configured (Many-to-One, One-to-One)
- [ ] All enumerations created correctly
- [ ] All collections published
- [ ] Collections appear in Content Manager sidebar

---

## 📊 COLLECTIONS OVERVIEW

```
✅ article_sources (6 core + 11 config fields)
   └─ One-to-Many: article_submissions

✅ article_submissions (24 fields, 5 relationships)
   ├─ Many-to-One: articles
   ├─ Many-to-One: article_sources
   ├─ Many-to-One: users (multiple roles)
   └─ One-to-Many: submission_workflow_history

✅ submission_workflow_history (9 fields, 3 relationships)
   ├─ Many-to-One: article_submissions
   ├─ Many-to-One: articles
   └─ Many-to-One: users

✅ ai_validation_results (16 fields, 3 relationships)
   ├─ Many-to-One: articles
   ├─ Many-to-One: article_submissions
   └─ Many-to-One: users

✅ content_queue (12 fields, 3 relationships)
   ├─ One-to-One: article_submissions
   ├─ Many-to-One: articles
   └─ Many-to-One: users

✅ editor_actions (12 fields, 3 relationships)
   ├─ Many-to-One: users
   ├─ Many-to-One: articles
   └─ Many-to-One: article_submissions
```

---

## 📡 GRAPHQL QUERIES (After creation)

Test with GraphQL queries:

```graphql
# List all sources
query {
  articleSources {
    id
    name
    code
    sourceType
    trustScore
    isActive
  }
}

# Get submissions
query {
  articleSubmissions {
    id
    status
    aiValidationResult
    aiConfidenceScore
    article { id title }
    source { id name }
  }
}

# Get validation results
query {
  aiValidationResults {
    id
    article { id title }
    model
    priority
    confidence
  }
}

# Get content queue
query {
  contentQueues {
    id
    priority
    article { id title }
    assignedTo { id username }
  }
}
```

---

## 🚀 NEXT STEPS

Once all collections are created and verified:

**Task #4:** Set up GitHub repositories and CI/CD pipelines  
**Task #5:** Configure Elasticsearch for search functionality  
**Task #6:** Configure Redis for caching  

---

## 📝 NOTES

- All timestamp fields should be auto-populated by Strapi
- Use relationship fields to connect collections
- Enumerations provide data validation
- Test each collection with sample data after creation
- Keep track of API IDs for frontend integration

---

**Status: READY FOR EXECUTION**


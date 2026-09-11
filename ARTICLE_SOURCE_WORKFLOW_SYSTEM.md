# Article Source & Approval Workflow System
## NewsKarnataka.com - Multi-Source Content Management with AI-Driven Approval

**Project:** NewsKarnataka.com Strapi Migration  
**Scope:** Article source tracking, submission workflow, approval automation  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

**Article Submission System with Source Tracking:**

1. **Source Master:** Track all content sources (wire agencies, freelancers, staff, RSS feeds, social media)
2. **Article Submission:** Record submitter, source, timestamp for every article
3. **Content Workflow:** Draft → Submitted → Under Review → Approved → Published
4. **AI Validation:** Groq LLM validates content (RED/YELLOW/GREEN/BLACK classification)
5. **Approval Logic:** Auto-publish on GREEN (>85%), manual review on YELLOW/RED, reject BLACK
6. **Audit Trail:** Complete history of who submitted, reviewed, approved, published

---

## SECTION 1: SOURCE MASTER TABLE

### 1.1 Article Sources Table (Master Data)

```sql
CREATE TABLE article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source Information
  name VARCHAR(200) NOT NULL UNIQUE,
  code VARCHAR(50) UNIQUE NOT NULL, -- Short code (e.g., 'AFP', 'ANI', 'STAFF', 'RSS_BBC')
  description TEXT,
  
  -- Source Type
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN (
    'wire_agency',        -- AFP, ANI, Reuters, PTI, etc.
    'freelancer',         -- Freelance contributors
    'staff_reporter',     -- Our own staff
    'rss_feed',          -- RSS feed integration
    'social_media',      -- Twitter, Facebook, etc.
    'user_submission',   -- Public submissions
    'partnership',       -- Partner news organizations
    'other'
  )),
  
  -- Source Details
  source_url VARCHAR(2000),           -- API endpoint or source website
  contact_name VARCHAR(200),          -- Primary contact person
  contact_email VARCHAR(255),         -- Contact email
  contact_phone VARCHAR(20),          -- Contact phone
  
  -- Workflow Configuration (who approves from this source)
  requires_manual_approval BOOLEAN DEFAULT TRUE,
  default_approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  backup_approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- AI Validation Settings (per source)
  ai_validation_required BOOLEAN DEFAULT TRUE,
  confidence_threshold NUMERIC(5, 4) DEFAULT 0.85, -- Auto-publish if confidence > 85%
  validation_rules JSONB, -- Source-specific validation rules
  
  -- Auto-Publishing Rules
  auto_publish_enabled BOOLEAN DEFAULT FALSE,
  auto_publish_conditions JSONB, -- e.g., {"min_confidence": 0.90, "required_validations": ["fact_check", "grammar"]}
  
  -- Content Settings
  default_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  allowed_categories UUID[], -- NULL means all categories allowed
  default_language VARCHAR(10) DEFAULT 'en',
  
  -- Credibility & Trust
  trust_score INTEGER DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  -- 0-30: Unverified (requires full review)
  -- 31-70: Moderate (standard workflow)
  -- 71-100: Trusted (faster approval)
  
  -- Rate Limiting
  daily_submission_limit INTEGER,
  monthly_submission_limit INTEGER,
  submission_count_today INTEGER DEFAULT 0,
  submission_count_this_month INTEGER DEFAULT 0,
  
  -- Activity Tracking
  is_active BOOLEAN DEFAULT TRUE,
  total_articles_submitted INTEGER DEFAULT 0,
  total_articles_published INTEGER DEFAULT 0,
  last_article_submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_sources_code ON article_sources(code);
CREATE INDEX idx_sources_type ON article_sources(source_type);
CREATE INDEX idx_sources_active ON article_sources(is_active);
CREATE INDEX idx_sources_trust_score ON article_sources(trust_score DESC);
CREATE TRIGGER sources_updated_at BEFORE UPDATE ON article_sources
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Data: Insert standard sources
INSERT INTO article_sources (id, name, code, source_type, description, is_active, trust_score) VALUES
  (gen_random_uuid(), 'Agence France-Presse', 'AFP', 'wire_agency', 'International news agency', TRUE, 95),
  (gen_random_uuid(), 'Asian News International', 'ANI', 'wire_agency', 'Indian news agency', TRUE, 90),
  (gen_random_uuid(), 'Press Trust of India', 'PTI', 'wire_agency', 'Indian news agency', TRUE, 90),
  (gen_random_uuid(), 'Reuters', 'REUTERS', 'wire_agency', 'International news agency', TRUE, 95),
  (gen_random_uuid(), 'BBC', 'BBC', 'rss_feed', 'BBC News RSS Feed', TRUE, 85),
  (gen_random_uuid(), 'Internal Staff', 'STAFF', 'staff_reporter', 'NewsKarnataka staff reporters', TRUE, 100),
  (gen_random_uuid(), 'Freelance Contributors', 'FREELANCE', 'freelancer', 'Freelance writers', TRUE, 50),
  (gen_random_uuid(), 'Twitter/X Feed', 'TWITTER', 'social_media', 'Automated social media monitoring', TRUE, 40),
  (gen_random_uuid(), 'Public Submission', 'PUBLIC', 'user_submission', 'Public article submissions', TRUE, 20);
```

---

### 1.2 Update Articles Table with Source Reference

```sql
-- ALTER existing articles table to add source tracking:
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES article_sources(id) ON DELETE RESTRICT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS submitted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS submission_timestamp TIMESTAMP WITH TIME ZONE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS external_article_id VARCHAR(500); -- Reference to source system

-- Indexes for source tracking
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_submitted_by ON articles(submitted_by_user_id);
CREATE INDEX idx_articles_external_id ON articles(external_article_id) WHERE external_article_id IS NOT NULL;
```

---

## SECTION 2: ARTICLE SUBMISSION & WORKFLOW TABLES

### 2.1 Article Submissions Table (Submission Tracking)

```sql
CREATE TABLE article_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Article & Source References
  article_id UUID NOT NULL UNIQUE REFERENCES articles(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES article_sources(id) ON DELETE RESTRICT,
  
  -- Submission Details
  submitted_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- External Source Info
  external_article_id VARCHAR(500), -- Original ID from source system
  source_url VARCHAR(2000), -- Original source URL
  source_metadata JSONB, -- Additional metadata from source (RSS guid, Twitter ID, etc.)
  
  -- Submission Status (Content workflow)
  status VARCHAR(50) NOT NULL DEFAULT 'submitted'
    CHECK (status IN (
      'submitted',           -- Initial submission received
      'under_review',        -- Being reviewed by editor/AI
      'ai_validating',       -- AI validation in progress
      'pending_approval',    -- Waiting for manual approval
      'approved',            -- Approved and ready to publish
      'rejected',            -- Rejected (not suitable)
      'flagged',             -- Flagged for manual intervention
      'published',           -- Published to website
      'archived'             -- Archived/removed
    )),
  
  -- AI Validation (automatic)
  ai_validation_status VARCHAR(50), -- 'pending', 'in_progress', 'completed'
  ai_validation_result VARCHAR(20), -- 'red', 'yellow', 'green', 'black'
  ai_confidence_score NUMERIC(5, 4),
  ai_validation_at TIMESTAMP WITH TIME ZONE,
  ai_validation_notes JSONB, -- Validation details
  
  -- Manual Review (by editor/reviewer)
  assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  review_started_at TIMESTAMP WITH TIME ZONE,
  
  reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_decision VARCHAR(50) CHECK (review_decision IN ('approved', 'rejected', 'needs_revision')),
  review_comments TEXT,
  
  -- Approval & Publishing
  approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_decision VARCHAR(50) CHECK (approved_decision IN ('auto_approved', 'manually_approved', 'rejected')),
  approval_reason TEXT,
  
  published_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timeline & SLA
  submission_to_approval_hours NUMERIC(10, 2), -- SLA tracking
  approval_to_publish_hours NUMERIC(10, 2),
  
  -- Rejection Reason (if rejected)
  rejection_reason VARCHAR(50) CHECK (rejection_reason IN (
    'spam',                 -- Spam/inappropriate content
    'duplicate',            -- Duplicate article
    'low_quality',         -- Poor writing quality
    'misinformation',      -- Contains false information
    'biased',              -- Biased/editorial content
    'off_topic',           -- Off-topic content
    'incomplete',          -- Incomplete article
    'other'
  )),
  rejection_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_submissions_article_id ON article_submissions(article_id);
CREATE INDEX idx_submissions_source_id ON article_submissions(source_id);
CREATE INDEX idx_submissions_status ON article_submissions(status);
CREATE INDEX idx_submissions_submitted_by ON article_submissions(submitted_by_user_id);
CREATE INDEX idx_submissions_assigned_to ON article_submissions(assigned_to_user_id) WHERE assigned_to_user_id IS NOT NULL;
CREATE INDEX idx_submissions_submitted_at ON article_submissions(submitted_at DESC);
CREATE INDEX idx_submissions_ai_validation ON article_submissions(ai_validation_status) WHERE ai_validation_status IS NOT NULL;

CREATE TRIGGER submissions_updated_at BEFORE UPDATE ON article_submissions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

---

### 2.2 Submission Workflow History (Detailed Tracking)

```sql
CREATE TABLE article_submission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  submission_id UUID NOT NULL REFERENCES article_submissions(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  
  -- Workflow Event
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'submitted',           -- Article submitted
    'ai_validation_start', -- AI validation started
    'ai_validation_complete',
    'assigned',            -- Assigned to reviewer
    'review_started',      -- Review started
    'review_completed',    -- Review completed
    'approved',            -- Article approved
    'rejected',            -- Article rejected
    'published',           -- Article published
    'archived',            -- Article archived
    'commented',           -- Comment added
    'reassigned'           -- Reassigned to different reviewer
  )),
  
  -- Transition Details
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  
  -- Actor
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_role VARCHAR(50), -- 'system', 'ai', 'editor', 'reviewer', 'admin'
  
  -- Event Notes
  notes TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_history_submission_id ON article_submission_history(submission_id);
CREATE INDEX idx_history_event_type ON article_submission_history(event_type);
CREATE INDEX idx_history_created_at ON article_submission_history(created_at DESC);
```

---

## SECTION 3: APPROVAL WORKFLOW LOGIC

### 3.1 Submission Status Workflow State Machine

```sql
-- Workflow State Transitions (Validation)
CREATE TABLE submission_workflow_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source-specific rules
  source_id UUID REFERENCES article_sources(id) ON DELETE CASCADE,
  
  -- Workflow Rule
  from_status VARCHAR(50) NOT NULL,
  to_status VARCHAR(50) NOT NULL,
  
  -- Conditions for transition
  requires_role VARCHAR(50), -- 'editor', 'reviewer', 'admin'
  requires_ai_validation BOOLEAN DEFAULT FALSE,
  ai_confidence_minimum NUMERIC(5, 4),
  
  -- Rule is active
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(source_id, from_status, to_status)
);

-- Standard workflow rules
INSERT INTO submission_workflow_rules (id, source_id, from_status, to_status, requires_role, requires_ai_validation) VALUES
  -- Wire agencies (trusted) - auto validate
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'AFP'), 'submitted', 'ai_validating', 'system', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'AFP'), 'ai_validating', 'approved', 'system', TRUE),
  
  -- Staff reporters - quick approval
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'STAFF'), 'submitted', 'ai_validating', 'system', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'STAFF'), 'ai_validating', 'pending_approval', 'system', TRUE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'STAFF'), 'pending_approval', 'approved', 'editor', FALSE),
  
  -- Freelancers - full review
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'FREELANCE'), 'submitted', 'ai_validating', 'system', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'FREELANCE'), 'ai_validating', 'under_review', 'system', TRUE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'FREELANCE'), 'under_review', 'pending_approval', 'editor', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'FREELANCE'), 'pending_approval', 'approved', 'reviewer', FALSE),
  
  -- Public submissions - strict review
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'PUBLIC'), 'submitted', 'ai_validating', 'system', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'PUBLIC'), 'ai_validating', 'flagged', 'system', TRUE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'PUBLIC'), 'flagged', 'under_review', 'admin', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'PUBLIC'), 'under_review', 'pending_approval', 'editor', FALSE),
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'PUBLIC'), 'pending_approval', 'approved', 'reviewer', FALSE);
```

---

### 3.2 AI Validation Integration (Approval Logic)

```sql
CREATE TABLE ai_validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source-specific AI rules
  source_id UUID REFERENCES article_sources(id) ON DELETE CASCADE,
  
  -- Validation Thresholds
  validation_type VARCHAR(50) NOT NULL CHECK (validation_type IN (
    'fact_check',
    'grammar_quality',
    'plagiarism_detection',
    'bias_detection',
    'spam_detection'
  )),
  
  -- Decision Logic
  confidence_threshold NUMERIC(5, 4), -- Minimum confidence for GREEN
  yellow_threshold NUMERIC(5, 4),     -- Between yellow and red
  
  -- Actions based on result
  on_green_action VARCHAR(50) DEFAULT 'auto_approve' CHECK (on_green_action IN (
    'auto_approve',        -- Auto-publish if confidence > threshold
    'queue_for_review',    -- Queue for manual review
    'require_approval'     -- Require manual approval
  )),
  
  on_yellow_action VARCHAR(50) DEFAULT 'queue_for_review' CHECK (on_yellow_action IN (
    'auto_approve',
    'queue_for_review',
    'require_approval',
    'flag_for_review'
  )),
  
  on_red_action VARCHAR(50) DEFAULT 'require_approval' CHECK (on_red_action IN (
    'auto_approve',
    'queue_for_review',
    'require_approval',
    'reject'
  )),
  
  on_black_action VARCHAR(50) DEFAULT 'reject' CHECK (on_black_action IN (
    'auto_approve',
    'queue_for_review',
    'require_approval',
    'reject'
  )),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(source_id, validation_type)
);

-- Standard AI validation rules
INSERT INTO ai_validation_rules (
  id, source_id, validation_type, confidence_threshold, yellow_threshold, 
  on_green_action, on_yellow_action, on_red_action, on_black_action
) VALUES
  -- Wire agencies: Strict but auto-approve if valid
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'AFP'), 'fact_check', 0.90, 0.70, 'auto_approve', 'queue_for_review', 'require_approval', 'reject'),
  
  -- Staff reporters: Balanced approach
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'STAFF'), 'fact_check', 0.85, 0.65, 'queue_for_review', 'queue_for_review', 'require_approval', 'reject'),
  
  -- Freelancers: Conservative
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'FREELANCE'), 'fact_check', 0.80, 0.60, 'queue_for_review', 'require_approval', 'require_approval', 'reject'),
  
  -- Public submissions: Very strict
  (gen_random_uuid(), (SELECT id FROM article_sources WHERE code = 'PUBLIC'), 'fact_check', 0.95, 0.85, 'queue_for_review', 'require_approval', 'require_approval', 'reject');
```

---

## SECTION 4: APPROVAL WORKFLOW PROCEDURES

### 4.1 Automatic Approval Procedure

```sql
CREATE OR REPLACE FUNCTION approve_article_if_eligible()
RETURNS void AS $$
DECLARE
  v_submission RECORD;
  v_source RECORD;
  v_validation RECORD;
  v_should_approve BOOLEAN := FALSE;
  v_next_status VARCHAR(50);
BEGIN
  -- Find submissions ready for auto-approval
  FOR v_submission IN
    SELECT 
      asub.id, asub.article_id, asub.source_id,
      asub.ai_validation_result, asub.ai_confidence_score, asub.status
    FROM article_submissions asub
    WHERE asub.status IN ('ai_validating', 'pending_approval')
      AND asub.ai_validation_status = 'completed'
      AND asub.ai_validation_result = 'green'
      AND asub.ai_confidence_score >= 0.85
  LOOP
    -- Get source info
    SELECT * INTO v_source FROM article_sources WHERE id = v_submission.source_id;
    
    -- Check AI validation rules
    SELECT avr.on_green_action INTO v_next_status
    FROM ai_validation_rules avr
    WHERE avr.source_id = v_submission.source_id
      AND avr.validation_type = 'fact_check'
      AND avr.is_active = TRUE;
    
    -- If auto_approve, do it
    IF v_next_status = 'auto_approve' THEN
      UPDATE article_submissions
      SET 
        status = 'approved',
        approved_by_user_id = NULL, -- System approval
        approved_at = CURRENT_TIMESTAMP,
        approved_decision = 'auto_approved',
        approval_reason = 'Auto-approved by AI validation (confidence: ' || v_submission.ai_confidence_score || ')',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = v_submission.id;
      
      -- Log the event
      INSERT INTO article_submission_history (
        submission_id, article_id, event_type, previous_status, new_status,
        actor_user_id, actor_role, notes, metadata
      ) VALUES (
        v_submission.id,
        v_submission.article_id,
        'approved',
        v_submission.status,
        'approved',
        NULL,
        'ai',
        'Automatically approved by Groq AI validation',
        jsonb_build_object('confidence_score', v_submission.ai_confidence_score)
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run auto-approval check (call periodically, e.g., every 5 minutes)
SELECT approve_article_if_eligible();
```

---

### 4.2 Route Article to Reviewer (Manual Review)

```sql
CREATE OR REPLACE FUNCTION route_to_reviewer(
  p_submission_id UUID,
  p_reviewer_user_id UUID,
  p_priority VARCHAR(50) DEFAULT 'normal'
)
RETURNS void AS $$
DECLARE
  v_submission RECORD;
BEGIN
  -- Get submission
  SELECT * INTO v_submission FROM article_submissions WHERE id = p_submission_id;
  
  IF v_submission IS NULL THEN
    RAISE EXCEPTION 'Submission not found: %', p_submission_id;
  END IF;
  
  -- Update assignment
  UPDATE article_submissions
  SET 
    status = 'under_review',
    assigned_to_user_id = p_reviewer_user_id,
    assigned_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_submission_id;
  
  -- Log event
  INSERT INTO article_submission_history (
    submission_id, article_id, event_type, previous_status, new_status,
    actor_user_id, actor_role, notes, metadata
  ) VALUES (
    p_submission_id,
    v_submission.article_id,
    'assigned',
    v_submission.status,
    'under_review',
    get_audit_user_id(),
    'editor',
    'Article routed to reviewer',
    jsonb_build_object('reviewer_id', p_reviewer_user_id, 'priority', p_priority)
  );
END;
$$ LANGUAGE plpgsql;
```

---

### 4.3 Reviewer Approval/Rejection

```sql
CREATE OR REPLACE FUNCTION review_article(
  p_submission_id UUID,
  p_decision VARCHAR(50), -- 'approved' or 'rejected'
  p_comments TEXT,
  p_rejection_reason VARCHAR(50) DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_submission RECORD;
  v_new_status VARCHAR(50);
BEGIN
  -- Get submission
  SELECT * INTO v_submission FROM article_submissions WHERE id = p_submission_id;
  
  IF v_submission IS NULL THEN
    RAISE EXCEPTION 'Submission not found: %', p_submission_id;
  END IF;
  
  -- Determine new status
  IF p_decision = 'approved' THEN
    v_new_status := 'pending_approval'; -- Goes to final approver
  ELSIF p_decision = 'rejected' THEN
    v_new_status := 'rejected'; -- Final state
  ELSE
    RAISE EXCEPTION 'Invalid decision: %', p_decision;
  END IF;
  
  -- Update submission
  UPDATE article_submissions
  SET 
    status = v_new_status,
    reviewed_by_user_id = get_audit_user_id(),
    reviewed_at = CURRENT_TIMESTAMP,
    review_decision = p_decision,
    review_comments = p_comments,
    rejection_reason = p_rejection_reason,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_submission_id;
  
  -- Log event
  INSERT INTO article_submission_history (
    submission_id, article_id, event_type, previous_status, new_status,
    actor_user_id, actor_role, notes, metadata
  ) VALUES (
    p_submission_id,
    v_submission.article_id,
    'review_completed',
    v_submission.status,
    v_new_status,
    get_audit_user_id(),
    'editor',
    'Review: ' || p_decision || ' - ' || COALESCE(p_comments, ''),
    jsonb_build_object('rejection_reason', p_rejection_reason)
  );
  
  -- If rejected, also update article status
  IF p_decision = 'rejected' THEN
    UPDATE articles
    SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
    WHERE id = v_submission.article_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

### 4.4 Final Approval & Publish

```sql
CREATE OR REPLACE FUNCTION approve_and_publish(
  p_submission_id UUID,
  p_publish_immediately BOOLEAN DEFAULT TRUE
)
RETURNS void AS $$
DECLARE
  v_submission RECORD;
  v_article RECORD;
BEGIN
  -- Get submission and article
  SELECT * INTO v_submission FROM article_submissions WHERE id = p_submission_id;
  SELECT * INTO v_article FROM articles WHERE id = v_submission.article_id;
  
  IF v_submission IS NULL THEN
    RAISE EXCEPTION 'Submission not found: %', p_submission_id;
  END IF;
  
  -- Approve
  UPDATE article_submissions
  SET 
    status = 'approved',
    approved_by_user_id = get_audit_user_id(),
    approved_at = CURRENT_TIMESTAMP,
    approved_decision = 'manually_approved',
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_submission_id;
  
  -- Publish if requested
  IF p_publish_immediately THEN
    UPDATE articles
    SET 
      status = 'published',
      published_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = v_submission.article_id;
    
    UPDATE article_submissions
    SET 
      status = 'published',
      published_by_user_id = get_audit_user_id(),
      published_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = p_submission_id;
  END IF;
  
  -- Log event
  INSERT INTO article_submission_history (
    submission_id, article_id, event_type, previous_status, new_status,
    actor_user_id, actor_role, notes
  ) VALUES (
    p_submission_id,
    v_submission.article_id,
    CASE WHEN p_publish_immediately THEN 'published' ELSE 'approved' END,
    v_submission.status,
    CASE WHEN p_publish_immediately THEN 'published' ELSE 'approved' END,
    get_audit_user_id(),
    'admin',
    CASE WHEN p_publish_immediately THEN 'Article approved and published' ELSE 'Article approved for publication' END
  );
END;
$$ LANGUAGE plpgsql;
```

---

## SECTION 5: ARTICLE SUBMISSION QUERIES

### 5.1 Pending Review Dashboard

```sql
-- Get all pending articles awaiting review
SELECT 
  asub.id as submission_id,
  a.title,
  a.slug,
  asrc.name as source_name,
  u.display_name as submitted_by,
  asub.submitted_at,
  asub.status,
  asub.ai_validation_result,
  asub.ai_confidence_score,
  assigned_user.display_name as assigned_to,
  EXTRACT(HOUR FROM CURRENT_TIMESTAMP - asub.submitted_at) as hours_pending
FROM article_submissions asub
JOIN articles a ON asub.article_id = a.id
JOIN article_sources asrc ON asub.source_id = asrc.id
JOIN users u ON asub.submitted_by_user_id = u.id
LEFT JOIN users assigned_user ON asub.assigned_to_user_id = assigned_user.id
WHERE asub.status IN ('submitted', 'under_review', 'ai_validating', 'pending_approval')
ORDER BY 
  CASE asub.status 
    WHEN 'pending_approval' THEN 1
    WHEN 'under_review' THEN 2
    WHEN 'ai_validating' THEN 3
    ELSE 4
  END,
  asub.submitted_at ASC;
```

---

### 5.2 Source Performance Analytics

```sql
-- Analyze submission patterns by source
SELECT 
  asrc.name as source,
  asrc.source_type,
  COUNT(*) as total_submissions,
  COUNT(*) FILTER (WHERE asub.status = 'published') as published,
  COUNT(*) FILTER (WHERE asub.status = 'rejected') as rejected,
  ROUND(
    COUNT(*) FILTER (WHERE asub.status = 'published')::NUMERIC / 
    COUNT(*) * 100, 
    2
  ) as publish_rate,
  AVG(asub.ai_confidence_score) as avg_confidence,
  AVG(EXTRACT(HOUR FROM asub.approved_at - asub.submitted_at)) as avg_approval_hours
FROM article_submissions asub
JOIN article_sources asrc ON asub.source_id = asrc.id
WHERE asub.submitted_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY asrc.id, asrc.name, asrc.source_type
ORDER BY total_submissions DESC;
```

---

### 5.3 Reviewer Performance Metrics

```sql
-- Track reviewer performance
SELECT 
  u.display_name as reviewer,
  COUNT(*) as articles_reviewed,
  COUNT(*) FILTER (WHERE ash.event_type = 'review_completed') as completed_reviews,
  COUNT(*) FILTER (WHERE ash.new_status = 'approved') as approved,
  COUNT(*) FILTER (WHERE ash.new_status = 'rejected') as rejected,
  ROUND(
    COUNT(*) FILTER (WHERE ash.new_status = 'approved')::NUMERIC / 
    COUNT(*) FILTER (WHERE ash.event_type = 'review_completed') * 100, 
    2
  ) as approval_rate,
  AVG(EXTRACT(HOUR FROM ash.created_at - 
    (SELECT created_at FROM article_submission_history 
     WHERE submission_id = ash.submission_id 
     AND event_type = 'assigned' 
     ORDER BY created_at DESC LIMIT 1)
  )) as avg_review_time_hours
FROM article_submission_history ash
JOIN users u ON ash.actor_user_id = u.id
WHERE ash.event_type IN ('review_completed', 'assigned')
  AND ash.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY u.id, u.display_name
ORDER BY articles_reviewed DESC;
```

---

## SECTION 6: COMPLETE SUBMISSION WORKFLOW EXAMPLE

### 6.1 End-to-End Workflow Example

```
STEP 1: ARTICLE SUBMISSION (Wire Agency - AFP)
├─ Article received from AFP wire
├─ INSERT articles + article_submissions
├─ source_id = AFP UUID
├─ submitted_by_user_id = Reuters_feed_user
├─ status = 'submitted'
└─ submission_timestamp = NOW()

STEP 2: AUTOMATIC AI VALIDATION
├─ Groq LLM validates content
├─ Result: GREEN (95% confidence)
├─ UPDATE article_submissions
│  ├─ ai_validation_status = 'completed'
│  ├─ ai_validation_result = 'green'
│  └─ ai_confidence_score = 0.95
└─ Call approve_article_if_eligible()

STEP 3: AUTO-APPROVAL (AFP Trust Score = 95)
├─ AI rules: GREEN + confidence > 0.90 = auto_approve
├─ UPDATE article_submissions
│  ├─ status = 'approved'
│  ├─ approved_by_user_id = NULL (system)
│  ├─ approved_decision = 'auto_approved'
│  └─ approved_at = NOW()
└─ INSERT article_submission_history (event: 'approved')

STEP 4: IMMEDIATE PUBLISH
├─ Call approve_and_publish(submission_id, TRUE)
├─ UPDATE articles
│  ├─ status = 'published'
│  ├─ published_at = NOW()
│  └─ view_count = 0
├─ UPDATE article_submissions
│  ├─ status = 'published'
│  └─ published_at = NOW()
└─ INSERT article_submission_history (event: 'published')

RESULT: Article live within 5-10 seconds of reception!
```

### 6.2 Complex Workflow Example (Freelancer)

```
STEP 1: ARTICLE SUBMISSION (Freelancer)
├─ Freelancer submits article
├─ status = 'submitted'
└─ Trust score = 50 (requires review)

STEP 2: AI VALIDATION
├─ Groq validates: YELLOW (72% confidence)
├─ ai_validation_result = 'yellow'
└─ on_yellow_action = 'require_approval'

STEP 3: ASSIGN TO REVIEWER
├─ Route to available editor
├─ status = 'under_review'
├─ assigned_to_user_id = editor_uuid
└─ INSERT event: 'assigned'

STEP 4: EDITOR REVIEW
├─ Editor reads article
├─ Finds minor grammar issues
├─ Calls review_article(submission_id, 'approved', 'Fixed typos')
├─ status = 'pending_approval'
└─ INSERT event: 'review_completed'

STEP 5: ADMIN FINAL APPROVAL
├─ Admin reviews editor feedback
├─ Calls approve_and_publish(submission_id, TRUE)
├─ status = 'published'
└─ Live on website

Timeline: ~30 minutes for full workflow
```

---

## SECTION 7: SOURCE MASTER DATA & CONFIGURATION

### 7.1 Initialize Source Settings

```sql
-- Update default sources with real settings

UPDATE article_sources
SET 
  requires_manual_approval = FALSE,
  ai_validation_required = TRUE,
  auto_publish_enabled = TRUE,
  confidence_threshold = 0.90,
  auto_publish_conditions = jsonb_build_object(
    'min_confidence', 0.90,
    'required_validations', jsonb_build_array('fact_check', 'grammar'),
    'max_hours_to_publish', 1
  )
WHERE code IN ('AFP', 'ANI', 'PTI', 'REUTERS');

-- Freelancers: require manual approval
UPDATE article_sources
SET 
  requires_manual_approval = TRUE,
  ai_validation_required = TRUE,
  auto_publish_enabled = FALSE,
  confidence_threshold = 0.80,
  default_category_id = (SELECT id FROM categories WHERE slug = 'contributed' LIMIT 1),
  trust_score = 50
WHERE code = 'FREELANCE';

-- Staff reporters: balanced approach
UPDATE article_sources
SET 
  requires_manual_approval = TRUE,
  ai_validation_required = TRUE,
  auto_publish_enabled = FALSE,
  confidence_threshold = 0.85,
  trust_score = 90
WHERE code = 'STAFF';

-- Public submissions: strict review
UPDATE article_sources
SET 
  requires_manual_approval = TRUE,
  ai_validation_required = TRUE,
  auto_publish_enabled = FALSE,
  confidence_threshold = 0.95,
  trust_score = 20,
  daily_submission_limit = 5,
  monthly_submission_limit = 50
WHERE code = 'PUBLIC';
```

---

## SECTION 8: MONITORING & ALERTS

### 8.1 SLA Monitoring

```sql
-- Alert if article pending approval > 4 hours
SELECT 
  asub.id,
  a.title,
  asrc.name as source,
  EXTRACT(HOUR FROM CURRENT_TIMESTAMP - asub.submitted_at) as hours_pending,
  'ALERT: Article pending > 4 hours' as alert_message
FROM article_submissions asub
JOIN articles a ON asub.article_id = a.id
JOIN article_sources asrc ON asub.source_id = asrc.id
WHERE asub.status IN ('pending_approval', 'under_review')
  AND EXTRACT(HOUR FROM CURRENT_TIMESTAMP - asub.submitted_at) > 4
ORDER BY asub.submitted_at ASC;
```

---

## SUMMARY

**Article Source & Workflow System Features:**

✅ **Source Master:** 9 predefined sources with customizable settings  
✅ **Submission Tracking:** Complete history of every submission  
✅ **AI Validation:** Groq integration with confidence scoring  
✅ **Approval Workflow:** 4-level approval system with role-based access  
✅ **Automatic Approval:** Auto-publish trusted sources (GREEN, >85% confidence)  
✅ **Manual Review:** Customizable review process for each source  
✅ **Audit Trail:** Complete history of all workflow events  
✅ **SLA Tracking:** Monitor approval times and identify bottlenecks  
✅ **Source Analytics:** Performance metrics for each source  
✅ **Rejection Handling:** Track rejection reasons for quality improvement  

---

**Article Source & Workflow System Status:** ✅ COMPLETE  
**Ready for:** Implementation with Strapi CMS  
**Integration Points:** Groq AI, article submissions, user roles, audit system

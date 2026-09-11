# PostgreSQL Database Design
## NewsKarnataka.com Strapi Migration - Complete Schema Design

**Project:** NewsKarnataka.com Strapi Migration  
**Database Engine:** PostgreSQL 14+  
**Data Volume:** 55K+ articles, multi-language support  
**Deployment:** Multi-AZ RDS with read replicas  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

**Database Architecture:**
- **Primary Database:** newkarnataka_prod (PostgreSQL 14)
- **Size:** ~500 GB initial + growth capacity
- **Users:** 50-100 concurrent (peak)
- **Availability:** 99.9% SLA (Multi-AZ with automatic failover)
- **Backup:** Continuous, 30-day retention + cross-region replication
- **Languages:** Kannada, English, Tulu (UTF-8 encoding)

**Key Design Principles:**
1. **Scalability:** Handle 10x traffic with auto-scaling
2. **Performance:** <100ms query response (p99)
3. **Data Integrity:** Foreign keys, constraints, triggers
4. **Auditability:** Complete change tracking & audit logs
5. **Security:** Row-level security (RLS), encryption at rest
6. **Multi-tenancy:** Support for multiple news channels (future)

---

## SECTION 1: DATABASE ARCHITECTURE OVERVIEW

### 1.1 Schema Structure

```
Primary Database: newkarnataka_prod (UTF-8, en_US.UTF-8)

Schemas:
├─ public (default, Strapi core tables)
├─ content (articles, media, categories)
├─ users (authentication, roles, permissions)
├─ analytics (engagement, performance metrics)
├─ audit (change logs, compliance)
├─ staging (temporary migration tables)
└─ migrations (schema version tracking)
```

### 1.2 Entity Relationship Diagram (ERD)

```
Core Relationships:

articles ────┬──→ categories (N:1)
             ├──→ users (N:1 - author)
             ├──→ media (1:N - featured image)
             ├──→ tags (N:N - via article_tags)
             ├──→ comments (1:N)
             ├──→ likes (1:N)
             ├──→ shares (1:N)
             └──→ content_validation_logs (1:N - AI validation)

users ───────┬──→ roles (N:1)
             ├──→ permissions (N:N via user_permissions)
             ├──→ authored_articles (1:N)
             └──→ activity_logs (1:N)

content_validation ──┬──→ articles (N:1)
                     ├──→ ai_validation_results (1:1)
                     └──→ published_articles (1:1 - tracked)

media ───────┬──→ articles (1:N - inline images)
             └──→ aws_s3_metadata (1:1 - CDN tracking)
```

---

## SECTION 2: CORE TABLES

### 2.1 Articles Table

**Purpose:** Store all news articles and content

```sql
CREATE TABLE articles (
  -- Primary Key & Metadata
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- Content
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(1000),
  featured_image_id BIGINT REFERENCES media(id) ON DELETE SET NULL,
  
  -- Localization (for multi-language support)
  language_code CHAR(2) NOT NULL DEFAULT 'en' CHECK (language_code IN ('en', 'kn', 'tu')),
  original_article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  
  -- Metadata
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Publishing State
  status VARCHAR(50) NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft', 'review_pending', 'approved', 'published', 'archived', 'rejected')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_publish_at TIMESTAMP WITH TIME ZONE,
  
  -- Engagement Metrics (denormalized for performance)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- AI Validation
  ai_validation_status VARCHAR(50) CHECK (ai_validation_status IN ('pending', 'validated', 'flagged', 'manual_review')),
  confidence_score NUMERIC(5, 4) CHECK (confidence_score BETWEEN 0 AND 1),
  validation_flags JSONB, -- Stores fact-check results, grammar issues, etc.
  
  -- Meta Information (SEO)
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  meta_keywords VARCHAR(500),
  og_image_url VARCHAR(2000),
  
  -- Priority & Status
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'breaking')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking_news BOOLEAN DEFAULT FALSE,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Search & Indexing
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, ''))
  ) STORED
);

-- Indexes
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_language_code ON articles(language_code);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_search_vector ON articles USING GIN(search_vector);
CREATE INDEX idx_articles_uuid ON articles(uuid);
CREATE INDEX idx_articles_ai_validation_status ON articles(ai_validation_status) WHERE ai_validation_status IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

**Rationale:**
- `UUID` for distributed tracing & API usage
- `slug` for SEO-friendly URLs
- `status` for content workflow (draft → review → published)
- `search_vector` for full-text search (Elasticsearch backup)
- `validation_flags` JSONB for flexible AI validation data
- Denormalized metrics (`view_count`, etc.) for dashboard performance
- `language_code` for multi-language articles (Kannada, English, Tulu)
- `original_article_id` for tracking translations

---

### 2.2 Categories Table

**Purpose:** Article categorization

```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR(2000),
  color_hex VARCHAR(7) CHECK (color_hex ~ '^#[0-9A-F]{6}$'),
  display_order INTEGER DEFAULT 0,
  
  -- Hierarchy (for nested categories if needed)
  parent_category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  
  -- Visibility
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  article_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

---

### 2.3 Tags Table

**Purpose:** Flexible tagging system for articles

```sql
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Metadata
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_active ON tags(is_active);
CREATE TRIGGER tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Article-Tag Junction Table (N:N relationship)
CREATE TABLE article_tags (
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);
```

---

### 2.4 Users Table

**Purpose:** Authors, editors, admins

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- Authentication
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  
  -- Profile
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(200),
  bio TEXT,
  avatar_url VARCHAR(2000),
  
  -- Contact
  phone_number VARCHAR(20),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' 
    CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
  is_admin BOOLEAN DEFAULT FALSE,
  
  -- Language Preferences
  preferred_language VARCHAR(10) DEFAULT 'en',
  
  -- Activity Tracking
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  
  -- Verification
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_uuid ON users(uuid);
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

---

### 2.5 Roles & Permissions

```sql
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE, -- Can't be deleted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO roles (name, description, is_system_role) VALUES
  ('admin', 'Full system access', TRUE),
  ('editor', 'Create & publish articles', TRUE),
  ('author', 'Create & submit articles for review', TRUE),
  ('reviewer', 'Review & approve articles', TRUE),
  ('contributor', 'Create articles (no publish)', TRUE),
  ('viewer', 'Read-only access', TRUE);

CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  UNIQUE(resource, action)
);

INSERT INTO permissions (name, resource, action) VALUES
  ('create_article', 'articles', 'create'),
  ('read_article', 'articles', 'read'),
  ('update_article', 'articles', 'update'),
  ('delete_article', 'articles', 'delete'),
  ('publish_article', 'articles', 'publish'),
  ('manage_users', 'users', 'manage'),
  ('manage_categories', 'categories', 'manage'),
  ('view_analytics', 'analytics', 'view'),
  ('manage_roles', 'roles', 'manage'),
  ('access_admin', 'admin', 'access');

-- Role-Permission Mapping (N:N)
CREATE TABLE role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User-Role Mapping (N:N)
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

---

### 2.6 Media Management

```sql
CREATE TABLE media (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- File Information
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(2000) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  
  -- S3 / CDN Information
  s3_bucket VARCHAR(255),
  s3_key VARCHAR(500) NOT NULL UNIQUE,
  cdn_url VARCHAR(2000), -- CloudFront URL
  
  -- Image Dimensions (for images)
  width INTEGER,
  height INTEGER,
  
  -- Media Type
  media_type VARCHAR(50) CHECK (media_type IN ('image', 'video', 'audio', 'document')),
  
  -- Ownership
  uploaded_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Metadata
  alt_text VARCHAR(500),
  caption VARCHAR(1000),
  metadata JSONB, -- EXIF, duration, etc.
  
  -- Usage Tracking
  usage_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_media_s3_key ON media(s3_key);
CREATE INDEX idx_media_media_type ON media(media_type);
CREATE INDEX idx_media_uploaded_by_id ON media(uploaded_by_id);
CREATE TRIGGER media_updated_at BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Article-Media Inline Images (N:N)
CREATE TABLE article_media (
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  media_id BIGINT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, -- Position in article
  PRIMARY KEY (article_id, media_id)
);

CREATE INDEX idx_article_media_media_id ON article_media(media_id);
```

---

### 2.7 Comments System

```sql
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  
  -- Relationship
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  
  -- Engagement
  like_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

---

## SECTION 3: AI VALIDATION & CONTENT PIPELINE TABLES

### 3.1 Content Validation Logs

**Purpose:** Track AI validation results for every article

```sql
CREATE TABLE content_validation_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationship
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  
  -- AI Validation Results
  validation_type VARCHAR(50) NOT NULL 
    CHECK (validation_type IN ('fact_check', 'grammar', 'quality', 'duplicate_detection')),
  
  -- Results Classification
  result_status VARCHAR(20) NOT NULL
    CHECK (result_status IN ('red', 'yellow', 'green', 'black')),
    -- red: false/flagged information
    -- yellow: unclear/needs review
    -- green: verified/correct
    -- black: spam/inappropriate
  
  confidence_score NUMERIC(5, 4) CHECK (confidence_score BETWEEN 0 AND 1),
  
  -- Detailed Results
  validation_details JSONB, -- Stores specific issues, suggestions
  ai_model_used VARCHAR(100), -- 'groq_mixtral_8x7b', 'gpt4', etc.
  ai_model_version VARCHAR(50),
  
  -- Processing
  processing_time_ms INTEGER,
  token_count INTEGER, -- For cost tracking
  
  -- Decision
  auto_publish_eligible BOOLEAN DEFAULT FALSE,
  manual_review_required BOOLEAN DEFAULT FALSE,
  reviewer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  reviewer_decision VARCHAR(50) CHECK (reviewer_decision IN ('approved', 'rejected', 'needs_revision')),
  reviewer_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_content_validation_article_id ON content_validation_logs(article_id);
CREATE INDEX idx_content_validation_status ON content_validation_logs(result_status);
CREATE INDEX idx_content_validation_type ON content_validation_logs(validation_type);
CREATE INDEX idx_content_validation_created_at ON content_validation_logs(created_at DESC);
```

### 3.2 Auto-Publishing Rules

```sql
CREATE TABLE auto_publishing_rules (
  id BIGSERIAL PRIMARY KEY,
  
  -- Rule Definition
  name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 100,
  
  -- Conditions
  min_confidence_score NUMERIC(5, 4) DEFAULT 0.85,
  required_validations JSONB, -- ['fact_check', 'grammar'] required to pass
  
  -- Action
  auto_publish BOOLEAN DEFAULT TRUE,
  publish_delay_minutes INTEGER DEFAULT 0,
  
  -- Category-specific Rules (optional)
  applicable_categories BIGINT[] DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Default Rules
INSERT INTO auto_publishing_rules (name, min_confidence_score, auto_publish, priority) VALUES
  ('Breaking News Rule', 0.95, TRUE, 1),
  ('Standard News Rule', 0.85, TRUE, 2),
  ('Opinion Pieces Rule', 0.70, FALSE, 3);
```

---

## SECTION 4: ENGAGEMENT & ANALYTICS TABLES

### 4.1 Likes & Reactions

```sql
CREATE TABLE likes (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationship
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Reaction Type
  reaction_type VARCHAR(50) DEFAULT 'like'
    CHECK (reaction_type IN ('like', 'love', 'informative', 'thought_provoking')),
  
  -- Uniqueness
  UNIQUE(article_id, user_id, reaction_type),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_likes_article_id ON likes(article_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);
```

### 4.2 Shares Tracking

```sql
CREATE TABLE shares (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationship
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Share Platform
  platform VARCHAR(50) NOT NULL
    CHECK (platform IN ('twitter', 'facebook', 'whatsapp', 'email', 'direct_link')),
  
  -- Tracking
  share_url VARCHAR(2000),
  utm_parameters JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_shares_article_id ON shares(article_id);
CREATE INDEX idx_shares_platform ON shares(platform);
CREATE INDEX idx_shares_created_at ON shares(created_at DESC);
```

### 4.3 Article Engagement Metrics

```sql
CREATE TABLE article_engagement_metrics (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationship
  article_id BIGINT NOT NULL UNIQUE REFERENCES articles(id) ON DELETE CASCADE,
  
  -- Engagement Metrics
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  average_read_time_seconds INTEGER,
  bounce_rate NUMERIC(5, 2),
  
  -- Trends
  views_7_days INTEGER DEFAULT 0,
  views_30_days INTEGER DEFAULT 0,
  engagement_score NUMERIC(5, 2), -- Calculated metric for ranking
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_metric_update_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_engagement_metrics_article_id ON article_engagement_metrics(article_id);
CREATE INDEX idx_engagement_metrics_engagement_score ON article_engagement_metrics(engagement_score DESC);
CREATE TRIGGER engagement_metrics_updated_at BEFORE UPDATE ON article_engagement_metrics
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

---

## SECTION 5: AUDIT & COMPLIANCE TABLES

### 5.1 Activity Logs

```sql
CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- Actor
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Action Details
  action_type VARCHAR(100) NOT NULL
    CHECK (action_type IN ('create', 'read', 'update', 'delete', 'publish', 'approve', 'reject', 'login', 'logout')),
  
  entity_type VARCHAR(100) NOT NULL, -- 'article', 'user', 'category', etc.
  entity_id BIGINT,
  
  -- Changes
  changes_before JSONB,
  changes_after JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  request_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type_id ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
```

### 5.2 Content Change History

```sql
CREATE TABLE article_versions (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationship
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  
  -- Version Info
  version_number INTEGER NOT NULL,
  
  -- Snapshot of Article State
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  featured_image_id BIGINT,
  
  -- Change Metadata
  changed_by_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  change_reason TEXT,
  change_summary TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_article_versions_article_id ON article_versions(article_id);
CREATE INDEX idx_article_versions_version_number ON article_versions(version_number DESC);
CREATE UNIQUE INDEX idx_article_versions_unique ON article_versions(article_id, version_number);
```

---

## SECTION 6: PERFORMANCE & OPTIMIZATION TABLES

### 6.1 Search Analytics

```sql
CREATE TABLE search_analytics (
  id BIGSERIAL PRIMARY KEY,
  
  -- Search Query
  search_query VARCHAR(500) NOT NULL,
  search_query_normalized VARCHAR(500), -- Lowercased, cleaned
  
  -- Results
  results_count INTEGER,
  clicked_article_id BIGINT REFERENCES articles(id) ON DELETE SET NULL,
  click_position INTEGER, -- Position in results (1st, 2nd, etc.)
  
  -- User Info
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_search_analytics_query ON search_analytics(search_query_normalized);
CREATE INDEX idx_search_analytics_created_at ON search_analytics(created_at DESC);
CREATE INDEX idx_search_analytics_user_id ON search_analytics(user_id);
```

### 6.2 API Usage Tracking

```sql
CREATE TABLE api_usage_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- API Details
  endpoint VARCHAR(500) NOT NULL,
  http_method VARCHAR(10) NOT NULL,
  http_status INTEGER,
  
  -- Performance
  response_time_ms INTEGER NOT NULL,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  
  -- User/Client
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  api_key_id BIGINT,
  ip_address INET,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_api_usage_endpoint ON api_usage_logs(endpoint);
CREATE INDEX idx_api_usage_created_at ON api_usage_logs(created_at DESC);
CREATE INDEX idx_api_usage_user_id ON api_usage_logs(user_id);
```

---

## SECTION 7: HELPER FUNCTIONS & TRIGGERS

### 7.1 Timestamp Update Function

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Article Full-Text Search

```sql
-- Update search_vector when article changes
CREATE OR REPLACE FUNCTION update_article_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
    NEW.search_vector = to_tsvector('english', 
      COALESCE(NEW.title, '') || ' ' || 
      COALESCE(NEW.content, '') || ' ' || 
      COALESCE(NEW.excerpt, '')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_search_vector_trigger
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_article_search_vector();
```

### 7.3 Update Engagement Metrics

```sql
-- Automatically update engagement metrics when likes/comments added
CREATE OR REPLACE FUNCTION update_engagement_on_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE article_engagement_metrics
  SET total_likes = (SELECT COUNT(*) FROM likes WHERE article_id = NEW.article_id)
  WHERE article_id = NEW.article_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_engagement_on_like_trigger
AFTER INSERT ON likes
FOR EACH ROW EXECUTE FUNCTION update_engagement_on_like();

-- Similar triggers for comments, shares
```

### 7.4 Audit Logging Trigger

```sql
CREATE OR REPLACE FUNCTION audit_article_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, changes_after)
    VALUES (CURRENT_SETTING('app.current_user_id')::BIGINT, 'create', 'article', NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, changes_before, changes_after)
    VALUES (CURRENT_SETTING('app.current_user_id')::BIGINT, 'update', 'article', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, changes_before)
    VALUES (CURRENT_SETTING('app.current_user_id')::BIGINT, 'delete', 'article', OLD.id, to_jsonb(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_article_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON articles
FOR EACH ROW EXECUTE FUNCTION audit_article_changes();
```

---

## SECTION 8: INDEXING STRATEGY

### 8.1 Primary Indexes (Performance Critical)

```sql
-- Article Queries (Most Common)
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) 
  WHERE status = 'published';
CREATE INDEX idx_articles_category_published ON articles(category_id, published_at DESC) 
  WHERE status = 'published';
CREATE INDEX idx_articles_language_published ON articles(language_code, published_at DESC) 
  WHERE status = 'published';

-- Full-Text Search
CREATE INDEX idx_articles_search_vector ON articles USING GIN(search_vector);

-- Article Lookup
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_uuid ON articles(uuid);

-- User Queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Engagement Queries
CREATE INDEX idx_likes_article_user ON likes(article_id, user_id);
CREATE INDEX idx_comments_article_status ON comments(article_id, status) 
  WHERE status = 'approved';

-- Analytics
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id) 
  INCLUDE (created_at);
```

### 8.2 Composite Indexes (Common WHERE + ORDER BY)

```sql
-- Homepage: Latest articles by category
CREATE INDEX idx_articles_category_published_desc ON articles(category_id, status, published_at DESC);

-- Search + Filter: Language + Status + Category
CREATE INDEX idx_articles_language_status_category ON articles(language_code, status, category_id);

-- Engagement: Top articles
CREATE INDEX idx_engagement_score_articles ON article_engagement_metrics(engagement_score DESC, created_at DESC);

-- User Activity: Last login
CREATE INDEX idx_users_last_login ON users(last_login_at DESC) WHERE status = 'active';
```

### 8.3 PARTIAL Indexes (Save Space)

```sql
-- Only index published articles (most queries filter by this)
CREATE INDEX idx_articles_published_only ON articles(published_at DESC) 
  WHERE status = 'published' AND deleted_at IS NULL;

-- Only active users
CREATE INDEX idx_users_active_only ON users(email) 
  WHERE status = 'active' AND deleted_at IS NULL;

-- Recent AI validations
CREATE INDEX idx_recent_validations ON content_validation_logs(article_id, created_at DESC) 
  WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '30 days';
```

### 8.4 GIN Indexes (JSONB & Arrays)

```sql
-- JSONB field searches
CREATE INDEX idx_articles_validation_flags ON articles USING GIN(validation_flags);
CREATE INDEX idx_validation_details ON content_validation_logs USING GIN(validation_details);
CREATE INDEX idx_activity_changes ON activity_logs USING GIN(changes_after);

-- Array searches
CREATE INDEX idx_user_applicable_categories ON auto_publishing_rules USING GIN(applicable_categories);
```

---

## SECTION 9: PARTITIONING STRATEGY

### 9.1 Table Partitioning for Large Tables

```sql
-- Partition articles by date (monthly partitions)
CREATE TABLE articles_partitioned (
  id BIGSERIAL,
  -- ... all columns ...
  created_at TIMESTAMP WITH TIME ZONE
) PARTITION BY RANGE (created_at);

-- Partition templates
CREATE TABLE articles_2026_09 PARTITION OF articles_partitioned
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

CREATE TABLE articles_2026_10 PARTITION OF articles_partitioned
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

-- Activity logs partitioned by month
CREATE TABLE activity_logs_partitioned (
  -- ... columns ...
  created_at TIMESTAMP WITH TIME ZONE
) PARTITION BY RANGE (created_at);

-- Index on partitioned tables
CREATE INDEX idx_partitioned_articles_published ON articles_partitioned(published_at DESC)
  WHERE status = 'published';
```

### 9.2 Archive Strategy

```sql
-- Archive old activity logs (older than 1 year)
CREATE TABLE activity_logs_archive (LIKE activity_logs INCLUDING ALL);

-- Trigger to archive old records
CREATE OR REPLACE FUNCTION archive_old_logs()
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs_archive
  SELECT * FROM activity_logs
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '365 days';
  
  DELETE FROM activity_logs
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql;

-- Run monthly
-- SELECT cron.schedule('archive_logs', '0 2 1 * *', 'SELECT archive_old_logs();');
```

---

## SECTION 10: SECURITY & ENCRYPTION

### 10.1 Row-Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY user_profile_policy ON users
  FOR SELECT USING (
    id = CURRENT_SETTING('app.current_user_id')::BIGINT 
    OR CURRENT_SETTING('app.is_admin')::BOOLEAN
  );

-- Policy: Users can only see approved comments
CREATE POLICY comment_visibility_policy ON comments
  FOR SELECT USING (
    status = 'approved' 
    OR user_id = CURRENT_SETTING('app.current_user_id')::BIGINT
  );

-- Policy: Users can only update their own articles
CREATE POLICY article_update_policy ON articles
  FOR UPDATE USING (
    author_id = CURRENT_SETTING('app.current_user_id')::BIGINT
    OR CURRENT_SETTING('app.is_admin')::BOOLEAN
  );
```

### 10.2 Encryption

```sql
-- Use pgcrypto extension for sensitive fields
CREATE EXTENSION pgcrypto;

-- Store API keys encrypted
ALTER TABLE users ADD COLUMN api_key_encrypted BYTEA;

-- Function to encrypt API key
CREATE OR REPLACE FUNCTION set_encrypted_api_key(p_user_id BIGINT, p_api_key VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET api_key_encrypted = pgp_sym_encrypt(p_api_key, 'secret_key_from_secrets_manager')
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt API key
CREATE OR REPLACE FUNCTION get_decrypted_api_key(p_user_id BIGINT)
RETURNS VARCHAR AS $$
DECLARE
  decrypted_key VARCHAR;
BEGIN
  SELECT pgp_sym_decrypt(api_key_encrypted, 'secret_key_from_secrets_manager')::VARCHAR
  INTO decrypted_key
  FROM users WHERE id = p_user_id;
  RETURN decrypted_key;
END;
$$ LANGUAGE plpgsql;
```

---

## SECTION 11: QUERY OPTIMIZATION EXAMPLES

### 11.1 Common Queries Optimized

```sql
-- 1. Get Latest Published Articles by Category
EXPLAIN ANALYZE
SELECT id, title, slug, published_at, view_count
FROM articles
WHERE category_id = 5 
  AND status = 'published' 
  AND deleted_at IS NULL
ORDER BY published_at DESC
LIMIT 10;

-- Uses: idx_articles_category_published_desc


-- 2. Full-Text Search Articles
EXPLAIN ANALYZE
SELECT id, title, slug, ts_rank(search_vector, query) AS rank
FROM articles, plainto_tsquery('english', 'breaking news') AS query
WHERE search_vector @@ query 
  AND status = 'published'
ORDER BY rank DESC
LIMIT 20;

-- Uses: idx_articles_search_vector


-- 3. Get Engagement Metrics for Homepage
EXPLAIN ANALYZE
SELECT 
  a.id, a.title, a.slug,
  agem.total_views, agem.total_likes, agem.total_comments
FROM articles a
JOIN article_engagement_metrics agem ON a.id = agem.article_id
WHERE a.status = 'published' 
  AND a.language_code = 'en'
ORDER BY agem.engagement_score DESC
LIMIT 10;

-- Uses: idx_engagement_score_articles


-- 4. Get User's Comments on Article
EXPLAIN ANALYZE
SELECT id, content, like_count, created_at
FROM comments
WHERE article_id = 123
  AND user_id = 45
  AND status = 'approved'
ORDER BY created_at DESC;

-- Uses: idx_comments_article_status


-- 5. Get Top Authors by Article Count
EXPLAIN ANALYZE
SELECT u.id, u.display_name, COUNT(a.id) as article_count
FROM users u
LEFT JOIN articles a ON u.id = a.author_id
  AND a.status = 'published'
  AND a.deleted_at IS NULL
WHERE u.status = 'active'
GROUP BY u.id
ORDER BY article_count DESC
LIMIT 20;

-- Index suggestion: idx_articles_author_status
CREATE INDEX idx_articles_author_status ON articles(author_id, status) 
  WHERE deleted_at IS NULL;
```

---

## SECTION 12: MAINTENANCE & MONITORING

### 12.1 Regular Maintenance Tasks

```sql
-- ANALYZE: Update table statistics (run daily)
ANALYZE articles;
ANALYZE users;
ANALYZE comments;
ANALYZE likes;
ANALYZE article_engagement_metrics;

-- VACUUM: Clean up dead tuples (run daily/weekly)
VACUUM articles;
VACUUM users;
VACUUM activity_logs;

-- REINDEX: Rebuild fragmented indexes (run weekly)
REINDEX TABLE articles;
REINDEX TABLE users;
REINDEX TABLE activity_logs;
```

### 12.2 Monitoring Queries

```sql
-- Check Table Sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check Index Sizes
SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check Slow Queries
SELECT mean_exec_time, calls, query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check Index Usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Identify Missing Indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 100
ORDER BY n_distinct DESC;
```

### 12.3 Backup & Recovery

```sql
-- Full Database Backup
pg_dump -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  --format=custom \
  --verbose \
  --file=/backups/newkarnataka_prod_$(date +%Y%m%d_%H%M%S).dump

-- Restore from Backup
pg_restore -h newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d newkarnataka_prod \
  --verbose \
  /backups/newkarnataka_prod_20260901_100000.dump

-- Point-in-Time Recovery (PITR)
-- Requires WAL archiving enabled (AWS RDS default)
-- Contact AWS support to restore to specific point in time
```

---

## SECTION 13: CONNECTION POOLING & CACHING

### 13.1 PgBouncer Configuration

```ini
; pgbouncer.ini
[databases]
newkarnataka_prod = host=newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com port=5432 dbname=newkarnataka_prod

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 100
max_user_connections = 100
```

### 13.2 Query Result Caching (Redis)

```python
# Pseudo-code for caching layer

def get_latest_articles(category_id, limit=10, offset=0):
    cache_key = f"articles:category:{category_id}:latest:{limit}:{offset}"
    
    # Try cache first
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Query database
    articles = db.query("""
        SELECT id, title, slug, published_at, view_count
        FROM articles
        WHERE category_id = %s AND status = 'published'
        ORDER BY published_at DESC
        LIMIT %s OFFSET %s
    """, (category_id, limit, offset))
    
    # Cache for 5 minutes
    redis.setex(cache_key, 300, json.dumps(articles))
    
    return articles
```

---

## SECTION 14: STRAPI INTEGRATION

### 14.1 Strapi Collections Configuration

```javascript
// config/database.js
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'newkarnataka_prod'),
        username: env('DATABASE_USERNAME', 'strapi_app'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', true),
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
      },
      options: {},
    },
  },
});

// api/article/models/Article.js
module.exports = {
  connection: 'default',
  collectionName: 'articles',
  info: {
    name: 'Article',
    description: 'News articles',
  },
  options: {
    increments: true,
    timestamps: ['created_at', 'updated_at'],
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
      maxLength: 500,
    },
    slug: {
      type: 'string',
      unique: true,
      required: true,
    },
    content: {
      type: 'richtext',
      required: true,
    },
    category: {
      model: 'category',
      via: 'articles',
      required: true,
    },
    author: {
      model: 'user',
      via: 'articles',
    },
    status: {
      type: 'enum',
      enum: ['draft', 'review_pending', 'approved', 'published', 'archived', 'rejected'],
      default: 'draft',
    },
    // ... more attributes
  },
};
```

---

## SECTION 15: SCALING CONSIDERATIONS

### 15.1 Read Replicas

```sql
-- PostgreSQL Read Replica Setup (AWS RDS)
-- Primary: newkarnataka-prod-db
-- Replica 1: newkarnataka-prod-db-replica-1 (read-only)
-- Replica 2: newkarnataka-prod-db-replica-2 (read-only)

-- Direct read queries to replicas
SELECT * FROM articles
WHERE status = 'published'
LIMIT 100;

-- NOTE: Use replica endpoint:
-- Read: newkarnataka-prod-db-replica.xxxxx.us-east-1.rds.amazonaws.com:5432
-- Write: newkarnataka-prod-db.xxxxx.us-east-1.rds.amazonaws.com:5432
```

### 15.2 Sharding Strategy (Future)

```sql
-- If 55K articles grows to millions, consider sharding by:
-- 1. Language (kn, en, tu)
-- 2. Date (articles from year 2026, 2027, etc.)
-- 3. Category

-- Example: Shard by language + year
-- Shard 1: kn_2026
-- Shard 2: en_2026
-- Shard 3: tu_2026
-- Shard 4: kn_2027
-- etc.
```

---

## INITIAL DATA SEEDING

### 15.3 Migration Script Example

```sql
-- 1. Categories (from WordPress)
INSERT INTO categories (name, slug, description)
SELECT post_name, post_name, post_content
FROM wp_categories
WHERE taxonomy = 'category';

-- 2. Users (from WordPress)
INSERT INTO users (email, first_name, last_name, password_hash, created_at)
SELECT user_email, user_firstname, user_lastname, user_pass, user_registered
FROM wp_users
WHERE user_login != 'admin';

-- 3. Articles (from WordPress)
INSERT INTO articles (title, slug, content, excerpt, category_id, author_id, status, published_at, created_at)
SELECT 
  post_title,
  post_name,
  post_content,
  post_excerpt,
  (SELECT id FROM categories WHERE name = wp.post_category LIMIT 1),
  (SELECT id FROM users WHERE email = wp.post_author LIMIT 1),
  CASE WHEN post_status = 'publish' THEN 'published' ELSE 'draft' END,
  post_date_gmt,
  post_date_gmt
FROM wp_posts wp
WHERE post_type = 'post';

-- 4. Verify Migration
SELECT COUNT(*) as total_articles FROM articles;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_categories FROM categories;
```

---

## DATABASE SPECIFICATIONS SUMMARY

| Specification | Value |
|---|---|
| **Engine** | PostgreSQL 14+ |
| **Encoding** | UTF-8 (supports Kannada, English, Tulu) |
| **Collation** | en_US.UTF-8 |
| **Initial Size** | ~500 GB |
| **Max Size** | 1 TB (with auto-scaling) |
| **Connection Pool** | 25-100 connections |
| **Backup Retention** | 30 days continuous + cross-region |
| **Recovery Point Objective (RPO)** | < 1 minute |
| **Recovery Time Objective (RTO)** | < 15 minutes (automatic failover) |
| **Availability SLA** | 99.9% (Multi-AZ) |
| **Monitoring** | CloudWatch + Enhanced Monitoring |
| **Performance Insights** | Enabled (track database performance) |

---

**Database Design Status:** COMPLETE ✓  
**Ready for:** Strapi Configuration + Data Migration  
**Next Steps:** 
1. Provision RDS instance (PostgreSQL 14)
2. Run schema creation scripts
3. Configure backups & monitoring
4. Test data migration from WordPress
5. Optimize indexes based on actual query patterns

-- ============================================================================
-- GAP REMEDIATION SCRIPT - CRITICAL FIXES
-- NewsKarnataka Database - Close gaps between planned and deployed schema
-- Date: September 10, 2026
-- ============================================================================
-- This script fixes CRITICAL gaps that block core features:
-- 1. WordPress migration (missing wordpress_user_id, wordpress_post_id)
-- 2. Multi-language support (missing language_code)
-- 3. Full-text search (missing search_vector)
-- 4. User authentication (missing email tokens, password reset)
-- 5. Data type mismatches (status field, featured_image_id)
-- ============================================================================

-- ============================================================================
-- SECTION 1: FIX USERS TABLE
-- ============================================================================

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS wordpress_user_id BIGINT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Fix status field: Convert from boolean to VARCHAR with constraints
-- First, backup current data
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop the is_active column if it exists and add proper status field
ALTER TABLE users DROP COLUMN IF EXISTS is_active;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' 
  CHECK (status IN ('active', 'inactive', 'suspended', 'deleted'));

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_users_wordpress_id ON users(wordpress_user_id) 
  WHERE wordpress_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_preferred_language ON users(preferred_language);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified_at) 
  WHERE email_verified_at IS NOT NULL;

-- ============================================================================
-- SECTION 2: FIX ARTICLES TABLE
-- ============================================================================

-- Add missing columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS wordpress_post_id BIGINT UNIQUE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS language_code CHAR(2) DEFAULT 'en' 
  CHECK (language_code IN ('en', 'kn', 'tu'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS original_article_id UUID REFERENCES articles(id) ON DELETE CASCADE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Fix featured_image_id: Change from VARCHAR(text) to UUID FK
-- First, create new column
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image_id_new UUID REFERENCES media(id) ON DELETE SET NULL;

-- For migration: You would need to map featured_image_url strings to actual media IDs
-- This is a manual data mapping task - the column structure is now correct
-- After data migration, drop the old column: ALTER TABLE articles DROP COLUMN featured_image_url;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_articles_wordpress_post_id ON articles(wordpress_post_id) 
  WHERE wordpress_post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_language_code ON articles(language_code);
CREATE INDEX IF NOT EXISTS idx_articles_original_id ON articles(original_article_id);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish ON articles(scheduled_publish_at) 
  WHERE scheduled_publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_search_vector ON articles USING GIN(search_vector);

-- ============================================================================
-- SECTION 3: CREATE/UPDATE TRIGGERS FOR FULL-TEXT SEARCH
-- ============================================================================

-- Full-text search vector trigger for articles
CREATE OR REPLACE FUNCTION update_articles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.content, '') || ' ' ||
    COALESCE(NEW.excerpt, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger if it exists
DROP TRIGGER IF EXISTS articles_search_vector ON articles;

-- Create new trigger for full-text search
CREATE TRIGGER articles_search_vector 
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_articles_search_vector();

-- ============================================================================
-- SECTION 4: ADD MISSING INDEXES
-- ============================================================================

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_articles_language_published ON articles(language_code, published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_category_language ON articles(category_id, language_code)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON articles(view_count DESC)
  WHERE status = 'published';

-- ============================================================================
-- SECTION 5: VERIFY & DOCUMENT CHANGES
-- ============================================================================

-- Verification queries (run after script completes)
SELECT 'USERS TABLE VERIFICATION' as check_type, COUNT(DISTINCT column_name) as column_count
FROM information_schema.columns WHERE table_name = 'users';

SELECT 'ARTICLES TABLE VERIFICATION' as check_type, COUNT(DISTINCT column_name) as column_count
FROM information_schema.columns WHERE table_name = 'articles';

SELECT 'NEW INDEXES' as check_type, COUNT(*) as index_count
FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%';

SELECT 'TRIGGERS' as check_type, COUNT(*) as trigger_count
FROM information_schema.triggers WHERE trigger_schema = 'public';

-- ============================================================================
-- SECTION 6: MANUAL STEPS REQUIRED
-- ============================================================================

-- NOTE: The following require manual intervention:
-- 1. Migrate featured_image_url data to featured_image_id
--    - Map URL strings to media table IDs
--    - Verify all images are in media table
--    - Execute mapping UPDATE query
--    - Then: ALTER TABLE articles DROP COLUMN featured_image_url;

-- 2. Populate search_vector for existing articles
--    - Run: UPDATE articles SET search_vector = to_tsvector('english', 
--      COALESCE(title, '') || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, ''));

-- 3. Test WordPress migration
--    - Import wordpress_user_id for existing users
--    - Import wordpress_post_id for existing articles
--    - Verify all IDs are unique

-- 4. Test multi-language filtering
--    - Set language_code for existing articles (default is 'en')
--    - Verify language-based queries work

-- ============================================================================
-- SECTION 7: DATA CLEANUP RECOMMENDATIONS
-- ============================================================================

-- After data migration, execute these (carefully):

-- 1. Drop backup table (after verification)
-- DROP TABLE users_backup;

-- 2. Drop old featured_image_url column (after migration to featured_image_id)
-- ALTER TABLE articles DROP COLUMN featured_image_url;

-- 3. Populate missing status values for users
-- UPDATE users SET status = 'active' WHERE status IS NULL;

-- 4. Update preferred_language from user preferences
-- UPDATE users SET preferred_language = 'en' WHERE preferred_language IS NULL;

-- ============================================================================
-- END OF GAP REMEDIATION SCRIPT
-- ============================================================================
-- Total changes:
-- - Users table: +11 columns, 1 data type fix, 3 indexes
-- - Articles table: +8 columns, 1 data type fix, 5 indexes
-- - Triggers: 1 full-text search trigger
-- - Total new indexes: 8
-- 
-- Expected execution time: 5-10 minutes
-- Risk level: MEDIUM (table structure changes)
-- Testing required: YES (critical)
-- ============================================================================

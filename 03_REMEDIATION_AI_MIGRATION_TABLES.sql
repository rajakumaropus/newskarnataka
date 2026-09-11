-- ============================================================================
-- REMEDIATION SCRIPT: Create Missing AI & Validation Tables
-- NewsKarnataka.com - Complete Schema
-- ============================================================================

-- ============================================================================
-- TABLE 1: AI Validation Results
-- Purpose: Store AI content validation results and quality scores
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_validation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  validation_type VARCHAR(100) NOT NULL DEFAULT 'content_quality',
  validation_score NUMERIC(5, 2) CHECK (validation_score >= 0 AND validation_score <= 100),
  confidence_score NUMERIC(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  issues JSONB DEFAULT '[]'::jsonb,
  recommendations TEXT,
  model_version VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_validation_article_id ON ai_validation_results(article_id);
CREATE INDEX idx_ai_validation_created_at ON ai_validation_results(created_at);
CREATE INDEX idx_ai_validation_status ON ai_validation_results(status);

-- ============================================================================
-- TABLE 2: Engagement Predictions
-- Purpose: Store ML-predicted engagement metrics for articles
-- ============================================================================

CREATE TABLE IF NOT EXISTS engagement_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  predicted_views INTEGER,
  predicted_likes INTEGER,
  predicted_comments INTEGER,
  predicted_shares INTEGER,
  confidence_score NUMERIC(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  model_name VARCHAR(255),
  model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_engagement_predictions_article_id ON engagement_predictions(article_id);
CREATE INDEX idx_engagement_predictions_date ON engagement_predictions(prediction_date);
CREATE INDEX idx_engagement_predictions_created_at ON engagement_predictions(created_at);

-- ============================================================================
-- TABLE 3: Trending Articles
-- Purpose: Track trending content and calculate trend scores
-- ============================================================================

CREATE TABLE IF NOT EXISTS trending_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  language VARCHAR(10) DEFAULT 'en',
  trend_score NUMERIC(10, 4) NOT NULL DEFAULT 0,
  rank INTEGER,
  views_24h INTEGER DEFAULT 0,
  likes_24h INTEGER DEFAULT 0,
  comments_24h INTEGER DEFAULT 0,
  shares_24h INTEGER DEFAULT 0,
  trend_direction VARCHAR(20) DEFAULT 'stable',
  period_start TIMESTAMP DEFAULT NOW(),
  period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trending_articles_score ON trending_articles(trend_score DESC);
CREATE INDEX idx_trending_articles_rank ON trending_articles(rank);
CREATE INDEX idx_trending_articles_category ON trending_articles(category_id);
CREATE INDEX idx_trending_articles_language ON trending_articles(language);
CREATE INDEX idx_trending_articles_period ON trending_articles(period_start, period_end);

-- ============================================================================
-- TABLE 4: AI Model Metadata
-- Purpose: Track AI models used in the system
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_model_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name VARCHAR(255) NOT NULL,
  model_type VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  provider VARCHAR(100),
  purpose VARCHAR(255),
  accuracy NUMERIC(5, 4) CHECK (accuracy >= 0 AND accuracy <= 1),
  precision NUMERIC(5, 4),
  recall NUMERIC(5, 4),
  f1_score NUMERIC(5, 4),
  training_date TIMESTAMP,
  last_updated TIMESTAMP,
  last_trained TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  hyperparameters JSONB,
  performance_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(model_name, model_version)
);

CREATE INDEX idx_ai_model_name ON ai_model_metadata(model_name);
CREATE INDEX idx_ai_model_type ON ai_model_metadata(model_type);
CREATE INDEX idx_ai_model_active ON ai_model_metadata(is_active);
CREATE INDEX idx_ai_model_created ON ai_model_metadata(created_at);

-- ============================================================================
-- TABLE 5: Migration Metadata
-- Purpose: Track data migration from external sources (e.g., WordPress)
-- ============================================================================

CREATE TABLE IF NOT EXISTS migration_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_batch_id UUID NOT NULL,
  source_type VARCHAR(100) NOT NULL,
  source_id VARCHAR(255) NOT NULL,
  source_url VARCHAR(2048),
  target_type VARCHAR(100) NOT NULL DEFAULT 'article',
  target_id UUID,
  mapping_data JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  migration_timestamp TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_migration_batch_id ON migration_metadata(migration_batch_id);
CREATE INDEX idx_migration_source ON migration_metadata(source_type, source_id);
CREATE INDEX idx_migration_target ON migration_metadata(target_type, target_id);
CREATE INDEX idx_migration_status ON migration_metadata(status);
CREATE INDEX idx_migration_timestamp ON migration_metadata(migration_timestamp);

-- ============================================================================
-- AUDIT TRIGGERS FOR NEW TABLES
-- ============================================================================

-- Trigger for ai_validation_results audit
CREATE OR REPLACE FUNCTION audit_ai_validation_results()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    id, table_name, operation, record_id, old_values, new_values, user_id, created_at
  ) VALUES (
    gen_random_uuid(),
    'ai_validation_results',
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
    NULL,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_ai_validation_results
AFTER INSERT OR UPDATE OR DELETE ON ai_validation_results
FOR EACH ROW EXECUTE FUNCTION audit_ai_validation_results();

-- Trigger for engagement_predictions audit
CREATE OR REPLACE FUNCTION audit_engagement_predictions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    id, table_name, operation, record_id, old_values, new_values, user_id, created_at
  ) VALUES (
    gen_random_uuid(),
    'engagement_predictions',
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
    NULL,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_engagement_predictions
AFTER INSERT OR UPDATE OR DELETE ON engagement_predictions
FOR EACH ROW EXECUTE FUNCTION audit_engagement_predictions();

-- Trigger for migration_metadata audit
CREATE OR REPLACE FUNCTION audit_migration_metadata()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    id, table_name, operation, record_id, old_values, new_values, user_id, created_at
  ) VALUES (
    gen_random_uuid(),
    'migration_metadata',
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
    NULL,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_migration_metadata
AFTER INSERT OR UPDATE OR DELETE ON migration_metadata
FOR EACH ROW EXECUTE FUNCTION audit_migration_metadata();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
  'ai_validation_results' as table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ai_validation_results') as column_count
UNION ALL SELECT
  'engagement_predictions',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'engagement_predictions')
UNION ALL SELECT
  'trending_articles',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'trending_articles')
UNION ALL SELECT
  'ai_model_metadata',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ai_model_metadata')
UNION ALL SELECT
  'migration_metadata',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'migration_metadata');

-- Show new index count
SELECT COUNT(*) as new_indexes FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_validation_results', 'engagement_predictions', 'trending_articles', 'ai_model_metadata', 'migration_metadata');

-- ============================================================================
-- END OF REMEDIATION SCRIPT
-- ============================================================================
-- 5 new tables created with:
-- - Complete column definitions with constraints
-- - Proper indexes for query performance
-- - Audit triggers for compliance
-- - Foreign key relationships to core tables
-- ============================================================================

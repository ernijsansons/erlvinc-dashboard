-- supabase/migrations/003_labs_scoring_and_tiers.sql
-- Add scoring system and two-tier research fields to labs_opportunities

-- ============================================
-- ADD NEW FIELDS FOR SCORING & TWO-TIER RESEARCH
-- ============================================

-- Scoring system (0-100)
ALTER TABLE labs_opportunities
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100);

-- Research tier tracking ('none', 'quick', 'deep')
ALTER TABLE labs_opportunities
ADD COLUMN IF NOT EXISTS research_tier TEXT DEFAULT 'none' CHECK (research_tier IN ('none', 'quick', 'deep'));

-- Quick summary results (1-3 pages)
ALTER TABLE labs_opportunities
ADD COLUMN IF NOT EXISTS summary_report JSONB;

-- Original Grok email data
ALTER TABLE labs_opportunities
ADD COLUMN IF NOT EXISTS raw_email_data JSONB;

-- When Grok sent the email
ALTER TABLE labs_opportunities
ADD COLUMN IF NOT EXISTS email_source_date TIMESTAMPTZ;

-- ============================================
-- ADD INDEXES FOR PERFORMANCE
-- ============================================

-- Index for sorting by score (most common query)
CREATE INDEX IF NOT EXISTS idx_labs_score ON labs_opportunities(score DESC);

-- Index for filtering by research tier
CREATE INDEX IF NOT EXISTS idx_labs_research_tier ON labs_opportunities(research_tier);

-- Index for filtering by email source date
CREATE INDEX IF NOT EXISTS idx_labs_email_date ON labs_opportunities(email_source_date DESC);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_labs_score_status ON labs_opportunities(score DESC, status);

-- ============================================
-- UPDATE TRIGGER FOR updated_at
-- ============================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_labs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS labs_opportunities_updated_at ON labs_opportunities;
CREATE TRIGGER labs_opportunities_updated_at
  BEFORE UPDATE ON labs_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_labs_updated_at();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN labs_opportunities.score IS 'Priority score 0-100 based on: novelty(20), scalability(20), impact(20), verifiability(15), major players(15), viral traction(10)';
COMMENT ON COLUMN labs_opportunities.research_tier IS 'Which research has been completed: none (just scanned), quick (1-3 page summary), deep (25 page comprehensive)';
COMMENT ON COLUMN labs_opportunities.summary_report IS 'Quick summary results (market overview, top 3 competitors, use case, tech assessment, recommendation)';
COMMENT ON COLUMN labs_opportunities.raw_email_data IS 'Original Grok email content parsed for this opportunity';
COMMENT ON COLUMN labs_opportunities.email_source_date IS 'When Grok sent the daily AI opportunities email';

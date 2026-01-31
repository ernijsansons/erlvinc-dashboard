-- supabase/migrations/002_labs_tables.sql

-- ============================================
-- LABS OPPORTUNITIES (5-stage pipeline)
-- ============================================
CREATE TABLE labs_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stage 1: Scanning
  title TEXT NOT NULL,
  capability_unlock TEXT,                    -- "Anthropic Computer Use 2.0"
  capability_date DATE,
  capability_source TEXT,                    -- URL to announcement
  niche TEXT,                                -- "Real estate investors"
  pain_point TEXT,
  initial_value_prop TEXT,
  scan_source TEXT,                          -- "Product Hunt", "HuggingFace", etc.
  betty_scan_notes TEXT,

  -- Stage 2: Deep Research
  status TEXT DEFAULT 'scanned',             -- scanned, researching, review, discussion, approved, rejected, built
  research_started_at TIMESTAMPTZ,
  research_completed_at TIMESTAMPTZ,
  research_progress INTEGER DEFAULT 0,       -- 0-100%
  notion_report_url TEXT,

  -- Research outputs (JSONB)
  market_validation JSONB,
  competitor_analysis JSONB,
  customer_personas JSONB,
  brand_identity JSONB,
  tech_stack_recommendation JSONB,
  gtm_strategy JSONB,
  financial_projections JSONB,
  risk_analysis JSONB,

  betty_recommendation TEXT,                 -- 'GO' or 'NO-GO'
  betty_confidence INTEGER,                  -- 1-10
  betty_reasoning TEXT,

  -- Stage 3: Discussion
  discussion_started_at TIMESTAMPTZ,
  discussion_messages JSONB,                 -- Chat history with Claude

  -- Stage 4: Approval
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  domain_purchased TEXT,
  blueprint_url TEXT,
  rejection_reason TEXT,

  -- Stage 5: Built
  project_id TEXT REFERENCES projects(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_labs_status ON labs_opportunities(status);
CREATE INDEX idx_labs_created ON labs_opportunities(created_at DESC);

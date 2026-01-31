-- supabase/migrations/003_claire_tables.sql

-- ============================================
-- CLAIRE CONFIG (Global settings)
-- ============================================
CREATE TABLE claire_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  operating_mode TEXT DEFAULT 'solo',        -- 'solo' or 'betty_collab'
  is_active BOOLEAN DEFAULT FALSE,
  shadow_mode BOOLEAN DEFAULT TRUE,          -- Paper trading
  max_position_size REAL DEFAULT 500,
  daily_loss_limit REAL DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config
INSERT INTO claire_config (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- ============================================
-- CLAIRE STRATEGY MODES (Per-strategy config)
-- ============================================
CREATE TABLE claire_strategy_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy TEXT NOT NULL UNIQUE,             -- 'arbitrage', 'news_alpha', etc.
  mode TEXT DEFAULT 'solo',                  -- 'solo' or 'betty_collab'
  is_enabled BOOLEAN DEFAULT TRUE,
  capital_allocation REAL DEFAULT 0.0,       -- Percentage (0.0 to 1.0)
  ab_test_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default strategies
INSERT INTO claire_strategy_modes (strategy, mode, capital_allocation) VALUES
  ('arbitrage', 'solo', 0.30),
  ('news_alpha', 'betty_collab', 0.20),
  ('whale_copy', 'solo', 0.15),
  ('combinatorial', 'betty_collab', 0.15),
  ('liquidity', 'solo', 0.10),
  ('high_prob_bonds', 'solo', 0.10)
ON CONFLICT (strategy) DO NOTHING;

-- ============================================
-- CLAIRE SIGNALS (Trade signals)
-- ============================================
CREATE TABLE claire_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy TEXT NOT NULL,
  mode TEXT NOT NULL,                        -- Track which mode generated
  market_id TEXT NOT NULL,
  market_title TEXT,
  position TEXT NOT NULL,                    -- 'YES' or 'NO'
  target_price REAL,
  size_usd REAL,
  confidence REAL,                           -- 0.0 to 1.0
  reasoning TEXT,
  betty_research_id UUID,                    -- NULL if solo mode
  status TEXT DEFAULT 'pending',             -- pending, approved, executed, rejected, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);

CREATE INDEX idx_claire_signals_status ON claire_signals(status);
CREATE INDEX idx_claire_signals_mode ON claire_signals(mode);
CREATE INDEX idx_claire_signals_strategy ON claire_signals(strategy);

-- ============================================
-- CLAIRE TRADES (Executed trades)
-- ============================================
CREATE TABLE claire_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES claire_signals(id),
  mode TEXT NOT NULL,                        -- For A/B analysis
  strategy TEXT NOT NULL,
  market_id TEXT NOT NULL,
  position TEXT NOT NULL,
  shares REAL NOT NULL,
  entry_price REAL NOT NULL,
  exit_price REAL,
  pnl REAL,
  status TEXT DEFAULT 'open',                -- open, closed, expired
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_claire_trades_mode ON claire_trades(mode);
CREATE INDEX idx_claire_trades_strategy ON claire_trades(strategy);
CREATE INDEX idx_claire_trades_status ON claire_trades(status);

-- ============================================
-- CLAIRE MODE PERFORMANCE (View for A/B testing)
-- ============================================
CREATE VIEW claire_mode_performance AS
SELECT
  mode,
  strategy,
  COUNT(*) as total_trades,
  SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
  SUM(pnl) as total_pnl,
  AVG(pnl) as avg_pnl,
  ROUND(SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as win_rate
FROM claire_trades
WHERE status = 'closed'
GROUP BY mode, strategy;

-- ============================================
-- BETTY RESEARCH REQUESTS (For Claire collab)
-- ============================================
CREATE TABLE betty_research_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by TEXT DEFAULT 'claire',
  market_id TEXT,
  topic TEXT NOT NULL,
  depth TEXT DEFAULT 'standard',             -- 'quick', 'standard', 'deep'
  status TEXT DEFAULT 'pending',
  result JSONB,
  tokens_used INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

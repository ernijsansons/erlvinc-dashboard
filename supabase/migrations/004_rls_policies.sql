-- supabase/migrations/004_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE claire_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE claire_strategy_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE claire_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE claire_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE betty_research_requests ENABLE ROW LEVEL SECURITY;

-- Single-user system: Authenticated users can access all
-- (In production, add user_id columns and proper multi-tenant policies)

CREATE POLICY "authenticated_access" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON tasks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON escalations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON approvals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON decisions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON labs_opportunities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON claire_config
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON claire_strategy_modes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON claire_signals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON claire_trades
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_access" ON betty_research_requests
  FOR ALL USING (auth.role() = 'authenticated');

-- Agent events: Read for authenticated, Insert for service_role (webhooks)
CREATE POLICY "read_agent_events" ON agent_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "insert_agent_events" ON agent_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;
ALTER PUBLICATION supabase_realtime ADD TABLE escalations;
ALTER PUBLICATION supabase_realtime ADD TABLE approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE labs_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE claire_signals;
ALTER PUBLICATION supabase_realtime ADD TABLE claire_trades;

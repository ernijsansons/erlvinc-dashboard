-- supabase/migrations/001_initial_schema.sql

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  github_repo TEXT,
  linear_team_id TEXT,
  primary_agent TEXT,                        -- 'janis', 'betty', 'claire', 'jon'
  tech_stack JSONB,
  status TEXT DEFAULT 'active',              -- active, paused, completed, archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TASKS
-- ============================================
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog',             -- backlog, todo, in_progress, review, done
  assigned_agent TEXT,                       -- 'janis', 'betty', 'claire', 'jon', NULL
  progress INTEGER DEFAULT 0,                -- 0-100
  priority INTEGER DEFAULT 3,                -- 1=urgent, 2=high, 3=normal, 4=low
  linear_url TEXT,
  github_pr_url TEXT,
  github_branch TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_agent ON tasks(assigned_agent) WHERE assigned_agent IS NOT NULL;

-- ============================================
-- AGENT EVENTS (Webhook logs)
-- ============================================
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent TEXT NOT NULL,                       -- 'janis', 'betty', 'claire', 'jon'
  event_type TEXT NOT NULL,                  -- task_started, task_progress, task_complete, error, etc.
  task_id TEXT REFERENCES tasks(id),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_events_time ON agent_events USING BRIN(created_at);
CREATE INDEX idx_agent_events_agent ON agent_events(agent, created_at DESC);

-- ============================================
-- ESCALATIONS (Agent questions)
-- ============================================
CREATE TABLE escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id),
  task_id TEXT REFERENCES tasks(id),
  agent TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,                             -- Array of possible choices
  context TEXT,
  recommendation TEXT,                       -- Agent's recommended choice
  status TEXT DEFAULT 'pending',             -- pending, resolved, cancelled
  resolution TEXT,
  resolved_by TEXT,                          -- 'claude' or 'ernie'
  telegram_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_escalations_status ON escalations(status) WHERE status = 'pending';

-- ============================================
-- APPROVALS
-- ============================================
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,                        -- 'deploy_prod', 'merge_pr', 'cost', 'trade'
  project_id TEXT REFERENCES projects(id),
  task_id TEXT REFERENCES tasks(id),
  description TEXT NOT NULL,
  details JSONB,
  requested_by TEXT NOT NULL,                -- 'janis', 'betty', 'claire', 'jon'
  status TEXT DEFAULT 'pending',             -- pending, approved, rejected
  response_note TEXT,
  telegram_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_approvals_status ON approvals(status) WHERE status = 'pending';

-- ============================================
-- DECISIONS (Architectural memory)
-- ============================================
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id),
  title TEXT NOT NULL,
  context TEXT,
  decision TEXT NOT NULL,
  reasoning TEXT,
  alternatives JSONB,                        -- What we didn't choose
  decided_by TEXT,                           -- 'claude', 'ernie'
  notion_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

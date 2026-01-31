// Generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          github_repo: string | null
          linear_team_id: string | null
          primary_agent: string | null
          tech_stack: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          github_repo?: string | null
          linear_team_id?: string | null
          primary_agent?: string | null
          tech_stack?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          github_repo?: string | null
          linear_team_id?: string | null
          primary_agent?: string | null
          tech_stack?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: string
          assigned_agent: string | null
          progress: number
          priority: number
          linear_url: string | null
          github_pr_url: string | null
          github_branch: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          project_id: string
          title: string
          description?: string | null
          status?: string
          assigned_agent?: string | null
          progress?: number
          priority?: number
          linear_url?: string | null
          github_pr_url?: string | null
          github_branch?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: string
          assigned_agent?: string | null
          progress?: number
          priority?: number
          linear_url?: string | null
          github_pr_url?: string | null
          github_branch?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_events: {
        Row: {
          id: string
          agent: string
          event_type: string
          task_id: string | null
          payload: Json
          processed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          agent: string
          event_type: string
          task_id?: string | null
          payload: Json
          processed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          agent?: string
          event_type?: string
          task_id?: string | null
          payload?: Json
          processed?: boolean
          created_at?: string
        }
      }
      escalations: {
        Row: {
          id: string
          project_id: string | null
          task_id: string | null
          agent: string
          question: string
          options: Json | null
          context: string | null
          recommendation: string | null
          status: string
          resolution: string | null
          resolved_by: string | null
          telegram_message_id: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          task_id?: string | null
          agent: string
          question: string
          options?: Json | null
          context?: string | null
          recommendation?: string | null
          status?: string
          resolution?: string | null
          resolved_by?: string | null
          telegram_message_id?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          task_id?: string | null
          agent?: string
          question?: string
          options?: Json | null
          context?: string | null
          recommendation?: string | null
          status?: string
          resolution?: string | null
          resolved_by?: string | null
          telegram_message_id?: string | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      approvals: {
        Row: {
          id: string
          type: string
          project_id: string | null
          task_id: string | null
          description: string
          details: Json | null
          requested_by: string
          status: string
          response_note: string | null
          telegram_message_id: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          type: string
          project_id?: string | null
          task_id?: string | null
          description: string
          details?: Json | null
          requested_by: string
          status?: string
          response_note?: string | null
          telegram_message_id?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          project_id?: string | null
          task_id?: string | null
          description?: string
          details?: Json | null
          requested_by?: string
          status?: string
          response_note?: string | null
          telegram_message_id?: string | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      decisions: {
        Row: {
          id: string
          project_id: string | null
          title: string
          context: string | null
          decision: string
          reasoning: string | null
          alternatives: Json | null
          decided_by: string | null
          notion_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          title: string
          context?: string | null
          decision: string
          reasoning?: string | null
          alternatives?: Json | null
          decided_by?: string | null
          notion_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          title?: string
          context?: string | null
          decision?: string
          reasoning?: string | null
          alternatives?: Json | null
          decided_by?: string | null
          notion_url?: string | null
          created_at?: string
        }
      }
      labs_opportunities: {
        Row: {
          id: string
          title: string
          capability_unlock: string | null
          capability_date: string | null
          capability_source: string | null
          niche: string | null
          pain_point: string | null
          initial_value_prop: string | null
          scan_source: string | null
          betty_scan_notes: string | null
          status: string
          research_started_at: string | null
          research_completed_at: string | null
          research_progress: number
          notion_report_url: string | null
          market_validation: Json | null
          competitor_analysis: Json | null
          customer_personas: Json | null
          brand_identity: Json | null
          tech_stack_recommendation: Json | null
          gtm_strategy: Json | null
          financial_projections: Json | null
          risk_analysis: Json | null
          betty_recommendation: string | null
          betty_confidence: number | null
          betty_reasoning: string | null
          discussion_started_at: string | null
          discussion_messages: Json | null
          approved_by: string | null
          approved_at: string | null
          domain_purchased: string | null
          blueprint_url: string | null
          rejection_reason: string | null
          project_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          capability_unlock?: string | null
          capability_date?: string | null
          capability_source?: string | null
          niche?: string | null
          pain_point?: string | null
          initial_value_prop?: string | null
          scan_source?: string | null
          betty_scan_notes?: string | null
          status?: string
          research_started_at?: string | null
          research_completed_at?: string | null
          research_progress?: number
          notion_report_url?: string | null
          market_validation?: Json | null
          competitor_analysis?: Json | null
          customer_personas?: Json | null
          brand_identity?: Json | null
          tech_stack_recommendation?: Json | null
          gtm_strategy?: Json | null
          financial_projections?: Json | null
          risk_analysis?: Json | null
          betty_recommendation?: string | null
          betty_confidence?: number | null
          betty_reasoning?: string | null
          discussion_started_at?: string | null
          discussion_messages?: Json | null
          approved_by?: string | null
          approved_at?: string | null
          domain_purchased?: string | null
          blueprint_url?: string | null
          rejection_reason?: string | null
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          capability_unlock?: string | null
          capability_date?: string | null
          capability_source?: string | null
          niche?: string | null
          pain_point?: string | null
          initial_value_prop?: string | null
          scan_source?: string | null
          betty_scan_notes?: string | null
          status?: string
          research_started_at?: string | null
          research_completed_at?: string | null
          research_progress?: number
          notion_report_url?: string | null
          market_validation?: Json | null
          competitor_analysis?: Json | null
          customer_personas?: Json | null
          brand_identity?: Json | null
          tech_stack_recommendation?: Json | null
          gtm_strategy?: Json | null
          financial_projections?: Json | null
          risk_analysis?: Json | null
          betty_recommendation?: string | null
          betty_confidence?: number | null
          betty_reasoning?: string | null
          discussion_started_at?: string | null
          discussion_messages?: Json | null
          approved_by?: string | null
          approved_at?: string | null
          domain_purchased?: string | null
          blueprint_url?: string | null
          rejection_reason?: string | null
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      claire_config: {
        Row: {
          id: string
          operating_mode: string
          is_active: boolean
          shadow_mode: boolean
          max_position_size: number
          daily_loss_limit: number
          updated_at: string
        }
        Insert: {
          id?: string
          operating_mode?: string
          is_active?: boolean
          shadow_mode?: boolean
          max_position_size?: number
          daily_loss_limit?: number
          updated_at?: string
        }
        Update: {
          id?: string
          operating_mode?: string
          is_active?: boolean
          shadow_mode?: boolean
          max_position_size?: number
          daily_loss_limit?: number
          updated_at?: string
        }
      }
      claire_strategy_modes: {
        Row: {
          id: string
          strategy: string
          mode: string
          is_enabled: boolean
          capital_allocation: number
          ab_test_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          strategy: string
          mode?: string
          is_enabled?: boolean
          capital_allocation?: number
          ab_test_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          strategy?: string
          mode?: string
          is_enabled?: boolean
          capital_allocation?: number
          ab_test_active?: boolean
          created_at?: string
        }
      }
      claire_signals: {
        Row: {
          id: string
          strategy: string
          mode: string
          market_id: string
          market_title: string | null
          position: string
          target_price: number | null
          size_usd: number | null
          confidence: number | null
          reasoning: string | null
          betty_research_id: string | null
          status: string
          created_at: string
          executed_at: string | null
        }
        Insert: {
          id?: string
          strategy: string
          mode: string
          market_id: string
          market_title?: string | null
          position: string
          target_price?: number | null
          size_usd?: number | null
          confidence?: number | null
          reasoning?: string | null
          betty_research_id?: string | null
          status?: string
          created_at?: string
          executed_at?: string | null
        }
        Update: {
          id?: string
          strategy?: string
          mode?: string
          market_id?: string
          market_title?: string | null
          position?: string
          target_price?: number | null
          size_usd?: number | null
          confidence?: number | null
          reasoning?: string | null
          betty_research_id?: string | null
          status?: string
          created_at?: string
          executed_at?: string | null
        }
      }
      claire_trades: {
        Row: {
          id: string
          signal_id: string | null
          mode: string
          strategy: string
          market_id: string
          position: string
          shares: number
          entry_price: number
          exit_price: number | null
          pnl: number | null
          status: string
          opened_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          signal_id?: string | null
          mode: string
          strategy: string
          market_id: string
          position: string
          shares: number
          entry_price: number
          exit_price?: number | null
          pnl?: number | null
          status?: string
          opened_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          signal_id?: string | null
          mode?: string
          strategy?: string
          market_id?: string
          position?: string
          shares?: number
          entry_price?: number
          exit_price?: number | null
          pnl?: number | null
          status?: string
          opened_at?: string
          closed_at?: string | null
        }
      }
      betty_research_requests: {
        Row: {
          id: string
          requested_by: string
          market_id: string | null
          topic: string
          depth: string
          status: string
          result: Json | null
          tokens_used: number | null
          duration_ms: number | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          requested_by?: string
          market_id?: string | null
          topic: string
          depth?: string
          status?: string
          result?: Json | null
          tokens_used?: number | null
          duration_ms?: number | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          requested_by?: string
          market_id?: string | null
          topic?: string
          depth?: string
          status?: string
          result?: Json | null
          tokens_used?: number | null
          duration_ms?: number | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      claire_mode_performance: {
        Row: {
          mode: string | null
          strategy: string | null
          total_trades: number | null
          winning_trades: number | null
          total_pnl: number | null
          avg_pnl: number | null
          win_rate: number | null
        }
      }
    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type AgentEvent = Database['public']['Tables']['agent_events']['Row']
export type Escalation = Database['public']['Tables']['escalations']['Row']
export type Approval = Database['public']['Tables']['approvals']['Row']
export type Decision = Database['public']['Tables']['decisions']['Row']
export type LabsOpportunity = Database['public']['Tables']['labs_opportunities']['Row']
export type ClaireConfig = Database['public']['Tables']['claire_config']['Row']
export type ClaireStrategyMode = Database['public']['Tables']['claire_strategy_modes']['Row']
export type ClaireSignal = Database['public']['Tables']['claire_signals']['Row']
export type ClaireTrade = Database['public']['Tables']['claire_trades']['Row']
export type BettyResearchRequest = Database['public']['Tables']['betty_research_requests']['Row']
export type ClaireModePerformance = Database['public']['Views']['claire_mode_performance']['Row']

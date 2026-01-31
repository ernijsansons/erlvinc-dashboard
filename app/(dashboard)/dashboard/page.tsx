import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch quick stats
  const { data: projects } = await supabase
    .from('projects')
    .select('id')

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id')
    .eq('status', 'in_progress')

  const { data: escalations } = await supabase
    .from('escalations')
    .select('id')
    .eq('status', 'pending')

  const { data: trades } = await supabase
    .from('claire_trades')
    .select('id')
    .eq('status', 'open')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">ERLV Inc</h1>
        <p className="text-[#64748b] mt-2">AI-Powered Operating System</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={projects?.length || 0}
          icon="📁"
        />
        <StatCard
          title="In Progress"
          value={tasks?.length || 0}
          icon="⚙️"
        />
        <StatCard
          title="Pending Approvals"
          value={escalations?.length || 0}
          icon="📋"
        />
        <StatCard
          title="Open Trades"
          value={trades?.length || 0}
          icon="💰"
        />
      </div>

      {/* 4 Agents Grid */}
      <div className="grid grid-cols-4 gap-4">
        <AgentCard
          name="Janis"
          role="Senior Developer"
          emoji="🧑‍💻"
          status="working"
          taskCount={3}
          description="Oracle VM • Coding tasks"
        />
        <AgentCard
          name="Betty"
          role="Research Analyst"
          emoji="👩‍🔬"
          status="working"
          taskCount={1}
          description="GCP VM • Market research"
        />
        <AgentCard
          name="Claire"
          role="Trading Strategist"
          emoji="💼"
          status="waiting"
          taskCount={0}
          description="Polymarket • Signal generation"
        />
        <AgentCard
          name="Jon"
          role="Trade Executor"
          emoji="🎯"
          status="idle"
          taskCount={0}
          description="Trading ops • Executions"
        />
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#64748b]">
            System online. All agents operational.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: string
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="bg-[#111827] border-[#1e293b]">
      <CardContent className="p-6">
        <div className="text-3xl mb-2">{icon}</div>
        <p className="text-[#64748b] text-sm">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </CardContent>
    </Card>
  )
}

interface AgentCardProps {
  name: string
  role: string
  emoji: string
  status: 'working' | 'waiting' | 'idle' | 'offline'
  taskCount: number
  description: string
}

function AgentCard({
  name,
  role,
  emoji,
  status,
  taskCount,
  description,
}: AgentCardProps) {
  const statusColors = {
    working: 'bg-green-500/20 text-green-400',
    waiting: 'bg-yellow-500/20 text-yellow-400',
    idle: 'bg-blue-500/20 text-blue-400',
    offline: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <Card className="bg-[#111827] border-[#1e293b] hover:border-[#22d3ee]/50 cursor-pointer">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-4xl mb-2">{emoji}</p>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <p className="text-[#64748b] text-sm">{role}</p>
          </div>
          <Badge className={statusColors[status]}>
            {status}
          </Badge>
        </div>

        <div className="space-y-2 border-t border-[#1e293b] pt-4">
          <p className="text-[#64748b] text-xs">{description}</p>
          {taskCount > 0 && (
            <p className="text-[#22d3ee] font-semibold">
              {taskCount} active task{taskCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AgentsPage() {
  const agents = [
    {
      name: 'Janis',
      role: 'Senior Developer',
      emoji: '🧑‍💻',
      vm: 'Oracle VM',
      status: 'working',
      description: 'Handles development tasks, code reviews, and architecture decisions',
      stats: { completed: 45, active: 3, pending: 2 },
    },
    {
      name: 'Betty',
      role: 'Research Analyst',
      emoji: '👩‍🔬',
      vm: 'GCP VM',
      status: 'working',
      description: 'Conducts market research, competitor analysis, and opportunity validation',
      stats: { completed: 28, active: 1, pending: 0 },
    },
    {
      name: 'Claire',
      role: 'Trading Strategist',
      emoji: '💼',
      vm: 'Trading API',
      status: 'waiting',
      description: 'Manages Polymarket positions, signals, and A/B testing',
      stats: { completed: 156, active: 0, pending: 5 },
    },
    {
      name: 'Jon',
      role: 'Trade Executor',
      emoji: '🎯',
      vm: 'Executor Node',
      status: 'idle',
      description: 'Executes trades and manages operational tasks',
      stats: { completed: 234, active: 0, pending: 1 },
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Agents</h1>
        <p className="text-[#64748b] mt-2">AI-powered operating system agents</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.name} className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl mb-2">{agent.emoji}</div>
                  <CardTitle className="text-white">{agent.name}</CardTitle>
                  <p className="text-[#64748b] text-sm mt-1">{agent.role}</p>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  {agent.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[#64748b] text-sm mb-2">Infrastructure</p>
                <p className="text-white">{agent.vm}</p>
              </div>
              <div>
                <p className="text-[#64748b] text-sm mb-2">Description</p>
                <p className="text-white text-sm">{agent.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-[#1e293b] pt-4">
                <div>
                  <p className="text-[#64748b] text-xs">Completed</p>
                  <p className="text-white font-bold text-lg">{agent.stats.completed}</p>
                </div>
                <div>
                  <p className="text-[#64748b] text-xs">Active</p>
                  <p className="text-white font-bold text-lg">{agent.stats.active}</p>
                </div>
                <div>
                  <p className="text-[#64748b] text-xs">Pending</p>
                  <p className="text-white font-bold text-lg">{agent.stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

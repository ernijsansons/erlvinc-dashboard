import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const agentDetails = {
  janis: {
    name: 'Janis',
    emoji: '🧑‍💻',
    role: 'Senior Developer',
    bio: 'Senior developer AI. Codes features, fixes bugs, manages infrastructure.',
    model: 'MiniMax API',
    vmIP: '147.224.176.104',
    telegram: '@JanisDev_bot',
    commands: ['/code', '/status', '/pr', '/deploy'],
    currentTasks: 3,
    completedToday: 5,
    avgTime: '2.5 hours',
  },
  betty: {
    name: 'Betty',
    emoji: '👩‍🔬',
    role: 'Research Analyst',
    bio: 'Research AI. Analyzes markets, validates opportunities, supports Claire.',
    model: 'MiniMax API',
    vmIP: '35.212.201.93',
    telegram: '@BettyTheAdminBot',
    commands: ['/research', '/stocks', '/freight', '/personal'],
    currentTasks: 1,
    completedToday: 3,
    avgTime: '1.5 hours',
  },
  claire: {
    name: 'Claire Lilibeth',
    emoji: '💼',
    role: 'Trading Strategist',
    bio: 'Trading AI for Polymarket. Generates signals, manages portfolio risk.',
    model: 'MiniMax API',
    modes: ['Solo (fast)', 'Betty Collab (research-backed)'],
    strategies: ['Arbitrage', 'News Alpha', 'Whale Copy', 'Combinatorial', 'Liquidity', 'High Prob Bonds'],
    tradesToday: 12,
    winRate: '68%',
  },
  jon: {
    name: 'Jon',
    emoji: '🎯',
    role: 'Trade Executor',
    bio: 'Executes trades on Polymarket. Follows Claire signals.',
    model: 'API-based',
    executionRate: '99.8%',
    avgTime: '< 1 second',
    tradesTotal: 847,
  },
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agent = agentDetails[id as keyof typeof agentDetails]

  if (!agent) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <p className="text-6xl">{agent.emoji}</p>
        <div>
          <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
          <p className="text-[#64748b]">{agent.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#111827] border-[#1e293b] col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#64748b]">{agent.bio}</p>
          </CardContent>
        </Card>

        {/* Janis Stats */}
        {params.id === 'janis' && (
          <>
            <StatBox title="Current Tasks" value={agent.currentTasks} />
            <StatBox title="Completed Today" value={agent.completedToday} />
            <StatBox title="Average Time" value={agent.avgTime} />
            <StatBox title="Model" value={agent.model} />
          </>
        )}

        {/* Betty Stats */}
        {params.id === 'betty' && (
          <>
            <StatBox title="Current Tasks" value={agent.currentTasks} />
            <StatBox title="Completed Today" value={agent.completedToday} />
            <StatBox title="Average Time" value={agent.avgTime} />
            <StatBox title="Model" value={agent.model} />
          </>
        )}

        {/* Claire Stats */}
        {params.id === 'claire' && (
          <>
            <StatBox title="Trades Today" value={agent.tradesToday} />
            <StatBox title="Win Rate" value={agent.winRate} />
          </>
        )}

        {/* Jon Stats */}
        {params.id === 'jon' && (
          <>
            <StatBox title="Execution Rate" value={agent.executionRate} />
            <StatBox title="Avg Time" value={agent.avgTime} />
            <StatBox title="Total Trades" value={agent.tradesTotal} />
          </>
        )}
      </div>
    </div>
  )
}

function StatBox({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="bg-[#111827] border-[#1e293b]">
      <CardContent className="p-6">
        <p className="text-[#64748b] text-sm">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </CardContent>
    </Card>
  )
}

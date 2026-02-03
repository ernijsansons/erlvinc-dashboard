import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

const agents = [
  {
    id: 'janis',
    name: 'Janis',
    role: 'Senior Developer',
    emoji: '🧑‍💻',
    bio: 'Codes features and fixes bugs. Runs on Oracle VM. Uses MiniMax API.',
    specialties: ['Backend', 'Full-stack', 'Infrastructure'],
    status: 'working',
    vmIP: '147.224.176.104',
    telegram: '@JanisDev_bot',
    model: 'MiniMax',
  },
  {
    id: 'betty',
    name: 'Betty',
    role: 'Research Analyst',
    emoji: '👩‍🔬',
    bio: 'Deep market research and analysis. Supports Claire. Runs on GCP VM.',
    specialties: ['Market Research', 'Competitive Analysis', 'Trends'],
    status: 'working',
    vmIP: '35.212.201.93',
    telegram: '@BettyTheAdminBot',
    model: 'MiniMax',
  },
  {
    id: 'claire',
    name: 'Claire Lilibeth',
    role: 'Trading Strategist',
    emoji: '💼',
    bio: 'Generates trading signals for Polymarket. Can work solo or with Betty research.',
    specialties: ['Market Prediction', 'Signal Generation', 'Risk Management'],
    status: 'waiting',
    mode: 'Solo/Betty Collab',
    model: 'MiniMax',
  },
  {
    id: 'jon',
    name: 'Jon',
    role: 'Trade Executor',
    emoji: '🎯',
    bio: 'Executes trades on Polymarket based on Claire signals.',
    specialties: ['Trade Execution', 'Portfolio Management'],
    status: 'idle',
    model: 'API-based',
  },
]

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">🤖 Agents</h1>
        <p className="text-[#64748b] mt-2">4 AI agents managing ERLV operations</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {agents.map(agent => (
          <Link key={agent.id} href={`/dashboard/agents/${agent.id}`}>
            <Card className="bg-[#111827] border-[#1e293b] hover:border-[#22d3ee]/50 h-full cursor-pointer">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-5xl mb-3">{agent.emoji}</p>
                  <h3 className="text-white font-semibold text-xl">{agent.name}</h3>
                  <p className="text-[#64748b]">{agent.role}</p>
                </div>

                <p className="text-[#64748b] text-sm">{agent.bio}</p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map(specialty => (
                      <span key={specialty} className="px-2 py-1 bg-[#1e293b] text-[#64748b] text-xs rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#1e293b] pt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748b]">Status:</span>
                    <span className="text-white capitalize">{agent.status}</span>
                  </div>
                  {agent.vmIP && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748b]">VM:</span>
                      <span className="text-white font-mono text-xs">{agent.vmIP}</span>
                    </div>
                  )}
                  {agent.telegram && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748b]">Telegram:</span>
                      <span className="text-[#22d3ee]">{agent.telegram}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

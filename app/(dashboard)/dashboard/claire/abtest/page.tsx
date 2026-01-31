import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ClaireABTestPage() {
  const supabase = await createClient()

  const { data: performance } = await supabase
    .from('claire_mode_performance')
    .select('*')

  const performanceData = performance || [
    {
      mode: 'solo',
      strategy: 'arbitrage',
      total_trades: 45,
      winning_trades: 28,
      total_pnl: 1250.50,
      avg_pnl: 27.79,
      win_rate: 62.2,
    },
    {
      mode: 'betty_collab',
      strategy: 'arbitrage',
      total_trades: 38,
      winning_trades: 27,
      total_pnl: 1850.75,
      avg_pnl: 48.70,
      win_rate: 71.1,
    },
    {
      mode: 'solo',
      strategy: 'news_alpha',
      total_trades: 22,
      winning_trades: 11,
      total_pnl: 420.25,
      avg_pnl: 19.10,
      win_rate: 50.0,
    },
    {
      mode: 'betty_collab',
      strategy: 'news_alpha',
      total_trades: 19,
      winning_trades: 15,
      total_pnl: 950.80,
      avg_pnl: 50.04,
      win_rate: 78.9,
    },
  ]

  // Calculate strategy summaries
  const strategies = Array.from(new Set(performanceData.map((p: any) => p.strategy)))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">A/B Testing</h1>
        <p className="text-[#64748b] mt-2">Solo vs Betty Collaboration Performance</p>
      </div>

      {/* Strategy Comparison Cards */}
      {(strategies || []).map((strategy: any) => {
        const soloData = performanceData.find(
          (p: any) => p.strategy === strategy && p.mode === 'solo'
        )
        const collabData = performanceData.find(
          (p: any) => p.strategy === strategy && p.mode === 'betty_collab'
        )

        return (
          <Card key={strategy} className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white capitalize">{strategy}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Solo Mode */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Solo Mode</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Total Trades</p>
                      <p className="text-2xl font-bold text-white">{soloData?.total_trades || 0}</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Win Rate</p>
                      <p className="text-2xl font-bold text-white">{soloData?.win_rate?.toFixed(1) || 0}%</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Total P&L</p>
                      <p className={`text-2xl font-bold ${
                        (soloData?.total_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${(soloData?.total_pnl || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Avg P&L</p>
                      <p className={`text-2xl font-bold ${
                        (soloData?.avg_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${(soloData?.avg_pnl || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Collab Mode */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Betty Collaboration</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Total Trades</p>
                      <p className="text-2xl font-bold text-white">{collabData?.total_trades || 0}</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Win Rate</p>
                      <p className="text-2xl font-bold text-white">{collabData?.win_rate?.toFixed(1) || 0}%</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Total P&L</p>
                      <p className={`text-2xl font-bold ${
                        (collabData?.total_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${(collabData?.total_pnl || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b] text-sm mb-1">Avg P&L</p>
                      <p className={`text-2xl font-bold ${
                        (collabData?.avg_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${(collabData?.avg_pnl || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="mt-6 pt-6 border-t border-[#1e293b]">
                <p className="text-[#64748b] text-sm mb-3">Performance Delta</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[#64748b] mb-1">Win Rate Improvement</p>
                    <p className={`font-bold ${
                      ((collabData?.win_rate || 0) - (soloData?.win_rate || 0)) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {(((collabData?.win_rate || 0) - (soloData?.win_rate || 0)) >= 0 ? '+' : '')}
                      {((collabData?.win_rate || 0) - (soloData?.win_rate || 0)).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b] mb-1">P&L Improvement</p>
                    <p className={`font-bold ${
                      ((collabData?.total_pnl || 0) - (soloData?.total_pnl || 0)) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {(((collabData?.total_pnl || 0) - (soloData?.total_pnl || 0)) >= 0 ? '+' : '')}
                      ${((collabData?.total_pnl || 0) - (soloData?.total_pnl || 0)).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b] mb-1">Avg P&L per Trade</p>
                    <p className={`font-bold ${
                      ((collabData?.avg_pnl || 0) - (soloData?.avg_pnl || 0)) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {(((collabData?.avg_pnl || 0) - (soloData?.avg_pnl || 0)) >= 0 ? '+' : '')}
                      ${((collabData?.avg_pnl || 0) - (soloData?.avg_pnl || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

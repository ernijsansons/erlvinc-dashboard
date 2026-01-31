import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ClaireOverviewPage() {
  const supabase = await createClient()

  const { data: config } = await supabase
    .from('claire_config')
    .select('*')
    .single() as any

  const { data: trades } = await supabase
    .from('claire_trades')
    .select('*')
    .eq('status', 'open')
    .order('opened_at', { ascending: false })

  const { data: signals } = await supabase
    .from('claire_signals')
    .select('*')
    .eq('status', 'pending')
    .limit(5)
    .order('created_at', { ascending: false })

  // Calculate stats
  const totalPnL = (trades || []).reduce((sum: number, trade: any) => sum + (trade.pnl || 0), 0)
  const winRate = (trades || []).length > 0
    ? ((trades || []).filter((t: any) => (t.pnl || 0) > 0).length / (trades || []).length * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Claire</h1>
        <p className="text-[#64748b] mt-2">Polymarket Trading Interface</p>
      </div>

      {/* Status & Config */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[#64748b] text-sm">Operating Mode</p>
              <p className="text-white font-semibold capitalize">
                {config?.operating_mode || 'solo'}
              </p>
            </div>
            <div>
              <p className="text-[#64748b] text-sm">Trading Status</p>
              <p className={`font-semibold ${config?.is_active ? 'text-green-400' : 'text-red-400'}`}>
                {config?.is_active ? 'ACTIVE' : 'INACTIVE'}
              </p>
            </div>
            <div>
              <p className="text-[#64748b] text-sm">Shadow Mode</p>
              <p className="text-white font-semibold">
                {config?.shadow_mode ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-6">
            <p className="text-[#64748b] text-sm mb-2">Total P&L</p>
            <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${totalPnL.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-6">
            <p className="text-[#64748b] text-sm mb-2">Win Rate</p>
            <p className="text-3xl font-bold text-white">{winRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-6">
            <p className="text-[#64748b] text-sm mb-2">Open Positions</p>
            <p className="text-3xl font-bold text-white">{trades?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {(trades || []).length === 0 ? (
            <p className="text-[#64748b]">No open positions</p>
          ) : (
            <div className="space-y-2">
              {(trades || []).slice(0, 5).map((trade: any) => (
                <div key={trade.id} className="p-3 bg-[#0a0f1a] rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">{trade.market_id}</p>
                    <p className="text-[#64748b] text-sm">
                      {trade.position} • {trade.strategy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${(trade.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(trade.pnl || 0) >= 0 ? '+' : ''}{trade.pnl?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-[#64748b] text-sm">{(trade.shares || 0).toFixed(2)} shares</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Signals */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">Pending Signals</CardTitle>
        </CardHeader>
        <CardContent>
          {(signals || []).length === 0 ? (
            <p className="text-[#64748b]">No pending signals</p>
          ) : (
            <div className="space-y-2">
              {(signals || []).map((signal: any) => (
                <div key={signal.id} className="p-3 bg-[#0a0f1a] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">{signal.market_title || signal.market_id}</p>
                      <p className="text-[#64748b] text-sm">
                        {signal.strategy} • Confidence: {(signal.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-[#22d3ee]/20 text-[#22d3ee] text-xs rounded-full">
                      {signal.position}
                    </span>
                  </div>
                  {signal.reasoning && (
                    <p className="text-[#64748b] text-xs">{signal.reasoning.substring(0, 100)}...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

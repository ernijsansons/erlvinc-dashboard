import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ClaireSignalsPage() {
  const supabase = await createClient()

  const { data: signals } = await supabase
    .from('claire_signals')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Trade Signals</h1>
        <p className="text-[#64748b] mt-2">Signal history and performance</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select className="px-4 py-2 bg-[#111827] border border-[#1e293b] text-white rounded-lg text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="executed">Executed</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </select>
        <select className="px-4 py-2 bg-[#111827] border border-[#1e293b] text-white rounded-lg text-sm">
          <option value="">All Strategies</option>
          <option value="arbitrage">Arbitrage</option>
          <option value="news_alpha">News Alpha</option>
          <option value="whale_copy">Whale Copy</option>
          <option value="combinatorial">Combinatorial</option>
          <option value="liquidity">Liquidity</option>
          <option value="high_prob_bonds">High Prob Bonds</option>
        </select>
      </div>

      {/* Signals Table */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Market</th>
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Strategy</th>
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Position</th>
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Confidence</th>
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Mode</th>
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-[#64748b] font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {(signals || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#64748b]">
                      No signals yet
                    </td>
                  </tr>
                ) : (
                  (signals || []).map((signal: any) => (
                    <tr key={signal.id} className="border-b border-[#1e293b] hover:bg-[#0a0f1a]">
                      <td className="px-6 py-3 text-white font-semibold">{signal.market_title || signal.market_id}</td>
                      <td className="px-6 py-3 text-[#64748b] capitalize">{signal.strategy}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          signal.position === 'YES'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {signal.position}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-white">{(signal.confidence * 100).toFixed(0)}%</td>
                      <td className="px-6 py-3 text-[#64748b] capitalize">{signal.mode}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          signal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          signal.status === 'executed' ? 'bg-green-500/20 text-green-400' :
                          signal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-[#1e293b] text-[#64748b]'
                        }`}>
                          {signal.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[#64748b] text-xs">
                        {new Date(signal.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LabsPage() {
  const supabase = await createClient()

  const { data: opportunities } = await supabase
    .from('labs_opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  const stages = ['scanned', 'researching', 'review', 'discussion', 'approved']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">LABS</h1>
        <p className="text-[#64748b] mt-2">5-stage opportunity pipeline</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4 h-[600px]">
        {stages.map((stage) => {
          const stageOps = (opportunities || []).filter(
            (op: any) => op.status === stage
          )

          return (
            <div key={stage} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-4 py-2 bg-[#111827] rounded-lg border border-[#1e293b]">
                <h3 className="text-white font-semibold capitalize">{stage}</h3>
                <span className="text-[#64748b] text-sm">{stageOps.length}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {stageOps.length === 0 ? (
                  <div className="p-4 bg-[#111827]/50 border-2 border-dashed border-[#1e293b] rounded-lg">
                    <p className="text-[#64748b] text-xs text-center">No opportunities</p>
                  </div>
                ) : (
                  stageOps.map((op: any) => (
                    <Card
                      key={op.id}
                      className="bg-[#111827] border-[#1e293b] cursor-pointer hover:border-[#22d3ee]/50"
                    >
                      <CardContent className="p-4 space-y-2">
                        <h4 className="text-white text-sm font-semibold">{op.title}</h4>
                        {op.niche && (
                          <p className="text-[#64748b] text-xs">{op.niche}</p>
                        )}
                        {op.betty_recommendation && (
                          <div className="pt-2 border-t border-[#1e293b]">
                            <p className="text-xs">
                              <span className="text-[#64748b]">Betty:</span>{' '}
                              <span
                                className={
                                  op.betty_recommendation === 'GO'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }
                              >
                                {op.betty_recommendation}
                              </span>
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add New Opportunity Button */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardContent className="p-6 text-center">
          <button className="px-6 py-2 bg-[#22d3ee] text-black font-semibold rounded-lg hover:bg-[#22d3ee]/80">
            + Scan New Opportunity
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

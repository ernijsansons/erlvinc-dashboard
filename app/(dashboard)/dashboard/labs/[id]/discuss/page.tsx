import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DiscussionChat } from '@/components/labs/DiscussionChat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function LabsDiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: opportunity } = await supabase
    .from('labs_opportunities')
    .select('*')
    .eq('id', id)
    .single()

  if (!opportunity) {
    notFound()
  }

  const opp = opportunity as any // Type assertion to fix TypeScript narrowing issue

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{opp.title}</h1>
          <p className="text-[#64748b] mt-2">Strategic discussion with AI advisor</p>
        </div>
        {opp.betty_recommendation && (
          <Badge
            variant={opp.betty_recommendation === 'GO' ? 'default' : 'secondary'}
            className="text-sm"
          >
            Betty: {opp.betty_recommendation}
          </Badge>
        )}
      </div>

      {/* Opportunity Summary */}
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader>
          <CardTitle className="text-white">Opportunity Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {opp.niche && (
            <div>
              <p className="text-[#64748b] text-sm">Target Niche</p>
              <p className="text-white">{opp.niche}</p>
            </div>
          )}
          {opp.capability_unlock && (
            <div>
              <p className="text-[#64748b] text-sm">Capability Unlock</p>
              <p className="text-white">{opp.capability_unlock}</p>
            </div>
          )}
          {opp.initial_value_prop && (
            <div>
              <p className="text-[#64748b] text-sm">Value Proposition</p>
              <p className="text-white">{opp.initial_value_prop}</p>
            </div>
          )}
          {opp.betty_reasoning && (
            <div>
              <p className="text-[#64748b] text-sm">Betty's Analysis</p>
              <p className="text-white">{opp.betty_reasoning}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <DiscussionChat opportunityId={id} />
    </div>
  )
}

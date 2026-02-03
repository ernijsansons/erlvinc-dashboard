'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KanbanBoard, KanbanColumnConfig, KanbanItem } from '@/components/kanban'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const LABS_COLUMNS: KanbanColumnConfig[] = [
  { id: 'scanned', title: 'Scanned', icon: '🔍' },
  { id: 'researching', title: 'Researching', icon: '🔬' },
  { id: 'review', title: 'Review', icon: '👀' },
  { id: 'discussion', title: 'Discussion', icon: '💬' },
  { id: 'approved', title: 'Approved', icon: '✅' },
]

export default function LabsPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchOpportunities()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('labs-opportunities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'labs_opportunities',
        },
        () => {
          fetchOpportunities()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchOpportunities = async () => {
    const { data } = await supabase
      .from('labs_opportunities')
      .select('*')
      .order('created_at', { ascending: false })

    setOpportunities(data || [])
    setIsLoading(false)
  }

  const handleItemMove = async (itemId: string, fromColumn: string, toColumn: string) => {
    // Optimistic update
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === itemId ? { ...opp, status: toColumn } : opp
      )
    )

    // Update in database
    const updateData: Record<string, any> = {
      status: toColumn,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase
      .from('labs_opportunities')
      // @ts-ignore - Supabase type system issue
      .update(updateData)
      .eq('id', itemId)

    if (error) {
      console.error('Error updating opportunity:', error)
      // Revert on error
      fetchOpportunities()
    }
  }

  const handleItemClick = (item: KanbanItem) => {
    router.push(`/dashboard/labs/${item.id}/discuss`)
  }

  // Transform opportunities to Kanban items
  const kanbanItems: KanbanItem[] = opportunities.map(opp => ({
    id: opp.id,
    columnId: opp.status || 'scanned',
    title: opp.title,
    subtitle: opp.niche,
    badges: opp.betty_recommendation
      ? [{
          label: `Betty: ${opp.betty_recommendation}`,
          variant: opp.betty_recommendation === 'GO' ? 'default' : 'secondary' as const
        }]
      : undefined,
    metadata: opp.betty_confidence
      ? [{ label: 'Confidence', value: `${opp.betty_confidence}/10` }]
      : undefined
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">🔬 LABS</h1>
          <p className="text-[#64748b] mt-2">5-stage opportunity pipeline</p>
        </div>
        <Button
          className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80"
          onClick={() => {
            // TODO: Implement scan new opportunity
            alert('Scan new opportunity feature coming soon!')
          }}
        >
          + Scan New Opportunity
        </Button>
      </div>

      <KanbanBoard
        columns={LABS_COLUMNS}
        items={kanbanItems}
        onItemMove={handleItemMove}
        onItemClick={handleItemClick}
        isLoading={isLoading}
      />

      {!isLoading && opportunities.length === 0 && (
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-8 text-center">
            <p className="text-[#64748b] mb-4">
              No opportunities in the pipeline yet. Scan your first opportunity to get started.
            </p>
            <Button
              className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80"
              onClick={() => {
                alert('Scan new opportunity feature coming soon!')
              }}
            >
              Scan First Opportunity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

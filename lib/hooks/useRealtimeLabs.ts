import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LabsOpportunity } from '@/lib/types/database'

export function useRealtimeLabs() {
  const [opportunities, setOpportunities] = useState<LabsOpportunity[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    supabase
      .from('labs_opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOpportunities(data || []))

    // Subscribe
    const channel = supabase
      .channel('labs-opportunities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'labs_opportunities',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOpportunities(prev => [
              payload.new as LabsOpportunity,
              ...prev,
            ])
          } else if (payload.eventType === 'UPDATE') {
            setOpportunities(prev =>
              prev.map(o =>
                o.id === payload.new.id ? (payload.new as LabsOpportunity) : o
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setOpportunities(prev => prev.filter(o => o.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return opportunities
}

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AgentStatus {
  agent: string
  lastEvent: string
  timestamp: Date
  status: 'working' | 'waiting' | 'idle' | 'offline'
}

export function useRealtimeAgents() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { agent: 'janis', lastEvent: 'idle', timestamp: new Date(), status: 'idle' },
    { agent: 'betty', lastEvent: 'idle', timestamp: new Date(), status: 'idle' },
    { agent: 'claire', lastEvent: 'waiting', timestamp: new Date(), status: 'waiting' },
    { agent: 'jon', lastEvent: 'idle', timestamp: new Date(), status: 'idle' },
  ])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('agent-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_events',
        },
        (payload) => {
          const agent = payload.new.agent
          const eventType = payload.new.event_type

          setAgents(prev =>
            prev.map(a =>
              a.agent === agent
                ? {
                    ...a,
                    lastEvent: eventType,
                    timestamp: new Date(),
                    status: getStatusFromEvent(eventType),
                  }
                : a
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return agents
}

function getStatusFromEvent(
  eventType: string
): 'working' | 'waiting' | 'idle' | 'offline' {
  if (eventType.includes('start') || eventType.includes('progress')) {
    return 'working'
  }
  if (eventType.includes('escalation') || eventType.includes('approval')) {
    return 'waiting'
  }
  if (eventType.includes('complete')) {
    return 'idle'
  }
  return 'idle'
}

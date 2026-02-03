import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/lib/types/database'

export function useRealtimeTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    // Initial fetch
    query.then(({ data }) => {
      setTasks(data || [])
      setLoading(false)
    })

    // Subscribe to changes
    const channel = supabase
      .channel(`tasks${projectId ? `-${projectId}` : ''}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          ...(projectId && { filter: `project_id=eq.${projectId}` }),
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new as Task, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev =>
              prev.map(t => (t.id === payload.new.id ? (payload.new as Task) : t))
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  return { tasks, loading }
}

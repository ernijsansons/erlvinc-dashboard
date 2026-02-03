import { createClient } from '@/lib/supabase/server'
import { DomainView } from '@/components/domains/DomainView'

export default async function WorkPage() {
  const supabase = await createClient()

  // Fetch all projects and tasks for now
  // In the future, can filter by domain when added to schema
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const projectIds = (projects || []).map((p: any) => p.id)

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .in('project_id', projectIds.length > 0 ? projectIds : [''])
    .order('created_at', { ascending: false })

  return (
    <DomainView
      domain="work"
      emoji="💼"
      title="Work Projects"
      description="Software development, business operations, and professional tasks"
      projects={projects || []}
      tasks={tasks || []}
    />
  )
}

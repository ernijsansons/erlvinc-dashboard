import { createClient } from '@/lib/supabase/server'
import { DomainView } from '@/components/domains/DomainView'

export default async function PersonalPage() {
  const supabase = await createClient()

  // For now, return empty arrays
  // In the future, filter by domain field in projects table
  const projects: any[] = []
  const tasks: any[] = []

  return (
    <DomainView
      domain="personal"
      emoji="🌟"
      title="Personal Growth"
      description="Learning, health, hobbies, self-improvement, and personal development"
      projects={projects}
      tasks={tasks}
    />
  )
}

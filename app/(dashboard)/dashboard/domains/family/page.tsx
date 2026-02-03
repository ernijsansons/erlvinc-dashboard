import { createClient } from '@/lib/supabase/server'
import { DomainView } from '@/components/domains/DomainView'

export default async function FamilyPage() {
  const supabase = await createClient()

  // For now, return empty arrays
  // In the future, filter by domain field in projects table
  const projects: any[] = []
  const tasks: any[] = []

  return (
    <DomainView
      domain="family"
      emoji="❤️"
      title="Family & Relationships"
      description="Time with family, relationship goals, and personal connections"
      projects={projects}
      tasks={tasks}
    />
  )
}

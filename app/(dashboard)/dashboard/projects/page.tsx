import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')

  const projectList = (projects || []) as any[]
  const taskList = (tasks || []) as any[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">📁 Projects</h1>
        <p className="text-[#64748b] mt-2">Active projects and tasks</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projectList && projectList.length > 0 ? (
          projectList.map(project => {
            const projectTasks = taskList.filter(t => t.project_id === project.id) || []
            const statuses = ['backlog', 'todo', 'in_progress', 'review', 'done'] as const

            return (
              <Card key={project.id} className="bg-[#111827] border-[#1e293b]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{project.name}</CardTitle>
                      <p className="text-[#64748b] text-sm mt-1">{project.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-[#22d3ee]/20 text-[#22d3ee]">
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mini Stats */}
                  <div className="grid grid-cols-5 gap-2">
                    {statuses.map(status => {
                      const count = projectTasks.filter(t => t.status === status).length
                      return (
                        <div key={status} className="p-2 bg-[#0a0f1a] rounded text-center">
                          <p className="text-[#64748b] text-xs capitalize">{status}</p>
                          <p className="text-white font-semibold text-lg">{count}</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Task List */}
                  {projectTasks.length > 0 && (
                    <div className="pt-4 border-t border-[#1e293b]">
                      <p className="text-[#64748b] text-sm mb-2">{projectTasks.length} total tasks</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardContent className="p-8 text-center">
              <p className="text-[#64748b]">No projects yet. Create one to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

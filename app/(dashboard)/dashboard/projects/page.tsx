import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')

  const projectsList = projects || [
    {
      id: 'demo-1',
      name: 'Claude Code IDE Integration',
      description: 'Integrate Claude AI with code editors',
      primary_agent: 'Janis',
      status: 'in_progress',
      tasks_total: 12,
      tasks_done: 7,
    },
    {
      id: 'demo-2',
      name: 'Real-time Market Analysis',
      description: 'Betty research automation system',
      primary_agent: 'Betty',
      status: 'in_progress',
      tasks_total: 8,
      tasks_done: 5,
    },
    {
      id: 'demo-3',
      name: 'Polymarket Trading Bot',
      description: 'Automated prediction market trading',
      primary_agent: 'Claire',
      status: 'active',
      tasks_total: 20,
      tasks_done: 15,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Projects</h1>
        <p className="text-[#64748b] mt-2">Multi-project management kanban</p>
      </div>

      <div className="space-y-4">
        {projectsList.map((project: any) => (
          <Card key={project.id} className="bg-[#111827] border-[#1e293b]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{project.name}</CardTitle>
                  <p className="text-[#64748b] text-sm mt-1">{project.description}</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                  {project.status || 'active'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[#64748b] text-xs mb-2">Primary Agent</p>
                  <p className="text-white">{project.primary_agent || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-[#64748b] text-xs mb-2">Progress</p>
                  <div className="w-full bg-[#0a0f1a] rounded-full h-2">
                    <div
                      className="bg-[#22d3ee] h-2 rounded-full"
                      style={{
                        width: `${((project.tasks_done || 0) / (project.tasks_total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-white text-sm mt-1">
                    {project.tasks_done || 0} / {project.tasks_total || 0} tasks
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b] text-xs mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-white">Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

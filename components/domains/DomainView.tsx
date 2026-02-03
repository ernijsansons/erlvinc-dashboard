import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DomainViewProps {
  domain: string
  emoji: string
  title: string
  description: string
  projects: any[]
  tasks: any[]
}

export function DomainView({
  domain,
  emoji,
  title,
  description,
  projects,
  tasks,
}: DomainViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {emoji} {title}
        </h1>
        <p className="text-[#64748b] mt-2">{description}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-6">
            <p className="text-[#64748b] text-sm">Total Projects</p>
            <p className="text-3xl font-bold text-white mt-2">
              {projects.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-6">
            <p className="text-[#64748b] text-sm">Active Tasks</p>
            <p className="text-3xl font-bold text-white mt-2">
              {tasks.filter(t => t.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-6">
            <p className="text-[#64748b] text-sm">Completed</p>
            <p className="text-3xl font-bold text-white mt-2">
              {tasks.filter(t => t.status === 'done').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <div className="grid grid-cols-2 gap-4">
            {projects.map(project => (
              <Card key={project.id} className="bg-[#111827] border-[#1e293b]">
                <CardHeader>
                  <CardTitle className="text-white">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-[#64748b] text-sm mb-3">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#1e293b] text-[#64748b] text-xs rounded capitalize">
                      {project.status}
                    </span>
                    {project.primary_agent && (
                      <span className="px-2 py-1 bg-[#22d3ee]/20 text-[#22d3ee] text-xs rounded capitalize">
                        {project.primary_agent}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
          <Card className="bg-[#111827] border-[#1e293b]">
            <CardContent className="p-0">
              <div className="divide-y divide-[#1e293b]">
                {tasks.slice(0, 10).map(task => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-[#0a0f1a]">
                    <div className="flex-1">
                      <p className="text-white font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-[#64748b] text-sm mt-1">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#1e293b] text-[#64748b] text-xs rounded capitalize">
                        {task.status}
                      </span>
                      {task.assigned_agent && (
                        <span className="px-2 py-1 bg-[#22d3ee]/20 text-[#22d3ee] text-xs rounded">
                          {task.assigned_agent}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Content */}
      {projects.length === 0 && tasks.length === 0 && (
        <Card className="bg-[#111827] border-[#1e293b]">
          <CardContent className="p-8 text-center">
            <p className="text-[#64748b]">
              No projects or tasks in this domain yet. This domain is ready for your content!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

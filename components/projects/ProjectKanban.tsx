'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Task {
  id: string
  title: string
  status: string
  priority: number
  assigned_agent: string | null
}

interface ProjectKanbanProps {
  tasks: Task[]
}

const statusColumns = [
  { key: 'backlog', title: 'Backlog', icon: '📦' },
  { key: 'todo', title: 'To Do', icon: '📝' },
  { key: 'in_progress', title: 'In Progress', icon: '⚙️' },
  { key: 'review', title: 'Review', icon: '👀' },
  { key: 'done', title: 'Done', icon: '✅' },
]

export function ProjectKanban({ tasks }: ProjectKanbanProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {statusColumns.map(column => {
        const columnTasks = tasks.filter(t => t.status === column.key)
        return (
          <div key={column.key} className="space-y-3">
            <Card className="bg-[#111827] border-[#1e293b]">
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <span>{column.icon}</span>
                  {column.title}
                  <Badge variant="secondary" className="ml-auto bg-[#1e293b]">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="space-y-3">
              {columnTasks.map(task => (
                <Card key={task.id} className="bg-[#0a0f1a] border-[#1e293b]">
                  <CardContent className="p-3 space-y-2">
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    {task.assigned_agent && (
                      <Badge variant="secondary" className="text-xs bg-[#1e293b]">
                        {task.assigned_agent}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

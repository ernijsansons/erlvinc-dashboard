'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KanbanCard } from './KanbanCard'
import { KanbanItem } from './KanbanBoard'

interface KanbanColumnProps {
  id: string
  title: string
  icon?: string
  count: number
  items: KanbanItem[]
  onItemClick?: (item: KanbanItem) => void
}

export function KanbanColumn({
  id,
  title,
  icon,
  count,
  items,
  onItemClick
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col space-y-2 transition-all ${
        isOver ? 'opacity-50' : ''
      }`}
    >
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
            <Badge variant="secondary" className="ml-auto bg-[#1e293b]">
              {count}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="flex-1 space-y-3 min-h-[200px]">
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <div className="p-4 border-2 border-dashed border-[#1e293b] rounded-lg">
              <p className="text-[#64748b] text-xs text-center">
                Drop items here
              </p>
            </div>
          ) : (
            items.map(item => (
              <KanbanCard
                key={item.id}
                {...item}
                onClick={onItemClick ? () => onItemClick(item) : undefined}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

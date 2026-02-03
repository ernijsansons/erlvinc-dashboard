'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface KanbanCardProps {
  id: string
  title: string
  subtitle?: string
  badges?: Array<{ label: string; variant?: 'default' | 'secondary' | 'outline' }>
  metadata?: Array<{ label: string; value: string }>
  onClick?: () => void
}

export function KanbanCard({
  id,
  title,
  subtitle,
  badges,
  metadata,
  onClick
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        className="bg-[#0a0f1a] border-[#1e293b] hover:border-[#22d3ee]/50 cursor-grab active:cursor-grabbing"
        onClick={onClick}
      >
        <CardContent className="p-3 space-y-2">
          <h4 className="text-white text-sm font-semibold line-clamp-2">
            {title}
          </h4>

          {subtitle && (
            <p className="text-[#64748b] text-xs line-clamp-1">
              {subtitle}
            </p>
          )}

          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {badges.map((badge, idx) => (
                <Badge
                  key={idx}
                  variant={badge.variant || 'secondary'}
                  className="text-xs"
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}

          {metadata && metadata.length > 0 && (
            <div className="pt-2 border-t border-[#1e293b] space-y-1">
              {metadata.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-[#64748b]">{item.label}:</span>
                  <span className="text-white">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
